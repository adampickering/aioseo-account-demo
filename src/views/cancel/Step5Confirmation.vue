<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCancellation } from '@/composables/useCancellation'
import CrossPromoCard from '@/components/cancel/CrossPromoCard.vue'

const { user, acknowledgement } = useCancellation()
const acknowledgementLine1 = computed(() => {
	const dot = acknowledgement.value.indexOf('. ')
	return dot !== -1 ? acknowledgement.value.slice(0, dot + 1) : acknowledgement.value
})
const acknowledgementLine2 = computed(() => {
	const dot = acknowledgement.value.indexOf('. ')
	return dot !== -1 ? acknowledgement.value.slice(dot + 2) : ''
})
const copied = ref(false)

function copyCode() {
	navigator.clipboard.writeText('WELCOMEBACK')
	copied.value = true
	setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
	<div class="max-w-[680px] mx-auto">
		<div class="text-center mb-8">
			<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
				{{ user.firstName }}, you're still part of the AIOSEO community.
			</h2>
			<p class="text-body-lg mt-3 max-w-[480px] mx-auto">
				Your subscription has been cancelled.<br>
				Thanks for being a customer, and we hope to see you again.
			</p>
			<p class="text-body-lg mt-1 max-w-[480px] mx-auto">
				{{ acknowledgementLine1 }}<br>
				{{ acknowledgementLine2 }}
			</p>
		</div>

		<div class="flex items-start gap-3 p-5 bg-brand-green-5 border border-green-200/60 rounded-card mb-6">
			<svg aria-hidden="true" class="w-6 h-6 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none">
				<circle cx="12" cy="12" r="10" fill="#00AA63"/>
				<path d="M8 12l3 3 5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			<p class="text-[15px] text-brand-navy m-0 leading-relaxed">
				Your license stays active until <strong>{{ user.renewalDate }}</strong>. After that date, your license will expire and you won't be billed again.
			</p>
		</div>

		<div class="aio-card text-center mb-6 py-8">
			<h3 class="text-[23px] font-bold text-brand-navy m-0 mb-2">Changed your mind?</h3>
			<div class="coupon mb-3 mx-auto" @click="copyCode" role="button" tabindex="0" aria-label="Copy coupon code WELCOMEBACK">
				<div class="coupon-inner">
					<span class="coupon-code">WELCOMEBACK</span>
					<svg v-if="!copied" aria-hidden="true" class="coupon-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
					</svg>
					<svg v-else aria-hidden="true" class="coupon-copy text-brand-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M20 6L9 17l-5-5"/>
					</svg>
				</div>
				<p class="coupon-hint m-0">{{ copied ? 'Copied!' : 'Click to copy' }}</p>
			</div>
			<p class="text-body m-0 mb-6 max-w-[400px] mx-auto">
				Get 50% off when you resubscribe within 30 days.
			</p>
			<button class="aio-btn-green">
				Reactivate my plan
			</button>
		</div>

		<p class="text-overline mb-4">From the Awesome Motive family</p>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center sm:[&>*]:justify-self-stretch">
			<CrossPromoCard
				name="WPForms"
				description="Beautiful contact forms in minutes, no coding required."
				url="https://wpforms.com/"
			>
				<template #logo>
					<img src="https://ps.w.org/wpforms-lite/assets/icon-256x256.png" alt="WPForms" class="w-10 h-10 rounded-lg" loading="lazy" />
				</template>
			</CrossPromoCard>
			<CrossPromoCard
				name="MonsterInsights"
				description="See the Google Analytics stats that matter, right in your dashboard."
				url="https://www.monsterinsights.com/"
			>
				<template #logo>
					<img src="https://ps.w.org/google-analytics-for-wordpress/assets/icon-256x256.png" alt="MonsterInsights" class="w-10 h-10 rounded-lg" loading="lazy" />
				</template>
			</CrossPromoCard>
			<CrossPromoCard
				name="Broken Link Checker"
				description="Find and fix broken links. Protect your SEO and user experience."
				url="https://aioseo.com/broken-link-checker/"
			>
				<template #logo>
					<img src="/broken-link-checker-icon.svg" alt="Broken Link Checker" class="w-10 h-10 rounded-lg" loading="lazy" />
				</template>
			</CrossPromoCard>
		</div>
	</div>
</template>

<style>
.coupon { display: inline-block; cursor: pointer; max-width: 320px; width: 100%; }
.coupon-inner {
	display: flex; align-items: center; justify-content: center; gap: 12px;
	padding: 14px 20px;
	border: 2px dashed var(--color-border);
	border-radius: var(--radius-card);
	background: #F7F8FA;
	transition: border-color 0.15s ease, background-color 0.15s ease;
}
.coupon:hover .coupon-inner {
	border-color: var(--color-brand-blue);
	background: var(--color-brand-blue-10);
}
.coupon-code {
	font-size: 20px; font-weight: 700; letter-spacing: 3px;
	color: var(--color-brand-navy);
}
.coupon-copy { width: 18px; height: 18px; color: var(--color-text-muted); flex-shrink: 0; }
.coupon:hover .coupon-copy { color: var(--color-brand-blue); }
.coupon-hint { font-size: 12px; color: var(--color-text-muted); margin-top: 6px; }
</style>
