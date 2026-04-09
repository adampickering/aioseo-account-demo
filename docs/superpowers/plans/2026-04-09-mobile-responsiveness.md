# Mobile Responsiveness Fix Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all mobile layout issues across the AIOSEO account prototype — broken "More" dropdown, overflowing card layouts, unscrollable tabs, and general mobile polish.

**Architecture:** Add responsive breakpoints to existing components. No new components needed. Primary fix pattern: `flex-col` on mobile for card info rows, horizontal scroll for tabs, and overflow fix for dropdown.

**Tech Stack:** Vue 3, Tailwind v4 responsive classes (`sm:`, `md:`, `lg:`)

---

## File Map

| File | Action | Issue |
|------|--------|-------|
| `src/layout/TabNavigation.vue` | Modify | More dropdown clipped by overflow-x-auto |
| `src/views/DownloadsView.vue` | Modify | Card rows overflow, sub-tabs wrap, addon grid clips |
| `src/views/BillingView.vue` | Modify | Payment card layout overflows |
| `src/components/ProfileSwitcher.vue` | Modify | Overlaps content on mobile |
| `src/assets/main.css` | Modify | Reduce .aio-card padding on mobile |

---

## Task 1: Fix "More" Dropdown on Mobile

**Files:** `src/layout/TabNavigation.vue`

The `<ul>` has `overflow-x-auto` which clips the absolutely-positioned dropdown. Fix: move the "More" `<li>` outside the scrollable container, or change the overflow strategy.

- [ ] **Step 1:** Restructure the nav to separate the scrollable tab list from the "More" dropdown. Wrap primary tabs in a scrollable div, keep "More" as a sibling outside the scroll container. Both sit in a flex row.

- [ ] **Step 2:** Verify "More" dropdown opens on mobile and items are clickable.

- [ ] **Step 3:** Commit.

---

## Task 2: Fix Downloads Card Layout on Mobile

**Files:** `src/views/DownloadsView.vue`

The 3-column info rows (Plan Level / License / Expires) use fixed widths (`w-[352px]`) that overflow on mobile. The addon grid uses `w-[calc(25%-3px)]` which is too narrow.

- [ ] **Step 1:** Make card info Row 1 stack vertically on mobile:
  - Change `flex items-start justify-between` to `flex flex-col sm:flex-row sm:items-start sm:justify-between`
  - Remove fixed `w-[352px]` on mobile — use `sm:w-[352px] w-full`
  - Same for Row 2

- [ ] **Step 2:** Make product sub-tabs horizontally scrollable on mobile:
  - Add `overflow-x-auto scrollbar-hide` to the sub-tabs container
  - Add `shrink-0 whitespace-nowrap` to each tab button

- [ ] **Step 3:** Make addon grid responsive:
  - Change `w-[calc(25%-3px)]` to `w-full sm:w-[calc(50%-3px)] lg:w-[calc(25%-3px)]`
  - 1 column on mobile, 2 on tablet, 4 on desktop

- [ ] **Step 4:** Commit.

---

## Task 3: Fix Billing Page Mobile Layout

**Files:** `src/views/BillingView.vue`

Payment method cards and subscription table overflow on narrow screens.

- [ ] **Step 1:** Make payment method rows wrap on mobile — flex-col instead of flex-row for card info + buttons.

- [ ] **Step 2:** Make subscription table horizontally scrollable on mobile with `overflow-x-auto`.

- [ ] **Step 3:** Commit.

---

## Task 4: Reduce Card Padding on Mobile

**Files:** `src/assets/main.css`

The `.aio-card` has 40px padding which is too generous on mobile.

- [ ] **Step 1:** Add a mobile media query to reduce padding:
  ```css
  @media (max-width: 640px) {
    .aio-card { padding: 20px; }
    .aio-card-md { padding: 20px; }
  }
  ```

- [ ] **Step 2:** Commit.

---

## Task 5: Fix ProfileSwitcher on Mobile

**Files:** `src/components/ProfileSwitcher.vue`

The fixed widget overlaps content on small screens.

- [ ] **Step 1:** Make it smaller on mobile — reduce padding, smaller text. Or collapse to a single-line toggle.

- [ ] **Step 2:** Commit.

---

## Task 6: Verify All Pages on Mobile

- [ ] **Step 1:** Test at 375px width (iPhone SE):
  - Overview page
  - Downloads page (all 3 product tabs)
  - Billing page
  - Profile page
  - Services page
  - Cancel flow (all steps)

- [ ] **Step 2:** Fix any remaining issues found.

- [ ] **Step 3:** Push and deploy.
