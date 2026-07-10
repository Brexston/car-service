<script setup lang="ts">
import { Plus } from '@lucide/vue';

const emit = defineEmits<{
	click: [];
}>();
</script>

<template>
	<button
		type="button"
		class="btn-reset fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-4 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-ios-accent text-ios-accent-text shadow-ios-fab transition-transform duration-150 active:scale-95"
		aria-label="Добавить"
		@click="emit('click')"
	>
		<Plus :size="26" :stroke-width="2.5" />
	</button>
</template>
