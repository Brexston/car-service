<script setup lang="ts">
import type { RecordType } from '../types';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BackHeader from '../components/BackHeader.vue';
import { useCarsStore } from '../stores/cars.store';
import { useRecordsStore } from '../stores/records.store';
import { RECORD_TYPE_LABELS } from '../types';
import { toInputDate } from '../utils/date';

const route = useRoute();
const router = useRouter();
const carsStore = useCarsStore();
const recordsStore = useRecordsStore();

const carId = computed(() => Number(route.params.id));
const recordType = computed(() => route.params.type as RecordType);

const car = computed(() => carsStore.cars.find(c => c.id === carId.value));

const form = ref({
	date: toInputDate(),
	mileage: 0,
	comment: '',
});

const saving = ref(false);
const error = ref('');

onMounted(async () => {
	await carsStore.loadCars();

	if (!car.value) {
		router.replace({ name: 'cars' });
		return;
	}

	form.value.mileage = car.value.currentMileage;
});

async function save() {
	error.value = '';

	if (form.value.mileage < 0) {
		error.value = 'Пробег не может быть отрицательным';
		return;
	}

	saving.value = true;
	try {
		await recordsStore.addRecord({
			carId: carId.value,
			type: recordType.value,
			date: form.value.date,
			mileage: form.value.mileage,
			comment: form.value.comment,
		});
		router.replace({ name: 'car-detail', params: { id: carId.value } });
	}
	finally {
		saving.value = false;
	}
}

function goBack() {
	router.back();
}
</script>

<template>
	<div v-if="car">
		<BackHeader
			:title="RECORD_TYPE_LABELS[recordType]"
			:subtitle="car.name"
			@back="goBack"
		/>

		<div class="page-container pt-1">
			<form class="space-y-4" @submit.prevent="save">
				<div class="ios-card p-4 space-y-4">
					<div>
						<label class="block text-xs text-ios-muted mb-1.5 uppercase tracking-wide">Дата</label>
						<input v-model="form.date" type="date" class="input-field bg-ios-fill">
					</div>

					<div class="hairline-t pt-4">
						<label class="block text-xs text-ios-muted mb-1.5 uppercase tracking-wide">Пробег, км</label>
						<input
							v-model.number="form.mileage"
							type="number"
							min="0"
							class="input-field bg-ios-fill text-3xl font-bold tracking-tight"
							autofocus
						>
					</div>

					<div class="hairline-t pt-4">
						<label class="block text-xs text-ios-muted mb-1.5 uppercase tracking-wide">Комментарий</label>
						<textarea
							v-model="form.comment"
							class="input-field bg-ios-fill min-h-20 resize-none"
							placeholder="Необязательно"
						/>
					</div>
				</div>

				<p v-if="error" class="text-sm text-ios-red px-1">
					{{ error }}
				</p>

				<button type="submit" class="btn-accent w-full" :disabled="saving">
					{{ saving ? 'Сохранение...' : 'Сохранить' }}
				</button>
			</form>
		</div>
	</div>
</template>
