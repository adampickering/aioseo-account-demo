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
									<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
									</svg>
								</router-link>
							</div>
						</div>
					</div>

					<!-- Divider -->
					<div class="border-t border-gray-100 my-6"></div>

					<!-- Quick Links -->
					<h3 class="text-h3 font-heading font-semibold text-brand-navy mb-4">Quick Links</h3>
					<QuickLinks :links="quickLinks" />

					<!-- Divider -->
					<div class="border-t border-gray-100 my-6"></div>

					<!-- Subscriptions -->
					<h3 class="text-h3 font-heading font-semibold text-brand-navy mb-4">Subscriptions</h3>

					<!-- Column headers -->
					<div class="flex items-center justify-between mb-2">
						<span class="text-base text-text-muted">Product</span>
						<span class="text-base text-text-muted">Expires</span>
					</div>

					<div class="space-y-3">
						<div
							v-for="sub in subscriptions"
							:key="sub.id"
							class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
						>
							<div class="flex items-center gap-2 min-w-0">
								<span class="text-lg font-semibold text-brand-navy truncate">{{ sub.product }}</span>
								<StatusBadge :status="sub.status" />
							</div>
							<span class="text-body text-brand-navy-60 shrink-0 ml-4">{{ formatDate(sub.renewsAt) }}</span>
						</div>
					</div>
					<router-link
						to="/billing"
						class="inline-flex items-center gap-1 text-lg font-semibold text-brand-blue hover:underline transition-all duration-200 mt-4"
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
						<h3 class="text-h3 font-heading font-semibold text-brand-navy mb-4">AI Credits</h3>

						<div class="flex items-center gap-3 mb-4">
							<!-- AI sparkle icon -->
							<div class="shrink-0">
								<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
									<path d="M5.43949 2.83408C5.70916 1.72197 7.29084 1.72197 7.56051 2.83408L8.30252 5.89413C8.3988 6.29118 8.70882 6.6012 9.10587 6.69748L12.1659 7.43949C13.278 7.70916 13.278 9.29084 12.1659 9.56051L9.10587 10.3025C8.70882 10.3988 8.3988 10.7088 8.30252 11.1059L7.56051 14.1659C7.29084 15.278 5.70916 15.278 5.43949 14.1659L4.69748 11.1059C4.6012 10.7088 4.29118 10.3988 3.89413 10.3025L0.834083 9.56051C-0.278027 9.29084 -0.278028 7.70916 0.834082 7.43949L3.89413 6.69748C4.29118 6.6012 4.6012 6.29118 4.69748 5.89413L5.43949 2.83408Z" fill="#005AE0"/>
									<path d="M14.3474 13.5133C14.5133 12.8289 15.4867 12.8289 15.6526 13.5133L16.1092 15.3964C16.1685 15.6407 16.3593 15.8315 16.6036 15.8908L18.4867 16.3474C19.1711 16.5133 19.1711 17.4867 18.4867 17.6526L16.6036 18.1092C16.3593 18.1685 16.1685 18.3593 16.1092 18.6036L15.6526 20.4867C15.4867 21.1711 14.5133 21.1711 14.3474 20.4867L13.8908 18.6036C13.8315 18.3593 13.6407 18.1685 13.3964 18.1092L11.5133 17.6526C10.8289 17.4867 10.8289 16.5133 11.5133 16.3474L13.3964 15.8908C13.6407 15.8315 13.8315 15.6407 13.8908 15.3964L14.3474 13.5133Z" fill="#005AE0"/>
									<path d="M17.5717 2.71184C17.6806 2.26272 18.3194 2.26272 18.4283 2.71184L18.7279 3.94763C18.7668 4.10798 18.892 4.23318 19.0524 4.27206L20.2882 4.57172C20.7373 4.68062 20.7373 5.31938 20.2882 5.42828L19.0524 5.72794C18.892 5.76682 18.7668 5.89202 18.7279 6.05237L18.4283 7.28816C18.3194 7.73728 17.6806 7.73728 17.5717 7.28816L17.2721 6.05237C17.2332 5.89202 17.108 5.76682 16.9476 5.72794L15.7118 5.42828C15.2627 5.31938 15.2627 4.68062 15.7118 4.57172L16.9476 4.27206C17.108 4.23318 17.2332 4.10798 17.2721 3.94763L17.5717 2.71184Z" fill="#005AE0"/>
									<path d="M6 22C5.44772 22 5 21.5523 5 21C5 20.4477 5.44772 20 6 20C6.55228 20 7 20.4477 7 21C7 21.5523 6.55228 22 6 22Z" fill="#005AE0"/>
									<path d="M1 18C0.447715 18 0 17.5523 0 17C0 16.4477 0.447715 16 1 16C1.55228 16 2 16.4477 2 17C2 17.5523 1.55228 18 1 18Z" fill="#005AE0"/>
									<path d="M12 2C11.4477 2 11 1.55228 11 1C11 0.447715 11.4477 0 12 0C12.5523 0 13 0.447715 13 1C13 1.55228 12.5523 2 12 2Z" fill="#005AE0"/>
									<path d="M21 13C20.4477 13 20 12.5523 20 12C20 11.4477 20.4477 11 21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13Z" fill="#005AE0"/>
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
							class="inline-flex items-center gap-1 text-lg font-semibold text-brand-blue hover:underline transition-all duration-200 mt-4"
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
					<div class="divide-y divide-border">
						<div v-for="offer in promoOffers" :key="offer.id" class="py-6 first:pt-0 last:pb-0">
							<PromoOfferCard :offer="offer" />
						</div>
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
			<h3 class="text-section font-heading font-semibold text-brand-navy mb-5">Announcements</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<AnnouncementCard
					v-for="item in announcements"
					:key="item.id"
					:announcement="item"
				/>
			</div>
		</div>
	</div>
</template>
