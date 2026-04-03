<script setup lang="ts">
import { computed } from 'vue'
import type { UpgradeOffer } from '@/types'
import CountdownTimer from './CountdownTimer.vue'

const props = defineProps<{
	offer: UpgradeOffer
}>()

const borderColor = computed(() => {
	switch (props.offer.ctaColor) {
		case 'green': return 'border-t-brand-green'
		case 'blue': return 'border-t-brand-blue'
		case 'amber': return 'border-t-brand-amber'
	}
})

const buttonColor = computed(() => {
	switch (props.offer.ctaColor) {
		case 'green': return 'bg-brand-green hover:bg-brand-green/90'
		case 'blue': return 'bg-brand-blue hover:bg-brand-blue/90'
		case 'amber': return 'bg-brand-amber hover:bg-brand-amber/90'
	}
})

const badgeColor = computed(() => {
	switch (props.offer.ctaColor) {
		case 'green': return 'bg-brand-green/10 text-brand-green'
		case 'blue': return 'bg-brand-blue-10 text-brand-blue'
		case 'amber': return 'bg-amber-100 text-brand-amber'
	}
})
</script>

<template>
	<div class="relative bg-white border-t-4 overflow-hidden transition-all duration-200" :class="borderColor" style="border-radius: 5px; box-shadow: 0px 5px 10px 0px rgba(0, 90, 224, 0.06); border-right: 1px solid #E6EEFC; border-bottom: 1px solid #E6EEFC; border-left: 1px solid #E6EEFC;">
		<!-- Badge -->
		<div class="absolute top-4 right-4">
			<span class="text-[11px] font-semibold px-2.5 py-1 rounded-full" :class="badgeColor">
				{{ offer.badgeText }}
			</span>
		</div>

		<div class="p-6 pt-8">
			<!-- Title -->
			<h3 class="font-heading font-bold text-xl text-text-primary mb-3 pr-28">{{ offer.title }}</h3>

			<!-- Countdown -->
			<div class="mb-4">
				<CountdownTimer :expires-at="offer.expiresAt" />
			</div>

			<!-- Pricing -->
			<div class="flex items-baseline gap-2 mb-1">
				<span class="text-sm text-text-muted line-through">{{ offer.originalPrice }}</span>
				<span class="text-2xl font-bold text-text-primary">{{ offer.currentPrice }}</span>
			</div>
			<p class="text-sm text-text-secondary mb-5">{{ offer.subtitle }}</p>

			<!-- Value label -->
			<p class="text-xs font-semibold uppercase tracking-wider text-brand-green mb-3">{{ offer.valueLabel }}</p>

			<!-- Feature grid -->
			<div class="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-6">
				<div
					v-for="feature in offer.features"
					:key="feature.label"
					class="flex items-start gap-2"
				>
					<svg class="w-4 h-4 text-brand-green shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
					</svg>
					<span class="text-sm text-text-secondary">{{ feature.label }}</span>
				</div>
			</div>

			<!-- CTA -->
			<a
				:href="offer.ctaUrl"
				class="block w-full text-center text-white transition-all duration-200"
				style="border-radius: 4.5px; padding: 14.85px 22.5px; font-size: 18px; font-weight: 600;"
				:class="buttonColor"
			>
				{{ offer.ctaLabel }}
			</a>
		</div>
	</div>
</template>
