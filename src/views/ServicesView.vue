<script setup lang="ts">
import ServicePricingCard from '@/components/ServicePricingCard.vue'

const services = [
	{
		title: 'Essential',
		originalPrice: '$99.00',
		currentPrice: '$49.50',
		timeSaved: 'Save 1 hour',
		features: [
			'AIOSEO Pro Installation',
			'Addon Installation (as per plan)',
		],
		includes: '1 Site',
		cartUrl: '#',
	},
	{
		title: 'Advanced',
		originalPrice: '$249.00',
		currentPrice: '$124.50',
		timeSaved: 'Save 4+ hours',
		features: [
			'Everything in Essential +',
			'AIOSEO Pro Installation',
			'Basic AIOSEO Pro Configuration (addons not included)',
		],
		includes: '1 Site',
		cartUrl: '#',
	},
]
</script>

<template>
	<div class="space-y-10">
		<!-- Header -->
		<div class="text-center">
			<h2 class="text-2xl font-heading font-semibold text-text-primary">
				Fast-Track Your Way to Higher Rankings
			</h2>
			<p class="text-text-secondary mt-3 max-w-2xl mx-auto">
				Let our trusted experts install and configure AIOSEO for you, ensuring your site is perfectly optimized from the start.
			</p>
		</div>

		<!-- Pricing cards grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
			<ServicePricingCard
				v-for="service in services"
				:key="service.title"
				:title="service.title"
				:original-price="service.originalPrice"
				:current-price="service.currentPrice"
				:time-saved="service.timeSaved"
				:features="service.features"
				:includes="service.includes"
				:cart-url="service.cartUrl"
			/>
		</div>
	</div>
</template>
