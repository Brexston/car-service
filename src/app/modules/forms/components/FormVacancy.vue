<script setup lang="ts">
import type { VacancyPayload } from '@app/modules/forms/api/forms.api.types';
import { formsApi, FormsApyKeys } from '@app/modules/forms/api/forms.api';
import XInputCheckbox from '@app/shared/components/ui/inputs/XInputCheckbox.vue';
import XInputFile from '@app/shared/components/ui/inputs/XInputFile.vue';
import XInputSelect from '@app/shared/components/ui/inputs/XInputSelect.vue';
import XInputText from '@app/shared/components/ui/inputs/XInputText.vue';
import { useCaptchaPreload } from '@app/shared/composables/useCaptchaPreload';
import { phoneMask, priceMask } from '@app/shared/consts/masks';
import { useApiStore } from '@app/shared/stores/api.store';
import { useBaseStore } from '@app/shared/stores/base.store';
import { getNoun } from '@app/shared/utils/getNoun';
import { getValidationRules } from '@app/shared/utils/getValidationRules';
import { toastSuccess } from '@app/shared/utils/toast';
import { useRegle } from '@regle/core';
import { computed, reactive, ref } from 'vue';

const { cities, vacancies } = defineProps<Props>();

const initialData: VacancyPayload = {
	name: '',
	phone: '',
	email: '',
	city: null,
	vacancy: null,
	file: undefined,
	link: '',
	price: '',
};

interface Props {
	cities: {
		value: number;
		label: string;
	}[];
	vacancies: {
		value: number;
		label: string;
	}[];
}

const formData = reactive({ ...initialData });
const agreement = ref(false);

const { r$ } = useRegle({ formData, agreement }, () => ({
	formData: {
		name: getValidationRules('string', true),
		phone: getValidationRules('phone', true),
		email: getValidationRules('email', true),
		vacancy: getValidationRules('text', true),
	},
	agreement: getValidationRules('checkbox', true),
}));

const { docs } = useBaseStore();
const { isPending } = useApiStore();
const { preloadCaptcha } = useCaptchaPreload();

async function onSubmit() {
	const { valid } = await r$.$validate();
	if (!valid)
		return;

	const response = await formsApi.requestVacancyForm(formData);
	if (!response.success)
		return;

	r$.$reset({ toInitialState: true });
	toastSuccess('Резюме успешно отправлено. В ближайшее время мы свяжемся с вами.');
}

const isLoading = computed(() => isPending(FormsApyKeys.VACANCY_FORM));
</script>

<template>
	<form
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
				class="form__item form__item--full"
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
			<XInputText
				v-model="formData.email"
				label="E-mail"
				placeholder="Введите E-mail"
				:errors="r$.$errors.formData.email"
				required
				inputmode="email"
				type="text"
				autocomplete="email"
				class="form__item"
			/>
			<XInputSelect
				v-model="formData.city"
				:options="cities"
				label="Город"
				placeholder="Выберите из списка"
				class="form__item form__item--full"
			>
				<template #underInput>
					{{ cities.length }} {{ getNoun(cities.length, { single: 'город', dual: 'города', many: 'городов' }) }}
				</template>
			</XInputSelect>
			<XInputSelect
				v-model="formData.vacancy"
				:options="vacancies"
				label="Вакансия"
				placeholder="Выберите вакансию"
				required
				:errors="r$.$errors.formData.vacancy"
				class="form__item form__item--full"
			/>
			<XInputFile
				v-model="formData.file"
				:accept="[
					'application/pdf',
					'application/msword',
					'application/rtf',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				]"
				label="Резюме"
				placeholder="Загрузите файл"
				class="form__item form__item--full"
			/>
			<XInputText
				v-model="formData.link"
				label="Ссылка на резюме"
				inputmode="url"
				placeholder="Можете указать ссылку на резюме"
				class="form__item form__item--full"
			/>

			<XInputText
				v-model="formData.price"
				v-mask="priceMask"
				label="Желаемая зарплата"
				inputmode="numeric"
				placeholder="50 000"
				class="form__item form__item--full"
			/>
			<XInputCheckbox
				v-model="agreement"
				required
				:errors="r$.$errors.agreement"
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
</template>
