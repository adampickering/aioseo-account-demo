<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteHeader from './SiteHeader.vue'
import TabNavigation from './TabNavigation.vue'
import CtaBanner from './CtaBanner.vue'
import SiteFooter from './SiteFooter.vue'
import ProfileSwitcher from '@/components/ProfileSwitcher.vue'
</script>

<template>
	<div class="min-h-screen flex flex-col bg-bg-primary">
		<SiteHeader />

		<!-- Welcome Banner -->
		<div class="relative bg-brand-navy text-white text-center py-10 pb-12">
			<h1 class="text-[30px] leading-[38px] font-heading font-semibold">Welcome to Your AIOSEO Account</h1>
			<p class="text-brand-navy-40 mt-2 text-lg">Improve Your Website Search Rankings</p>
			<!-- Curved bottom edge -->
			<div class="absolute bottom-0 left-0 right-0 h-4 bg-bg-primary rounded-t-[50%]"></div>
		</div>

		<div class="max-w-[1100px] w-full mx-auto px-6">
			<TabNavigation />
			<main class="py-8">
				<RouterView />
			</main>
		</div>

		<div class="mt-auto">
			<CtaBanner />
			<SiteFooter />
		</div>

		<ProfileSwitcher />
	</div>
</template>
