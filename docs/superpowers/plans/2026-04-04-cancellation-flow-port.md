# Cancellation Flow Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the standalone `aioseo-cancellation-flow` Vue 3 + JS prototype into the `aioseo-account` app as native TypeScript + Vue Router + Pinia code, preserving logic/copy/takeover UX.

**Architecture:** New nested routes under `/cancel/*` render outside `AppLayout` via a new `CancelLayout.vue` (full-screen takeover). State migrates from `provide`/`inject` to a Pinia store. Flow-specific CSS is consolidated into `src/assets/main.css`. All 14 prototype `.vue` files are ported to TypeScript with mechanical classname swaps.

**Tech Stack:** Vue 3 (`<script setup lang="ts">`), Vue Router 4, Pinia, Tailwind v4, `vite-svg-loader`. No test framework — verification via `npm run type-check` (hard gate) + side-by-side `npm run dev` visual diff against the prototype.

**Spec:** `docs/superpowers/specs/2026-04-04-cancellation-flow-port-design.md`

**Prototype reference:** `~/dev/aioseo-cancellation-flow/` (run in parallel terminal for visual diff: `cd ~/dev/aioseo-cancellation-flow && npm run dev`)

---

## Conventions used throughout this plan

**Indentation:** Tabs (project standard per user memory).

**Classname swap table** (applied everywhere, not repeated per task):

