# AIOSEO Account Site — Vue Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone Vue 3 prototype of the AIOSEO.com account dashboard with all 8 tabs, faithful to the Figma designs, using TypeScript, Tailwind CSS, and mock data composables that developers can later swap for real API calls.

**Architecture:** A Vite-powered Vue 3 SPA using Vue Router (history mode) with a configurable base path. Data is served through TypeScript-typed composables returning reactive mock data, with multiple switchable user profiles (basic/pro/elite). All third-party content (WPForms, DeskBot chat, RafflePress) renders via a shared iframe embed component.

**Tech Stack:** Vue 3, TypeScript, Vite, Vue Router, Pinia, Tailwind CSS v4, npm

**Figma Reference:** `https://www.figma.com/design/fjIJKtHQjHUW5RmEKsi5Yb/AIOSEO---Account-Area-Revamp?node-id=2210-693`

---

## Design Tokens

These are extracted directly from the Figma file and MUST be used throughout.

```
Colors:
  Primary Default:    #005AE0  (buttons, active tabs, links)
  Primary 5:          #F2F7FD  (light blue backgrounds)
  Primary 10:         #E6EEFC  (info backgrounds, hover states)
  Primary 25:         #BFD6F7  (borders, progress bars)
  Neutral Default:    #141B38  (dark navy — header bg, headings)
  Neutral 40:         #8C8F9A  (secondary text, labels)
  Neutral 60:         #434960  (body text)
  Accent Default:     #00AA63  (success, "Active" badges, green CTAs)
  Text Primary 900:   #181d27  (primary text)
  Text Quaternary 500:#717680  (muted text)
  White:              #ffffff  (backgrounds, white text)
  Shadow XS:          #0a0d120d (card shadows)
  Error/Red:          #DF2A4A  (error states, cancel actions)
  Warning/Amber:      #F18200  (countdown timers, warning badges)

Typography:
  Font Family Headings: "Proxima Nova", system-ui, sans-serif
  Font Family Body:     "Inter", system-ui, sans-serif
  Display LG:  48px / 60px line-height / 600 weight
  Display SM:  30px / 38px line-height / 600 weight
  H3:          23px / 1.25 line-height / 600 weight
  Text XL:     20px / 30px line-height
  Text LG:     18px / 28px line-height
  Text MD:     16px / 24px line-height
  Text SM:     14px / 20px line-height
  Text XS:     12px / 18px line-height

Spacing:
  xxs: 2px, xs: 4px, md: 8px, lg: 12px, xl: 16px
  2xl: 20px, 3xl: 24px, 4xl: 32px, 5xl: 40px

Radius:
  Full: 9999px (pills, badges)

Shadows:
  XS: 0 1px 2px #0a0d120d
  XS Skeuomorphic: 0 1px 2px #0a0d120d, inset 0 -2px 0 #0a0d120d, inset 0 0 0 1px #0a0d122e
```

---

## File Structure

```
~/dev/aioseo-account/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
├── public/
│   └── assets/
│       └── icons/           ← Addon/product icons extracted from Figma
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── router/
│   │   └── index.ts         ← All route definitions
│   ├── types/
│   │   ├── user.ts           ← User, BillingAddress
│   │   ├── license.ts        ← License, Addon, AiCredits
│   │   ├── subscription.ts   ← Subscription, PaymentMethod, Order
│   │   ├── announcement.ts   ← Announcement (blog post)
│   │   ├── offer.ts          ← UpgradeOffer, PromoOffer
│   │   └── index.ts          ← Re-exports all types
│   ├── composables/
│   │   ├── useAccount.ts     ← User profile, quick links
│   │   ├── useLicenses.ts    ← Licenses, addons, downloads
│   │   ├── useSubscriptions.ts ← Subscriptions, payment methods, orders
│   │   ├── useAiCredits.ts   ← AI credit balances
│   │   ├── useOffers.ts      ← Upgrade offers, promo offers (profile-aware)
│   │   ├── useAnnouncements.ts ← Blog post announcements
│   │   ├── useHelpArticles.ts  ← Help/doc article links
│   │   └── useMockProfile.ts   ← Profile switcher (basic/pro/elite)
│   ├── stores/
│   │   └── profile.ts        ← Pinia store for active mock profile
│   ├── layout/
│   │   ├── AppLayout.vue     ← Full shell: header + tabs + content + CTA + footer
│   │   ├── SiteHeader.vue    ← Simplified static header
│   │   ├── SiteFooter.vue    ← Simplified static footer
│   │   ├── TabNavigation.vue ← Primary tabs + "More" dropdown
│   │   ├── CtaBanner.vue     ← "Get the #1 Most Powerful..." banner
│   │   └── UserMenu.vue      ← Avatar + name + Log Out dropdown
│   ├── components/
│   │   ├── StatusBadge.vue        ← "Active" / "Expired" pill badges
│   │   ├── IframeEmbed.vue        ← Generic iframe wrapper for WPForms/DeskBot/RafflePress
│   │   ├── LicenseCard.vue        ← License info: tier, key, expiry, activations, AI credits
│   │   ├── AddonCard.vue          ← Addon icon + name + download link
│   │   ├── UpgradeOfferCard.vue   ← Tier upgrade with countdown, feature grid, CTA
│   │   ├── PromoOfferCard.vue     ← Product promo (BLC, SEOBoost, etc.)
│   │   ├── CountdownTimer.vue     ← Reactive countdown (days/hours/min/sec)
│   │   ├── AnnouncementCard.vue   ← Blog post card (image, title, excerpt)
│   │   ├── SubscriptionRow.vue    ← Single subscription table row
│   │   ├── PaymentMethodCard.vue  ← Saved card with delete/make default
│   │   ├── OrderRow.vue           ← Past order table row
│   │   ├── ServicePricingCard.vue ← Services tab pricing card
│   │   ├── HelpSearchSection.vue  ← Search box + 6 doc article links
│   │   ├── QuickLinks.vue         ← Overview quick links grid
│   │   └── ProfileSwitcher.vue    ← Dev toolbar to switch mock profiles
│   ├── views/
│   │   ├── OverviewView.vue
│   │   ├── DownloadsView.vue      ← Parent with sub-tab nav + <router-view>
│   │   ├── DownloadsAioseoView.vue
│   │   ├── DownloadsAiCreditsView.vue
│   │   ├── DownloadsBLCView.vue
│   │   ├── BillingView.vue
│   │   ├── SupportView.vue        ← Toggle between chat + contact form iframes
│   │   ├── ServicesView.vue
│   │   ├── ProfileView.vue
│   │   ├── SuggestFeatureView.vue
│   │   └── GiveawayView.vue
│   └── data/
│       ├── profiles/
│       │   ├── basic.ts       ← Basic user: AIOSEO Basic, no BLC
│       │   ├── pro.ts         ← Pro user: AIOSEO Pro, BLC Starter
│       │   └── elite.ts      ← Elite user: AIOSEO Elite, BLC Premium, AI credits
│       ├── addons.ts          ← Addon metadata (name, icon, help URL, changelog URL)
│       ├── articles.ts        ← Help article titles + URLs
│       └── announcements.ts   ← Mock blog post data
├── docs/
│   └── superpowers/
│       └── plans/
│           └── 2026-04-02-aioseo-account-prototype.md
└── .gitignore
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `~/dev/aioseo-account/` (via create-vue)
- Modify: `package.json`, `tailwind.config.ts`, `vite.config.ts`, `tsconfig.json`, `src/main.ts`, `index.html`

- [ ] **Step 1: Scaffold the Vue project**

```bash
cd ~/dev
npm create vue@latest aioseo-account -- --typescript --router --pinia
cd aioseo-account
```

Select: TypeScript YES, JSX NO, Vue Router YES, Pinia YES, Vitest NO, E2E NO, ESLint NO, Prettier NO.

- [ ] **Step 2: Install Tailwind CSS v4**

```bash
npm install tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Vite for Tailwind**

