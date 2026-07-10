<script setup lang="ts">
import type { RecordType } from '../types';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BackHeader from '../components/BackHeader.vue';
import GlassCard from '../components/GlassCard.vue';
import OilStatusBadge from '../components/OilStatusBadge.vue';
import ServiceCard from '../components/ServiceCard.vue';
import { useCarsStore } from '../stores/cars.store';
import { getNextActionLabel } from '../utils/oil';

const route = useRoute();
const router = useRouter();
const carsStore = useCarsStore();

const carId = computed(() => Number(route.params.id));

const car = computed(() => carsStore.cars.find(c => c.id === carId.value));
const records = computed(() => carsStore.getCarRecords(carId.value));
const oilInfo = computed(() => carsStore.getCarOilInfo(carId.value));

const quickActions: { type: RecordType; label: string; emoji: string }[] = [
	{ type: 'oil', label: 'Масло', emoji: '🛢' },
	{ type: 'filter', label: 'Фильтр', emoji: '🔧' },
	{ type: 'repair', label: 'Ремонт', emoji: '⚙️' },
	{ type: 'other', label: 'Другое', emoji: '📝' },
];

const loaded = ref(false);

onMounted(async () => {
	await carsStore.loadCars();
	loaded.value = true;

	if (!car.value)
		router.replace({ name: 'cars' });
});

function goBack() {
	router.push({ name: 'cars' });
}

function addRecord(type: RecordType) {
	router.push({ name: 'add-record', params: { id: carId.value, type } });
}
</script>

<template>
	<div v-if="loaded && car && oilInfo">
		<BackHeader :title="car.name" @back="goBack" />

		<div class="page-container pt-1">
			<GlassCard padding="lg" class="mb-4">
				<p class="text-sm text-ios-muted">
					Текущий пробег
				</p>
				<p class="text-4xl font-bold text-ios-text mt-0.5 tracking-tight">
					{{ car.currentMileage.toLocaleString('ru-RU') }}
					<span class="text-lg font-normal text-ios-muted">км</span>
				</p>
				<div class="mt-4 pt-4 hairline-t">
					<p class="text-sm text-ios-muted mb-1">
						Следующее действие
					</p>
					<p class="text-ios-text font-medium leading-snug">
						{{ getNextActionLabel(oilInfo) }}
					</p>
					<div class="mt-2.5">
						<OilStatusBadge :status="oilInfo.status">
							{{ oilInfo.label }}
						</OilStatusBadge>
					</div>
				</div>
			</GlassCard>

			<div class="grid grid-cols-2 gap-2.5 mb-6">
				<button
					v-for="action in quickActions"
					:key="action.type"
					type="button"
					class="ios-pill flex flex-col items-center gap-1.5 py-4"
					@click="addRecord(action.type)"
				>
					<span class="text-2xl leading-none">{{ action.emoji }}</span>
					<span class="text-sm font-semibold">+ {{ action.label }}</span>
				</button>
			</div>

			<section>
				<h2 class="text-sm font-semibold text-ios-muted uppercase tracking-wide mb-2.5 px-1">
					История
				</h2>
				<div v-if="records.length === 0" class="text-center text-ios-muted py-8">
					Записей пока нет
				</div>
				<div v-else class="space-y-2">
					<ServiceCard
						v-for="record in records"
						:key="record.id"
						:record="record"
						:editable="false"
					/>
				</div>
			</section>
		</div>
	</div>
</template>
