<script setup lang="ts">
import { useAccount } from '@/composables/useAccount'
import UserMenu from './UserMenu.vue'

const { user } = useAccount()

const navLinks = [
	{ label: 'Features', href: 'https://aioseo.com/features/' },
	{ label: 'Pricing', href: 'https://aioseo.com/pricing/' },
	{ label: 'Testimonials', href: 'https://aioseo.com/testimonials/' },
	{ label: 'Resources', href: 'https://aioseo.com/docs/' },
	{ label: 'My Account', href: 'https://aioseo.com/account/', active: true },
]
</script>

<template>
	<header class="bg-brand-navy">
		<div class="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
			<!-- Logo -->
			<a href="https://aioseo.com/" class="flex items-center gap-0 shrink-0">
				<span class="text-white text-xl font-heading font-bold tracking-tight">AIOSE</span>
				<span class="relative text-xl font-heading font-bold tracking-tight">
					<span class="text-white">O</span>
					<span class="absolute inset-0 flex items-center justify-center">
						<span class="w-[6px] h-[6px] rounded-full bg-brand-blue translate-y-[1px]"></span>
					</span>
				</span>
			</a>

			<!-- Navigation -->
			<nav class="flex items-center gap-1">
				<a
					v-for="link in navLinks"
					:key="link.label"
					:href="link.href"
					class="px-3 py-2 text-sm font-body transition-colors duration-200 rounded"
					:class="link.active
						? 'text-brand-blue hover:text-brand-blue'
						: 'text-white/80 hover:text-white'"
				>
					{{ link.label }}
				</a>
				<div class="ml-3 border-l border-white/15 pl-3">
					<UserMenu />
				</div>
			</nav>
		</div>
	</header>
</template>
