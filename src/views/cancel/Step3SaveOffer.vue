<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'
import { useCancellation } from '@/composables/useCancellation'
import OfferCard from '@/components/cancel/OfferCard.vue'

const router = useRouter()
const store = useCancellationStore()
const { user, competitorData, getLowerPlan } = useCancellation()

const variant = computed(() => store.selectedReason?.variant ?? 'H')

const competitor = computed(() => {
	const name = store.followUpValue || ''
	return competitorData.value[name] ?? competitorData.value._default
})
const competitorName = computed(() => {
	const name = store.followUpValue || ''
	return competitorData.value[name] ? name : 'Other SEO Tools'
})

const lowerPlan = computed(() => getLowerPlan(user.value.planKey))

const showRenewalReminderLine = computed(() =>
	variant.value === 'B' && ['Charged unexpectedly', 'Forgot to cancel'].includes(store.followUpValue)
)

function handleOffer(action: string) {
	alert(`Action: ${action} (prototype — would trigger backend)`)
}

function handleSaveOfferSkip() {
	store.skipOffer(router)
}

function keepPlan() {
	store.keepPlan(router)
}
</script>

<template>
	<div class="max-w-[680px] mx-auto">
		<template v-if="variant === 'A'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					{{ user.firstName }}, what if you could keep everything for half the price?
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					We get it&mdash;budgets are tight. Here's an exclusive deal to keep your SEO running without breaking the bank.
				</p>
			</div>

			<OfferCard
				:primary="true"
				:badge="`Save $${user.savings}`"
				title="50% off your next renewal"
				:body="`Keep every feature you have right now—TruSEO Analysis, Smart Sitemaps, Schema Generator, and everything else in your ${user.planName} plan—for half the price on your next renewal.`"
				cta-text="Yes, apply my 50% discount"
				@cta-click="handleOffer('apply-50-discount')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				v-if="lowerPlan"
				title="Switch to a smaller plan"
				:body="`Your current ${user.planName} plan covers ${user.sites} sites. If you only need coverage for fewer sites, you could switch to ${lowerPlan.name} and save $${(user.annualPrice - lowerPlan.price).toFixed(2)}/year while keeping the core features you use most.`"
				cta-text="Compare plans"
				cta-type="blue"
				@cta-click="handleOffer('compare-plans')"
			/>
		</template>

		<template v-if="variant === 'B'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					{{ user.firstName }}, you don't have to cancel&mdash;you can pause instead.
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					We hear you. Unexpected charges and auto-renewals are frustrating. Instead of losing everything, you can pause and come back when you're ready.
				</p>
			</div>

			<div v-if="showRenewalReminderLine" class="flex items-start gap-3 p-4 mb-6 bg-brand-blue-5 rounded-card border border-brand-blue-10">
				<svg aria-hidden="true" class="w-5 h-5 mt-0.5 shrink-0 text-brand-blue" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M10 2a8 8 0 100 16 8 8 0 000-16z" stroke-linecap="round"/>
					<path d="M10 6v4l2.5 1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				<p class="text-[15px] text-brand-navy m-0">
					<strong>We'll remind you before every renewal.</strong> You'll get an email 14 days before your next billing date. No surprises, ever.
				</p>
			</div>

			<OfferCard
				:primary="true"
				title="Pause your subscription"
				:body="`Keep full access until ${user.renewalDate}. On that date, instead of renewing, your subscription will pause for up to 3 months. No charges, no surprises. When you're ready, reactivate in one click at your current rate.`"
				cta-text="Pause my subscription"
				@cta-click="handleOffer('pause-subscription')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="50% off your next renewal"
				:body="`Not interested in pausing? Keep your plan active at half the price. You'll save $${user.savings} on your next renewal and we'll send you a reminder 14 days before it's due.`"
				cta-text="Apply 50% discount instead"
				cta-type="blue"
				@cta-click="handleOffer('apply-50-discount')"
			/>
		</template>

		<template v-if="variant === 'C'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					{{ user.firstName }}, let us fix this before you go.
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					We're sorry for the trouble. Our support team can usually resolve plugin issues within 24 hours, and your plan stays active while we work on it.
				</p>
			</div>

			<OfferCard
				:primary="true"
				title="Priority technical support"
				body="We'll escalate your issue to a support specialist. You'll hear back within 24 hours with a fix or a clear update on what's happening. Your subscription stays fully active while we resolve the issue."
				cta-text="Yes, fix my issue first"
				@cta-click="handleOffer('priority-support')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="50% off while we work on it"
				body="If you'd rather keep your plan but at a lower cost while things get sorted, here's 50% off your next renewal."
				cta-text="Apply 50% discount"
				cta-type="blue"
				@cta-click="handleOffer('apply-50-discount')"
			/>
		</template>

		<template v-if="variant === 'D'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					Before you switch to {{ competitorName }}, here's what you'd be giving up.
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					{{ competitor.subhead }}
				</p>
			</div>

			<div class="bg-brand-blue-5 border border-brand-blue-10 rounded-card overflow-hidden">
				<!-- Header row -->
				<div class="grid grid-cols-[1fr_1fr_90px_90px] sm:grid-cols-[1fr_1fr_110px_110px] text-[13px] font-bold bg-brand-blue-10/60">
					<div class="px-5 sm:px-6 py-3.5 text-brand-navy">Feature</div>
					<div class="px-4 sm:px-6 py-3.5 text-brand-navy">What this means for you</div>
					<div class="py-3.5 text-center text-brand-blue flex items-center justify-center gap-1.5 bg-brand-blue/[0.04]">
						<img src="/assets/icons/tab-aioseo.svg" alt="" class="w-4 h-4" />
						AIOSEO
					</div>
					<div class="px-2 py-3.5 text-center text-text-muted">{{ competitorName }}</div>
				</div>

				<!-- Data rows -->
				<div
					v-for="(adv, idx) in competitor.advantages"
					:key="adv.feature"
					class="grid grid-cols-[1fr_1fr_90px_90px] sm:grid-cols-[1fr_1fr_110px_110px] border-t border-brand-blue-10 transition-colors duration-150 hover:bg-brand-blue-10/30"
					:class="idx % 2 === 0 ? 'bg-white' : 'bg-brand-blue-5/50'"
				>
					<div class="px-5 sm:px-6 py-4">
						<span class="text-[15px] font-bold text-brand-navy">{{ adv.feature }}</span>
					</div>
					<div class="px-4 sm:px-6 py-4">
						<span class="text-[13px] text-text-secondary leading-relaxed">{{ adv.detail }}</span>
					</div>
					<!-- AIOSEO column — highlighted -->
					<div class="py-4 flex items-center justify-center bg-brand-blue/[0.04]">
						<div class="w-7 h-7 rounded-full bg-brand-green/10 flex items-center justify-center">
							<svg aria-hidden="true" class="w-4 h-4 text-brand-green" viewBox="0 0 20 20" fill="none">
								<path d="M4 10l4 4 8-8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</div>
					</div>
					<!-- Competitor column -->
					<div class="px-2 py-4 flex flex-col items-center justify-center gap-1">
						<template v-if="competitor.useCheckInstead">
							<span class="text-[11px] font-semibold text-text-muted bg-gray-100 rounded-full px-2.5 py-0.5">Check</span>
						</template>
						<template v-else>
							<div class="w-7 h-7 rounded-full bg-brand-red/10 flex items-center justify-center">
								<svg aria-hidden="true" class="w-4 h-4 text-brand-red" viewBox="0 0 20 20" fill="none">
									<path d="M14 6L6 14M6 6l8 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</div>
							<span class="text-[10px] text-text-muted">Not included</span>
						</template>
					</div>
				</div>


				<!-- Action buttons -->
				<div class="border-t border-brand-blue-10 bg-white px-5 sm:px-6 py-5 flex flex-col sm:flex-row gap-3">
					<button @click="keepPlan" class="aio-btn-green">
						Keep my AIOSEO plan
					</button>
					<a href="https://aioseo.com/feature-comparison/" target="_blank" rel="noopener noreferrer" class="aio-btn-outline-blue no-underline">
						See full comparison
					</a>
				</div>
			</div>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="50% off your next renewal"
				body="Still thinking about it? Stay for half the price while you decide."
				cta-text="Apply 50% discount"
				cta-type="blue"
				@cta-click="handleOffer('apply-50-discount')"
			/>
		</template>

		<template v-if="variant === 'E'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					{{ user.firstName }}, you might already have what you need.
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					AIOSEO has a lot of features under the hood, and our team can help you find the right one. If what you're looking for truly doesn't exist yet, we want to hear about it.
				</p>
			</div>

			<OfferCard
				:primary="true"
				title="Let us take a look"
				body="Before you cancel, let our support team check if there's a feature or workaround that does what you need. You'd be surprised how often the answer is already built in. It'll take a few minutes, and your plan stays active while we look into it."
				cta-text="Yes, let me talk to someone"
				@cta-click="handleOffer('talk-to-support')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="Share my idea"
				body="If AIOSEO doesn't do what you need yet, tell us. Feature requests go directly to our product team and help shape what we build. You can also browse requests from other users to upvote ideas you care about."
				cta-text="Share my idea"
				cta-type="blue"
				@cta-click="handleOffer('feature-request')"
			/>
		</template>

		<template v-if="variant === 'F'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					{{ user.firstName }}, your license doesn't have to go with the site.
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					Plans change. Instead of cancelling, you can pause your subscription and reactivate whenever you're ready&mdash;even on a different site.
				</p>
			</div>

			<OfferCard
				:primary="true"
				title="Pause your subscription for up to 3 months"
				:body="`Keep full access until ${user.renewalDate}. On that date, your subscription pauses instead of renewing. No charges during the pause. If you launch a new site, reactivate in one click and your license transfers over.`"
				cta-text="Pause my subscription"
				@cta-click="handleOffer('pause-subscription')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="Transfer your license to another site"
				body="If you have another WordPress site, you can move your AIOSEO license there right now. No extra cost, no new purchase."
				cta-text="Transfer my license"
				cta-type="blue"
				@cta-click="handleOffer('transfer-license')"
			/>
		</template>

		<template v-if="variant === 'H'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					We've got an exclusive offer for you, {{ user.firstName }}.
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					Before you finalize, here's a chance to keep everything you have at a lower price.
				</p>
			</div>

			<OfferCard
				:primary="true"
				:badge="`Save $${user.savings}`"
				title="50% off your next renewal"
				:body="`Keep your full ${user.planName} plan—every feature, every integration, priority support—for half the price on your next renewal.`"
				cta-text="Yes, apply my 50% discount"
				@cta-click="handleOffer('apply-50-discount')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="Pause your subscription"
				:body="`Not the right time? Pause for up to 3 months. You'll keep full access until ${user.renewalDate}, and nothing will be charged during the pause.`"
				cta-text="Pause instead"
				cta-type="blue"
				@cta-click="handleOffer('pause-subscription')"
			/>
		</template>

		<div class="text-center mt-8">
			<button @click="handleSaveOfferSkip" class="aio-link-skip">
				No thanks, continue cancelling
			</button>
		</div>
	</div>
</template>
