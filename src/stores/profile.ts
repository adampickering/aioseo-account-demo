import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ProfileKey = 'basic' | 'pro' | 'elite'
export type LayoutMode = 'minimal' | 'full'

export const useProfileStore = defineStore('profile', () => {
	const params = new URLSearchParams(window.location.search)
	const initial = (params.get('profile') as ProfileKey) || 'elite'
	const initialLayout = (params.get('layout') as LayoutMode) || 'minimal'

	const activeProfile = ref<ProfileKey>(initial)
	const activeLayout = ref<LayoutMode>(initialLayout)

	function setProfile(key: ProfileKey) {
		activeProfile.value = key
		const url = new URL(window.location.href)
		url.searchParams.set('profile', key)
		window.history.replaceState({}, '', url.toString())
	}

	function setLayout(mode: LayoutMode) {
		activeLayout.value = mode
		const url = new URL(window.location.href)
		url.searchParams.set('layout', mode)
		window.history.replaceState({}, '', url.toString())
	}

	return { activeProfile, activeLayout, setProfile, setLayout }
})
