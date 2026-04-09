import type { CompetitorDataMap } from '@/types/cancellation'

export const cancellationCompetitorData: CompetitorDataMap = {
	'Rank Math': {
		subhead: 'A few things worth checking before you make the move.',
		advantages: [
			{ feature: 'TruSEO On-Page Analysis', detail: 'Detailed score out of 100 with real-time, actionable feedback as you write' },
			{ feature: 'WooCommerce SEO', detail: 'Product schema, Merchant Center integration, and attribute-level optimization included' },
			{ feature: 'Beginner-Friendly Setup', detail: '4-step guided wizard, no Google account required to start' },
			{ feature: 'Multi-Site Licensing', detail: '10 sites on one plan; Rank Math\u2019s Business plan required for client sites' },
		],
	},
	'Yoast SEO': {
		subhead: 'These features are included in your AIOSEO plan, but Yoast charges extra.',
		advantages: [
			{ feature: 'Redirection Manager', detail: 'Catch 404s and manage redirects \u2014 included in your plan (requires Yoast Premium at $99/yr per site)' },
			{ feature: 'Multi-Site Value', detail: '10 sites on one license; Yoast charges $99/year per site ($990 for 10 sites)' },
			{ feature: 'TruSEO On-Page Analysis', detail: 'Score out of 100 with actionable checklist (Yoast uses a basic traffic-light system)' },
			{ feature: 'WooCommerce SEO', detail: 'Product schema and store optimization included (Yoast WooCommerce is a separate add-on at $178.80/yr)' },
		],
	},
	'SEOPress': {
		subhead: 'Some of these may be harder to replace than you think.',
		advantages: [
			{ feature: 'Real-Time On-Page Scoring', detail: 'TruSEO updates as you type (SEOPress requires saving your draft before scoring)' },
			{ feature: 'Link Assistant', detail: 'Automatic internal link suggestions in the editor (SEOPress requires manual copy-paste per link)' },
			{ feature: 'Author SEO & E-E-A-T Schema', detail: 'Structured author credentials, bio blocks, and reviewer schema built in' },
			{ feature: 'Install Base & Support', detail: '3M+ active installs, large support team, and extensive documentation (SEOPress: ~300K installs)' },
		],
	},
	'Search Atlas': {
		subhead: 'Search Atlas isn\u2019t a WordPress plugin. This is what switching would actually mean.',
		advantages: [
			{ feature: 'All-in-One WordPress Plugin', detail: 'On-page SEO, schema, sitemaps, and redirects \u2014 all managed inside WordPress' },
			{ feature: 'No Separate Subscription', detail: 'One plugin covers everything; Search Atlas starts at $99/month as a separate cloud platform' },
			{ feature: 'In-Editor Optimization', detail: 'TruSEO scoring and meta management right where you write (Search Atlas is an external dashboard)' },
			{ feature: 'Proven Stability', detail: '3M+ installs, 15+ years of development \u2014 no reported sitemap or de-indexing risks' },
		],
	},
	'Ubersuggest': {
		subhead: 'Ubersuggest and AIOSEO do different things. This is what you\u2019d still need after switching.',
		advantages: [
			{ feature: 'WordPress SEO Plugin', detail: 'On-page optimization, schema, sitemaps, and redirects built for WordPress \u2014 Ubersuggest has none of this' },
			{ feature: 'In-Editor Optimization', detail: 'TruSEO scoring and internal link suggestions as you write' },
			{ feature: 'Redirection Manager & 404s', detail: 'Catch and fix broken links automatically' },
			{ feature: 'Schema Markup Generator', detail: 'Rich snippets for products, FAQs, reviews, and more \u2014 no coding required' },
		],
	},
	_default: {
		subhead: 'Your site relies on these features right now. It\u2019s worth checking whether your new solution includes them.',
		useCheckInstead: true,
		advantages: [
			{ feature: 'On-Page Optimization', detail: 'TruSEO scoring, meta management, and real-time feedback in the editor' },
			{ feature: 'Schema Markup Generator', detail: 'Rich snippets for products, FAQs, reviews, events, and more \u2014 no coding required' },
			{ feature: 'Redirection Manager & 404 Monitor', detail: 'Catch broken links and set up redirects without a separate plugin' },
			{ feature: 'Link Assistant', detail: 'Automatic internal link suggestions for every post on your site' },
		],
	},
}
