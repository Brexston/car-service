import type { EntityTable } from 'dexie';
import type { Car, ChecklistItem, ServiceRecord } from '../types';
import Dexie from 'dexie';

export class CarServiceDatabase extends Dexie {
	cars!: EntityTable<Car, 'id'>;
	records!: EntityTable<ServiceRecord, 'id'>;
	checklistItems!: EntityTable<ChecklistItem, 'id'>;

	constructor() {
		super('CarServiceDB');

		this.version(1).stores({
			cars: '++id, name, isDefault, createdAt',
			records: '++id, carId, type, date, mileage, createdAt',
		});

		this.version(2).stores({
			cars: '++id, name, isDefault, createdAt',
			records: '++id, carId, type, date, mileage, createdAt',
			checklistItems: '++id, carId, done, createdAt',
		});
	}
}

export const db = new CarServiceDatabase();
