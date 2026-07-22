<script setup lang="ts">
import { Check, Plus, Trash2 } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useChecklistStore } from '../stores/checklist.store';

interface Props {
	carId: number;
}

const { carId } = defineProps<Props>();

const checklistStore = useChecklistStore();
const newTitle = ref('');
const adding = ref(false);

const items = computed(() => checklistStore.getByCar(carId));

onMounted(() => checklistStore.load());

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
				v-for="(item, index) in items"
				:key="item.id"
				class="flex items-center gap-3 px-4 py-3"
				:class="index < items.length - 1 && 'hairline-b'"
			>
				<button
					type="button"
					class="btn-reset shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-opacity active:opacity-60"
					:class="item.done
						? 'border-ios-green bg-ios-green text-white'
						: 'border-ios-muted'"
					:aria-label="item.done ? 'Снять отметку' : 'Отметить выполненным'"
					@click="toggleItem(item.id!)"
				>
					<Check v-if="item.done" :size="14" :stroke-width="3" />
				</button>

				<span
					class="flex-1 min-w-0 text-ios-text leading-snug"
					:class="item.done && 'line-through text-ios-muted'"
				>
					{{ item.title }}
				</span>

				<button
					type="button"
					class="btn-reset p-1.5 text-ios-muted transition-opacity active:opacity-60"
					aria-label="Удалить пункт"
					@click="removeItem(item.id!)"
				>
					<Trash2 :size="16" />
				</button>
			</div>

			<p v-if="items.length === 0" class="px-4 py-5 text-sm text-ios-muted text-center">
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
