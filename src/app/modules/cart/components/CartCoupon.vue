<script setup lang="ts">
import type { CouponApplyPayload } from '@app/modules/cart/api/cart.api.types.ts';
import { CartApiKeys } from '@app/modules/cart/api/cart.api';
import { useCartStore } from '@app/modules/cart/store/cart.store';
import XInputText from '@app/shared/components/ui/inputs/XInputText.vue';
import { useApiStore } from '@app/shared/stores/api.store';
import { getValidationRules } from '@app/shared/utils/getValidationRules';
import { toastSuccess } from '@app/shared/utils/toast';
import { useRegle } from '@regle/core';
import { storeToRefs } from 'pinia';
import { computed, reactive } from 'vue';

const { coupons } = storeToRefs(useCartStore());
const { requestApplyCoupon, requestDeleteCoupon } = useCartStore();

const initialData: CouponApplyPayload = {
	coupon: '',
};

const formData = reactive({ ...initialData });

const { r$ } = useRegle({ formData }, () => ({
	formData: {
		coupon: getValidationRules(),
	},
}));

const { isPending } = useApiStore();
const isApplying = computed(() => isPending(CartApiKeys.APPLY_COUPON));
const isDeleting = computed(() => isPending(CartApiKeys.DELETE_COUPON));

async function onSubmit() {
	const { valid } = await r$.$validate();
	if (!valid)
		return;

	const response = await requestApplyCoupon(formData);
	if (!response.success)
		return;

	toastSuccess('Промокод применен');
	r$.$reset({ toInitialState: false });
}

async function onDelete() {
	if (!coupons.value?.[0]?.coupon)
		return;
	const response = await requestDeleteCoupon(coupons.value[0].coupon);
	if (!response.success)
		return;

	toastSuccess('Промокод удален');
}
</script>

<template>
	<form class="cart-coupon" :inert="isApplying || isDeleting" @submit.prevent="onSubmit">
		<span class="title title--h4 cart-coupon__title">Промокод</span>
		<XInputText
			v-if="coupons?.[0]?.coupon"
			class="cart-coupon__input"
			:model-value="coupons[0].coupon"
			disabled
		/>
		<XInputText
			v-else
			v-model="formData.coupon"
			class="cart-aside__promo-input"
			placeholder="Введите промокод"
			:errors="r$.$errors.formData.coupon"
		/>
		<button
			v-if="coupons.length"
			class="btn"
			type="button"
			:loading="isDeleting"
			@click="onDelete"
		>
			<span class="btn__text">
				Удалить
			</span>
		</button>
		<button
			v-else
			class="btn"
			type="submit"
			:loading="isApplying"
		>
			<span class="btn__text">
				Применить
			</span>
		</button>
	</form>
</template>

<style scoped lang="sass">
.cart-coupon
	display: grid
	align-content: flex-start
	gap: 16px
	padding: 20px
	background-color: var(--color-neutral-300)
</style>
