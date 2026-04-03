<script setup lang="ts">
import type { PromoOffer } from '@/types'

defineProps<{
	offer: PromoOffer
}>()
</script>

<template>
	<div class="bg-white flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-200 group" style="border: 1px solid #E6EEFC; border-radius: 5px; box-shadow: 0px 5px 10px 0px rgba(0, 90, 224, 0.06); padding: 16px;">
		<!-- Icon -->
		<div
			class="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
			:style="{ backgroundColor: offer.iconBgColor }"
		>
			<img
				v-if="offer.iconUrl && offer.iconUrl !== '#'"
				:src="offer.iconUrl"
				:alt="offer.productName"
				class="w-6 h-6 object-contain"
			/>
			<span v-else class="text-white text-lg font-bold">{{ offer.productName.charAt(0) }}</span>
		</div>

		<!-- Content -->
		<div class="flex-1 min-w-0">
			<p class="font-semibold text-text-primary text-sm">{{ offer.productName }}</p>
			<p class="text-sm text-text-secondary line-clamp-2 mt-0.5">{{ offer.description }}</p>
		</div>

		<!-- CTA -->
		<a
			:href="offer.ctaUrl"
			class="shrink-0 inline-flex items-center text-white bg-brand-green hover:bg-brand-green/90 transition-all duration-200"
			style="border-radius: 4px; padding: 13.2px 20px; font-size: 16px; font-weight: 600;"
		>
			{{ offer.ctaLabel }}
		</a>
	</div>
</template>