Replace `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  base: '/account/',
})
```

- [ ] **Step 4: Create Tailwind CSS entry**

Replace `src/assets/main.css`:

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-brand-blue: #005AE0;
  --color-brand-blue-5: #F2F7FD;
  --color-brand-blue-10: #E6EEFC;
  --color-brand-blue-25: #BFD6F7;
  --color-brand-navy: #141B38;
  --color-brand-navy-60: #434960;
  --color-brand-navy-40: #8C8F9A;
  --color-brand-green: #00AA63;
  --color-brand-red: #DF2A4A;
  --color-brand-amber: #F18200;
  --color-text-primary: #181d27;
  --color-text-secondary: #434960;
  --color-text-muted: #717680;
  --color-text-light: #8C8F9A;
  --color-bg-primary: #ffffff;
  --color-bg-light: #F2F7FD;
  --color-bg-info: #E6EEFC;
  --color-shadow-xs: #0a0d120d;
  --color-shadow-inner: #0a0d122e;

  /* Font families */
  --font-heading: "Proxima Nova", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;

  /* Font sizes */
  --text-display-lg: 48px;
  --text-display-lg--line-height: 60px;
  --text-display-sm: 30px;
  --text-display-sm--line-height: 38px;
  --text-h3: 23px;
  --text-h3--line-height: 1.25;
  --text-xl: 20px;
  --text-xl--line-height: 30px;

  /* Shadows */
  --shadow-xs: 0 1px 2px var(--color-shadow-xs);
  --shadow-card: 0 1px 2px var(--color-shadow-xs), inset 0 -2px 0 var(--color-shadow-xs), inset 0 0 0 1px var(--color-shadow-inner);
}

