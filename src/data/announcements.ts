import type { Announcement } from '@/types'

export const announcements: Announcement[] = [
	{
		id: '1',
		title: 'Optimize Faster with AIOSEO 4.6.6: New Support for Thrive Architect and SiteOrigin Page Builders',
		excerpt: "Many of you asked, and we listened. That's why we're so excited to announce page builder integrations for 2 more page builders — Thrive Architect and SiteOrigin in AIOSEO 4.6.6. Yes! That's right...",
		imageUrl: import.meta.env.BASE_URL + 'assets/images/announcement-1.png',
		url: 'https://aioseo.com/aioseo-4-6-6-release/',
	},
	{
		id: '2',
		title: 'AIOSEO Launches SEOBoost: Create Better Ranking Content',
		excerpt: "I'm thrilled to announce that All in One SEO has launched SEOBoost, a game-changing SEO and content optimization tool designed to help you create better-ranking content easily and consistently. While we all know...",
		imageUrl: import.meta.env.BASE_URL + 'assets/images/announcement-2.png',
		url: 'https://aioseo.com/seoboost-launch/',
	},
]
