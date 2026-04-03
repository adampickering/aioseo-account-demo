import { computed } from 'vue'
import { useMockProfile } from './useMockProfile'

export function useAiCredits() {
	const { data } = useMockProfile()

	const credits = computed(() => data.value.aiCredits)

	const percentUsed = computed(() => {
		const { used, total } = credits.value
		if (total === 0) return 0
		return Math.round((used / total) * 100)
	})

	const remaining = computed(() => {
		const { used, total } = credits.value
		return total - used
	})

	return { credits, percentUsed, remaining }
}
