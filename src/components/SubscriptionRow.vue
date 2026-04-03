<script setup lang="ts">
import { computed } from 'vue'
import type { Subscription } from '@/types'
import StatusBadge from './StatusBadge.vue'

const props = defineProps<{
	subscription: Subscription
}>()

const formattedDate = computed(() => {
	return new Date(props.subscription.date).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
})

const formattedRenewal = computed(() => {
	return new Date(props.subscription.renewsAt).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
})
</script>

<template>
	<tr class="border-b border-gray-100 last:border-b-0 transition-all duration-200 hover:bg-bg-light/50">
		<td class="py-4 pr-4 text-sm text-text-secondary">{{ formattedDate }}</td>
		<td class="py-4 pr-4 text-sm font-medium text-text-primary max-w-[200px] truncate">{{ subscription.product }}</td>
		<td class="py-4 pr-4">
			<div class="flex items-center gap-2">
				<span class="text-sm text-text-secondary">Renews {{ formattedRenewal }}</span>
				<StatusBadge :status="subscription.status" />
			</div>
		</td>
		<td class="py-4">
			<div class="flex items-center gap-3">
				<a :href="subscription.actions.changePlanUrl" class="text-sm text-brand-blue hover:underline transition-all duration-200">
					Change Plan Level
				</a>
				<a :href="subscription.actions.cancelUrl" class="text-sm text-brand-blue hover:underline transition-all duration-200">
					Cancel
				</a>
				<a :href="subscription.actions.updatePaymentUrl" class="text-sm text-brand-blue hover:underline transition-all duration-200">
					Update Payment Method
				</a>
			</div>
		</td>
	</tr>
</template>
