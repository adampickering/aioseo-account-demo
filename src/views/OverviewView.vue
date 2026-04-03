<script setup lang="ts">
import { computed } from 'vue'
import { useAccount } from '@/composables/useAccount'
import { useSubscriptions } from '@/composables/useSubscriptions'
import { useAiCredits } from '@/composables/useAiCredits'
import { useOffers } from '@/composables/useOffers'
import { useAnnouncements } from '@/composables/useAnnouncements'

import QuickLinks from '@/components/QuickLinks.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import UpgradeOfferCard from '@/components/UpgradeOfferCard.vue'
import PromoOfferCard from '@/components/PromoOfferCard.vue'
import AnnouncementCard from '@/components/AnnouncementCard.vue'
import HelpSearchSection from '@/components/HelpSearchSection.vue'

const { user, quickLinks } = useAccount()
const { subscriptions } = useSubscriptions()
const { credits, remaining } = useAiCredits()
const { upgradeOffer, promoOffers, showUpgrade, showPromos } = useOffers()
const { announcements } = useAnnouncements()

const fullName = computed(() => `${user.value.firstName} ${user.value.lastName}`)

const hasCredits = computed(() => credits.value.total > 0)

function formatNumber(n: number): string {
	return n.toLocaleString()
}

function formatDate(iso: string): string {
	if (!iso) return ''
	return new Date(iso).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
}
</script>

<template>
	<div class="space-y-10">
		<!-- Two-column layout -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
			<!-- Left column — ONE card containing all sections -->
			<div>
				<div class="aio-card">
					<!-- User info -->
					<div class="flex items-center gap-4">
						<img
							:src="user.avatarUrl"
							:alt="fullName"
							class="w-16 h-16 rounded-full object-cover shrink-0"
						/>
						<div class="min-w-0">
							<h2 class="text-display-sm leading-tight font-heading font-semibold text-brand-navy truncate">
								{{ fullName }}
							</h2>
							<div class="flex items-center gap-1.5 mt-1">
								<span class="text-body text-brand-navy-60 truncate">{{ user.email }}</span>
								<router-link
									to="/profile"
									class="shrink-0 text-brand-navy-40 hover:text-brand-blue transition-colors duration-200"
									title="Edit profile"
								>
									<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
									</svg>
								</router-link>
							</div>
						</div>
					</div>

					<!-- Divider -->
					<div class="border-t border-gray-100 my-6"></div>

					<!-- Quick Links -->
					<h3 class="text-h3 leading-h3 font-heading font-semibold text-brand-navy mb-4">Quick Links</h3>
					<QuickLinks :links="quickLinks" />

					<!-- Divider -->
					<div class="border-t border-gray-100 my-6"></div>

					<!-- Subscriptions -->
					<h3 class="text-h3 leading-h3 font-heading font-semibold text-brand-navy mb-4">Subscriptions</h3>

					<!-- Column headers -->
					<div class="flex items-center justify-between mb-2">
						<span class="text-sm text-brand-navy-40">Product</span>
						<span class="text-sm text-brand-navy-40">Expires</span>
					</div>

					<div class="space-y-3">
						<div
							v-for="sub in subscriptions"
							:key="sub.id"
							class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
						>
							<div class="flex items-center gap-2 min-w-0">
								<span class="text-body font-medium text-brand-navy truncate">{{ sub.product }}</span>
								<StatusBadge :status="sub.status" />
							</div>
							<span class="text-body text-brand-navy-60 shrink-0 ml-4">{{ formatDate(sub.renewsAt) }}</span>
						</div>
					</div>
					<router-link
						to="/billing"
						class="inline-flex items-center gap-1 text-body font-medium text-brand-blue hover:underline transition-all duration-200 mt-4"
					>
						Manage Subscriptions
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
						</svg>
					</router-link>

					<!-- Divider -->
					<div class="border-t border-gray-100 my-6"></div>

					<!-- AI Credits -->
					<template v-if="hasCredits">
						<h3 class="text-h3 leading-h3 font-heading font-semibold text-brand-navy mb-4">AI Credits</h3>

						<div class="flex items-center gap-3 mb-4">
							<!-- AI sparkle icon -->
							<div class="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
								<svg class="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
								</svg>
							</div>
							<div>
								<span class="text-credits font-semibold text-brand-navy">{{ formatNumber(remaining) }}</span>
								<span class="text-body text-brand-navy-60 ml-1.5">Total Available</span>
							</div>
						</div>

						<div class="space-y-1.5 text-body text-brand-navy-60">
							<p>{{ formatNumber(credits.includedInSubscription) }} Credits Included in Subscriptions</p>
							<p v-if="credits.paidCredits > 0">{{ formatNumber(credits.paidCredits) }} PAYG credits</p>
						</div>

						<router-link
							to="/downloads/ai-credits"
							class="inline-flex items-center gap-1 text-body font-medium text-brand-blue hover:underline transition-all duration-200 mt-4"
						>
							Add More Credits
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
							</svg>
						</router-link>
					</template>
				</div>
			</div>

			<!-- Right column -->
			<div>
				<!-- Promo offers (elite users) — ONE card wrapping everything -->
				<div v-if="showPromos" class="aio-card">
					<h3 class="text-display-sm leading-tight font-heading font-semibold text-brand-navy mb-8">Special Offer for You!</h3>
					<div class="space-y-8">
						<PromoOfferCard
							v-for="offer in promoOffers"
							:key="offer.id"
							:offer="offer"
						/>
					</div>
				</div>

				<!-- Upgrade offer (basic/pro users) -->
				<div v-else-if="showUpgrade && upgradeOffer">
					<UpgradeOfferCard :offer="upgradeOffer" />
				</div>
			</div>
		</div>

		<!-- Announcements (full width) -->
		<div>
			<h3 class="text-h3 leading-h3 font-heading font-semibold text-brand-navy mb-5">Announcements</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<AnnouncementCard
					v-for="item in announcements"
					:key="item.id"
					:announcement="item"
				/>
			</div>
		</div>

		<!-- Need Help (full width) -->
		<div>
			<h3 class="text-h3 leading-h3 font-heading font-semibold text-brand-navy mb-5">Need Help?</h3>
			<HelpSearchSection />
		</div>
	</div>
</template>