| Prototype | Target |
|---|---|
| `card-aio` | `aio-card` |
| `card-aio-primary` | `aio-card-primary` (new class added in Task 2) |
| `card-interactive` | `aio-card-interactive` (new class added in Task 2) |
| `offer-badge` | `aio-offer-badge` (new class added in Task 2) |
| `btn-aio btn-aio-lg btn-aio-green` | `aio-btn-green` |
| `btn-aio btn-aio-green` | `aio-btn-green-sm` |
| `btn-aio btn-aio-lg btn-aio-blue` | `aio-btn-outline-blue` |
| `btn-aio btn-aio-gray` | `aio-btn-gray` (new class added in Task 2) |
| `text-aio-blue` | `text-brand-blue` |
| `text-aio-muted` | `text-text-muted` |
| `text-aio-black` | `text-brand-navy` |
| `text-aio-black2` | `text-brand-navy-60` |
| `text-aio-green` | `text-brand-green` |
| `text-aio-red` | `text-brand-red` |
| `text-aio-orange` | `text-brand-amber` |
| `bg-aio-bg-warm` | `bg-brand-blue-5` |
| `bg-aio-green-light` | `bg-brand-green-5` (new token added in Task 2) |
| `bg-aio-blue-light` | `bg-brand-blue-10` |
| `bg-aio-blue` | `bg-brand-blue` |
| `bg-aio-red` | `bg-brand-red` |
| `border-aio-border` | `border-border` |
| `border-aio-blue` | `border-brand-blue` |
| `border-aio-input-border` | `border-border-input` |
| `rounded-aio-card` | `rounded-card` |
| `rounded-aio-pill` | `rounded-full` |
| `rounded-aio` | `rounded-card` |
| `shadow-[var(--shadow-aio-tooltip)]` | `shadow-[0_4px_20px_rgba(20,27,56,0.12)]` |
| `aio-input` (prototype's small version) | use account's `aio-input` (larger padding — accept the change) |
| `aio-select` | `aio-select` (new class added in Task 2) |
| `link-aio` | inline: `text-brand-blue hover:opacity-80 underline` |
| `link-skip` | `aio-link-skip` (new class added in Task 2) |
| `text-display` | `text-display` (new class added in Task 2) |
| `text-body` | `text-body` (already in account config — verify) |
| `text-body-lg` | `text-body-lg` (new class added in Task 2) |
| `text-caption` | `text-caption` (new class added in Task 2) |
| `text-overline` | `text-overline` (new class added in Task 2) |

**Commit convention:** `feat(cancel): <description>` prefix for all commits. No Co-Authored-By lines (user's global rule).

**Verification gate after every task:**
```bash
cd ~/dev/aioseo-account && npm run type-check
```
Must exit 0. If it fails, fix TS errors before committing.

---

## Task 1: Create TypeScript types for cancellation flow

**Files:**
- Create: `src/types/cancellation.ts`

- [ ] **Step 1: Create the types file**

Write `src/types/cancellation.ts`:

```typescript
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

export type LossItemsByTier = Record<PlanTier, LossItem[]>

export interface CompetitorAdvantage {
	feature: string
	detail: string
}

export interface Competitor {
	advantages: CompetitorAdvantage[]
}

export type CompetitorDataMap = Record<string, Competitor> & { _default: Competitor }

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
	readonly savings: string
}

export interface PlanPricingEntry {
	name: string
	price: number
	sites: string
}

export interface LowerPlan extends PlanPricingEntry {
	key: PlanTier
}
```

- [ ] **Step 2: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
cd ~/dev/aioseo-account && git add src/types/cancellation.ts && git commit -m "feat(cancel): add cancellation flow TS types"
```

---

## Task 2: Add flow-specific CSS to main.css

**Files:**
- Modify: `src/assets/main.css` (append to `@theme` block and add new `@layer components` block)

- [ ] **Step 1: Add the new green-5 color token to @theme**

Edit `src/assets/main.css`. Inside the existing `@theme { ... }` block, after the existing color tokens (around the `--color-brand-green: #00AA63;` line), add:

```css
	--color-brand-green-5: #E6F7EF;
```

- [ ] **Step 2: Append flow-specific component classes**

At the bottom of `src/assets/main.css`, append a new `@layer components` block:

```css
@layer components {
	/* ═══════════════════════════════════════════
	   CANCELLATION FLOW — shared components
	   ═══════════════════════════════════════════ */

	/* Typography utilities used by cancellation flow */
	.text-display {
		font-size: 38px;
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.57px;
		color: var(--color-brand-navy);
	}
	.text-body-lg {
		font-size: 18px;
		font-weight: 400;
		line-height: 1.5;
		color: var(--color-brand-navy-60);
	}
	.text-caption {
		font-size: 14px;
		font-weight: 400;
		line-height: 1.5;
		color: var(--color-text-muted);
	}
	.text-overline {
		font-size: 11px;
		font-weight: 700;
		line-height: 1;
		letter-spacing: 1px;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}
	@media (max-width: 640px) {
		.text-display {
			font-size: 26px;
			line-height: 32px;
			letter-spacing: -0.3px;
		}
	}

	/* Primary offer card — green highlight */
	.aio-card-primary {
		border: 2px solid rgba(0, 170, 99, 0.3);
		border-radius: var(--radius-card);
		padding: 24px;
		background: var(--color-brand-green-5);
		box-shadow: none;
	}
	@media (max-width: 640px) {
		.aio-card-primary { padding: 16px; }
	}

	.aio-offer-badge {
		display: inline-block;
		background: var(--color-brand-green);
		color: white;
		font-size: 14px;
		font-weight: 700;
		padding: 5px 14px;
		border-radius: 9999px;
		margin-bottom: 12px;
	}

	/* Interactive (selectable) card */
	.aio-card-interactive {
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		cursor: pointer;
	}
	.aio-card-interactive:hover {
		border-color: rgba(0, 90, 224, 0.25);
		box-shadow: 0 5px 10px 0 rgba(0, 90, 224, 0.12);
		transform: translateY(-1px);
	}
	.aio-card-interactive.selected {
		border-color: var(--color-brand-blue);
		box-shadow: 0 0 0 3px rgba(0, 90, 224, 0.1), 0 5px 10px 0 rgba(0, 90, 224, 0.12);
	}

	/* Gray outline button — for "Continue Cancelling" secondary action */
	.aio-btn-gray {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		color: rgba(67, 73, 96, 0.8);
		border: 1px solid var(--color-border-input);
		font-size: 16px;
		font-weight: 700;
		padding: 15px 22.5px;
		border-radius: var(--radius-btn);
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.aio-btn-gray:hover {
		background-color: #F7F8FA;
		border-color: #C0C1C7;
	}

	/* Skip link — muted button-like link used for "continue cancelling" */
	.aio-link-skip {
		color: var(--color-text-muted);
		text-decoration: none;
		font-size: 16px;
		cursor: pointer;
		background: transparent;
		border: none;
		padding: 0;
		transition: color 0.15s ease;
	}
	.aio-link-skip:hover {
		color: var(--color-brand-navy-60);
	}

	/* Select dropdown */
	.aio-select {
		appearance: none;
		-webkit-appearance: none;
		width: 100%;
		border: 1px solid var(--color-border-input);
		border-radius: var(--radius-card);
		padding: 8px 30px 8px 12px;
		font-size: 16px;
		font-family: inherit;
		color: var(--color-brand-navy);
		background: white;
		cursor: pointer;
		transition: border-color 0.15s ease, box-shadow 0.15s ease;
	}
	.aio-select:focus {
		outline: none;
		border-color: var(--color-brand-blue);
		box-shadow: 0 0 0 3px rgba(0, 90, 224, 0.1);
	}

	/* Progress bar */
	.aio-progress-bar {
		display: flex;
		gap: 4px;
		align-items: center;
	}
	.aio-progress-segment {
		height: 4px;
		width: 32px;
		border-radius: 2px;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		background: var(--color-border);
	}
	.aio-progress-segment.active {
		background: #5E95EF;
	}
	@media (max-width: 640px) {
		.aio-progress-segment { width: 20px; }
	}

	/* Loss item card */
	.aio-loss-item {
		display: flex;
		align-items: flex-start;
		gap: 16px;
		padding: 20px;
		background: rgba(223, 42, 74, 0.06);
		border: 1px solid rgba(223, 42, 74, 0.12);
		border-radius: var(--radius-card);
		transition: transform 0.2s ease;
	}
	.aio-loss-item-icon {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: rgba(223, 42, 74, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	@media (max-width: 640px) {
		.aio-loss-item { padding: 16px; gap: 12px; }
	}

	/* OR divider */
	.aio-or-divider {
		display: flex;
		align-items: center;
		gap: 16px;
		margin: 20px 0;
		color: var(--color-text-muted);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.5px;
	}
	.aio-or-divider::before,
	.aio-or-divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--color-border);
	}

	/* Custom radio buttons (for cancellation flow reason selection) */
	.aio-cancel-radio input[type="radio"] {
		appearance: none;
		-webkit-appearance: none;
		width: 18px;
		height: 18px;
		border: 2px solid var(--color-border-input);
		border-radius: 50%;
		background: white;
		cursor: pointer;
		transition: all 0.15s ease;
		position: relative;
	}
	.aio-cancel-radio input[type="radio"]:hover { border-color: var(--color-brand-blue); }
	.aio-cancel-radio input[type="radio"]:checked { border-color: var(--color-brand-blue); }
	.aio-cancel-radio input[type="radio"]:checked::after {
		content: '';
		position: absolute;
		top: 3px;
		left: 3px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-brand-blue);
		animation: aioRadioFill 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}
	@keyframes aioRadioFill {
		from { transform: scale(0); }
		to { transform: scale(1); }
	}

	/* Custom checkbox */
	.aio-cancel-checkbox input[type="checkbox"] {
		appearance: none;
		-webkit-appearance: none;
		width: 20px;
		height: 20px;
		border: 2px solid var(--color-border-input);
		border-radius: 5px;
		background: white;
		cursor: pointer;
		transition: all 0.15s ease;
		position: relative;
	}
	.aio-cancel-checkbox input[type="checkbox"]:hover { border-color: var(--color-brand-blue); }
	.aio-cancel-checkbox input[type="checkbox"]:checked {
		border-color: var(--color-brand-blue);
		background: var(--color-brand-blue);
	}
	.aio-cancel-checkbox input[type="checkbox"]:checked::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 5px;
		width: 6px;
		height: 10px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
		animation: aioCheckPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}
	@keyframes aioCheckPop {
		from { transform: rotate(45deg) scale(0); }
		to { transform: rotate(45deg) scale(1); }
	}

	/* Step transitions */
	.cancel-step-enter-active {
		transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
					transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.cancel-step-leave-active { transition: opacity 0.15s ease; }
	.cancel-step-enter-from { opacity: 0; transform: translateY(12px); }
	.cancel-step-leave-to { opacity: 0; }

	/* Fade transitions (reused by warnings, conditional cards) */
	.cancel-fade-enter-active,
	.cancel-fade-leave-active {
		transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.cancel-fade-enter-from { opacity: 0; transform: translateY(6px); }
	.cancel-fade-leave-to { opacity: 0; }

	/* Staggered reveal animation */
	.aio-stagger-reveal > * {
		opacity: 0;
		transform: translateY(8px);
		animation: aioStaggerFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	.aio-stagger-reveal > *:nth-child(1) { animation-delay: 0.05s; }
	.aio-stagger-reveal > *:nth-child(2) { animation-delay: 0.15s; }
	.aio-stagger-reveal > *:nth-child(3) { animation-delay: 0.25s; }
	.aio-stagger-reveal > *:nth-child(4) { animation-delay: 0.35s; }
	.aio-stagger-reveal > *:nth-child(5) { animation-delay: 0.45s; }
	@keyframes aioStaggerFadeIn {
		to { opacity: 1; transform: translateY(0); }
	}
}
```

- [ ] **Step 3: Verify CSS loads in dev server**

```bash
cd ~/dev/aioseo-account && npm run dev
```
Navigate to `http://localhost:5173/`. Page should still render normally (no visual regression). Kill dev server with Ctrl-C.

- [ ] **Step 4: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
cd ~/dev/aioseo-account && git add src/assets/main.css && git commit -m "feat(cancel): add flow-specific CSS tokens, utilities, and animations"
```

---

## Task 3: Port data files (reasons, loss items, competitors, mock user)

**Files:**
- Create: `src/data/cancellationReasons.ts`
- Create: `src/data/cancellationLossItems.ts`
- Create: `src/data/cancellationCompetitors.ts`
- Create: `src/data/cancellationMockUser.ts`

- [ ] **Step 1: Create cancellationReasons.ts**

```typescript
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
```

- [ ] **Step 2: Create cancellationLossItems.ts**

```typescript
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
```

- [ ] **Step 3: Create cancellationCompetitors.ts**

```typescript
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
```

- [ ] **Step 4: Create cancellationMockUser.ts**

```typescript
import type { CancellationMockUser, LowerPlan, PlanPricingEntry, PlanTier } from '@/types/cancellation'

// TODO: derive from useSubscriptions() once we know which subscription
// is "the active one being cancelled". Shape needed: firstName, planName,
// planKey, renewalDate, purchaseDate, tenure, sites, aiCredits, annualPrice.
// Change planKey to 'basic' | 'plus' | 'pro' | 'elite' to preview different tiers.
export const cancellationMockUser: CancellationMockUser = {
	firstName: 'Adam',
	planName: 'AIOSEO - Elite',
	planKey: 'elite',
	renewalDate: 'Dec 9, 2026',
	purchaseDate: 'Dec 9, 2025',
	tenure: '1 year',
	sites: 'unlimited',
	aiCredits: 200,
	annualPrice: 599.50,
	get savings(): string {
		return (this.annualPrice / 2).toFixed(2)
	},
}

export const cancellationPlanPricing: Record<PlanTier, PlanPricingEntry> = {
	elite:  { name: 'Elite',  price: 599.50, sites: 'unlimited' },
	pro:    { name: 'Pro',    price: 399.50, sites: '10' },
	plus:   { name: 'Plus',   price: 199.50, sites: '3' },
	basic:  { name: 'Basic',  price: 99.50,  sites: '1' },
}

export function getLowerPlan(currentPlanKey: PlanTier): LowerPlan | null {
	const order: PlanTier[] = ['elite', 'pro', 'plus', 'basic']
	const idx = order.indexOf(currentPlanKey)
	if (idx < 0 || idx >= order.length - 1) return null
	const lowerKey = order[idx + 1]
	return { key: lowerKey, ...cancellationPlanPricing[lowerKey] }
}
```

- [ ] **Step 5: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
cd ~/dev/aioseo-account && git add src/data/cancellation*.ts && git commit -m "feat(cancel): port data modules (reasons, loss items, competitors, mock user) to TS"
```

---

## Task 4: Create the Pinia cancellation store

**Files:**
- Create: `src/stores/cancellation.ts`

- [ ] **Step 1: Write the store**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import type { Reason } from '@/types/cancellation'

/**
 * Cancellation flow state machine.
 *
 * Replaces the prototype's provide/inject pattern. Navigation is performed via
 * injected router instance (passed to actions from components that `useRouter()`).
 */
export const useCancellationStore = defineStore('cancellation', () => {
	const selectedReason = ref<Reason | null>(null)
	const followUpValue = ref<string>('')

	function currentStepNumber(route: RouteLocationNormalizedLoaded): number {
		const name = route.name as string | undefined
		if (name === 'cancel-support') return 1
		if (name === 'cancel-reason') return 2
		if (
			name === 'cancel-offer' ||
			name === 'cancel-offer-not-using' ||
			name === 'cancel-bypass-support' ||
			name === 'cancel-bypass-plan'
		) return 3
		if (name === 'cancel-review') return 4
		if (name === 'cancel-confirmation') return 5
		return 0
	}

	function canGoBack(route: RouteLocationNormalizedLoaded): boolean {
		const num = currentStepNumber(route)
		return num > 1 && num < 5
	}

	function selectReason(router: Router, reason: Reason, followUp: string) {
		selectedReason.value = reason
		followUpValue.value = followUp
		if (reason.variant === 'bypass-support') {
			router.push({ name: 'cancel-bypass-support' })
		} else if (reason.variant === 'bypass-plan') {
			router.push({ name: 'cancel-bypass-plan' })
		} else if (reason.variant === 'G') {
			router.push({ name: 'cancel-offer-not-using' })
		} else {
			router.push({ name: 'cancel-offer' })
		}
	}

	function skipOffer(router: Router) {
		router.push({ name: 'cancel-review' })
	}

	function confirmCancel(router: Router) {
		router.push({ name: 'cancel-confirmation' })
	}

	function keepPlan(router: Router) {
		reset()
		router.push({ name: 'billing' })
	}

	function goBack(router: Router, route: RouteLocationNormalizedLoaded) {
		const name = route.name as string | undefined
		if (name === 'cancel-review') {
			if (selectedReason.value?.variant === 'G') {
				router.push({ name: 'cancel-offer-not-using' })
			} else {
				router.push({ name: 'cancel-offer' })
			}
			return
		}
		if (
			name === 'cancel-offer' ||
			name === 'cancel-offer-not-using' ||
			name === 'cancel-bypass-support' ||
			name === 'cancel-bypass-plan'
		) {
			router.push({ name: 'cancel-reason' })
			return
		}
		if (name === 'cancel-reason') {
			router.push({ name: 'cancel-support' })
		}
	}

	function reset() {
		selectedReason.value = null
		followUpValue.value = ''
	}

	return {
		selectedReason,
		followUpValue,
		currentStepNumber,
		canGoBack,
		selectReason,
		skipOffer,
		confirmCancel,
		keepPlan,
		goBack,
		reset,
	}
})
```

- [ ] **Step 2: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
cd ~/dev/aioseo-account && git add src/stores/cancellation.ts && git commit -m "feat(cancel): add cancellation Pinia store replacing provide/inject"
```

---

## Task 5: Copy public assets from prototype

**Files:**
- Create: `public/dashboard-illustration.svg` (copied from prototype)
- Create: `public/broken-link-checker-icon.svg` (copied from prototype)

- [ ] **Step 1: Copy the two SVG assets**

```bash
cp ~/dev/aioseo-cancellation-flow/public/dashboard-illustration.svg ~/dev/aioseo-account/public/dashboard-illustration.svg
cp ~/dev/aioseo-cancellation-flow/public/broken-link-checker-icon.svg ~/dev/aioseo-account/public/broken-link-checker-icon.svg
```

- [ ] **Step 2: Verify files exist**

```bash
ls ~/dev/aioseo-account/public/dashboard-illustration.svg ~/dev/aioseo-account/public/broken-link-checker-icon.svg
```
Expected: both files listed.

- [ ] **Step 3: Commit**

```bash
cd ~/dev/aioseo-account && git add public/dashboard-illustration.svg public/broken-link-checker-icon.svg && git commit -m "feat(cancel): add dashboard illustration and BLC icon assets"
```

---

## Task 6: Create CancelProgressBar component

**Files:**
- Create: `src/components/cancel/CancelProgressBar.vue`

- [ ] **Step 1: Create the component**

```vue
<script setup lang="ts">
defineProps<{
	current: number
	total?: number
}>()
</script>

<template>
	<div class="flex items-center gap-3">
		<span class="text-overline" role="status" aria-live="polite">
			Step {{ current }} of {{ total ?? 5 }}
		</span>
		<div class="aio-progress-bar" aria-hidden="true">
			<div
				v-for="i in (total ?? 5)"
				:key="i"
				:class="['aio-progress-segment', i <= current ? 'active' : '']"
			></div>
		</div>
	</div>
</template>
```

- [ ] **Step 2: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
cd ~/dev/aioseo-account && git add src/components/cancel/CancelProgressBar.vue && git commit -m "feat(cancel): add progress bar component"
```

---

## Task 7: Create CancelLayout

**Files:**
- Create: `src/layout/CancelLayout.vue`

- [ ] **Step 1: Write CancelLayout.vue**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'
import CancelProgressBar from '@/components/cancel/CancelProgressBar.vue'

const route = useRoute()
const router = useRouter()
const store = useCancellationStore()

const stepNumber = computed(() => store.currentStepNumber(route))
const isFlowStep = computed(() => stepNumber.value > 0)
const isBypass = computed(() =>
	route.name === 'cancel-bypass-support' || route.name === 'cancel-bypass-plan'
)
const showProgressBar = computed(() => isFlowStep.value && !isBypass.value)
const canGoBack = computed(() =>
	store.canGoBack(route) || isBypass.value
)

function goBack() {
	store.goBack(router, route)
}
</script>

<template>
	<div class="min-h-screen flex flex-col bg-white font-body">
		<header class="bg-white border-b border-border sticky top-0 z-50">
			<div class="max-w-[1110px] mx-auto h-[88px] flex items-center px-6">
				<router-link :to="{ name: 'billing' }" aria-label="AIOSEO Home" class="flex items-center no-underline">
					<svg focusable="false" class="h-[25px] w-auto overflow-visible" aria-hidden="true" fill="#005ae0" viewBox="-0.5 -0.5 128 26" xmlns="http://www.w3.org/2000/svg"><path d="M114.41 25c6.88 0 12.458-5.596 12.458-12.5S121.29 0 114.41 0s-12.458 5.596-12.458 12.5S107.53 25 114.41 25zm-1.984-20.425a.658.658 0 00-.768-.277 8.38 8.38 0 00-.956.407.688.688 0 00-.349.754l.214 1.084a.78.78 0 01-.274.743 6.49 6.49 0 00-.937.962.744.744 0 01-.725.283l-1.059-.215a.662.662 0 00-.735.36 8.557 8.557 0 00-.394.98.689.689 0 00.273.786l.9.612c.231.158.347.44.319.723-.045.456-.043.911.003 1.36a.778.778 0 01-.317.724l-.898.615a.69.69 0 00-.271.787c.113.334.246.66.398.978a.662.662 0 00.736.358l1.06-.219a.743.743 0 01.725.28c.278.35.592.672.939.96a.78.78 0 01.277.742l-.21 1.085a.687.687 0 00.352.752 8.268 8.268 0 00.957.404c.474.166 1.138-.43 1.629-.871a1.16 1.16 0 00.393-.855v-1.819c0-.02.001-.039.003-.058-1.451-.354-2.529-1.69-2.529-3.284V11.79c0-.147.116-.265.259-.265h.898V9.629a.47.47 0 01.463-.474c.256 0 .463.213.463.474v1.896h2.43V9.629c0-.261.207-.474.463-.474s.463.213.463.474v1.896h.898c.143 0 .259.118.259.265v1.926c0 1.644-1.147 3.014-2.667 3.315l.001.027v1.806c0 .336.153.65.403.868.499.437 1.175 1.028 1.647.86.326-.115.645-.251.956-.407a.687.687 0 00.349-.753l-.214-1.085a.78.78 0 01.274-.742c.341-.285.655-.606.937-.962a.744.744 0 01.725-.284l1.059.215c.298.06.602-.08.735-.36a8.556 8.556 0 00.394-.98.689.689 0 00-.273-.785l-.9-.612a.776.776 0 01-.319-.724 6.777 6.777 0 00-.003-1.359.778.778 0 01.317-.724l.898-.616a.689.689 0 00.27-.786 8.603 8.603 0 00-.398-.979.66.66 0 00-.735-.357l-1.06.218a.743.743 0 01-.725-.28 6.583 6.583 0 00-.939-.96.777.777 0 01-.277-.741l.21-1.085a.687.687 0 00-.352-.752 8.588 8.588 0 00-.957-.404.658.658 0 00-.767.28l-.598.92a.745.745 0 01-.707.328 6.316 6.316 0 00-1.327.002.743.743 0 01-.707-.324z" fill-rule="evenodd"></path><path d="M101.41 1.016H84.861v23.196h16.647a27.05 27.05 0 01-1.816-5.043h-8.87v-4.173h8.162a27.546 27.546 0 01.01-5.078h-8.171v-3.86h8.818a27.03 27.03 0 011.769-5.042zM72.438 24.629c-4.679 0-7.937-1.46-10.259-3.687l3.154-4.486a10.428 10.428 0 007.382 3.06c2.045 0 3.293-.869 3.293-1.982 0-1.321-1.49-1.843-3.951-2.365l-.196-.039c-3.797-.76-8.954-1.793-8.954-7.194 0-3.895 3.292-7.268 9.22-7.268 3.708 0 6.931 1.113 9.392 3.234L78.26 8.179c-1.941-1.6-4.471-2.4-6.516-2.4-1.976 0-2.738.8-2.738 1.81 0 1.216 1.42 1.634 3.986 2.12 3.812.8 9.08 1.913 9.08 7.165 0 4.66-3.431 7.755-9.635 7.755z"></path><path fill="#141b38" d="M17.938 24.223h6.306L15.745 1.656H8.463L-.001 24.223h6.306l1.146-3.417h9.34zM12.105 6.731l3.17 9.169H8.968zM26.91 24.223h5.8V1.656h-5.8zm8.699-11.267c0 6.868 5.159 11.672 12.038 11.672s12.004-4.804 12.004-11.672S54.526 1.284 47.647 1.284 35.609 6.088 35.609 12.956zm18.141 0c0 3.654-2.394 6.53-6.103 6.53-3.743 0-6.137-2.876-6.137-6.53 0-3.688 2.394-6.53 6.137-6.53 3.709 0 6.103 2.842 6.103 6.53z"></path></svg>
				</router-link>
			</div>
		</header>

		<main class="flex-1">
			<h1 class="sr-only">Cancel Your Subscription</h1>
			<div v-if="isFlowStep" class="border-b border-border bg-white">
				<div class="max-w-[1110px] mx-auto px-4 sm:px-6 h-[48px] flex items-center justify-between">
					<button
						v-if="canGoBack"
						@click="goBack"
						class="text-caption text-brand-blue hover:opacity-80 bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors"
					>
						<svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M10 12L6 8l4-4" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						Back
					</button>
					<span v-else></span>
					<CancelProgressBar v-if="showProgressBar" :current="stepNumber" :total="5" />
				</div>
			</div>

			<div class="max-w-[1110px] mx-auto px-4 sm:px-6 pb-10 pt-10">
				<router-view v-slot="{ Component }">
					<transition name="cancel-step" mode="out-in">
						<component :is="Component" />
					</transition>
				</router-view>
			</div>
		</main>

		<footer class="border-t border-border bg-white py-5 mt-auto">
			<div class="max-w-[1110px] mx-auto px-4 sm:px-6 flex flex-wrap gap-2 items-center justify-between text-caption">
				<span>&copy; 2007-2026 Semper Plugins, LLC.</span>
				<div class="flex gap-5">
					<a href="#" class="text-text-muted no-underline hover:text-brand-blue transition-colors">Terms</a>
					<a href="#" class="text-text-muted no-underline hover:text-brand-blue transition-colors">Privacy</a>
					<a href="#" class="text-text-muted no-underline hover:text-brand-blue transition-colors">Support</a>
				</div>
			</div>
		</footer>
	</div>
</template>
```

- [ ] **Step 2: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
cd ~/dev/aioseo-account && git add src/layout/CancelLayout.vue && git commit -m "feat(cancel): add CancelLayout with takeover chrome (header/progress/footer)"
```

---

## Task 8: Add cancellation routes to the router

**Files:**
- Modify: `src/router/index.ts`

- [ ] **Step 1: Add the cancel routes branch**

Edit `src/router/index.ts`. After the closing `]` of the first route's `children`, before the closing `}` of the first route object, add a second top-level route for `/cancel`. The full updated file should read:

```typescript
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
					path: 'offer',
					name: 'cancel-offer',
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
```

- [ ] **Step 2: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0. (Will fail with "Cannot find module" errors for the view components — that's expected; we create them in later tasks. Instead verify the failure is ONLY those import errors and no other TS errors. If you want a clean type-check, temporarily comment out the cancel routes section, verify type-check passes, then uncomment.)

**Alternative: skip type-check here and defer to Task 9 after first view exists.**

- [ ] **Step 3: Commit**

```bash
cd ~/dev/aioseo-account && git add src/router/index.ts && git commit -m "feat(cancel): add /cancel/* routes with navigation guards"
```

---

## Task 9: Port OfferCard, CrossPromoCard, SupportBanner components

**Files:**
- Create: `src/components/cancel/OfferCard.vue`
- Create: `src/components/cancel/CrossPromoCard.vue`
- Create: `src/components/cancel/SupportBanner.vue`

- [ ] **Step 1: Create OfferCard.vue**

```vue
<script setup lang="ts">
defineProps<{
	title: string
	body: string
	ctaText: string
	ctaType?: 'green' | 'blue'
	primary?: boolean
	badge?: string
}>()

