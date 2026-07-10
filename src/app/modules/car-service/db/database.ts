import Dexie, { type EntityTable } from 'dexie';
import type { Car, ServiceRecord } from '../types';

export class CarServiceDatabase extends Dexie {
	cars!: EntityTable<Car, 'id'>;
	records!: EntityTable<ServiceRecord, 'id'>;

	constructor() {
		super('CarServiceDB');

		this.version(1).stores({
			cars: '++id, name, isDefault, createdAt',
			records: '++id, carId, type, date, mileage, createdAt',
		});
	}
}

export const db = new CarServiceDatabase();
