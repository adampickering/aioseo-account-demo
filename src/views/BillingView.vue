<script setup lang="ts">
import { ref } from 'vue'
import type { Subscription, PaymentMethod } from '@/types'
import { useSubscriptions } from '@/composables/useSubscriptions'
import PaymentMethodCard from '@/components/PaymentMethodCard.vue'
import BaseModal from '@/components/BaseModal.vue'

const { subscriptions, paymentMethods, orders } = useSubscriptions()

// Modal states
const showAddPayment = ref(false)
const showDeletePayment = ref(false)
const showChangePlan = ref(false)
const deletingMethod = ref<PaymentMethod | null>(null)
const selectedSub = ref<Subscription | null>(null)
const deleteConfirmed = ref(false)

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1)
}

function openDeleteModal(method: PaymentMethod) {
	deletingMethod.value = method
	deleteConfirmed.value = false
	showDeletePayment.value = true
}

function confirmDelete() {
	deleteConfirmed.value = true
	setTimeout(() => {
		showDeletePayment.value = false
		deleteConfirmed.value = false
	}, 1500)
}

function openChangePlan(sub: Subscription) {
	selectedSub.value = sub
	showChangePlan.value = true
}
</script>

<template>
	<div class="space-y-10">
		<!-- Auto-Renewal Subscriptions -->
		<div class="aio-card !p-0">
			<div class="px-10 pt-8 pb-5">
				<h2 class="text-h3 font-heading font-semibold text-brand-navy">Auto-Renewal Subscriptions</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full min-w-[600px]">
					<thead>
						<tr class="border-t border-border">
							<th class="px-10 py-3 text-left text-base font-normal text-text-muted">Date</th>
							<th class="py-3 text-left text-base font-normal text-text-muted">Product</th>
							<th class="py-3 text-left text-base font-normal text-text-muted">Status</th>
							<th class="py-3 text-left text-base font-normal text-text-muted">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="sub in subscriptions" :key="sub.id" class="border-t border-border">
							<td class="px-10 py-4 text-body text-brand-navy">{{ formatDate(sub.date) }}</td>
							<td class="py-4 text-body text-brand-navy">{{ sub.product }}</td>
							<td class="py-4 text-body text-brand-navy">Renews {{ formatDate(sub.renewsAt) }}</td>
							<td class="py-4 text-body">
								<div>
									<button @click="openChangePlan(sub)" class="aio-link bg-transparent border-0 cursor-pointer font-inherit text-body p-0">Change Plan Level</button>
									<span class="text-brand-navy-40 mx-1">·</span>
									<button @click="openChangePlan(sub)" class="aio-link bg-transparent border-0 cursor-pointer font-inherit text-body p-0">Cancel</button>
								</div>
								<div class="mt-0.5">
									<button @click="showAddPayment = true" class="aio-link bg-transparent border-0 cursor-pointer font-inherit text-body p-0">Update Payment Method</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Saved Payments Method -->
		<div class="aio-card !p-0">
			<div class="px-10 pt-8 pb-5 flex justify-between items-center">
				<h2 class="text-h3 font-heading font-semibold text-brand-navy">Saved Payments Method</h2>
				<button
					@click="showAddPayment = true"
					class="px-5 py-2.5 text-sm font-semibold text-brand-navy bg-white border border-[#E9EAEB] rounded-btn hover:bg-gray-50 transition-all duration-200 cursor-pointer"
				>
					Add Payment Method
				</button>
			</div>
			<div class="border-t border-border"></div>
			<div class="px-10 py-4">
				<div v-if="paymentMethods.length === 0" class="py-8 text-center">
					<p class="text-text-muted text-sm">No saved payment methods.</p>
				</div>
				<div v-else class="divide-y divide-border">
					<PaymentMethodCard
						v-for="method in paymentMethods"
						:key="method.id"
						:method="method"
						@delete="openDeleteModal(method)"
						@make-default="() => {}"
					/>
				</div>
			</div>
		</div>

		<!-- Past Orders -->
		<div class="aio-card !p-0">
			<div class="px-10 pt-8 pb-5">
				<h2 class="text-h3 font-heading font-semibold text-brand-navy">Past Orders</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full min-w-[700px]">
					<thead>
						<tr class="border-t border-border">
							<th class="px-10 py-3 text-left text-base font-normal text-text-muted">Date</th>
							<th class="py-3 text-left text-base font-normal text-text-muted">Product</th>
							<th class="py-3 text-left text-base font-normal text-text-muted">Amount</th>
							<th class="py-3 text-left text-base font-normal text-text-muted">Status</th>
							<th class="py-3 text-left text-base font-normal text-text-muted">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="order in orders" :key="order.id" class="border-t border-border">
							<td class="px-10 py-4 text-body text-brand-navy">{{ formatDate(order.date) }}</td>
							<td class="py-4 text-body text-brand-navy">{{ order.product }}</td>
							<td class="py-4 text-body text-brand-navy">{{ order.amount }}</td>
							<td class="py-4 text-body text-brand-navy">{{ capitalize(order.status) }}</td>
							<td class="py-4 text-body">
								<a :href="order.invoiceUrl" class="aio-link underline">Generate Invoice</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Modal: Add Payment Method -->
		<BaseModal title="Add Payment Method" :show="showAddPayment" @close="showAddPayment = false">
			<div class="space-y-5">
				<div>
					<label for="card-number" class="text-sm font-semibold text-brand-navy mb-1 block">Card Number</label>
					<input id="card-number" type="text" placeholder="1234 5678 9012 3456" class="aio-input text-sm" />
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="card-expiry" class="text-sm font-semibold text-brand-navy mb-1 block">Expiry Date</label>
						<input id="card-expiry" type="text" placeholder="MM / YY" class="aio-input text-sm" />
					</div>
					<div>
						<label for="card-cvc" class="text-sm font-semibold text-brand-navy mb-1 block">CVC</label>
						<input id="card-cvc" type="text" placeholder="123" class="aio-input text-sm" />
					</div>
				</div>
				<div>
					<label for="card-name" class="text-sm font-semibold text-brand-navy mb-1 block">Name on Card</label>
					<input id="card-name" type="text" placeholder="Full name as shown on card" class="aio-input text-sm" />
				</div>
			</div>
			<template #footer>
				<button @click="showAddPayment = false" class="px-5 py-2.5 text-sm font-semibold text-brand-navy bg-white border border-[#E9EAEB] rounded-btn hover:bg-gray-50 transition-all duration-200 cursor-pointer">
					Cancel
				</button>
				<button @click="showAddPayment = false" class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-btn hover:opacity-90 transition-all duration-200 cursor-pointer">
					Add Payment Method
				</button>
			</template>
		</BaseModal>

		<!-- Modal: Delete Payment Method -->
		<BaseModal title="Delete Payment Method" :show="showDeletePayment" @close="showDeletePayment = false">
			<template v-if="!deleteConfirmed">
				<div class="text-center space-y-4">
					<div class="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center mx-auto">
						<svg class="w-7 h-7 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
						</svg>
					</div>
					<p class="text-body text-brand-navy">
						Are you sure you want to delete the
						<span class="font-semibold" v-if="deletingMethod">{{ deletingMethod.brand === 'visa' ? 'Visa' : deletingMethod.brand === 'mastercard' ? 'Mastercard' : deletingMethod.brand }} ending in {{ deletingMethod.last4 }}</span>?
					</p>
					<p class="text-sm text-brand-navy-40">This action cannot be undone.</p>
				</div>
			</template>
			<template v-else>
				<div class="text-center space-y-4 py-4">
					<div class="w-14 h-14 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto">
						<svg class="w-7 h-7 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
						</svg>
					</div>
					<p class="text-body font-semibold text-brand-navy">Payment method deleted</p>
				</div>
			</template>
			<template #footer v-if="!deleteConfirmed">
				<button @click="showDeletePayment = false" class="px-5 py-2.5 text-sm font-semibold text-brand-navy bg-white border border-[#E9EAEB] rounded-btn hover:bg-gray-50 transition-all duration-200 cursor-pointer">
					Keep It
				</button>
				<button @click="confirmDelete" class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-red rounded-btn hover:opacity-90 transition-all duration-200 cursor-pointer">
					Yes, Delete
				</button>
			</template>
		</BaseModal>

		<!-- Modal: Change Plan / Cancel / Update Payment -->
		<BaseModal title="Manage Subscription" :show="showChangePlan" @close="showChangePlan = false">
			<div v-if="selectedSub" class="space-y-6">
				<div class="bg-bg-light rounded-card p-5">
					<p class="text-sm text-text-muted mb-1">Current Plan</p>
					<p class="text-lg font-semibold text-brand-navy">{{ selectedSub.product }}</p>
					<p class="text-sm text-brand-navy-40 mt-1">Renews {{ formatDate(selectedSub.renewsAt) }}</p>
				</div>

				<div class="space-y-3">
					<button class="w-full flex items-center gap-4 p-4 border border-border rounded-card hover:border-brand-blue hover:bg-brand-blue-5 transition-all duration-200 cursor-pointer bg-white text-left group">
						<div class="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0 group-hover:bg-brand-blue/20 transition-colors duration-200">
							<svg class="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-3L16.5 18m0 0L12 13.5m4.5 4.5V9" />
							</svg>
						</div>
						<div>
							<p class="text-body font-semibold text-brand-navy">Change Plan Level</p>
							<p class="text-sm text-brand-navy-40">Upgrade or downgrade your subscription</p>
						</div>
					</button>

					<button class="w-full flex items-center gap-4 p-4 border border-border rounded-card hover:border-brand-blue hover:bg-brand-blue-5 transition-all duration-200 cursor-pointer bg-white text-left group">
						<div class="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0 group-hover:bg-brand-blue/20 transition-colors duration-200">
							<svg class="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
							</svg>
						</div>
						<div>
							<p class="text-body font-semibold text-brand-navy">Update Payment Method</p>
							<p class="text-sm text-brand-navy-40">Change the card used for this subscription</p>
						</div>
					</button>

					<button class="w-full flex items-center gap-4 p-4 border border-border rounded-card hover:border-brand-red hover:bg-brand-red/5 transition-all duration-200 cursor-pointer bg-white text-left group">
						<div class="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0 group-hover:bg-brand-red/20 transition-colors duration-200">
							<svg class="w-5 h-5 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
						<div>
							<p class="text-body font-semibold text-brand-red">Cancel Subscription</p>
							<p class="text-sm text-brand-navy-40">Your access continues until {{ formatDate(selectedSub.renewsAt) }}</p>
						</div>
					</button>
				</div>
			</div>
			<template #footer>
				<button @click="showChangePlan = false" class="px-5 py-2.5 text-sm font-semibold text-brand-navy bg-white border border-[#E9EAEB] rounded-btn hover:bg-gray-50 transition-all duration-200 cursor-pointer">
					Close
				</button>
			</template>
		</BaseModal>
	</div>
</template>