defineEmits<{
	(e: 'cta-click'): void
}>()
</script>

<template>
	<div :class="primary ? 'aio-card-primary' : 'aio-card'">
		<span v-if="badge" class="aio-offer-badge">{{ badge }}</span>
		<h3 class="text-[20px] font-bold text-brand-navy m-0 mb-3">{{ title }}</h3>
		<p class="text-[16px] text-brand-navy-60 leading-relaxed m-0 mb-5">{{ body }}</p>
		<slot name="extra"></slot>
		<button
			@click="$emit('cta-click')"
			:class="ctaType === 'blue' ? 'aio-btn-outline-blue' : 'aio-btn-green'"
		>
			{{ ctaText }}
		</button>
	</div>
</template>
```

- [ ] **Step 2: Create CrossPromoCard.vue**

```vue
<script setup lang="ts">
defineProps<{
	name: string
	description: string
	url?: string
}>()
</script>

<template>
	<a :href="url ?? '#'" target="_blank" rel="noopener noreferrer" class="aio-card p-5 flex flex-col items-start gap-3 no-underline hover:border-brand-blue/30 transition-colors">
		<div class="w-10 h-10 shrink-0 flex items-center justify-center">
			<slot name="logo"></slot>
		</div>
		<div>
			<h4 class="text-[15px] font-bold text-brand-navy m-0 mb-1">{{ name }}</h4>
			<p class="text-[13px] text-brand-navy-60 m-0 leading-relaxed">{{ description }}</p>
		</div>
	</a>
