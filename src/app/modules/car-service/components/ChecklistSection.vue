<script setup lang="ts">
import type { ChecklistItem } from '../types';
import { Check, ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from '@lucide/vue';
import { useSortable } from '@vueuse/integrations/useSortable';
import { computed, onMounted, ref, watch } from 'vue';
import { useChecklistStore } from '../stores/checklist.store';

interface Props {
	carId: number;
}

const { carId } = defineProps<Props>();

const checklistStore = useChecklistStore();
const newTitle = ref('');
const adding = ref(false);
const openListEl = ref<HTMLElement | null>(null);
const openList = ref<ChecklistItem[]>([]);
const expandedIds = ref<Set<number>>(new Set());
const childDrafts = ref<Record<number, string>>({});
const addingChildId = ref<number | null>(null);

const roots = computed(() => checklistStore.getRoots(carId));
const doneItems = computed(() => roots.value.filter(item => item.done));

watch(
	roots,
	(list) => {
		openList.value = list.filter(item => !item.done);
	},
	{ immediate: true },
);

useSortable(openListEl, openList, {
	handle: '.drag-handle',
	animation: 150,
	watchElement: true,
	onUpdate: async () => {
		await checklistStore.reorder(
			carId,
			openList.value.map(item => item.id!),
		);
	},
});

onMounted(() => checklistStore.load());

function childrenOf(parentId: number) {
	return checklistStore.getChildren(parentId);
}

function isZone(item: ChecklistItem) {
	return item.id != null && checklistStore.hasChildren(item.id);
}

function progress(parentId: number) {
	const children = childrenOf(parentId);
	const doneCount = children.filter(child => child.done).length;
	return { doneCount, total: children.length };
}

function isExpanded(id: number) {
	return expandedIds.value.has(id);
}

function toggleExpand(id: number) {
	const next = new Set(expandedIds.value);
	if (next.has(id))
		next.delete(id);
	else
		next.add(id);
	expandedIds.value = next;
}

function ensureExpanded(id: number) {
	if (!expandedIds.value.has(id)) {
		const next = new Set(expandedIds.value);
		next.add(id);
		expandedIds.value = next;
	}
}

async function addItem() {
	if (!newTitle.value.trim() || adding.value)
		return;

	adding.value = true;
	try {
		await checklistStore.add(carId, newTitle.value);
		newTitle.value = '';
	}
	finally {
		adding.value = false;
	}
}

async function addChild(parentId: number) {
	const draft = (childDrafts.value[parentId] ?? '').trim();
	if (!draft || addingChildId.value === parentId)
		return;

	addingChildId.value = parentId;
	try {
		await checklistStore.addChild(parentId, draft);
		childDrafts.value = { ...childDrafts.value, [parentId]: '' };
		ensureExpanded(parentId);
	}
	finally {
		addingChildId.value = null;
	}
}

async function toggleItem(id: number) {
	await checklistStore.toggle(id);
}

async function removeItem(id: number) {
	await checklistStore.remove(id);
}
</script>

<template>
	<section>
		<h2 class="text-sm font-semibold text-ios-muted uppercase tracking-wide mb-2.5 px-1">
			Чеклист
		</h2>

		<div class="ios-card overflow-hidden mb-2">
			<div
				v-if="openList.length > 0"
				ref="openListEl"
			>
				<div
					v-for="(item, index) in openList"
					:key="item.id"
					:class="(index < openList.length - 1 || doneItems.length > 0) && 'hairline-b'"
				>
					<div class="flex items-center gap-2 px-3 py-3">
						<button
							type="button"
							class="drag-handle btn-reset shrink-0 p-1 text-ios-muted touch-none cursor-grab active:cursor-grabbing"
							aria-label="Перетащить"
						>
							<GripVertical :size="16" />
						</button>

						<button
							v-if="isZone(item)"
							type="button"
							class="btn-reset shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center border-ios-muted opacity-60"
							:class="item.done && 'border-ios-green bg-ios-green text-white opacity-100'"
							aria-label="Состояние зоны"
							@click="toggleExpand(item.id!)"
						>
							<Check
								v-if="item.done"
								:size="14"
								:stroke-width="3"
							/>
						</button>
						<button
							v-else
							type="button"
							class="btn-reset shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-opacity active:opacity-60 border-ios-muted"
							aria-label="Отметить выполненным"
							@click="toggleItem(item.id!)"
						/>

						<button
							type="button"
							class="btn-reset flex-1 min-w-0 text-left flex items-center gap-2"
							@click="toggleExpand(item.id!)"
						>
							<span class="flex-1 min-w-0 text-ios-text leading-snug">
								{{ item.title }}
							</span>
							<span
								v-if="isZone(item)"
								class="shrink-0 text-xs text-ios-muted tabular-nums"
							>
								{{ progress(item.id!).doneCount }}/{{ progress(item.id!).total }}
							</span>
							<span class="shrink-0 text-ios-muted">
								<ChevronDown
									v-if="isExpanded(item.id!)"
									:size="16"
								/>
								<ChevronRight
									v-else
									:size="16"
								/>
							</span>
						</button>

						<button
							type="button"
							class="btn-reset p-1.5 text-ios-muted transition-opacity active:opacity-60"
							aria-label="Удалить пункт"
							@click="removeItem(item.id!)"
						>
							<Trash2 :size="16" />
						</button>
					</div>

					<div
						v-if="isExpanded(item.id!)"
						class="pb-2"
					>
						<div
							v-for="child in childrenOf(item.id!)"
							:key="child.id"
							class="flex items-center gap-2 pl-11 pr-3 py-2"
						>
							<button
								type="button"
								class="btn-reset shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-opacity active:opacity-60"
								:class="child.done
									? 'border-ios-green bg-ios-green text-white'
									: 'border-ios-muted'"
								:aria-label="child.done ? 'Снять отметку' : 'Отметить выполненным'"
								@click="toggleItem(child.id!)"
							>
								<Check
									v-if="child.done"
									:size="12"
									:stroke-width="3"
								/>
							</button>

							<span
								class="flex-1 min-w-0 text-sm text-ios-text leading-snug"
								:class="child.done && 'line-through text-ios-muted'"
							>
								{{ child.title }}
							</span>

							<button
								type="button"
								class="btn-reset p-1.5 text-ios-muted transition-opacity active:opacity-60"
								aria-label="Удалить подпункт"
								@click="removeItem(child.id!)"
							>
								<Trash2 :size="14" />
							</button>
						</div>

						<form
							class="flex gap-2 pl-11 pr-3 pt-1"
							@submit.prevent="addChild(item.id!)"
						>
							<input
								v-model="childDrafts[item.id!]"
								type="text"
								class="input-field bg-ios-fill flex-1 text-sm"
								placeholder="Подпункт..."
								maxlength="120"
							>
							<button
								type="submit"
								class="btn-reset shrink-0 w-10 h-10 rounded-ios-sm bg-ios-fill text-ios-accent flex items-center justify-center transition-opacity active:opacity-80 disabled:opacity-40"
								:disabled="!(childDrafts[item.id!] ?? '').trim() || addingChildId === item.id"
								aria-label="Добавить подпункт"
							>
								<Plus :size="18" :stroke-width="2.25" />
							</button>
						</form>
					</div>
				</div>
			</div>

			<div
				v-for="(item, index) in doneItems"
				:key="item.id"
				:class="index < doneItems.length - 1 && 'hairline-b'"
			>
				<div class="flex items-center gap-3 px-4 py-3">
					<button
						v-if="isZone(item)"
						type="button"
						class="btn-reset shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center border-ios-green bg-ios-green text-white"
						aria-label="Состояние зоны"
						@click="toggleExpand(item.id!)"
					>
						<Check :size="14" :stroke-width="3" />
					</button>
					<button
						v-else
						type="button"
						class="btn-reset shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-opacity active:opacity-60 border-ios-green bg-ios-green text-white"
						aria-label="Снять отметку"
						@click="toggleItem(item.id!)"
					>
						<Check :size="14" :stroke-width="3" />
					</button>

					<button
						type="button"
						class="btn-reset flex-1 min-w-0 text-left flex items-center gap-2"
						@click="isZone(item) ? toggleExpand(item.id!) : undefined"
					>
						<span class="flex-1 min-w-0 text-ios-text leading-snug line-through text-ios-muted">
							{{ item.title }}
						</span>
						<span
							v-if="isZone(item)"
							class="shrink-0 text-xs text-ios-muted tabular-nums"
						>
							{{ progress(item.id!).doneCount }}/{{ progress(item.id!).total }}
						</span>
						<span
							v-if="isZone(item)"
							class="shrink-0 text-ios-muted"
						>
							<ChevronDown
								v-if="isExpanded(item.id!)"
								:size="16"
							/>
							<ChevronRight
								v-else
								:size="16"
							/>
						</span>
					</button>

					<button
						type="button"
						class="btn-reset p-1.5 text-ios-muted transition-opacity active:opacity-60"
						aria-label="Удалить пункт"
						@click="removeItem(item.id!)"
					>
						<Trash2 :size="16" />
					</button>
				</div>

				<div
					v-if="isZone(item) && isExpanded(item.id!)"
					class="pb-2"
				>
					<div
						v-for="child in childrenOf(item.id!)"
						:key="child.id"
						class="flex items-center gap-2 pl-12 pr-4 py-2"
					>
						<button
							type="button"
							class="btn-reset shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-opacity active:opacity-60"
							:class="child.done
								? 'border-ios-green bg-ios-green text-white'
								: 'border-ios-muted'"
							:aria-label="child.done ? 'Снять отметку' : 'Отметить выполненным'"
							@click="toggleItem(child.id!)"
						>
							<Check
								v-if="child.done"
								:size="12"
								:stroke-width="3"
							/>
						</button>

						<span
							class="flex-1 min-w-0 text-sm text-ios-text leading-snug"
							:class="child.done && 'line-through text-ios-muted'"
						>
							{{ child.title }}
						</span>

						<button
							type="button"
							class="btn-reset p-1.5 text-ios-muted transition-opacity active:opacity-60"
							aria-label="Удалить подпункт"
							@click="removeItem(child.id!)"
						>
							<Trash2 :size="14" />
						</button>
					</div>
				</div>
			</div>

			<p v-if="roots.length === 0" class="px-4 py-5 text-sm text-ios-muted text-center">
				Пока пусто — добавьте, что нужно сделать
			</p>
		</div>

		<form class="flex gap-2" @submit.prevent="addItem">
			<input
				v-model="newTitle"
				type="text"
				class="input-field bg-ios-fill flex-1"
				placeholder="Добавить пункт..."
				maxlength="120"
			>
			<button
				type="submit"
				class="btn-reset shrink-0 w-12 h-12 rounded-ios-sm bg-ios-accent text-ios-accent-text flex items-center justify-center transition-opacity active:opacity-80 disabled:opacity-40"
				:disabled="!newTitle.trim() || adding"
				aria-label="Добавить"
			>
				<Plus :size="22" :stroke-width="2.25" />
			</button>
		</form>
	</section>
</template>
