export type SaveOfferVariant =
	| 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'
	| 'bypass-support' | 'bypass-plan'

export type PlanTier = 'basic' | 'plus' | 'pro' | 'elite'

export type FollowUp =
	| { type: 'text'; placeholder: string }
	| {
			type: 'dropdown'
			placeholder: string
			required?: boolean
			options: string[]
			otherTextField?: boolean
		}

export interface Reason {
	id: number
	label: string
	followUp: FollowUp | null
	variant: SaveOfferVariant
}

export interface LossItem {
	title: string
	body: string
}

export type LossItemsByTier = Record<PlanTier, LossItem[]>

export interface CompetitorAdvantage {
	feature: string
	detail: string
}

export interface Competitor {
	subhead: string
	advantages: CompetitorAdvantage[]
	useCheckInstead?: boolean
}

export type CompetitorDataMap = Record<string, Competitor> & { _default: Competitor }

export interface CancellationMockUser {
	firstName: string
	planName: string
	planKey: PlanTier
	renewalDate: string
	purchaseDate: string
	tenure: string
	sites: string
	aiCredits: number
	annualPrice: number
	readonly savings: string
}

export interface PlanPricingEntry {
	name: string
	price: number
	sites: string
}

export interface LowerPlan extends PlanPricingEntry {
	key: PlanTier
}
