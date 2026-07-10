<script setup lang="ts">
import XSkeleton from '@app/shared/components/ui/XSkeleton.vue';

interface Props {
	id?: string;
	label?: string;
	required?: boolean;
	loading?: boolean;
	errors?: string[];
	tag?: 'label' | 'span';
}

const {
	tag = 'label',
	errors = [],
} = defineProps<Props>();
</script>

<template>
	<div class="default-input" :class="{ required }">
		<Component :is="tag" v-if="label" :for="id" class="default-input__label">
			<slot name="label" :label-value="label">
				<span class="default-input__label-text">{{ label }}</span>
			</slot>
		</Component>
		<div v-if="!loading" class="default-input__input">
			<slot />
			<slot name="action" />
		</div>
		<XSkeleton v-else loading>
			<div class="default-input__input"></div>
		</XSkeleton>
		<ul v-if="errors?.[0]" class="default-input__errors">
			<li class="default-input__error">
				{{ errors[0] }}
			</li>
		</ul>
		<div v-if="$slots.underInput" class="default-input__bottom">
			<slot name="underInput" />
		</div>
	</div>
</template>
