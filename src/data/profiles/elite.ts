import type { User, License, AiCredits, Subscription, PaymentMethod, Order, PromoOffer } from '@/types'
import { allAddons } from '@/data/addons'

export const user: User = {
	id: 'usr-001',
	firstName: 'Arnaud',
	lastName: 'Broes',
	email: 'abroes@awesomemotive.com',
	avatarUrl: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=80',
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
		id: 'lic-elite-001',
		product: 'aioseo',
		productName: 'All in One SEO',
		tier: 'elite',
		tierLabel: 'Elite',
		licenseKey: 'aios-elite-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
		status: 'active',
		expiresAt: '2027-04-01T00:00:00Z',
		siteActivations: {
			used: 12,
			total: 100,
		},
		downloadUrl: '#',
		version: '4.9.4',
		changelogUrl: 'https://aioseo.com/changelog/',
		addons: Object.values(allAddons),
	},
	{
		id: 'lic-blc-001',
		product: 'broken-link-checker',
		productName: 'Broken Link Checker',
		tier: 'elite',
		tierLabel: 'Premium',
		licenseKey: 'blc-prem-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
		status: 'active',
		expiresAt: '2027-04-01T00:00:00Z',
		siteActivations: {
			used: 3,
			total: 50,
		},
		links: {
			remaining: 50000,
			total: 50000,
		},
		downloadUrl: '#',
		version: '2.1.0',
		changelogUrl: 'https://brokenlinkchecker.com/changelog/',
		addons: [],
	},
]

export const aiCredits: AiCredits = {
	used: 10000,
	total: 200000,
	includedInSubscription: 200000,
	paidCredits: 0,
	expiresAt: '2027-04-01T00:00:00Z',
}

export const subscriptions: Subscription[] = [
	{
		id: 'sub-001',
		date: '2025-04-01T00:00:00Z',
		product: 'All in One SEO Elite',
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
		date: '2025-06-15T00:00:00Z',
		product: 'Broken Link Checker Premium',
		status: 'active',
		renewsAt: '2027-06-15T00:00:00Z',
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
		brand: 'visa',
		last4: '4242',
		expiresAt: '2028-12-01T00:00:00Z',
		isDefault: true,
	},
]

export const orders: Order[] = [
	{
		id: 'ord-001',
		date: '2025-04-01T00:00:00Z',
		product: 'All in One SEO Elite',
		amount: '$599.50',
		status: 'completed',
		invoiceUrl: '#',
	},
	{
		id: 'ord-002',
		date: '2025-03-15T00:00:00Z',
		product: 'All in One SEO Pro',
		amount: '$399.50',
		status: 'refunded',
		invoiceUrl: '#',
	},
	{
		id: 'ord-003',
		date: '2025-02-10T00:00:00Z',
		product: 'All in One SEO Plus',
		amount: '$199.50',
		status: 'refunded',
		invoiceUrl: '#',
	},
	{
		id: 'ord-004',
		date: '2025-01-05T00:00:00Z',
		product: 'All in One SEO Basic',
		amount: '$49.50',
		status: 'refunded',
		invoiceUrl: '#',
	},
	{
		id: 'ord-005',
		date: '2024-12-20T00:00:00Z',
		product: 'Broken Link Checker Premium',
		amount: '$299.50',
		status: 'refunded',
		invoiceUrl: '#',
	},
]

export const promoOffers: PromoOffer[] = [
	{
		id: 'promo-blc',
		productName: 'Broken Link Checker',
		description: 'Monitor your site for broken links and fix them in one click to improve SEO and user experience.',
		iconUrl: '/assets/icons/product-blc.svg',
		ctaLabel: 'Learn More',
		ctaUrl: 'https://brokenlinkchecker.com/',
		iconBgColor: '#FFF4E5',
	},
	{
		id: 'promo-lowfruits',
		productName: 'LowFruits',
		description: 'Find low-competition keywords that are easy to rank for with AI-powered SERP analysis.',
		iconUrl: '/assets/icons/product-lowfruits.svg',
		ctaLabel: 'Learn More',
		ctaUrl: 'https://lowfruits.io/',
		iconBgColor: '#E8F5E9',
	},
	{
		id: 'promo-seoboost',
		productName: 'SEOBoost',
		description: 'Create better-ranking content with real-time optimization and content briefs powered by AI.',
		iconUrl: '/assets/icons/product-seoboost.svg',
		ctaLabel: 'Learn More',
		ctaUrl: 'https://seoboost.com/',
		iconBgColor: '#E3F2FD',
	},
]
