<script setup lang="ts">
</script>

<template>
	<header
		class="flex items-center justify-center bg-white h-[88px] border-b border-border font-body text-lg text-brand-navy"
	>
		<div
			class="flex items-center w-full max-w-[1110px] h-[76px]"
		>
			<!-- Logo -->
			<a href="https://aioseo.com/" class="shrink-0 w-[127px] h-[25px]">
				<img
					src="/assets/icons/aioseo-logo.svg"
					alt="AIOSEO"
					class="w-[127px] h-[25px]"
				/>
			</a>

			<!-- Nav -->
			<nav
				class="flex items-center flex-1 justify-end text-[15px] leading-[22.5px]"
			>
				<!-- Features -->
				<a
					href="https://aioseo.com/features/"
					class="aio-nav-link no-underline"
				>
					Features
					<svg class="ml-1.5 w-[10px] h-[6px] text-brand-navy-40" viewBox="0 0 10 6" fill="none">
						<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</a>

				<!-- Pricing -->
				<a
					href="https://aioseo.com/pricing/"
					class="aio-nav-link no-underline"
				>
					Pricing
				</a>

				<!-- Testimonials -->
				<a
					href="https://aioseo.com/testimonials/"
					class="aio-nav-link no-underline"
				>
					Testimonials
				</a>

				<!-- Resources -->
				<a
					href="https://aioseo.com/docs/"
					class="aio-nav-link no-underline"
				>
					Resources
					<svg class="ml-1.5 w-[10px] h-[6px] text-brand-navy-40" viewBox="0 0 10 6" fill="none">
						<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</a>

				<!-- Divider + My Account -->
				<a
					href="https://aioseo.com/account/"
					class="aio-nav-link no-underline !text-brand-blue border-l border-border-input pl-[15px] ml-[15px]"
				>
					My Account
				</a>
			</nav>
		</div>
	</header>
</template>
