<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'

const router = useRouter()
const store = useCancellationStore()

function continueCancel() {
	store.skipOffer(router)
}
</script>

<template>
	<div class="max-w-[720px] mx-auto">
		<div class="aio-card text-center">
			<h2 class="text-[23px] font-bold text-brand-navy m-0 mb-3">
				Let Us Help With Your Duplicate Subscription
			</h2>
			<p class="text-[16px] text-brand-navy-60 leading-relaxed mb-6">
				It looks like you have a duplicate subscription. Our billing team can resolve this quickly—no need to cancel.
				We'll get this sorted for you.
			</p>
			<div class="bg-brand-blue-5 rounded-card p-6 mb-6 text-left">
				<p class="text-[14px] text-text-muted m-0 mb-2 uppercase font-bold tracking-wide">
					Category: Duplicate Subscription / Billing Issue
				</p>
				<p class="text-[16px] text-brand-navy-60 m-0">
					A support ticket has been pre-filled for you. Our team will review your subscriptions and apply the appropriate credit or cancellation.
				</p>
			</div>
			<button class="aio-btn-green mb-4">
				Contact Billing Support
			</button>
			<div class="mt-4">
				<button @click="continueCancel" class="aio-link-skip">
					I still want to cancel
				</button>
			</div>
		</div>
	</div>
</template>
