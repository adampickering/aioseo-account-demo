<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLicenses } from '@/composables/useLicenses'
import { useAiCredits } from '@/composables/useAiCredits'
import AddonCard from '@/components/AddonCard.vue'

const { licenses } = useLicenses()
const { credits, remaining } = useAiCredits()

const blcLicenses = computed(() => licenses.value.filter(l => l.product === 'broken-link-checker'))
const aioseoLicenses = computed(() => licenses.value.filter(l => l.product === 'aioseo'))
const hasCredits = computed(() => credits.value.total > 0)
const isElite = computed(() => aioseoLicenses.value.some(l => l.tier === 'elite'))

const showUpgradeOptions = ref(false)

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
		<!-- BLC licenses -->
		<template v-for="lic in blcLicenses" :key="lic.id">
			<div class="aio-card !p-0">
				<!-- Header: BLC icon + name + buttons -->
				<div class="px-10 pt-6 pb-4 flex items-center gap-3">
					<div class="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center shrink-0">
						<svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.07-9.07a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 006.364 6.364l1.757-1.757" />
						</svg>
					</div>
					<h2 class="text-lg font-heading font-bold text-brand-navy">Broken Link Checker</h2>
					<div class="ml-auto flex items-center gap-2">
						<a href="#" class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-btn hover:opacity-90 transition-all duration-200 no-underline">Upgrade License</a>
						<a href="#" class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-green rounded-btn hover:opacity-90 transition-all duration-200 no-underline inline-flex items-center gap-1.5">
							Broken Link Checker
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
						</a>
					</div>
				</div>
				<div class="border-t border-border"></div>

				<!-- Row 1: Plan Level, License, Expires -->
				<div class="px-10 py-5 grid grid-cols-3 gap-4">
					<div>
						<p class="text-sm text-text-muted mb-1">Plan Level</p>
						<p class="text-body text-brand-navy">{{ lic.tierLabel }}</p>
					</div>
					<div>
						<p class="text-sm text-text-muted mb-1">License</p>
						<p class="text-body text-brand-navy font-mono">{{ lic.licenseKey }}</p>
					</div>
					<div>
						<p class="text-sm text-text-muted mb-1">Expires</p>
						<p class="text-body text-brand-navy">{{ formatDate(lic.expiresAt) }}</p>
					</div>
				</div>
				<div class="border-t border-border"></div>

				<!-- Row 2: Site Activations, Links -->
				<div class="px-10 py-5 grid grid-cols-3 gap-4">
					<div>
						<p class="text-sm text-text-muted mb-1">Site Activations</p>
						<p class="text-body text-brand-navy">{{ lic.siteActivations.used }} / {{ lic.siteActivations.total }} <a href="#" class="aio-link underline ml-1">Manage Sites</a></p>
					</div>
					<div v-if="lic.links">
						<p class="text-sm text-text-muted mb-1">Links</p>
						<p class="text-body text-brand-navy">{{ formatNumber(lic.links.remaining || 0) }} / {{ formatNumber(lic.links.total || 0) }} Links Remaining</p>
					</div>
				</div>
			</div>
		</template>

		<!-- AI Credits -->
		<div v-if="hasCredits" class="aio-card !p-0">
			<div class="px-10 pt-6 pb-4 flex items-center gap-3">
				<div class="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center shrink-0">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path d="M0 9.07738V7.2619H6.35417V9.07738H0ZM0 5.44643V3.63095H9.98512V5.44643H0ZM0 1.81548V0H9.98512V1.81548H0Z" fill="white"/>
						<path d="M13.6909 2.59016C13.7875 2.32897 14.157 2.32897 14.2536 2.59016L14.6221 3.58603C14.6525 3.66815 14.7172 3.73289 14.7994 3.76328L15.7952 4.13178C16.0564 4.22843 16.0564 4.59785 15.7952 4.69449L14.7994 5.063C14.7172 5.09339 14.6525 5.15813 14.6221 5.24025L14.2536 6.23612C14.157 6.49731 13.7875 6.49731 13.6909 6.23612L13.3224 5.24025C13.292 5.15813 13.2273 5.09339 13.1451 5.063L12.1493 4.69449C11.8881 4.59785 11.8881 4.22843 12.1493 4.13178L13.1451 3.76328C13.2273 3.73289 13.292 3.66815 13.3224 3.58603L13.6909 2.59016Z" fill="white"/>
						<path d="M11.2698 7.52326C11.3873 7.20587 11.8362 7.20587 11.9536 7.52326L12.609 9.2945C12.806 9.8267 13.2256 10.2463 13.7578 10.4432L15.529 11.0987C15.8464 11.2161 15.8464 11.665 15.529 11.7825L13.7578 12.4379C13.2256 12.6348 12.806 13.0544 12.609 13.5866L11.9536 15.3578C11.8362 15.6752 11.3873 15.6752 11.2698 15.3578L10.6144 13.5866C10.4175 13.0544 9.99786 12.6348 9.46566 12.4379L7.69442 11.7825C7.37703 11.665 7.37703 11.2161 7.69442 11.0987L9.46566 10.4432C9.99786 10.2463 10.4175 9.8267 10.6144 9.2945L11.2698 7.52326Z" fill="white"/>
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
					<p class="text-sm text-text-muted mb-1">AI Credits</p>
					<p class="text-body text-brand-navy">{{ formatNumber(remaining) }} / {{ formatNumber(credits.total) }} AI Credits Remaining <a href="#" class="aio-link underline ml-1">Purchase Credits</a></p>
				</div>
				<div>
					<p class="text-sm text-text-muted mb-1">Expires</p>
					<p class="text-body text-brand-navy">{{ formatDate(credits.expiresAt) }}</p>
				</div>
			</div>
		</div>

		<!-- AIOSEO licenses -->
		<template v-for="lic in aioseoLicenses" :key="lic.id">
			<div class="aio-card !p-0">
				<!-- Header: AIOSEO logo + buttons -->
				<div class="px-10 pt-6 pb-4 flex items-center gap-3">
					<img src="/assets/icons/aioseo-logo.svg" alt="AIOSEO" class="w-8 h-8 rounded-full" />
					<h2 class="text-lg font-heading font-bold text-brand-navy">AIOSEO</h2>
					<div class="ml-auto flex items-center gap-2">
						<a v-if="lic.tier !== 'elite'" href="#" class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-btn hover:opacity-90 transition-all duration-200 no-underline">Upgrade License</a>
						<a href="#" class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-green rounded-btn hover:opacity-90 transition-all duration-200 no-underline inline-flex items-center gap-1.5">
							Download AIOSEO
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
						</a>
					</div>
				</div>
				<div class="border-t border-border"></div>

				<!-- Row 1: Plan Level, License, Expires -->
				<div class="px-10 py-5 grid grid-cols-3 gap-4">
					<div>
						<p class="text-sm text-text-muted mb-1">Plan Level</p>
						<p class="text-body text-brand-navy">{{ lic.tierLabel }}</p>
					</div>
					<div>
						<p class="text-sm text-text-muted mb-1">License</p>
						<div class="flex items-center gap-1.5">
							<p class="text-body text-brand-navy font-mono">{{ lic.licenseKey }}</p>
							<button class="text-brand-navy-40 hover:text-brand-navy cursor-pointer bg-transparent border-0 p-0.5" aria-label="Copy license key">
								<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
							</button>
						</div>
					</div>
					<div>
						<p class="text-sm text-text-muted mb-1">Expires</p>
						<p class="text-body text-brand-navy">{{ formatDate(lic.expiresAt) }}</p>
					</div>
				</div>
				<div class="border-t border-border"></div>

				<!-- Row 2: Site Activations, AI Credits -->
				<div class="px-10 py-5 grid grid-cols-3 gap-4">
					<div>
						<p class="text-sm text-text-muted mb-1">Site Activations</p>
						<p class="text-body text-brand-navy">{{ lic.siteActivations.used }} / {{ lic.siteActivations.total }} <a href="#" class="aio-link underline ml-1">Manage Sites</a></p>
					</div>
					<div v-if="lic.aiCredits">
						<p class="text-sm text-text-muted mb-1">AI Credits</p>
						<p class="text-body text-brand-navy">{{ formatNumber(lic.aiCredits.total - lic.aiCredits.used) }} / {{ formatNumber(lic.aiCredits.total) }} AI Credits Remaining <span class="text-brand-navy-40 mx-1">·</span> Running Low? <a href="#" class="aio-link underline">Add More</a></p>
					</div>
				</div>

				<!-- Addons section — light background -->
				<template v-if="lic.addons.length > 0">
					<div class="bg-bg-light px-10 py-6">
						<p class="text-sm text-text-muted mb-4">AIOSEO Addons</p>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
							<AddonCard
								v-for="addon in lic.addons"
								:key="addon.id"
								:addon="addon"
							/>
						</div>
					</div>
				</template>

				<!-- See/Hide Upgrade Options bar -->
				<div class="border-t border-border bg-gradient-to-r from-brand-blue-5 to-brand-blue-10 px-10 py-4 text-center rounded-b-card">
					<button
						@click="showUpgradeOptions = !showUpgradeOptions"
						class="text-brand-blue text-body font-medium hover:underline cursor-pointer bg-transparent border-0 inline-flex items-center gap-1"
					>
						{{ showUpgradeOptions ? 'Hide' : 'See' }} Upgrade Options
						<svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': showUpgradeOptions }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
						</svg>
					</button>
				</div>

				<!-- Upgrade section (expandable) -->
				<Transition
					enter-active-class="transition-all duration-300 ease-out"
					enter-from-class="max-h-0 opacity-0"
					enter-to-class="max-h-[500px] opacity-100"
					leave-active-class="transition-all duration-200 ease-in"
					leave-from-class="max-h-[500px] opacity-100"
					leave-to-class="max-h-0 opacity-0"
				>
					<div v-if="showUpgradeOptions && lic.tier !== 'elite'" class="overflow-hidden border-t border-border bg-white px-10 py-8 text-center rounded-b-card">
						<h3 class="text-xl font-heading font-bold text-brand-navy mb-2">
							{{ lic.tier === 'basic' ? 'Upgrade to Plus' : 'Upgrade to Elite' }}
						</h3>
						<p class="text-body text-brand-navy-60 mb-6">
							{{ lic.tier === 'basic' ? 'The Essential Toolkit for Growing Businesses' : 'Premier solution for smart business owners & agencies' }}
						</p>
						<div class="grid grid-cols-3 gap-4 mb-6 max-w-xl mx-auto text-left">
							<template v-if="lic.tier === 'basic'">
								<div class="flex items-center gap-2"><svg class="w-5 h-5 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg><span class="text-sm text-brand-navy">3 Websites</span></div>
								<div class="flex items-center gap-2"><svg class="w-5 h-5 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg><span class="text-sm text-brand-navy">25,000 AI Credits</span></div>
								<div class="flex items-center gap-2"><svg class="w-5 h-5 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg><span class="text-sm text-brand-navy">Dominate Local Search</span></div>
								<div class="flex items-center gap-2"><svg class="w-5 h-5 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg><span class="text-sm text-brand-navy">Rank in Google Images</span></div>
								<div class="flex items-center gap-2"><svg class="w-5 h-5 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg><span class="text-sm text-brand-navy">Boost Trust (E-E-A-T)</span></div>
								<div class="flex items-center gap-2"><svg class="w-5 h-5 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg><span class="text-sm text-brand-navy">Appear on Google Maps</span></div>
							</template>
							<template v-else>
								<div class="flex items-center gap-2"><svg class="w-5 h-5 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg><span class="text-sm text-brand-navy">100 Websites</span></div>
								<div class="flex items-center gap-2"><svg class="w-5 h-5 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg><span class="text-sm text-brand-navy">200,000 AI Credits</span></div>
								<div class="flex items-center gap-2"><svg class="w-5 h-5 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg><span class="text-sm text-brand-navy">WordPress Multisite-Ready</span></div>
								<div class="flex items-center gap-2"><svg class="w-5 h-5 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg><span class="text-sm text-brand-navy">Track Keyword Rankings</span></div>
								<div class="flex items-center gap-2"><svg class="w-5 h-5 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg><span class="text-sm text-brand-navy">Monitor Indexing Status</span></div>
								<div class="flex items-center gap-2"><svg class="w-5 h-5 text-brand-green shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg><span class="text-sm text-brand-navy">Spot Content Decay</span></div>
							</template>
						</div>
						<a href="#" class="px-8 py-3 text-sm font-semibold text-white bg-brand-blue rounded-btn hover:opacity-90 transition-all duration-200 no-underline inline-block">
							{{ lic.tier === 'basic' ? 'Upgrade to Plus' : 'Upgrade To Elite' }}
						</a>
					</div>
				</Transition>
			</div>
		</template>
	</div>
</template>
