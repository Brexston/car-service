<script setup lang="ts">
import { Car } from '@lucide/vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BottomNavigation from '../components/BottomNavigation.vue';
import CarCard from '../components/CarCard.vue';
import FloatingActionButton from '../components/FloatingActionButton.vue';
import PageHeader from '../components/PageHeader.vue';
import { useCarsStore } from '../stores/cars.store';

const router = useRouter();
const carsStore = useCarsStore();

onMounted(() => carsStore.loadCars());

function openCar(id: number) {
	router.push({ name: 'car-detail', params: { id } });
}

function addCar() {
	router.push({ name: 'add-car' });
}
</script>

<template>
	<div>
		<PageHeader title="Машины" subtitle="История обслуживания" />

		<div class="page-container pt-1">
			<div v-if="carsStore.loading" class="text-center text-ios-muted py-12">
				Загрузка...
			</div>

			<div v-else-if="carsStore.carsWithOil.length === 0" class="text-center py-16 px-4">
				<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ios-fill mb-4">
					<Car :size="32" class="text-ios-muted" />
				</div>
				<p class="text-lg font-bold text-ios-text mb-2">
					Начнём!
				</p>
				<p class="text-sm text-ios-muted mb-6 leading-relaxed">
					Добавьте первый автомобиль, чтобы вести историю обслуживания.
				</p>
				<button type="button" class="btn-secondary max-w-xs mx-auto" @click="addCar">
					Добавить автомобиль
				</button>
			</div>

			<div v-else class="space-y-3">
				<CarCard
					v-for="{ car, oilInfo } in carsStore.carsWithOil"
					:key="car.id"
					:car="car"
					:oil-info="oilInfo"
					@click="openCar(car.id!)"
				/>
			</div>

			<FloatingActionButton v-if="carsStore.carsWithOil.length > 0" @click="addCar" />
			<BottomNavigation />
		</div>
	</div>
</template>
