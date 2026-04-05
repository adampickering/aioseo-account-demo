import type { Reason } from '@/types/cancellation'

export const cancellationReasons: Reason[] = [
	{
		id: 1,
		label: "I'm having technical problems",
		followUp: { type: 'text', placeholder: "What's the problem?" },
		variant: 'C',
	},
	{
		id: 2,
		label: "I need features AIOSEO doesn't have",
		followUp: { type: 'text', placeholder: 'What feature(s) do you need?' },
		variant: 'E',
	},
	{
		id: 3,
		label: "I'm switching to a different SEO solution",
		followUp: {
			type: 'dropdown',
			placeholder: 'Which solution?',
			required: true,
			options: ['Rank Math', 'Yoast SEO', 'SEOPress', 'Search Atlas', 'Ubersuggest', 'Other'],
			otherTextField: true,
		},
		variant: 'D',
	},
	{
		id: 4,
		label: 'My website or business no longer exists',
		followUp: null,
		variant: 'F',
	},
	{
		id: 5,
		label: "It's too expensive",
		followUp: {
			type: 'dropdown',
			placeholder: 'What would help?',
			options: ['Lower renewal price', 'A smaller plan', 'Monthly billing', 'I found a cheaper option'],
		},
		variant: 'A',
	},
	{
		id: 6,
		label: "I don't like subscriptions / auto-renewals",
		followUp: {
			type: 'dropdown',
			placeholder: 'What happened?',
			options: ['Charged unexpectedly', 'Forgot to cancel', 'Prefer one-time purchase', 'Want more billing control'],
		},
		variant: 'B',
	},
	{
		id: 7,
		label: "I'm not using the product",
		followUp: null,
		variant: 'G',
	},
	{
		id: 8,
		label: 'I have a duplicate subscription',
		followUp: null,
		variant: 'bypass-support',
	},
	{
		id: 9,
		label: 'I want to upgrade or downgrade my plan',
		followUp: null,
		variant: 'bypass-plan',
	},
	{
		id: 10,
		label: 'Other',
		followUp: { type: 'text', placeholder: 'Please share your reason...' },
		variant: 'H',
	},
]