@layer base {
  body {
    font-family: var(--font-body);
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}
```

- [ ] **Step 5: Update index.html with font links**

Replace the `<head>` content in `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account - AIOSEO</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://use.typekit.net/YOUR_KIT_ID.css" rel="stylesheet">
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Note: Proxima Nova requires a Typekit/Adobe Fonts kit. If unavailable, fall back to system-ui. The Tailwind config already includes system-ui as a fallback.

- [ ] **Step 6: Clean up scaffolded files**

Delete all default scaffolded components and views:

```bash
rm -rf src/components/* src/views/* src/stores/* src/assets/logo.svg src/assets/base.css
```

- [ ] **Step 7: Update main.ts**

Replace `src/main.ts`:

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

- [ ] **Step 8: Create minimal App.vue**

Replace `src/App.vue`:

```vue
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>
```

- [ ] **Step 9: Create placeholder router**

Replace `src/router/index.ts`:

```typescript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/overview',
    },
  ],
})

export default router
```

- [ ] **Step 10: Verify it runs**

```bash
npm install
npm run dev
```

Expected: Vite dev server starts, blank page loads at `http://localhost:5173/account/` with no errors in console.

- [ ] **Step 11: Initialize git and commit**

```bash
cd ~/dev/aioseo-account
git init
git add .
git commit -m "feat: scaffold Vue 3 + TypeScript + Tailwind project"
```

---

## Task 2: TypeScript Type Definitions

**Files:**
- Create: `src/types/user.ts`, `src/types/license.ts`, `src/types/subscription.ts`, `src/types/announcement.ts`, `src/types/offer.ts`, `src/types/index.ts`

- [ ] **Step 1: Create user types**

Create `src/types/user.ts`:

```typescript
export interface BillingAddress {
  line1: string
  line2: string
  city: string
  zip: string
  country: string
  state: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  avatarUrl: string
  billingAddress: BillingAddress
}

export interface QuickLink {
  label: string
  href: string
}
```

- [ ] **Step 2: Create license types**

Create `src/types/license.ts`:

```typescript
export type LicenseStatus = 'active' | 'expired' | 'cancelled'

export type LicenseTier = 'basic' | 'plus' | 'pro' | 'elite'

export type ProductType = 'aioseo' | 'broken-link-checker' | 'ai-credits'

export interface Addon {
  id: string
  name: string
  iconUrl: string
  downloadUrl: string
  helpUrl: string
  changelogUrl: string
  version: string
}

export interface AiCredits {
  used: number
  total: number
  includedInSubscription: number
  paidCredits: number
  expiresAt: string
}

export interface License {
  id: string
  product: ProductType
  productName: string
  tier: LicenseTier
  tierLabel: string
  licenseKey: string
  status: LicenseStatus
  expiresAt: string
  siteActivations: {
    used: number
    total: number
  }
  links?: {
    remaining?: number
    total?: number
  }
  downloadUrl: string
  version: string
  changelogUrl: string
  addons: Addon[]
  aiCredits?: AiCredits
}
```

- [ ] **Step 3: Create subscription types**

Create `src/types/subscription.ts`:

```typescript
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired'

export type OrderStatus = 'completed' | 'refunded' | 'pending' | 'failed'

export type PaymentBrand = 'visa' | 'mastercard' | 'amex' | 'discover'

export interface Subscription {
  id: string
  date: string
  product: string
  status: SubscriptionStatus
  renewsAt: string
  actions: {
    changePlanUrl: string
    cancelUrl: string
    updatePaymentUrl: string
  }
}

export interface PaymentMethod {
  id: string
  brand: PaymentBrand
  last4: string
  expiresAt: string
  isDefault: boolean
}

export interface Order {
  id: string
  date: string
  product: string
  amount: string
  status: OrderStatus
  invoiceUrl: string
}
```

- [ ] **Step 4: Create announcement types**

Create `src/types/announcement.ts`:

```typescript
export interface Announcement {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  url: string
}
```

- [ ] **Step 5: Create offer types**

Create `src/types/offer.ts`:

```typescript
export interface UpgradeFeature {
  icon: string
  label: string
}

export interface UpgradeOffer {
  id: string
  title: string
  subtitle: string
  originalPrice: string
  currentPrice: string
  valueLabel: string
  badgeText: string
  ctaLabel: string
  ctaUrl: string
  ctaColor: 'green' | 'blue' | 'amber'
  expiresAt: string
  features: UpgradeFeature[]
}

export interface PromoOffer {
  id: string
  productName: string
  description: string
  iconUrl: string
  ctaLabel: string
  ctaUrl: string
  iconBgColor: string
}
```

- [ ] **Step 6: Create index re-export**

Create `src/types/index.ts`:

```typescript
export * from './user'
export * from './license'
export * from './subscription'
export * from './announcement'
export * from './offer'
```

- [ ] **Step 7: Verify types compile**

```bash
npx vue-tsc --noEmit
```

Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add src/types/
git commit -m "feat: add TypeScript type definitions for all data models"
```

---

## Task 3: Mock Data & Profile System

**Files:**
- Create: `src/stores/profile.ts`, `src/data/profiles/basic.ts`, `src/data/profiles/pro.ts`, `src/data/profiles/elite.ts`, `src/data/addons.ts`, `src/data/articles.ts`, `src/data/announcements.ts`
- Create: `src/composables/useMockProfile.ts`, `src/composables/useAccount.ts`, `src/composables/useLicenses.ts`, `src/composables/useSubscriptions.ts`, `src/composables/useAiCredits.ts`, `src/composables/useOffers.ts`, `src/composables/useAnnouncements.ts`, `src/composables/useHelpArticles.ts`

- [ ] **Step 1: Create Pinia profile store**

Create `src/stores/profile.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ProfileKey = 'basic' | 'pro' | 'elite'

export const useProfileStore = defineStore('profile', () => {
  const params = new URLSearchParams(window.location.search)
  const initial = (params.get('profile') as ProfileKey) || 'elite'

  const activeProfile = ref<ProfileKey>(initial)

  function setProfile(key: ProfileKey) {
    activeProfile.value = key
    const url = new URL(window.location.href)
    url.searchParams.set('profile', key)
    window.history.replaceState({}, '', url.toString())
  }

  return { activeProfile, setProfile }
})
```

- [ ] **Step 2: Create addon metadata**

Create `src/data/addons.ts`:

```typescript
import type { Addon } from '@/types'

export const allAddons: Record<string, Addon> = {
  'image-seo': {
    id: 'image-seo',
    name: 'Image SEO',
    iconUrl: '/assets/icons/addon-image-seo.svg',
    downloadUrl: '#',
    helpUrl: 'https://aioseo.com/docs/using-the-image-seo-features-in-all-in-one-seo/',
    changelogUrl: 'https://aioseo.com/changelog/image-seo',
    version: '1.2.3',
  },
  'video-sitemap': {
    id: 'video-sitemap',
    name: 'Video Sitemap',
    iconUrl: '/assets/icons/addon-video-sitemap.svg',
    downloadUrl: '#',
    helpUrl: 'https://aioseo.com/docs/how-to-create-a-video-sitemap/',
    changelogUrl: 'https://aioseo.com/changelog/video-sitemap',
    version: '1.1.26',
  },
  'local-business': {
    id: 'local-business',
    name: 'Local Business SEO',
    iconUrl: '/assets/icons/addon-local-business.svg',
    downloadUrl: '#',
    helpUrl: 'https://aioseo.com/docs/local-business-seo/',
    changelogUrl: 'https://aioseo.com/changelog/local-business',
    version: '1.3.12',
  },
  'news-sitemap': {
    id: 'news-sitemap',
    name: 'News Sitemap',
    iconUrl: '/assets/icons/addon-news-sitemap.svg',
    downloadUrl: '#',
    helpUrl: 'https://aioseo.com/docs/how-to-create-a-google-news-sitemap/',
    changelogUrl: 'https://aioseo.com/changelog/news-sitemap',
    version: '1.0.20',
  },
  'link-assistant': {
    id: 'link-assistant',
    name: 'Link Assistant',
    iconUrl: '/assets/icons/addon-link-assistant.svg',
    downloadUrl: '#',
    helpUrl: 'https://aioseo.com/docs/link-assistant/',
    changelogUrl: 'https://aioseo.com/changelog/link-assistant',
    version: '1.1.13',
  },
  'index-now': {
    id: 'index-now',
    name: 'IndexNow',
    iconUrl: '/assets/icons/addon-index-now.svg',
    downloadUrl: '#',
    helpUrl: 'https://aioseo.com/index-now',
    changelogUrl: 'https://aioseo.com/changelog/index-now',
    version: '1.0.13',
  },
  'rest-api': {
    id: 'rest-api',
    name: 'REST API',
    iconUrl: '/assets/icons/addon-rest-api.svg',
    downloadUrl: '#',
    helpUrl: 'https://aioseo.com/feature/rest-api/',
    changelogUrl: 'https://aioseo.com/changelog/rest-api',
    version: '1.0.9',
  },
  'eeat': {
    id: 'eeat',
    name: 'Author SEO (E-E-A-T)',
    iconUrl: '/assets/icons/addon-eeat.svg',
    downloadUrl: '#',
    helpUrl: 'https://aioseo.com/features/eeat/',
    changelogUrl: 'https://aioseo.com/changelog/eeat',
    version: '1.2.10',
  },
}
```

- [ ] **Step 3: Create Elite profile data**

Create `src/data/profiles/elite.ts`:

```typescript
import type { User, License, Subscription, PaymentMethod, Order, AiCredits, PromoOffer } from '@/types'
import { allAddons } from '@/data/addons'

export const user: User = {
  id: '1',
  firstName: 'Arnaud',
  lastName: 'Broes',
  email: 'abroes@awesomemotive.com',
  avatarUrl: 'https://ui-avatars.com/api/?name=Arnaud+Broes&background=005AE0&color=fff&size=80',
  billingAddress: {
    line1: '123 Main Street',
    line2: '',
    city: 'Toronto',
    zip: 'M5V 2T6',
    country: 'Canada',
    state: 'Ontario',
  },
}

export const licenses: License[] = [
  {
    id: 'lic-aioseo-elite',
    product: 'aioseo',
    productName: 'AIOSEO',
    tier: 'elite',
    tierLabel: 'Elite',
    licenseKey: 'ebce67b6d55de0e454ff1bb337fd',
    status: 'active',
    expiresAt: '2027-01-22',
    siteActivations: { used: 0, total: 5 },
    downloadUrl: '#',
    version: '4.9.5.2',
    changelogUrl: 'https://aioseo.com/changelog/',
    aiCredits: {
      used: 10000,
      total: 200000,
      includedInSubscription: 200000,
      paidCredits: 0,
      expiresAt: '2027-01-22',
    },
    addons: Object.values(allAddons),
  },
  {
    id: 'lic-blc-premium',
    product: 'broken-link-checker',
    productName: 'Broken Link Checker',
    tier: 'elite',
    tierLabel: 'Premium',
    licenseKey: 'ebce67b6d55de0e454ff1bb337fd',
    status: 'active',
    expiresAt: '2027-01-22',
    siteActivations: { used: 0, total: 5 },
    links: { remaining: 100, total: 50000 },
    downloadUrl: '#',
    version: '2.1.0',
    changelogUrl: 'https://aioseo.com/changelog/broken-link-checker',
    addons: [],
  },
]

export const aiCredits: AiCredits = {
  used: 10000,
  total: 200000,
  includedInSubscription: 200000,
  paidCredits: 0,
  expiresAt: '2027-01-22',
}

export const subscriptions: Subscription[] = [
  {
    id: 'sub-1',
    date: '2026-01-22',
    product: 'AIOSEO - Elite',
    status: 'active',
    renewsAt: '2027-01-22',
    actions: {
      changePlanUrl: '#',
      cancelUrl: '#',
      updatePaymentUrl: '#',
    },
  },
  {
    id: 'sub-2',
    date: '2026-01-22',
    product: 'Broken Link Checker - Starter',
    status: 'active',
    renewsAt: '2027-01-22',
    actions: {
      changePlanUrl: '#',
      cancelUrl: '#',
      updatePaymentUrl: '#',
    },
  },
]

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    brand: 'visa',
    last4: '1234',
    expiresAt: '06/2029',
    isDefault: true,
  },
]

export const orders: Order[] = [
  { id: 'ord-1', date: '2026-01-22', product: 'AIOSEO - Elite', amount: '$0.00', status: 'completed', invoiceUrl: '#' },
  { id: 'ord-2', date: '2026-01-22', product: 'AIOSEO - Elite', amount: '$0.00', status: 'refunded', invoiceUrl: '#' },
  { id: 'ord-3', date: '2026-01-22', product: 'AIOSEO - Elite', amount: '$0.00', status: 'refunded', invoiceUrl: '#' },
  { id: 'ord-4', date: '2026-01-22', product: 'AIOSEO - Elite', amount: '$0.00', status: 'refunded', invoiceUrl: '#' },
  { id: 'ord-5', date: '2026-01-22', product: 'AIOSEO - Elite', amount: '$0.00', status: 'refunded', invoiceUrl: '#' },
]

