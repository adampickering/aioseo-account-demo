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

		<!-- Welcome Banner -- Figma blue gradient with wave -->
		<div class="relative overflow-hidden bg-gradient-to-br from-brand-blue to-[#0070F3]">
			<!-- SVG wave decoration behind text -->
			<div class="absolute inset-0 opacity-[0.08]">
				<svg class="absolute w-full h-full" viewBox="0 0 1440 300" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="200" cy="60" r="120" fill="white" opacity="0.3"/>
					<circle cx="1240" cy="80" r="90" fill="white" opacity="0.25"/>
					<circle cx="700" cy="-20" r="160" fill="white" opacity="0.15"/>
					<circle cx="400" cy="200" r="50" fill="white" opacity="0.2"/>
					<circle cx="1100" cy="220" r="70" fill="white" opacity="0.15"/>
				</svg>
			</div>
			<!-- Wave pattern at bottom -->
			<div class="absolute bottom-0 left-0 right-0">
				<svg viewBox="0 0 1440 60" preserveAspectRatio="none" class="w-full h-[60px] block" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 60L0 30C240 0 480 0 720 20C960 40 1200 50 1440 30L1440 60Z" fill="white"/>
				</svg>
			</div>

			<!-- Content -->
			<div class="relative z-10 text-center py-12">
				<h1 class="font-heading text-[24px] md:text-[36px] font-semibold text-white text-center leading-normal">
					Welcome to Your AIOSEO Account
				</h1>
				<p class="text-lg text-white/60 mt-4">
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
