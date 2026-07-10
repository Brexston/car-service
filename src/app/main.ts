import 'virtual:uno.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './modules/car-service/router';

const app = createApp(App);

app
	.use(createPinia())
	.use(router)
	.mount('#app');
