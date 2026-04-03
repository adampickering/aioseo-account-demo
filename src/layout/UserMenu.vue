<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAccount } from '@/composables/useAccount'

const { user } = useAccount()
const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

function toggle() {
	isOpen.value = !isOpen.value
}

function handleClickOutside(e: MouseEvent) {
	if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
		isOpen.value = false
	}
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
	<div ref="menuRef" class="relative">
		<button
			@click="toggle"
			class="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
		>
			<img
				:src="user.avatarUrl"
				:alt="user.firstName"
				class="w-8 h-8 rounded-full ring-2 ring-white/20"
			/>
			<span class="text-sm font-body">{{ user.firstName }}</span>
			<svg
				class="w-3.5 h-3.5 transition-transform duration-200"
				:class="{ 'rotate-180': isOpen }"
				viewBox="0 0 12 12"
				fill="none"
			>
				<path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-150 ease-out"
			enter-from-class="opacity-0 -translate-y-1"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition duration-100 ease-in"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 -translate-y-1"
		>
			<div
				v-if="isOpen"
				class="absolute right-0 top-full mt-2 w-44 bg-white py-1 z-50" style="border-radius: 5px; border: 1px solid #E6EEFC; box-shadow: 0px 5px 10px 0px rgba(0, 90, 224, 0.06);"
			>
				<div class="px-3 py-2 border-b border-gray-100">
					<p class="text-sm font-medium text-text-primary truncate">{{ user.firstName }} {{ user.lastName }}</p>
					<p class="text-xs text-text-muted truncate">{{ user.email }}</p>
				</div>
				<a
					href="https://aioseo.com/account/logout/"
					class="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-gray-50 transition-colors duration-150"
				>
					<svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
						<path d="M6 14H3.333A1.333 1.333 0 0 1 2 12.667V3.333A1.333 1.333 0 0 1 3.333 2H6M10.667 11.333L14 8l-3.333-3.333M14 8H6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					Log Out
				</a>
			</div>
		</Transition>
	</div>
</template>
