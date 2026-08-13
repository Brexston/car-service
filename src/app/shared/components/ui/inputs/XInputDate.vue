<script setup lang="ts">
import type { TimeModel } from '@vuepic/vue-datepicker';
import XInputField from '@app/shared/components/ui/inputs/XInputField.vue';
import XIcon from '@app/shared/components/ui/XIcon.vue';
import { getParsedDate } from '@app/shared/utils/getParsedDate';
import { VueDatePicker, WeekStart } from '@vuepic/vue-datepicker';
import { ru } from 'date-fns/locale';
import { computed, useId } from 'vue';

interface Props {
	id?: string;
	label?: string;
	placeholder?: string;
	title?: string;
	required?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	errors?: string[];
	isRange?: boolean;
	isTimePicker?: boolean;
	minDate?: string;
	maxDate?: string;
	minTime?: TimeModel;
	maxTime?: TimeModel;
	dateMask?: string;
	timeMask?: string;
	multiCalendars?: boolean;
}

const {
	id,
	isRange,
	isTimePicker,
	dateMask = 'dd.MM.yyyy',
	timeMask = 'HH:mm',
} = defineProps<Props>();

const modelValue = defineModel<string | null>();

const dateMaskLocale = dateMask + (isTimePicker ? `, ${timeMask}` : '');

const inputId = id ?? useId();

const getInputMask = computed(() => {
	const datePart = dateMask.replaceAll(/\w/g, '#');
	const timePart = timeMask.replaceAll(/\w/g, '#');
	const singleMask = isTimePicker ? `${datePart}, ${timePart}` : datePart;

	if (isRange) {
		return `${singleMask} - ${singleMask}`;
	}
	return singleMask;
});
</script>

<template>
	<XInputField :id="inputId" :label :errors :required>
		<template v-if="$slots.label" #label="{ labelValue }">
			<slot name="label" :label-value />
		</template>

		<VueDatePicker
			v-model="modelValue"
			:model-type="dateMask"
			:min-date="getParsedDate(minDate)"
			:max-date="getParsedDate(maxDate)"
			:formats="{ input: dateMaskLocale, preview: dateMaskLocale }"
			:range="isRange"
			:multi-calendars="multiCalendars"
			:time-config="{
				enableTimePicker: isTimePicker,
				timePickerInline: isTimePicker,
			}"
			:input-attrs="{ clearable: true }"
			:max-time
			:min-time
			text-input
			auto-apply
			:locale="ru"
			:week-start="WeekStart.Monday"
		>
			<template #dp-input="{ value, onInput, onEnter, onTab, onFocus, onBlur, onPaste }">
				<div class="input">
					<input
						:id="inputId"
						v-mask
						:data-maska="getInputMask"
						:value
						:placeholder
						:disabled="disabled || readonly"
						:readonly
						:title
						type="text"
						class="input__input input__input--date"
						:class="[{ error: errors?.length }, { disabled }]"
						@input="onInput"
						@keydown.enter="onEnter"
						@keydown.tab="onTab"
						@focus="onFocus"
						@blur="onBlur"
						@paste="onPaste"
					>
					<span v-if="!modelValue?.length" class="input__icon input__icon--date">
						<XIcon class="input__icon-image" name="calendar" />
					</span>
				</div>
			</template>
		</VueDatePicker>

		<template v-if="$slots.action" #action>
			<slot name="action" />
		</template>
	</XInputField>
</template>

<style lang="sass">
@import '@vuepic/vue-datepicker/dist/main.css'
@import '@styles/x-input-date'
</style>