export const promoOffers: PromoOffer[] = [
  {
    id: 'promo-blc',
    productName: 'Broken Link Checker by AIOSEO',
    description: 'Find and fix broken links across your site. Start automatically, protect SEO, and keep customers from hitting dead ends.',
    iconUrl: '/assets/icons/product-blc.svg',
    ctaLabel: 'Claim Offer',
    ctaUrl: '#',
    iconBgColor: '#DF2A4A',
  },
  {
    id: 'promo-lowfruits',
    productName: 'LowFruits by AIOSEO',
    description: 'Uncover low-competition keywords your site can rank for, automate SEO opportunities and drive more traffic.',
    iconUrl: '/assets/icons/product-lowfruits.svg',
    ctaLabel: 'Claim Offer',
    ctaUrl: '#',
    iconBgColor: '#00AA63',
  },
  {
    id: 'promo-seoboost',
    productName: 'SEOBoost by AIOSEO',
    description: 'Optimize your content to rank higher. Get instant, data-driven content recommendations based on what performs in search.',
    iconUrl: '/assets/icons/product-seoboost.svg',
    ctaLabel: 'Claim Offer',
    ctaUrl: '#',
    iconBgColor: '#005AE0',
  },
]
```

- [ ] **Step 4: Create Basic profile data**

Create `src/data/profiles/basic.ts`:

```typescript
import type { User, License, Subscription, PaymentMethod, Order, AiCredits, UpgradeOffer } from '@/types'
import { allAddons } from '@/data/addons'

export const user: User = {
  id: '2',
  firstName: 'Arnaud',
  lastName: 'Broes',
  email: 'abroes@awesomemotive.com',
  avatarUrl: 'https://ui-avatars.com/api/?name=Arnaud+Broes&background=005AE0&color=fff&size=80',
  billingAddress: {
    line1: '',
    line2: '',
    city: '',
    zip: '',
    country: 'Canada',
    state: '',
  },
}

export const licenses: License[] = [
  {
    id: 'lic-aioseo-basic',
    product: 'aioseo',
    productName: 'AIOSEO',
    tier: 'basic',
    tierLabel: 'Basic',
    licenseKey: 'ebce67b6d55de0e454ff1bb337fd',
    status: 'active',
    expiresAt: '2026-11-19',
    siteActivations: { used: 0, total: 5 },
    downloadUrl: '#',
    version: '4.9.5.2',
    changelogUrl: 'https://aioseo.com/changelog/',
    aiCredits: {
      used: 10000,
      total: 200000,
      includedInSubscription: 200000,
      paidCredits: 0,
      expiresAt: '2026-11-19',
    },
    addons: [
      allAddons['image-seo'],
      allAddons['video-sitemap'],
      allAddons['local-business'],
      allAddons['news-sitemap'],
    ],
  },
]

export const aiCredits: AiCredits = {
  used: 10000,
  total: 200000,
  includedInSubscription: 200000,
  paidCredits: 0,
  expiresAt: '2026-11-19',
}

export const subscriptions: Subscription[] = [
  {
    id: 'sub-1',
    date: '2025-11-19',
    product: 'AIOSEO - Basic',
    status: 'active',
    renewsAt: '2026-11-19',
    actions: {
      changePlanUrl: '#',
      cancelUrl: '#',
      updatePaymentUrl: '#',
    },
  },
  {
    id: 'sub-2',
    date: '2025-11-25',
    product: 'Broken Link Checker - Starter',
    status: 'active',
    renewsAt: '2026-11-25',
    actions: {
      changePlanUrl: '#',
      cancelUrl: '#',
      updatePaymentUrl: '#',
    },
  },
]

export const paymentMethods: PaymentMethod[] = []

export const orders: Order[] = [
  { id: 'ord-1', date: '2025-11-19', product: 'AIOSEO - Basic', amount: '$49.00', status: 'completed', invoiceUrl: '#' },
]

export const upgradeOffer: UpgradeOffer = {
  id: 'upgrade-plus',
  title: 'Unlock Plus at 60% Off',
  subtitle: 'Save 60% When You Upgrade to a Plus License',
  originalPrice: '$199',
  currentPrice: '$79.60',
  valueLabel: '$199 value',
  badgeText: 'Limited Time Offer',
  ctaLabel: 'Upgrade & Save',
  ctaUrl: '#',
  ctaColor: 'green',
  expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  features: [
    { icon: 'check', label: 'Use on 3 Websites' },
    { icon: 'check', label: '25,000 AI Credits' },
    { icon: 'check', label: 'Dominate Local Search' },
    { icon: 'check', label: 'Appear on Google Maps' },
    { icon: 'check', label: 'Enhanced Local Listings' },
    { icon: 'check', label: 'Multi-Location SEO' },
    { icon: 'check', label: 'Full API Access' },
    { icon: 'check', label: 'Boost Trust (E-E-A-T)' },
    { icon: 'check', label: 'Rank in Google Images' },
    { icon: 'check', label: '15 SEO Revision Backups' },
  ],
}
```

- [ ] **Step 5: Create Pro profile data**

Create `src/data/profiles/pro.ts`:

```typescript
import type { User, License, Subscription, PaymentMethod, Order, AiCredits, UpgradeOffer } from '@/types'
import { allAddons } from '@/data/addons'

export const user: User = {
  id: '3',
  firstName: 'Arnaud',
  lastName: 'Broes',
  email: 'abroes@awesomemotive.com',
  avatarUrl: 'https://ui-avatars.com/api/?name=Arnaud+Broes&background=005AE0&color=fff&size=80',
  billingAddress: {
    line1: '456 Elm Ave',
    line2: 'Suite 200',
    city: 'Vancouver',
    zip: 'V6B 1A1',
    country: 'Canada',
    state: 'British Columbia',
  },
}

export const licenses: License[] = [
  {
    id: 'lic-aioseo-pro',
    product: 'aioseo',
    productName: 'AIOSEO',
    tier: 'pro',
    tierLabel: 'Pro',
    licenseKey: 'ebce67b6d55de0e454ff1bb337fd',
    status: 'active',
    expiresAt: '2027-01-22',
    siteActivations: { used: 3, total: 10 },
    downloadUrl: '#',
    version: '4.9.5.2',
    changelogUrl: 'https://aioseo.com/changelog/',
    aiCredits: {
      used: 25000,
      total: 50000,
      includedInSubscription: 50000,
      paidCredits: 0,
      expiresAt: '2027-01-22',
    },
    addons: [
      allAddons['image-seo'],
      allAddons['video-sitemap'],
      allAddons['local-business'],
      allAddons['news-sitemap'],
      allAddons['link-assistant'],
      allAddons['index-now'],
    ],
  },
  {
    id: 'lic-blc-starter',
    product: 'broken-link-checker',
    productName: 'Broken Link Checker',
    tier: 'basic',
    tierLabel: 'Starter',
    licenseKey: 'ebce67b6d55de0e454ff1bb337fd',
    status: 'active',
    expiresAt: '2027-01-22',
    siteActivations: { used: 1, total: 1 },
    links: { remaining: 4500, total: 5000 },
    downloadUrl: '#',
    version: '2.1.0',
    changelogUrl: 'https://aioseo.com/changelog/broken-link-checker',
    addons: [],
  },
]

export const aiCredits: AiCredits = {
  used: 25000,
  total: 50000,
  includedInSubscription: 50000,
  paidCredits: 0,
  expiresAt: '2027-01-22',
}

export const subscriptions: Subscription[] = [
  {
    id: 'sub-1',
    date: '2026-01-22',
    product: 'AIOSEO - Pro',
    status: 'active',
    renewsAt: '2027-01-22',
    actions: {
      changePlanUrl: '#',
      cancelUrl: '#',
      updatePaymentUrl: '#',
    },
  },
  {
    id: 'sub-2',
    date: '2026-01-22',
    product: 'Broken Link Checker - Starter',
    status: 'active',
    renewsAt: '2027-01-22',
    actions: {
      changePlanUrl: '#',
      cancelUrl: '#',
      updatePaymentUrl: '#',
    },
  },
]

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    brand: 'mastercard',
    last4: '4919',
    expiresAt: '12/2028',
    isDefault: true,
  },
]

