<script setup lang="ts">
import type { PromoOffer } from '@/types'

defineProps<{
	offer: PromoOffer
}>()
</script>

<template>
	<div class="aio-card-sm flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
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
			class="aio-btn-green-sm shrink-0"
		>
			{{ offer.ctaLabel }}
		</a>
	</div>
</template>
