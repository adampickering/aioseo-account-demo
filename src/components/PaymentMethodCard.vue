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

const brandName = computed(() => {
	switch (props.method.brand) {
		case 'visa': return 'Visa'
		case 'mastercard': return 'Mastercard'
		case 'amex': return 'American Express'
		case 'discover': return 'Discover'
	}
})
</script>

<template>
	<div class="flex items-center gap-4 py-4">
		<!-- Card brand SVG logo -->
		<div class="w-16 h-10 rounded-btn border border-border flex items-center justify-center shrink-0 bg-white">
			<!-- Visa -->
			<svg v-if="method.brand === 'visa'" viewBox="0 0 48 16" class="w-12 h-4" fill="none">
				<path d="M19.5 1.2L16.2 14.8H13L16.3 1.2H19.5ZM33.8 9.8L35.4 5.2L36.3 9.8H33.8ZM37.2 14.8H40L37.6 1.2H34.9C34.2 1.2 33.6 1.6 33.3 2.2L28.4 14.8H31.8L32.5 12.8H36.6L37.2 14.8ZM29.2 10.2C29.2 6.5 24 6.3 24 4.6C24 4 24.5 3.4 25.6 3.2C26.1 3.2 27.6 3.1 29.3 3.9L30 1.5C29.1 1.2 27.9 0.8 26.5 0.8C23.3 0.8 21 2.5 21 5C21 6.8 22.6 7.8 23.8 8.4C25.1 9 25.5 9.5 25.5 10.1C25.5 11 24.4 11.5 23.4 11.5C21.5 11.5 20.4 11 19.5 10.5L18.8 13C19.8 13.5 21.5 13.9 23.3 13.9C26.7 14 29.2 12.3 29.2 10.2ZM14.3 1.2L9.1 14.8H5.6L3.1 3.6C2.9 2.8 2.8 2.5 2.1 2.1C1 1.5 -0.6 1 0 0.8L0.1 1.2H5.1C5.9 1.2 6.5 1.7 6.7 2.6L7.9 9.4L11.2 1.2H14.3Z" fill="#1A1F71"/>
			</svg>
			<!-- Mastercard -->
			<svg v-else-if="method.brand === 'mastercard'" viewBox="0 0 40 24" class="w-10 h-6" fill="none">
				<circle cx="15" cy="12" r="10" fill="#EB001B"/>
				<circle cx="25" cy="12" r="10" fill="#F79E1B"/>
				<path d="M20 4.6C22.2 6.4 23.6 9 23.6 12C23.6 15 22.2 17.6 20 19.4C17.8 17.6 16.4 15 16.4 12C16.4 9 17.8 6.4 20 4.6Z" fill="#FF5F00"/>
			</svg>
			<!-- Amex -->
			<svg v-else-if="method.brand === 'amex'" viewBox="0 0 40 14" class="w-10 h-3.5">
				<rect width="40" height="14" rx="2" fill="#2E77BC"/>
				<text x="20" y="10.5" text-anchor="middle" fill="white" font-size="7" font-weight="700" font-family="Arial">AMEX</text>
			</svg>
			<!-- Discover -->
			<svg v-else viewBox="0 0 48 14" class="w-12 h-3.5">
				<rect width="48" height="14" rx="2" fill="#FF6000"/>
				<text x="24" y="10.5" text-anchor="middle" fill="white" font-size="6" font-weight="700" font-family="Arial">DISCOVER</text>
			</svg>
		</div>

		<!-- Card details -->
		<div class="flex-1 min-w-0">
			<p class="text-body font-medium text-brand-navy">{{ brandName }} ending in {{ method.last4 }}</p>
			<p class="text-sm text-brand-navy-40 mt-0.5">Expiry {{ method.expiresAt }}</p>
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-2 shrink-0">
			<button
				@click="$emit('delete', method.id)"
				class="px-5 py-2.5 text-sm font-semibold text-brand-navy bg-white border border-[#E9EAEB] rounded-btn hover:bg-gray-50 transition-all duration-200 cursor-pointer"
			>
				Delete
			</button>
			<button
				v-if="!method.isDefault"
				@click="$emit('makeDefault', method.id)"
				class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-btn hover:opacity-90 transition-all duration-200 cursor-pointer"
			>
				Make Default
			</button>
			<span
				v-else
				class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-btn"
			>
				Make Default
			</span>
		</div>
	</div>
</template>
