<script setup lang="ts">
import ServicePricingCard from '@/components/ServicePricingCard.vue'

const services = [
	{
		title: 'Essential',
		baseOriginalPrice: 99,
		baseCurrentPrice: 49.50,
		timeSaved: 'Save 1 hour',
		features: [
			'AIOSEO Pro Installation',
			'Addon Installation (as per plan)',
		],
		cartUrl: '#',
	},
	{
		title: 'Advanced',
		baseOriginalPrice: 249,
		baseCurrentPrice: 124.50,
		timeSaved: 'Save 4+ hours',
		features: [
			'Everything in Essential +',
			'AIOSEO Pro Installation',
			'Basic AIOSEO Pro Configuration (addons not included)',
		],
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
				:base-original-price="service.baseOriginalPrice"
				:base-current-price="service.baseCurrentPrice"
				:time-saved="service.timeSaved"
				:features="service.features"
				:cart-url="service.cartUrl"
			/>
		</div>
	</div>
</template>
