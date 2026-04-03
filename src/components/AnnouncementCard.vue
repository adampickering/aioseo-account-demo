<script setup lang="ts">
import type { Announcement } from '@/types'

defineProps<{
	announcement: Announcement
}>()
</script>

<template>
	<div class="bg-white overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group border border-border rounded-card shadow-card">
		<!-- Image -->
		<div class="aspect-video overflow-hidden bg-bg-light">
			<img
				v-if="announcement.imageUrl && announcement.imageUrl !== '#'"
				:src="announcement.imageUrl"
				:alt="announcement.title"
				class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
				loading="lazy"
			/>
			<div v-else class="w-full h-full flex items-center justify-center">
				<svg class="w-10 h-10 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
				</svg>
			</div>
		</div>

		<!-- Content -->
		<div class="p-5">
			<a
				:href="announcement.url"
				class="font-semibold text-lg text-brand-blue hover:underline transition-all duration-200 leading-snug block"
			>
				{{ announcement.title }}
			</a>
			<p class="text-sm text-text-secondary mt-2 line-clamp-3 leading-relaxed">{{ announcement.excerpt }}</p>
		</div>
	</div>
</template>
