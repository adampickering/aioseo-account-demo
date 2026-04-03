import { computed } from 'vue'
import { useMockProfile } from './useMockProfile'
import type { UpgradeOffer, PromoOffer } from '@/types'

export function useOffers() {
	const { data } = useMockProfile()

	const upgradeOffer = computed<UpgradeOffer | null>(() => {
		return 'upgradeOffer' in data.value ? (data.value as { upgradeOffer: UpgradeOffer }).upgradeOffer : null
	})

	const promoOffers = computed<PromoOffer[]>(() => {
		return 'promoOffers' in data.value ? (data.value as { promoOffers: PromoOffer[] }).promoOffers : []
	})

	const showUpgrade = computed(() => upgradeOffer.value !== null)
	const showPromos = computed(() => promoOffers.value.length > 0)

	return { upgradeOffer, promoOffers, showUpgrade, showPromos }
}
