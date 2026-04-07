# Downloads Page — Figma Design Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild DownloadsView.vue to pixel-match the Figma design at `figma.com/design/fjIJKtHQjHUW5RmEKsi5Yb` node `2210:4780`, fixing all 27 discrepancies identified in the audit.

**Architecture:** Replace the current table-based card layout with flex-based sections matching Figma's structure. Each card type (AIOSEO, BLC, AI Credits) is built inline in DownloadsView.vue using shared utility patterns. Addon items are rebuilt from card-grid to inline icon-box + text-column layout.

**Tech Stack:** Vue 3 `<script setup lang="ts">`, Tailwind v4 `@theme` tokens, Pinia, vite-svg-loader

**Figma reference screenshots** (captured from MCP, valid descriptions):
- **Basic card**: AIOSEO icon + "Upgrade License" (blue) + "Download AIOSEO" (green) buttons. Body: 2 rows of label/value pairs as flex sections. Addons: 4 items inline with bordered icon boxes. Footer: solid #eaf1fc "See Upgrade Options".
- **Elite card**: Same but no "Upgrade License" button, 8 addons in 2 rows, no upgrade footer.
- **BLC card**: Skeuomorphic boxed BLC icon + "Upgrade License" (blue) + "Broken Link Checker" (green). Body: Plan Level / License / Expires + Site Activations / Links. No addons, no upgrade toggle.
- **AI Credits card**: AI Credits icon + "Purchase Credits" (green). Body: AI Credits remaining + Expires. 2-column layout with 170px gap.
- **Upgrade panel**: Blue #eaf1fc outer wrapper with white inner card, border #d5e4ff, title Semibold 23.4px, subtitle Regular 18px, 3x2 grid of green circle checkmarks, blue CTA button at 18px.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/assets/main.css` | Modify | Add 3 missing color tokens, new `.aio-addon-box` class |
| `src/types/license.ts` | Modify | Add `isNew?: boolean` to `Addon` interface |
| `src/data/addons.ts` | Modify | Add `isNew: true` for Image SEO and IndexNow |
| `src/views/DownloadsView.vue` | **Rewrite** | Rebuild from tables to flex sections matching Figma |

**Files NOT modified** (not used on Downloads page, separate concern):
- `src/components/LicenseCard.vue` — used on sub-tab views, not DownloadsView
- `src/components/AddonCard.vue` — will not be used; addon pattern is inline

---

## Task 1: Add Missing Design Tokens

**Files:**
- Modify: `src/assets/main.css:27-82` (@theme block)

- [ ] **Step 1: Add 3 missing color tokens to @theme block**

In `src/assets/main.css`, add these tokens inside the `@theme { }` block, after the existing color definitions (after line 51, before `/* Font families */`):

```css
  /* Downloads-specific backgrounds */
  --color-bg-addons: #f8fafe;
  --color-bg-upgrade: #eaf1fc;
  --color-border-upgrade: #d5e4ff;
```

- [ ] **Step 2: Add `.aio-addon-box` component class**

In `src/assets/main.css`, add this inside `@layer components { }` (after `.aio-addon-icon` block, around line 370):

```css
  /* Addon icon — bordered box containing blue circle avatar */
  .aio-addon-box {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-card);
    padding: 12px;
    background: white;
    position: relative;
    flex-shrink: 0;
  }
  .aio-addon-box .aio-addon-circle {
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    background-color: var(--color-brand-blue);
    border: 1px solid rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .aio-addon-box .aio-addon-circle svg {
    width: 24px;
    height: 24px;
    fill: white;
  }
  .aio-addon-box .aio-addon-circle svg path {
    fill: white;
  }

  /* "NEW" badge below addon icon */
  .aio-addon-new-badge {
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-brand-green);
    color: white;
    font-size: 9.5px;
    font-weight: 400;
    letter-spacing: 0.25px;
    text-transform: uppercase;
    padding: 4px 8px;
    border-radius: 3px;
    line-height: 11px;
    white-space: nowrap;
    min-width: 42px;
    text-align: center;
  }
```

- [ ] **Step 3: Add `.aio-blc-icon-box` for BLC skeuomorphic icon**

In the same `@layer components` section, add:

