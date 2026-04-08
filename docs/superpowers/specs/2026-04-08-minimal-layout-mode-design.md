# Minimal Layout Mode — Design Spec

**Goal:** Add a toggleable "minimal" layout mode that strips the header, footer, overview page, and CTA banner to standalone-prototype-friendly versions with zero external API dependencies.

**Default:** Minimal mode is the default. The PM can toggle to "full" mode via the ProfileSwitcher widget to compare.

---

## Layout Toggle Mechanism

### State
- New `activeLayout` ref in Pinia profile store (`src/stores/profile.ts`): `'minimal' | 'full'`
- Default value: `'minimal'`
- Persisted via URL param `?layout=minimal` or `?layout=full` (same pattern as `?profile=`)
- Read on store init from URL, fallback to `'minimal'`

### ProfileSwitcher Widget
- Add a second row to `src/components/ProfileSwitcher.vue` labeled "Layout"
- Two buttons: `Minimal | Full`, same toggle style as the existing Basic/Pro/Elite row
- Clicking updates the store and URL param

### Composable Access
- Expose `activeLayout` and `setLayout` from `useMockProfile()` composable (or directly from the store)
- Layout components import the store and check `activeLayout` to decide which version to render

---

## Minimal Header

**File:** `src/layout/SiteHeader.vue`

When `activeLayout === 'minimal'`:
- **Remove**: All marketing nav links (Features, Pricing, Testimonials, Resources, My Account), mobile hamburger menu
- **Keep**: AIOSEO logo (left-aligned, links to `/account/overview`)
- **Add**: UserDropdown component (right-aligned)

When `activeLayout === 'full'`:
- Render current header unchanged

### UserDropdown Component

**New file:** `src/components/UserDropdown.vue`

**Display (closed):**
- User avatar image (32px circle) + full name, right-aligned in header
- Clickable, shows dropdown on click

**Avatar resolution (in order):**
1. `user.avatarUrl` from mock data (if set and non-empty)
2. Gravatar URL derived from `user.email`: `https://www.gravatar.com/avatar/{md5(email.trim().toLowerCase())}?d=404&s=64`
3. Initials fallback: first letter of firstName + first letter of lastName, rendered as colored circle with white text (bg: `#005ae0`)

**Avatar `<img>` should use `@error` handler:** on load failure, swap to initials fallback. This handles both missing avatarUrl and Gravatar 404.

**Dropdown menu (open):**
- Appears below the avatar/name on click
- Items:
  - **Profile** — `router-link` to `/account/profile`
  - **Support** — `router-link` to `/account/support`
  - Divider (1px border)
  - **Log Out** — `<a href="https://aioseo.com/account/logout/">`
- Click-outside closes dropdown
- Styled with `border border-border rounded-card shadow-card bg-white`, same card aesthetic as rest of app

**Data source:** `useAccount()` composable (already exists, provides `account.firstName`, `account.lastName`, `account.email`, `account.avatarUrl`)

---

## Minimal Footer

**File:** `src/layout/SiteFooter.vue`

When `activeLayout === 'minimal'`:
- Single line, horizontally justified
- Left: `© 2013-2026 All-in-One SEO Pack, LLC.`
- Right: `Terms · Privacy · Support` (links, same `#` hrefs as current)
- Styled: `border-t border-border py-4 px-6 text-sm text-text-muted`
- No social icons, no brand columns, no security badges

When `activeLayout === 'full'`:
- Render current footer unchanged

---

## CTA Banner

**File:** `src/layout/AppLayout.vue`

When `activeLayout === 'minimal'`:
- Hide the `<CtaBanner />` component entirely (`v-if`)

When `activeLayout === 'full'`:
- Render as-is

---

## Overview Page

**File:** `src/views/OverviewView.vue`

When `activeLayout === 'minimal'`:
- Hide the **Announcements** section
- Hide the **Need Help?** section
- Keep: user profile info, quick links, subscriptions table, AI credits, promo offers/upgrade cards

When `activeLayout === 'full'`:
- Render all sections as-is

---

## Unchanged Components

These are NOT modified:
- `TabNavigation.vue` — tabs stay the same in both modes
- Welcome banner in `AppLayout.vue` — stays in both modes
- All view pages except OverviewView — no changes
- Mock data / composables — no data changes needed
- `CancelLayout.vue` — cancellation flow is separate, not affected

---

## Implementation Notes

- Use `v-if="isMinimal"` / `v-else` pattern in templates rather than separate component files (the differences are small enough to handle inline)
- The UserDropdown is the only new component — everything else is conditional rendering in existing files
- Gravatar MD5 hashing: use a lightweight inline implementation or the `crypto` web API (`crypto.subtle.digest` returns ArrayBuffer, needs hex conversion). Since this is a mock prototype, a simple JS MD5 function is acceptable.
- All existing functionality must continue to work in "full" mode — this is additive, not destructive
