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
				classes: 'bg-brand-green/10 text-brand-green border border-brand-green/20',
				label: props.status.charAt(0).toUpperCase() + props.status.slice(1),
			}
		case 'expired':
		case 'cancelled':
		case 'failed':
			return {
				classes: 'bg-brand-red/10 text-brand-red border border-brand-red/20',
				label: props.status.charAt(0).toUpperCase() + props.status.slice(1),
			}
		case 'refunded':
			return {
				classes: 'bg-gray-100 text-text-muted border border-gray-200',
				label: 'Refunded',
			}
		case 'pending':
			return {
				classes: 'bg-amber-50 text-brand-amber border border-brand-amber/20',
				label: 'Pending',
			}
	}
})
</script>

<template>
	<span
		class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200"
		:class="statusConfig.classes"
	>
		{{ statusConfig.label }}
	</span>
</template>