```css
  /* BLC product icon — skeuomorphic bordered box */
  .aio-blc-icon-box {
    display: flex;
    align-items: center;
    padding: 8px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-card);
    background: white;
    box-shadow:
      0 1px 2px var(--color-shadow-xs),
      inset 0 0 0 1px rgba(10, 13, 18, 0.18),
      inset 0 -2px 0 0 rgba(10, 13, 18, 0.05);
    flex-shrink: 0;
  }
  .aio-blc-icon-box img {
    width: 30px;
    height: 30px;
  }
```

- [ ] **Step 4: Verify dev server compiles without errors**

Run: `cd /Users/adam/dev/aioseo-account && npm run dev`

Open browser to confirm page loads. The Downloads page will still look the same since we haven't changed the view yet.

- [ ] **Step 5: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add src/assets/main.css
git commit -m "feat(downloads): add missing design tokens and component classes for Figma fidelity"
```

---

## Task 2: Add `isNew` Flag to Addon Type and Data

**Files:**
- Modify: `src/types/license.ts:7-15` (Addon interface)
- Modify: `src/data/addons.ts` (Image SEO and IndexNow entries)

- [ ] **Step 1: Add `isNew` to Addon interface**

In `src/types/license.ts`, add `isNew` as an optional boolean at the end of the `Addon` interface:

```typescript
export interface Addon {
	id: string
	name: string
	iconUrl: string
	downloadUrl: string
	helpUrl: string
	changelogUrl: string
	version: string
	isNew?: boolean
}
```

- [ ] **Step 2: Mark Image SEO and IndexNow as new in addon data**

In `src/data/addons.ts`, add `isNew: true` to the `image-seo` entry (after `version: '1.2.3'`, line 12):

```typescript
	'image-seo': {
		id: 'image-seo',
		name: 'Image SEO',
		iconUrl: '/assets/icons/addon-image-seo.svg',
		downloadUrl: '#',
		helpUrl: 'https://aioseo.com/docs/using-the-image-seo-features-in-all-in-one-seo/',
		changelogUrl: 'https://aioseo.com/changelog/image-seo',
		version: '1.2.3',
		isNew: true,
	},
```

And add `isNew: true` to the `index-now` entry (after `version: '1.0.13'`, line 56):

```typescript
	'index-now': {
		id: 'index-now',
		name: 'IndexNow',
		iconUrl: '/assets/icons/addon-index-now.svg',
		downloadUrl: '#',
		helpUrl: 'https://aioseo.com/index-now',
		changelogUrl: 'https://aioseo.com/changelog/index-now',
		version: '1.0.13',
		isNew: true,
	},
```

- [ ] **Step 3: Verify type-check passes**

Run: `cd /Users/adam/dev/aioseo-account && npm run type-check`

Expected: No errors (isNew is optional, so existing data without it is fine).

- [ ] **Step 4: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add src/types/license.ts src/data/addons.ts
git commit -m "feat(downloads): add isNew flag to Addon type for NEW badge display"
```

---

## Task 3: Rebuild DownloadsView — BLC Card

This is the first card rewrite. We build BLC first because it's the simplest (no addons, no upgrade toggle).

**Files:**
- Modify: `src/views/DownloadsView.vue`

**Figma spec for BLC card (node 2240:3735):**
- Header: skeuomorphic BLC icon box (30px logo inside bordered+shadowed box) + "Broken Link Checker" Bold 18px + "Upgrade License" blue btn (h-36px) + "Broken Link Checker" green btn with download icon
- Body section 1: 3-column flex — Plan Level (flex-1) | License 352px + copy icon 18px | Expires (flex-1)
- Body section 2: 2-column flex — Site Activations 355px + "Manage Sites" underlined | Links (variable)
- Labels: Semibold 14px #8C8F9A (use `text-text-light`). Values: Regular 16px #141b38 (use `text-brand-navy`).
- Body padding: 24px all sides. Gap between rows: 24px. Border between sections: 1px solid #e9f0fc (≈ `border-border`).

- [ ] **Step 1: Replace BLC card template block**

In `src/views/DownloadsView.vue`, replace the entire BLC `<template v-for="lic in blcLicenses">` block (lines 41–93) with:

