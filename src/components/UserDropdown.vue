<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAccount } from '@/composables/useAccount'

const { user } = useAccount()
const open = ref(false)
const showInitials = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const fullName = computed(() => `${user.value.firstName} ${user.value.lastName}`)
const initials = computed(() =>
	`${user.value.firstName.charAt(0)}${user.value.lastName.charAt(0)}`.toUpperCase()
)

const gravatarUrl = computed(() => {
	const email = user.value.email.trim().toLowerCase()
	// Simple hash for gravatar — use a basic DJB2 hash converted to hex
	// In production you'd use MD5, but for a mock prototype this gives a consistent URL
	let hash = 5381
	for (let i = 0; i < email.length; i++) {
		hash = ((hash << 5) + hash + email.charCodeAt(i)) & 0xffffffff
	}
	const hex = (hash >>> 0).toString(16).padStart(8, '0')
	return `https://www.gravatar.com/avatar/${hex}?d=404&s=64`
})

const avatarSrc = computed(() => {
	if (showInitials.value) return null
	return user.value.avatarUrl || gravatarUrl.value
})

function onAvatarError() {
	showInitials.value = true
}

function toggle() {
	open.value = !open.value
}

function handleClickOutside(e: MouseEvent) {
	if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
		open.value = false
	}
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
	<div ref="dropdownRef" class="relative">
		<button
			@click="toggle"
			class="flex items-center gap-2.5 bg-transparent border-0 cursor-pointer p-1 rounded-btn hover:bg-gray-50 transition-colors"
			:aria-expanded="open"
			aria-haspopup="true"
		>
			<span class="text-sm font-medium text-brand-navy-60 hidden sm:inline">{{ fullName }}</span>
			<img
				v-if="avatarSrc"
				:src="avatarSrc"
				:alt="fullName"
				class="w-8 h-8 rounded-full object-cover shrink-0"
				@error="onAvatarError"
			/>
			<div
				v-else
				class="w-8 h-8 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center shrink-0"
			>
				{{ initials }}
			</div>
		</button>

		<Transition
			enter-active-class="transition ease-out duration-150"
			enter-from-class="opacity-0 -translate-y-1 scale-95"
			enter-to-class="opacity-100 translate-y-0 scale-100"
			leave-active-class="transition ease-in duration-100"
			leave-from-class="opacity-100 translate-y-0 scale-100"
			leave-to-class="opacity-0 -translate-y-1 scale-95"
		>
			<div
				v-if="open"
				class="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-card shadow-card py-1 z-50"
			>
				<router-link
					to="/profile"
					class="block px-4 py-2.5 text-sm text-brand-navy hover:bg-gray-50 no-underline transition-colors"
					@click="open = false"
				>
					Profile
				</router-link>
				<router-link
					to="/support"
					class="block px-4 py-2.5 text-sm text-brand-navy hover:bg-gray-50 no-underline transition-colors"
					@click="open = false"
				>
					Support
				</router-link>
				<div class="border-t border-border my-1"></div>
				<a
					href="https://aioseo.com/account/logout/"
					class="block px-4 py-2.5 text-sm text-brand-navy hover:bg-gray-50 no-underline transition-colors"
				>
					Log Out
				</a>
			</div>
		</Transition>
	</div>
</template>
