<script setup lang="ts">
import { computed } from 'vue'
import type { Subscription } from '@/types'

const props = defineProps<{
	subscription: Subscription
}>()

const formattedDate = computed(() => {
	return new Date(props.subscription.date).toLocaleDateString('en-US', {
		month: 'short', day: 'numeric', year: 'numeric',
	})
})

const formattedRenewal = computed(() => {
	return new Date(props.subscription.renewsAt).toLocaleDateString('en-US', {
		month: 'short', day: 'numeric', year: 'numeric',
	})
})
</script>

<template>
	<tr class="border-t border-border">
		<td class="py-4 pr-4 text-body text-brand-navy">{{ formattedDate }}</td>
		<td class="py-4 pr-4 text-body text-brand-navy">{{ subscription.product }}</td>
		<td class="py-4 pr-4 text-body text-brand-navy">Renews {{ formattedRenewal }}</td>
		<td class="py-4 text-body">
			<div>
				<a :href="subscription.actions.changePlanUrl" class="aio-link">Change Plan Level</a>
				<span class="text-brand-navy-40 mx-1">·</span>
				<a :href="subscription.actions.cancelUrl" class="aio-link">Cancel</a>
			</div>
			<div class="mt-0.5">
				<a :href="subscription.actions.updatePaymentUrl" class="aio-link">Update Payment Method</a>
			</div>
		</td>
	</tr>
</template>
