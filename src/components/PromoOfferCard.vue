<script setup lang="ts">
import type { PromoOffer } from '@/types'

defineProps<{
	offer: PromoOffer
}>()
</script>

<template>
	<div class="flex gap-5 items-start">
		<!-- Icon — large rounded square -->
		<div
			class="shrink-0 rounded-xl flex items-center justify-center"
			:style="{ backgroundColor: offer.iconBgColor, width: '80px', height: '80px' }"
		>
			<img
				v-if="offer.iconUrl && offer.iconUrl !== '#'"
				:src="offer.iconUrl"
				:alt="offer.productName"
				class="w-10 h-10 object-contain"
				style="filter: brightness(0) invert(1);"
			/>
			<span v-else class="text-white text-2xl font-bold">{{ offer.productName.charAt(0) }}</span>
		</div>

		<!-- Content -->
		<div class="flex-1 min-w-0">
			<p class="font-bold text-brand-navy text-base">{{ offer.productName }}</p>
			<p class="text-sm text-brand-navy-60 mt-1 leading-relaxed">{{ offer.description }}</p>
			<a
				:href="offer.ctaUrl"
				class="aio-btn-green-sm no-underline inline-flex mt-3"
			>
				{{ offer.ctaLabel }}
			</a>
		</div>
	</div>
</template>
