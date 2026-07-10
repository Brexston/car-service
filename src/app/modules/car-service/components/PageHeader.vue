<script setup lang="ts">
interface Props {
	title: string;
	subtitle?: string;
}

defineProps<Props>();
</script>

<template>
	<header class="px-4 pt-4 pb-3 max-w-lg mx-auto">
		<h1 class="page-title">
			{{ title }}
		</h1>
		<p v-if="subtitle" class="page-subtitle">
			{{ subtitle }}
		</p>
	</header>
</template>