```html
		<!-- BLC licenses -->
		<template v-for="lic in blcLicenses" :key="lic.id">
			<div class="border border-border rounded-card shadow-xs bg-white">
				<!-- Header -->
				<div class="flex items-center gap-3 pl-3 pr-5 py-3 border-b border-border rounded-t-card">
					<div class="aio-blc-icon-box">
						<img :src="baseUrl + 'assets/icons/product-blc-card.svg'" alt="Broken Link Checker" />
					</div>
					<h2 class="flex-1 text-lg font-bold text-brand-navy leading-6">Broken Link Checker</h2>
					<a href="#" class="bg-brand-blue text-white text-sm font-semibold rounded-btn px-3 py-2 h-9 inline-flex items-center gap-1 no-underline hover:opacity-90 transition-opacity">
						Upgrade License
					</a>
					<a href="#" class="bg-brand-green text-white text-sm font-semibold rounded-btn px-3 py-2 inline-flex items-center gap-1 no-underline hover:opacity-90 transition-opacity">
						Broken Link Checker
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
					</a>
				</div>

				<!-- Body row 1: Plan Level / License / Expires -->
				<div class="flex items-start justify-between p-6 border-b border-border">
					<div class="flex-1 flex flex-col gap-1 min-w-0">
						<p class="text-sm font-semibold text-text-light">Plan Level</p>
						<p class="text-base text-brand-navy leading-[38px]">{{ lic.tierLabel }}</p>
					</div>
					<div class="flex flex-col gap-1 w-[352px]">
						<p class="text-sm font-semibold text-text-light">License</p>
						<div class="flex items-center gap-2">
							<p class="text-base text-brand-navy leading-[38px]">{{ lic.licenseKey }}</p>
							<button @click="copyKey(lic.licenseKey)" class="shrink-0 bg-transparent border-0 cursor-pointer p-0" :aria-label="copiedKey === lic.licenseKey ? 'Copied!' : 'Copy license key'">
								<svg v-if="copiedKey !== lic.licenseKey" class="w-[18px] h-[18px] text-brand-navy-40 hover:text-brand-navy transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
								<svg v-else class="w-[18px] h-[18px] text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
							</button>
						</div>
					</div>
					<div class="flex-1 flex flex-col gap-1 min-w-0">
						<p class="text-sm font-semibold text-text-light">Expires</p>
						<p class="text-base text-brand-navy leading-[38px]">{{ formatDate(lic.expiresAt) }}</p>
					</div>
				</div>

				<!-- Body row 2: Site Activations / Links -->
				<div class="flex items-start p-6 border-b border-border">
					<div class="flex flex-col gap-1 w-[355px]">
						<p class="text-sm font-semibold text-text-light">Site Activations</p>
						<div class="flex items-center gap-2 text-base text-brand-navy leading-[38px]">
							<span>{{ lic.siteActivations.used }} / {{ lic.siteActivations.total }}</span>
							<a href="#" class="text-base text-brand-navy underline hover:opacity-80 transition-opacity">Manage Sites</a>
						</div>
					</div>
					<div v-if="lic.links" class="flex flex-col gap-1">
						<p class="text-sm font-semibold text-text-light">Links</p>
						<p class="text-base text-brand-navy leading-[38px]">{{ formatNumber(lic.links.remaining || 0) }} / {{ formatNumber(lic.links.total || 0) }} Links Remaining</p>
					</div>
				</div>
			</div>
		</template>
```

- [ ] **Step 2: Add `baseUrl` to script setup**

The BLC icon needs `baseUrl`. If not already present, add to the `<script setup>` block (after the existing imports, around line 6):

```typescript
const baseUrl = import.meta.env.BASE_URL
```

- [ ] **Step 3: Verify in browser**

Run dev server, navigate to `/account/downloads`. Check BLC card renders with:
- Bordered BLC icon box (not a plain image)
- Two flex rows of label/value pairs (not tables)
- Correct label styling (14px semibold gray, not uppercase)
- Full license key shown (not truncated)

