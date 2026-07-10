<script setup lang="ts">
import { ChevronRight } from '@lucide/vue';
import type { Car, OilInfo } from '../types';
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
	<GlassCard clickable @click="emit('click')">
		<div class="flex items-center justify-between gap-3">
			<div class="flex-1 min-w-0">
				<h3 class="font-semibold text-ios-text truncate">
					{{ car.name }}
				</h3>
				<p class="text-sm text-ios-muted mt-0.5">
					{{ car.currentMileage.toLocaleString('ru-RU') }} км
				</p>
				<div class="mt-2">
					<OilStatusBadge :status="oilInfo.status">
						{{ oilInfo.label }}
					</OilStatusBadge>
				</div>
			</div>
			<ChevronRight :size="18" class="text-ios-muted shrink-0" />
		</div>
	</GlassCard>
</template>
