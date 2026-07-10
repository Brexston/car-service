<script setup lang="ts">
import ModalDialog from './ModalDialog.vue';

interface Props {
	open: boolean;
	title?: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	danger?: boolean;
}

const {
	open,
	title = 'Подтверждение',
	message,
	confirmLabel = 'Да',
	cancelLabel = 'Отмена',
	danger = false,
} = defineProps<Props>();

const emit = defineEmits<{
	'update:open': [value: boolean];
	'confirm': [];
}>();

function confirm() {
	emit('confirm');
	emit('update:open', false);
}
</script>

<template>
	<ModalDialog :open="open" :title="title" @update:open="$emit('update:open', $event)">
		<p class="text-ios-muted leading-relaxed">
			{{ message }}
		</p>
		<template #footer>
			<button type="button" class="btn-ghost" @click="$emit('update:open', false)">
				{{ cancelLabel }}
			</button>
			<button
				type="button"
				class="font-semibold rounded-ios-sm px-5 py-2.5 transition-opacity active:opacity-80"
				:class="danger ? 'bg-ios-red text-white' : 'btn-accent'"
				@click="confirm"
			>
				{{ confirmLabel }}
			</button>
		</template>
	</ModalDialog>
</template>
