<script setup lang="ts">
</script>

<template>
	<header class="bg-white border-b border-[#E6EEFC]">
		<div class="max-w-[1110px] mx-auto px-6 min-h-[88px] flex items-center justify-between">
			<!-- Logo -->
			<a href="https://aioseo.com/" class="flex items-center shrink-0">
				<img
					src="/assets/icons/aioseo-logo.svg"
					alt="AIOSEO"
					class="h-[25px] w-auto"
				/>
			</a>

			<!-- Navigation -->
			<nav class="flex items-center">
				<div class="flex items-center h-[32px]">
					<!-- Features (with chevron) -->
					<a
						href="https://aioseo.com/features/"
						class="flex items-center font-heading text-[15px] font-normal text-brand-navy px-2 py-1.5 hover:text-brand-blue transition-colors duration-200"
					>
						Features
						<svg class="w-[11px] h-[6.4px] ml-1.5 text-brand-navy/60" viewBox="0 0 11 7" fill="none">
							<path d="M1 1L5.5 5.5L10 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</a>

					<!-- Pricing -->
					<a
						href="https://aioseo.com/pricing/"
						class="font-heading text-[15px] font-normal text-brand-navy px-2 py-1.5 hover:text-brand-blue transition-colors duration-200"
					>
						Pricing
					</a>

					<!-- Testimonials -->
					<a
						href="https://aioseo.com/testimonials/"
						class="font-heading text-[15px] font-normal text-brand-navy px-2 py-1.5 hover:text-brand-blue transition-colors duration-200"
					>
						Testimonials
					</a>

					<!-- Resources (with chevron) -->
					<a
						href="https://aioseo.com/docs/"
						class="flex items-center font-heading text-[15px] font-normal text-brand-navy pl-2 py-1.5 hover:text-brand-blue transition-colors duration-200"
					>
						Resources
						<svg class="w-[11px] h-[6.4px] ml-1.5 text-brand-navy/60" viewBox="0 0 11 7" fill="none">
							<path d="M1 1L5.5 5.5L10 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</a>

					<!-- Divider -->
					<div class="mx-4 h-[15px] w-[0.7px] bg-[#D0D1D7]"></div>

					<!-- My Account -->
					<a
						href="https://aioseo.com/account/"
						class="font-heading text-[15px] font-normal text-brand-blue px-2 py-1.5"
					>
						My Account
					</a>
				</div>
			</nav>
		</div>
	</header>
</template>
