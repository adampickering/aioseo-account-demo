<script setup lang="ts">
import { useSubscriptions } from '@/composables/useSubscriptions'
import SubscriptionRow from '@/components/SubscriptionRow.vue'
import PaymentMethodCard from '@/components/PaymentMethodCard.vue'
import OrderRow from '@/components/OrderRow.vue'

const { subscriptions, paymentMethods, orders } = useSubscriptions()
</script>

<template>
	<div class="space-y-10">
		<!-- Auto-Renewal Subscriptions -->
		<div class="aio-card !p-0">
			<!-- Card header -->
			<div class="px-10 pt-8 pb-5">
				<h2 class="text-h3 font-heading font-semibold text-brand-navy">Auto-Renewal Subscriptions</h2>
			</div>

			<!-- Table -->
			<div class="overflow-x-auto">
				<table class="w-full min-w-[600px]">
					<thead>
						<tr class="border-t border-border">
							<th class="px-10 py-3 text-left text-sm font-normal text-brand-navy-40">Date</th>
							<th class="py-3 text-left text-sm font-normal text-brand-navy-40">Product</th>
							<th class="py-3 text-left text-sm font-normal text-brand-navy-40">Status</th>
							<th class="py-3 text-left text-sm font-normal text-brand-navy-40">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="sub in subscriptions"
							:key="sub.id"
							class="border-t border-border"
						>
							<td class="px-10 py-4 text-body text-brand-navy">
								{{ new Date(sub.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
							</td>
							<td class="py-4 text-body text-brand-navy">{{ sub.product }}</td>
							<td class="py-4 text-body text-brand-navy">
								Renews {{ new Date(sub.renewsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
							</td>
							<td class="py-4 text-body">
								<div>
									<a :href="sub.actions.changePlanUrl" class="aio-link">Change Plan Level</a>
									<span class="text-brand-navy-40 mx-1">·</span>
									<a :href="sub.actions.cancelUrl" class="aio-link">Cancel</a>
								</div>
								<div class="mt-0.5">
									<a :href="sub.actions.updatePaymentUrl" class="aio-link">Update Payment Method</a>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Saved Payments Method -->
		<div class="aio-card !p-0">
			<!-- Card header -->
			<div class="px-10 pt-8 pb-5 flex justify-between items-center">
				<h2 class="text-h3 font-heading font-semibold text-brand-navy">Saved Payments Method</h2>
				<button class="px-5 py-2.5 text-sm font-semibold text-brand-navy bg-white border border-[#E9EAEB] rounded-btn hover:bg-gray-50 transition-all duration-200 cursor-pointer">
					Add Payment Method
				</button>
			</div>
			<div class="border-t border-border"></div>

			<!-- Payment methods -->
			<div class="px-10 py-4">
				<div
					v-if="paymentMethods.length === 0"
					class="py-8 text-center"
				>
					<p class="text-text-muted text-sm">No saved payment methods.</p>
				</div>

				<template v-else>
					<PaymentMethodCard
						v-for="method in paymentMethods"
						:key="method.id"
						:method="method"
					/>
				</template>
			</div>
		</div>

		<!-- Past Orders -->
		<div class="aio-card !p-0">
			<!-- Card header -->
			<div class="px-10 pt-8 pb-5">
				<h2 class="text-h3 font-heading font-semibold text-brand-navy">Past Orders</h2>
			</div>

			<!-- Table -->
			<div class="overflow-x-auto">
				<table class="w-full min-w-[700px]">
					<thead>
						<tr class="border-t border-border">
							<th class="px-10 py-3 text-left text-sm font-normal text-brand-navy-40">Date</th>
							<th class="py-3 text-left text-sm font-normal text-brand-navy-40">Product</th>
							<th class="py-3 text-left text-sm font-normal text-brand-navy-40">Amount</th>
							<th class="py-3 text-left text-sm font-normal text-brand-navy-40">Status</th>
							<th class="py-3 text-left text-sm font-normal text-brand-navy-40">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="order in orders"
							:key="order.id"
							class="border-t border-border"
						>
							<td class="px-10 py-4 text-body text-brand-navy">
								{{ new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
							</td>
							<td class="py-4 text-body text-brand-navy">{{ order.product }}</td>
							<td class="py-4 text-body text-brand-navy">{{ order.amount }}</td>
							<td class="py-4 text-body text-brand-navy">{{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}</td>
							<td class="py-4 text-body">
								<a :href="order.invoiceUrl" class="aio-link underline">Generate Invoice</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