</template>
```

- [ ] **Step 3: Create SupportBanner.vue**

```vue
<script setup lang="ts"></script>

<template>
	<div class="flex items-center flex-wrap gap-4 mb-7 py-3.5 px-5 bg-brand-blue-10 rounded-card">
		<div class="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shrink-0">
			<svg aria-hidden="true" class="w-4 h-4 text-brand-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>
		<p class="m-0 text-[15px]">
			<span class="font-bold text-brand-navy">Have a question?</span>
			<a href="#" class="text-brand-blue hover:opacity-80 underline font-bold ml-1.5">Get Help Now &rarr;</a>
			<span class="text-text-muted ml-0 sm:ml-2 text-[13px] block sm:inline mt-1 sm:mt-0">Typically responds within 2 hours</span>
		</p>
	</div>
</template>
```

- [ ] **Step 4: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0 (or only the remaining view-import errors from Task 8).

- [ ] **Step 5: Commit**

```bash
cd ~/dev/aioseo-account && git add src/components/cancel/ && git commit -m "feat(cancel): port OfferCard, CrossPromoCard, SupportBanner components"
```

---

## Task 10: Port PlanSidebar component

**Files:**
- Create: `src/components/cancel/PlanSidebar.vue`

- [ ] **Step 1: Create PlanSidebar.vue**

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'

const router = useRouter()
const store = useCancellationStore()

function keepPlan() {
	store.keepPlan(router)
}
</script>

<template>
	<div class="plan-sidebar-pitch">
		<div class="pitch-illustration">
			<object type="image/svg+xml" data="/dashboard-illustration.svg" aria-label="AIOSEO Dashboard showing SEO score, traffic growth, and rankings" style="pointer-events: none;"></object>
		</div>

		<p class="pitch-headline">
			Trusted by 3,000,000+ professionals
		</p>

		<div class="pitch-stars">
			<div class="stars-row">
				<svg v-for="n in 5" :key="n" aria-hidden="true" class="star-icon" viewBox="0 0 20 20" fill="#F5A623">
					<path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7 6 11.21l-4-3.9 5.53-.8L10 1.5z"/>
				</svg>
			</div>
			<p class="stars-label">4.7 / 5 based on 7,000+ reviews</p>
		</div>

		<div class="border-t border-border my-5"></div>

		<div class="pitch-testimonials">
			<blockquote class="testimonial">
				<p>AIOSEO helped us increase our organic traffic by 200%. It's been a game-changer for our business.</p>
				<cite>Sarah M., Marketing Director</cite>
			</blockquote>
			<blockquote class="testimonial">
				<p>The best SEO plugin we've ever used. Period.</p>
				<cite>James L., Agency Owner</cite>
			</blockquote>
			<blockquote class="testimonial">
				<p>Setup took 10 minutes and we saw ranking improvements within weeks.</p>
				<cite>David R., Small Business Owner</cite>
			</blockquote>
		</div>

		<button @click="keepPlan" class="aio-btn-green pitch-cta">
			Keep My Plan
		</button>
	</div>
</template>

<style>
.plan-sidebar-pitch { text-align: center; }
.pitch-illustration { margin: -4px -4px 0; }
.pitch-illustration img,
.pitch-illustration object { width: 100%; height: auto; display: block; }
.pitch-headline {
	font-size: 16px; font-weight: 600;
	color: var(--color-brand-navy); margin: 20px 0 12px; line-height: 1.3;
}
.pitch-stars { margin-bottom: 20px; }
.stars-row { display: flex; justify-content: center; gap: 3px; margin-bottom: 6px; }
.star-icon { width: 18px; height: 18px; }
.stars-label { font-size: 13px; color: var(--color-text-muted); margin: 0; }
.pitch-testimonials { text-align: left; margin-bottom: 20px; }
.testimonial {
	margin: 0 0 6px; padding: 12px 14px 12px 38px; border: none; position: relative;
	background-image: url("data:image/svg+xml,%3Csvg fill='%236B6E78' viewBox='0 0 13 11' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 7.3C0 9.687 1.356 11 2.9 11c1.402 0 2.478-1.168 2.478-2.58 0-1.46-.936-2.482-2.245-2.482-.234 0-.561.049-.608.049.14-1.558 1.497-3.505 2.993-4.527L3.788 0C1.637 1.606 0 4.332 0 7.301zm7.482 0c0 2.386 1.356 3.7 2.9 3.7 1.402 0 2.524-1.168 2.524-2.58 0-1.46-.982-2.482-2.29-2.482-.235 0-.562.049-.609.049.187-1.558 1.497-3.505 2.993-4.527L11.27 0C9.119 1.606 7.482 4.332 7.482 7.301z'/%3E%3C/svg%3E");
	background-position: 12px 14px; background-size: 13px; background-repeat: no-repeat;
}
.testimonial:last-child { margin-bottom: 0; }
.testimonial p { font-size: 15px; font-style: normal; color: var(--color-brand-navy); line-height: 1.4; margin: 0 0 6px; }
.testimonial cite { font-size: 13px; font-style: normal; color: var(--color-text-muted); font-weight: 500; }
.pitch-cta { width: 100%; margin-top: 4px; }
</style>
```

- [ ] **Step 2: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0 (or only remaining view-import errors).

- [ ] **Step 3: Commit**

```bash
cd ~/dev/aioseo-account && git add src/components/cancel/PlanSidebar.vue && git commit -m "feat(cancel): port PlanSidebar with testimonials and keep-plan CTA"
```

---

## Task 11: Port Step1Support (first view — verifies the pipeline)

**Files:**
- Create: `src/views/cancel/Step1Support.vue`

- [ ] **Step 1: Create Step1Support.vue**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedTag = ref<string | null>(null)

const issueTags = [
	{ label: 'I was charged unexpectedly' },
	{ label: "Something isn't working right" },
	{ label: 'I need help setting things up' },
	{ label: 'I have a billing question' },
]

function selectTag(tag: string) {
	selectedTag.value = selectedTag.value === tag ? null : tag
}

function handleSupport() {
	alert(`Opening support form with category: "${selectedTag.value}" (prototype)`)
}

function handleSkip() {
	router.push({ name: 'cancel-reason' })
}
</script>

<template>
	<div class="max-w-[560px] mx-auto">
		<div class="aio-card text-center py-8 px-5 sm:py-10 sm:px-8">
			<h2 class="text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[43px] m-0 mb-3">
				Before you cancel&mdash;can&nbsp;we&nbsp;help?
			</h2>
			<p class="text-[16px] text-text-muted mt-0 mb-8 max-w-[440px] mx-auto">
				Many customers who start here actually have something we can fix in minutes. If any of these sound familiar, let us take a look.
			</p>

			<div class="flex flex-wrap justify-center gap-3 mb-8">
				<button
					v-for="tag in issueTags"
					:key="tag.label"
					@click="selectTag(tag.label)"
					:class="[
						'px-5 py-3 sm:py-2.5 rounded-full text-[15px] font-medium cursor-pointer border transition-all',
						selectedTag === tag.label
							? 'bg-brand-blue text-white border-brand-blue shadow-[0_2px_8px_rgba(0,90,224,0.2)]'
							: 'bg-white text-brand-navy-60 border-border-input hover:border-brand-blue hover:text-brand-blue'
					]"
				>
					{{ tag.label }}
				</button>
			</div>

			<transition name="cancel-fade">
				<div v-if="selectedTag" class="mb-6">
					<button
						@click="handleSupport"
						class="aio-btn-green w-full max-w-[380px]"
					>
						Talk to Our Team &mdash; Priority Response
					</button>
					<p class="text-caption mt-3 mb-0">
						Your request will be escalated automatically. We'll be with you shortly.
					</p>
				</div>
			</transition>

			<div class="aio-or-divider mt-6">OR</div>

			<button
				@click="handleSkip"
				class="aio-link-skip mt-3"
			>
				None of these apply &mdash; continue with cancellation
			</button>
		</div>
	</div>
</template>
```

- [ ] **Step 2: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0 (remaining errors will be from unported views — should now be 7 import errors: Step2Reasons, Step3SaveOffer, Step3VariantG, Step4LossSummary, Step5Confirmation, BypassSupport, BypassPlanMgmt).

- [ ] **Step 3: Visual verification in dev server**

```bash
cd ~/dev/aioseo-account && npm run dev
```
Navigate to `http://localhost:5173/cancel/support`. Open prototype at `http://localhost:5174/cancel/support` in another tab (or run prototype via `cd ~/dev/aioseo-cancellation-flow && npm run dev` on port 5174).

Compare side-by-side:
- Card layout matches (centered 560px max-width, centered text)
- Heading typography matches
- 4 issue tags render horizontally with pill shape
- Clicking a tag highlights it blue
- Selected tag reveals the green "Talk to Our Team" button with transition
- "OR" divider renders with horizontal lines
- Skip link renders muted
- Progress bar shows "Step 1 of 5"
- "Back" button is hidden (step 1 has no back)

Kill dev server.

- [ ] **Step 4: Commit**

```bash
cd ~/dev/aioseo-account && git add src/views/cancel/Step1Support.vue && git commit -m "feat(cancel): port Step1Support (support intercept)"
```

---

## Task 12: Port Step2Reasons

**Files:**
- Create: `src/views/cancel/Step2Reasons.vue`

- [ ] **Step 1: Create Step2Reasons.vue**

