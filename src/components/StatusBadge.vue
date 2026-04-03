<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	status: 'active' | 'expired' | 'cancelled' | 'completed' | 'refunded' | 'pending' | 'failed'
}>()

const statusConfig = computed(() => {
	switch (props.status) {
		case 'active':
		case 'completed':
			return {
				bg: 'rgba(0, 170, 99, 0.05)',
				color: '#00AA63',
				border: '1px solid #00AA63',
				label: props.status.charAt(0).toUpperCase() + props.status.slice(1),
			}
		case 'expired':
		case 'cancelled':
		case 'failed':
			return {
				bg: 'rgba(223, 42, 74, 0.05)',
				color: '#DF2A4A',
				border: '1px solid #DF2A4A',
				label: props.status.charAt(0).toUpperCase() + props.status.slice(1),
			}
		case 'refunded':
			return {
				bg: 'rgba(140, 143, 154, 0.05)',
				color: '#8C8F9A',
				border: '1px solid #8C8F9A',
				label: 'Refunded',
			}
		case 'pending':
			return {
				bg: 'rgba(241, 130, 0, 0.05)',
				color: '#F18200',
				border: '1px solid #F18200',
				label: 'Pending',
			}
	}
})
</script>

<template>
	<span
		class="inline-flex items-center"
		:style="{
			backgroundColor: statusConfig.bg,
			color: statusConfig.color,
			border: statusConfig.border,
			borderRadius: '5px',
			padding: '0 7px',
			fontSize: '16px',
			fontWeight: '400',
			lineHeight: '1.6',
		}"
	>
		{{ statusConfig.label }}
	</span>
</template>
