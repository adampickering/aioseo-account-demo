<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const moreOpen = ref(false)
const moreRef = ref<HTMLElement | null>(null)

const primaryTabs = [
	{ label: 'Overview', routeName: 'overview', matchPrefix: 'overview' },
	{ label: 'Downloads', routeName: 'downloads', matchPrefix: 'downloads' },
	{ label: 'Billing', routeName: 'billing', matchPrefix: 'billing' },
	{ label: 'Profile', routeName: 'profile', matchPrefix: 'profile' },
	{ label: 'Support', routeName: 'support', matchPrefix: 'support' },
	{ label: 'Suggest a Feature', routeName: 'suggest-a-feature', matchPrefix: 'suggest-a-feature' },
	{ label: 'Giveaway', routeName: 'giveaway', matchPrefix: 'giveaway' },
]

const moreItems = [
	{ label: 'Services', routeName: 'services' },
	{ label: 'Log Out', routeName: null, href: 'https://aioseo.com/account/logout/' },
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
	return moreItems.some(item => item.routeName && name === item.routeName)
})

function isMoreItemActive(item: { routeName: string | null }) {
	if (!item.routeName) return false
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
	<nav class="border-b border-[#E6EEFC]">
		<div class="flex items-end gap-0">
			<!-- Primary tabs -->
			<RouterLink
				v-for="tab in primaryTabs"
				:key="tab.routeName"
				:to="{ name: tab.routeName }"
				class="relative font-heading text-[18px] leading-[24px] pb-[10px] transition-colors duration-200 whitespace-nowrap -mb-px"
				:class="[
					isTabActive(tab)
						? 'text-brand-blue font-bold border-b-[3px] border-brand-blue'
						: 'text-brand-navy font-semibold border-b-[3px] border-transparent hover:text-brand-blue',
					tab.label === 'Overview' ? 'pr-6' : 'px-6'
				]"
			>
				{{ tab.label }}
			</RouterLink>

			<!-- Spacer pushes Log Out / More to the right -->
			<div class="flex-1"></div>

			<!-- More dropdown -->
			<div ref="moreRef" class="relative">
				<button
					@click="toggleMore"
					class="flex items-center gap-1.5 font-heading text-[18px] leading-[24px] pb-[10px] transition-colors duration-200 -mb-px cursor-pointer whitespace-nowrap pl-6"
					:class="isMoreActive || moreOpen
						? 'text-brand-blue font-bold border-b-[3px] border-brand-blue'
						: 'text-brand-navy font-semibold border-b-[3px] border-transparent hover:text-brand-blue'"
				>
					More
					<svg
						class="w-3 h-3 transition-transform duration-200"
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
						class="absolute right-0 top-full mt-0 w-52 bg-white rounded-lg shadow-lg border border-[#E6EEFC] py-1 z-50"
					>
						<template v-for="item in moreItems" :key="item.label">
							<RouterLink
								v-if="item.routeName"
								:to="{ name: item.routeName }"
								class="block px-4 py-2.5 font-heading text-[15px] transition-colors duration-150"
								:class="isMoreItemActive(item)
									? 'text-brand-blue bg-brand-blue-5 font-medium'
									: 'text-brand-navy-60 hover:bg-brand-blue-5 hover:text-brand-navy'"
							>
								{{ item.label }}
							</RouterLink>
							<a
								v-else
								:href="item.href"
								class="block px-4 py-2.5 font-heading text-[15px] text-brand-navy-60 hover:bg-brand-blue-5 hover:text-brand-navy transition-colors duration-150"
							>
								{{ item.label }}
							</a>
						</template>
					</div>
				</Transition>
			</div>
		</div>
	</nav>
</template>
