# Minimal Layout Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a toggleable "minimal" layout mode that strips header, footer, CTA banner, and overview sections to create a standalone prototype with zero external API dependencies.

**Architecture:** A new `activeLayout` state in the Pinia profile store drives conditional rendering across layout components. A new `UserDropdown` component replaces the marketing nav in minimal mode. The ProfileSwitcher widget gets a second toggle row for layout mode.

**Tech Stack:** Vue 3 `<script setup lang="ts">`, Tailwind v4, Pinia, vue-router

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/stores/profile.ts` | Modify | Add `LayoutMode` type, `activeLayout` ref, `setLayout` action |
| `src/composables/useMockProfile.ts` | Modify | Expose `activeLayout` and `setLayout` |
| `src/components/ProfileSwitcher.vue` | Modify | Add Layout toggle row (Minimal / Full) |
| `src/components/UserDropdown.vue` | **Create** | Avatar + name + dropdown menu |
| `src/layout/SiteHeader.vue` | Modify | Conditional minimal vs full header |
| `src/layout/SiteFooter.vue` | Modify | Conditional minimal vs full footer |
| `src/layout/AppLayout.vue` | Modify | Conditionally hide CtaBanner |
| `src/views/OverviewView.vue` | Modify | Conditionally hide Announcements + Need Help |

---

## Task 1: Add Layout State to Profile Store

**Files:**
- Modify: `src/stores/profile.ts`
- Modify: `src/composables/useMockProfile.ts`

- [ ] **Step 1: Update the profile store**

Replace the entire content of `src/stores/profile.ts` with:

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ProfileKey = 'basic' | 'pro' | 'elite'
export type LayoutMode = 'minimal' | 'full'

export const useProfileStore = defineStore('profile', () => {
	const params = new URLSearchParams(window.location.search)
	const initial = (params.get('profile') as ProfileKey) || 'elite'
	const initialLayout = (params.get('layout') as LayoutMode) || 'minimal'

	const activeProfile = ref<ProfileKey>(initial)
	const activeLayout = ref<LayoutMode>(initialLayout)

	function setProfile(key: ProfileKey) {
		activeProfile.value = key
		const url = new URL(window.location.href)
		url.searchParams.set('profile', key)
		window.history.replaceState({}, '', url.toString())
	}

	function setLayout(mode: LayoutMode) {
		activeLayout.value = mode
		const url = new URL(window.location.href)
		url.searchParams.set('layout', mode)
		window.history.replaceState({}, '', url.toString())
	}

	return { activeProfile, activeLayout, setProfile, setLayout }
})
```

- [ ] **Step 2: Expose layout state from useMockProfile composable**

Replace the entire content of `src/composables/useMockProfile.ts` with:

```typescript
import { computed } from 'vue'
import { useProfileStore } from '@/stores/profile'
import type { ProfileKey, LayoutMode } from '@/stores/profile'
import * as eliteData from '@/data/profiles/elite'
import * as proData from '@/data/profiles/pro'
import * as basicData from '@/data/profiles/basic'

const profiles = {
	elite: eliteData,
	pro: proData,
	basic: basicData,
} as const

export function useMockProfile() {
	const store = useProfileStore()

	const data = computed(() => profiles[store.activeProfile])
	const activeProfile = computed(() => store.activeProfile)
	const activeLayout = computed(() => store.activeLayout)
	const isMinimal = computed(() => store.activeLayout === 'minimal')

	function setProfile(key: ProfileKey) {
		store.setProfile(key)
	}

	function setLayout(mode: LayoutMode) {
		store.setLayout(mode)
	}

	return { data, activeProfile, activeLayout, isMinimal, setProfile, setLayout }
}
```

- [ ] **Step 3: Run type-check**

Run: `cd /Users/adam/dev/aioseo-account && npm run type-check`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add src/stores/profile.ts src/composables/useMockProfile.ts
git commit -m "feat(layout): add LayoutMode state to profile store and composable"
```

---

## Task 2: Add Layout Toggle to ProfileSwitcher

**Files:**
- Modify: `src/components/ProfileSwitcher.vue`

- [ ] **Step 1: Replace ProfileSwitcher with layout toggle**

Replace the entire content of `src/components/ProfileSwitcher.vue` with:

```vue
<script setup lang="ts">
import { useMockProfile } from '@/composables/useMockProfile'
import type { ProfileKey, LayoutMode } from '@/stores/profile'

