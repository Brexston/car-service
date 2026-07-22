<script setup lang="ts">
import type { BackupData } from '../types';
import { ChevronRight, Download, ExternalLink, Trash2, Upload } from '@lucide/vue';
import { ref } from 'vue';
import BottomNavigation from '../components/BottomNavigation.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import PageHeader from '../components/PageHeader.vue';
import { db } from '../db/database';
import { useCarsStore } from '../stores/cars.store';
import { useChecklistStore } from '../stores/checklist.store';
import { APP_VERSION } from '../types';

const carsStore = useCarsStore();
const checklistStore = useChecklistStore();

const clearOpen = ref(false);
const importError = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

async function exportData() {
	const cars = await db.cars.toArray();
	const records = await db.records.toArray();
	const checklistItems = await db.checklistItems.toArray();

	const backup: BackupData = {
		version: 2,
		exportedAt: new Date().toISOString(),
		cars,
		records,
		checklistItems,
	};

	const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = 'backup.json';
	link.click();
	URL.revokeObjectURL(url);
}

function triggerImport() {
	importError.value = '';
	fileInput.value?.click();
}

async function onFileSelected(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];
	if (!file)
		return;

	try {
		const text = await file.text();
		const data = JSON.parse(text) as BackupData;

		if (!data.cars || !data.records)
			throw new Error('Неверный формат файла');

		await carsStore.importData(data.cars, data.records, data.checklistItems ?? []);
		await checklistStore.load();
	}
	catch {
		importError.value = 'Не удалось импортировать файл';
	}
	finally {
		input.value = '';
	}
}

async function clearData() {
	await carsStore.clearAll();
	await checklistStore.load();
	clearOpen.value = false;
}
</script>

<template>
	<div>
		<PageHeader title="Настройки" />

		<div class="page-container pt-1">
			<div class="ios-card overflow-hidden mb-4">
				<button
					type="button"
					class="btn-reset w-full flex items-center gap-3 px-4 py-3.5 text-left transition-opacity active:opacity-60 hairline-b"
					@click="exportData"
				>
					<Download :size="20" class="text-ios-blue shrink-0" />
					<span class="flex-1 font-medium text-ios-text">Экспорт JSON</span>
					<ChevronRight :size="18" class="text-ios-muted" />
				</button>
				<button
					type="button"
					class="btn-reset w-full flex items-center gap-3 px-4 py-3.5 text-left transition-opacity active:opacity-60 hairline-b"
					@click="triggerImport"
				>
					<Upload :size="20" class="text-ios-blue shrink-0" />
					<span class="flex-1 font-medium text-ios-text">Импорт JSON</span>
					<ChevronRight :size="18" class="text-ios-muted" />
				</button>
				<button
					type="button"
					class="btn-reset w-full flex items-center gap-3 px-4 py-3.5 text-left transition-opacity active:opacity-60"
					@click="clearOpen = true"
				>
					<Trash2 :size="20" class="text-ios-red shrink-0" />
					<span class="flex-1 font-medium text-ios-red">Очистить все данные</span>
					<ChevronRight :size="18" class="text-ios-muted" />
				</button>
			</div>
			<input ref="fileInput" type="file" accept=".json,application/json" class="hidden" @change="onFileSelected">

			<p v-if="importError" class="text-sm text-ios-red px-1 mb-4">
				{{ importError }}
			</p>

			<div class="ios-card p-4">
				<h2 class="font-semibold text-ios-text mb-1">
					О приложении
				</h2>
				<p class="text-sm text-ios-muted leading-relaxed">
					Car Service — офлайн PWA для учёта обслуживания автомобилей
				</p>
				<p class="text-sm text-ios-muted mt-1">
					Версия {{ APP_VERSION }}
				</p>
				<a
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1.5 text-sm text-ios-blue mt-3"
				>
					<ExternalLink :size="15" />
					GitHub
				</a>
			</div>

			<ConfirmDialog
				v-model:open="clearOpen"
				title="Очистить данные?"
				message="Все автомобили, записи и чеклисты будут удалены. Это действие нельзя отменить."
				confirm-label="Очистить"
				danger
				@confirm="clearData"
			/>

			<BottomNavigation />
		</div>
	</div>
</template>
