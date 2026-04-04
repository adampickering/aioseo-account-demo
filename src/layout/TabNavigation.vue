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
	<nav aria-label="Account navigation" class="border-b border-border">
		<ul
			class="flex items-end list-none p-0 m-0 text-lg leading-[28.8px] overflow-x-auto md:overflow-visible scrollbar-hide -mx-5 px-5 md:mx-0 md:px-0"
		>
			<!-- Primary tabs -->
			<li
				v-for="tab in primaryTabs"
				:key="tab.routeName"
				class="flex p-0 m-0 shrink-0"
			>
				<RouterLink
					:to="{ name: tab.routeName }"
					class="aio-tab no-underline whitespace-nowrap text-base md:text-lg"
					:class="{ 'aio-tab-active': isTabActive(tab) }"
					:aria-current="isTabActive(tab) ? 'page' : undefined"
				>
					{{ tab.label }}
				</RouterLink>
			</li>

			<!-- Spacer (desktop only) -->
			<li class="hidden md:flex flex-1 list-none"></li>

			<!-- More dropdown -->
			<li
				ref="moreRef"
				class="relative flex p-0 m-0 shrink-0"
			>
				<button
					@click="toggleMore"
					aria-label="More navigation options"
					:aria-expanded="moreOpen"
					class="aio-tab flex items-center gap-1.5 whitespace-nowrap cursor-pointer bg-transparent border-0 font-inherit text-base md:text-lg"
					:class="{ 'aio-tab-active': isMoreActive || moreOpen }"
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
						class="absolute right-0 top-full z-50 w-[208px] bg-white border border-border rounded-card shadow-card py-1 mt-0"
					>
						<template v-for="item in moreItems" :key="item.label">
							<RouterLink
								v-if="item.routeName"
								:to="{ name: item.routeName }"
								class="block no-underline transition-colors duration-150 px-4 py-2.5 text-body leading-[22.5px]"
								:class="isMoreItemActive(item) ? 'text-brand-blue font-medium bg-bg-light' : 'text-brand-navy-60 font-normal bg-transparent hover:bg-bg-light hover:text-brand-navy'"
								:aria-current="isMoreItemActive(item) ? 'page' : undefined"
							>
								{{ item.label }}
							</RouterLink>
							<a
								v-else
								:href="item.href"
								class="block no-underline transition-colors duration-150 px-4 py-2.5 text-body leading-[22.5px] text-brand-navy-60 font-normal hover:bg-bg-light hover:text-brand-navy"
							>
								{{ item.label }}
							</a>
						</template>
					</div>
				</Transition>
			</li>
		</ul>
	</nav>
</template>

<style>
/* Hide scrollbar on tab overflow */
.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
	display: none;
}
</style>
