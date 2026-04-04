<script setup lang="ts">
/**
 * Reusable product icon component.
 * Uses card-style SVGs (white rounded square with icon inside, border + shadow)
 * from public/assets/icons/
 *
 * Usage: <ProductIcon product="aioseo" />
 *        <ProductIcon product="blc" />
 *        <ProductIcon product="ai-credits" />
 */
const props = defineProps<{
	product: 'aioseo' | 'blc' | 'ai-credits'
	size?: number
}>()

const baseUrl = import.meta.env.BASE_URL

const iconMap: Record<string, string> = {
	'aioseo': 'product-aioseo-card.svg',
	'blc': 'product-blc-card.svg',
	'ai-credits': 'product-ai-credits-card.svg',
}
</script>

<template>
	<img
		:src="baseUrl + 'assets/icons/' + iconMap[product]"
		:alt="product === 'aioseo' ? 'AIOSEO' : product === 'blc' ? 'Broken Link Checker' : 'AI Credits'"
		class="shrink-0"
		:style="{ width: (size || 46) + 'px', height: (size || 46) + 'px' }"
	/>
</template>
