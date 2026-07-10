import { initCaptcha } from '@app/shared/captcha/captcha';
import { useBaseStore } from '@app/shared/stores/base.store';
import { storeToRefs } from 'pinia';

const { captcha } = storeToRefs(useBaseStore());
let isPreloaded = false;

export function useCaptchaPreload() {
	function preloadCaptcha() {
		if (isPreloaded || !captcha.value.key)
			return;
		isPreloaded = true;
		initCaptcha();
	}
	return {
		preloadCaptcha,
	};
}
