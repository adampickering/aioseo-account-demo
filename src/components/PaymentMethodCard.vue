<script setup lang="ts">
import { computed } from 'vue'
import type { PaymentMethod } from '@/types'

const props = defineProps<{
	method: PaymentMethod
}>()

defineEmits<{
	delete: [id: string]
	makeDefault: [id: string]
}>()

const brandLabel = computed(() => {
	switch (props.method.brand) {
		case 'visa': return 'VISA'
		case 'mastercard': return 'MC'
		case 'amex': return 'AMEX'
		case 'discover': return 'DISC'
	}
})

const brandColors = computed(() => {
	switch (props.method.brand) {
		case 'visa': return 'bg-blue-600 text-white'
		case 'mastercard': return 'bg-red-500 text-white'
		case 'amex': return 'bg-sky-500 text-white'
		case 'discover': return 'bg-orange-500 text-white'
	}
})

const brandName = computed(() => {
	switch (props.method.brand) {
		case 'visa': return 'Visa'
		case 'mastercard': return 'Mastercard'
		case 'amex': return 'American Express'
		case 'discover': return 'Discover'
	}
})

const formattedExpiry = computed(() => {
	return props.method.expiresAt
})
</script>

<template>
	<div class="bg-white flex items-center gap-4 transition-all duration-200" style="border: 1px solid #E6EEFC; border-radius: 5px; padding: 16px;">
		<!-- Brand badge -->
		<div class="w-14 h-9 rounded flex items-center justify-center text-[11px] font-bold tracking-wide shrink-0" :class="brandColors">
			{{ brandLabel }}
		</div>

		<!-- Card details -->
		<div class="flex-1 min-w-0">
			<p class="text-sm font-medium text-text-primary">{{ brandName }} ending in {{ method.last4 }}</p>
			<p class="text-xs text-text-muted mt-0.5">Expiry {{ formattedExpiry }}</p>
		</div>

		<!-- Default indicator or actions -->
		<div class="flex items-center gap-3 shrink-0">
			<span
				v-if="method.isDefault"
				class="inline-flex items-center gap-1 text-xs font-medium text-brand-green"
			>
				<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				Default
			</span>
			<button
				v-else
				@click="$emit('makeDefault', method.id)"
				class="px-3 py-1.5 text-xs font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue/90 transition-all duration-200 cursor-pointer"
			>
				Make Default
			</button>
			<button
				@click="$emit('delete', method.id)"
				class="px-3 py-1.5 text-xs font-medium text-brand-red hover:text-brand-red/80 hover:bg-brand-red/5 rounded-md transition-all duration-200 cursor-pointer"
			>
				Delete
			</button>
		</div>
	</div>
</template>
