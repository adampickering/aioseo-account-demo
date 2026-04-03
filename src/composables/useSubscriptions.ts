import { computed } from 'vue'
import { useMockProfile } from './useMockProfile'

export function useSubscriptions() {
	const { data } = useMockProfile()

	const subscriptions = computed(() => data.value.subscriptions)
	const paymentMethods = computed(() => data.value.paymentMethods)
	const orders = computed(() => data.value.orders)

	return { subscriptions, paymentMethods, orders }
}
