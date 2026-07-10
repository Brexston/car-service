<script setup lang="ts">
import type { OilStatus } from '../types';

interface Props {
	status: OilStatus;
}

const { status } = defineProps<Props>();

const statusClasses: Record<OilStatus, string> = {
	ok: 'bg-[#E8F8ED] text-ios-green',
	soon: 'bg-[#FFF4E5] text-ios-orange',
	overdue: 'bg-[#FFEBEA] text-ios-red',
};
</script>

<template>
	<span
		class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-ios-pill"
		:class="statusClasses[status]"
	>
		<slot />
	</span>
</template>
