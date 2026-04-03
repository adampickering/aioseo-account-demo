<script setup lang="ts">
import { ref, computed } from 'vue'
import type { License } from '@/types'
import StatusBadge from './StatusBadge.vue'

const props = defineProps<{
	license: License
}>()

const copied = ref(false)

const truncatedKey = computed(() => {
	const key = props.license.licenseKey
	if (key.length <= 16) return key
	return key.slice(0, 8) + '...' + key.slice(-8)
})

const formattedExpiry = computed(() => {
	return new Date(props.license.expiresAt).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
})

const tierColors: Record<string, string> = {
	basic: 'bg-gray-100 text-text-secondary',
	plus: 'bg-brand-blue-10 text-brand-blue',
	pro: 'bg-purple-50 text-purple-700',
	elite: 'bg-amber-50 text-brand-amber',
}

const iconBgColor = computed(() => {
	switch (props.license.product) {
		case 'aioseo': return 'bg-brand-blue'
		case 'broken-link-checker': return 'bg-brand-red'
		case 'ai-credits': return 'bg-purple-600'
		default: return 'bg-brand-blue'
	}
})

const isElite = computed(() => props.license.tier === 'elite')

async function copyKey() {
	try {
		await navigator.clipboard.writeText(props.license.licenseKey)
		copied.value = true
		setTimeout(() => { copied.value = false }, 2000)
	} catch {
		// Fallback: do nothing
	}
}
</script>

<template>
	<div class="bg-white rounded-xl shadow-card p-6 transition-all duration-200">
		<!-- Header -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" :class="iconBgColor">
					{{ license.productName.charAt(0) }}
				</div>
				<div>
					<h3 class="font-heading font-semibold text-text-primary text-lg leading-tight">
						{{ license.productName }}
						<span class="ml-2 text-xs font-medium px-2 py-0.5 rounded-full" :class="tierColors[license.tier] || 'bg-gray-100 text-text-secondary'">
							{{ license.tierLabel }}
						</span>
					</h3>
				</div>
			</div>
			<div class="flex items-center gap-2.5">
				<a
					v-if="!isElite"
					href="#"
					class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-brand-blue border border-brand-blue rounded-lg hover:bg-brand-blue-5 transition-all duration-200"
				>
					Upgrade License
				</a>
				<a
					:href="license.downloadUrl"
					class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-brand-green rounded-lg hover:bg-brand-green/90 transition-all duration-200"
				>
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
					</svg>
					Download {{ license.productName }}
				</a>
			</div>
		</div>

		<!-- Info grid -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
			<div>
				<p class="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Plan Level</p>
				<p class="text-sm font-semibold text-text-primary">{{ license.tierLabel }}</p>
			</div>
			<div>
				<p class="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">License</p>
				<div class="flex items-center gap-2">
					<code class="text-sm font-mono text-text-secondary">{{ truncatedKey }}</code>
					<button
						@click="copyKey"
						class="relative p-1 rounded hover:bg-gray-100 transition-all duration-200 text-text-muted hover:text-text-primary cursor-pointer"
						:title="copied ? 'Copied!' : 'Copy license key'"
					>
						<svg v-if="!copied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
						</svg>
						<svg v-else class="w-4 h-4 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
						</svg>
						<span
							v-if="copied"
							class="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-navy text-white text-xs px-2 py-1 rounded whitespace-nowrap"
						>
							Copied!
						</span>
					</button>
				</div>
			</div>
			<div>
				<p class="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Expires</p>
				<div class="flex items-center gap-2">
					<span class="text-sm text-text-primary">{{ formattedExpiry }}</span>
					<StatusBadge :status="license.status" />
				</div>
			</div>
		</div>

		<!-- Second row -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<div>
				<p class="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Site Activations</p>
				<div class="flex items-center gap-2">
					<span class="text-sm font-semibold text-text-primary">{{ license.siteActivations.used }} / {{ license.siteActivations.total }}</span>
					<a href="#" class="text-xs text-brand-blue hover:underline transition-all duration-200">Manage Sites</a>
				</div>
			</div>
			<div v-if="license.aiCredits">
				<p class="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">AI Credits</p>
				<span class="text-sm font-semibold text-text-primary">{{ license.aiCredits.used }} / {{ license.aiCredits.total }} AI Credits Remaining</span>
			</div>
			<div v-if="license.links">
				<p class="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Links</p>
				<span class="text-sm font-semibold text-text-primary">{{ license.links.remaining }} / {{ license.links.total }} Links Remaining</span>
			</div>
		</div>
	</div>
</template>
