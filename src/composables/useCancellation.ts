import { computed } from 'vue'
import { cancellationReasons } from '@/data/cancellationReasons'
import { cancellationLossItems } from '@/data/cancellationLossItems'
import { cancellationCompetitorData } from '@/data/cancellationCompetitors'
import {
	cancellationMockUser,
	cancellationPlanPricing,
	getLowerPlan as getLowerPlanHelper,
} from '@/data/cancellationMockUser'
import type { PlanTier, LowerPlan } from '@/types/cancellation'

/**
 * Cancellation flow data accessor.
 *
 * Centralizes read access to cancellation mock data so views never import
 * from `src/data/` directly (per project convention in CLAUDE.md).
 *
 * Returns reactive `computed` refs so that when the mock user's planKey
 * is later wired to a real source (e.g. `useSubscriptions`), consumers
 * don't need to change.
 */
export function useCancellation() {
	const user = computed(() => cancellationMockUser)
	const reasons = computed(() => cancellationReasons)
	const lossItems = computed(() => cancellationLossItems)
	const competitorData = computed(() => cancellationCompetitorData)
	const planPricing = computed(() => cancellationPlanPricing)

	function getLowerPlan(tier: PlanTier): LowerPlan | null {
		return getLowerPlanHelper(tier)
	}

	return {
		user,
		reasons,
		lossItems,
		competitorData,
		planPricing,
		getLowerPlan,
	}
}
