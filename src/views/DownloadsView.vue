<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLicenses } from '@/composables/useLicenses'
import { useAiCredits } from '@/composables/useAiCredits'
import AddonIcon from '@/components/AddonIcon.vue'
import ProductIcon from '@/components/ProductIcon.vue'

const { licenses } = useLicenses()
const { credits, remaining } = useAiCredits()

const blcLicenses = computed(() => licenses.value.filter(l => l.product === 'broken-link-checker'))
const aioseoLicenses = computed(() => licenses.value.filter(l => l.product === 'aioseo'))
const hasCredits = computed(() => credits.value.total > 0)
const hasBLC = computed(() => blcLicenses.value.length > 0)

type ProductTab = 'aioseo' | 'ai-credits' | 'blc'
const activeTab = ref<ProductTab>('aioseo')

const productTabs = computed(() => {
	const tabs: { key: ProductTab; label: string; icon: string }[] = [
		{ key: 'aioseo', label: 'AIOSEO', icon: 'aioseo' },
	]
	if (hasCredits.value) {
		tabs.push({ key: 'ai-credits', label: 'AI Credits', icon: 'ai-credits' })
	}
	if (hasBLC.value) {
		tabs.push({ key: 'blc', label: 'Broken Link Checker', icon: 'blc' })
	}
	return tabs
})

const showUpgradeOptions = ref(false)
const copiedKey = ref('')

const upgradeFeatures = {
	basic: {
		title: 'Upgrade to Plus',
		subtitle: 'The Essential Toolkit for Growing Businesses',
		features: ['3 Websites', '25,000 AI Credits', 'Dominate Local Search', 'Rank in Google Images', 'Boost Trust (E-E-A-T)', 'Appear on Google Maps'],
	},
	plus: {
		title: 'Upgrade to Elite',
		subtitle: 'Premier solution for smart business owners & agencies',
		features: ['100 Websites', '200,000 AI Credits', 'WordPress Multisite-Ready', 'Track Keyword Rankings', 'Monitor Indexing Status', 'Spot Content Decay'],
	},
	pro: {
		title: 'Upgrade to Elite',
		subtitle: 'Premier solution for smart business owners & agencies',
		features: ['100 Websites', '200,000 AI Credits', 'WordPress Multisite-Ready', 'Track Keyword Rankings', 'Monitor Indexing Status', 'Spot Content Decay'],
	},
} as Record<string, { title: string; subtitle: string; features: string[] }>

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

</script>

