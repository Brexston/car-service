<script setup lang="ts">
import type { RecordType, ServiceRecord } from '../types';
import XInputDate from '@app/shared/components/ui/inputs/XInputDate.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BackHeader from '../components/BackHeader.vue';
import ChecklistSection from '../components/ChecklistSection.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import GlassCard from '../components/GlassCard.vue';
import ModalDialog from '../components/ModalDialog.vue';
import OilStatusBadge from '../components/OilStatusBadge.vue';
import ServiceCard from '../components/ServiceCard.vue';
import { useCarsStore } from '../stores/cars.store';
import { useRecordsStore } from '../stores/records.store';
import { getNextActionLabel } from '../utils/oil';

const route = useRoute();
const router = useRouter();
const carsStore = useCarsStore();
const recordsStore = useRecordsStore();

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
const deleteCarOpen = ref(false);
const deleteRecordTarget = ref<ServiceRecord | null>(null);
const editOpen = ref(false);
const editForm = ref({
	id: 0,
	date: '',
	mileage: 0,
	comment: '',
});
const mileageOpen = ref(false);
const mileageForm = ref(0);
const mileageError = ref('');
const mileageSaving = ref(false);

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

function openMileageEdit() {
	if (!car.value)
		return;

	mileageForm.value = car.value.currentMileage;
	mileageError.value = '';
	mileageOpen.value = true;
}

async function saveMileage() {
	mileageError.value = '';

	if (!Number.isFinite(mileageForm.value) || mileageForm.value < 0) {
		mileageError.value = 'Пробег не может быть отрицательным';
		return;
	}

	mileageSaving.value = true;
	try {
		await carsStore.updateCar(carId.value, {
			currentMileage: Math.floor(mileageForm.value),
		});
		mileageOpen.value = false;
	}
	finally {
		mileageSaving.value = false;
	}
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

function confirmDeleteRecord(record: ServiceRecord) {
	deleteRecordTarget.value = record;
}

async function doDeleteRecord() {
	if (!deleteRecordTarget.value?.id)
		return;

	await recordsStore.deleteRecord(deleteRecordTarget.value.id);
	deleteRecordTarget.value = null;
}

async function saveEdit() {
	await recordsStore.updateRecord(editForm.value.id, {
		date: editForm.value.date,
		mileage: editForm.value.mileage,
		comment: editForm.value.comment,
	});
	editOpen.value = false;
}

async function doDeleteCar() {
	await carsStore.deleteCar(carId.value);
	router.replace({ name: 'cars' });
}
</script>

<template>
	<div v-if="loaded && car && oilInfo">
		<BackHeader :title="car.name" @back="goBack" />

		<div class="page-container pt-1">
			<GlassCard padding="lg" class="mb-4">
				<div class="flex items-center justify-between gap-3 mb-1">
					<p class="text-base text-ios-muted">
						Текущий пробег
					</p>
					<button
						type="button"
						class="btn-reset shrink-0 text-base text-ios-blue font-medium transition-opacity active:opacity-60"
						@click="openMileageEdit"
					>
						Изменить
					</button>
				</div>
				<p class="text-4xl font-bold text-ios-text tracking-tight">
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

			<div class="mb-6">
				<ChecklistSection :car-id="carId" />
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
						@edit="openEdit(record)"
						@delete="confirmDeleteRecord(record)"
					/>
				</div>
			</section>

			<button
				type="button"
				class="btn-reset w-full mt-8 py-4 text-ios-red font-medium text-center transition-opacity active:opacity-60"
				@click="deleteCarOpen = true"
			>
				Удалить автомобиль
			</button>
		</div>

		<ModalDialog v-model:open="mileageOpen" title="Текущий пробег">
			<form class="space-y-3" @submit.prevent="saveMileage">
				<div>
					<label class="block text-xs text-ios-muted mb-1.5 uppercase tracking-wide">Пробег, км</label>
					<input
						v-model.number="mileageForm"
						type="number"
						min="0"
						step="1"
						class="input-field bg-ios-fill"
						autofocus
					>
				</div>
				<p v-if="mileageError" class="text-sm text-ios-red">
					{{ mileageError }}
				</p>
			</form>
			<template #footer>
				<button type="button" class="btn-ghost" @click="mileageOpen = false">
					Отмена
				</button>
				<button type="button" class="btn-accent" :disabled="mileageSaving" @click="saveMileage">
					{{ mileageSaving ? 'Сохранение...' : 'Сохранить' }}
				</button>
			</template>
		</ModalDialog>

		<ConfirmDialog
			:open="!!deleteRecordTarget"
			title="Удалить запись?"
			message="Запись будет удалена без возможности восстановления."
			confirm-label="Удалить"
			danger
			@update:open="deleteRecordTarget = null"
			@confirm="doDeleteRecord"
		/>

		<ModalDialog v-model:open="editOpen" title="Редактировать запись">
			<form class="space-y-3" @submit.prevent="saveEdit">
				<div>
					<label class="block text-xs text-ios-muted mb-1.5 uppercase tracking-wide">Дата</label>
					<XInputDate v-model="editForm.date" date-mask="yyyy-MM-dd" />
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

		<ConfirmDialog
			:open="deleteCarOpen"
			title="Удалить автомобиль?"
			:message="`«${car.name}» и все записи обслуживания будут удалены без возможности восстановления.`"
			confirm-label="Удалить"
			danger
			@update:open="deleteCarOpen = $event"
			@confirm="doDeleteCar"
		/>
	</div>
</template>
