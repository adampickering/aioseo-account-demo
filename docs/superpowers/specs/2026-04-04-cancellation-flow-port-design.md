# Cancellation Flow Port — Design Spec

**Date:** 2026-04-04
**Status:** Approved for implementation
**Source prototype:** `~/dev/aioseo-cancellation-flow/` (Vue 3 + JS, standalone)
**Target:** `~/dev/aioseo-account/` (Vue 3 + TS + Vue Router + Pinia + Tailwind v4)

## Goal

Merge the standalone cancellation-flow prototype into the `aioseo-account` app as native TypeScript + Vue Router + Pinia code — one codebase, one design system, one deployment — while preserving the prototype's logic, copy, and takeover UX.

## Scope

In scope:
- Port all 8 step/bypass views from the prototype into `src/views/cancel/`
- Port 4 flow-specific components (`PlanSidebar`, `OfferCard`, `CrossPromoCard`, `SupportBanner`) into `src/components/cancel/`
- Port 4 data modules (reasons, loss items, competitors, mock user) into `src/data/` as TypeScript
- Create `src/types/cancellation.ts` with `Reason`, `FollowUp` union, `SaveOfferVariant`, `PlanTier`, `LossItem`, `Competitor`
- Create `src/stores/cancellation.ts` Pinia store replacing the prototype's provide/inject
- Create `CancelLayout.vue` and `CancelProgressBar.vue` to provide full-screen takeover chrome
- Add 9 nested routes under `/cancel/*` with navigation guards
- Reconcile CSS: drop ~365 lines of duplicated tokens/utilities; add ~220 lines of flow-specific styles to `src/assets/main.css`
- Wire entry point from Billing's Manage Subscription modal → `/cancel/support`
- Wire exits: Keep My Plan → `/billing`, Contact Support → `/support`, etc.

Out of scope:
- Reworking the prototype's UX, copy, or branching logic (port verbatim)
- Wiring mock user data into the real `useSubscriptions` composable (deferred — port `cancellationMockUser.ts` standalone with a TODO)
- Any backend integration
- Deleting the standalone prototype repo (keep as reference during migration)

## Architecture

### Routing

Add a second top-level layout branch in `src/router/index.ts`. The cancellation flow renders **outside** `AppLayout`, replacing the account shell (sidebar, header, tabs, footer) with its own chrome. This preserves the prototype's intentional focused-decision UX.

```
router.routes
├── '/' → AppLayout
│    └── overview, downloads, services, billing, profile, support, ...
└── '/cancel' → CancelLayout
     ├── ''                          → redirect to 'support'
     ├── 'support'                   → Step1Support
     ├── 'reason'                    → Step2Reasons
     ├── 'offer'                     → Step3SaveOffer
     ├── 'offer/not-using'           → Step3VariantG
     ├── 'review'                    → Step4LossSummary
     ├── 'confirmation'              → Step5Confirmation
     ├── 'duplicate-subscription'    → BypassSupport
     └── 'change-plan'               → BypassPlanMgmt
```

**Navigation guards** (per-route `beforeEnter`): routes `offer`, `offer/not-using`, `review`, `confirmation` redirect to `/cancel/reason` if `cancellationStore.selectedReason` is null. Prevents broken deep links.

### Layout

`CancelLayout.vue` owns the takeover chrome:
- Logo-only header (no nav)
- Centered 1110px container
- "Back" link + "Step N of 5" indicator + progress bar row (hidden on bypass routes)
- Footer with copyright + Terms/Privacy/Support links

The layout computes `currentStepNumber` from the active route name (`support`→1, `reason`→2, `offer`/`offer/not-using`/`duplicate-subscription`/`change-plan`→3, `review`→4, `confirmation`→5).

Bypass routes (`duplicate-subscription`, `change-plan`) show the Back link (returns to `/cancel/reason`) but no progress bar.

### State

`src/stores/cancellation.ts` — Pinia store. Replaces the prototype's 7 `provide`/`inject` values.

**State:**
- `selectedReason: Reason | null`
- `followUpValue: string`

**Getters:**
- `currentStepNumber` — derived from current route (via injected `useRoute()`)
- `canGoBack` — true on steps 2–4 and bypass routes

**Actions:**
- `selectReason(reason: Reason, followUp: string)` — sets state + routes to the correct next step based on `reason.variant`:
  - `'bypass-support'` → `/cancel/duplicate-subscription`
  - `'bypass-plan'` → `/cancel/change-plan`
  - `'G'` → `/cancel/offer/not-using`
  - any other → `/cancel/offer`
- `skipOffer()` → `/cancel/review`
- `confirmCancel()` → `/cancel/confirmation`
- `keepPlan()` → `/billing` + `reset()`
- `goBack()` — route-aware. From `review`: back to `offer/not-using` if `selectedReason.variant === 'G'`, else `offer`. From `offer`/`offer/not-using`/bypasses: back to `reason`. From `reason`: back to `support`.
- `reset()` — clears `selectedReason` and `followUpValue`

### Data model (TypeScript)

