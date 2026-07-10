<script setup lang="ts">
interface Props {
	tag?: string;
	clickable?: boolean;
	padding?: 'sm' | 'md' | 'lg';
}

const { tag = 'div', clickable = false, padding = 'md' } = defineProps<Props>();

const paddingClass = {
	sm: 'p-4',
	md: 'p-4',
	lg: 'p-5',
}[padding];
</script>

<template>
	<component
		:is="tag"
		class="ios-card"
		:class="[
			paddingClass,
			clickable && 'ios-card-tap cursor-pointer',
		]"
	>
		<slot />
	</component>
</template>