<template>
	<div>
		<!-- Product sub-navigation -->
		<div class="relative mb-8">
			<div class="flex items-center">
				<button
					v-for="tab in productTabs"
					:key="tab.key"
					@click="activeTab = tab.key"
					class="flex items-center gap-2.5 px-6 h-[60px] bg-transparent border-0 cursor-pointer text-lg transition-colors"
					:class="activeTab === tab.key
						? 'text-brand-blue font-bold shadow-[0px_2px_0px_0px_#005ae0]'
						: 'text-brand-navy-60 font-normal hover:text-brand-navy'"
				>
					<ProductIcon :product="tab.icon as any" :size="20" />
					{{ tab.label }}
				</button>
			</div>
			<div class="absolute bottom-0 left-0 right-0 h-px bg-border"></div>
		</div>

		<div class="space-y-8">
		<!-- BLC licenses -->
		<template v-if="activeTab === 'blc'" v-for="lic in blcLicenses" :key="lic.id">
			<div class="border border-border rounded-card shadow-xs bg-white">
				<!-- Header -->
				<div class="flex items-center gap-3 pl-3 pr-5 py-3 border-b border-border rounded-t-card">
					<ProductIcon product="blc" :size="46" />
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
		<div v-if="activeTab === 'ai-credits' && hasCredits" class="border border-border rounded-card shadow-xs bg-white">
			<!-- Header -->
			<div class="flex items-center gap-3 pl-3 pr-5 py-3 border-b border-border rounded-t-card">
				<ProductIcon product="ai-credits" :size="46" />
				<h2 class="flex-1 text-lg font-bold text-brand-navy leading-6">AI Credits</h2>
				<a href="#" class="bg-brand-green text-white text-sm font-semibold rounded-btn px-3 py-2 h-9 inline-flex items-center gap-1 no-underline hover:opacity-90 transition-opacity">
					Purchase Credits
				</a>
			</div>

			<!-- Body: AI Credits + Expires -->
			<div class="flex items-start p-6 border-b border-border rounded-b-card">
				<div class="flex flex-col gap-1 flex-1 min-w-0">
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
		<template v-if="activeTab === 'aioseo'" v-for="lic in aioseoLicenses" :key="lic.id">
			<div class="border border-border rounded-card shadow-xs bg-white">
				<!-- Header -->
				<div class="flex items-center gap-3 pl-3 pr-5 py-3 border-b border-border rounded-t-card">
					<ProductIcon product="aioseo" :size="46" />
					<h2 class="flex-1 text-lg font-bold text-brand-navy leading-6">AIOSEO</h2>
					<a v-if="lic.tier !== 'elite'" href="#" class="bg-brand-blue text-white text-sm font-semibold rounded-btn px-3 py-2 h-9 inline-flex items-center gap-1 no-underline hover:opacity-90 transition-opacity">
						Upgrade License
					</a>
					<a href="#" class="bg-brand-green text-white text-sm font-semibold rounded-btn px-3 py-2 inline-flex items-center gap-1 no-underline hover:opacity-90 transition-opacity">
						Download AIOSEO
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
					</a>
				</div>

				<!-- Body row 1: Plan Level / License / Expires -->
				<div class="flex items-start justify-between p-6 border-b border-border gap-6">
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

				<!-- Body row 2: Site Activations / AI Credits -->
				<div class="flex items-start p-6 border-b border-border">
					<div class="flex flex-col gap-1 w-[355px]">
						<p class="text-sm font-semibold text-text-light">Site Activations</p>
						<div class="flex items-center gap-2 text-base text-brand-navy leading-[38px]">
							<span>{{ lic.siteActivations.used }} / {{ lic.siteActivations.total }}</span>
							<a href="#" class="text-base text-brand-navy underline hover:opacity-80 transition-opacity">Manage Sites</a>
						</div>
					</div>
					<div v-if="lic.aiCredits" class="flex flex-col gap-1">
						<p class="text-sm font-semibold text-text-light">AI Credits</p>
						<div class="flex items-center gap-1.5 text-base text-brand-navy leading-[38px]">
							<span>{{ formatNumber(lic.aiCredits.total - lic.aiCredits.used) }} / {{ formatNumber(lic.aiCredits.total) }} AI Credits Remaining</span>
							<template v-if="lic.tier !== 'elite'">
								<span class="w-1.5 h-1.5 rounded-full bg-brand-navy inline-block shrink-0"></span>
								<span>Running Low? <a href="#" class="text-base text-brand-navy underline hover:opacity-80 transition-opacity">Add More</a></span>
							</template>
						</div>
					</div>
				</div>

				<!-- Addons section -->
				<div v-if="lic.addons.length > 0" class="bg-bg-addons p-6 border-b border-border">
					<p class="text-sm font-semibold text-text-light mb-2">AIOSEO Addons</p>
					<div class="flex flex-wrap gap-x-[3px] gap-y-6">
						<div
							v-for="addon in lic.addons"
							:key="addon.id"
							class="flex items-center gap-4 w-[calc(25%-3px)]"
						>
							<!-- Icon box -->
							<div class="aio-addon-box">
								<div class="aio-addon-circle">
									<AddonIcon :addon-id="addon.id" />
								</div>
								<span v-if="addon.isNew" class="aio-addon-new-badge">New</span>
							</div>
							<!-- Text -->
							<div class="flex flex-col gap-1">
								<span class="text-base font-semibold text-brand-navy">{{ addon.name }}</span>
								<a :href="addon.downloadUrl" class="inline-flex items-center gap-1 text-[13px] font-bold text-text-light hover:text-brand-navy transition-colors no-underline">
									<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
									Download
								</a>
							</div>
						</div>
					</div>
				</div>

				<!-- See/Hide Upgrade Options toggle (hidden for Elite) -->
				<div
					v-if="lic.tier !== 'elite'"
					class="bg-bg-upgrade flex items-center justify-center p-4 cursor-pointer"
					:class="showUpgradeOptions ? 'rounded-none' : 'rounded-b-card'"
					@click="showUpgradeOptions = !showUpgradeOptions"
				>
					<button class="text-base font-semibold text-brand-blue bg-transparent border-0 cursor-pointer inline-flex items-center gap-2">
						{{ showUpgradeOptions ? 'Hide' : 'See' }} Upgrade Options
						<svg
							class="w-[11px] h-[6.4px] transition-transform duration-200"
							:class="{ 'rotate-180': showUpgradeOptions }"
							fill="none" viewBox="0 0 11 7" stroke="currentColor" stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M1 1l4.5 4.5L10 1" />
						</svg>
					</button>
				</div>

				<!-- Upgrade panel -->
				<div v-if="showUpgradeOptions && lic.tier !== 'elite' && upgradeFeatures[lic.tier]" class="bg-bg-upgrade px-2 pb-2 rounded-b-lg">
					<div class="bg-white border border-border-upgrade rounded-card pb-[30px]">
						<!-- Title -->
						<div class="flex flex-col items-center gap-3 pt-5">
							<h3 class="text-h3 font-semibold text-brand-navy text-center">{{ upgradeFeatures[lic.tier]?.title }}</h3>
							<p class="text-lg text-brand-navy text-center">{{ upgradeFeatures[lic.tier]?.subtitle }}</p>
						</div>

						<!-- Feature checklist -->
						<div class="flex flex-wrap justify-center gap-x-8 gap-y-4 px-8 mt-6">
							<div
								v-for="(feature, i) in upgradeFeatures[lic.tier]?.features"
								:key="i"
								class="flex items-start gap-3 min-w-[240px]"
							>
								<div class="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center shrink-0">
									<svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 12 10" stroke="currentColor" stroke-width="2.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M1 5.5L4.5 9L11 1" />
									</svg>
								</div>
								<span class="text-base text-brand-navy">{{ feature }}</span>
							</div>
						</div>

						<!-- CTA button -->
						<div class="flex justify-center mt-6">
							<a href="#" class="bg-brand-blue text-white text-lg font-semibold px-6 py-[14.85px] rounded-[4.5px] no-underline hover:opacity-90 transition-opacity inline-flex items-center">
								{{ upgradeFeatures[lic.tier]?.title }}
							</a>
						</div>
					</div>
				</div>
			</div>
		</template>
		</div>
	</div>
</template>
