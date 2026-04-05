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

	function currentStepNumber(route: RouteLocationNormalizedLoaded): number {
		const name = route.name as string | undefined
		if (name === 'cancel-support') return 1
		if (name === 'cancel-reason') return 2
		if (
			name === 'cancel-offer' ||
			name === 'cancel-offer-not-using' ||
			name === 'cancel-bypass-support' ||
			name === 'cancel-bypass-plan'
		) return 3
		if (name === 'cancel-review') return 4
		if (name === 'cancel-confirmation') return 5
		return 0
	}

	function canGoBack(route: RouteLocationNormalizedLoaded): boolean {
		const num = currentStepNumber(route)
		return num > 1 && num < 5
	}

	function selectReason(router: Router, reason: Reason, followUp: string) {
		selectedReason.value = reason
		followUpValue.value = followUp
		if (reason.variant === 'bypass-support') {
			router.push({ name: 'cancel-bypass-support' })
		} else if (reason.variant === 'bypass-plan') {
			router.push({ name: 'cancel-bypass-plan' })
		} else if (reason.variant === 'G') {
			router.push({ name: 'cancel-offer-not-using' })
		} else {
			router.push({ name: 'cancel-offer' })
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

	function goBack(router: Router, route: RouteLocationNormalizedLoaded) {
		const name = route.name as string | undefined
		if (name === 'cancel-review') {
			if (selectedReason.value?.variant === 'G') {
				router.push({ name: 'cancel-offer-not-using' })
			} else {
				router.push({ name: 'cancel-offer' })
			}
			return
		}
		if (
			name === 'cancel-offer' ||
			name === 'cancel-offer-not-using' ||
			name === 'cancel-bypass-support' ||
			name === 'cancel-bypass-plan'
		) {
			router.push({ name: 'cancel-reason' })
			return
		}
		if (name === 'cancel-reason') {
			router.push({ name: 'cancel-support' })
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
