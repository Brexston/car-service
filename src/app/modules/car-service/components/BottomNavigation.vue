<script setup lang="ts">
import { Bell, Car, ClipboardList, Settings } from '@lucide/vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tabs = [
	{ name: 'cars', path: '/', label: 'Машины', icon: Car },
	{ name: 'history', path: '/history', label: 'История', icon: ClipboardList },
	{ name: 'reminders', path: '/reminders', label: 'Напоминания', icon: Bell },
	{ name: 'settings', path: '/settings', label: 'Настройки', icon: Settings },
] as const;

const showNav = computed(() => {
	const hiddenRoutes = ['add-car', 'add-record', 'car-detail'];
	return !hiddenRoutes.includes(route.name as string);
});

function isActive(path: string) {
	if (path === '/')
		return route.path === '/';

	return route.path.startsWith(path);
}

function navigate(path: string) {
	if (route.path !== path)
		router.push(path);
}
</script>

<template>
	<nav v-if="showNav" class="tabbar">
		<button
			v-for="tab in tabs"
			:key="tab.name"
			type="button"
			class="tab-item"
			@click="navigate(tab.path)"
		>
			<component
				:is="tab.icon"
				:size="24"
				:stroke-width="isActive(tab.path) ? 2.25 : 1.75"
				:class="isActive(tab.path) ? 'text-ios-text' : 'text-ios-muted'"
			/>
			<span
				class="tab-item-label"
				:class="isActive(tab.path) ? 'text-ios-text' : 'text-ios-muted'"
			>
				{{ tab.label }}
			</span>
		</button>
	</nav>
</template>
