<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLicenses } from '@/composables/useLicenses'
import LicenseCard from '@/components/LicenseCard.vue'
import AddonCard from '@/components/AddonCard.vue'

const { licensesByProduct } = useLicenses()

const aioseoLicenses = computed(() => licensesByProduct.value['aioseo'] ?? [])

const showUpgradeOptions = ref(false)
</script>

<template>
	<div class="space-y-8">
		<!-- License cards with addon grids -->
		<div
			v-for="license in aioseoLicenses"
			:key="license.id"
			class="space-y-6"
		>
			<!-- License card -->
			<LicenseCard :license="license" />

			<!-- Addons grid -->
			<div v-if="license.addons.length > 0">
				<h3 class="text-lg font-heading font-semibold text-text-primary mb-4">
					AIOSEO Addons
				</h3>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
					<AddonCard
						v-for="addon in license.addons"
						:key="addon.id"
						:addon="addon"
					/>
				</div>
			</div>
		</div>

		<!-- See Upgrade Options -->
		<div class="pt-2">
			<button
				@click="showUpgradeOptions = !showUpgradeOptions"
				class="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:underline transition-all duration-200 cursor-pointer"
			>
				See Upgrade Options
				<svg
					class="w-4 h-4 transition-transform duration-200"
					:class="{ 'rotate-180': showUpgradeOptions }"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
				</svg>
			</button>

			<div v-show="showUpgradeOptions" class="mt-4">
				<div class="bg-white rounded-xl shadow-card p-6">
					<div class="flex items-center gap-3 mb-3">
						<div class="w-10 h-10 rounded-full bg-brand-blue-10 flex items-center justify-center shrink-0">
							<svg class="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
							</svg>
						</div>
						<div>
							<h4 class="font-heading font-semibold text-text-primary">Upgrade Your Plan</h4>
							<p class="text-sm text-text-secondary">Unlock more features and addons with a higher-tier plan.</p>
						</div>
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
						<div
							v-for="tier in ['Plus', 'Pro', 'Elite']"
							:key="tier"
							class="border border-gray-100 rounded-lg p-4 text-center hover:border-brand-blue-25 transition-all duration-200"
						>
							<p class="font-heading font-semibold text-text-primary mb-1">{{ tier }}</p>
							<a href="#" class="text-sm text-brand-blue hover:underline">View Details</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
