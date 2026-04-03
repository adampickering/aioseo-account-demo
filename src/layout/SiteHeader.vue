<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
</script>

<template>
	<header
		class="flex items-center justify-center bg-white border-b border-border font-body text-lg text-brand-navy"
		style="height: 88px;"
	>
		<div class="aio-container flex items-center h-[76px]">
			<!-- Logo -->
			<a href="https://aioseo.com/" class="shrink-0" aria-label="AIOSEO Home">
				<img
					src="/assets/icons/aioseo-logo.svg"
					alt="AIOSEO"
					class="w-[127px] h-[25px]"
				/>
			</a>

			<!-- Mobile hamburger -->
			<button
				class="md:hidden ml-auto p-2 text-brand-navy"
				:aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
				:aria-expanded="mobileMenuOpen"
				@click="mobileMenuOpen = !mobileMenuOpen"
			>
				<svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 18h18M3 12h18M3 6h18" />
				</svg>
				<svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Desktop Nav -->
			<nav
				class="hidden md:flex items-center flex-1 justify-end text-[15px] leading-[22.5px]"
				aria-label="Main navigation"
			>
				<a href="https://aioseo.com/features/" class="aio-nav-link no-underline">
					Features
					<svg class="ml-1.5 w-[10px] h-[6px] text-brand-navy-40" viewBox="0 0 10 6" fill="none">
						<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</a>
				<a href="https://aioseo.com/pricing/" class="aio-nav-link no-underline">Pricing</a>
				<a href="https://aioseo.com/testimonials/" class="aio-nav-link no-underline">Testimonials</a>
				<a href="https://aioseo.com/docs/" class="aio-nav-link no-underline">
					Resources
					<svg class="ml-1.5 w-[10px] h-[6px] text-brand-navy-40" viewBox="0 0 10 6" fill="none">
						<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</a>
				<a href="https://aioseo.com/account/" class="aio-nav-link no-underline !text-brand-blue border-l border-border-input pl-[15px] ml-[15px]">My Account</a>
			</nav>
		</div>

		<!-- Mobile menu overlay -->
		<Transition
			enter-active-class="transition ease-out duration-200"
			enter-from-class="opacity-0 -translate-y-2"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition ease-in duration-150"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 -translate-y-2"
		>
			<div v-if="mobileMenuOpen" class="md:hidden absolute top-[88px] left-0 right-0 bg-white border-b border-border shadow-card z-50">
				<nav class="flex flex-col py-4 px-5 gap-1" aria-label="Mobile navigation">
					<a href="https://aioseo.com/features/" class="py-3 text-[15px] text-brand-navy no-underline hover:text-brand-blue transition-colors duration-200" @click="mobileMenuOpen = false">Features</a>
					<a href="https://aioseo.com/pricing/" class="py-3 text-[15px] text-brand-navy no-underline hover:text-brand-blue transition-colors duration-200" @click="mobileMenuOpen = false">Pricing</a>
					<a href="https://aioseo.com/testimonials/" class="py-3 text-[15px] text-brand-navy no-underline hover:text-brand-blue transition-colors duration-200" @click="mobileMenuOpen = false">Testimonials</a>
					<a href="https://aioseo.com/docs/" class="py-3 text-[15px] text-brand-navy no-underline hover:text-brand-blue transition-colors duration-200" @click="mobileMenuOpen = false">Resources</a>
					<a href="https://aioseo.com/account/" class="py-3 text-[15px] text-brand-blue font-semibold no-underline border-t border-border mt-2 pt-4 hover:opacity-80 transition-opacity duration-200" @click="mobileMenuOpen = false">My Account</a>
				</nav>
			</div>
		</Transition>
	</header>
</template>
