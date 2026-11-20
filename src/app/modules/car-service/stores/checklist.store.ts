import type { ChecklistItem } from '../types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { db } from '../db/database';
import { useCarsStore } from './cars.store';

function isRoot(item: ChecklistItem): boolean {
	return item.parentId == null;
}

function sortByOrder(items: ChecklistItem[]): ChecklistItem[] {
	return [...items].sort((a, b) => a.order - b.order);
}

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
			.filter(item => isRoot(item) && !item.done)
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

	function getRoots(carId: number): ChecklistItem[] {
		return sortChecklist(items.value.filter(item => item.carId === carId && isRoot(item)));
	}

	function getChildren(parentId: number): ChecklistItem[] {
		return sortByOrder(items.value.filter(item => item.parentId === parentId));
	}

	function hasChildren(parentId: number): boolean {
		return items.value.some(item => item.parentId === parentId);
	}

	async function nextOrderAmong(siblings: ChecklistItem[]) {
		if (siblings.length === 0)
			return 0;
		return Math.max(...siblings.map(item => item.order)) + 1;
	}

	async function nextRootOrder(carId: number) {
		return nextOrderAmong(items.value.filter(item => item.carId === carId && isRoot(item)));
	}

	async function syncParentDone(parentId: number) {
		const children = items.value.filter(item => item.parentId === parentId);
		if (children.length === 0)
			return;

		const done = children.every(child => child.done);
		const parent = items.value.find(item => item.id === parentId);
		if (!parent || parent.done === done)
			return;

		const patch: Partial<ChecklistItem> = { done };
		if (!done)
			patch.order = await nextRootOrder(parent.carId);

		await db.checklistItems.update(parentId, patch);
	}

	async function add(carId: number, title: string) {
		const trimmed = title.trim();
		if (!trimmed)
			return;

		await db.checklistItems.add({
			carId,
			title: trimmed,
			done: false,
			order: await nextRootOrder(carId),
			createdAt: new Date().toISOString(),
			parentId: null,
		});
		await load();
	}

	async function addChild(parentId: number, title: string) {
		const trimmed = title.trim();
		if (!trimmed)
			return;

		const parent = items.value.find(item => item.id === parentId);
		if (!parent || !isRoot(parent))
			return;

		const siblings = items.value.filter(item => item.parentId === parentId);

		await db.checklistItems.add({
			carId: parent.carId,
			title: trimmed,
			done: false,
			order: await nextOrderAmong(siblings),
			createdAt: new Date().toISOString(),
			parentId,
		});

		if (parent.done)
			await db.checklistItems.update(parentId, { done: false, order: await nextRootOrder(parent.carId) });

		await load();
	}

	async function toggle(id: number) {
		const item = items.value.find(i => i.id === id);
		if (!item)
			return;

		if (isRoot(item) && hasChildren(id))
			return;

		const done = !item.done;
		const patch: Partial<ChecklistItem> = { done };
		if (!done) {
			if (isRoot(item))
				patch.order = await nextRootOrder(item.carId);
			else if (item.parentId != null)
				patch.order = await nextOrderAmong(getChildren(item.parentId).filter(c => c.id !== id));
		}

		await db.checklistItems.update(id, patch);

		if (item.parentId != null) {
			items.value = await db.checklistItems.toArray();
			await syncParentDone(item.parentId);
		}

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
		const item = items.value.find(i => i.id === id);
		if (!item)
			return;

		await db.transaction('rw', db.checklistItems, async () => {
			if (isRoot(item)) {
				const childIds = items.value
					.filter(child => child.parentId === id)
					.map(child => child.id!)
					.filter(Boolean);
				if (childIds.length > 0)
					await db.checklistItems.bulkDelete(childIds);
			}

			await db.checklistItems.delete(id);

			if (item.parentId != null) {
				const siblings = await db.checklistItems
					.where('parentId')
					.equals(item.parentId)
					.toArray() as ChecklistItem[];
				const done = siblings.length > 0 && siblings.every(child => child.done);
				const parent = await db.checklistItems.get(item.parentId);
				if (parent && parent.done !== done) {
					const patch: Partial<ChecklistItem> = { done };
					if (!done) {
						const roots = (await db.checklistItems
							.where('carId')
							.equals(parent.carId)
							.toArray() as ChecklistItem[])
							.filter(r => r.parentId == null && r.id !== parent.id);
						patch.order = roots.length === 0
							? 0
							: Math.max(...roots.map(r => r.order)) + 1;
					}
					await db.checklistItems.update(item.parentId, patch);
				}
			}
		});
		await load();
	}

	return {
		items,
		loading,
		openItems,
		load,
		getByCar,
		getRoots,
		getChildren,
		hasChildren,
		add,
		addChild,
		toggle,
		reorder,
		remove,
	};
});
