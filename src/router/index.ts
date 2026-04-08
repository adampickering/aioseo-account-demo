import { createRouter, createWebHistory } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			component: () => import('@/layout/AppLayout.vue'),
			children: [
				{ path: '', redirect: 'overview' },
				{ path: 'overview', name: 'overview', component: () => import('@/views/OverviewView.vue') },
				{ path: 'downloads', name: 'downloads', component: () => import('@/views/DownloadsView.vue') },
				{ path: 'services', name: 'services', component: () => import('@/views/ServicesView.vue') },
				{ path: 'billing', name: 'billing', component: () => import('@/views/BillingView.vue') },
				{ path: 'profile', name: 'profile', component: () => import('@/views/ProfileView.vue') },
				{ path: 'support', name: 'support', component: () => import('@/views/SupportView.vue') },
				{ path: 'suggest-a-feature', name: 'suggest-a-feature', component: () => import('@/views/SuggestFeatureView.vue') },
				{ path: 'giveaway', name: 'giveaway', component: () => import('@/views/GiveawayView.vue') },
			],
		},
		{
			path: '/cancel',
			component: () => import('@/layout/CancelLayout.vue'),
			children: [
				{ path: '', redirect: { name: 'cancel-support' } },
				{
					path: 'support',
					name: 'cancel-support',
					component: () => import('@/views/cancel/Step1Support.vue'),
				},
				{
					path: 'reason',
					name: 'cancel-reason',
					component: () => import('@/views/cancel/Step2Reasons.vue'),
				},
				{
					path: 'offer/too-expensive',
					name: 'cancel-offer-expensive',
					component: () => import('@/views/cancel/Step3SaveOffer.vue'),
					beforeEnter: (_to, _from, next) => {
						const store = useCancellationStore()
						if (!store.selectedReason) return next({ name: 'cancel-reason' })
						next()
					},
				},
				{
					path: 'offer/billing',
					name: 'cancel-offer-billing',
					component: () => import('@/views/cancel/Step3SaveOffer.vue'),
					beforeEnter: (_to, _from, next) => {
						const store = useCancellationStore()
						if (!store.selectedReason) return next({ name: 'cancel-reason' })
						next()
					},
				},
				{
					path: 'offer/technical',
					name: 'cancel-offer-technical',
					component: () => import('@/views/cancel/Step3SaveOffer.vue'),
					beforeEnter: (_to, _from, next) => {
						const store = useCancellationStore()
						if (!store.selectedReason) return next({ name: 'cancel-reason' })
						next()
					},
				},
				{
					path: 'offer/switching/:competitor',
					name: 'cancel-offer-switching',
					component: () => import('@/views/cancel/Step3SaveOffer.vue'),
					beforeEnter: (_to, _from, next) => {
						const store = useCancellationStore()
						if (!store.selectedReason) return next({ name: 'cancel-reason' })
						next()
					},
				},
				{
					path: 'offer/features',
					name: 'cancel-offer-features',
					component: () => import('@/views/cancel/Step3SaveOffer.vue'),
					beforeEnter: (_to, _from, next) => {
						const store = useCancellationStore()
						if (!store.selectedReason) return next({ name: 'cancel-reason' })
						next()
					},
				},
				{
					path: 'offer/closing',
					name: 'cancel-offer-closing',
					component: () => import('@/views/cancel/Step3SaveOffer.vue'),
					beforeEnter: (_to, _from, next) => {
						const store = useCancellationStore()
						if (!store.selectedReason) return next({ name: 'cancel-reason' })
						next()
					},
				},
				{
					path: 'offer/not-using',
					name: 'cancel-offer-not-using',
					component: () => import('@/views/cancel/Step3VariantG.vue'),
					beforeEnter: (_to, _from, next) => {
						const store = useCancellationStore()
						if (!store.selectedReason) return next({ name: 'cancel-reason' })
						next()
					},
				},
				{
					path: 'offer/other',
					name: 'cancel-offer-other',
					component: () => import('@/views/cancel/Step3SaveOffer.vue'),
					beforeEnter: (_to, _from, next) => {
						const store = useCancellationStore()
						if (!store.selectedReason) return next({ name: 'cancel-reason' })
						next()
					},
				},
				{
					path: 'review',
					name: 'cancel-review',
					component: () => import('@/views/cancel/Step4LossSummary.vue'),
					beforeEnter: (_to, _from, next) => {
						const store = useCancellationStore()
						if (!store.selectedReason) return next({ name: 'cancel-reason' })
						next()
					},
				},
				{
					path: 'confirmation',
					name: 'cancel-confirmation',
					component: () => import('@/views/cancel/Step5Confirmation.vue'),
					beforeEnter: (_to, _from, next) => {
						const store = useCancellationStore()
						if (!store.selectedReason) return next({ name: 'cancel-reason' })
						next()
					},
				},
				{
					path: 'duplicate-subscription',
					name: 'cancel-bypass-support',
					component: () => import('@/views/cancel/BypassSupport.vue'),
				},
				{
					path: 'change-plan',
					name: 'cancel-bypass-plan',
					component: () => import('@/views/cancel/BypassPlanMgmt.vue'),
				},
			],
		},
	],
	scrollBehavior() {
		return { top: 0 }
	},
})

export default router
