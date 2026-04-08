import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import type { Reason } from '@/types/cancellation'

/**
 * Cancellation flow state machine.
 *
 * Replaces the prototype's provide/inject pattern. Navigation is performed via
 * injected router instance (passed to actions from components that `useRouter()`).
 */
export const useCancellationStore = defineStore('cancellation', () => {
	const selectedReason = ref<Reason | null>(null)
	const followUpValue = ref<string>('')

	const step3RouteNames = new Set([
		'cancel-offer-expensive',
		'cancel-offer-billing',
		'cancel-offer-technical',
		'cancel-offer-switching',
		'cancel-offer-features',
		'cancel-offer-closing',
		'cancel-offer-not-using',
		'cancel-offer-other',
		'cancel-bypass-support',
		'cancel-bypass-plan',
	])

	function currentStepNumber(route: RouteLocationNormalizedLoaded): number {
		const name = route.name as string | undefined
		if (name === 'cancel-support') return 1
		if (name === 'cancel-reason') return 2
		if (name && step3RouteNames.has(name)) return 3
		if (name === 'cancel-review') return 4
		if (name === 'cancel-confirmation') return 5
		return 0
	}

	function canGoBack(route: RouteLocationNormalizedLoaded): boolean {
		const num = currentStepNumber(route)
		return num >= 1 && num < 5
	}

	const variantRouteMap: Record<string, string> = {
		'A': 'cancel-offer-expensive',
		'B': 'cancel-offer-billing',
		'C': 'cancel-offer-technical',
		'D': 'cancel-offer-switching',
		'E': 'cancel-offer-features',
		'F': 'cancel-offer-closing',
		'G': 'cancel-offer-not-using',
		'H': 'cancel-offer-other',
		'bypass-support': 'cancel-bypass-support',
		'bypass-plan': 'cancel-bypass-plan',
	}

	function slugifyCompetitor(name: string): string {
		return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
	}

	function selectReason(router: Router, reason: Reason, followUp: string) {
		selectedReason.value = reason
		followUpValue.value = followUp
		const routeName = variantRouteMap[reason.variant] || 'cancel-offer-other'
		if (reason.variant === 'D' && followUp) {
			router.push({ name: routeName, params: { competitor: slugifyCompetitor(followUp) } })
		} else {
			router.push({ name: routeName })
		}
	}

	function skipOffer(router: Router) {
		router.push({ name: 'cancel-review' })
	}

	function confirmCancel(router: Router) {
		router.push({ name: 'cancel-confirmation' })
	}

	function keepPlan(router: Router) {
		reset()
		router.push({ name: 'billing' })
	}

	function getCurrentOfferRoute(): { name: string; params?: Record<string, string> } {
		const variant = selectedReason.value?.variant || 'H'
		const routeName = variantRouteMap[variant] || 'cancel-offer-other'
		if (variant === 'D' && followUpValue.value) {
			return { name: routeName, params: { competitor: slugifyCompetitor(followUpValue.value) } }
		}
		return { name: routeName }
	}

	function goBack(router: Router, route: RouteLocationNormalizedLoaded) {
		const name = route.name as string | undefined
		if (name === 'cancel-review') {
			router.push(getCurrentOfferRoute())
			return
		}
		if (name && step3RouteNames.has(name)) {
			router.push({ name: 'cancel-reason' })
			return
		}
		if (name === 'cancel-reason') {
			router.push({ name: 'cancel-support' })
			return
		}
		if (name === 'cancel-support') {
			router.push({ name: 'billing' })
		}
	}

	function reset() {
		selectedReason.value = null
		followUpValue.value = ''
	}

	return {
		selectedReason,
		followUpValue,
		currentStepNumber,
		canGoBack,
		selectReason,
		skipOffer,
		confirmCancel,
		keepPlan,
		goBack,
		reset,
	}
})