export const orders: Order[] = [
  { id: 'ord-1', date: '2026-01-22', product: 'AIOSEO - Pro', amount: '$199.00', status: 'completed', invoiceUrl: '#' },
  { id: 'ord-2', date: '2026-01-22', product: 'Broken Link Checker - Starter', amount: '$5.00', status: 'completed', invoiceUrl: '#' },
]

export const upgradeOffer: UpgradeOffer = {
  id: 'upgrade-elite',
  title: 'Go Elite & Save 60%',
  subtitle: 'Go Pro Today & Save 60%',
  originalPrice: '$599',
  currentPrice: '$239.60',
  valueLabel: '$599 value',
  badgeText: 'Limited Time Offer',
  ctaLabel: 'Unlock My Discount',
  ctaUrl: '#',
  ctaColor: 'amber',
  expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  features: [
    { icon: 'check', label: 'Use on 100 Websites' },
    { icon: 'check', label: '200,000 AI Credits' },
    { icon: 'check', label: 'Monitor Indexing Status' },
    { icon: 'check', label: 'Detailed SEO Statistics' },
    { icon: 'check', label: 'Track Keyword Rankings' },
    { icon: 'check', label: 'Spot Content Decay' },
    { icon: 'check', label: 'WordPress Multisite-Ready' },
    { icon: 'check', label: 'Search Console Insights' },
    { icon: 'check', label: 'Advanced Network Tools' },
    { icon: 'check', label: 'Unlimited SEO Revisions' },
  ],
}
```

- [ ] **Step 6: Create announcements mock data**

Create `src/data/announcements.ts`:

```typescript
import type { Announcement } from '@/types'

export const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Optimize Faster with AIOSEO 4.6.6: New Support for Thrive Architect and SiteOrigin Page Builders',
    excerpt: 'Many of you asked, and we listened. That\'s why we\'re so excited to announce page builder integrations for 2 more page builders — Thrive Architect and SiteOrigin in AIOSEO 4.6.6. Yes! That\'s right...',
    imageUrl: 'https://aioseo.com/wp-content/uploads/2026/02/aioseo-4-9-4.png',
    url: 'https://aioseo.com/aioseo-4-6-6-release/',
  },
  {
    id: '2',
    title: 'AIOSEO Launches SEOBoost: Create Better Ranking Content',
    excerpt: 'I\'m thrilled to announce that All in One SEO has launched SEOBoost, a game-changing SEO and content optimization tool designed to help you create better-ranking content easily and consistently. While we all know...',
    imageUrl: 'https://aioseo.com/wp-content/uploads/2025/12/aioseo-491-ai-keyword-report.png',
    url: 'https://aioseo.com/seoboost-launch/',
  },
]
```

- [ ] **Step 7: Create help articles mock data**

Create `src/data/articles.ts`:

```typescript
export interface HelpArticle {
  title: string
  url: string
}

export const helpArticles: HelpArticle[] = [
  { title: 'How to Renew Your AIOSEO License', url: 'https://aioseo.com/docs/how-to-renew-your-aioseo-license/' },
  { title: 'Setting the SEO Title and Description for Your Content', url: 'https://aioseo.com/docs/setting-the-seo-title-and-description-for-your-content/' },
  { title: 'Installing All in One SEO Pro', url: 'https://aioseo.com/docs/installing-all-in-one-seo-pro/' },
  { title: 'How to Create an XML Sitemap', url: 'https://aioseo.com/docs/how-to-create-an-xml-sitemap/' },
  { title: 'Beginners Guide for All in One SEO', url: 'https://aioseo.com/docs/quick-start-guide/' },
  { title: 'Beginners Guide to Social Networks Settings for Facebook', url: 'https://aioseo.com/docs/social-networks-facebook/' },
]
```

- [ ] **Step 8: Create composables**

Create `src/composables/useMockProfile.ts`:

```typescript
import { computed } from 'vue'
import { useProfileStore } from '@/stores/profile'
import * as basicData from '@/data/profiles/basic'
import * as proData from '@/data/profiles/pro'
import * as eliteData from '@/data/profiles/elite'

const profiles = {
  basic: basicData,
  pro: proData,
  elite: eliteData,
} as const

export function useMockProfile() {
  const store = useProfileStore()

  const data = computed(() => profiles[store.activeProfile])

  return {
    activeProfile: computed(() => store.activeProfile),
    setProfile: store.setProfile,
    data,
  }
}
```

Create `src/composables/useAccount.ts`:

```typescript
import { computed } from 'vue'
import { useMockProfile } from './useMockProfile'
import type { User, QuickLink } from '@/types'

export function useAccount() {
  const { data } = useMockProfile()

  const user = computed<User>(() => data.value.user)

  const quickLinks: QuickLink[] = [
    { label: 'View Downloads', href: '/account/downloads' },
    { label: 'Edit Account Info', href: '/account/profile' },
    { label: 'Get Support', href: '/account/support' },
    { label: 'Edit Billing Info', href: '/account/billing' },
    { label: 'Become an Affiliate', href: 'https://aioseo.com/affiliates/' },
  ]

  return { user, quickLinks }
}
```

Create `src/composables/useLicenses.ts`:

```typescript
import { computed } from 'vue'
import { useMockProfile } from './useMockProfile'
import type { License, ProductType } from '@/types'

export function useLicenses() {
  const { data } = useMockProfile()

  const licenses = computed<License[]>(() => data.value.licenses)

  const licensesByProduct = computed(() => {
    const map: Partial<Record<ProductType, License[]>> = {}
    for (const lic of licenses.value) {
      if (!map[lic.product]) map[lic.product] = []
      map[lic.product]!.push(lic)
    }
    return map
  })

  const hasProduct = (product: ProductType) =>
    computed(() => licenses.value.some((l) => l.product === product))

  return { licenses, licensesByProduct, hasProduct }
}
```

Create `src/composables/useSubscriptions.ts`:

```typescript
import { computed } from 'vue'
import { useMockProfile } from './useMockProfile'
import type { Subscription, PaymentMethod, Order } from '@/types'

export function useSubscriptions() {
  const { data } = useMockProfile()

  const subscriptions = computed<Subscription[]>(() => data.value.subscriptions)
  const paymentMethods = computed<PaymentMethod[]>(() => data.value.paymentMethods)
  const orders = computed<Order[]>(() => data.value.orders)

  return { subscriptions, paymentMethods, orders }
}
```

Create `src/composables/useAiCredits.ts`:

```typescript
import { computed } from 'vue'
import { useMockProfile } from './useMockProfile'
import type { AiCredits } from '@/types'

export function useAiCredits() {
  const { data } = useMockProfile()

  const credits = computed<AiCredits>(() => data.value.aiCredits)

  const percentUsed = computed(() =>
    Math.round((credits.value.used / credits.value.total) * 100)
  )

  const remaining = computed(() => credits.value.total - credits.value.used)

  return { credits, percentUsed, remaining }
}
```

Create `src/composables/useOffers.ts`:

```typescript
import { computed } from 'vue'
import { useMockProfile } from './useMockProfile'
import type { UpgradeOffer, PromoOffer } from '@/types'

export function useOffers() {
  const { data, activeProfile } = useMockProfile()

  const upgradeOffer = computed<UpgradeOffer | null>(() =>
    'upgradeOffer' in data.value ? (data.value as any).upgradeOffer : null
  )

  const promoOffers = computed<PromoOffer[]>(() =>
    'promoOffers' in data.value ? (data.value as any).promoOffers : []
  )

  const showUpgrade = computed(() => activeProfile.value !== 'elite')
  const showPromos = computed(() => activeProfile.value === 'elite')

  return { upgradeOffer, promoOffers, showUpgrade, showPromos }
}
```

Create `src/composables/useAnnouncements.ts`:

```typescript
import { announcements } from '@/data/announcements'
import type { Announcement } from '@/types'

