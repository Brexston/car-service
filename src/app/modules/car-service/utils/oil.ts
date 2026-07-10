import type { Car, OilInfo, OilStatus, ServiceRecord } from '../types';

const SOON_THRESHOLD_KM = 2000;

export function getLastOilRecord(records: ServiceRecord[]): ServiceRecord | null {
	const oilRecords = records
		.filter(r => r.type === 'oil')
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return oilRecords[0] ?? null;
}

export function getNextOilMileage(
	lastOil: ServiceRecord | null,
	car: Car,
): number {
	const baseMileage = lastOil?.mileage ?? car.purchaseMileage;
	return baseMileage + car.oilInterval;
}

export function getOilStatus(currentMileage: number, nextOilMileage: number): OilStatus {
	const remaining = nextOilMileage - currentMileage;

	if (remaining < 0)
		return 'overdue';

	if (remaining <= SOON_THRESHOLD_KM)
		return 'soon';

	return 'ok';
}

export function formatOilLabel(remaining: number): string {
	if (remaining >= 0)
		return `Осталось ${remaining.toLocaleString('ru-RU')} км`;

	return `Просрочено на ${Math.abs(remaining).toLocaleString('ru-RU')} км`;
}

export function getOilInfo(car: Car, records: ServiceRecord[]): OilInfo {
	const lastOil = getLastOilRecord(records);
	const nextOilMileage = getNextOilMileage(lastOil, car);
	const remaining = nextOilMileage - car.currentMileage;
	const status = getOilStatus(car.currentMileage, nextOilMileage);

	return {
		lastOilMileage: lastOil?.mileage ?? null,
		nextOilMileage,
		remaining,
		status,
		label: formatOilLabel(remaining),
	};
}

export function getNextActionLabel(oilInfo: OilInfo): string {
	if (oilInfo.remaining >= 0)
		return `Через ${oilInfo.remaining.toLocaleString('ru-RU')} км заменить масло`;

	return `Просрочена замена масла на ${Math.abs(oilInfo.remaining).toLocaleString('ru-RU')} км`;
}