```vue
<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'
import { cancellationReasons } from '@/data/cancellationReasons'
import { cancellationMockUser } from '@/data/cancellationMockUser'
import SupportBanner from '@/components/cancel/SupportBanner.vue'
import PlanSidebar from '@/components/cancel/PlanSidebar.vue'

const router = useRouter()
const store = useCancellationStore()
const user = cancellationMockUser

const selectedReasonId = ref<number | null>(null)
const followUpText = ref('')
const followUpDropdown = ref('')
const otherCompetitorText = ref('')

const selectedReason = computed(() =>
	cancellationReasons.find(r => r.id === selectedReasonId.value) ?? null
)

const canContinue = computed(() => {
	if (!selectedReason.value) return false
	const fu = selectedReason.value.followUp
	if (!fu) return true
	if (fu.type === 'text') return true
	if (fu.type === 'dropdown' && fu.required) return !!followUpDropdown.value
	return true
})

function handleContinue() {
	if (!canContinue.value || !selectedReason.value) return
	const fu = selectedReason.value.followUp
	const followUp = fu?.type === 'text' ? followUpText.value : followUpDropdown.value
	store.selectReason(router, selectedReason.value, followUp)
}

function selectReason(id: number) {
	selectedReasonId.value = id
	followUpText.value = ''
	followUpDropdown.value = ''
	otherCompetitorText.value = ''
	nextTick(() => {
		const el = document.querySelector<HTMLElement>('.follow-up-field')
		if (el) el.focus()
	})
}

function keepPlan() {
	store.keepPlan(router)
}
</script>

<template>
	<div>
		<SupportBanner />

		<div class="text-center mb-8">
			<h2 class="text-display m-0">
				{{ user.firstName }}, we're sorry to see you go.
			</h2>
			<p class="text-body-lg mt-3 mb-0 max-w-[520px] mx-auto">
				Before you cancel, please let us know why so we can try to help.
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
			<div class="aio-card">
				<fieldset class="border-0 p-0 m-0 aio-cancel-radio">
					<legend class="text-[16px] font-bold text-brand-navy m-0 mb-4">Why do you want to cancel?</legend>

					<div class="space-y-0.5">
						<div v-for="reason in cancellationReasons" :key="reason.id">
							<label
								:class="[
									'flex items-center flex-wrap gap-3 py-2.5 px-3 rounded-card cursor-pointer border transition-all',
									selectedReasonId === reason.id
										? 'border-brand-blue bg-brand-blue-10/50'
										: 'border-transparent hover:bg-brand-blue-5'
								]"
							>
								<input
									type="radio"
									name="cancel-reason"
									:value="reason.id"
									v-model="selectedReasonId"
									@change="selectReason(reason.id)"
									class="shrink-0"
								>
								<span class="text-[15px] text-brand-navy leading-snug flex-1">
									{{ reason.label }}
								</span>
								<template v-if="selectedReasonId === reason.id && reason.followUp">
									<input
										v-if="reason.followUp.type === 'text'"
										v-model="followUpText"
										:placeholder="reason.followUp.placeholder"
										aria-label="Additional details"
										class="follow-up-field aio-input w-full ml-7"
										@click.stop
									>
									<div v-if="reason.followUp.type === 'dropdown'" class="relative w-full ml-7">
										<select
											v-model="followUpDropdown"
											aria-label="Select an option"
											class="follow-up-field aio-select"
											@click.stop
										>
											<option value="" disabled>{{ reason.followUp.placeholder }}</option>
											<option
												v-for="opt in reason.followUp.options"
												:key="opt"
												:value="opt"
											>
												{{ opt }}
											</option>
										</select>
										<svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M4 6l4 4 4-4" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</div>
								</template>
							</label>
							<div
								v-if="selectedReasonId === reason.id && reason.followUp?.type === 'dropdown' && reason.followUp.otherTextField && followUpDropdown === 'Other'"
								class="ml-9 mt-1 mb-1"
							>
								<input
									v-model="otherCompetitorText"
									placeholder="Which solution?"
									aria-label="Which solution?"
									class="aio-input w-full sm:w-[180px]"
								>
							</div>
						</div>
					</div>
				</fieldset>

				<div class="flex flex-col sm:flex-row gap-3 mt-5 pt-4 border-t border-border">
					<button @click="keepPlan" class="aio-btn-green-sm w-full sm:w-auto">
						Keep My Plan
					</button>
					<button
						@click="handleContinue"
						:class="[
							'aio-btn-gray transition-opacity w-full sm:w-auto',
							!canContinue ? 'opacity-40 cursor-not-allowed' : ''
						]"
						:disabled="!canContinue"
					>
						Continue Cancelling
					</button>
				</div>
			</div>

			<div class="aio-card">
				<PlanSidebar />
			</div>
		</div>
	</div>
</template>
```

- [ ] **Step 2: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0 (or remaining view import errors).

- [ ] **Step 3: Visual verification**

```bash
cd ~/dev/aioseo-account && npm run dev
```
Navigate to `http://localhost:5173/cancel/reason`. Compare to prototype:
- Support banner at top
- Heading "Adam, we're sorry to see you go." with body underline
- Two-column grid (reasons left, PlanSidebar right) on large screens
- Selecting reason #5 ("Too expensive") reveals dropdown
- Selecting reason #3 ("Switching") → dropdown → "Other" reveals extra text input
- Selecting reason #1 ("Technical problems") reveals text input
- "Continue Cancelling" button disabled until valid selection
- "Keep My Plan" always enabled

Test each reason → verify `canContinue` toggles correctly.

- [ ] **Step 4: Commit**

```bash
cd ~/dev/aioseo-account && git add src/views/cancel/Step2Reasons.vue && git commit -m "feat(cancel): port Step2Reasons with conditional follow-ups and plan sidebar"
```

---

## Task 13: Port Step3SaveOffer (all 8 variants A–H)

**Files:**
- Create: `src/views/cancel/Step3SaveOffer.vue`

- [ ] **Step 1: Create Step3SaveOffer.vue**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'
import { cancellationMockUser, getLowerPlan } from '@/data/cancellationMockUser'
import { cancellationCompetitorData } from '@/data/cancellationCompetitors'
import OfferCard from '@/components/cancel/OfferCard.vue'

const router = useRouter()
const store = useCancellationStore()
const user = cancellationMockUser

const variant = computed(() => store.selectedReason?.variant ?? 'H')

const competitor = computed(() => {
	const name = store.followUpValue || ''
	return cancellationCompetitorData[name] ?? cancellationCompetitorData._default
})
const competitorName = computed(() => {
	const name = store.followUpValue || ''
	return cancellationCompetitorData[name] ? name : 'Other SEO Tools'
})

const lowerPlan = computed(() => getLowerPlan(user.planKey))

const showRenewalReminderLine = computed(() =>
	variant.value === 'B' && ['Charged unexpectedly', 'Forgot to cancel'].includes(store.followUpValue)
)

function handleOffer(action: string) {
	alert(`Action: ${action} (prototype — would trigger backend)`)
}

function handleSaveOfferSkip() {
	store.skipOffer(router)
}

function keepPlan() {
	store.keepPlan(router)
}
</script>

<template>
	<div class="max-w-[680px] mx-auto">
		<template v-if="variant === 'A'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					{{ user.firstName }}, what if you could keep everything for half the price?
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					We get it&mdash;budgets are tight. Here's an exclusive deal to keep your SEO running without breaking the bank.
				</p>
			</div>

			<OfferCard
				:primary="true"
				:badge="`Save $${user.savings}`"
				title="50% Off Your Next Renewal"
				:body="`Keep every feature you have right now—TruSEO Analysis, Smart Sitemaps, Schema Generator, and everything else in your ${user.planName} plan—for half the price on your next renewal.`"
				cta-text="Yes, Apply My 50% Discount"
				@cta-click="handleOffer('apply-50-discount')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				v-if="lowerPlan"
				title="Switch to a Smaller Plan"
				:body="`Your current ${user.planName} plan covers ${user.sites} sites. If you only need coverage for fewer sites, you could switch to ${lowerPlan.name} and save $${(user.annualPrice - lowerPlan.price).toFixed(2)}/year while keeping the core features you use most.`"
				cta-text="Compare Plans"
				cta-type="blue"
				@cta-click="handleOffer('compare-plans')"
			/>
		</template>

		<template v-if="variant === 'B'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					{{ user.firstName }}, you don't have to cancel&mdash;you can pause instead.
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					We hear you&mdash;unexpected charges and auto-renewals are frustrating. Instead of losing everything, you can pause and pick back up when you're ready.
				</p>
			</div>

			<div v-if="showRenewalReminderLine" class="flex items-start gap-3 p-4 mb-6 bg-brand-green-5 rounded-card border border-green-200/50">
				<svg aria-hidden="true" class="w-5 h-5 mt-0.5 shrink-0 text-brand-green" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M10 2a8 8 0 100 16 8 8 0 000-16z" stroke-linecap="round"/>
					<path d="M10 6v4l2.5 1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				<p class="text-[15px] text-brand-navy m-0">
					<strong>We'll remind you before every renewal.</strong> You'll get an email 14 days before your next billing date&mdash;no surprises, ever.
				</p>
			</div>

			<OfferCard
				:primary="true"
				title="Pause Your Subscription"
				:body="`Keep full access until ${user.renewalDate}. On that date, instead of renewing, your subscription will pause for up to 3 months. No charges, no surprises. When you're ready, reactivate in one click at your current rate.`"
				cta-text="Pause My Subscription"
				@cta-click="handleOffer('pause-subscription')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="50% Off Your Next Renewal"
				:body="`Not interested in pausing? Keep your plan active at half the price. You'll save $${user.savings} on your next renewal and we'll send you a reminder 14 days before it's due.`"
				cta-text="Apply 50% Discount Instead"
				cta-type="blue"
				@cta-click="handleOffer('apply-50-discount')"
			/>
		</template>

		<template v-if="variant === 'C'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					{{ user.firstName }}, let us fix this before you go.
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					We're sorry you're dealing with this. Our senior support team can usually resolve plugin issues within 24 hours&mdash;and your plan stays active while we work on it.
				</p>
			</div>

			<OfferCard
				:primary="true"
				title="Priority Technical Support"
				body="We'll escalate your issue to a senior support specialist. You'll hear back within 24 hours with a fix or a clear update on what's happening. Your subscription stays fully active while we resolve it—no risk to you."
				cta-text="Yes, Fix My Issue First"
				@cta-click="handleOffer('priority-support')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="50% Off While We Work on It"
				body="If you'd rather keep your plan but at a lower cost while things get sorted, here's 50% off your next renewal."
				cta-text="Apply 50% Discount"
				cta-type="blue"
				@cta-click="handleOffer('apply-50-discount')"
			/>
		</template>

		<template v-if="variant === 'D'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					{{ user.firstName }}, before you switch&mdash;here's what you'd be giving up.
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					We want to make sure you have the full picture. Here are a few things AIOSEO offers that {{ competitorName }} doesn't&mdash;or charges extra for.
				</p>
			</div>

			<div class="aio-card-primary p-0 overflow-hidden">
				<div class="grid grid-cols-[1fr_90px_90px] sm:grid-cols-[1fr_120px_120px] text-[14px] font-bold">
					<div class="px-4 sm:px-6 py-3 text-brand-navy">Feature</div>
					<div class="px-3 py-3 text-center text-brand-green">AIOSEO</div>
					<div class="px-3 py-3 text-center text-text-muted">{{ competitorName }}</div>
				</div>

				<div
					v-for="adv in competitor.advantages"
					:key="adv.feature"
					class="grid grid-cols-[1fr_90px_90px] sm:grid-cols-[1fr_120px_120px] border-t border-border"
				>
					<div class="px-4 sm:px-6 py-3">
						<span class="text-[15px] font-bold text-brand-navy block">{{ adv.feature }}</span>
						<span class="text-[13px] text-text-muted block mt-0.5">{{ adv.detail }}</span>
					</div>
					<div class="px-3 py-3 flex items-center justify-center">
						<svg aria-hidden="true" class="w-5 h-5 text-brand-green" viewBox="0 0 20 20" fill="none">
							<path d="M4 10l4 4 8-8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</div>
					<div class="px-3 py-3 flex items-center justify-center">
						<svg aria-hidden="true" class="w-5 h-5 text-brand-red" viewBox="0 0 20 20" fill="none">
							<path d="M14 6L6 14M6 6l8 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</div>
				</div>

				<div class="border-t border-border px-4 sm:px-6 py-5 flex flex-col sm:flex-row gap-3">
					<button @click="keepPlan" class="aio-btn-green">
						Keep My AIOSEO Plan
					</button>
					<a href="https://aioseo.com/feature-comparison/" target="_blank" rel="noopener noreferrer" class="aio-btn-outline-blue no-underline">
						See Full Comparison
					</a>
				</div>
			</div>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="50% Off Your Next Renewal"
				body="Still thinking about it? Stay for half the price and see how AIOSEO's latest updates compare. If you're still not satisfied after your next renewal, you can always cancel then."
				cta-text="Apply 50% Discount"
				cta-type="blue"
				@cta-click="handleOffer('apply-50-discount')"
			/>
		</template>

		<template v-if="variant === 'E'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					{{ user.firstName }}, you might already have what you need.
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					AIOSEO has a lot of features under the hood. Our team can help you find the right one&mdash;or hear about what's missing.
				</p>
			</div>

			<OfferCard
				:primary="true"
				title="Let Us Take a Look"
				body="Before you cancel, let our support team check if there's a feature or workaround that does what you need. You'd be surprised how often the answer is already built in. It'll take a few minutes—and your plan stays active while we look into it."
				cta-text="Yes, Let Me Talk to Someone"
				@cta-click="handleOffer('talk-to-support')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="Submit a Feature Request"
				body="If AIOSEO doesn't do what you need yet, tell us. Feature requests go directly to our product team and help shape what we build. You can also browse requests from other users to upvote ideas you care about."
				cta-text="Submit a Feature Request"
				cta-type="blue"
				@cta-click="handleOffer('feature-request')"
			/>
		</template>

		<template v-if="variant === 'F'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					{{ user.firstName }}, your license doesn't have to go with the site.
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					Plans change. Instead of cancelling, you can pause your subscription and reactivate whenever you're ready&mdash;even on a different site.
				</p>
			</div>

			<OfferCard
				:primary="true"
				title="Pause Your Subscription for Up to 3 Months"
				:body="`Keep full access until ${user.renewalDate}. On that date, your subscription pauses instead of renewing. No charges during the pause. If you launch a new site, reactivate in one click and your license transfers over.`"
				cta-text="Pause My Subscription"
				@cta-click="handleOffer('pause-subscription')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="Transfer Your License to Another Site"
				body="If you have another WordPress site, you can move your AIOSEO license there right now. No extra cost, no new purchase."
				cta-text="Transfer My License"
				cta-type="blue"
				@cta-click="handleOffer('transfer-license')"
			/>
		</template>

		<template v-if="variant === 'H'">
			<div class="text-center mb-8">
				<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
					We've got an exclusive offer for you, {{ user.firstName }}.
				</h2>
				<p class="text-[16px] text-text-muted mt-3 max-w-[520px] mx-auto">
					Before you finalize, here's a chance to keep everything you have at a lower price.
				</p>
			</div>

			<OfferCard
				:primary="true"
				:badge="`Save $${user.savings}`"
				title="50% Off Your Next Renewal"
				:body="`Keep your full ${user.planName} plan—every feature, every integration, priority support—for half the price on your next renewal.`"
				cta-text="Yes, Apply My 50% Discount"
				@cta-click="handleOffer('apply-50-discount')"
			/>

			<div class="aio-or-divider">or</div>

			<OfferCard
				title="Pause Your Subscription"
				:body="`Not the right time? Pause for up to 3 months. You'll keep full access until ${user.renewalDate}, and nothing will be charged during the pause.`"
				cta-text="Pause Instead"
				cta-type="blue"
				@cta-click="handleOffer('pause-subscription')"
			/>
		</template>

		<div class="text-center mt-8">
			<button @click="handleSaveOfferSkip" class="aio-link-skip">
				No thanks, continue cancelling
			</button>
		</div>
	</div>
