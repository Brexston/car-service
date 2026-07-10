<script setup lang="ts">
import type { ServiceRecord } from '../types';
import { computed, onMounted, ref } from 'vue';
import BottomNavigation from '../components/BottomNavigation.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import ModalDialog from '../components/ModalDialog.vue';
import PageHeader from '../components/PageHeader.vue';
import ServiceCard from '../components/ServiceCard.vue';
import { useCarsStore } from '../stores/cars.store';
import { useRecordsStore } from '../stores/records.store';

const carsStore = useCarsStore();
const recordsStore = useRecordsStore();

const deleteTarget = ref<ServiceRecord | null>(null);
const editOpen = ref(false);
const editForm = ref({
	id: 0,
	date: '',
	mileage: 0,
	comment: '',
});

onMounted(() => carsStore.loadCars());

const records = computed(() => {
	if (!carsStore.selectedCarId)
		return [];

	return carsStore.getCarRecords(carsStore.selectedCarId);
});

function selectCar(event: Event) {
	const value = Number((event.target as HTMLSelectElement).value);
	carsStore.selectedCarId = value || null;
}

function openEdit(record: ServiceRecord) {
	editForm.value = {
		id: record.id!,
		date: record.date,
		mileage: record.mileage,
		comment: record.comment,
	};
	editOpen.value = true;
}

function confirmDelete(record: ServiceRecord) {
	deleteTarget.value = record;
}

async function doDelete() {
	if (!deleteTarget.value?.id)
		return;

	await recordsStore.deleteRecord(deleteTarget.value.id);
	deleteTarget.value = null;
}

async function saveEdit() {
	await recordsStore.updateRecord(editForm.value.id, {
		date: editForm.value.date,
		mileage: editForm.value.mileage,
		comment: editForm.value.comment,
	});
	editOpen.value = false;
}
</script>

<template>
	<div>
		<PageHeader title="История" />

		<div class="page-container pt-1">
			<div v-if="carsStore.cars.length > 0" class="mb-4">
				<select
					class="input-field"
					:value="carsStore.selectedCarId ?? ''"
					@change="selectCar"
				>
					<option v-for="car in carsStore.cars" :key="car.id" :value="car.id">
						{{ car.name }}
					</option>
				</select>
			</div>

			<div v-if="carsStore.cars.length === 0" class="text-center text-ios-muted py-12">
				Сначала добавьте автомобиль
			</div>

			<div v-else-if="records.length === 0" class="text-center text-ios-muted py-12">
				Записей пока нет
			</div>

			<div v-else class="space-y-2">
				<ServiceCard
					v-for="record in records"
					:key="record.id"
					:record="record"
					@edit="openEdit(record)"
					@delete="confirmDelete(record)"
				/>
			</div>

			<ConfirmDialog
				:open="!!deleteTarget"
				title="Удалить запись?"
				message="Запись будет удалена без возможности восстановления."
				confirm-label="Удалить"
				danger
				@update:open="deleteTarget = null"
				@confirm="doDelete"
			/>

			<ModalDialog v-model:open="editOpen" title="Редактировать запись">
				<form class="space-y-3" @submit.prevent="saveEdit">
					<div>
						<label class="block text-xs text-ios-muted mb-1.5 uppercase tracking-wide">Дата</label>
						<input v-model="editForm.date" type="date" class="input-field bg-ios-fill">
					</div>
					<div>
						<label class="block text-xs text-ios-muted mb-1.5 uppercase tracking-wide">Пробег, км</label>
						<input v-model.number="editForm.mileage" type="number" min="0" class="input-field bg-ios-fill">
					</div>
					<div>
						<label class="block text-xs text-ios-muted mb-1.5 uppercase tracking-wide">Комментарий</label>
						<textarea v-model="editForm.comment" class="input-field bg-ios-fill min-h-20 resize-none" />
					</div>
				</form>
				<template #footer>
					<button type="button" class="btn-ghost" @click="editOpen = false">
						Отмена
					</button>
					<button type="button" class="btn-accent" @click="saveEdit">
						Сохранить
					</button>
				</template>
			</ModalDialog>

			<BottomNavigation />
		</div>
	</div>
</template>
