<script setup lang="ts">
import { computed } from 'vue'
import type { PaymentMethod } from '@/types'

const baseUrl = import.meta.env.BASE_URL

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
		<!-- Card brand logo from svg-credit-card-payment-icons -->
		<img
			:src="baseUrl + `assets/icons/card-${method.brand}.svg`"
			:alt="brandName"
			class="w-14 h-9 shrink-0 rounded-btn"
		/>

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
