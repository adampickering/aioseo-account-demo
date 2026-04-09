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
				cta-text="Yes, Apply My 50% Discount"
				@cta-click="handleOffer('apply-50-discount')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				v-if="lowerPlan"
				title="Switch to a smaller plan"
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
					<div class="px-5 sm:px-6 py-4 flex items-start gap-2.5">
						<div class="w-5 h-5 mt-0.5 shrink-0 text-brand-blue opacity-50">
							<!-- Feature icons based on keyword matching -->
							<svg v-if="adv.feature.includes('SEO') || adv.feature.includes('TruSEO') || adv.feature.includes('On-Page')" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
							<svg v-else-if="adv.feature.includes('Link') || adv.feature.includes('Redirect')" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/></svg>
							<svg v-else-if="adv.feature.includes('Schema') || adv.feature.includes('WooCommerce')" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
							<svg v-else-if="adv.feature.includes('Site') || adv.feature.includes('License') || adv.feature.includes('Install')" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.547l1.607.688a3 3 0 002.346 0l7.047-3.02V14a1 1 0 01-.553.894L10 18.897a1 1 0 01-.7-.324z"/></svg>
							<svg v-else-if="adv.feature.includes('Setup') || adv.feature.includes('Beginner') || adv.feature.includes('Walkthrough')" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>
							<svg v-else-if="adv.feature.includes('Statistics') || adv.feature.includes('Dashboard')" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
							<svg v-else-if="adv.feature.includes('Plugin') || adv.feature.includes('WordPress') || adv.feature.includes('Editor')" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd"/></svg>
							<svg v-else-if="adv.feature.includes('Stability') || adv.feature.includes('Support') || adv.feature.includes('Subscription')" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
							<svg v-else-if="adv.feature.includes('Author') || adv.feature.includes('E-A-T')" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
							<svg v-else viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
						</div>
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

				<!-- Summary badge -->
				<div class="border-t border-brand-blue-10 bg-brand-blue-10/40 px-5 sm:px-6 py-3 grid grid-cols-[1fr_1fr_90px_90px] sm:grid-cols-[1fr_1fr_110px_110px]">
					<div class="col-span-2 flex items-center">
						<span class="text-[13px] font-semibold text-brand-navy">Score</span>
					</div>
					<div class="flex items-center justify-center">
						<span class="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green text-[13px] font-bold rounded-full px-3 py-1">
							{{ competitor.advantages.length }}/{{ competitor.advantages.length }}
						</span>
					</div>
					<div class="flex items-center justify-center">
						<span v-if="competitor.useCheckInstead" class="text-[13px] font-semibold text-text-muted">&mdash;</span>
						<span v-else class="inline-flex items-center gap-1.5 bg-brand-red/10 text-brand-red text-[13px] font-bold rounded-full px-3 py-1">
							0/{{ competitor.advantages.length }}
						</span>
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
					We're sorry for the trouble. Our support team can usually resolve plugin issues within 24 hours, and your plan stays active while we work on it.
				</p>
			</div>

			<OfferCard
				:primary="true"
				title="Let us take a look"
				body="We'll escalate your issue to a support specialist. You'll hear back within 24 hours with a fix or a clear update on what's happening. Your subscription stays fully active while we resolve the issue."
				cta-text="Yes, let me talk to someone"
				@cta-click="handleOffer('talk-to-support')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="Submit a feature request"
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
				title="Pause your subscription for up to 3 months"
				:body="`Keep full access until ${user.renewalDate}. On that date, your subscription pauses instead of renewing. No charges during the pause. If you launch a new site, reactivate in one click and your license transfers over.`"
				cta-text="Pause my subscription"
				@cta-click="handleOffer('pause-subscription')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="Transfer your license to another site"
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
				title="50% off your next renewal"
				:body="`Keep your full ${user.planName} plan—every feature, every integration, priority support—for half the price on your next renewal.`"
				cta-text="Yes, Apply My 50% Discount"
				@cta-click="handleOffer('apply-50-discount')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="Pause your subscription"
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
