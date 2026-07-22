<script setup lang="ts">
import { ChevronRight } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BottomNavigation from '../components/BottomNavigation.vue';
import GlassCard from '../components/GlassCard.vue';
import PageHeader from '../components/PageHeader.vue';
import ReminderCard from '../components/ReminderCard.vue';
import { useCarsStore } from '../stores/cars.store';
import { useChecklistStore } from '../stores/checklist.store';

type RemindersTab = 'oil' | 'checklist';

const router = useRouter();
const carsStore = useCarsStore();
const checklistStore = useChecklistStore();

const activeTab = ref<RemindersTab>('oil');

onMounted(async () => {
	await carsStore.loadCars();
	await checklistStore.load();
});

const reminders = computed(() =>
	carsStore.carsWithOil
		.filter(({ oilInfo }) => oilInfo.status !== 'ok')
		.sort((a, b) => a.oilInfo.remaining - b.oilInfo.remaining),
);

const openChecklist = computed(() => checklistStore.openItems);

const subtitle = computed(() =>
	activeTab.value === 'oil'
		? 'Скоро пора менять масло'
		: 'Что ещё нужно сделать',
);

function openCar(id: number) {
	router.push({ name: 'car-detail', params: { id } });
}
</script>

<template>
	<div>
		<PageHeader title="Напоминания" :subtitle="subtitle" />

		<div class="page-container pt-1">
			<div class="flex gap-2 mb-4">
				<button
					type="button"
					class="btn-reset flex-1 py-2.5 rounded-ios-pill text-sm font-semibold transition-opacity active:opacity-70"
					:class="activeTab === 'oil'
						? 'bg-ios-accent text-ios-accent-text'
						: 'bg-ios-fill text-ios-text'"
					@click="activeTab = 'oil'"
				>
					Масло
				</button>
				<button
					type="button"
					class="btn-reset flex-1 py-2.5 rounded-ios-pill text-sm font-semibold transition-opacity active:opacity-70"
					:class="activeTab === 'checklist'
						? 'bg-ios-accent text-ios-accent-text'
						: 'bg-ios-fill text-ios-text'"
					@click="activeTab = 'checklist'"
				>
					Чеклист
					<span
						v-if="openChecklist.length > 0"
						class="ml-1 opacity-80"
					>
						{{ openChecklist.length }}
					</span>
				</button>
			</div>

			<template v-if="activeTab === 'oil'">
				<div v-if="reminders.length === 0" class="text-center py-16">
					<p class="text-lg font-bold text-ios-text">
						Всё в порядке
					</p>
					<p class="text-sm text-ios-muted mt-1">
						Нет срочных напоминаний по маслу
					</p>
				</div>

				<div v-else class="space-y-2">
					<ReminderCard
						v-for="{ car, oilInfo } in reminders"
						:key="car.id"
						:car="car"
						:oil-info="oilInfo"
						@click="openCar(car.id!)"
					/>
				</div>
			</template>

			<template v-else>
				<div v-if="openChecklist.length === 0" class="text-center py-16">
					<p class="text-lg font-bold text-ios-text">
						Список пуст
					</p>
					<p class="text-sm text-ios-muted mt-1">
						Нет открытых пунктов чеклиста
					</p>
				</div>

				<div v-else class="space-y-2">
					<GlassCard
						v-for="{ item, carName } in openChecklist"
						:key="item.id"
						clickable
						@click="openCar(item.carId)"
					>
						<div class="flex items-center justify-between gap-3">
							<div class="flex-1 min-w-0">
								<p class="text-xs text-ios-muted mb-0.5">
									{{ carName }}
								</p>
								<p class="font-medium text-ios-text leading-snug">
									{{ item.title }}
								</p>
							</div>
							<ChevronRight :size="18" class="text-ios-muted shrink-0" />
						</div>
					</GlassCard>
				</div>
			</template>

			<BottomNavigation />
		</div>
	</div>
</template>
