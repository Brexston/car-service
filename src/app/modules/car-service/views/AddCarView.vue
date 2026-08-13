<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BackHeader from '../components/BackHeader.vue';
import { useCarsStore } from '../stores/cars.store';

const router = useRouter();
const carsStore = useCarsStore();

const form = ref(carsStore.createDefaultCarForm());
const saving = ref(false);
const error = ref('');

async function save() {
	error.value = '';

	if (!form.value.name.trim()) {
		error.value = 'Введите название автомобиля';
		return;
	}

	if (form.value.purchaseMileage < 0) {
		error.value = 'Пробег не может быть отрицательным';
		return;
	}

	saving.value = true;
	try {
		const id = await carsStore.addCar(form.value);
		router.replace({ name: 'car-detail', params: { id } });
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
	<div>
		<BackHeader title="Новый автомобиль" @back="goBack" />

		<div class="page-container pt-1">
			<form class="space-y-4" @submit.prevent="save">
				<div class="ios-card p-4 space-y-4">
					<div>
						<label class="block text-xs text-ios-muted mb-1.5 uppercase tracking-wide">Название</label>
						<input
							v-model="form.name"
							type="text"
							class="input-field bg-ios-fill"
							placeholder="Toyota Camry"
							autofocus
						>
					</div>

					<div class="hairline-t pt-4">
						<label class="block text-xs text-ios-muted mb-1.5 uppercase tracking-wide">Пробег при покупке, км</label>
						<input
							v-model.number="form.purchaseMileage"
							type="number"
							min="0"
							class="input-field bg-ios-fill"
							placeholder="0"
						>
					</div>

					<div class="hairline-t pt-4">
						<label class="block text-xs text-ios-muted mb-1.5 uppercase tracking-wide">Интервал замены масла, км</label>
						<input
							v-model.number="form.oilInterval"
							type="number"
							min="1000"
							step="500"
							class="input-field bg-ios-fill"
						>
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
