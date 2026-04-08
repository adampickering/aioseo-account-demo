import { computed } from 'vue'
import { useProfileStore } from '@/stores/profile'
import type { ProfileKey, LayoutMode } from '@/stores/profile'
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
	const activeLayout = computed(() => store.activeLayout)
	const isMinimal = computed(() => store.activeLayout === 'minimal')

	function setProfile(key: ProfileKey) {
		store.setProfile(key)
	}

	function setLayout(mode: LayoutMode) {
		store.setLayout(mode)
	}

	return { data, activeProfile, activeLayout, isMinimal, setProfile, setLayout }
}
