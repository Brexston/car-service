<script setup lang="ts">
import type { Car, OilInfo } from '../types';
import { ChevronRight } from '@lucide/vue';
import GlassCard from './GlassCard.vue';
import OilStatusBadge from './OilStatusBadge.vue';

interface Props {
	car: Car;
	oilInfo: OilInfo;
}

const { car, oilInfo } = defineProps<Props>();

const emit = defineEmits<{
	click: [];
}>();
</script>

<template>
	<GlassCard clickable padding="lg" @click="emit('click')">
		<div class="flex items-center justify-between gap-3">
			<div class="flex-1 min-w-0">
				<h3 class="text-base font-semibold text-ios-text truncate m-0">
					{{ car.name }}
				</h3>
				<p class="text-sm text-ios-muted mt-0.5">
					{{ car.currentMileage.toLocaleString('ru-RU') }} км
				</p>
			</div>
			<ChevronRight :size="18" class="text-ios-muted shrink-0" />
		</div>

		<div class="mt-3 pt-3 hairline-t space-y-2">
			<div class="flex items-center justify-between text-sm">
				<span class="text-ios-muted">Последняя замена масла</span>
				<span class="text-ios-text font-medium">
					{{ oilInfo.lastOilMileage !== null ? `${oilInfo.lastOilMileage.toLocaleString('ru-RU')} км` : '—' }}
				</span>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-ios-muted">Следующая замена</span>
				<span class="text-ios-text font-medium">
					{{ oilInfo.nextOilMileage.toLocaleString('ru-RU') }} км
				</span>
			</div>
			<div class="pt-0.5">
				<OilStatusBadge :status="oilInfo.status">
					{{ oilInfo.label }}
				</OilStatusBadge>
			</div>
		</div>
	</GlassCard>
</template>