```ts
// src/types/cancellation.ts
export type SaveOfferVariant =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'
  | 'bypass-support' | 'bypass-plan'

export type PlanTier = 'basic' | 'plus' | 'pro' | 'elite'

export type FollowUp =
  | { type: 'text'; placeholder: string }
  | {
      type: 'dropdown'
      placeholder: string
      required?: boolean
      options: string[]
      otherTextField?: boolean
    }

export interface Reason {
  id: number
  label: string
  followUp: FollowUp | null
  variant: SaveOfferVariant
}

export interface LossItem {
  title: string
  body: string
}

export interface CompetitorAdvantage {
  feature: string
  detail: string
}

export interface Competitor {
  advantages: CompetitorAdvantage[]
}

export interface CancellationMockUser {
  firstName: string
  planName: string
  planKey: PlanTier
  renewalDate: string
  purchaseDate: string
  tenure: string
  sites: string
  aiCredits: number
  annualPrice: number
  savings: string
}
```

### File structure

```
src/
├── views/cancel/
│   ├── Step1Support.vue
│   ├── Step2Reasons.vue
│   ├── Step3SaveOffer.vue
│   ├── Step3VariantG.vue
│   ├── Step4LossSummary.vue
│   ├── Step5Confirmation.vue
│   ├── BypassSupport.vue
│   └── BypassPlanMgmt.vue
├── layout/
│   └── CancelLayout.vue              (new)
├── components/cancel/
│   ├── PlanSidebar.vue
│   ├── OfferCard.vue
│   ├── CrossPromoCard.vue
│   ├── SupportBanner.vue
│   └── CancelProgressBar.vue         (extracted from prototype App.vue)
├── data/
│   ├── cancellationReasons.ts
│   ├── cancellationLossItems.ts
│   ├── cancellationCompetitors.ts
│   └── cancellationMockUser.ts
├── stores/
│   └── cancellation.ts
└── types/
    └── cancellation.ts
```

The prototype's `AppHeader.vue` and `AppFooter.vue` are **not** ported — `CancelLayout` provides equivalent chrome using account-app tokens.

## CSS Reconciliation

Two parallel token systems resolve to identical hex values but with different names. We consolidate to the account app's system (`--color-brand-*`, `.aio-*`).

### Classes to DROP from the prototype (use account equivalents instead)

| Prototype class | Replace with |
|---|---|
| `.btn-aio-green` | `.aio-btn-green` |
| `.btn-aio-blue` (outline style) | `.aio-btn-outline-blue` |
| `.btn-aio-gray` | `.aio-btn-outline-blue` or custom inline |
| `.btn-aio-lg` | (built into `.aio-btn-green`) |
| `.card-aio` | `.aio-card` |
| `.aio-input` (prototype's 8px padding version) | `.aio-input` (account's 12px padding version — keeps same class name, different rules) |
| `.aio-select` | new utility in main.css, based on account `.aio-input` |
| `.link-aio` | inline Tailwind `text-brand-blue hover:opacity-80 underline` |
| Prototype font-face declarations | (already in account main.css) |
| Prototype base `body` rules | (already in account main.css) |

### Classes to KEEP (flow-specific — add to account's `main.css`)

Added inside a new `@layer components` block, ~220 lines:

- `.progress-bar` + `.progress-segment` (+ `.active-1`..`.active-5`)
- `.loss-item` + `.loss-item-icon`
- `.card-aio-primary` (green offer highlight) — rename to `.aio-card-primary` for naming consistency
- `.card-interactive` + hover/selected states — rename to `.aio-card-interactive`
- `.offer-badge` — rename to `.aio-offer-badge`
- `.or-divider`
- `.link-skip`
- Custom radio/checkbox styles (`input[type="radio"]`, `input[type="checkbox"]` with animated fill)
- `.stagger-reveal > *` + `@keyframes staggerFadeIn`
- Step transitions: `.step-enter-active`, `.step-leave-active`, `.step-enter-from`, `.step-leave-to`
- Fade transitions: `.fade-enter-active`, `.fade-leave-active`, `.fade-enter-from`, `.fade-leave-to`
- `.text-display`, `.text-body`, `.text-body-lg`, `.text-caption`, `.text-overline` — port only if not already defined in account main.css; if already present, skip

Mobile overrides (`@media (max-width: 640px)`) and `@media (prefers-reduced-motion: reduce)` are already in account main.css; skip.

### Classname swaps in templates

Mechanical find-replace across all 14 ported `.vue` files:

- `card-aio-primary` → `aio-card-primary`
- `card-interactive` → `aio-card-interactive`
- `offer-badge` → `aio-offer-badge`
- `btn-aio-green` → `aio-btn-green`
- `btn-aio-blue` (outline) → `aio-btn-outline-blue`
- `card-aio` → `aio-card`
- `text-aio-blue` → `text-brand-blue`
- `text-aio-muted` → `text-text-muted`
- `text-aio-black` → `text-brand-navy`
- `text-aio-black2` → `text-brand-navy-60`
- `text-aio-green` → `text-brand-green`
- `text-aio-red` → `text-brand-red`
- `bg-aio-bg-warm` → `bg-brand-blue-5`
- `bg-aio-green-light` → add `--color-brand-green-5: #E6F7EF` to `@theme` in main.css, then `bg-brand-green-5`
- `border-aio-border` → `border-border`
- `border-aio-input-border` → `border-border-input`

