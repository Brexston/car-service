import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'cars',
		component: () => import('@app/modules/car-service/views/CarsView.vue'),
		meta: { name: 'Машины', title: 'Машины' },
	},
	{
		path: '/cars/new',
		name: 'add-car',
		component: () => import('@app/modules/car-service/views/AddCarView.vue'),
		meta: { name: 'Новый автомобиль', title: 'Новый автомобиль' },
	},
	{
		path: '/cars/:id',
		name: 'car-detail',
		component: () => import('@app/modules/car-service/views/CarDetailView.vue'),
		meta: { name: 'Автомобиль', title: 'Автомобиль' },
	},
	{
		path: '/cars/:id/record/:type',
		name: 'add-record',
		component: () => import('@app/modules/car-service/views/AddRecordView.vue'),
		meta: { name: 'Новая запись', title: 'Новая запись' },
	},
	{
		path: '/history',
		name: 'history',
		component: () => import('@app/modules/car-service/views/HistoryView.vue'),
		meta: { name: 'История', title: 'История' },
	},
	{
		path: '/reminders',
		name: 'reminders',
		component: () => import('@app/modules/car-service/views/RemindersView.vue'),
		meta: { name: 'Напоминания', title: 'Напоминания' },
	},
	{
		path: '/settings',
		name: 'settings',
		component: () => import('@app/modules/car-service/views/SettingsView.vue'),
		meta: { name: 'Настройки', title: 'Настройки' },
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach((to, _, next) => {
	document.title = `${to.meta.name ?? 'Car Service'} — Car Service`;
	next();
});

export default router;
