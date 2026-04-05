# aioseo-account

Standalone design prototype of the AIOSEO customer account portal. All-mock, no API integration. Purpose: prove out UX and visual design at pixel-fidelity against the live AIOSEO account site. A future dev will wire this up to a real backend — until then, treat all data as mock.

## Stack

Vue 3 (`<script setup lang="ts">`) · Vite 8 · TypeScript · Tailwind v4 (`@theme` tokens) · Pinia · vue-router · `vite-svg-loader`

**Uses `npm`** (not bun — matches `aioseo-backlink-tracker`, differs from the main `aioseo` monorepo). Node `^20.19.0 || >=22.12.0`.

## Commands

```sh
npm install
npm run dev          # Vite dev server, hot reload
npm run build        # parallel type-check + prod build
npm run type-check   # vue-tsc --build
npm run preview      # preview prod build
```

Served under base path `/account/` (see `vite.config.ts`).

## Routes

| Path | View |
|---|---|
| `/overview` (default) | `OverviewView.vue` |
| `/downloads` | `DownloadsView.vue` (+ `DownloadsAioseoView`, `DownloadsAiCreditsView`, `DownloadsBLCView` sub-tabs) |
| `/services` | `ServicesView.vue` |
| `/billing` | `BillingView.vue` |
| `/profile` | `ProfileView.vue` |
| `/support` | `SupportView.vue` |
| `/suggest-a-feature` | `SuggestFeatureView.vue` |
| `/giveaway` | `GiveawayView.vue` |

## Directory map

```
src/
  main.ts, App.vue         entry + root
  router/index.ts          9 routes under AppLayout
  layout/                  page chrome (AppLayout, SiteHeader/Footer, TabNavigation, CtaBanner, UserMenu)
  views/                   one file per route (Overview, Downloads[+AIOSEO/AiCredits/BLC], Services, Billing, Profile, Support, SuggestFeature, Giveaway)
  components/              reusable cards/rows/badges (LicenseCard, SubscriptionRow, StatusBadge, ProfileSwitcher, ...)
  composables/             data accessors — views call these, never import src/data/ directly
  stores/profile.ts        Pinia store holding the active profile key
  data/profiles/           basic.ts, pro.ts, elite.ts — mock data per tier
  data/                    shared mock data (addons, announcements, articles, giveaway)
  types/                   TS interfaces per domain (user, license, subscription, announcement, offer)
  assets/main.css          @theme tokens (colors, fonts, radii, shadows) — SOURCE OF TRUTH
  assets/icons/            addon SVGs (imported via vite-svg-loader)
docs/
  exact-css-reference.md, live-site-reference.md, downloads-snapshot.txt, figma-overview-reference.json
  superpowers/plans/       implementation plans live here
  superpowers/specs/       specs live here
```

## Mock data & profile tiers

Every view is rendered against one of three mock profiles: **basic**, **pro**, **elite**. Switched at runtime via the `?profile=` URL param (e.g. `http://localhost:5173/account/overview?profile=basic`) or the floating `ProfileSwitcher` widget. State lives in Pinia (`src/stores/profile.ts`).

**Composable pattern** — every data accessor wraps `useMockProfile()`:

```ts
// src/composables/useLicenses.ts
import { computed } from 'vue'
import { useMockProfile } from './useMockProfile'

export function useLicenses() {
	const { data } = useMockProfile()
	const licenses = computed(() => data.value.licenses)
	return { licenses }
}
```

**Rules:**
- Views **must** read data through a composable (`useMockProfile`, `useLicenses`, `useSubscriptions`, `useOffers`, `useAccount`, etc.). Never import from `src/data/` directly inside a view.
- When adding a new data field, add it to **all three** profile files (`basic.ts`, `pro.ts`, `elite.ts`) and the matching type in `src/types/`.
- Default profile is `elite` (set in `stores/profile.ts`).

## Design fidelity

This project mirrors the live AIOSEO account portal. Pixel-match discipline applies.

- **Before building or modifying a view**, consult `docs/exact-css-reference.md` and `docs/live-site-reference.md`.
- `docs/` snapshots are the canonical reference — do not hit live URLs unless explicitly asked.
- Tokens in `src/assets/main.css` (`@theme` block) are the source of truth. Never hardcode colors, radii, font sizes, or shadows — use the Tailwind classes that map to these tokens (`text-brand-navy`, `bg-brand-blue-10`, `rounded-card`, `shadow-card`, etc.).
- Fonts: Proxima Nova (Regular 400 / Semibold 600 / Bold 700), preloaded from `/public/fonts/`.
- When capturing new reference material (CSS, SVG, screenshots), save it under `docs/` so future agents have it.

## Conventions

- `<script setup lang="ts">` in every SFC.
- **Tabs for indentation** everywhere (including `.ts` files — see `stores/profile.ts`).
- Tailwind utility classes in templates. Global CSS only when a utility can't express it. No `scoped` styles.
- New data shape → add type in `src/types/` → add to all 3 profiles → expose via a composable.
- New view → call composables; never `import` from `src/data/` directly.
- UI bit used in 2+ places → promote to `src/components/`. Page chrome → `src/layout/`.

## Planning & specs

Use the superpowers workflow (brainstorming → writing-plans → executing-plans) for non-trivial work. Plans go in `docs/superpowers/plans/`, specs in `docs/superpowers/specs/`. Don't scatter planning docs in the repo root.

## When to update this file

Update CLAUDE.md **only** when a change would make this file wrong or incomplete. Specifically:

- A route/view is added or removed
- A new top-level directory or architectural pattern is introduced
- A new composable that other agents should reuse
- A new required reference doc under `docs/`
- A convention changes (indentation, data flow, profile system, etc.)
- A build/run command changes

Do **not** update for: cosmetic tweaks, bug fixes, mock data adjustments, one-off component edits, or changelog-style entries. Keep entries terse and factual — git history is the changelog.
