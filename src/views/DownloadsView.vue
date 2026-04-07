<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLicenses } from '@/composables/useLicenses'
import { useAiCredits } from '@/composables/useAiCredits'
import AddonIcon from '@/components/AddonIcon.vue'
import ProductIcon from '@/components/ProductIcon.vue'

const baseUrl = import.meta.env.BASE_URL

const { licenses } = useLicenses()
const { credits, remaining } = useAiCredits()

const blcLicenses = computed(() => licenses.value.filter(l => l.product === 'broken-link-checker'))
const aioseoLicenses = computed(() => licenses.value.filter(l => l.product === 'aioseo'))
const hasCredits = computed(() => credits.value.total > 0)

const showUpgradeOptions = ref(false)
const copiedKey = ref('')

function formatNumber(n: number): string {
	return n.toLocaleString()
}

function formatDate(iso: string): string {
	if (!iso) return ''
	return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

async function copyKey(key: string) {
	await navigator.clipboard.writeText(key)
	copiedKey.value = key
	setTimeout(() => { copiedKey.value = '' }, 2000)
}

// Standardized button class
const btnBlue = 'px-6 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-btn hover:opacity-90 transition-all duration-200 no-underline inline-flex items-center gap-1.5'
const btnGreen = 'px-6 py-2.5 text-sm font-semibold text-white bg-brand-green rounded-btn hover:opacity-90 transition-all duration-200 no-underline inline-flex items-center gap-1.5'
</script>

<template>
	<div class="space-y-8">
		<!-- BLC licenses -->
		<template v-for="lic in blcLicenses" :key="lic.id">
			<div class="border border-border rounded-card shadow-xs bg-white">
				<!-- Header -->
				<div class="flex items-center gap-3 pl-3 pr-5 py-3 border-b border-border rounded-t-card">
					<div class="aio-blc-icon-box">
						<img :src="baseUrl + 'assets/icons/product-blc-card.svg'" alt="Broken Link Checker" />
					</div>
					<h2 class="flex-1 text-lg font-bold text-brand-navy leading-6">Broken Link Checker</h2>
					<a href="#" class="bg-brand-blue text-white text-sm font-semibold rounded-btn px-3 py-2 h-9 inline-flex items-center gap-1 no-underline hover:opacity-90 transition-opacity">
						Upgrade License
					</a>
					<a href="#" class="bg-brand-green text-white text-sm font-semibold rounded-btn px-3 py-2 inline-flex items-center gap-1 no-underline hover:opacity-90 transition-opacity">
						Broken Link Checker
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
					</a>
				</div>

				<!-- Body row 1: Plan Level / License / Expires -->
				<div class="flex items-start justify-between p-6 border-b border-border">
					<div class="flex-1 flex flex-col gap-1 min-w-0">
						<p class="text-sm font-semibold text-text-light">Plan Level</p>
						<p class="text-base text-brand-navy leading-[38px]">{{ lic.tierLabel }}</p>
					</div>
					<div class="flex flex-col gap-1 w-[352px]">
						<p class="text-sm font-semibold text-text-light">License</p>
						<div class="flex items-center gap-2">
							<p class="text-base text-brand-navy leading-[38px]">{{ lic.licenseKey }}</p>
							<button @click="copyKey(lic.licenseKey)" class="shrink-0 bg-transparent border-0 cursor-pointer p-0" :aria-label="copiedKey === lic.licenseKey ? 'Copied!' : 'Copy license key'">
								<svg v-if="copiedKey !== lic.licenseKey" class="w-[18px] h-[18px] text-brand-navy-40 hover:text-brand-navy transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
								<svg v-else class="w-[18px] h-[18px] text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
							</button>
						</div>
					</div>
					<div class="flex-1 flex flex-col gap-1 min-w-0">
						<p class="text-sm font-semibold text-text-light">Expires</p>
						<p class="text-base text-brand-navy leading-[38px]">{{ formatDate(lic.expiresAt) }}</p>
					</div>
				</div>

				<!-- Body row 2: Site Activations / Links -->
				<div class="flex items-start p-6 border-b border-border rounded-b-card">
					<div class="flex flex-col gap-1 w-[355px]">
						<p class="text-sm font-semibold text-text-light">Site Activations</p>
						<div class="flex items-center gap-2 text-base text-brand-navy leading-[38px]">
							<span>{{ lic.siteActivations.used }} / {{ lic.siteActivations.total }}</span>
							<a href="#" class="text-base text-brand-navy underline hover:opacity-80 transition-opacity">Manage Sites</a>
						</div>
					</div>
					<div v-if="lic.links" class="flex flex-col gap-1">
						<p class="text-sm font-semibold text-text-light">Links</p>
						<p class="text-base text-brand-navy leading-[38px]">{{ formatNumber(lic.links.remaining || 0) }} / {{ formatNumber(lic.links.total || 0) }} Links Remaining</p>
					</div>
				</div>
			</div>
		</template>

		<!-- AI Credits -->
		<div v-if="hasCredits" class="border border-border rounded-card shadow-xs bg-white">
			<!-- Header -->
			<div class="flex items-center gap-3 pl-3 pr-5 py-3 border-b border-border rounded-t-card">
				<ProductIcon product="ai-credits" :size="46" />
				<h2 class="flex-1 text-lg font-bold text-brand-navy leading-6">AI Credits</h2>
				<a href="#" class="bg-brand-green text-white text-sm font-semibold rounded-btn px-3 py-2 h-9 inline-flex items-center gap-1 no-underline hover:opacity-90 transition-opacity">
					Purchase Credits
				</a>
			</div>

			<!-- Body: AI Credits + Expires -->
			<div class="flex items-start gap-[170px] p-6 border-b border-border rounded-b-card">
				<div class="flex flex-col gap-1 w-[398px]">
					<p class="text-sm font-semibold text-text-light">AI Credits</p>
					<div class="flex items-center gap-1.5 text-base text-brand-navy leading-[38px]">
						<span>{{ formatNumber(remaining) }} / {{ formatNumber(credits.total) }} AI Credits Remaining</span>
						<a href="#" class="text-base text-brand-navy underline hover:opacity-80 transition-opacity">Purchase Credits</a>
					</div>
				</div>
				<div class="flex-1 flex flex-col gap-1 min-w-0">
					<p class="text-sm font-semibold text-text-light">Expires</p>
					<p class="text-base text-brand-navy leading-[38px]">{{ formatDate(credits.expiresAt) }}</p>
				</div>
			</div>
		</div>

		<!-- AIOSEO licenses -->
		<template v-for="lic in aioseoLicenses" :key="lic.id">
			<div class="aio-card !p-0">
				<div class="px-10 pt-6 pb-4 flex items-center gap-3">
					<ProductIcon product="aioseo" :size="46" />
					<h2 class="text-lg font-heading font-bold text-brand-navy">AIOSEO</h2>
					<div class="ml-auto flex items-center gap-2">
						<a v-if="lic.tier !== 'elite'" href="#" :class="btnBlue">Upgrade License</a>
						<a href="#" :class="btnGreen">
							Download AIOSEO
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
						</a>
					</div>
				</div>

				<!-- License info as table -->
				<table class="w-full">
					<thead>
						<tr class="aio-table-row">
							<th class="px-10 py-3 text-left text-base font-normal text-text-muted">Plan Level</th>
							<th class="py-3 text-left text-base font-normal text-text-muted">License</th>
							<th class="py-3 text-left text-base font-normal text-text-muted">Expires</th>
						</tr>
					</thead>
					<tbody>
						<tr class="aio-table-row">
							<td class="px-10 py-4 text-body text-brand-navy">{{ lic.tierLabel }}</td>
							<td class="py-4 text-body text-brand-navy font-mono">
								{{ lic.licenseKey }}
								<button @click="copyKey(lic.licenseKey)" class="ml-1.5 text-brand-navy-40 hover:text-brand-navy bg-transparent border-0 cursor-pointer p-0 align-middle" :aria-label="copiedKey === lic.licenseKey ? 'Copied!' : 'Copy'">
									<svg v-if="copiedKey !== lic.licenseKey" class="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
									<svg v-else class="w-4 h-4 inline text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
								</button>
							</td>
							<td class="py-4 text-body text-brand-navy">{{ formatDate(lic.expiresAt) }}</td>
						</tr>
					</tbody>
				</table>
				<table class="w-full">
					<thead>
						<tr class="aio-table-row">
							<th class="px-10 py-3 text-left text-base font-normal text-text-muted">Site Activations</th>
							<th v-if="lic.aiCredits" class="py-3 text-left text-base font-normal text-text-muted">AI Credits</th>
						</tr>
					</thead>
					<tbody>
						<tr class="aio-table-row">
							<td class="px-10 py-4 text-body text-brand-navy">{{ lic.siteActivations.used }} / {{ lic.siteActivations.total }} <a href="#" class="aio-link underline ml-1">Manage Sites</a></td>
							<td v-if="lic.aiCredits" class="py-4 text-body text-brand-navy">{{ formatNumber(lic.aiCredits.total - lic.aiCredits.used) }} / {{ formatNumber(lic.aiCredits.total) }} AI Credits Remaining <span class="text-brand-navy-40 mx-1">·</span> Running Low? <a href="#" class="aio-link underline">Add More</a></td>
						</tr>
					</tbody>
				</table>

				<!-- Addons section -->
				<template v-if="lic.addons.length > 0">
					<div class="bg-bg-light px-10 py-6">
						<p class="text-sm text-text-muted mb-4">AIOSEO Addons</p>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
							<div
								v-for="addon in lic.addons"
								:key="addon.id"
								class="bg-white border border-border rounded-card p-4 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-card transition-all duration-200"
							>
								<div class="aio-addon-icon">
									<AddonIcon :addon-id="addon.id" />
								</div>
								<div class="min-w-0">
									<p class="text-sm font-medium text-brand-navy truncate">{{ addon.name }}</p>
									<a :href="addon.downloadUrl" class="inline-flex items-center gap-1 text-xs text-brand-blue hover:underline mt-0.5">
										<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
										Download
									</a>
								</div>
							</div>
						</div>
					</div>
				</template>

				<!-- See/Hide Upgrade Options -->
				<div class="border-t border-border bg-gradient-to-r from-brand-blue-5 to-brand-blue-10 px-10 py-4 text-center rounded-b-card">
					<button
						@click="showUpgradeOptions = !showUpgradeOptions"
						class="text-brand-blue text-body font-medium hover:underline cursor-pointer bg-transparent border-0 inline-flex items-center gap-1"
					>
						{{ showUpgradeOptions ? 'Hide' : 'See' }} Upgrade Options
						<svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': showUpgradeOptions }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
					</button>
				</div>

				<!-- Upgrade section -->
				<div v-if="showUpgradeOptions && lic.tier !== 'elite'" class="border-t border-border bg-white px-10 py-8 text-center rounded-b-card">
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
					<a href="#" :class="btnBlue + ' inline-flex'">
						{{ lic.tier === 'basic' ? 'Upgrade to Plus' : 'Upgrade To Elite' }}
					</a>
				</div>
			</div>
		</template>
	</div>
</template>