- [ ] **Step 4: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add src/views/DownloadsView.vue
git commit -m "feat(downloads): rebuild BLC card with flex layout matching Figma"
```

---

## Task 4: Rebuild DownloadsView — AI Credits Card

**Files:**
- Modify: `src/views/DownloadsView.vue`

**Figma spec for AI Credits card (node 2212:1532):**
- Header: AI Credits icon (46px) + "AI Credits" Bold 18px + "Purchase Credits" green btn (h-36px)
- Body: 2 columns with ~170px gap. Col 1 (w-398px): "AI Credits" label + "X / Y AI Credits Remaining" + "Purchase Credits" underlined link. Col 2 (flex-1): "Expires" label + date.
- Same label/value styling as BLC.

- [ ] **Step 1: Replace AI Credits card template block**

In `src/views/DownloadsView.vue`, replace the AI Credits `<div v-if="hasCredits">` block (lines 96–118) with:

```html
		<!-- AI Credits -->
		<div v-if="hasCredits" class="border border-border rounded-card shadow-xs bg-white">
			<!-- Header -->
			<div class="flex items-center gap-3 pl-3 pr-5 py-3 border-b border-border rounded-t-card">
				<ProductIcon product="ai-credits" :size="46" />
				<h2 class="flex-1 text-lg font-bold text-brand-navy leading-6">AI Credits</h2>
				<a href="#" class="bg-brand-green text-white text-sm font-semibold rounded-btn px-3 py-2 h-9 inline-flex items-center gap-1 no-underline hover:opacity-90 transition-opacity">
					Purchase Credits
				</a>
			</div>

			<!-- Body: AI Credits + Expires -->
			<div class="flex items-start gap-[170px] p-6 border-b border-border">
				<div class="flex flex-col gap-1 w-[398px]">
					<p class="text-sm font-semibold text-text-light">AI Credits</p>
					<div class="flex items-center gap-1.5 text-base text-brand-navy leading-[38px]">
						<span>{{ formatNumber(remaining) }} / {{ formatNumber(credits.total) }} AI Credits Remaining</span>
						<a href="#" class="text-base text-brand-navy underline hover:opacity-80 transition-opacity">Purchase Credits</a>
					</div>
				</div>
				<div class="flex-1 flex flex-col gap-1 min-w-0">
					<p class="text-sm font-semibold text-text-light">Expires</p>
					<p class="text-base text-brand-navy leading-[38px]">{{ formatDate(credits.expiresAt) }}</p>
				</div>
			</div>
		</div>
```

- [ ] **Step 2: Verify in browser**

Check AI Credits card shows:
- Two columns with wide gap (not table)
- "Purchase Credits" as underlined text link after remaining count
- Correct label styling

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add src/views/DownloadsView.vue
git commit -m "feat(downloads): rebuild AI Credits card with flex layout matching Figma"
```

---

## Task 5: Rebuild DownloadsView — AIOSEO Card (Header + Body)

This is the largest card. We split it: this task handles header + body rows. Task 6 handles addons. Task 7 handles upgrade toggle + panel.

**Files:**
- Modify: `src/views/DownloadsView.vue`

**Figma spec for AIOSEO header (nodes 2210:8022 / 2210:4954):**
- AIOSEO icon (46px, the existing product-aioseo-card.svg) + "AIOSEO" Bold 18px
- If tier !== elite: "Upgrade License" blue btn (h-36px) + "Download AIOSEO" green btn with download icon
- If tier === elite: only "Download AIOSEO" green btn

**Figma spec for AIOSEO body:**
- Row 1: Plan Level (flex-1) | License 352px + copy icon | Expires (flex-1)
- Row 2: Site Activations 355px + "Manage Sites" underlined | AI Credits (variable width)
  - If tier !== elite: AI Credits shows remaining + dot separator (6px circle) + "Running Low? Add More" (underlined)
  - If tier === elite: just remaining text, no "Running Low"

- [ ] **Step 1: Replace AIOSEO card template — header + body only**

In `src/views/DownloadsView.vue`, replace the entire AIOSEO `<template v-for="lic in aioseoLicenses">` block (lines 121–240) with this. Note: the addons section and upgrade panel are placeholders (`<!-- addons here -->`, `<!-- upgrade here -->`) — we fill them in Tasks 6 and 7.

