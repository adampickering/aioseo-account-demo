<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const moreOpen = ref(false)
const moreRef = ref<HTMLElement | null>(null)

const primaryTabs = [
	{ label: 'Overview', routeName: 'overview', matchPrefix: 'overview' },
	{ label: 'Downloads', routeName: 'downloads', matchPrefix: 'downloads' },
	{ label: 'Billing', routeName: 'billing', matchPrefix: 'billing' },
	{ label: 'Support', routeName: 'support', matchPrefix: 'support' },
]

const moreItems = [
	{ label: 'Services', routeName: 'services' },
	{ label: 'Profile', routeName: 'profile' },
	{ label: 'Suggest a Feature', routeName: 'suggest-a-feature' },
	{ label: 'Giveaway', routeName: 'giveaway' },
]

function isTabActive(tab: { matchPrefix?: string; routeName: string }) {
	const name = route.name as string
	if (tab.matchPrefix) {
		return name?.startsWith(tab.matchPrefix)
	}
	return name === tab.routeName
}

const isMoreActive = computed(() => {
	const name = route.name as string
	return moreItems.some(item => name === item.routeName)
})

function isMoreItemActive(item: { routeName: string }) {
	return (route.name as string) === item.routeName
}

function toggleMore() {
	moreOpen.value = !moreOpen.value
}

function handleClickOutside(e: MouseEvent) {
	if (moreRef.value && !moreRef.value.contains(e.target as Node)) {
		moreOpen.value = false
	}
}

// Close dropdown on navigation
watch(() => route.name, () => {
	moreOpen.value = false
})

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
	<nav class="border-b border-gray-200 -mx-6 px-6">
		<div class="flex items-center">
			<!-- Primary tabs -->
			<RouterLink
				v-for="tab in primaryTabs"
				:key="tab.routeName"
				:to="{ name: tab.routeName }"
				class="relative px-1 py-4 text-[15px] font-body transition-colors duration-200 mr-6 -mb-px"
				:class="isTabActive(tab)
					? 'text-brand-blue font-semibold border-b-[3px] border-brand-blue'
					: 'text-brand-navy-60 hover:text-brand-navy border-b-[3px] border-transparent'"
			>
				{{ tab.label }}
			</RouterLink>

			<!-- More dropdown -->
			<div ref="moreRef" class="relative">
				<button
					@click="toggleMore"
					class="flex items-center gap-1.5 px-1 py-4 text-[15px] font-body transition-colors duration-200 -mb-px cursor-pointer"
					:class="isMoreActive || moreOpen
						? 'text-brand-blue font-semibold border-b-[3px] border-brand-blue'
						: 'text-brand-navy-60 hover:text-brand-navy border-b-[3px] border-transparent'"
				>
					More
					<svg
						class="w-3.5 h-3.5 transition-transform duration-200"
						:class="{ 'rotate-180': moreOpen }"
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
						v-if="moreOpen"
						class="absolute left-0 top-full mt-0 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
					>
						<RouterLink
							v-for="item in moreItems"
							:key="item.routeName"
							:to="{ name: item.routeName }"
							class="block px-4 py-2.5 text-sm transition-colors duration-150"
							:class="isMoreItemActive(item)
								? 'text-brand-blue bg-brand-blue-5 font-medium'
								: 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'"
						>
							{{ item.label }}
						</RouterLink>
					</div>
				</Transition>
			</div>
		</div>
	</nav>
</template>