</template>
```

- [ ] **Step 2: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0 (or remaining view import errors).

- [ ] **Step 3: Visual verification — test each variant**

```bash
cd ~/dev/aioseo-account && npm run dev
```
Then in a terminal or browser, manually drive through each variant by selecting a matching reason on `/cancel/reason`:
- Reason #5 (Too Expensive) → variant A (50% off + smaller plan)
- Reason #6 (Auto-Renewal) → variant B (pause, with reminder line for "Charged unexpectedly"/"Forgot to cancel")
- Reason #1 (Technical) → variant C (priority support)
- Reason #3 (Switching) → variant D (competitor comparison table). Test each dropdown value: verify competitor name & advantages change.
- Reason #2 (Missing Features) → variant E (talk to support)
- Reason #4 (Site Closed) → variant F (pause + transfer license)
- Reason #10 (Other) → variant H (50% off + pause)

Compare each to prototype side-by-side.

- [ ] **Step 4: Commit**

```bash
cd ~/dev/aioseo-account && git add src/views/cancel/Step3SaveOffer.vue && git commit -m "feat(cancel): port Step3SaveOffer with all 8 variants (A-H)"
```

---

## Task 14: Port Step3VariantG

**Files:**
- Create: `src/views/cancel/Step3VariantG.vue`

- [ ] **Step 1: Create Step3VariantG.vue**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'
import { cancellationMockUser } from '@/data/cancellationMockUser'

const router = useRouter()
const store = useCancellationStore()
const user = cancellationMockUser

type SubOptionId = 'no-time' | 'dont-know' | 'no-need' | 'no-results'
interface SubOption {
	id: SubOptionId
	label: string
	description: string
	offer: { title: string; body: string; cta: string }
}

const selectedOption = ref<SubOptionId | null>(null)

const subOptions: SubOption[] = [
	{
		id: 'no-time',
		label: "No time to set it up",
		description: "We'll configure everything for you in ~15 minutes",
		offer: {
			title: "We'll Set It Up for You",
			body: "Our team can configure AIOSEO for your site in about 15 minutes. Once it's set up, it mostly runs on its own—sitemaps generate automatically, TruSEO scores update as you write, and the Redirection Manager catches broken links in the background.",
			cta: 'Yes, Set It Up for Me',
		},
	},
	{
		id: 'dont-know',
		label: "Not sure how to use it",
		description: "Book a free 15-minute walkthrough with our team",
		offer: {
			title: 'Free Walkthrough With Our Team',
			body: "Book a 15-minute session and we'll show you the ropes. We'll walk through the features that matter most for your site, answer your questions, and make sure you're comfortable. No cost, no commitment.",
			cta: 'Yes, Walk Me Through It',
		},
	},
	{
		id: 'no-need',
		label: "Don't need SEO right now",
		description: "Pause for up to 3 months — reactivate anytime",
		offer: {
			title: 'Pause Your Subscription',
			body: "No problem—pause instead of cancelling. You'll keep full access until your renewal date, then your subscription freezes for up to 3 months. When you're ready to focus on SEO again, reactivate in one click.",
			cta: 'Pause My Subscription',
		},
	},
	{
		id: 'no-results',
		label: "Tried it, didn't see results",
		description: "Let our team review your setup and find what's off",
		offer: {
			title: 'Let Us Review Your Setup',
			body: "Results depend a lot on how AIOSEO is configured for your specific site. Our team can review your settings, check for misconfigurations, and suggest changes that could make a real difference. Your plan stays active while we look into it.",
			cta: 'Yes, Review My Setup',
		},
	},
]

const selectedOffer = computed(() => subOptions.find(o => o.id === selectedOption.value)?.offer ?? null)

function selectOption(id: SubOptionId) {
	selectedOption.value = selectedOption.value === id ? null : id
}

function handleOfferAction(action: string) {
	alert(`Action: ${action} (prototype)`)
}

function handleSaveOfferSkip() {
	store.skipOffer(router)
}
</script>

<template>
	<div class="max-w-[680px] mx-auto">
		<div class="text-center mb-8">
			<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
				{{ user.firstName }}, we'd love to help. What's getting in the way?
			</h2>
			<p class="text-[16px] text-text-muted mt-3 max-w-[480px] mx-auto">
				Pick the one that sounds most like you.
			</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
			<button
				v-for="opt in subOptions"
				:key="opt.id"
				@click="selectOption(opt.id)"
				:aria-pressed="selectedOption === opt.id"
				:class="[
					'aio-card aio-card-interactive text-left p-4 sm:p-5 flex items-start gap-3',
					selectedOption === opt.id ? 'selected' : ''
				]"
			>
				<div :class="[
					'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors',
					selectedOption === opt.id ? 'bg-brand-green text-white' : 'bg-brand-blue-5 text-brand-blue'
				]">
					<svg v-if="opt.id === 'no-time'" aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
					</svg>
					<svg v-else-if="opt.id === 'dont-know'" aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 18.72a9.094 9.094 0 003.741-7.347C21.741 5.725 17.02 1.286 11.346 1.514 5.672 1.742 1.195 6.518 1.427 12.165c.204 4.9 3.869 9.02 8.573 9.835"/>
						<path d="M12 17h.01M12 13.5a3.5 3.5 0 10-3.5-3.5"/>
					</svg>
					<svg v-else-if="opt.id === 'no-need'" aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
					</svg>
					<svg v-else-if="opt.id === 'no-results'" aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
					</svg>
				</div>
				<div>
					<span class="text-[15px] font-bold text-brand-navy leading-snug block mb-1">{{ opt.label }}</span>
					<span class="text-[13px] text-text-muted leading-snug block">{{ opt.description }}</span>
				</div>
			</button>
		</div>

		<transition name="cancel-fade">
			<div v-if="selectedOffer" class="aio-card mb-6">
				<h3 class="text-[20px] font-bold text-brand-navy m-0 mb-3">
					{{ selectedOffer.title }}
				</h3>
				<p class="text-[16px] text-brand-navy-60 leading-relaxed m-0 mb-5">
					{{ selectedOffer.body }}
				</p>
				<button
					@click="handleOfferAction(selectedOffer.cta)"
					class="aio-btn-green"
				>
					{{ selectedOffer.cta }}
				</button>
			</div>
		</transition>

		<div class="aio-or-divider">or</div>

		<div class="aio-card">
			<h3 class="text-[20px] font-bold text-brand-navy m-0 mb-3">
				50% Off Your Next Renewal
			</h3>
			<p class="text-[16px] text-brand-navy-60 leading-relaxed m-0 mb-5">
				None of the above? Keep your plan at half the price and give it another shot.
			</p>
			<button @click="handleOfferAction('apply-50-discount')" class="aio-btn-outline-blue">
				Apply 50% Discount
			</button>
		</div>

		<div class="text-center mt-8">
			<button @click="handleSaveOfferSkip" class="aio-link-skip">
				No thanks, continue cancelling
			</button>
		</div>
	</div>
</template>
```

