<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '@/types'

const props = defineProps<{
	order: Order
}>()

const formattedDate = computed(() => {
	return new Date(props.order.date).toLocaleDateString('en-US', {
		month: 'short', day: 'numeric', year: 'numeric',
	})
})

// Capitalize first letter
function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1)
}
</script>

<template>
	<tr class="border-t border-border">
		<td class="py-4 pr-4 text-body text-brand-navy">{{ formattedDate }}</td>
		<td class="py-4 pr-4 text-body text-brand-navy">{{ order.product }}</td>
		<td class="py-4 pr-4 text-body text-brand-navy">{{ order.amount }}</td>
		<td class="py-4 pr-4 text-body text-brand-navy">{{ capitalize(order.status) }}</td>
		<td class="py-4 text-body">
			<a :href="order.invoiceUrl" class="aio-link underline">Generate Invoice</a>
		</td>
	</tr>
</template>
