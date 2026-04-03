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
	<nav>
		<ul
			class="flex items-end"
			style="list-style: none; padding: 0; margin: 0; font-size: 18px; line-height: 28.8px;"
		>
			<!-- Primary tabs -->
			<li
				v-for="tab in primaryTabs"
				:key="tab.routeName"
				class="flex"
				style="padding: 0; margin: 0;"
				:style="isTabActive(tab) ? 'border-bottom: 3px solid #005AE0;' : 'border-bottom: 3px solid transparent;'"
			>
				<RouterLink
					:to="{ name: tab.routeName }"
					class="no-underline whitespace-nowrap"
					:style="{
						display: 'block',
						padding: '14.85px 22.5px',
						fontSize: '18px',
						fontWeight: isTabActive(tab) ? '600' : '400',
						lineHeight: '21.6px',
						color: isTabActive(tab) ? '#005AE0' : '#141B38',
						textDecoration: 'none',
					}"
				>
					{{ tab.label }}
				</RouterLink>
			</li>

			<!-- Spacer -->
			<li class="flex-1" style="list-style: none;"></li>

			<!-- More dropdown -->
			<li
				ref="moreRef"
				class="relative flex"
				style="padding: 0; margin: 0;"
				:style="(isMoreActive || moreOpen) ? 'border-bottom: 3px solid #005AE0;' : 'border-bottom: 3px solid transparent;'"
			>
				<button
					@click="toggleMore"
					class="flex items-center gap-1.5 whitespace-nowrap cursor-pointer bg-transparent border-0"
					:style="{
						padding: '14.85px 22.5px',
						fontSize: '18px',
						fontWeight: (isMoreActive || moreOpen) ? '600' : '400',
						lineHeight: '21.6px',
						color: (isMoreActive || moreOpen) ? '#005AE0' : '#141B38',
						fontFamily: 'inherit',
					}"
				>
					More
					<svg
						class="transition-transform duration-200"
						:class="{ 'rotate-180': moreOpen }"
						style="width: 12px; height: 12px;"
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
						class="absolute right-0 top-full z-50"
						style="width: 208px; background: #FFFFFF; border: 1px solid #E6EEFC; border-radius: 5px; box-shadow: 0px 5px 10px 0px rgba(0, 90, 224, 0.06); padding: 4px 0; margin-top: 0;"
					>
						<template v-for="item in moreItems" :key="item.label">
							<RouterLink
								v-if="item.routeName"
								:to="{ name: item.routeName }"
								class="block no-underline transition-colors duration-150"
								:style="{
									padding: '10px 16px',
									fontSize: '15px',
									lineHeight: '22.5px',
									color: isMoreItemActive(item) ? '#005AE0' : '#434960',
									fontWeight: isMoreItemActive(item) ? '500' : '400',
									backgroundColor: isMoreItemActive(item) ? '#F2F7FD' : 'transparent',
								}"
							>
								{{ item.label }}
							</RouterLink>
							<a
								v-else
								:href="item.href"
								class="block no-underline transition-colors duration-150"
								style="padding: 10px 16px; font-size: 15px; line-height: 22.5px; color: #434960; font-weight: 400;"
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
