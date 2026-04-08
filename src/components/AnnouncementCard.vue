<script setup lang="ts">
import type { Announcement } from '@/types'

defineProps<{
	announcement: Announcement
}>()
</script>

<template>
	<a
		:href="announcement.url"
		class="bg-white overflow-hidden border border-border rounded-card shadow-card block no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
	>
		<!-- Image -->
		<div class="aspect-video overflow-hidden bg-bg-light">
			<img
				v-if="announcement.imageUrl && announcement.imageUrl !== '#'"
				:src="announcement.imageUrl"
				:alt="announcement.title"
				class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
				loading="lazy"
			/>
		</div>

		<!-- Content — 40px padding, 24px gap between title and excerpt -->
		<div class="p-10">
			<span class="font-semibold text-lg text-brand-navy leading-snug block">
				{{ announcement.title }}
			</span>
			<p class="text-sm text-brand-navy-60 mt-6 line-clamp-4 leading-relaxed">{{ announcement.excerpt }}</p>
		</div>
	</a>
</template>
