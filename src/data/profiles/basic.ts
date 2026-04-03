import type { User, License, AiCredits, Subscription, PaymentMethod, Order, UpgradeOffer } from '@/types'
import { allAddons } from '@/data/addons'

export const user: User = {
	id: 'usr-001',
	firstName: 'Arnaud',
	lastName: 'Broes',
	email: 'abroes@awesomemotive.com',
	avatarUrl: import.meta.env.BASE_URL + 'assets/images/avatar-arnaud.png',
	billingAddress: {
		line1: '1209 Orange Street',
		line2: '',
		city: 'Wilmington',
		zip: '19801',
		country: 'US',
		state: 'DE',
	},
}

export const licenses: License[] = [
	{
		id: 'lic-basic-001',
		product: 'aioseo',
		productName: 'All in One SEO',
		tier: 'basic',
		tierLabel: 'Basic',
		licenseKey: 'aios-basic-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
		status: 'active',
		expiresAt: '2027-04-01T00:00:00Z',
		siteActivations: {
			used: 1,
			total: 1,
		},
		downloadUrl: '#',
		version: '4.9.4',
		changelogUrl: 'https://aioseo.com/changelog/',
		addons: [
			allAddons['image-seo']!,
			allAddons['video-sitemap']!,
			allAddons['local-business']!,
			allAddons['news-sitemap']!,
		],
	},
]

export const aiCredits: AiCredits = {
	used: 0,
	total: 0,
	includedInSubscription: 0,
	paidCredits: 0,
	expiresAt: '',
}

export const subscriptions: Subscription[] = [
	{
		id: 'sub-001',
		date: '2025-10-01T00:00:00Z',
		product: 'All in One SEO Basic',
		status: 'active',
		renewsAt: '2027-04-01T00:00:00Z',
		actions: {
			changePlanUrl: '#',
			cancelUrl: '#',
			updatePaymentUrl: '#',
		},
	},
	{
		id: 'sub-002',
		date: '2025-11-01T00:00:00Z',
		product: 'Broken Link Checker Starter',
		status: 'active',
		renewsAt: '2027-11-01T00:00:00Z',
		actions: {
			changePlanUrl: '#',
			cancelUrl: '#',
			updatePaymentUrl: '#',
		},
	},
]

export const paymentMethods: PaymentMethod[] = []

export const orders: Order[] = [
	{
		id: 'ord-001',
		date: '2025-10-01T00:00:00Z',
		product: 'All in One SEO Basic',
		amount: '$49.50',
		status: 'completed',
		invoiceUrl: '#',
	},
]

export const upgradeOffer: UpgradeOffer = {
	id: 'offer-basic-to-plus',
	title: 'Upgrade to Plus',
	subtitle: 'Unlock more powerful SEO tools for growing businesses.',
	originalPrice: '$199.50/yr',
	currentPrice: '$79.80/yr',
	valueLabel: 'Save 60%',
	badgeText: 'Most Popular',
	ctaLabel: 'Upgrade Now',
	ctaUrl: '#',
	ctaColor: 'green',
	expiresAt: '2026-07-15T00:00:00Z',
	features: [
		{ icon: 'search', label: 'Advanced Search Statistics' },
		{ icon: 'sitemap', label: 'Video & News Sitemaps' },
		{ icon: 'image', label: 'Image SEO Module' },
		{ icon: 'local', label: 'Local Business SEO' },
		{ icon: 'redirect', label: 'Smart Redirects Manager' },
	],
}
