<script setup lang="ts">
import { useMockProfile } from '@/composables/useMockProfile'
import type { ProfileKey } from '@/stores/profile'

const { activeProfile, setProfile } = useMockProfile()

const profiles: { key: ProfileKey; label: string }[] = [
	{ key: 'basic', label: 'Basic' },
	{ key: 'pro', label: 'Pro' },
	{ key: 'elite', label: 'Elite' },
]
</script>

<template>
	<div class="fixed bottom-4 right-4 z-[999] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-3 py-2.5">
		<p class="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1.5">Mock Profile</p>
		<div class="flex gap-1">
			<button
				v-for="profile in profiles"
				:key="profile.key"
				@click="setProfile(profile.key)"
				class="px-3 py-1 text-xs font-medium rounded transition-all duration-200 cursor-pointer"
				:class="activeProfile === profile.key
					? 'bg-brand-blue text-white shadow-sm'
					: 'bg-gray-100 text-text-secondary hover:bg-gray-200'"
			>
				{{ profile.label }}
			</button>
		</div>
	</div>
</template>