export function useAnnouncements() {
  const items: Announcement[] = announcements
  return { announcements: items }
}
```

Create `src/composables/useHelpArticles.ts`:

```typescript
import { helpArticles, type HelpArticle } from '@/data/articles'

export function useHelpArticles() {
  const articles: HelpArticle[] = helpArticles
  return { articles }
}
```

- [ ] **Step 9: Verify everything compiles**

```bash
npx vue-tsc --noEmit
```

Expected: No errors.

- [ ] **Step 10: Commit**

```bash
git add src/stores/ src/data/ src/composables/
git commit -m "feat: add mock data profiles and composables for all data models"
```

---

## Task 4: Router Configuration

**Files:**
- Modify: `src/router/index.ts`

- [ ] **Step 1: Create full route configuration**

Replace `src/router/index.ts`:

```typescript
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
```

- [ ] **Step 2: Create placeholder views so the router resolves**

Create each view file with a minimal template. Example for `src/views/OverviewView.vue`:

```vue
<script setup lang="ts">
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold font-heading">Overview</h2>
    <p class="text-text-muted mt-2">Overview content goes here.</p>
  </div>
</template>
```

Repeat for all 10 view files:
- `src/views/OverviewView.vue`
- `src/views/DownloadsView.vue`
- `src/views/DownloadsAioseoView.vue`
- `src/views/DownloadsAiCreditsView.vue`
- `src/views/DownloadsBLCView.vue`
- `src/views/BillingView.vue`
- `src/views/SupportView.vue`
- `src/views/ServicesView.vue`
- `src/views/ProfileView.vue`
- `src/views/SuggestFeatureView.vue`
- `src/views/GiveawayView.vue`

For `DownloadsView.vue` specifically, include a `<router-view />`:

```vue
<script setup lang="ts">
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold font-heading">Downloads</h2>
    <router-view />
  </div>
</template>
```

- [ ] **Step 3: Create placeholder AppLayout.vue**

Create `src/layout/AppLayout.vue`:

```vue
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-bg-primary">
    <main class="max-w-[1100px] mx-auto px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>
```

- [ ] **Step 4: Verify routing works**

```bash
npm run dev
```

Navigate to `http://localhost:5173/account/overview`, `/account/downloads`, `/account/billing`, etc. Each should show the placeholder heading. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/router/ src/views/ src/layout/
git commit -m "feat: add Vue Router with all routes and placeholder views"
```

---

## Task 5: Layout Shell — Header, Tab Navigation, CTA Banner, Footer

**Files:**
- Create: `src/layout/SiteHeader.vue`, `src/layout/TabNavigation.vue`, `src/layout/UserMenu.vue`, `src/layout/CtaBanner.vue`, `src/layout/SiteFooter.vue`
- Modify: `src/layout/AppLayout.vue`

This is the most design-intensive task. Use the Figma designs as reference. Apply `/frontend-design`, `/polish`, and `/delight` skills when implementing these components.

- [ ] **Step 1: Build SiteHeader.vue**

Create `src/layout/SiteHeader.vue`. This is a simplified static header matching the Figma design:
- AIOSEO logo (left)
- Nav links: Features, Pricing, Testimonials, Resources, My Account (right)
- Dark navy background (`bg-brand-navy`)
- White text
- Logo links to `https://aioseo.com`
- All nav links are external `<a>` tags to aioseo.com
- "My Account" is highlighted (current section)

- [ ] **Step 2: Build UserMenu.vue**

Create `src/layout/UserMenu.vue`:
- Shows user avatar + name from `useAccount()`
- Dropdown with "Log Out" action
- Positioned in the header, right side
- Uses `useAccount()` composable for user data

- [ ] **Step 3: Build TabNavigation.vue**

Create `src/layout/TabNavigation.vue`:
- Primary tabs: Overview, Downloads, Billing, Support (always visible)
- "More" dropdown: Services, Profile, Suggest a Feature, Giveaway
- Active tab has blue underline and blue text (`text-brand-blue`, `border-brand-blue`)
- Inactive tabs are `text-brand-navy-60`
- Uses `<router-link>` for each tab
- "More" dropdown opens on click, closes on click outside
- Active state works for items inside "More" too (the "More" label shows active style when any child route is active)

- [ ] **Step 4: Build CtaBanner.vue**

Create `src/layout/CtaBanner.vue`:
- "Get the #1 Most Powerful WordPress SEO Plugin Today"
- Subtitle text
- Green CTA button "Get All in One SEO Now"
- "(Instant Download)" text below button
- Light blue/gray background with decorative elements
- Centered layout

- [ ] **Step 5: Build SiteFooter.vue**

Create `src/layout/SiteFooter.vue`:
- 5-column footer: Company, Features (2 columns), Our Brands, Helpful Links
- Social icons (Twitter/X, Facebook, YouTube)
- Copyright bar at bottom
- Badge images (Norton, PayPal, WPBeginner)
- Legal links (Terms, Privacy, FTC, Sitemap, Coupon)
- All links are external `<a>` tags

- [ ] **Step 6: Wire everything into AppLayout.vue**

Update `src/layout/AppLayout.vue`:

```vue
<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteHeader from './SiteHeader.vue'
import TabNavigation from './TabNavigation.vue'
import CtaBanner from './CtaBanner.vue'
import SiteFooter from './SiteFooter.vue'
import ProfileSwitcher from '@/components/ProfileSwitcher.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg-primary">
    <SiteHeader />

    <div class="bg-brand-navy text-white text-center py-10">
      <h1 class="text-display-sm font-heading font-semibold">Welcome to Your AIOSEO Account</h1>
      <p class="text-brand-navy-40 mt-2">Improve Your Website Search Rankings</p>
    </div>

    <div class="max-w-[1100px] w-full mx-auto px-6">
      <TabNavigation />
      <main class="py-8">
        <RouterView />
      </main>
    </div>

    <CtaBanner />
    <SiteFooter />
    <ProfileSwitcher />
  </div>
</template>
```

- [ ] **Step 7: Build ProfileSwitcher.vue**

Create `src/components/ProfileSwitcher.vue`:
- Fixed to bottom-right corner
- Three buttons: Basic, Pro, Elite
- Active profile is highlighted
- Semi-transparent dark background
- Small, unobtrusive dev tool
- Uses `useMockProfile()` composable

- [ ] **Step 8: Verify the full shell renders**

```bash
npm run dev
```

Navigate to `/account/overview`. You should see: header, welcome banner, tab navigation, placeholder content, CTA banner, footer, and the profile switcher in the bottom-right. Clicking tabs should navigate between views. The "More" dropdown should open/close.

- [ ] **Step 9: Commit**

```bash
git add src/layout/ src/components/ProfileSwitcher.vue
git commit -m "feat: add layout shell with header, tabs, CTA banner, footer, profile switcher"
```

---

## Task 6: Shared Components

**Files:**
- Create: `src/components/StatusBadge.vue`, `src/components/IframeEmbed.vue`, `src/components/CountdownTimer.vue`, `src/components/LicenseCard.vue`, `src/components/AddonCard.vue`, `src/components/UpgradeOfferCard.vue`, `src/components/PromoOfferCard.vue`, `src/components/AnnouncementCard.vue`, `src/components/SubscriptionRow.vue`, `src/components/PaymentMethodCard.vue`, `src/components/OrderRow.vue`, `src/components/HelpSearchSection.vue`, `src/components/QuickLinks.vue`

Each component should be built referencing the Figma designs. Use `/frontend-design` and `/polish` skills.

- [ ] **Step 1: StatusBadge.vue**

Props: `status: 'active' | 'expired' | 'cancelled'`. Renders a colored pill badge. Active = green bg with white text, Expired = red, Cancelled = gray.

- [ ] **Step 2: IframeEmbed.vue**