const { activeProfile, activeLayout, setProfile, setLayout } = useMockProfile()

const profiles: { key: ProfileKey; label: string }[] = [
	{ key: 'basic', label: 'Basic' },
	{ key: 'pro', label: 'Pro' },
	{ key: 'elite', label: 'Elite' },
]

const layouts: { key: LayoutMode; label: string }[] = [
	{ key: 'minimal', label: 'Minimal' },
	{ key: 'full', label: 'Full' },
]
</script>

<template>
	<div class="fixed bottom-4 right-4 z-[999] bg-white/90 backdrop-blur-sm px-3 py-2.5 rounded-card border border-border shadow-card">
		<p class="text-xs font-medium text-text-muted uppercase tracking-wider mb-1.5">Mock Profile</p>
		<div class="flex gap-1">
			<button
				v-for="profile in profiles"
				:key="profile.key"
				@click="setProfile(profile.key)"
				:aria-label="`Switch to ${profile.label} profile`"
				:aria-pressed="activeProfile === profile.key"
				class="px-3 py-1 text-xs font-medium rounded-btn transition-all duration-200 cursor-pointer"
				:class="activeProfile === profile.key
					? 'bg-brand-blue text-white shadow-sm'
					: 'bg-gray-100 text-text-secondary hover:bg-gray-200'"
			>
				{{ profile.label }}
			</button>
		</div>
		<p class="text-xs font-medium text-text-muted uppercase tracking-wider mb-1.5 mt-2.5">Layout</p>
		<div class="flex gap-1">
			<button
				v-for="layout in layouts"
				:key="layout.key"
				@click="setLayout(layout.key)"
				:aria-label="`Switch to ${layout.label} layout`"
				:aria-pressed="activeLayout === layout.key"
				class="px-3 py-1 text-xs font-medium rounded-btn transition-all duration-200 cursor-pointer"
				:class="activeLayout === layout.key
					? 'bg-brand-blue text-white shadow-sm'
					: 'bg-gray-100 text-text-secondary hover:bg-gray-200'"
			>
				{{ layout.label }}
			</button>
		</div>
	</div>
</template>
```

- [ ] **Step 2: Verify in browser**

Run dev server, check that the ProfileSwitcher widget now shows two rows: "Mock Profile" (Basic/Pro/Elite) and "Layout" (Minimal/Full). Clicking Minimal or Full should update the URL param `?layout=`.

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add src/components/ProfileSwitcher.vue
git commit -m "feat(layout): add Minimal/Full layout toggle to ProfileSwitcher"
```

---

## Task 3: Create UserDropdown Component

**Files:**
- Create: `src/components/UserDropdown.vue`

- [ ] **Step 1: Create the UserDropdown component**

Create `src/components/UserDropdown.vue` with:

```vue
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAccount } from '@/composables/useAccount'

const { user } = useAccount()
const open = ref(false)
const showInitials = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const fullName = computed(() => `${user.value.firstName} ${user.value.lastName}`)
const initials = computed(() =>
	`${user.value.firstName.charAt(0)}${user.value.lastName.charAt(0)}`.toUpperCase()
)

const gravatarUrl = computed(() => {
	const email = user.value.email.trim().toLowerCase()
	// Simple hash for gravatar — use a basic DJB2 hash converted to hex
	// In production you'd use MD5, but for a mock prototype this gives a consistent URL
	let hash = 5381
	for (let i = 0; i < email.length; i++) {
		hash = ((hash << 5) + hash + email.charCodeAt(i)) & 0xffffffff
	}
	const hex = (hash >>> 0).toString(16).padStart(8, '0')
	return `https://www.gravatar.com/avatar/${hex}?d=404&s=64`
})

const avatarSrc = computed(() => {
	if (showInitials.value) return null
	return user.value.avatarUrl || gravatarUrl.value
})

function onAvatarError() {
	showInitials.value = true
}

function toggle() {
	open.value = !open.value
}

