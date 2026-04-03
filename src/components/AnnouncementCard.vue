<script setup lang="ts">
import type { Announcement } from '@/types'

defineProps<{
	announcement: Announcement
}>()
</script>

<template>
	<div class="bg-white overflow-hidden border border-border rounded-card shadow-card">
		<!-- Image -->
		<div class="aspect-video overflow-hidden bg-bg-light">
			<img
				v-if="announcement.imageUrl && announcement.imageUrl !== '#'"
				:src="announcement.imageUrl"
				:alt="announcement.title"
				class="w-full h-full object-cover"
				loading="lazy"
			/>
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
