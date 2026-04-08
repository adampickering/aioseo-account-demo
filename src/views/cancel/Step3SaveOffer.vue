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
				title="50% Off Your Next Renewal"
				:body="`Keep every feature you have right now—TruSEO Analysis, Smart Sitemaps, Schema Generator, and everything else in your ${user.planName} plan—for half the price on your next renewal.`"
				cta-text="Yes, Apply My 50% Discount"
				@cta-click="handleOffer('apply-50-discount')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				v-if="lowerPlan"
				title="Switch to a Smaller Plan"
				:body="`Your current ${user.planName} plan covers ${user.sites} sites. If you only need coverage for fewer sites, you could switch to ${lowerPlan.name} and save $${(user.annualPrice - lowerPlan.price).toFixed(2)}/year while keeping the core features you use most.`"
				cta-text="Compare Plans"
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
					We hear you&mdash;unexpected charges and auto-renewals are frustrating. Instead of losing everything, you can pause and pick back up when you're ready.
				</p>
			</div>

			<div v-if="showRenewalReminderLine" class="flex items-start gap-3 p-4 mb-6 bg-brand-green-5 rounded-card border border-green-200/50">
				<svg aria-hidden="true" class="w-5 h-5 mt-0.5 shrink-0 text-brand-green" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M10 2a8 8 0 100 16 8 8 0 000-16z" stroke-linecap="round"/>
					<path d="M10 6v4l2.5 1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				<p class="text-[15px] text-brand-navy m-0">
					<strong>We'll remind you before every renewal.</strong> You'll get an email 14 days before your next billing date&mdash;no surprises, ever.
				</p>
			</div>

			<OfferCard
				:primary="true"
				title="Pause Your Subscription"
				:body="`Keep full access until ${user.renewalDate}. On that date, instead of renewing, your subscription will pause for up to 3 months. No charges, no surprises. When you're ready, reactivate in one click at your current rate.`"
				cta-text="Pause My Subscription"
				@cta-click="handleOffer('pause-subscription')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="50% Off Your Next Renewal"
				:body="`Not interested in pausing? Keep your plan active at half the price. You'll save $${user.savings} on your next renewal and we'll send you a reminder 14 days before it's due.`"
				cta-text="Apply 50% Discount Instead"
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
				title="Priority Technical Support"
				body="We'll escalate your issue to a support specialist. You'll hear back within 24 hours with a fix or a clear update on what's happening. Your subscription stays fully active while we resolve the issue."
				cta-text="Yes, Fix My Issue First"
				@cta-click="handleOffer('priority-support')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="50% Off While We Work on It"
				body="If you'd rather keep your plan but at a lower cost while things get sorted, here's 50% off your next renewal."
				cta-text="Apply 50% Discount"
				cta-type="blue"
				@cta-click="handleOffer('apply-50-discount')"
			/>
		</template>

		<template v-if="variant === 'D'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					{{ user.firstName }}, before you switch&mdash;here's what you'd be giving up.
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					We're sorry for the trouble. Our support team can usually resolve plugin issues within 24 hours, and your plan stays active while we work on it.
				</p>
			</div>

			<div class="aio-card-primary p-0 overflow-hidden">
				<div class="grid grid-cols-[1fr_90px_90px] sm:grid-cols-[1fr_120px_120px] text-[14px] font-bold">
					<div class="px-4 sm:px-6 py-3 text-brand-navy">Feature</div>
					<div class="px-3 py-3 text-center text-brand-green">AIOSEO</div>
					<div class="px-3 py-3 text-center text-text-muted">{{ competitorName }}</div>
				</div>

				<div
					v-for="adv in competitor.advantages"
					:key="adv.feature"
					class="grid grid-cols-[1fr_90px_90px] sm:grid-cols-[1fr_120px_120px] border-t border-border"
				>
					<div class="px-4 sm:px-6 py-3">
						<span class="text-[15px] font-bold text-brand-navy block">{{ adv.feature }}</span>
						<span class="text-[13px] text-text-muted block mt-0.5">{{ adv.detail }}</span>
					</div>
					<div class="px-3 py-3 flex items-center justify-center">
						<svg aria-hidden="true" class="w-5 h-5 text-brand-green" viewBox="0 0 20 20" fill="none">
							<path d="M4 10l4 4 8-8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</div>
					<div class="px-3 py-3 flex items-center justify-center">
						<svg aria-hidden="true" class="w-5 h-5 text-brand-red" viewBox="0 0 20 20" fill="none">
							<path d="M14 6L6 14M6 6l8 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</div>
				</div>

				<div class="border-t border-border px-4 sm:px-6 py-5 flex flex-col sm:flex-row gap-3">
					<button @click="keepPlan" class="aio-btn-green">
						Keep My AIOSEO Plan
					</button>
					<a href="https://aioseo.com/feature-comparison/" target="_blank" rel="noopener noreferrer" class="aio-btn-outline-blue no-underline">
						See Full Comparison
					</a>
				</div>
			</div>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="50% Off Your Next Renewal"
				body="Still thinking about it? Stay for half the price and see how AIOSEO's latest updates compare. If you're still not satisfied after your next renewal, you can always cancel then."
				cta-text="Apply 50% Discount"
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
					We're sorry for the trouble. Our support team can usually resolve plugin issues within 24 hours, and your plan stays active while we work on it.
				</p>
			</div>

			<OfferCard
				:primary="true"
				title="Let Us Take a Look"
				body="We'll escalate your issue to a support specialist. You'll hear back within 24 hours with a fix or a clear update on what's happening. Your subscription stays fully active while we resolve the issue."
				cta-text="Yes, Let Me Talk to Someone"
				@cta-click="handleOffer('talk-to-support')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="Submit a Feature Request"
				body="If AIOSEO doesn't do what you need yet, tell us. Feature requests go directly to our product team and help shape what we build. You can also browse requests from other users to upvote ideas you care about."
				cta-text="Submit a Feature Request"
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
				title="Pause Your Subscription for Up to 3 Months"
				:body="`Keep full access until ${user.renewalDate}. On that date, your subscription pauses instead of renewing. No charges during the pause. If you launch a new site, reactivate in one click and your license transfers over.`"
				cta-text="Pause My Subscription"
				@cta-click="handleOffer('pause-subscription')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="Transfer Your License to Another Site"
				body="If you have another WordPress site, you can move your AIOSEO license there right now. No extra cost, no new purchase."
				cta-text="Transfer My License"
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
				title="50% Off Your Next Renewal"
				:body="`Keep your full ${user.planName} plan—every feature, every integration, priority support—for half the price on your next renewal.`"
				cta-text="Yes, Apply My 50% Discount"
				@cta-click="handleOffer('apply-50-discount')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="Pause Your Subscription"
				:body="`Not the right time? Pause for up to 3 months. You'll keep full access until ${user.renewalDate}, and nothing will be charged during the pause.`"
				cta-text="Pause Instead"
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
