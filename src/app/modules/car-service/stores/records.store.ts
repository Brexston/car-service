import { defineStore } from 'pinia';
import { db } from '../db/database';
import type { RecordType, ServiceRecord } from '../types';
import { useCarsStore } from './cars.store';

export const useRecordsStore = defineStore('records', () => {
	const carsStore = useCarsStore();

	async function addRecord(data: {
		carId: number;
		type: RecordType;
		date: string;
		mileage: number;
		comment: string;
	}) {
		const record: ServiceRecord = {
			carId: data.carId,
			type: data.type,
			date: data.date,
			mileage: data.mileage,
			comment: data.comment.trim(),
			createdAt: new Date().toISOString(),
		};

		const id = await db.records.add(record);
		await carsStore.updateMileageIfGreater(data.carId, data.mileage);
		await carsStore.loadCars();
		return id;
	}

	async function updateRecord(id: number, data: Partial<ServiceRecord>) {
		const existing = await db.records.get(id);
		if (!existing)
			return;

		await db.records.update(id, data);
		const updated = await db.records.get(id);

		if (updated && data.mileage !== undefined)
			await carsStore.updateMileageIfGreater(updated.carId, updated.mileage);

		await carsStore.loadCars();
	}

	async function deleteRecord(id: number) {
		await db.records.delete(id);
		await carsStore.loadCars();
	}

	return {
		addRecord,
		updateRecord,
		deleteRecord,
	};
});
