<script setup lang="ts">
defineProps<{
	name: string
	description: string
	url?: string
}>()
</script>

<template>
	<a :href="url ?? '#'" target="_blank" rel="noopener noreferrer" class="aio-card p-5 flex flex-col items-start gap-3 no-underline hover:border-brand-blue/30 transition-colors">
		<div class="w-10 h-10 shrink-0 flex items-center justify-center">
			<slot name="logo"></slot>
		</div>
		<div>
			<h4 class="text-[15px] font-bold text-brand-navy m-0 mb-1">{{ name }}</h4>
			<p class="text-[13px] text-brand-navy-60 m-0 leading-relaxed">{{ description }}</p>
		</div>
	</a>
</template>
