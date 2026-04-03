<script setup lang="ts">
import type { QuickLink } from '@/types'

defineProps<{
	links: QuickLink[]
}>()

function isInternal(href: string): boolean {
	return href.startsWith('/')
}
</script>

<template>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
		<template v-for="link in links" :key="link.label">
			<router-link
				v-if="isInternal(link.href)"
				:to="link.href"
				class="text-sm text-brand-blue hover:underline transition-all duration-200 py-1"
			>
				{{ link.label }}
			</router-link>
			<a
				v-else
				:href="link.href"
				target="_blank"
				rel="noopener"
				class="text-sm text-brand-blue hover:underline transition-all duration-200 py-1"
			>
				{{ link.label }}
			</a>
		</template>
	</div>
</template>
