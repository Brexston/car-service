<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BottomNavigation from '../components/BottomNavigation.vue';
import PageHeader from '../components/PageHeader.vue';
import ReminderCard from '../components/ReminderCard.vue';
import { useCarsStore } from '../stores/cars.store';

const router = useRouter();
const carsStore = useCarsStore();

onMounted(() => carsStore.loadCars());

const reminders = computed(() =>
	carsStore.carsWithOil
		.filter(({ oilInfo }) => oilInfo.status !== 'ok')
		.sort((a, b) => a.oilInfo.remaining - b.oilInfo.remaining),
);

function openCar(id: number) {
	router.push({ name: 'car-detail', params: { id } });
}
</script>

<template>
	<div>
		<PageHeader title="Напоминания" subtitle="Скоро пора менять масло" />

		<div class="page-container pt-1">
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

			<BottomNavigation />
		</div>
	</div>
</template>
