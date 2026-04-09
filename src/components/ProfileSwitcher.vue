<script setup lang="ts">
import { useMockProfile } from '@/composables/useMockProfile'
import type { ProfileKey, LayoutMode } from '@/stores/profile'

const { activeProfile, activeLayout, setProfile, setLayout } = useMockProfile()

const profiles: { key: ProfileKey; label: string }[] = [
	{ key: 'basic', label: 'Basic' },
	{ key: 'pro', label: 'Pro' },
	{ key: 'elite', label: 'Elite' },
]

const layouts: { key: LayoutMode; label: string }[] = [
	{ key: 'minimal', label: 'Minimal' },
	{ key: 'full', label: 'Full' },
]
</script>

<template>
	<div class="fixed bottom-2 left-2 sm:bottom-4 sm:left-4 z-[999] bg-white/90 backdrop-blur-sm px-2 py-1.5 sm:px-3 sm:py-2.5 rounded-card border border-border shadow-card">
		<p class="text-[10px] sm:text-xs font-medium text-text-muted uppercase tracking-wider mb-1.5">Mock Profile</p>
		<div class="flex gap-1">
			<button
				v-for="profile in profiles"
				:key="profile.key"
				@click="setProfile(profile.key)"
				:aria-label="`Switch to ${profile.label} profile`"
				:aria-pressed="activeProfile === profile.key"
				class="px-2 py-0.5 text-[10px] sm:px-3 sm:py-1 sm:text-xs font-medium rounded-btn transition-all duration-200 cursor-pointer"
				:class="activeProfile === profile.key
					? 'bg-brand-blue text-white shadow-sm'
					: 'bg-gray-100 text-text-secondary hover:bg-gray-200'"
			>
				{{ profile.label }}
			</button>
		</div>
		<p class="text-[10px] sm:text-xs font-medium text-text-muted uppercase tracking-wider mb-1.5 mt-2.5">Layout</p>
		<div class="flex gap-1">
			<button
				v-for="layout in layouts"
				:key="layout.key"
				@click="setLayout(layout.key)"
				:aria-label="`Switch to ${layout.label} layout`"
				:aria-pressed="activeLayout === layout.key"
				class="px-2 py-0.5 text-[10px] sm:px-3 sm:py-1 sm:text-xs font-medium rounded-btn transition-all duration-200 cursor-pointer"
				:class="activeLayout === layout.key
					? 'bg-brand-blue text-white shadow-sm'
					: 'bg-gray-100 text-text-secondary hover:bg-gray-200'"
			>
				{{ layout.label }}
			</button>
		</div>
	</div>
</template>
