import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { db } from '../db/database';
import type { Car, ServiceRecord } from '../types';
import { DEFAULT_OIL_INTERVAL } from '../types';
import { getOilInfo } from '../utils/oil';
import { toInputDate } from '../utils/date';

export const useCarsStore = defineStore('cars', () => {
	const cars = ref<Car[]>([]);
	const recordsByCar = ref<Map<number, ServiceRecord[]>>(new Map());
	const loading = ref(false);
	const selectedCarId = ref<number | null>(null);

	const defaultCar = computed(() => cars.value.find(c => c.isDefault) ?? cars.value[0] ?? null);

	const carsWithOil = computed(() => cars.value.map((car) => {
		const records = recordsByCar.value.get(car.id!) ?? [];
		return { car, oilInfo: getOilInfo(car, records) };
	}));

	async function loadCars() {
		loading.value = true;
		try {
			cars.value = await db.cars.orderBy('createdAt').reverse().toArray();
			const allRecords = await db.records.toArray();
			const map = new Map<number, ServiceRecord[]>();

			for (const record of allRecords) {
				const list = map.get(record.carId) ?? [];
				list.push(record);
				map.set(record.carId, list);
			}

			recordsByCar.value = map;

			if (!selectedCarId.value && defaultCar.value)
				selectedCarId.value = defaultCar.value.id!;
		}
		finally {
			loading.value = false;
		}
	}

	function getCarRecords(carId: number): ServiceRecord[] {
		return (recordsByCar.value.get(carId) ?? [])
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}

	function getCarOilInfo(carId: number) {
		const car = cars.value.find(c => c.id === carId);
		if (!car)
			return null;

		return getOilInfo(car, getCarRecords(carId));
	}

	async function addCar(data: {
		name: string;
		purchaseDate: string;
		purchaseMileage: number;
		oilInterval?: number;
	}) {
		const isFirst = cars.value.length === 0;

		const car: Car = {
			name: data.name.trim(),
			purchaseDate: data.purchaseDate,
			purchaseMileage: data.purchaseMileage,
			currentMileage: data.purchaseMileage,
			oilInterval: data.oilInterval ?? DEFAULT_OIL_INTERVAL,
			isDefault: isFirst,
			createdAt: new Date().toISOString(),
		};

		const id = await db.cars.add(car);
		await loadCars();
		return id;
	}

	async function updateCar(id: number, data: Partial<Car>) {
		await db.cars.update(id, data);
		await loadCars();
	}

	async function setDefaultCar(id: number) {
		await db.transaction('rw', db.cars, async () => {
			await db.cars.toCollection().modify({ isDefault: false });
			await db.cars.update(id, { isDefault: true });
		});
		await loadCars();
	}

	async function deleteCar(id: number) {
		await db.transaction('rw', [db.cars, db.records], async () => {
			await db.records.where('carId').equals(id).delete();
			await db.cars.delete(id);
		});
		await loadCars();
	}

	async function updateMileageIfGreater(carId: number, mileage: number) {
		const car = cars.value.find(c => c.id === carId);
		if (!car || mileage <= car.currentMileage)
			return;

		await db.cars.update(carId, { currentMileage: mileage });
		await loadCars();
	}

	async function clearAll() {
		await db.transaction('rw', [db.cars, db.records], async () => {
			await db.cars.clear();
			await db.records.clear();
		});
		cars.value = [];
		recordsByCar.value = new Map();
		selectedCarId.value = null;
	}

	async function importData(carsData: Car[], recordsData: ServiceRecord[]) {
		await clearAll();
		await db.transaction('rw', [db.cars, db.records], async () => {
			for (const car of carsData) {
				const { id: _id, ...rest } = car;
				await db.cars.add(rest);
			}
			const newCars = await db.cars.toArray();
			const idMap = new Map<number, number>();

			carsData.forEach((oldCar, index) => {
				if (oldCar.id !== undefined && newCars[index]?.id !== undefined)
					idMap.set(oldCar.id, newCars[index]!.id!);
			});

			for (const record of recordsData) {
				const { id: _id, carId: oldCarId, ...rest } = record;
				const newCarId = idMap.get(oldCarId);
				if (newCarId !== undefined)
					await db.records.add({ ...rest, carId: newCarId });
			}
		});
		await loadCars();
	}

	function createDefaultCarForm() {
		return {
			name: '',
			purchaseDate: toInputDate(),
			purchaseMileage: 0,
			oilInterval: DEFAULT_OIL_INTERVAL,
		};
	}

	return {
		cars,
		carsWithOil,
		loading,
		selectedCarId,
		defaultCar,
		loadCars,
		getCarRecords,
		getCarOilInfo,
		addCar,
		updateCar,
		setDefaultCar,
		deleteCar,
		updateMileageIfGreater,
		clearAll,
		importData,
		createDefaultCarForm,
	};
});
