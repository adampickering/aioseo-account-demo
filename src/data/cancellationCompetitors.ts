import type { CompetitorDataMap } from '@/types/cancellation'

export const cancellationCompetitorData: CompetitorDataMap = {
	'Rank Math': {
		advantages: [
			{ feature: 'TruSEO On-Page Analysis', detail: 'Actionable scoring system (Rank Math has basic analysis only)' },
			{ feature: 'Built-in Link Assistant', detail: 'Smart internal linking suggestions (Rank Math has no equivalent)' },
			{ feature: 'Full Schema Generator', detail: '18+ schema types included (Rank Math limits free schema types)' },
			{ feature: 'SEO Statistics Dashboard', detail: 'Dedicated traffic & ranking dashboard (Rank Math requires Google Search Console separately)' },
		],
	},
	'Yoast SEO': {
		advantages: [
			{ feature: 'TruSEO On-Page Analysis', detail: 'Unlimited focus keywords per page (Yoast limits to 1 in free, 5 in premium)' },
			{ feature: 'Built-in Link Assistant', detail: 'Automatic internal linking suggestions (Yoast has basic linking only)' },
			{ feature: 'Redirection Manager', detail: 'Full redirect management included (Yoast requires Premium for redirects)' },
			{ feature: 'SEO Statistics Dashboard', detail: 'Built-in Google Search Console integration (Yoast requires separate setup)' },
		],
	},
	'SEOPress': {
		advantages: [
			{ feature: 'TruSEO Score Analysis', detail: 'Detailed on-page scoring with actionable recommendations' },
			{ feature: 'Link Assistant', detail: 'AI-powered internal linking suggestions inside the editor' },
			{ feature: 'Advanced Schema Generator', detail: '18+ schema types with visual builder' },
			{ feature: 'Priority Support', detail: 'Dedicated support team with faster response times' },
		],
	},
	'Search Atlas': {
		advantages: [
			{ feature: 'WordPress-Native Integration', detail: 'Built specifically for WordPress, not a generic SEO tool' },
			{ feature: 'TruSEO On-Page Analysis', detail: 'Real-time scoring as you write in the WordPress editor' },
			{ feature: 'Smart XML Sitemaps', detail: 'Automatic sitemap generation optimized for WordPress' },
			{ feature: 'No Per-Page Pricing', detail: 'Unlimited pages and posts with every plan' },
		],
	},
	'Ubersuggest': {
		advantages: [
			{ feature: 'WordPress-Native Plugin', detail: 'Full SEO suite inside WordPress (Ubersuggest is primarily a web app)' },
			{ feature: 'Link Assistant', detail: 'Internal linking automation (Ubersuggest lacks this)' },
			{ feature: 'Schema Generator', detail: '18+ rich snippet types (Ubersuggest has limited schema support)' },
			{ feature: 'Redirection Manager', detail: 'Built-in 404 monitoring and redirects (not available in Ubersuggest)' },
		],
	},
	_default: {
		advantages: [
			{ feature: 'TruSEO On-Page Analysis', detail: 'Actionable scoring system that guides you to perfectly optimized content' },
			{ feature: 'Built-in Link Assistant', detail: 'Smart internal linking suggestions right inside the WordPress editor' },
			{ feature: 'Full Schema Generator', detail: '18+ schema types for rich snippets in search results' },
			{ feature: 'All-in-One SEO Suite', detail: 'Sitemaps, redirects, local SEO, social media, and analytics in one plugin' },
		],
	},
}
