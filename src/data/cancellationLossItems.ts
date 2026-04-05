import type { LossItem, LossItemsByTier } from '@/types/cancellation'

const shared: LossItem = {
	title: 'WordPress Compatibility & Priority Support',
	body: "When WordPress pushes updates, your SEO settings could break. Without an active license, you won't get patches, security fixes, or access to our support team to help troubleshoot.",
}

export const cancellationLossItems: LossItemsByTier = {
	elite: [
		{
			title: 'Search Statistics',
			body: "Your SEO Statistics dashboard goes dark. You'll lose the traffic and ranking insights that show whether your SEO is actually working—and you won't be able to spot drops before they become problems.",
		},
		{
			title: 'Link Assistant',
			body: "You'll stop getting smart internal linking suggestions inside the editor. Internal links are one of the easiest ways to boost rankings. Without Link Assistant, you're doing it manually or not at all.",
		},
		{
			title: '404 Monitoring',
			body: "AIOSEO won't catch broken links and 404 errors on your site anymore. These pile up silently and hurt both your rankings and your visitors' experience.",
		},
		shared,
	],
	pro: [
		{
			title: 'Link Assistant',
			body: "You'll stop getting smart internal linking suggestions inside the editor. Internal links are one of the easiest ways to boost rankings. Without Link Assistant, you're doing it manually or not at all.",
		},
		{
			title: '404 Monitoring',
			body: "AIOSEO won't catch broken links and 404 errors on your site anymore. These pile up silently and hurt both your rankings and your visitors' experience.",
		},
		{
			title: 'Local SEO',
			body: "Your local business info, Google Maps integration, and location-based schema markup will stop updating. If you rely on local search, this directly affects your visibility and foot traffic.",
		},
		shared,
	],
	plus: [
		{
			title: 'Local SEO',
			body: "Your local business info, Google Maps integration, and location-based schema markup will stop updating. If you rely on local search, this directly affects your visibility and foot traffic.",
		},
		{
			title: 'Schema Generator',
			body: "Your rich snippets—star ratings, FAQ dropdowns, product info in search results—will stop working as Google's requirements change. These are proven to improve click-through rates, and you'll lose them.",
		},
		{
			title: 'Redirection Manager',
			body: "Broken links won't be automatically redirected anymore. Every 404 error is a lost visitor and a negative signal to search engines. Without the Redirection Manager, you have to catch and fix these yourself.",
		},
		shared,
	],
	basic: [
		{
			title: 'Schema Generator',
			body: "Your rich snippets—star ratings, FAQ dropdowns, product info in search results—will stop working as Google's requirements change. These are proven to improve click-through rates, and you'll lose them.",
		},
		{
			title: 'Redirection Manager',
			body: "Broken links won't be automatically redirected anymore. Every 404 error is a lost visitor and a negative signal to search engines. Without the Redirection Manager, you have to catch and fix these yourself.",
		},
		{
			title: 'Taxonomies SEO',
			body: "Your category and tag pages will lose their SEO optimization—custom titles, meta descriptions, and schema markup for taxonomies all stop working. These pages often rank well and drive traffic you might not realize you're getting.",
		},
		shared,
	],
}
