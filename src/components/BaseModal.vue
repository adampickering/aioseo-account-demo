<script setup lang="ts">
defineProps<{
	title: string
	show: boolean
}>()

defineEmits<{
	close: []
}>()
</script>

<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div v-if="show" class="fixed inset-0 z-[200] flex items-center justify-center p-4" @click.self="$emit('close')">
				<!-- Backdrop -->
				<div class="absolute inset-0 bg-brand-navy/40"></div>

				<!-- Modal panel -->
				<Transition
					enter-active-class="transition duration-200 ease-out"
					enter-from-class="opacity-0 scale-95 translate-y-2"
					enter-to-class="opacity-100 scale-100 translate-y-0"
					leave-active-class="transition duration-150 ease-in"
					leave-from-class="opacity-100 scale-100 translate-y-0"
					leave-to-class="opacity-0 scale-95 translate-y-2"
				>
					<div v-if="show" class="relative bg-white rounded-card shadow-xl w-full max-w-lg z-10" role="dialog" :aria-label="title">
						<!-- Header -->
						<div class="flex items-center justify-between px-8 pt-8 pb-4">
							<h2 class="text-h3 font-heading font-semibold text-brand-navy">{{ title }}</h2>
							<button
								@click="$emit('close')"
								class="p-1 text-brand-navy-40 hover:text-brand-navy transition-colors duration-200 cursor-pointer rounded-btn"
								aria-label="Close"
							>
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<div class="border-t border-border"></div>

						<!-- Content -->
						<div class="px-8 py-6">
							<slot />
						</div>

						<!-- Footer -->
						<div v-if="$slots.footer" class="border-t border-border px-8 py-5 flex items-center justify-end gap-3">
							<slot name="footer" />
						</div>
					</div>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>
