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
				<div class="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 22" fill="none">
						<path d="M5.43949 2.83408C5.70916 1.72197 7.29084 1.72197 7.56051 2.83408L8.30252 5.89413C8.3988 6.29118 8.70882 6.6012 9.10587 6.69748L12.1659 7.43949C13.278 7.70916 13.278 9.29084 12.1659 9.56051L9.10587 10.3025C8.70882 10.3988 8.3988 10.7088 8.30252 11.1059L7.56051 14.1659C7.29084 15.278 5.70916 15.278 5.43949 14.1659L4.69748 11.1059C4.6012 10.7088 4.29118 10.3988 3.89413 10.3025L0.834083 9.56051C-0.278027 9.29084 -0.278028 7.70916 0.834082 7.43949L3.89413 6.69748C4.29118 6.6012 4.6012 6.29118 4.69748 5.89413L5.43949 2.83408Z" fill="#005AE0"/>
						<path d="M14.3474 13.5133C14.5133 12.8289 15.4867 12.8289 15.6526 13.5133L16.1092 15.3964C16.1685 15.6407 16.3593 15.8315 16.6036 15.8908L18.4867 16.3474C19.1711 16.5133 19.1711 17.4867 18.4867 17.6526L16.6036 18.1092C16.3593 18.1685 16.1685 18.3593 16.1092 18.6036L15.6526 20.4867C15.4867 21.1711 14.5133 21.1711 14.3474 20.4867L13.8908 18.6036C13.8315 18.3593 13.6407 18.1685 13.3964 18.1092L11.5133 17.6526C10.8289 17.4867 10.8289 16.5133 11.5133 16.3474L13.3964 15.8908C13.6407 15.8315 13.8315 15.6407 13.8908 15.3964L14.3474 13.5133Z" fill="#005AE0"/>
						<path d="M17.5717 2.71184C17.6806 2.26272 18.3194 2.26272 18.4283 2.71184L18.7279 3.94763C18.7668 4.10798 18.892 4.23318 19.0524 4.27206L20.2882 4.57172C20.7373 4.68062 20.7373 5.31938 20.2882 5.42828L19.0524 5.72794C18.892 5.76682 18.7668 5.89202 18.7279 6.05237L18.4283 7.28816C18.3194 7.73728 17.6806 7.73728 17.5717 7.28816L17.2721 6.05237C17.2332 5.89202 17.108 5.76682 16.9476 5.72794L15.7118 5.42828C15.2627 5.31938 15.2627 4.68062 15.7118 4.57172L16.9476 4.27206C17.108 4.23318 17.2332 4.10798 17.2721 3.94763L17.5717 2.71184Z" fill="#005AE0"/>
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