Props: `src: string`, `title: string`, `height?: string`, `placeholder?: string`. When `src` is `'#'` or empty, shows a styled placeholder card with the `placeholder` text. Otherwise renders an `<iframe>` with the given src.

- [ ] **Step 3: CountdownTimer.vue**

Props: `expiresAt: string` (ISO date). Displays a live countdown in format "47H 56M 49S" using `setInterval`. Shows "Expired" when countdown reaches zero. Yellow/amber badge styling.

- [ ] **Step 4: LicenseCard.vue**

Props: `license: License`. Displays: product icon, product name + tier, "Upgrade License" button (if not elite), "Download" button, license key with copy icon, renewal date + status badge, site activations + "Manage Sites" link, AI credits (if applicable), addon grid below. This is a complex component — reference Figma node `2210:2137` for exact layout.

- [ ] **Step 5: AddonCard.vue**

Props: `addon: Addon`. Compact card with colored icon, name, download link, help link. Used in a grid layout (4 columns). Reference the addon grid in the Figma Downloads tab.

- [ ] **Step 6: UpgradeOfferCard.vue**

Props: `offer: UpgradeOffer`. Shows title, countdown timer, price, feature grid (2 columns of check items), CTA button. Uses `CountdownTimer` component. Border color varies by tier (green for Plus, blue for Pro, amber for Elite). Reference Figma node `2212:1453`.

- [ ] **Step 7: PromoOfferCard.vue**

Props: `offer: PromoOffer`. Product promo card with icon, product name, description, "Claim Offer" button. Used in a vertical stack on the Overview sidebar. Reference Figma node `2210:694` right column.

- [ ] **Step 8: AnnouncementCard.vue**

Props: `announcement: Announcement`. Blog post card with image, title, excerpt. Image fills top of card, title is a link, excerpt below. Two-column layout in the Announcements section.

- [ ] **Step 9: SubscriptionRow.vue**

Props: `subscription: Subscription`. Table row with: date, product name, status (with StatusBadge), renewal date, action links (Change Plan Level, Cancel, Update Payment Method).

- [ ] **Step 10: PaymentMethodCard.vue**

Props: `method: PaymentMethod`. Shows card brand icon (Visa/MC), last 4 digits, expiry, "Delete" button, "Make Default" button (if not default). Reference Figma Billing design.

- [ ] **Step 11: OrderRow.vue**

Props: `order: Order`. Table row with: date, product, amount, status, "Generate Invoice" link.

- [ ] **Step 12: HelpSearchSection.vue**

Static search input (non-functional) + 6 help article links in 2-column grid. Uses `useHelpArticles()` composable.

- [ ] **Step 13: QuickLinks.vue**

Props: `links: QuickLink[]`. Grid of links: "View Downloads", "Edit Account Info", etc. Uses `<router-link>` for internal links, `<a>` for external. Blue text with hover underline.

- [ ] **Step 14: Verify all components compile**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 15: Commit**

```bash
git add src/components/
git commit -m "feat: add all shared UI components"
```

---

## Task 7: Overview View

**Files:**
- Modify: `src/views/OverviewView.vue`

Reference Figma nodes `2210:694` (elite/promo) and `2210:1377` (basic/upgrade).

- [ ] **Step 1: Build OverviewView.vue**

The Overview has a two-column layout on desktop:

**Left column:**
- User avatar + name + email (with edit icon)
- Quick Links section (QuickLinks component)
- Subscriptions summary (product + status badge + expiry)
- "Manage Subscriptions" link
- AI Credits section (total, breakdown, "Add More Credits" link)

**Right column (profile-dependent):**
- Elite profile: Stack of PromoOfferCards (BLC, LowFruits, SEOBoost)
- Basic/Pro profile: UpgradeOfferCard with countdown

**Below (full width):**
- Announcements section heading
- Two AnnouncementCards in a 2-column grid
- HelpSearchSection

Uses composables: `useAccount()`, `useLicenses()`, `useSubscriptions()`, `useAiCredits()`, `useOffers()`, `useAnnouncements()`

- [ ] **Step 2: Verify with all three profiles**

Switch between basic/pro/elite using the ProfileSwitcher. Verify:
- Basic: shows upgrade-to-Plus card
- Pro: shows upgrade-to-Elite card
- Elite: shows product promo cards

- [ ] **Step 3: Commit**

```bash
git add src/views/OverviewView.vue
git commit -m "feat: build Overview view with profile-aware offers"
```

---

## Task 8: Downloads View with Sub-tabs

**Files:**
- Modify: `src/views/DownloadsView.vue`, `src/views/DownloadsAioseoView.vue`, `src/views/DownloadsAiCreditsView.vue`, `src/views/DownloadsBLCView.vue`

Reference Figma node `2210:2137`.

- [ ] **Step 1: Build DownloadsView.vue (parent)**

Sub-tab navigation with pill/toggle style buttons: AIOSEO, AI Credits, Broken Link Checker. Uses `<router-link>` for each sub-tab. Active sub-tab has filled blue background. Below the sub-tabs, renders `<router-view />` for the active child route.

Also includes "See Upgrade Options" expandable link at the bottom that reveals the three-tier upgrade card comparison.

- [ ] **Step 2: Build DownloadsAioseoView.vue**

Shows all AIOSEO licenses for the current profile. For each license, renders a `LicenseCard`. Below the license card, shows the AIOSEO Addons grid using `AddonCard` components (4 columns).

- [ ] **Step 3: Build DownloadsAiCreditsView.vue**

Shows the AI Credits card: credits icon, "AI Credits" heading, remaining/total display, expiry date, "Purchase Credits" button. Simpler than the license card.

- [ ] **Step 4: Build DownloadsBLCView.vue**

Shows BLC license cards (if user has BLC). Uses `LicenseCard` component. If no BLC license exists for the profile, show an upsell card prompting to get BLC.

- [ ] **Step 5: Verify with profile switcher**

- Elite: All three sub-tabs populated with data
- Basic: AIOSEO tab has Basic license, BLC tab shows upsell
- Pro: AIOSEO tab has Pro license, BLC tab has Starter license

- [ ] **Step 6: Commit**

```bash
git add src/views/Downloads*.vue
git commit -m "feat: build Downloads view with product sub-tabs"
```

---

## Task 9: Billing View

**Files:**
- Modify: `src/views/BillingView.vue`

Reference Figma node `2210:2763`.

- [ ] **Step 1: Build BillingView.vue**

Three sections:

**Auto-Renewal Subscriptions:**
- Table with columns: Date, Product, Status, Actions
- Each row uses `SubscriptionRow` component
- Status shows renewal date + StatusBadge
- Actions: "Change Plan Level", "Cancel", "Update Payment Method" links

**Saved Payment Methods:**
- "Add Payment Method" button (top right)
- List of `PaymentMethodCard` components
- Shows card brand icon, last 4, expiry
- "Delete" and "Make Default" buttons per card

**Past Orders:**
- Table with columns: Date, Product, Amount, Status, Actions
- Each row uses `OrderRow` component
- "Generate Invoice" link per row

- [ ] **Step 2: Verify with profiles**

All profiles should show subscriptions and orders. Elite has a saved payment method; Basic has none (shows empty state).

- [ ] **Step 3: Commit**

```bash
git add src/views/BillingView.vue
git commit -m "feat: build Billing view with subscriptions, payments, orders"
```

---

## Task 10: Support View

**Files:**
- Modify: `src/views/SupportView.vue`

Reference Figma nodes `2210:3822` (chat) and `2210:4280` (form).

- [ ] **Step 1: Build SupportView.vue**

Two-column layout:

**Left column (toggleable):**
- Default state: AI chat iframe embed (DeskBot) with `IframeEmbed` component, placeholder showing "AI Support Chat — Powered by DeskBot"
- Form state: Contact form iframe embed with `IframeEmbed` component, placeholder showing "WPForms Support Contact Form"
- Toggle link at the bottom: "Prefer to submit a ticket?" / "Try our AI assistant instead"

