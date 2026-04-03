<script setup lang="ts">
import { computed } from 'vue'
import { useLicenses } from '@/composables/useLicenses'
import { useAiCredits } from '@/composables/useAiCredits'
import LicenseCard from '@/components/LicenseCard.vue'
import AddonCard from '@/components/AddonCard.vue'

const { licenses } = useLicenses()
const { credits, remaining } = useAiCredits()

const blcLicenses = computed(() => licenses.value.filter(l => l.product === 'broken-link-checker'))
const aioseoLicenses = computed(() => licenses.value.filter(l => l.product === 'aioseo'))
const hasCredits = computed(() => credits.value.total > 0)

function formatNumber(n: number): string {
	return n.toLocaleString()
}

function formatDate(iso: string): string {
	if (!iso) return ''
	return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
</script>

<template>
	<div class="space-y-8">
		<!-- BLC licenses first (if any) -->
		<template v-for="lic in blcLicenses" :key="lic.id">
			<LicenseCard :license="lic" />
		</template>

		<!-- AI Credits section -->
		<div v-if="hasCredits" class="aio-card">
			<div class="flex items-center gap-3 mb-4">
				<div class="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
					<svg class="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
					</svg>
				</div>
				<h2 class="text-h3 font-heading font-semibold text-brand-navy">AI Credits</h2>
				<div class="ml-auto">
					<a href="#" class="aio-btn-green-sm no-underline">Purchase Credits</a>
				</div>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<p class="text-xs uppercase tracking-wider text-text-muted mb-1">AI Credits</p>
					<p class="text-body text-brand-navy">{{ formatNumber(remaining) }} / {{ formatNumber(credits.total) }} AI Credits Remaining</p>
				</div>
				<div>
					<p class="text-xs uppercase tracking-wider text-text-muted mb-1">Expires</p>
					<p class="text-body text-brand-navy">{{ formatDate(credits.expiresAt) }}</p>
				</div>
			</div>
		</div>

		<!-- AIOSEO licenses -->
		<template v-for="lic in aioseoLicenses" :key="lic.id">
			<LicenseCard :license="lic" />

			<!-- Addons grid below each AIOSEO license -->
			<div v-if="lic.addons.length > 0" class="space-y-4">
				<h3 class="text-body font-semibold text-text-muted uppercase tracking-wider">AIOSEO Addons</h3>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
					<AddonCard
						v-for="addon in lic.addons"
						:key="addon.id"
						:addon="addon"
					/>
				</div>
			</div>
		</template>

		<!-- See Upgrade Options -->
		<div class="text-center">
			<button class="text-brand-blue text-body font-medium hover:underline cursor-pointer bg-transparent border-0 inline-flex items-center gap-1">
				See Upgrade Options
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
				</svg>
			</button>
		</div>
	</div>
</template>
