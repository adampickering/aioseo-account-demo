<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'
import { useCancellation } from '@/composables/useCancellation'

const router = useRouter()
const store = useCancellationStore()
const { user } = useCancellation()

function continueCancel() {
	store.skipOffer(router)
}
</script>

<template>
	<div class="max-w-[720px] mx-auto">
		<div class="aio-card text-center">
			<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0 mb-3">
				{{ user.firstName }}, let us help with your duplicate subscription.
			</h2>
			<p class="text-[16px] text-brand-navy-60 leading-relaxed mb-6">
				Our billing team can resolve this quickly. We'll ensure you keep the right subscription on the right site(s).
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
				Send my support ticket
			</button>
			<div class="mt-4">
				<button @click="continueCancel" class="aio-link-skip">
					I still want to cancel
				</button>
			</div>
		</div>
	</div>
</template>
