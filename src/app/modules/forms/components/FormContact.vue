<script setup lang="ts">
import type { ContactFormPayload } from '@app/modules/forms/api/forms.api.types';
import { formsApi, FormsApyKeys } from '@app/modules/forms/api/forms.api';
import XInputCheckbox from '@app/shared/components/ui/inputs/XInputCheckbox.vue';
import XInputText from '@app/shared/components/ui/inputs/XInputText.vue';
import XInputTextarea from '@app/shared/components/ui/inputs/XInputTextarea.vue';
import { useCaptchaPreload } from '@app/shared/composables/useCaptchaPreload';
import { phoneMask } from '@app/shared/consts/masks';
import { useApiStore } from '@app/shared/stores/api.store';
import { useBaseStore } from '@app/shared/stores/base.store';
import { getValidationRules } from '@app/shared/utils/getValidationRules';
import { useRegle } from '@regle/core';
import { computed, reactive, ref } from 'vue';

const initialData: ContactFormPayload = {
	name: '',
	phone: '',
	comment: '',
	agreement: false,
};

const formData = reactive({ ...initialData });

const { r$ } = useRegle({ formData }, () => ({
	formData: {
		name: getValidationRules('string', true),
		phone: getValidationRules('phone', true),
		comment: getValidationRules('text', false),
		agreement: getValidationRules('checkbox', true),
	},
}));

const { docs } = useBaseStore();
const { isPending } = useApiStore();
const { preloadCaptcha } = useCaptchaPreload();
const isFinished = ref(false);

async function onSubmit() {
	const { valid } = await r$.$validate();
	if (!valid)
		return;

	const response = await formsApi.requestContactForm(formData);

	if (!response.success)
		return;

	r$.$reset({ toInitialState: true });
	isFinished.value = true;
}

const isLoading = computed(() => isPending(FormsApyKeys.CONTACT_FORM));
</script>

<template>
	<form
		v-show="!isFinished"
		:inert="isLoading"
		class="form"
		@focusin.capture="preloadCaptcha"
		@submit.prevent="onSubmit"
	>
		<div class="form__items form__items--column-2">
			<XInputText
				v-model="formData.name"
				label="Имя"
				placeholder="Введите имя"
				required
				:errors="r$.$errors.formData.name"
				autocomplete="name"
				class="form__item"
			/>
			<XInputText
				v-model="formData.phone"
				v-mask="phoneMask"
				label="Телефон"
				placeholder="+7 (___) ___ __ __"
				required
				:errors="r$.$errors.formData.phone"
				type="tel"
				inputmode="numeric"
				autocomplete="tel"
				class="form__item"
			/>
			<XInputTextarea
				v-model="formData.comment"
				label="Комментарий"
				placeholder="Напишите комментарий"
				:errors="r$.$errors.formData.comment"
				class="form__item form__item--full"
				autosize
			/>
			<XInputCheckbox
				v-model="formData.agreement"
				required
				:errors="r$.$errors.formData.agreement"
				class="form__item form__item--full"
			>
				Я соглашаюсь с
				<a :href="docs.privacyPolicy" target="_blank">политикой конфиденциальности</a> и
				<a :href="docs.userAgreement" target="_blank">пользовательским соглашением</a>
			</XInputCheckbox>
		</div>

		<div class="form__bottom">
			<div class="form__actions">
				<button
					type="submit"
					:loading="isLoading"
					:disabled="r$.$error && r$.$dirty"
					class="btn"
				>
					<span class="btn__text">
						Отправить
					</span>
				</button>
			</div>
		</div>
	</form>

	<div v-show="isFinished" class="form-sent">
		<div class="form-sent__info">
			<span class="form__title">
				Форма отправлена
			</span>
			<p class="form-sent__text">
				Мы свяжемся с вами в ближайшее время
			</p>
		</div>
	</div>
</template>
