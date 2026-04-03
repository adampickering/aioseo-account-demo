import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layout/AppLayout.vue'),
      children: [
        {
          path: '',
          redirect: 'overview',
        },
        {
          path: 'overview',
          name: 'overview',
          component: () => import('@/views/OverviewView.vue'),
        },
        {
          path: 'downloads',
          name: 'downloads',
          component: () => import('@/views/DownloadsView.vue'),
          redirect: { name: 'downloads-aioseo' },
          children: [
            {
              path: 'aioseo',
              name: 'downloads-aioseo',
              component: () => import('@/views/DownloadsAioseoView.vue'),
            },
            {
              path: 'ai-credits',
              name: 'downloads-ai-credits',
              component: () => import('@/views/DownloadsAiCreditsView.vue'),
            },
            {
              path: 'broken-link-checker',
              name: 'downloads-blc',
              component: () => import('@/views/DownloadsBLCView.vue'),
            },
          ],
        },
        {
          path: 'services',
          name: 'services',
          component: () => import('@/views/ServicesView.vue'),
        },
        {
          path: 'billing',
          name: 'billing',
          component: () => import('@/views/BillingView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
        },
        {
          path: 'support',
          name: 'support',
          component: () => import('@/views/SupportView.vue'),
        },
        {
          path: 'suggest-a-feature',
          name: 'suggest-a-feature',
          component: () => import('@/views/SuggestFeatureView.vue'),
        },
        {
          path: 'giveaway',
          name: 'giveaway',
          component: () => import('@/views/GiveawayView.vue'),
        },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
