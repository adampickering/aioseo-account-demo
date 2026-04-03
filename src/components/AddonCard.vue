<script setup lang="ts">
import type { Addon } from '@/types'

defineProps<{
	addon: Addon
}>()
</script>

<template>
	<div class="aio-card-sm flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
		<div class="aio-addon-icon">
			<img
				v-if="addon.iconUrl && addon.iconUrl !== '#'"
				:src="addon.iconUrl"
				:alt="addon.name"
			/>
			<span v-else class="text-sm font-bold text-brand-blue">{{ addon.name.charAt(0) }}</span>
		</div>
		<div class="min-w-0 flex-1">
			<p class="text-sm font-medium text-text-primary truncate">{{ addon.name }}</p>
			<a
				:href="addon.downloadUrl"
				class="inline-flex items-center gap-1 text-xs text-brand-blue hover:underline transition-all duration-200 mt-0.5"
			>
				<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
				</svg>
				Download v{{ addon.version }}
			</a>
		</div>
	</div>
</template>