```html
		<!-- AIOSEO licenses -->
		<template v-for="lic in aioseoLicenses" :key="lic.id">
			<div class="border border-border rounded-card shadow-xs bg-white">
				<!-- Header -->
				<div class="flex items-center gap-3 pl-3 pr-5 py-3 border-b border-border rounded-t-card">
					<ProductIcon product="aioseo" :size="46" />
					<h2 class="flex-1 text-lg font-bold text-brand-navy leading-6">AIOSEO</h2>
					<a v-if="lic.tier !== 'elite'" href="#" class="bg-brand-blue text-white text-sm font-semibold rounded-btn px-3 py-2 h-9 inline-flex items-center gap-1 no-underline hover:opacity-90 transition-opacity">
						Upgrade License
					</a>
					<a href="#" class="bg-brand-green text-white text-sm font-semibold rounded-btn px-3 py-2 inline-flex items-center gap-1 no-underline hover:opacity-90 transition-opacity">
						Download AIOSEO
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
					</a>
				</div>

				<!-- Body row 1: Plan Level / License / Expires -->
				<div class="flex items-start justify-between p-6 border-b border-border gap-6">
					<div class="flex-1 flex flex-col gap-1 min-w-0">
						<p class="text-sm font-semibold text-text-light">Plan Level</p>
						<p class="text-base text-brand-navy leading-[38px]">{{ lic.tierLabel }}</p>
					</div>
					<div class="flex flex-col gap-1 w-[352px]">
						<p class="text-sm font-semibold text-text-light">License</p>
						<div class="flex items-center gap-2">
							<p class="text-base text-brand-navy leading-[38px]">{{ lic.licenseKey }}</p>
							<button @click="copyKey(lic.licenseKey)" class="shrink-0 bg-transparent border-0 cursor-pointer p-0" :aria-label="copiedKey === lic.licenseKey ? 'Copied!' : 'Copy license key'">
								<svg v-if="copiedKey !== lic.licenseKey" class="w-[18px] h-[18px] text-brand-navy-40 hover:text-brand-navy transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
								<svg v-else class="w-[18px] h-[18px] text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
							</button>
						</div>
					</div>
					<div class="flex-1 flex flex-col gap-1 min-w-0">
						<p class="text-sm font-semibold text-text-light">Expires</p>
						<p class="text-base text-brand-navy leading-[38px]">{{ formatDate(lic.expiresAt) }}</p>
					</div>
				</div>

				<!-- Body row 2: Site Activations / AI Credits -->
				<div class="flex items-start p-6 border-b border-border">
					<div class="flex flex-col gap-1 w-[355px]">
						<p class="text-sm font-semibold text-text-light">Site Activations</p>
						<div class="flex items-center gap-2 text-base text-brand-navy leading-[38px]">
							<span>{{ lic.siteActivations.used }} / {{ lic.siteActivations.total }}</span>
							<a href="#" class="text-base text-brand-navy underline hover:opacity-80 transition-opacity">Manage Sites</a>
						</div>
					</div>
					<div v-if="lic.aiCredits" class="flex flex-col gap-1">
						<p class="text-sm font-semibold text-text-light">AI Credits</p>
						<div class="flex items-center gap-1.5 text-base text-brand-navy leading-[38px]">
							<span>{{ formatNumber(lic.aiCredits.total - lic.aiCredits.used) }} / {{ formatNumber(lic.aiCredits.total) }} AI Credits Remaining</span>
							<template v-if="lic.tier !== 'elite'">
								<span class="w-1.5 h-1.5 rounded-full bg-brand-navy inline-block shrink-0"></span>
								<span>Running Low? <a href="#" class="text-base text-brand-navy underline hover:opacity-80 transition-opacity">Add More</a></span>
							</template>
						</div>
					</div>
				</div>

				<!-- ADDONS SECTION — filled in Task 6 -->

				<!-- UPGRADE TOGGLE + PANEL — filled in Task 7 -->
			</div>
		</template>
```

- [ ] **Step 2: Remove old button string constants**

In `<script setup>`, remove the `btnBlue` and `btnGreen` constants (lines 33–35) since we now use inline Tailwind classes matching Figma's exact specs. These were:

```typescript
// DELETE these lines:
const btnBlue = 'px-6 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-btn hover:opacity-90 transition-all duration-200 no-underline inline-flex items-center gap-1.5'
const btnGreen = 'px-6 py-2.5 text-sm font-semibold text-white bg-brand-green rounded-btn hover:opacity-90 transition-all duration-200 no-underline inline-flex items-center gap-1.5'
```

