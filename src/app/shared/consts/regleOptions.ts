import type { Maybe } from '@regle/core';
import type { required as defaultRequired } from '@regle/rules';
import { createRule, defineRegleOptions } from '@regle/core';
import { email, integer, isFilled, maxLength, maxValue, minLength, minValue, withMessage } from '@regle/rules';

export const required = createRule({
	type: 'required',
	validator(value: Maybe<unknown>, _withoutMessage?: boolean) {
		return isFilled(value, true, false);
	},
	message({ $params: [withoutMessage] }) {
		return withoutMessage ? [''] : 'Поле обязательно для заполнения';
	},
	required: true,
});

export const phone = createRule({
	validator(value: Maybe<string>) {
		if (!isFilled(value) || minLength(18).exec(value))
			return true;

		return false;
	},
	message: 'Некорректный номер телефона',
});

export const password = createRule({
	validator(value: Maybe<string>) {
		if (!value || value.length < 6) {
			return {
				$valid: false,
				message: 'Минимальное кол-во символов: 6',
			};
		}

		if (value.length > 30) {
			return {
				$valid: false,
				message: 'Максимальное кол-во символов: 30',
			};
		}

		return true;
	},
	message({ message }) {
		return message as string;
	},
});

export const checkedWithoutMessage = createRule({
	type: 'checked',
	validator(value: unknown) {
		return value === true;
	},
	message() {
		return [''];
	},
	required: true,
});

const regleOptions = defineRegleOptions({
	rules: () => ({
		required: required as unknown as typeof defaultRequired,
		minLength: withMessage(minLength, ({ $params: [min] }) => `Минимальное кол-во символов: ${min}`),
		maxLength: withMessage(maxLength, ({ $params: [max] }) => `Максимальное кол-во символов: ${max}`),
		minValue: withMessage(minValue, ({ $params: [min] }) => `Значение должно быть не меньше ${min}`),
		maxValue: withMessage(maxValue, ({ $params: [max] }) => `Значение должно быть не больше ${max}`),
		integer: withMessage(integer, 'Значение должно быть числом'),
		email: withMessage(email, 'Неверный формат email'),
		phone,
		password,
	}),
});

export default regleOptions;
