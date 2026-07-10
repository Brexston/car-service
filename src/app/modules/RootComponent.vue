<script setup lang="ts">
import type { CaptchaConfig } from '@app/shared/captcha/captcha.types';
import type { Locale } from '@app/shared/composables/useI18n/useI18n';
import type { Docs } from '@app/shared/types/docs.types.ts';
import CookieToast from '@app/shared/components/widgets/CookieToast.vue';
import ModalCallback from '@app/shared/components/widgets/modals/ModalCallback.vue';
import calcAppProperties from '@app/shared/scripts/calcProperties';
import initMediaAutoWrapper from '@app/shared/scripts/mediaAutoWrapper';
import { initScrollToHash } from '@app/shared/scripts/scrollToHash';
import { useBaseStore } from '@app/shared/stores/base.store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
// import { useI18n } from '@app/shared/composables/useI18n/useI18n';

interface Props {
	csrfToken: string;
	captcha?: CaptchaConfig;
	locale?: Locale;
	docs: Docs;
}
const props = defineProps<Props>();
const { csrfToken, captcha, docs } = storeToRefs(useBaseStore());

csrfToken.value = props.csrfToken;
if (props.captcha)
	captcha.value = props.captcha;
docs.value = props.docs;

// #I18N
// const { initI18n } = useI18n();

// #CART
// const { requestCart } = useCartStore();

onMounted(() => {
	// SCRIPTS
	initMediaAutoWrapper();
	calcAppProperties();
	initScrollToHash();

	// #I18N
	// initI18n(props.locale || 'ru');

	// #CART
	// requestCart();
});
</script>

<template>
	<slot />

	<CookieToast />
	<ModalCallback />
</template>