function handleClickOutside(e: MouseEvent) {
	if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
		open.value = false
	}
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
	<div ref="dropdownRef" class="relative">
		<button
			@click="toggle"
			class="flex items-center gap-2.5 bg-transparent border-0 cursor-pointer p-1 rounded-btn hover:bg-gray-50 transition-colors"
			:aria-expanded="open"
			aria-haspopup="true"
		>
			<span class="text-sm font-medium text-brand-navy-60 hidden sm:inline">{{ fullName }}</span>
			<img
				v-if="avatarSrc"
				:src="avatarSrc"
				:alt="fullName"
				class="w-8 h-8 rounded-full object-cover shrink-0"
				@error="onAvatarError"
			/>
			<div
				v-else
				class="w-8 h-8 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center shrink-0"
			>
				{{ initials }}
			</div>
		</button>

		<Transition
			enter-active-class="transition ease-out duration-150"
			enter-from-class="opacity-0 -translate-y-1 scale-95"
			enter-to-class="opacity-100 translate-y-0 scale-100"
			leave-active-class="transition ease-in duration-100"
			leave-from-class="opacity-100 translate-y-0 scale-100"
			leave-to-class="opacity-0 -translate-y-1 scale-95"
		>
			<div
				v-if="open"
				class="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-card shadow-card py-1 z-50"
			>
				<router-link
					to="/profile"
					class="block px-4 py-2.5 text-sm text-brand-navy hover:bg-gray-50 no-underline transition-colors"
					@click="open = false"
				>
					Profile
				</router-link>
				<router-link
					to="/support"
					class="block px-4 py-2.5 text-sm text-brand-navy hover:bg-gray-50 no-underline transition-colors"
					@click="open = false"
				>
					Support
				</router-link>
				<div class="border-t border-border my-1"></div>
				<a
					href="https://aioseo.com/account/logout/"
					class="block px-4 py-2.5 text-sm text-brand-navy hover:bg-gray-50 no-underline transition-colors"
				>
					Log Out
				</a>
			</div>
		</Transition>
	</div>
</template>
```

- [ ] **Step 2: Run type-check**

Run: `cd /Users/adam/dev/aioseo-account && npm run type-check`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add src/components/UserDropdown.vue
git commit -m "feat(layout): create UserDropdown component with avatar fallbacks"
```

---

## Task 4: Minimal Header

**Files:**
- Modify: `src/layout/SiteHeader.vue`

- [ ] **Step 1: Replace SiteHeader with conditional rendering**

Replace the entire content of `src/layout/SiteHeader.vue` with:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useMockProfile } from '@/composables/useMockProfile'
import UserDropdown from '@/components/UserDropdown.vue'

const { isMinimal } = useMockProfile()
const mobileMenuOpen = ref(false)
</script>

