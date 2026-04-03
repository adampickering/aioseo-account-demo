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
			<!-- Graph SVG decoration — centered, clipped to remove empty space -->
			<div class="absolute inset-0 pointer-events-none flex items-start justify-center overflow-hidden">
				<svg
					class="w-full max-w-[1440px]"
					viewBox="560 0 1440 300"
					preserveAspectRatio="xMidYMin meet"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					style="filter: drop-shadow(0px 4px 20px rgba(0, 90, 224, 0.08));"
				>
					<!-- Graph line -->
					<path d="M798.27 210.329L941.462 198.748L1081.5 106.093L1216.27 119.78L1383.68 19.7559L1527.92 14.4909L1684.8 -55" stroke="#005AE0" stroke-width="2"/>
					<!-- Fill under line -->
					<path d="M941.462 198.748L798.27 210.329V276.678H1684.8V-55L1527.92 14.4909L1383.68 19.7559L1216.27 119.78L1081.5 106.093L941.462 198.748Z" fill="url(#graphFill)" fill-opacity="0.15"/>
					<!-- Data point dots -->
					<circle cx="1082.01" cy="105.653" r="7.7" fill="#005AE0"/><circle cx="1082.01" cy="105.653" r="6.4" fill="white"/>
					<circle cx="1215.01" cy="118.653" r="7.7" fill="#005AE0"/><circle cx="1215.01" cy="118.653" r="6.4" fill="white"/>
					<circle cx="1278.01" cy="82.6535" r="7.7" fill="#005AE0"/><circle cx="1278.01" cy="82.6535" r="6.4" fill="white"/>
					<circle cx="1383.01" cy="19.6535" r="7.7" fill="#005AE0"/><circle cx="1383.01" cy="19.6535" r="6.4" fill="white"/>
					<!-- Glow -->
					<ellipse cx="1280" cy="-40" rx="286" ry="122" fill="#005AE0" fill-opacity="0.06" filter="blur(80px)"/>
					<defs>
						<linearGradient id="graphFill" x1="1241" y1="-55" x2="1241" y2="277" gradientUnits="userSpaceOnUse">
							<stop stop-color="#005AE0"/><stop offset="1" stop-color="white"/>
						</linearGradient>
					</defs>
				</svg>
			</div>

			<!-- Content -->
			<div class="relative z-10 text-center py-8 md:py-12">
				<h1 class="font-heading text-[24px] md:text-display-sm md:leading-display-sm font-semibold text-brand-navy text-center leading-normal">
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
