<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '@/types'
import StatusBadge from './StatusBadge.vue'

const props = defineProps<{
	order: Order
}>()

const formattedDate = computed(() => {
	return new Date(props.order.date).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
})
</script>

<template>
	<tr class="border-b border-gray-100 last:border-b-0 transition-all duration-200 hover:bg-bg-light/50">
		<td class="py-4 pr-4 text-sm text-text-secondary">{{ formattedDate }}</td>
		<td class="py-4 pr-4 text-sm font-medium text-text-primary">{{ order.product }}</td>
		<td class="py-4 pr-4 text-sm font-semibold text-text-primary">{{ order.amount }}</td>
		<td class="py-4 pr-4">
			<StatusBadge :status="order.status" />
		</td>
		<td class="py-4">
			<a
				:href="order.invoiceUrl"
				class="text-sm text-brand-blue hover:underline transition-all duration-200"
			>
				Generate Invoice
			</a>
		</td>
	</tr>
</template>
