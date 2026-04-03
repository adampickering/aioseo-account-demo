<script setup lang="ts">
import IframeEmbed from '@/components/IframeEmbed.vue'
import { pastWinners } from '@/data/giveaway'
</script>

<template>
	<div class="space-y-10">
		<!-- Header -->
		<div>
			<h2 class="text-2xl font-heading font-semibold text-text-primary mb-3">Monthly Giveaway</h2>
			<p class="text-text-secondary">
				A new giveaway is posted at the beginning of every month, so don't forget to check back!
				<a href="#past-winners" class="text-brand-blue hover:underline">See past winners</a>
			</p>
		</div>

		<!-- Giveaway embed -->
		<IframeEmbed
			src="#"
			title="Monthly Giveaway"
			placeholder="RafflePress — Monthly Giveaway Widget"
			height="700px"
		/>

		<!-- Past Winners -->
		<section id="past-winners">
			<h3 class="text-xl font-heading font-semibold text-text-primary mb-5">Past Winners</h3>

			<div class="divide-y divide-gray-100">
				<div
					v-for="entry in pastWinners"
					:key="entry.date"
					class="py-4 first:pt-0 last:pb-0"
				>
					<div class="flex flex-wrap items-baseline gap-x-2">
						<span class="text-sm font-semibold text-text-primary">{{ entry.date }}:</span>
						<span class="text-sm text-text-primary">{{ entry.prize }}</span>
						<span class="text-sm text-text-muted">&mdash;</span>
						<span class="text-sm text-text-secondary">{{ entry.winner }} | {{ entry.country }}</span>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
