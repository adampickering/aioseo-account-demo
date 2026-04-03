<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	status: 'active' | 'expired' | 'cancelled' | 'completed' | 'refunded' | 'pending' | 'failed'
}>()

const badgeClass = computed(() => {
	switch (props.status) {
		case 'active':
		case 'completed':
			return 'aio-badge-active'
		case 'expired':
		case 'cancelled':
		case 'failed':
			return 'aio-badge-expired'
		case 'refunded':
			return 'aio-badge-neutral'
		case 'pending':
			return 'aio-badge-pending'
	}
})

const label = computed(() => {
	return props.status.charAt(0).toUpperCase() + props.status.slice(1)
})
</script>

<template>
	<span
		class="leading-[1.6]"
		:class="badgeClass"
	>
		{{ label }}
	</span>
</template>
