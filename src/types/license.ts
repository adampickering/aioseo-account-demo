export type LicenseStatus = 'active' | 'expired' | 'cancelled'

export type LicenseTier = 'basic' | 'plus' | 'pro' | 'elite'

export type ProductType = 'aioseo' | 'broken-link-checker' | 'ai-credits'

export interface Addon {
	id: string
	name: string
	iconUrl: string
	downloadUrl: string
	helpUrl: string
	changelogUrl: string
	version: string
}

export interface AiCredits {
	used: number
	total: number
	includedInSubscription: number
	paidCredits: number
	expiresAt: string
}

export interface License {
	id: string
	product: ProductType
	productName: string
	tier: LicenseTier
	tierLabel: string
	licenseKey: string
	status: LicenseStatus
	expiresAt: string
	siteActivations: {
		used: number
		total: number
	}
	links?: {
		remaining?: number
		total?: number
	}
	downloadUrl: string
	version: string
	changelogUrl: string
	addons: Addon[]
	aiCredits?: AiCredits
}