<template>
	<header
		class="flex items-center justify-center bg-white border-b border-border font-body text-lg text-brand-navy h-[88px]"
	>
		<div class="aio-container flex items-center h-[76px]">
			<!-- Logo -->
			<router-link to="/overview" class="shrink-0" aria-label="AIOSEO Home">
				<img
					src="/assets/icons/aioseo-logo.svg"
					alt="AIOSEO"
					class="w-[127px] h-[25px]"
				/>
			</router-link>

			<!-- Minimal mode: user dropdown only -->
			<template v-if="isMinimal">
				<div class="ml-auto">
					<UserDropdown />
				</div>
			</template>

			<!-- Full mode: marketing nav -->
			<template v-else>
				<!-- Mobile hamburger -->
				<button
					class="md:hidden ml-auto p-2 text-brand-navy"
					:aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
					:aria-expanded="mobileMenuOpen"
					@click="mobileMenuOpen = !mobileMenuOpen"
				>
					<svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 18h18M3 12h18M3 6h18" />
					</svg>
					<svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<!-- Desktop Nav -->
				<nav
					class="hidden md:flex items-center flex-1 justify-end text-body leading-[22.5px]"
					aria-label="Main navigation"
				>
					<a href="https://aioseo.com/features/" class="aio-nav-link no-underline">
						Features
						<svg class="ml-1.5 w-[10px] h-[6px] text-brand-navy-40" viewBox="0 0 10 6" fill="none">
							<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</a>
					<a href="https://aioseo.com/pricing/" class="aio-nav-link no-underline">Pricing</a>
					<a href="https://aioseo.com/testimonials/" class="aio-nav-link no-underline">Testimonials</a>
					<a href="https://aioseo.com/docs/" class="aio-nav-link no-underline">
						Resources
						<svg class="ml-1.5 w-[10px] h-[6px] text-brand-navy-40" viewBox="0 0 10 6" fill="none">
							<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</a>
					<a href="https://aioseo.com/account/" class="aio-nav-link no-underline !text-brand-blue border-l border-border-input pl-[15px] ml-[15px]">My Account</a>
				</nav>
			</template>
		</div>

		<!-- Mobile menu overlay (full mode only) -->
		<Transition
			enter-active-class="transition ease-out duration-200"
			enter-from-class="opacity-0 -translate-y-2"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition ease-in duration-150"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 -translate-y-2"
		>
			<div v-if="!isMinimal && mobileMenuOpen" class="md:hidden absolute top-[88px] left-0 right-0 bg-white border-b border-border shadow-card z-50">
				<nav class="flex flex-col py-4 px-5 gap-1" aria-label="Mobile navigation">
					<a href="https://aioseo.com/features/" class="py-3 text-body text-brand-navy no-underline hover:text-brand-blue transition-colors duration-200" @click="mobileMenuOpen = false">Features</a>
					<a href="https://aioseo.com/pricing/" class="py-3 text-body text-brand-navy no-underline hover:text-brand-blue transition-colors duration-200" @click="mobileMenuOpen = false">Pricing</a>
					<a href="https://aioseo.com/testimonials/" class="py-3 text-body text-brand-navy no-underline hover:text-brand-blue transition-colors duration-200" @click="mobileMenuOpen = false">Testimonials</a>
					<a href="https://aioseo.com/docs/" class="py-3 text-body text-brand-navy no-underline hover:text-brand-blue transition-colors duration-200" @click="mobileMenuOpen = false">Resources</a>
					<a href="https://aioseo.com/account/" class="py-3 text-body text-brand-blue font-semibold no-underline border-t border-border mt-2 pt-4 hover:opacity-80 transition-opacity duration-200" @click="mobileMenuOpen = false">My Account</a>
				</nav>
			</div>
		</Transition>
	</header>
</template>
```

Key changes:
- Logo now uses `<router-link to="/overview">` instead of external aioseo.com link (works in both modes)
- Minimal mode: shows only logo + `UserDropdown` (right-aligned)
- Full mode: shows full marketing nav + mobile hamburger (unchanged behavior)

- [ ] **Step 2: Verify in browser**

Switch to Minimal layout — header should show AIOSEO logo left, user name + avatar right. Click avatar to see dropdown with Profile, Support, Log Out. Switch to Full layout — full marketing nav should appear.

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add src/layout/SiteHeader.vue
git commit -m "feat(layout): conditional minimal header with UserDropdown"
```

---

## Task 5: Minimal Footer + Hide CTA Banner

**Files:**
- Modify: `src/layout/SiteFooter.vue`
- Modify: `src/layout/AppLayout.vue`

- [ ] **Step 1: Add minimal footer to SiteFooter**

At the top of `src/layout/SiteFooter.vue`, replace the `<script setup lang="ts">` block. Add the import for `useMockProfile` at the top of the existing script:

After the existing `<script setup lang="ts">` opening tag (line 1), add:

```typescript
import { useMockProfile } from '@/composables/useMockProfile'

const { isMinimal } = useMockProfile()
```

Then wrap the entire existing `<template>` content in a conditional. Replace the opening `<template>` and its content with:

```vue
<template>
	<!-- Minimal footer -->
	<footer v-if="isMinimal" class="border-t border-border bg-white py-4">
		<div class="aio-container flex flex-wrap gap-2 items-center justify-between text-sm text-text-muted">
			<span>&copy; 2013-2026 All-in-One SEO Pack, LLC.</span>
			<div class="flex gap-5">
				<a href="#" class="text-text-muted no-underline hover:text-brand-blue transition-colors">Terms</a>
				<a href="#" class="text-text-muted no-underline hover:text-brand-blue transition-colors">Privacy</a>
				<a href="#" class="text-text-muted no-underline hover:text-brand-blue transition-colors">Support</a>
			</div>
		</div>
	</footer>

	<!-- Full footer (existing) -->
	<footer v-else class="bg-[#F8FAFE] border-t border-border pt-14 pb-8">
```

