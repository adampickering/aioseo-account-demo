<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const tabs = [
	{ name: 'downloads-aioseo', label: 'AIOSEO', icon: 'aioseo' },
	{ name: 'downloads-ai-credits', label: 'AI Credits', icon: 'ai' },
	{ name: 'downloads-blc', label: 'Broken Link Checker', icon: 'blc' },
] as const

const activeTab = computed(() => route.name)
</script>

<template>
	<div class="space-y-8">
		<!-- Page heading -->
		<h2 class="text-2xl font-semibold font-heading text-text-primary">Downloads</h2>

		<!-- Sub-tab navigation -->
		<nav class="flex flex-wrap gap-2">
			<router-link
				v-for="tab in tabs"
				:key="tab.name"
				:to="{ name: tab.name }"
				class="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200"
				style="border-radius: 5px; padding: 8px 16px;"
				:class="activeTab === tab.name
					? 'bg-brand-blue text-white'
					: 'bg-brand-blue-5 text-brand-navy-60 hover:bg-brand-blue-10 hover:text-brand-navy'"
			>
				<!-- Product color dot -->
				<span
					class="w-2 h-2 rounded-full shrink-0"
					:class="{
						'bg-white/70': activeTab === tab.name,
						'bg-brand-blue': activeTab !== tab.name && tab.icon === 'aioseo',
						'bg-purple-500': activeTab !== tab.name && tab.icon === 'ai',
						'bg-brand-red': activeTab !== tab.name && tab.icon === 'blc',
					}"
				/>
				{{ tab.label }}
			</router-link>
		</nav>

		<!-- Active sub-view -->
		<router-view />
	</div>
</template>