- [ ] **Step 3: Verify in browser**

Page should show AIOSEO card with flex layout, correct labels, full license key. Addons and upgrade sections will be missing — that's expected.

- [ ] **Step 4: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add src/views/DownloadsView.vue
git commit -m "feat(downloads): rebuild AIOSEO card header + body with flex layout matching Figma"
```

---

## Task 6: Rebuild DownloadsView — AIOSEO Addons Section

**Files:**
- Modify: `src/views/DownloadsView.vue`

**Figma spec for addons section (nodes 2210:5005–2210:5176):**
- Background: #f8fafe (`bg-bg-addons`), padding 24px, border-bottom
- Label: "AIOSEO Addons" Semibold 14px #8C8F9A
- Addon items laid out 4-per-row with gap-[3px], each item w-[255.5px]:
  - Icon box: `.aio-addon-box` (border, rounded, p-12) containing `.aio-addon-circle` (40px blue circle with 24px white SVG)
  - Some icons have `.aio-addon-new-badge` ("NEW") positioned below
  - Text column: addon name Semibold 16px #141b38 + "Download" link (download icon 20px + Bold 13px #8C8F9A)
- Gap between icon box and text: 16px
- If > 4 addons, they wrap to second row with vertical gap

- [ ] **Step 1: Insert addons section into AIOSEO card**

In `src/views/DownloadsView.vue`, replace the `<!-- ADDONS SECTION — filled in Task 6 -->` comment with:

```html
				<!-- Addons section -->
				<div v-if="lic.addons.length > 0" class="bg-bg-addons p-6 border-b border-border">
					<p class="text-sm font-semibold text-text-light mb-2">AIOSEO Addons</p>
					<div class="flex flex-wrap gap-y-6">
						<div
							v-for="addon in lic.addons"
							:key="addon.id"
							class="flex items-center gap-4 w-[255.5px]"
						>
							<!-- Icon box -->
							<div class="aio-addon-box">
								<div class="aio-addon-circle">
									<AddonIcon :addon-id="addon.id" />
								</div>
								<span v-if="addon.isNew" class="aio-addon-new-badge">New</span>
							</div>
							<!-- Text -->
							<div class="flex flex-col gap-1">
								<span class="text-base font-semibold text-brand-navy">{{ addon.name }}</span>
								<a :href="addon.downloadUrl" class="inline-flex items-center gap-1 text-[13px] font-bold text-text-light hover:text-brand-navy transition-colors no-underline">
									<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
									Download
								</a>
							</div>
						</div>
					</div>
				</div>
```

- [ ] **Step 2: Verify addon rendering in browser**

Check each profile tier:
- `?profile=basic` — 4 addons in 1 row, Image SEO has "NEW" badge
- `?profile=pro` — 6 addons, wraps to 2 rows (4+2)
- `?profile=elite` — 8 addons, 2 full rows (4+4), Image SEO and IndexNow have "NEW" badges

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add src/views/DownloadsView.vue
git commit -m "feat(downloads): rebuild addon items with bordered icon boxes and NEW badges matching Figma"
```

---

## Task 7: Rebuild DownloadsView — Upgrade Toggle + Panel

**Files:**
- Modify: `src/views/DownloadsView.vue`

**Figma spec for upgrade toggle (node 2210:8255):**
- Solid background #eaf1fc (`bg-bg-upgrade`), padding 16px, centered
- Text: "See Upgrade Options" / "Hide Upgrade Options" — Semibold 16px #005ae0
- Small chevron SVG (11x6px) next to text
- When closed: has border-bottom radius (last visible section)

**Figma spec for upgrade panel (nodes 2210:4921–2210:4930):**
- Outer wrapper: bg #eaf1fc, px-8 pb-8, rounded-bl-8 rounded-br-8
- Inner card: white bg, border 1px #d5e4ff, rounded-5px, pb-30px
- Title: Semibold 23.4px (use text-h3) #141b38, centered
  - basic → "Upgrade to Plus" / "The Essential Toolkit for Growing Businesses"
  - plus/pro → "Upgrade to Elite" / "Premier solution for smart business owners & agencies"
