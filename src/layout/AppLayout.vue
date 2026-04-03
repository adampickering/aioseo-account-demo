<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteHeader from './SiteHeader.vue'
import TabNavigation from './TabNavigation.vue'
import CtaBanner from './CtaBanner.vue'
import SiteFooter from './SiteFooter.vue'
import ProfileSwitcher from '@/components/ProfileSwitcher.vue'
</script>

<template>
	<div class="min-h-screen flex flex-col bg-white font-body relative">
		<SiteHeader />

		<!-- Welcome Banner — white bg with graph SVG decoration -->
		<div class="relative overflow-hidden bg-white">
			<!-- Graph SVG decoration -->
			<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
				<img
					src="/assets/images/header-graph.svg"
					alt=""
					class="w-full max-w-[1440px] h-auto opacity-100"
					style="filter: drop-shadow(0px 4px 20px rgba(0, 90, 224, 0.08));"
				/>
			</div>

			<!-- Content -->
			<div class="relative z-10 text-center" style="padding: 48px 0;">
				<h1 class="font-heading text-[24px] md:text-[36px] font-semibold text-brand-navy text-center leading-normal">
					Welcome to Your AIOSEO Account
				</h1>
				<p class="text-lg text-brand-navy-40 mt-4">
					Improve Your Website Search Rankings
				</p>
			</div>
		</div>

		<div class="aio-container">
			<TabNavigation />
			<main class="py-8">
				<RouterView v-slot="{ Component }">
					<Transition name="fade" mode="out-in">
						<component :is="Component" />
					</Transition>
				</RouterView>
			</main>
		</div>

		<div class="mt-auto">
			<CtaBanner />
			<SiteFooter />
		</div>

		<ProfileSwitcher />
	</div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
