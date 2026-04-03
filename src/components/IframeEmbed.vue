<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
	src: string
	title: string
	height?: string
	placeholder?: string
}>(), {
	height: '500px',
})

const isPlaceholder = computed(() => !props.src || props.src === '#')
const placeholderText = computed(() => props.placeholder || props.title)
</script>

<template>
	<div v-if="isPlaceholder" class="rounded-xl border-2 border-dashed border-gray-200 bg-bg-light flex flex-col items-center justify-center text-center p-12 transition-all duration-200" :style="{ minHeight: height }">
		<div class="w-14 h-14 rounded-xl bg-brand-blue-10 flex items-center justify-center mb-5">
			<svg class="w-7 h-7 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
			</svg>
		</div>
		<p class="text-base font-semibold text-text-primary mb-1.5">{{ placeholderText }}</p>
		<p class="text-sm text-text-muted max-w-sm">This content will be loaded from an external source</p>
	</div>

	<iframe
		v-else
		:src="src"
		:title="title"
		class="w-full border-0 rounded-xl"
		:style="{ height }"
		loading="lazy"
	/>
</template>
