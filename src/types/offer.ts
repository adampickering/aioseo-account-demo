export interface UpgradeFeature {
	icon: string
	label: string
}

export interface UpgradeOffer {
	id: string
	title: string
	subtitle: string
	originalPrice: string
	currentPrice: string
	valueLabel: string
	badgeText: string
	ctaLabel: string
	ctaUrl: string
	ctaColor: 'green' | 'blue' | 'amber'
	expiresAt: string
	features: UpgradeFeature[]
}

export interface PromoOffer {
	id: string
	productName: string
	description: string
	iconUrl: string
	ctaLabel: string
	ctaUrl: string
	iconBgColor: string
}
