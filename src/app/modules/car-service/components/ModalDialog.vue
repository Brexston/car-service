<script setup lang="ts">
import { X } from '@lucide/vue';
import { onMounted, onUnmounted, watch } from 'vue';

interface Props {
	open: boolean;
	title?: string;
}

const { open, title } = defineProps<Props>();

const emit = defineEmits<{
	'update:open': [value: boolean];
	'close': [];
}>();

function close() {
	emit('update:open', false);
	emit('close');
}

function onKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape')
		close();
}

watch(() => open, (isOpen) => {
	document.body.style.overflow = isOpen ? 'hidden' : '';
});

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => {
	window.removeEventListener('keydown', onKeydown);
	document.body.style.overflow = '';
});
</script>

<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition-opacity duration-200"
			leave-active-class="transition-opacity duration-150"
			enter-from-class="opacity-0"
			leave-to-class="opacity-0"
		>
			<div
				v-if="open"
				class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30"
				@click.self="close"
			>
				<Transition
					enter-active-class="transition-all duration-250"
					leave-active-class="transition-all duration-150"
					enter-from-class="opacity-0 translate-y-6"
					leave-to-class="opacity-0 translate-y-6"
				>
					<div
						v-if="open"
						class="bg-ios-card rounded-ios w-full max-w-md p-5"
						role="dialog"
						aria-modal="true"
					>
						<div class="flex items-center justify-between mb-4">
							<h2 v-if="title" class="text-lg font-bold text-ios-text">
								{{ title }}
							</h2>
							<button
								type="button"
								class="ml-auto p-2 rounded-full bg-ios-fill text-ios-muted transition-opacity active:opacity-60"
								aria-label="Закрыть"
								@click="close"
							>
								<X :size="18" />
							</button>
						</div>
						<slot />
						<div v-if="$slots.footer" class="mt-5 flex gap-2 justify-end">
							<slot name="footer" />
						</div>
					</div>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>
