<script setup lang="ts">
defineProps<{
	title: string
	body: string
	ctaText: string
	ctaType?: 'green' | 'blue'
	primary?: boolean
	badge?: string
}>()

defineEmits<{
	(e: 'cta-click'): void
}>()
</script>

<template>
	<div :class="primary ? 'aio-card-primary' : 'aio-card'">
		<span v-if="badge" class="aio-offer-badge">{{ badge }}</span>
		<h3 class="text-[20px] font-bold text-brand-navy m-0 mb-3">{{ title }}</h3>
		<p class="text-[16px] text-brand-navy-60 leading-relaxed m-0 mb-5">{{ body }}</p>
		<slot name="extra"></slot>
		<button
			@click="$emit('cta-click')"
			:class="ctaType === 'blue' ? 'aio-btn-outline-blue' : 'aio-btn-green'"
		>
			{{ ctaText }}
		</button>
	</div>
</template>