- Check items: flex-wrap, gap 16px 32px, each item min-w-240px
  - Green circle (24px, bg #00aa63) with white check SVG + text Regular 16px
- CTA: "Upgrade to Plus/Elite" — bg #005ae0, Semibold 18px, px-6 py-[14.85px], rounded-[4.5px]

- [ ] **Step 1: Add upgrade data to script setup**

Add this after the existing `showUpgradeOptions` ref in `<script setup>`:

```typescript
const upgradeFeatures = {
	basic: {
		title: 'Upgrade to Plus',
		subtitle: 'The Essential Toolkit for Growing Businesses',
		features: ['3 Websites', '25,000 AI Credits', 'Dominate Local Search', 'Rank in Google Images', 'Boost Trust (E-E-A-T)', 'Appear on Google Maps'],
	},
	plus: {
		title: 'Upgrade to Elite',
		subtitle: 'Premier solution for smart business owners & agencies',
		features: ['100 Websites', '200,000 AI Credits', 'WordPress Multisite-Ready', 'Track Keyword Rankings', 'Monitor Indexing Status', 'Spot Content Decay'],
	},
	pro: {
		title: 'Upgrade to Elite',
		subtitle: 'Premier solution for smart business owners & agencies',
		features: ['100 Websites', '200,000 AI Credits', 'WordPress Multisite-Ready', 'Track Keyword Rankings', 'Monitor Indexing Status', 'Spot Content Decay'],
	},
} as Record<string, { title: string; subtitle: string; features: string[] }>
```

- [ ] **Step 2: Insert upgrade toggle + panel into AIOSEO card**

Replace the `<!-- UPGRADE TOGGLE + PANEL — filled in Task 7 -->` comment with:

```html
				<!-- See/Hide Upgrade Options toggle -->
				<div
					class="bg-bg-upgrade flex items-center justify-center p-4 cursor-pointer"
					:class="showUpgradeOptions ? 'rounded-none' : 'rounded-b-card'"
					@click="showUpgradeOptions = !showUpgradeOptions"
				>
					<button class="text-base font-semibold text-brand-blue bg-transparent border-0 cursor-pointer inline-flex items-center gap-2">
						{{ showUpgradeOptions ? 'Hide' : 'See' }} Upgrade Options
						<svg
							class="w-[11px] h-[6.4px] transition-transform duration-200"
							:class="{ 'rotate-180': showUpgradeOptions }"
							fill="none" viewBox="0 0 11 7" stroke="currentColor" stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M1 1l4.5 4.5L10 1" />
						</svg>
					</button>
				</div>

				<!-- Upgrade panel -->
				<div v-if="showUpgradeOptions && lic.tier !== 'elite' && upgradeFeatures[lic.tier]" class="bg-bg-upgrade px-2 pb-2 rounded-b-lg">
					<div class="bg-white border border-border-upgrade rounded-card pb-[30px]">
						<!-- Title -->
						<div class="flex flex-col items-center gap-3 pt-5">
							<h3 class="text-h3 font-semibold text-brand-navy text-center">{{ upgradeFeatures[lic.tier].title }}</h3>
							<p class="text-lg text-brand-navy text-center">{{ upgradeFeatures[lic.tier].subtitle }}</p>
						</div>

						<!-- Feature checklist -->
						<div class="flex flex-wrap justify-center gap-x-8 gap-y-4 px-8 mt-6">
							<div
								v-for="(feature, i) in upgradeFeatures[lic.tier].features"
								:key="i"
								class="flex items-start gap-3 min-w-[240px]"
							>
								<div class="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center shrink-0">
									<svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 12 10" stroke="currentColor" stroke-width="2.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M1 5.5L4.5 9L11 1" />
									</svg>
								</div>
								<span class="text-base text-brand-navy">{{ feature }}</span>
							</div>
						</div>

						<!-- CTA button -->
						<div class="flex justify-center mt-6">
							<a href="#" class="bg-brand-blue text-white text-lg font-semibold px-6 py-[14.85px] rounded-[4.5px] no-underline hover:opacity-90 transition-opacity inline-flex items-center">
								{{ upgradeFeatures[lic.tier].title }}
							</a>
						</div>
					</div>
				</div>
```

- [ ] **Step 3: Verify upgrade panel in browser**

Test with `?profile=basic`:
- Click "See Upgrade Options" → should expand
- Blue outer wrapper visible
- White inner card with blue border (#d5e4ff)
- Title "Upgrade to Plus" at ~23px
- 6 features in 3x2 grid with green circle checks
- Blue CTA button "Upgrade to Plus" at 18px

Test with `?profile=pro`:
- Should show "Upgrade to Elite" with different features

Test with `?profile=elite`:
- Upgrade toggle should be visible but panel should not expand (tier is elite)

- [ ] **Step 4: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add src/views/DownloadsView.vue
git commit -m "feat(downloads): add upgrade toggle and panel with blue wrapper matching Figma"
```

---

## Task 8: Clean Up Unused Code + Final Polish

**Files:**
- Modify: `src/views/DownloadsView.vue` — remove unused imports
- Modify: `src/assets/main.css` — remove `.aio-table-row` if no longer used anywhere

- [ ] **Step 1: Check if `.aio-table-row` is still used anywhere**

Run: `cd /Users/adam/dev/aioseo-account && grep -r "aio-table-row" src/ --include="*.vue" --include="*.css" --include="*.ts" -l`

If `aio-table-row` is ONLY referenced in `main.css` (the definition) and NOT in any `.vue` file, then remove it from `main.css` (lines 372–381):

```css
/* DELETE this block if unused: */
@layer components {
  .aio-table-row:nth-child(even) {
    background-color: #F8FAFE;
  }
  .aio-table-row {
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }
}
```

If it IS used in other views, leave it.

- [ ] **Step 2: Verify all 3 profiles render correctly**

Open each in browser:
- `http://localhost:5173/account/downloads?profile=basic` — AIOSEO card (basic tier, 4 addons, upgrade to Plus)
- `http://localhost:5173/account/downloads?profile=pro` — AIOSEO card (pro tier, 6 addons, upgrade to Elite) + BLC card + AI Credits card
- `http://localhost:5173/account/downloads?profile=elite` — AIOSEO card (elite tier, 8 addons, no upgrade) + BLC card + AI Credits card

For each, verify:
- [ ] Labels are 14px semibold gray (not uppercase, not tracked)
- [ ] Values are 16px regular navy with 38px line height
- [ ] License keys show in full (no truncation, no mono font)
- [ ] Copy button works
- [ ] Addons show in bordered icon boxes with blue circles
- [ ] "NEW" badges appear on Image SEO and IndexNow
- [ ] Download links are gray (not blue), say "Download" (no version)
- [ ] "See Upgrade Options" has solid blue background (not gradient)
- [ ] Upgrade panel has blue outer wrapper + white inner card
- [ ] BLC card uses skeuomorphic icon box
- [ ] AI Credits card has wide gap between columns

- [ ] **Step 3: Run type-check**

Run: `cd /Users/adam/dev/aioseo-account && npm run type-check`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add -A
git commit -m "chore(downloads): clean up unused table styles and verify all profiles"
```

---

## Task 9: Visual QA Against Figma Screenshots

**Files:** None modified — this is a QA-only task.

- [ ] **Step 1: Screenshot comparison**

Take screenshots of each card type in the browser and compare against the Figma screenshots captured during the audit. Use the Figma MCP tool `get_screenshot` for reference:

- Basic AIOSEO: node `2210:8022`
- Elite AIOSEO: node `2210:4954`
- Basic Upgrade (expanded): node `2210:4781`
- AI Credits: node `2212:1532`
- BLC: node `2240:3735`

- [ ] **Step 2: Document any remaining pixel-level discrepancies**

If any differences are found, list them. Common things to check:
- Exact padding values (should be 24px body, 12px/20px header)
- Font weight rendering (Proxima Nova Semibold vs Bold)
- Border color subtle differences (#e9f0fc vs #e6eefc — both are very close to `border-border`)
- Button heights (h-36px for header buttons)
- Addon item width (255.5px — may need adjustment based on container width)

- [ ] **Step 3: Fix any remaining issues and commit**

If fixes are needed, apply them and commit:

```bash
cd /Users/adam/dev/aioseo-account
git add -A
git commit -m "fix(downloads): pixel-level adjustments from visual QA against Figma"
```
