<script setup lang="ts">
import { UserApiKeys } from '@app/modules/user/api/user.api';
import XInputPassword from '@app/shared/components/ui/inputs/XInputPassword.vue';
import XInputText from '@app/shared/components/ui/inputs/XInputText.vue';
import { getValidationRules } from '@app/shared/utils/getValidationRules';
import { useRegle } from '@regle/core';
import { computed, reactive } from 'vue';
import { useUserStore } from '@/app/modules/user/store/user.store';
import { useApiStore } from '@/app/shared/stores/api.store';

const emit = defineEmits(['changeStep']);
const { isPending } = useApiStore();

const { requestAuthUser } = useUserStore();

const initialData = {
	email: '',
	password: '',
};
const formData = reactive({ ...initialData });
const { r$ } = useRegle({ formData }, () => ({
	formData: {
		email: getValidationRules('email'),
		password: getValidationRules('password'),
	},
}));

async function onSubmit() {
	const { valid } = await r$.$validate();
	if (!valid)
		return;

	const response = await requestAuthUser(formData);

	if (!response.success)
		return;

	window.location.href = '/account/';
}

const isLoading = computed(() => isPending(UserApiKeys.AUTH_USER));
</script>

<template>
	<form class="auth form" :inert="isLoading" @submit.prevent="onSubmit">
		<div class="auth__top">
			<h1 class="auth__title title title--h3">
				Авторизация
			</h1>
			<p class="auth__description">
				Введите ваш e-mail и пароль для авторизации
			</p>
		</div>
		<div class="auth__form">
			<div class="form__items">
				<XInputText
					v-model="formData.email"
					class="form__item"
					type="text"
					inputmode="email"
					placeholder="Введите ваш e-mail"
					autocomplete="email"
					:errors="r$.$errors.formData.email"
				/>
				<XInputPassword
					v-model="formData.password"
					class="form__item"
					name="password"
					placeholder="Введите пароль"
					autocomplete="current-password"
					:errors="r$.$errors.formData.password"
				>
					<template #underInput>
						<button
							class="link link--color-primary"
							type="button"
							@click="emit('changeStep', 'resetPassword');"
						>
							Забыли пароль?
						</button>
					</template>
				</XInputPassword>
			</div>
		</div>
		<div class="auth__bottom">
			<div class="auth__actions">
				<button
					class="btn"
					type="submit"
					:disabled="r$.$error && r$.$dirty"
					:loading="isLoading"
				>
					<span class="btn__text">Войти</span>
				</button>
			</div>
			<div class="auth__info">
				Впервые на сайте?
				<button
					class="link link--color-primary"
					type="button"
					@click="emit('changeStep', 'signUp');"
				>
					Зарегистрироваться
				</button>
			</div>
		</div>
	</form>
</template>
