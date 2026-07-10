import type { App } from 'vue';
import RootComponent from '@app/modules/RootComponent.vue';
import { defineAsyncComponent } from 'vue';

const components = [
	{ name: 'RootComponent', component: RootComponent },

	// #region CART
	{ name: 'CartView', component: defineAsyncComponent(() => import('@app/modules/cart/components/CartView.vue')) },
	// #endregion

	// #region FORMS
	{ name: 'FormContact', component: defineAsyncComponent(() => import('@app/modules/forms/components/FormContact.vue')) },
	{ name: 'FormVacancy', component: defineAsyncComponent(() => import('@app/modules/forms/components/FormVacancy.vue')) },
	// #endregion

	// #region MEDIA
	{ name: 'MediaView', component: defineAsyncComponent(() => import('@app/modules/media/components/MediaView.vue')) },
	// #endregion

	// #region INPUTS
	{ name: 'XInputCheckbox', component: defineAsyncComponent(() => import('@app/shared/components/ui/inputs/XInputCheckbox.vue')) },
	{ name: 'XInputCode', component: defineAsyncComponent(() => import('@app/shared/components/ui/inputs/XInputCode.vue')) },
	{ name: 'XInputDate', component: defineAsyncComponent(() => import('@app/shared/components/ui/inputs/XInputDate.vue')) },
	{ name: 'XInputField', component: defineAsyncComponent(() => import('@app/shared/components/ui/inputs/XInputField.vue')) },
	{ name: 'XInputFile', component: defineAsyncComponent(() => import('@app/shared/components/ui/inputs/XInputFile.vue')) },
	{ name: 'XInputPassword', component: defineAsyncComponent(() => import('@app/shared/components/ui/inputs/XInputPassword.vue')) },
	{ name: 'XInputRadio', component: defineAsyncComponent(() => import('@app/shared/components/ui/inputs/XInputRadio.vue')) },
	{ name: 'XInputRange', component: defineAsyncComponent(() => import('@app/shared/components/ui/inputs/XInputRange.vue')) },
	{ name: 'XInputSearch', component: defineAsyncComponent(() => import('@app/shared/components/ui/inputs/XInputSearch.vue')) },
	{ name: 'XInputSelect', component: defineAsyncComponent(() => import('@app/shared/components/ui/inputs/XInputSelect.vue')) },
	{ name: 'XInputSwitch', component: defineAsyncComponent(() => import('@app/shared/components/ui/inputs/XInputSwitch.vue')) },
	{ name: 'XInputText', component: defineAsyncComponent(() => import('@app/shared/components/ui/inputs/XInputText.vue')) },
	{ name: 'XInputTextarea', component: defineAsyncComponent(() => import('@app/shared/components/ui/inputs/XInputTextarea.vue')) },
	// #endregion

	// #region MODALS
	{ name: 'XModal', component: defineAsyncComponent(() => import('@app/shared/components/ui/modals/XModal.vue')) },
	{ name: 'XModalGallery', component: defineAsyncComponent(() => import('@app/shared/components/ui/modals/XModalGallery.vue')) },
	{ name: 'XModalVideo', component: defineAsyncComponent(() => import('@app/shared/components/ui/modals/XModalVideo.vue')) },
	// #endregion

	// #region SLIDERS
	{ name: 'XSlider', component: defineAsyncComponent(() => import('@app/shared/components/ui/sliders/XSlider.vue')) },
	{ name: 'XSliderContent', component: defineAsyncComponent(() => import('@app/shared/components/ui/sliders/XSliderContent.vue')) },
	{ name: 'XSliderGallery', component: defineAsyncComponent(() => import('@app/shared/components/ui/sliders/XSliderGallery.vue')) },
	{ name: 'SliderHero', component: defineAsyncComponent(() => import('@app/shared/components/widgets/sliders/SliderHero.vue')) },
	// #endregion

	// #region TRANSITIONS
	{ name: 'XTransitionFade', component: defineAsyncComponent(() => import('@app/shared/components/ui/transitions/XTransitionFade.vue')) },
	{ name: 'XTransitionScale', component: defineAsyncComponent(() => import('@app/shared/components/ui/transitions/XTransitionScale.vue')) },
	// #endregion

	// #region UI
	{ name: 'XAccordion', component: defineAsyncComponent(() => import('@app/shared/components/ui/XAccordion.vue')) },
	{ name: 'XDropdown', component: defineAsyncComponent(() => import('@app/shared/components/ui/XDropdown.vue')) },
	{ name: 'XImage', component: defineAsyncComponent(() => import('@app/shared/components/ui/XImage.vue')) },
	{ name: 'XLoader', component: defineAsyncComponent(() => import('@app/shared/components/ui/XLoader.vue')) },
	{ name: 'XPagination', component: defineAsyncComponent(() => import('@app/shared/components/ui/XPagination.vue')) },
	{ name: 'XShowMore', component: defineAsyncComponent(() => import('@app/shared/components/ui/XShowMore.vue')) },
	{ name: 'XTabs', component: defineAsyncComponent(() => import('@app/shared/components/ui/XTabs.vue')) },
	{ name: 'XVideo', component: defineAsyncComponent(() => import('@app/shared/components/ui/XVideo.vue')) },
	// #endregion

	// #region OTHER
	{ name: 'UiPreview', component: defineAsyncComponent(() => import('@app/shared/components/ui/XUiPreview.vue')) },
	{ name: 'ContactsMap', component: defineAsyncComponent(() => import('@app/modules/contacts/components/ContactsMap.vue')) },
	// #endregion

	// #region USER
	{ name: 'AuthView', component: defineAsyncComponent(() => import('@app/modules/user/components/auth/AuthView.vue')) },
	// #endregion
];

export default {
	install(app: App<Element>) {
		components.forEach(({ name, component }) => {
			app.component(name, component);
		});
	},
};