(Exact list audited and applied per component during port.)

## Entry & Exit Points

### Entry
- `BillingView.vue` → Manage Subscription modal → add new "Cancel Subscription" link (below other actions, muted styling). On click: close modal + `router.push('/cancel/support')`.

### Exits
| Source | Destination |
|---|---|
| Step1 "Contact Support" CTA | `/support` |
| Step1 "Continue Anyway" | `/cancel/reason` |
| Step4 "Keep My Plan" | `/billing` + `store.reset()` |
| Step4 "Pause Subscription" | `/billing` (prototype behavior — stub alert for now) |
| Step4 "Confirm Cancellation" text link | `/cancel/confirmation` |
| Step5 "Reactivate Subscription" | `/billing` (stub) |
| Step5 "Back to Account" | `/overview` |
| BypassSupport "Contact Support" | `/support` |
| BypassPlanMgmt "Manage Plan" | `/billing` |

## Mock Data Strategy

Port the prototype's `mockUser` verbatim to `src/data/cancellationMockUser.ts`. Add a TODO comment:

```ts
// TODO: derive from useSubscriptions() once we know which subscription
// is "the active one being cancelled". Shape needed: firstName, planName,
// planKey, renewalDate, purchaseDate, tenure, sites, aiCredits, annualPrice.
```

This keeps the port isolated and avoids perturbing the `useSubscriptions` composable in this pass. Reconciliation deferred to a follow-up task.

## Migration Order (12 tasks)

Each task is an independent commit. Visually verify each ported view against `npm run dev` in the prototype side-by-side.

1. **Scaffold types, store, data files.** Create `types/cancellation.ts`, `stores/cancellation.ts`, and the 4 data files (ports from prototype `data/*.js` to TS).
2. **Add flow-specific CSS to `main.css`.** ~220 lines inside new `@layer components` block.
3. **Build `CancelLayout.vue` + `CancelProgressBar.vue`.** Takeover chrome; no step content yet.
4. **Add 9 routes + navigation guards** to `src/router/index.ts`. Lazy-load each view.
5. **Port flow components**: `PlanSidebar`, `OfferCard`, `CrossPromoCard`, `SupportBanner`. JS→TS, classname swaps.
6. **Port Step1Support.**
7. **Port Step2Reasons** (10 reasons, conditional follow-ups, plan sidebar).
8. **Port Step3SaveOffer** (all 8 save-offer variants A–H).
9. **Port Step3VariantG** + sub-options (not-using sub-flow).
10. **Port Step4LossSummary** (4 plan tiers, pause CTA, gating checkbox for "Confirm Cancellation" text link).
11. **Port Step5Confirmation** (reason-specific acknowledgment + reactivation code + cross-promo cards).
12. **Port BypassSupport + BypassPlanMgmt; wire Billing entry point.** Add "Cancel Subscription" link to Manage Subscription modal.

## Testing Plan

Manual verification only (prototype is mock-data driven, no backend):

- **Visual parity**: each ported view matches the prototype visually (side-by-side `npm run dev`).
- **Branching**: select each of 10 reasons, verify correct next route + save-offer variant renders.
- **Bypass routes**: reasons #8, #9 skip to bypass views.
- **Variant G sub-flow**: sub-options change visible offer cards.
- **Plan tiers**: manually change `cancellationMockUser.planKey` to each of `basic`/`plus`/`pro`/`elite`, verify Step 4 loss items update.
- **Deep-link guards**: `/cancel/offer` without selected reason → redirects to `/cancel/reason`.
- **Back/forward browser buttons**: route history works via vue-router (no custom popstate handling needed).
- **Exit CTAs**: Keep My Plan clears store + navigates; all exit links resolve.
- **Reduced motion**: animations disabled when `prefers-reduced-motion: reduce`.
- **Keyboard a11y**: focus management on step change (focus first heading via `:focus` on route mount).

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Classname swap misses cause visual regressions | Side-by-side visual diff after each view port |
| `.aio-input` name collision between prototype/account versions | Use account version; re-verify all form inputs in Step2/Step3 still render correctly |
| Navigation guard redirects break intended back-button UX | Test back-button from each step; guards should only block deep-links, not in-flow navigation |
| Pinia store state lost on page refresh mid-flow | Accepted — matches prototype behavior; deep-link guard redirects to `/cancel/reason` |
| Prototype uses `.otf` fonts, account uses `.woff2` | Not a port concern — account's fonts already load; flow templates don't reference font files directly |
| Progress bar step numbering drift between bypass routes and regular routes | `CancelProgressBar` computes from route name via a single mapping; test bypass views show "Step 3 of 5" per prototype |
