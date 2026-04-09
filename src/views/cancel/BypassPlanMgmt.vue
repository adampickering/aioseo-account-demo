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
			<h2 class="text-[23px] font-bold text-brand-navy m-0 mb-3">
				{{ user.firstName }}, looking to change your plan?
			</h2>
			<p class="text-[16px] text-brand-navy-60 leading-relaxed mb-6">
				You can upgrade or downgrade your AIOSEO plan directly from your account.
			</p>
			<button class="aio-btn-green mb-4">
				Switch to a different plan
			</button>
			<div class="mt-4">
				<button @click="continueCancel" class="aio-link-skip">
					I still want to cancel
				</button>
			</div>
		</div>
	</div>
</template>
