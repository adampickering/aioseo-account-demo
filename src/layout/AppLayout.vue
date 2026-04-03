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
		<a
			href="#main-content"
			class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:p-3 focus:rounded-card focus:shadow-card focus:text-brand-blue focus:font-semibold focus:no-underline"
		>
			Skip to content
		</a>
		<SiteHeader />

		<!-- Welcome Banner — white bg with graph SVG decoration -->
		<div class="relative overflow-hidden bg-white">
			<!-- Graph SVG decoration — full original with radial gradient mask + blur -->
			<div class="absolute inset-0 pointer-events-none flex items-start justify-center overflow-hidden">
				<img
					src="/assets/images/header-graph.svg"
					alt=""
					class="w-full max-w-[1440px] h-auto"
				/>
			</div>

			<!-- Content -->
			<div class="relative z-10 text-center py-8 md:py-12">
				<h1 class="font-heading text-[24px] md:text-[36px] font-semibold text-brand-navy text-center leading-normal">
					Welcome to Your AIOSEO Account
				</h1>
				<p class="text-lg text-brand-navy-40 mt-2">
					Improve Your Website Search Rankings
				</p>
			</div>
		</div>

		<div class="aio-container">
			<TabNavigation />
			<main id="main-content" class="py-8">
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