- [ ] **Step 2: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0 (or remaining view import errors).

- [ ] **Step 3: Visual verification**

```bash
cd ~/dev/aioseo-account && npm run dev
```
Navigate: `/cancel/reason` → select reason #7 ("I'm not using the product") → lands on `/cancel/offer/not-using`.
- 4 sub-option cards in 2×2 grid
- Clicking a card highlights it (blue border + shadow, green icon bg)
- Selected card reveals matching offer below with fade transition
- "Apply 50% Discount" secondary offer always visible

- [ ] **Step 4: Commit**

```bash
cd ~/dev/aioseo-account && git add src/views/cancel/Step3VariantG.vue && git commit -m "feat(cancel): port Step3VariantG with 4 sub-options"
```

---

## Task 15: Port Step4LossSummary

**Files:**
- Create: `src/views/cancel/Step4LossSummary.vue`

- [ ] **Step 1: Create Step4LossSummary.vue**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'
import { cancellationMockUser } from '@/data/cancellationMockUser'
import { cancellationLossItems } from '@/data/cancellationLossItems'

const router = useRouter()
const store = useCancellationStore()
const user = cancellationMockUser

const confirmed = ref(false)
const showCheckboxWarning = ref(false)

const items = computed(() => cancellationLossItems[user.planKey] ?? cancellationLossItems.elite)

function attemptCancel() {
	if (!confirmed.value) {
		showCheckboxWarning.value = true
		return
	}
	store.confirmCancel(router)
}

function handlePause() {
	alert('Pausing subscription... (prototype)')
}

function onCheckboxChange() {
	showCheckboxWarning.value = false
}

function keepPlan() {
	store.keepPlan(router)
}
</script>

<template>
	<div class="max-w-[680px] mx-auto">
		<div class="text-center mb-8">
			<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
				Here's what your site loses on {{ user.renewalDate }}
			</h2>
			<p class="text-body-lg mt-3 max-w-[520px] mx-auto">
				Your {{ user.planName }} plan expires on {{ user.renewalDate }}. Everything below stops working for your site.
			</p>
		</div>

		<div class="aio-stagger-reveal space-y-3 mb-8">
			<div
				v-for="(item, idx) in items"
				:key="idx"
				class="aio-loss-item"
			>
				<div class="aio-loss-item-icon">
					<svg aria-hidden="true" class="w-5 h-5 text-brand-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
						<path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
				<div>
					<h4 class="text-[17px] font-bold text-brand-navy m-0 mb-1">{{ item.title }}</h4>
					<p class="text-[15px] text-brand-navy-60 leading-relaxed m-0">{{ item.body }}</p>
				</div>
			</div>
		</div>

		<div class="aio-card bg-brand-blue-5 mb-6 py-5 px-6">
			<div class="flex items-start gap-3">
				<svg aria-hidden="true" class="w-5 h-5 mt-0.5 shrink-0 text-brand-blue" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
				</svg>
				<div>
					<p class="text-[15px] text-brand-navy m-0">
						Your <strong>{{ user.planName }}</strong> covers {{ user.sites }} site(s) and includes {{ user.aiCredits }} AI Credits.
					</p>
					<p class="text-[15px] text-brand-navy m-0 mt-1.5">
						You've been with AIOSEO for <strong>{{ user.tenure }}</strong>. We'd hate to see that go.
					</p>
				</div>
			</div>
		</div>

		<div class="relative mb-6 aio-cancel-checkbox">
			<label class="flex items-start gap-3 cursor-pointer p-4 rounded-card border border-border bg-white hover:border-brand-blue/30 transition-colors">
				<input
					type="checkbox"
					v-model="confirmed"
					@change="onCheckboxChange"
					class="shrink-0 mt-0.5"
				>
				<span class="text-[15px] text-brand-navy leading-relaxed">
					I understand I will lose <strong>all of the above</strong> when my plan expires on {{ user.renewalDate }}.
				</span>
			</label>

			<transition name="cancel-fade">
				<div
					v-if="showCheckboxWarning"
					role="alert"
					class="absolute top-full left-0 mt-2 p-4 bg-white border border-brand-amber rounded-card shadow-[0_4px_20px_rgba(20,27,56,0.12)] z-10 max-w-[400px]"
				>
					<p class="text-[15px] text-brand-navy m-0">
						Please confirm you've reviewed the features you'll lose when your plan expires.
					</p>
				</div>
			</transition>
		</div>

		<div class="text-center space-y-4">
			<button @click="keepPlan" class="aio-btn-green w-full max-w-[400px]">
				Keep My Plan
			</button>

			<div class="flex items-center justify-center gap-6">
				<button @click="handlePause" class="text-[15px] text-brand-blue hover:underline bg-transparent border-none cursor-pointer font-bold">
					Pause My Subscription Instead
				</button>
				<span class="text-border">|</span>
				<button
					@click="attemptCancel"
					:class="[
						'text-[14px] bg-transparent border-none cursor-pointer transition-colors',
						!confirmed ? 'text-text-muted/40 cursor-not-allowed' : 'text-text-muted hover:text-brand-navy-60'
					]"
				>
					Confirm Cancellation
				</button>
			</div>
		</div>
	</div>
</template>
```

- [ ] **Step 2: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0 (or remaining import errors).

- [ ] **Step 3: Visual verification — test all 4 plan tiers**

```bash
cd ~/dev/aioseo-account && npm run dev
```
Navigate to `/cancel/review` (will redirect to reason if no reason selected — select reason #10 "Other" with text, skip offer to get there).

Verify:
- 3 plan-specific loss items + 1 shared item render with stagger animation
- Blue info card shows correct plan name, sites, AI credits, tenure
- Clicking "Confirm Cancellation" before checkbox → shows warning tooltip, does NOT navigate
- Check checkbox → warning disappears
- "Confirm Cancellation" text transitions from disabled (40% opacity) to enabled
- Clicking confirmed "Confirm Cancellation" → navigates to `/cancel/confirmation`
- "Keep My Plan" returns to `/billing`

Then change `cancellationMockUser.planKey` temporarily to 'basic', 'plus', 'pro' and verify different loss items render for each. Revert to 'elite'.

- [ ] **Step 4: Commit**

```bash
cd ~/dev/aioseo-account && git add src/views/cancel/Step4LossSummary.vue && git commit -m "feat(cancel): port Step4LossSummary with plan-tier loss items and gated confirm"
```

---

## Task 16: Port Step5Confirmation

**Files:**
- Create: `src/views/cancel/Step5Confirmation.vue`

- [ ] **Step 1: Create Step5Confirmation.vue**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { cancellationMockUser } from '@/data/cancellationMockUser'
import CrossPromoCard from '@/components/cancel/CrossPromoCard.vue'

const user = cancellationMockUser
const copied = ref(false)

function copyCode() {
	navigator.clipboard.writeText('WELCOMEBACK')
	copied.value = true
	setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
	<div class="max-w-[680px] mx-auto">
		<div class="text-center mb-8">
			<h2 class="text-[26px] sm:text-[36px] font-bold text-brand-navy tracking-[-0.54px] leading-[32px] sm:leading-[43px] m-0">
				{{ user.firstName }}, you're still part of the AIOSEO community.
			</h2>
			<p class="text-body-lg mt-3 max-w-[480px] mx-auto">
				Your subscription has been cancelled. Thank you for being a customer&mdash;we hope to see you again.
			</p>
		</div>

		<div class="flex items-start gap-3 p-5 bg-brand-green-5 border border-green-200/60 rounded-card mb-6">
			<svg aria-hidden="true" class="w-6 h-6 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none">
				<circle cx="12" cy="12" r="10" fill="#00AA63"/>
				<path d="M8 12l3 3 5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			<p class="text-[15px] text-brand-navy m-0 leading-relaxed">
				Your license stays active until <strong>{{ user.renewalDate }}</strong>. After that date, your license will expire and you won't be billed again.
			</p>
		</div>

		<div class="aio-card text-center mb-6 py-8">
			<h3 class="text-[23px] font-bold text-brand-navy m-0 mb-2">Changed your mind?</h3>
			<p class="text-body m-0 mb-4">Use code</p>
			<div class="coupon mb-3 mx-auto" @click="copyCode" role="button" tabindex="0" aria-label="Copy coupon code WELCOMEBACK">
				<div class="coupon-inner">
					<span class="coupon-code">WELCOMEBACK</span>
					<svg v-if="!copied" aria-hidden="true" class="coupon-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
					</svg>
					<svg v-else aria-hidden="true" class="coupon-copy text-brand-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M20 6L9 17l-5-5"/>
					</svg>
				</div>
				<p class="coupon-hint m-0">{{ copied ? 'Copied!' : 'Click to copy' }}</p>
			</div>
			<p class="text-body m-0 mb-6 max-w-[400px] mx-auto">
				Use this code for 50% off when you resubscribe within 30 days.
			</p>
			<button class="aio-btn-green">
				Reactivate My Plan
			</button>
		</div>

		<p class="text-overline mb-4">From the Awesome Motive family</p>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center sm:[&>*]:justify-self-stretch">
			<CrossPromoCard
				name="WPForms"
				description="Beautiful contact forms in minutes, no coding required."
				url="https://wpforms.com/"
			>
				<template #logo>
					<img src="https://ps.w.org/wpforms-lite/assets/icon-256x256.png" alt="WPForms" class="w-10 h-10 rounded-lg" loading="lazy" />
				</template>
			</CrossPromoCard>
			<CrossPromoCard
				name="MonsterInsights"
				description="See the Google Analytics stats that matter, right in your dashboard."
				url="https://www.monsterinsights.com/"
			>
				<template #logo>
					<img src="https://ps.w.org/google-analytics-for-wordpress/assets/icon-256x256.png" alt="MonsterInsights" class="w-10 h-10 rounded-lg" loading="lazy" />
				</template>
			</CrossPromoCard>
			<CrossPromoCard
				name="Broken Link Checker"
				description="Find and fix broken links. Protect your SEO and user experience."
				url="https://aioseo.com/broken-link-checker/"
			>
				<template #logo>
					<img src="/broken-link-checker-icon.svg" alt="Broken Link Checker" class="w-10 h-10 rounded-lg" loading="lazy" />
				</template>
			</CrossPromoCard>
		</div>
	</div>
</template>

<style>
.coupon { display: inline-block; cursor: pointer; max-width: 320px; width: 100%; }
.coupon-inner {
	display: flex; align-items: center; justify-content: center; gap: 12px;
	padding: 14px 20px;
	border: 2px dashed var(--color-border);
	border-radius: var(--radius-card);
	background: #F7F8FA;
	transition: border-color 0.15s ease, background-color 0.15s ease;
}
.coupon:hover .coupon-inner {
	border-color: var(--color-brand-blue);
	background: var(--color-brand-blue-10);
}
.coupon-code {
	font-size: 20px; font-weight: 700; letter-spacing: 3px;
	color: var(--color-brand-navy);
}
.coupon-copy { width: 18px; height: 18px; color: var(--color-text-muted); flex-shrink: 0; }
.coupon:hover .coupon-copy { color: var(--color-brand-blue); }
.coupon-hint { font-size: 12px; color: var(--color-text-muted); margin-top: 6px; }
</style>
```

