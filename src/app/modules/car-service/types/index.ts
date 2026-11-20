export type RecordType = 'oil' | 'filter' | 'repair' | 'other';

export interface Car {
	id?: number;
	name: string;
	purchaseDate: string;
	purchaseMileage: number;
	currentMileage: number;
	oilInterval: number;
	isDefault: boolean;
	createdAt: string;
}

export interface ServiceRecord {
	id?: number;
	carId: number;
	type: RecordType;
	date: string;
	mileage: number;
	comment: string;
	createdAt: string;
}

export interface ChecklistItem {
	id?: number;
	carId: number;
	title: string;
	done: boolean;
	order: number;
	createdAt: string;
	parentId?: number | null;
}

export interface BackupData {
	version: number;
	exportedAt: string;
	cars: Car[];
	records: ServiceRecord[];
	checklistItems?: ChecklistItem[];
}

export type OilStatus = 'ok' | 'soon' | 'overdue';

export interface OilInfo {
	lastOilMileage: number | null;
	nextOilMileage: number;
	remaining: number;
	status: OilStatus;
	label: string;
}

export const RECORD_TYPE_LABELS: Record<RecordType, string> = {
	oil: 'Масло',
	filter: 'Фильтр',
	repair: 'Ремонт',
	other: 'Другое',
};

export const DEFAULT_OIL_INTERVAL = 8000;
export const APP_VERSION = '1.0.0';
