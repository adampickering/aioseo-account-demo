<script setup lang="ts">
import ImageSeoIcon from '/assets/icons/addon-image-seo.svg'
import VideoSitemapIcon from '/assets/icons/addon-video-sitemap.svg'
import LocalBusinessIcon from '/assets/icons/addon-local-business.svg'
import NewsSitemapIcon from '/assets/icons/addon-news-sitemap.svg'
import LinkAssistantIcon from '/assets/icons/addon-link-assistant.svg'
import IndexNowIcon from '/assets/icons/addon-index-now.svg'
import RestApiIcon from '/assets/icons/addon-rest-api.svg'
import EeatIcon from '/assets/icons/addon-eeat.svg'

const props = defineProps<{
	addonId: string
}>()

const iconMap: Record<string, any> = {
	'image-seo': ImageSeoIcon,
	'video-sitemap': VideoSitemapIcon,
	'local-business': LocalBusinessIcon,
	'news-sitemap': NewsSitemapIcon,
	'link-assistant': LinkAssistantIcon,
	'index-now': IndexNowIcon,
	'rest-api': RestApiIcon,
	'eeat': EeatIcon,
}

const iconComponent = iconMap[props.addonId] || null
</script>

<template>
	<component
		v-if="iconComponent"
		:is="iconComponent"
		class="w-7 h-7"
	/>
	<span v-else class="text-sm font-bold text-brand-blue">?</span>
</template>
