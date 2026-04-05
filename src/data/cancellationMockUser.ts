import type { CancellationMockUser, LowerPlan, PlanPricingEntry, PlanTier } from '@/types/cancellation'

// TODO: derive from useSubscriptions() once we know which subscription
// is "the active one being cancelled". Shape needed: firstName, planName,
// planKey, renewalDate, purchaseDate, tenure, sites, aiCredits, annualPrice.
// Change planKey to 'basic' | 'plus' | 'pro' | 'elite' to preview different tiers.
export const cancellationMockUser: CancellationMockUser = {
	firstName: 'Adam',
	planName: 'AIOSEO - Elite',
	planKey: 'elite',
	renewalDate: 'Dec 9, 2026',
	purchaseDate: 'Dec 9, 2025',
	tenure: '1 year',
	sites: 'unlimited',
	aiCredits: 200,
	annualPrice: 599.50,
	get savings(): string {
		return (this.annualPrice / 2).toFixed(2)
	},
}

export const cancellationPlanPricing: Record<PlanTier, PlanPricingEntry> = {
	elite:  { name: 'Elite',  price: 599.50, sites: 'unlimited' },
	pro:    { name: 'Pro',    price: 399.50, sites: '10' },
	plus:   { name: 'Plus',   price: 199.50, sites: '3' },
	basic:  { name: 'Basic',  price: 99.50,  sites: '1' },
}

export function getLowerPlan(currentPlanKey: PlanTier): LowerPlan | null {
	const order: PlanTier[] = ['elite', 'pro', 'plus', 'basic']
	const idx = order.indexOf(currentPlanKey)
	if (idx < 0 || idx >= order.length - 1) return null
	const lowerKey = order[idx + 1]!
	return { key: lowerKey, ...cancellationPlanPricing[lowerKey] }
}
