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

		this.version(3).stores({
			cars: '++id, name, isDefault, createdAt',
			records: '++id, carId, type, date, mileage, createdAt',
			checklistItems: '++id, carId, done, createdAt, order',
		}).upgrade(async (tx) => {
			const table = tx.table('checklistItems');
			const items = await table.toArray() as ChecklistItem[];
			const byCar = new Map<number, ChecklistItem[]>();

			for (const item of items) {
				const list = byCar.get(item.carId) ?? [];
				list.push(item);
				byCar.set(item.carId, list);
			}

			for (const carItems of byCar.values()) {
				carItems.sort((a, b) => {
					if (a.done !== b.done)
						return a.done ? 1 : -1;
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				});

				await Promise.all(carItems.map((item, index) =>
					table.update(item.id!, { order: index }),
				));
			}
		});
	}
}

export const db = new CarServiceDatabase();
