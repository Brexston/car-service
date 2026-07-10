import type { MaybeRefOrGetter } from 'vue';
import { checkedWithoutMessage, password, phone, required } from '@app/shared/consts/regleOptions';
import { email, exactLength, maxLength, minLength, sameAs, withMessage } from '@regle/rules';

export type InputTypes = 'phone' | 'email' | 'string' | 'checkbox' | 'text' | 'code' | 'password' | 'passwordConfirm' | 'file';

export function getValidationRules(inputType: InputTypes = 'string', isRequired = true, field?: MaybeRefOrGetter<string>) {
	const validators = {};
	switch (inputType) {
		case 'string': {
			Object.assign(validators, { maxLength: maxLength(100) });
			break;
		}
		case 'text': {
			Object.assign(validators, { maxLength: maxLength(1000) });
			break;
		}
		case 'email': {
			Object.assign(validators, {
				minLength: minLength(6),
				maxLength: maxLength(100),
				email,
			});
			break;
		}
		case 'checkbox': {
			if (isRequired)
				Object.assign(validators, { checked: checkedWithoutMessage });

			break;
		}
		case 'phone': {
			Object.assign(validators, { phone });
			break;
		}
		case 'code': {
			Object.assign(validators, { exactLength: withMessage(exactLength(6), 'Минимальное кол-во символов: 6') });
			break;
		}
		case 'password': {
			Object.assign(validators, { password });
			break;
		}
		case 'passwordConfirm': {
			Object.assign(validators, {
				password,
				sameAs: withMessage(sameAs(field ?? ''), 'Пароли не совпадают'),
			});
			break;
		}
	}

	if (isRequired && inputType !== 'checkbox')
		Object.assign(validators, { required });

	return validators;
}
