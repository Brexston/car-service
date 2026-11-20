import type { ChecklistItem } from '../types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { db } from '../db/database';
import { useCarsStore } from './cars.store';

function sortChecklist(items: ChecklistItem[]): ChecklistItem[] {
	return [...items].sort((a, b) => {
		if (a.done !== b.done)
			return a.done ? 1 : -1;

		return a.order - b.order;
	});
}

export const useChecklistStore = defineStore('checklist', () => {
	const items = ref<ChecklistItem[]>([]);
	const loading = ref(false);

	const openItems = computed(() => {
		const carsStore = useCarsStore();
		return items.value
			.filter(item => !item.done)
			.map((item) => {
				const car = carsStore.cars.find(c => c.id === item.carId);
				return { item, carName: car?.name ?? 'Автомобиль' };
			})
			.sort((a, b) => a.carName.localeCompare(b.carName, 'ru')
				|| a.item.order - b.item.order);
	});

	async function load() {
		loading.value = true;
		try {
			items.value = await db.checklistItems.toArray();
		}
		finally {
			loading.value = false;
		}
	}

	function getByCar(carId: number): ChecklistItem[] {
		return sortChecklist(items.value.filter(item => item.carId === carId));
	}

	async function nextOrder(carId: number) {
		const carItems = items.value.filter(item => item.carId === carId);
		if (carItems.length === 0)
			return 0;
		return Math.max(...carItems.map(item => item.order)) + 1;
	}

	async function add(carId: number, title: string) {
		const trimmed = title.trim();
		if (!trimmed)
			return;

		await db.checklistItems.add({
			carId,
			title: trimmed,
			done: false,
			order: await nextOrder(carId),
			createdAt: new Date().toISOString(),
		});
		await load();
	}

	async function toggle(id: number) {
		const item = items.value.find(i => i.id === id);
		if (!item)
			return;

		const done = !item.done;
		const patch: Partial<ChecklistItem> = { done };
		if (!done)
			patch.order = await nextOrder(item.carId);

		await db.checklistItems.update(id, patch);
		await load();
	}

	async function reorder(_carId: number, orderedIds: number[]) {
		await db.transaction('rw', db.checklistItems, async () => {
			await Promise.all(orderedIds.map((id, index) =>
				db.checklistItems.update(id, { order: index }),
			));
		});
		await load();
	}

	async function remove(id: number) {
		await db.checklistItems.delete(id);
		await load();
	}

	return {
		items,
		loading,
		openItems,
		load,
		getByCar,
		add,
		toggle,
		reorder,
		remove,
	};
});
