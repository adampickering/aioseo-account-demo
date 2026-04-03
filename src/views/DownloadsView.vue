<script setup lang="ts">
import { computed } from 'vue'
import { useLicenses } from '@/composables/useLicenses'
import { useAiCredits } from '@/composables/useAiCredits'
import AddonCard from '@/components/AddonCard.vue'
import AddonIcon from '@/components/AddonIcon.vue'

const { licenses } = useLicenses()
const { credits, remaining } = useAiCredits()

const blcLicenses = computed(() => licenses.value.filter(l => l.product === 'broken-link-checker'))
const aioseoLicenses = computed(() => licenses.value.filter(l => l.product === 'aioseo'))
const hasCredits = computed(() => credits.value.total > 0)

const isElite = computed(() => aioseoLicenses.value.some(l => l.tier === 'elite'))

function formatNumber(n: number): string {
	return n.toLocaleString()
}

function formatDate(iso: string): string {
	if (!iso) return ''
	return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function truncateKey(key: string): string {
	if (key.length <= 16) return key
	return key.substring(0, 16) + '...'
}
</script>

<template>
	<div class="space-y-8">
		<!-- BLC licenses -->
		<template v-for="lic in blcLicenses" :key="lic.id">
			<div class="aio-card !p-0">
				<!-- Card header -->
				<div class="px-10 pt-6 pb-4 flex items-center gap-3">
					<div class="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center shrink-0">
						<span class="text-white font-bold text-sm">B</span>
					</div>
					<h2 class="text-lg font-heading font-bold text-brand-navy">Broken Link Checker</h2>
					<div class="ml-auto flex items-center gap-2">
						<a href="#" class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-btn hover:opacity-90 transition-all duration-200 no-underline">Upgrade License</a>
						<a href="#" class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-green rounded-btn hover:opacity-90 transition-all duration-200 no-underline inline-flex items-center gap-1.5">
							<span>Download Broken Link Checker</span>
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
						</a>
					</div>
				</div>
				<div class="border-t border-border"></div>

				<!-- License info grid -->
				<div class="px-10 py-5 grid grid-cols-3 gap-4">
					<div>
						<p class="text-base text-text-muted mb-1">Plan Level</p>
						<p class="text-body font-medium text-brand-navy">{{ lic.tierLabel }}</p>
					</div>
					<div>
						<p class="text-base text-text-muted mb-1">License</p>
						<p class="text-body text-brand-navy font-mono">{{ truncateKey(lic.licenseKey) }}</p>
					</div>
					<div>
						<p class="text-base text-text-muted mb-1">Expires</p>
						<p class="text-body text-brand-navy">{{ formatDate(lic.expiresAt) }}</p>
					</div>
				</div>
				<div class="border-t border-border"></div>
				<div class="px-10 py-5 grid grid-cols-3 gap-4">
					<div>
						<p class="text-base text-text-muted mb-1">Site Activations</p>
						<p class="text-body text-brand-navy">{{ lic.siteActivations.used }} / {{ lic.siteActivations.total }} <a href="#" class="aio-link underline ml-1">Manage Sites</a></p>
					</div>
					<div v-if="lic.links">
						<p class="text-base text-text-muted mb-1">Links</p>
						<p class="text-body text-brand-navy">{{ formatNumber(lic.links.remaining || 0) }} / {{ formatNumber(lic.links.total || 0) }} Links Remaining</p>
					</div>
				</div>
			</div>
		</template>

		<!-- AI Credits -->
		<div v-if="hasCredits" class="aio-card !p-0">
			<div class="px-10 pt-6 pb-4 flex items-center gap-3">
				<div class="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
					<svg class="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
					</svg>
				</div>
				<h2 class="text-lg font-heading font-bold text-brand-navy">AI Credits</h2>
				<div class="ml-auto">
					<a href="#" class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-green rounded-btn hover:opacity-90 transition-all duration-200 no-underline">Purchase Credits</a>
				</div>
			</div>
			<div class="border-t border-border"></div>
			<div class="px-10 py-5 grid grid-cols-2 gap-4">
				<div>
					<p class="text-base text-text-muted mb-1">AI Credits</p>
					<p class="text-body text-brand-navy">{{ formatNumber(remaining) }} / {{ formatNumber(credits.total) }} AI Credits Remaining</p>
				</div>
				<div>
					<p class="text-base text-text-muted mb-1">Expires</p>
					<p class="text-body text-brand-navy">{{ formatDate(credits.expiresAt) }}</p>
				</div>
			</div>
		</div>

		<!-- AIOSEO licenses — each card includes addons inside -->
		<template v-for="lic in aioseoLicenses" :key="lic.id">
			<div class="aio-card !p-0">
				<!-- Card header with logo + buttons -->
				<div class="px-10 pt-6 pb-4 flex items-center gap-3">
					<div class="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center shrink-0">
						<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-.5 3.5a.75.75 0 011.5 0v2h2a.75.75 0 010 1.5h-2v2a.75.75 0 01-1.5 0v-2h-2a.75.75 0 010-1.5h2v-2z"/></svg>
					</div>
					<h2 class="text-lg font-heading font-bold text-brand-navy">AIOSEO</h2>
					<div class="ml-auto flex items-center gap-2">
						<a v-if="!isElite" href="#" class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-btn hover:opacity-90 transition-all duration-200 no-underline">Upgrade License</a>
						<a href="#" class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-green rounded-btn hover:opacity-90 transition-all duration-200 no-underline inline-flex items-center gap-1.5">
							<span>Download AIOSEO</span>
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
						</a>
					</div>
				</div>
				<div class="border-t border-border"></div>

				<!-- License info -->
				<div class="px-10 py-5 grid grid-cols-3 gap-4">
					<div>
						<p class="text-base text-text-muted mb-1">Plan Level</p>
						<p class="text-body font-medium text-brand-navy">{{ lic.tierLabel }}</p>
					</div>
					<div>
						<p class="text-base text-text-muted mb-1">License</p>
						<p class="text-body text-brand-navy font-mono">{{ truncateKey(lic.licenseKey) }}</p>
					</div>
					<div>
						<p class="text-base text-text-muted mb-1">Expires</p>
						<p class="text-body text-brand-navy">{{ formatDate(lic.expiresAt) }}</p>
					</div>
				</div>
				<div class="border-t border-border"></div>
				<div class="px-10 py-5 grid grid-cols-3 gap-4">
					<div>
						<p class="text-base text-text-muted mb-1">Site Activations</p>
						<p class="text-body text-brand-navy">{{ lic.siteActivations.used }} / {{ lic.siteActivations.total }} <a href="#" class="aio-link underline ml-1">Manage Sites</a></p>
					</div>
					<div v-if="lic.aiCredits">
						<p class="text-base text-text-muted mb-1">AI Credits</p>
						<p class="text-body text-brand-navy">{{ formatNumber(lic.aiCredits.total - lic.aiCredits.used) }} / {{ formatNumber(lic.aiCredits.total) }} AI Credits Remaining</p>
					</div>
				</div>

				<!-- Addons inside the card -->
				<template v-if="lic.addons.length > 0">
					<div class="border-t border-border"></div>
					<div class="px-10 py-5">
						<p class="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">AIOSEO Addons</p>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
							<AddonCard
								v-for="addon in lic.addons"
								:key="addon.id"
								:addon="addon"
							/>
						</div>
					</div>
				</template>

				<!-- See Upgrade Options bar -->
				<div class="border-t border-border bg-gradient-to-r from-brand-blue-5 to-brand-blue-10 px-10 py-4 text-center rounded-b-card">
					<button class="text-brand-blue text-body font-medium hover:underline cursor-pointer bg-transparent border-0 inline-flex items-center gap-1">
						See Upgrade Options
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
						</svg>
					</button>
				</div>
			</div>
		</template>
	</div>
</template>
