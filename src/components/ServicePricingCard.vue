<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
	title: string
	originalPrice: string
	currentPrice: string
	timeSaved: string
	features: string[]
	includes: string
	cartUrl: string
}>()

const siteCount = ref('1')
const siteOptions = ['1', '5', '10', '25']

// Parse price into dollar and cents parts
const priceParts = props.currentPrice.replace('$', '').split('.')
const priceDollars = priceParts[0]
const priceCents = priceParts[1] || '00'
</script>

<template>
	<div class="bg-white flex flex-col" style="border: 1px solid #E6EEFC; border-radius: 5px; box-shadow: 0px 5px 10px 0px rgba(0, 90, 224, 0.06); padding: 32px;">
		<!-- Title -->
		<h3 class="text-xl font-heading font-semibold text-text-primary text-center mb-6">
			{{ title }}
		</h3>

		<!-- Pricing -->
		<div class="text-center mb-4">
			<span class="text-sm text-text-light line-through">{{ originalPrice }}</span>
			<div class="flex items-start justify-center mt-1">
				<span class="text-lg font-semibold text-text-primary mt-2">$</span>
				<span class="text-5xl font-heading font-bold text-text-primary leading-none">{{ priceDollars }}</span>
				<span class="text-lg font-semibold text-text-primary mt-2">.{{ priceCents }}</span>
			</div>
		</div>

		<!-- Time saved badge -->
		<div class="flex justify-center mb-6">
			<span class="inline-flex items-center gap-1.5 bg-amber-100 text-brand-amber rounded-full px-3 py-1 text-sm font-medium">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				{{ timeSaved }}
			</span>
		</div>

		<!-- Includes -->
		<div class="mb-6">
			<label class="text-sm font-semibold text-text-primary mb-1.5 block">Includes:</label>
			<select
				v-model="siteCount"
				class="border border-[#D0D1D7] w-full text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all duration-200 appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23717680%22%20d%3D%22M3%204.5l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]"
				style="border-radius: 5px; padding: 12px 16px;"
			>
				<option v-for="opt in siteOptions" :key="opt" :value="opt">
					{{ opt }} {{ opt === '1' ? 'Site' : 'Sites' }}
				</option>
			</select>
		</div>

		<!-- Feature checklist -->
		<ul class="space-y-3 mb-6 flex-1">
			<li
				v-for="feature in features"
				:key="feature"
				class="flex items-start gap-2.5"
			>
				<svg class="w-5 h-5 text-brand-green shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
				</svg>
				<span class="text-sm text-text-secondary">{{ feature }}</span>
			</li>
		</ul>

		<!-- Terms link -->
		<p class="text-center mb-4">
			<a href="#" class="text-sm text-brand-blue hover:underline">See Terms and Conditions</a>
		</p>

		<!-- Add to Cart button -->
		<a
			:href="cartUrl"
			class="block w-full bg-brand-blue text-white text-center font-semibold hover:bg-brand-blue/90 transition-all duration-200"
			style="border-radius: 4.5px; padding: 14.85px 22.5px; font-size: 18px; font-weight: 600;"
		>
			Add to Cart
		</a>
	</div>
</template>