Keep all the existing full footer content inside the `v-else` block. The closing `</footer>` and `</template>` tags at the end stay as-is.

- [ ] **Step 2: Conditionally hide CtaBanner in AppLayout**

In `src/layout/AppLayout.vue`, add the import for `useMockProfile` in the script setup block. After the existing imports (line 7), add:

```typescript
import { useMockProfile } from '@/composables/useMockProfile'

const { isMinimal } = useMockProfile()
```

Then change the CtaBanner line (around line 54) from:

```html
			<CtaBanner />
```

to:

```html
			<CtaBanner v-if="!isMinimal" />
```

- [ ] **Step 3: Verify in browser**

Switch to Minimal — footer should be a single line (copyright + 3 links), CTA banner should be hidden. Switch to Full — mega footer and CTA banner should reappear.

- [ ] **Step 4: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add src/layout/SiteFooter.vue src/layout/AppLayout.vue
git commit -m "feat(layout): minimal footer and hide CTA banner in minimal mode"
```

---

## Task 6: Hide Announcements + Need Help on Overview

**Files:**
- Modify: `src/views/OverviewView.vue`

- [ ] **Step 1: Add isMinimal check to OverviewView**

In `src/views/OverviewView.vue`, add the import after the existing composable imports (after line 7):

```typescript
import { useMockProfile } from '@/composables/useMockProfile'
```

And add in the setup section (after line 20):

```typescript
const { isMinimal } = useMockProfile()
```

- [ ] **Step 2: Wrap Announcements + Need Help in v-if**

Find the Announcements section (around line 178). Wrap both the Announcements and Need Help blocks:

Change:

```html
		<!-- Announcements (full width) -->
		<div>
```

to:

```html
		<!-- Announcements (full width) — hidden in minimal mode -->
		<div v-if="!isMinimal">
```

And find the Need Help section (around line 191). Change:

```html
		<!-- Need Help (full width) -->
		<div>
```

to:

```html
		<!-- Need Help (full width) — hidden in minimal mode -->
		<div v-if="!isMinimal">
```

- [ ] **Step 3: Verify in browser**

Navigate to Overview page. In Minimal mode: Announcements and Need Help should be gone. In Full mode: both should appear.

- [ ] **Step 4: Commit**

```bash
cd /Users/adam/dev/aioseo-account
git add src/views/OverviewView.vue
git commit -m "feat(layout): hide Announcements and Need Help in minimal mode"
```

---

## Task 7: Final Verification + Deploy

**Files:** None modified — verification and deploy only.

- [ ] **Step 1: Run type-check**

Run: `cd /Users/adam/dev/aioseo-account && npm run type-check`

Expected: No errors.

- [ ] **Step 2: Run build**

Run: `cd /Users/adam/dev/aioseo-account && npm run build`

Expected: Build succeeds.

- [ ] **Step 3: Test all combinations**

Test in browser at `http://localhost:5173/account/`:

| URL | Expected |
|-----|----------|
| `?layout=minimal&profile=elite` | Minimal header (logo + user dropdown), no CTA, minimal footer, no Announcements/Help |
| `?layout=full&profile=elite` | Full marketing header, CTA banner, mega footer, Announcements + Help |
| `?layout=minimal&profile=basic` | Same minimal chrome, basic profile data |
| `/downloads?layout=minimal` | Minimal chrome, downloads page unchanged |
| `/cancel/support?layout=minimal` | Cancel flow unchanged (uses CancelLayout, not AppLayout) |

- [ ] **Step 4: Push and deploy to GitHub Pages**

```bash
cd /Users/adam/dev/aioseo-account
git -c http.postBuffer=524288000 push
```

Wait for GitHub Actions deploy to complete:

```bash
sleep 40 && gh run list --repo adampickering/aioseo-account-demo --workflow deploy.yml --limit 1
```

Verify at: `https://adampickering.github.io/aioseo-account-demo/overview`

Default should load in minimal mode (clean header with user dropdown, no CTA, minimal footer).
