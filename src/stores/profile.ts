import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ProfileKey = 'basic' | 'pro' | 'elite'

export const useProfileStore = defineStore('profile', () => {
	const params = new URLSearchParams(window.location.search)
	const initial = (params.get('profile') as ProfileKey) || 'elite'

	const activeProfile = ref<ProfileKey>(initial)

	function setProfile(key: ProfileKey) {
		activeProfile.value = key
		const url = new URL(window.location.href)
		url.searchParams.set('profile', key)
		window.history.replaceState({}, '', url.toString())
	}

	return { activeProfile, setProfile }
})
