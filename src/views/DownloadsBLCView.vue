<script setup lang="ts">
import { computed } from 'vue'
import { useLicenses } from '@/composables/useLicenses'
import LicenseCard from '@/components/LicenseCard.vue'

const { licensesByProduct, hasProduct } = useLicenses()

const hasBLC = hasProduct('broken-link-checker')

const blcLicenses = computed(() => licensesByProduct.value['broken-link-checker'] ?? [])
</script>

<template>
	<div>
		<!-- Has BLC license(s) -->
		<div v-if="hasBLC" class="space-y-6">
			<LicenseCard
				v-for="license in blcLicenses"
				:key="license.id"
				:license="license"
			/>
		</div>

		<!-- Upsell card -->
		<div v-else class="aio-card max-w-2xl">
			<div class="flex flex-col sm:flex-row items-start gap-5">
				<div class="w-14 h-14 bg-red-50 flex items-center justify-center shrink-0 rounded-card">
					<svg class="w-7 h-7 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.556a4.5 4.5 0 00-6.364-6.364L4.506 8.257m12.238 0l3.006 3.006M4.506 8.257l-3.006 3.006" />
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="text-xl font-heading font-semibold text-text-primary mb-2">
						Broken Link Checker
					</h3>
					<p class="text-sm text-text-secondary leading-relaxed mb-5">
						Find and fix broken links across your site. Protect your SEO rankings and keep customers from hitting dead ends with automatic link monitoring.
					</p>
					<a
						href="https://brokenlinkchecker.com/"
						target="_blank"
						rel="noopener noreferrer"
						class="aio-btn-blue hover:opacity-90 transition-all duration-200"
					>
						Get Broken Link Checker
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
						</svg>
					</a>
				</div>
			</div>
		</div>
	</div>
</template>