**Right column (always visible):**
- Team avatar group (3 circular images)
- "We're here to help!" heading
- Support hours text: "Monday to Friday, 9am-5pm Eastern Time"
- Links to troubleshooting guide and documentation
- "Create a support ticket" link (switches left column to form state)

Subtitle in the hero banner changes to "Get help, manage your support, and find answers faster." when on the Support tab — this requires the `AppLayout` to be aware of the current route, or the Support view to override the subtitle.

- [ ] **Step 2: Verify toggle works**

Click between chat and form states. Verify both iframe placeholders render correctly.

- [ ] **Step 3: Commit**

```bash
git add src/views/SupportView.vue
git commit -m "feat: build Support view with chat/form toggle"
```

---

## Task 11: Services View (Adapted from Live Site)

**Files:**
- Modify: `src/views/ServicesView.vue`
- Create: `src/components/ServicePricingCard.vue`

- [ ] **Step 1: Build ServicePricingCard.vue**

Props: `title: string`, `originalPrice: string`, `currentPrice: string`, `timeSaved: string`, `features: string[]`, `includes: string`, `cartUrl: string`, `siteOptions: string[]`

Card with: heading, strikethrough original price, large current price, time saved badge, "Includes:" section, site count dropdown, feature checklist, "See Terms and Conditions" link, "Add to Cart" button.

- [ ] **Step 2: Build ServicesView.vue**

Heading: "Fast-Track Your Way to Higher Rankings"
Subtitle text about expert installation.
Two `ServicePricingCard` components side by side:
- Essential ($49.50, saves 1 hour)
- Advanced ($124.50, saves 4+ hours)

Styled to match the new design language (card shadows, brand colors, proper spacing).

- [ ] **Step 3: Commit**

```bash
git add src/views/ServicesView.vue src/components/ServicePricingCard.vue
git commit -m "feat: build Services view with pricing cards"
```

---

## Task 12: Profile View (Adapted from Live Site)

**Files:**
- Modify: `src/views/ProfileView.vue`

- [ ] **Step 1: Build ProfileView.vue**

Form with sections:

**Personal Information:**
- First name + Last name (side by side)
- Primary Email Address

**Billing Address:**
- Line 1, Line 2
- City + Zip/Postal Code (side by side)
- Country dropdown + State/Province dropdown (side by side)

**Change Password:**
- New Password
- Confirm New Password

**Save Changes button** (blue, bottom)

All inputs use consistent styling: border-gray-200, rounded-lg, focus:ring-brand-blue. Labels are font-semibold text-sm. Required fields marked with red asterisk. Form is non-functional (no submit handler) — devs add that.

Pre-filled with data from `useAccount()` composable.

- [ ] **Step 2: Commit**

```bash
git add src/views/ProfileView.vue
git commit -m "feat: build Profile view with form layout"
```

---

## Task 13: Suggest a Feature & Giveaway Views (Iframe Embeds)

**Files:**
- Modify: `src/views/SuggestFeatureView.vue`, `src/views/GiveawayView.vue`

- [ ] **Step 1: Build SuggestFeatureView.vue**

Single `IframeEmbed` component with placeholder text: "WPForms — Suggest a Feature Form". Full width, generous height (600px). Brief intro text above: "We'd love to hear your feedback! Use the form below to suggest a feature."

- [ ] **Step 2: Build GiveawayView.vue**

Heading: "Monthly Giveaway"
Subtitle with "See past winners" link.
`IframeEmbed` component with placeholder: "RafflePress — Monthly Giveaway Widget". Full width, generous height (800px).

Below the embed, a "Past Winners" section with a simple list (mock data hardcoded inline — 4-5 entries with month, prize, winner name, country).

- [ ] **Step 3: Commit**

```bash
git add src/views/SuggestFeatureView.vue src/views/GiveawayView.vue
git commit -m "feat: build Suggest a Feature and Giveaway views with iframe embeds"
```

---

## Task 14: Extract Product Icons from Figma

**Files:**
- Create: `public/assets/icons/` (multiple SVG files)

- [ ] **Step 1: Extract addon icons**

Using the Figma MCP, extract SVG icons for each addon and product from the Figma file. Save them as individual SVG files:
- `addon-image-seo.svg`
- `addon-video-sitemap.svg`
- `addon-local-business.svg`
- `addon-news-sitemap.svg`
- `addon-link-assistant.svg`
- `addon-index-now.svg`
- `addon-rest-api.svg`
- `addon-eeat.svg`
- `product-blc.svg`
- `product-lowfruits.svg`
- `product-seoboost.svg`
- `product-aioseo.svg`
- `product-ai-credits.svg`

If icons cannot be extracted from Figma, create simple colored circle placeholders with the first letter of each product name — these can be swapped for real assets later.

- [ ] **Step 2: Verify icons render in components**

Check that `AddonCard` and `PromoOfferCard` components load and display the icons correctly.

- [ ] **Step 3: Commit**

```bash
git add public/assets/
git commit -m "feat: add product and addon icons"
```

---

## Task 15: Polish Pass — Apply Design Skills

**Files:**
- Modify: Multiple component and view files

This task applies the `/frontend-design`, `/polish`, and `/delight` skills across the entire prototype.

- [ ] **Step 1: Run /frontend-design audit**

Review all views and components for design quality. Fix any generic AI aesthetics, ensure distinctive, production-grade styling.

- [ ] **Step 2: Run /polish pass**

Check alignment, spacing consistency, micro-detail issues. Ensure card shadows are consistent, border radii match, hover states feel intentional.

- [ ] **Step 3: Run /delight pass**

Add tasteful micro-interactions:
- Tab transitions (content fade)
- Button hover states (subtle scale/shadow)
- Card hover states on addon/announcement cards
- Smooth dropdown open/close for "More" menu and user menu
- Copy-to-clipboard feedback on license key

- [ ] **Step 4: Verify responsive behavior**

Check all views at:
- Desktop (1200px+)
- Tablet (768-1199px)
- Mobile (< 768px)

Ensure tab navigation collapses gracefully, grids stack on mobile, and nothing overflows.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: design polish and micro-interactions"
```

---

## Task 16: Final Verification

- [ ] **Step 1: Full navigation test**

Click through every tab and sub-tab. Verify:
- All routes resolve without errors
- Active tab highlighting works on all tabs including "More" dropdown items
- Profile switcher changes data across all views
- No console errors

- [ ] **Step 2: Profile switcher test**

Switch through basic → pro → elite on each view. Verify data updates reactively:
- Overview: offers change
- Downloads: licenses/addons change
- Billing: subscriptions/orders change

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: Clean build, no warnings or errors. Output in `dist/`.

- [ ] **Step 4: Preview production build**

```bash
npm run preview
```

Navigate through the app in preview mode. Verify it works identically to dev mode.

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete AIOSEO account prototype — all views built"
```

---

## Execution Notes

- **Figma reference file:** `https://www.figma.com/design/fjIJKtHQjHUW5RmEKsi5Yb/AIOSEO---Account-Area-Revamp?node-id=2210-693`
- **Use Figma MCP tools** (`get_design_context`, `get_screenshot`) when building each view to match the design exactly
- **Apply design skills** (`/frontend-design`, `/polish`, `/delight`) during Tasks 5, 6, 7, 8, 9, 10, and especially Task 15
- **Don't skimp on design quality** — this is a showcase prototype, not an MVP. Take time to get spacing, shadows, typography, and hover states right.
- **Proxima Nova font** — If Typekit/Adobe Fonts kit ID is not available, use Inter for everything and leave a TODO comment noting that Proxima Nova should be loaded in production
