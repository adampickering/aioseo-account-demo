import { computed } from 'vue'
import { useProfileStore } from '@/stores/profile'
import type { ProfileKey } from '@/stores/profile'
import * as eliteData from '@/data/profiles/elite'
import * as proData from '@/data/profiles/pro'
import * as basicData from '@/data/profiles/basic'

const profiles = {
	elite: eliteData,
	pro: proData,
	basic: basicData,
} as const

export function useMockProfile() {
	const store = useProfileStore()

	const data = computed(() => profiles[store.activeProfile])
	const activeProfile = computed(() => store.activeProfile)

	function setProfile(key: ProfileKey) {
		store.setProfile(key)
	}

	return { data, activeProfile, setProfile }
}
