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
		line2: 'Suite 100',
		city: 'Wilmington',
		zip: '19801',
		country: 'US',
		state: 'DE',
	},
}

export const licenses: License[] = [
	{
		id: 'lic-pro-001',
		product: 'aioseo',
		productName: 'All in One SEO',
		tier: 'pro',
		tierLabel: 'Pro',
		licenseKey: 'aios-pro-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
		status: 'active',
		expiresAt: '2027-04-01T00:00:00Z',
		siteActivations: {
			used: 5,
			total: 25,
		},
		downloadUrl: '#',
		version: '4.9.4',
		changelogUrl: 'https://aioseo.com/changelog/',
		addons: [
			allAddons['image-seo']!,
			allAddons['video-sitemap']!,
			allAddons['local-business']!,
			allAddons['news-sitemap']!,
			allAddons['link-assistant']!,
			allAddons['index-now']!,
		],
	},
	{
		id: 'lic-blc-001',
		product: 'broken-link-checker',
		productName: 'Broken Link Checker',
		tier: 'basic',
		tierLabel: 'Starter',
		licenseKey: 'blc-start-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
		status: 'active',
		expiresAt: '2027-04-01T00:00:00Z',
		siteActivations: {
			used: 1,
			total: 5,
		},
		links: {
			remaining: 4500,
			total: 5000,
		},
		downloadUrl: '#',
		version: '2.1.0',
		changelogUrl: 'https://brokenlinkchecker.com/changelog/',
		addons: [],
	},
]

export const aiCredits: AiCredits = {
	used: 25000,
	total: 50000,
	includedInSubscription: 50000,
	paidCredits: 0,
	expiresAt: '2027-04-01T00:00:00Z',
}

export const subscriptions: Subscription[] = [
	{
		id: 'sub-001',
		date: '2025-06-01T00:00:00Z',
		product: 'All in One SEO Pro',
		status: 'active',
		renewsAt: '2027-06-01T00:00:00Z',
		actions: {
			changePlanUrl: '#',
			cancelUrl: '#',
			updatePaymentUrl: '#',
		},
	},
	{
		id: 'sub-002',
		date: '2025-07-15T00:00:00Z',
		product: 'Broken Link Checker Starter',
		status: 'active',
		renewsAt: '2027-07-15T00:00:00Z',
		actions: {
			changePlanUrl: '#',
			cancelUrl: '#',
			updatePaymentUrl: '#',
		},
	},
]

export const paymentMethods: PaymentMethod[] = [
	{
		id: 'pm-001',
		brand: 'mastercard',
		last4: '8210',
		expiresAt: '2029-03-01T00:00:00Z',
		isDefault: true,
	},
]

export const orders: Order[] = [
	{
		id: 'ord-001',
		date: '2025-06-01T00:00:00Z',
		product: 'All in One SEO Pro',
		amount: '$399.50',
		status: 'completed',
		invoiceUrl: '#',
	},
	{
		id: 'ord-002',
		date: '2025-07-15T00:00:00Z',
		product: 'Broken Link Checker Starter',
		amount: '$99.50',
		status: 'completed',
		invoiceUrl: '#',
	},
]

export const upgradeOffer: UpgradeOffer = {
	id: 'offer-pro-to-elite',
	title: 'Upgrade to Elite',
	subtitle: 'Get unlimited access to every AIOSEO feature and addon.',
	originalPrice: '$599.50/yr',
	currentPrice: '$299.75/yr',
	valueLabel: 'Save 50%',
	badgeText: 'Best Value',
	ctaLabel: 'Upgrade Now',
	ctaUrl: '#',
	ctaColor: 'blue',
	expiresAt: '2026-07-15T00:00:00Z',
	features: [
		{ icon: 'robot', label: '200,000 AI Credits' },
		{ icon: 'link', label: 'Link Assistant' },
		{ icon: 'api', label: 'REST API Access' },
		{ icon: 'author', label: 'Author SEO (E-E-A-T)' },
		{ icon: 'index', label: 'IndexNow Integration' },
	],
}
