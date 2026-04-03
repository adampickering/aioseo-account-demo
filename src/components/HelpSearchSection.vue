<script setup lang="ts">
import { useHelpArticles } from '@/composables/useHelpArticles'

const { articles } = useHelpArticles()
</script>

<template>
	<div class="aio-card">
		<!-- Search -->
		<div class="relative mb-6">
			<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
				<svg class="w-5 h-5 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
				</svg>
			</div>
			<input
				type="text"
				placeholder="Looking for help? Type your question here..."
				class="w-full pl-12 pr-4 py-3 text-sm bg-white border border-border-input text-text-primary placeholder:text-text-light focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all duration-200 rounded-card"
				readonly
			/>
		</div>

		<!-- Article links -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
			<a
				v-for="article in articles"
				:key="article.title"
				:href="article.url"
				target="_blank"
				rel="noopener"
				class="flex items-start gap-2.5 p-3 hover:bg-bg-light transition-all duration-200 group rounded-card"
			>
				<svg class="w-4 h-4 text-text-light group-hover:text-brand-blue shrink-0 mt-0.5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
				</svg>
				<span class="text-sm text-brand-blue group-hover:underline leading-snug">{{ article.title }}</span>
			</a>
		</div>

		<!-- Divider -->
		<div class="border-t border-border mb-4"></div>

		<!-- Footer — centered, different weight -->
		<p class="text-sm text-brand-navy-60 text-center">
			Can't find what you need? Browse our
			<a href="https://aioseo.com/docs/" target="_blank" rel="noopener" class="text-brand-blue font-semibold hover:underline transition-all duration-200">Documentation</a>
			or
			<a href="https://aioseo.com/contact/" target="_blank" rel="noopener" class="text-brand-blue font-semibold hover:underline transition-all duration-200">Submit a Support Ticket</a>
		</p>
	</div>
</template>
