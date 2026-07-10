<script setup lang="ts">
import { ChevronLeft } from '@lucide/vue';

interface Props {
	title: string;
	subtitle?: string;
}

defineProps<Props>();

const emit = defineEmits<{
	back: [];
}>();
</script>

<template>
	<header class="px-4 pt-3 pb-2 max-w-lg mx-auto">
		<button
			type="button"
			class="btn-reset flex items-center gap-0.5 text-ios-blue font-medium -ml-1 mb-2 transition-opacity active:opacity-60"
			@click="emit('back')"
		>
			<ChevronLeft :size="22" />
			<span class="text-base">Назад</span>
		</button>
		<h1 class="text-2xl font-bold text-ios-text tracking-tight">
			{{ title }}
		</h1>
		<p v-if="subtitle" class="text-ios-muted mt-0.5">
			{{ subtitle }}
		</p>
	</header>
</template>
