<script setup lang="ts">
import type { PromoOffer } from '@/types'

defineProps<{
	offer: PromoOffer
}>()
</script>

<template>
	<div class="flex gap-5 items-start">
		<!-- Icon — 120x120 rounded square, matching Figma -->
		<div
			class="shrink-0 rounded-card flex items-center justify-center overflow-hidden"
			:style="{ backgroundColor: offer.iconBgColor, width: '120px', height: '120px' }"
		>
			<img
				v-if="offer.iconUrl && offer.iconUrl !== '#'"
				:src="offer.iconUrl"
				:alt="offer.productName"
				class="w-[53px] h-[53px] object-contain"
			/>
			<span v-else class="text-white text-2xl font-bold">{{ offer.productName.charAt(0) }}</span>
		</div>

		<!-- Content -->
		<div class="flex-1 min-w-0">
			<p class="font-bold text-brand-navy text-lg leading-[24px]">{{ offer.productName }}</p>
			<p class="text-sm text-brand-navy leading-[18px] mt-1">{{ offer.description }}</p>
			<a
				:href="offer.ctaUrl"
				class="inline-flex items-center justify-center bg-brand-green text-white rounded-btn-lg no-underline mt-3 text-[13.9px] font-semibold capitalize"
				style="padding: 10px 25px;"
			>
				{{ offer.ctaLabel }}
			</a>
		</div>
	</div>
</template>
