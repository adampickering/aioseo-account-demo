import { computed } from 'vue'
import { useMockProfile } from './useMockProfile'
import type { QuickLink } from '@/types'

const quickLinks: QuickLink[] = [
	{ label: 'View Downloads', href: '/downloads' },
	{ label: 'Edit Account Info', href: '/profile' },
	{ label: 'Get Support', href: '/support' },
	{ label: 'Edit Billing Info', href: '/billing' },
	{ label: 'Become an Affiliate', href: 'https://aioseo.com/affiliates/' },
]

export function useAccount() {
	const { data } = useMockProfile()

	const user = computed(() => data.value.user)

	return { user, quickLinks }
}
