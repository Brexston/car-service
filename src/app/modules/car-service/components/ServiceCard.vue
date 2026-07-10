<script setup lang="ts">
import type { ServiceRecord } from '../types';
import { Pencil, Trash2 } from '@lucide/vue';
import { RECORD_TYPE_LABELS } from '../types';
import { formatDate } from '../utils/date';
import GlassCard from './GlassCard.vue';

interface Props {
	record: ServiceRecord;
	editable?: boolean;
}

const { record, editable = true } = defineProps<Props>();

const emit = defineEmits<{
	edit: [];
	delete: [];
}>();

const typeColors: Record<ServiceRecord['type'], string> = {
	oil: 'text-ios-blue',
	filter: 'text-ios-green',
	repair: 'text-ios-orange',
	other: 'text-ios-muted',
};
</script>

<template>
	<GlassCard padding="md">
		<div class="flex items-start justify-between gap-3">
			<div class="flex-1 min-w-0">
				<div class="flex items-center gap-2 mb-0.5">
					<span class="text-sm font-semibold" :class="typeColors[record.type]">
						{{ RECORD_TYPE_LABELS[record.type] }}
					</span>
					<span class="text-xs text-ios-muted">{{ formatDate(record.date) }}</span>
				</div>
				<p class="text-ios-text font-semibold">
					{{ record.mileage.toLocaleString('ru-RU') }} км
				</p>
				<p v-if="record.comment" class="text-sm text-ios-muted mt-1 line-clamp-2">
					{{ record.comment }}
				</p>
			</div>
			<div v-if="editable" class="flex shrink-0">
				<button
					type="button"
					class="btn-reset p-2 text-ios-blue transition-opacity active:opacity-60"
					aria-label="Редактировать"
					@click.stop="emit('edit')"
				>
					<Pencil :size="18" />
				</button>
				<button
					type="button"
					class="btn-reset p-2 text-ios-red transition-opacity active:opacity-60"
					aria-label="Удалить"
					@click.stop="emit('delete')"
				>
					<Trash2 :size="18" />
				</button>
			</div>
		</div>
	</GlassCard>
</template>