- [ ] **Step 2: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0 (or only BypassSupport/BypassPlanMgmt errors remaining).

- [ ] **Step 3: Visual verification**

```bash
cd ~/dev/aioseo-account && npm run dev
```
Drive through to `/cancel/confirmation` (select reason → skip offer → check Step 4 box → Confirm Cancellation).

Verify:
- Green "license active until..." card
- Coupon code box with dashed border, clickable to copy
- "Copied!" state toggles for 2 seconds
- 3 cross-promo cards render with logos
- Progress bar shows step 5/5

- [ ] **Step 4: Commit**

```bash
cd ~/dev/aioseo-account && git add src/views/cancel/Step5Confirmation.vue && git commit -m "feat(cancel): port Step5Confirmation with reactivation code and cross-promo"
```

---

## Task 17: Port BypassSupport and BypassPlanMgmt

**Files:**
- Create: `src/views/cancel/BypassSupport.vue`
- Create: `src/views/cancel/BypassPlanMgmt.vue`

- [ ] **Step 1: Create BypassSupport.vue**

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'

const router = useRouter()
const store = useCancellationStore()

function continueCancel() {
	store.skipOffer(router)
}
</script>

<template>
	<div class="max-w-[720px] mx-auto">
		<div class="aio-card text-center">
			<h2 class="text-[23px] font-bold text-brand-navy m-0 mb-3">
				Let Us Help With Your Duplicate Subscription
			</h2>
			<p class="text-[16px] text-brand-navy-60 leading-relaxed mb-6">
				It looks like you have a duplicate subscription. Our billing team can resolve this quickly—no need to cancel.
				We'll get this sorted for you.
			</p>
			<div class="bg-brand-blue-5 rounded-card p-6 mb-6 text-left">
				<p class="text-[14px] text-text-muted m-0 mb-2 uppercase font-bold tracking-wide">
					Category: Duplicate Subscription / Billing Issue
				</p>
				<p class="text-[16px] text-brand-navy-60 m-0">
					A support ticket has been pre-filled for you. Our team will review your subscriptions and apply the appropriate credit or cancellation.
				</p>
			</div>
			<button class="aio-btn-green mb-4">
				Contact Billing Support
			</button>
			<div class="mt-4">
				<button @click="continueCancel" class="aio-link-skip">
					I still want to cancel
				</button>
			</div>
		</div>
	</div>
</template>
```

- [ ] **Step 2: Create BypassPlanMgmt.vue**

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'
import { cancellationMockUser } from '@/data/cancellationMockUser'

const router = useRouter()
const store = useCancellationStore()
const user = cancellationMockUser

function continueCancel() {
	store.skipOffer(router)
}
</script>

<template>
	<div class="max-w-[720px] mx-auto">
		<div class="aio-card text-center">
			<h2 class="text-[23px] font-bold text-brand-navy m-0 mb-3">
				Want to Change Your Plan?
			</h2>
			<p class="text-[16px] text-brand-navy-60 leading-relaxed mb-6">
				Great news—you don't need to cancel to switch plans! You can upgrade or downgrade your
				{{ user.planName }} plan directly from your account.
			</p>
			<button class="aio-btn-green mb-4">
				Switch to Different Plan
			</button>
			<div class="mt-4">
				<button @click="continueCancel" class="aio-link-skip">
					I still want to cancel
				</button>
			</div>
		</div>
	</div>
</template>
```

- [ ] **Step 3: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0 (fully clean now — all views exist).

- [ ] **Step 4: Visual verification**

```bash
cd ~/dev/aioseo-account && npm run dev
```
- Navigate to `/cancel/reason`, select reason #8 ("duplicate subscription") → lands on `/cancel/duplicate-subscription`
- Back button returns to `/cancel/reason`
- "I still want to cancel" button navigates to `/cancel/review`
- Progress bar shows "Step 3 of 5"
- Navigate back, select reason #9 ("upgrade/downgrade") → lands on `/cancel/change-plan`. Same verifications.

- [ ] **Step 5: Commit**

```bash
cd ~/dev/aioseo-account && git add src/views/cancel/BypassSupport.vue src/views/cancel/BypassPlanMgmt.vue && git commit -m "feat(cancel): port BypassSupport and BypassPlanMgmt views"
```

---

## Task 18: Wire Billing entry point + end-to-end smoke test

**Files:**
- Modify: `src/views/BillingView.vue:285-293` (add click handler to existing Cancel Subscription button)

- [ ] **Step 1: Add router import to BillingView script**

Open `src/views/BillingView.vue`. In the `<script setup lang="ts">` block (starts at line 1), after the existing `import BaseModal from '@/components/BaseModal.vue'` line, add:

```typescript
import { useRouter } from 'vue-router'
```

Then, after the existing `const baseUrl = import.meta.env.BASE_URL` line, add:

```typescript
const router = useRouter()

function openCancellationFlow() {
	showManageSub.value = false
	router.push({ name: 'cancel-support' })
}
```

- [ ] **Step 2: Wire the Cancel Subscription button**

In `src/views/BillingView.vue`, find the button at line 285 that starts with `<button class="w-full flex items-center gap-4 p-4 border border-border rounded-card hover:border-brand-red`. Add `@click="openCancellationFlow"` to it:

```html
<button @click="openCancellationFlow" class="w-full flex items-center gap-4 p-4 border border-border rounded-card hover:border-brand-red hover:bg-brand-red/5 transition-all duration-200 cursor-pointer bg-white text-left group">
```

- [ ] **Step 3: Type-check**

```bash
cd ~/dev/aioseo-account && npm run type-check
```
Expected: exit 0.

- [ ] **Step 4: Full end-to-end smoke test**

```bash
cd ~/dev/aioseo-account && npm run dev
```

Walk through the complete flow:
1. Open `http://localhost:5173/billing`
2. Click "Manage" on any subscription row → modal opens
3. Click "Cancel Subscription" → modal closes, app navigates to `/cancel/support` (takeover chrome appears, account sidebar/tabs disappear)
4. Click "None of these apply" → `/cancel/reason`
5. Select reason #5 (Too Expensive) → dropdown appears → select "Lower renewal price" → Continue Cancelling
6. Lands on `/cancel/offer` with variant A (50% off headline)
7. Click "No thanks, continue cancelling" → `/cancel/review`
8. Loss items render, check confirmation box
9. Click "Confirm Cancellation" → `/cancel/confirmation`
10. Click "Reactivate My Plan" button (will stub) — verify no navigation
11. Manually navigate to `/billing` in URL → account shell returns
12. Click Cancel Subscription again → fresh flow (store reset? verify store still has selectedReason from previous flow — this is fine since we rely on route guards; selectedReason just stays until keepPlan/reset is called)

Also test:
- Deep-link guards: open `/cancel/offer` in a new incognito tab → should redirect to `/cancel/reason`
- Back button on each step: returns to expected prior step
- Browser back/forward buttons work

- [ ] **Step 5: Commit**

```bash
cd ~/dev/aioseo-account && git add src/views/BillingView.vue && git commit -m "feat(cancel): wire cancellation flow entry point from Billing modal"
```

---

## Final Verification Checklist

After all 18 tasks complete, run one final pass:

- [ ] `cd ~/dev/aioseo-account && npm run type-check` → exit 0
- [ ] `cd ~/dev/aioseo-account && npm run build` → succeeds (Vite production build)
- [ ] All 10 reasons navigate to expected variant/bypass routes
- [ ] All 4 plan tiers (basic/plus/pro/elite) render correct loss items on Step 4
- [ ] Deep-link guards redirect unauthorized access
- [ ] Back button is present on steps 2-4 and bypass routes, absent on steps 1 and 5
- [ ] Progress bar shows correct step number (bypass routes show "Step 3 of 5")
- [ ] Reduced-motion preference disables animations (test in DevTools → Rendering → Emulate prefers-reduced-motion)
- [ ] Keyboard navigation works through all form fields
- [ ] No console errors in browser during full flow walkthrough

---

## Appendix: Scope Coverage

Mapping from spec requirements → tasks:

| Spec requirement | Task |
|---|---|
| TS types: Reason, FollowUp, SaveOfferVariant, PlanTier, LossItem, Competitor | Task 1 |
| Pinia store replacing provide/inject | Task 4 |
| Full-screen takeover layout | Task 7 |
| 9 routes with navigation guards | Task 8 |
| Port data modules to TS | Task 3 |
| Add flow-specific CSS to main.css | Task 2 |
| Port PlanSidebar | Task 10 |
| Port OfferCard, CrossPromoCard, SupportBanner | Task 9 |
| Progress bar component | Task 6 |
| Port Step1Support | Task 11 |
| Port Step2Reasons | Task 12 |
| Port Step3SaveOffer (8 variants) | Task 13 |
| Port Step3VariantG | Task 14 |
| Port Step4LossSummary (4 tiers, gated checkbox) | Task 15 |
| Port Step5Confirmation (coupon, cross-promo) | Task 16 |
| Port BypassSupport, BypassPlanMgmt | Task 17 |
| Billing entry point wiring | Task 18 |
| Exit CTAs (Keep My Plan, Contact Support, Manage Plan, Back to Account) | Built into store actions (Task 4) + individual views (Tasks 11-17) |
| Public assets (dashboard-illustration, BLC icon) | Task 5 |
| Mock user TS port (with TODO for useSubscriptions reconciliation) | Task 3 |
