<script setup lang="ts">
import { useSubscriptions } from '@/composables/useSubscriptions'
import SubscriptionRow from '@/components/SubscriptionRow.vue'
import PaymentMethodCard from '@/components/PaymentMethodCard.vue'
import OrderRow from '@/components/OrderRow.vue'

const { subscriptions, paymentMethods, orders } = useSubscriptions()
</script>

<template>
	<div class="space-y-10">
		<!-- Section 1: Auto-Renewal Subscriptions — in a card -->
		<div class="aio-card">
			<h2 class="text-h3 font-heading font-semibold text-brand-navy mb-5">Auto-Renewal Subscriptions</h2>
			<div class="overflow-x-auto -mx-10 px-10">
				<table class="w-full min-w-[600px]">
					<thead>
						<tr class="border-b border-gray-200">
							<th class="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Date</th>
							<th class="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Product</th>
							<th class="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
							<th class="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Actions</th>
						</tr>
					</thead>
					<tbody>
						<SubscriptionRow
							v-for="sub in subscriptions"
							:key="sub.id"
							:subscription="sub"
						/>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Section 2: Saved Payment Methods — in a card -->
		<div class="aio-card">
			<div class="flex justify-between items-center mb-5">
				<h2 class="text-h3 font-heading font-semibold text-brand-navy">Saved Payments Method</h2>
				<button class="aio-btn-outline-blue cursor-pointer">
					Add Payment Method
				</button>
			</div>

			<!-- Empty state -->
			<div
				v-if="paymentMethods.length === 0"
				class="bg-brand-blue/5 text-center rounded-card p-6"
			>
				<p class="text-text-muted text-sm">No saved payment methods. Add one to make renewals easier.</p>
			</div>

			<!-- Payment method cards -->
			<div v-else class="space-y-3">
				<PaymentMethodCard
					v-for="method in paymentMethods"
					:key="method.id"
					:method="method"
				/>
			</div>
		</div>

		<!-- Section 3: Past Orders — in a card -->
		<div class="aio-card">
			<h2 class="text-h3 font-heading font-semibold text-brand-navy mb-5">Past Orders</h2>
			<div class="overflow-x-auto -mx-10 px-10">
				<table class="w-full min-w-[700px]">
					<thead>
						<tr class="border-b border-gray-200">
							<th class="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Date</th>
							<th class="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Product</th>
							<th class="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Amount</th>
							<th class="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
							<th class="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Actions</th>
						</tr>
					</thead>
					<tbody>
						<OrderRow
							v-for="order in orders"
							:key="order.id"
							:order="order"
						/>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
