# Pre-API Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform this Vue 3 mock prototype into an API-ready foundation so the next AM dev can wire real EDD/WordPress REST endpoints without also doing weeks of infrastructure work.

**Architecture:** Zero new runtime dependencies. Hand-roll a thin HTTP client, async resource cache, mutation layer, toast system, form composable, and a small set of a11y utilities (~500 lines total). MSW intercepts all `fetch` calls in dev to serve the existing profile fixtures, exercising real loading/error/empty states throughout. Auth assumes cookie-based WP sessions with a nonce read from `window.aioseoAccount` at boot, with hard redirect to `https://aioseo.com/login/` on 401. Orphaned code paths (DownloadsView monolith, unused extracted components) are reconciled before any async conversion happens, so we don't build infrastructure on a rotten structural base.

**Tech Stack:** Vue 3 (`<script setup lang="ts">`), Vite 8, TypeScript, Tailwind v4, Pinia 3, vue-router, `vite-svg-loader`. Dev-only additions: MSW, Vitest, happy-dom, Prettier.

**Success criteria:**
1. Every data-reading composable returns `{ data, isLoading, error, refetch }` and makes a real `fetch()` call intercepted by MSW
2. Every mutation (profile save, payment methods CRUD, cancel subscription, change plan, apply save offer) is wired through a mutation composable with pending/success/error UI states
3. Every view renders a skeleton on load, an error banner on failure, an empty state on no data
4. BaseModal has working focus trap, Escape-to-close, scroll lock, focus return
5. The orphaned DownloadsView monolith is deleted; the three clean sub-views are routed; the 5 unused extracted components (LicenseCard, AddonCard, SubscriptionRow, OrderRow, PaymentMethodCard) are in use
6. ProfileSwitcher is gated behind `import.meta.env.DEV`
7. Cancellation flow's `confirmCancel` and save-offer acceptance call real mutation composables (stubbed via MSW)
8. Infrastructure tests pass: HTTP client 401 interceptor, query cache invalidation, toast store, useForm, BaseModal a11y
9. `MERGE_NOTES.md` documents what the future subtree-merge into `aioseo-site` needs to reconcile

**Out of scope (deferred):**
- View-level component tests, E2E tests, Playwright
- Form library, toast library, date library, Vue Query, @vueuse/core
- Stripe Elements integration
- Real login/signup screens
- Pricing API / feature bullet extraction
- i18n, dark mode, per-tier edge-case visuals (expired, past_due, at-cap)
- Fixing the 23 dead `href="#"` action destinations (we wire MSW stubs for mutations, but UI links to undesigned subflows like "Manage Sites" remain placeholders)
- ESLint config, CI workflow, Storybook

---

## File Structure

### New files (created by this plan)

```
src/api/
  client.ts                     HTTP client wrapper (fetch + nonce + 401 + error normalization)
  keys.ts                       Query key string constants
  errors.ts                     AuthError, AuthorizationError, ApiError types
  boot.ts                       Reads window.aioseoAccount, dev-mode injection

src/composables/
  useAsyncResource.ts           Query cache + subscription (replaces sync composables)
  useMutation.ts                Mutation wrapper with pending/error/onSuccess
  queryCache.ts                 Shared cache store + invalidation bus
  useToast.ts                   Toast store accessor
  useForm.ts                    Form state + validation composable
  useDocumentTitle.ts           Per-route <title> updater
  useFocusTrap.ts               Focus trap for modals
  useScrollLock.ts              Body scroll lock for modals
  useClickOutside.ts            Click-outside detection
  useKeyStroke.ts               Keyboard event listener composable
  useClipboard.ts               Copy-to-clipboard with status
  useDebounceFn.ts              Debounce helper
  useDirtyForm.ts               Unsaved-changes guard
  mutations/
    useSaveProfile.ts
    useAddPaymentMethod.ts
    useDeletePaymentMethod.ts
    useSetDefaultPaymentMethod.ts
    useCancelSubscription.ts
    useChangePlan.ts
    useApplySaveOffer.ts

src/stores/
  auth.ts                       Auth store (user from window.aioseoAccount)
  toast.ts                      Toast queue Pinia store

src/components/
  QueryBoundary.vue             Loading/error/content wrapper
  CardSkeleton.vue              Card-shaped loading skeleton
  TableSkeleton.vue             Table-shaped loading skeleton
  EmptyState.vue                Generic empty state (icon + message + action)
  ErrorBanner.vue               Inline error banner with retry
  ToastHost.vue                 Toast renderer (teleported)
  icons/
    IconDownload.vue
    IconCopy.vue
    IconCheck.vue
    IconChevronDown.vue
    IconClose.vue
    IconArrowRight.vue
    IconArrowLeft.vue
    IconWarning.vue
    IconSparkle.vue

src/views/
  DownloadsIndexView.vue        /downloads landing (product cards)
  NotFoundView.vue              404 fallback

src/mocks/
  browser.ts                    MSW browser worker setup
  server.ts                     MSW node server (for tests)
  handlers.ts                   All request handlers
  fixtures.ts                   Profile-keyed response builders

tests/
  setup.ts                      Vitest + MSW node setup
  api/
    client.test.ts
  composables/
    useAsyncResource.test.ts
    useMutation.test.ts
    useForm.test.ts
    useFocusTrap.test.ts
  stores/
    toast.test.ts
  components/
    BaseModal.test.ts

docs/
  MERGE_NOTES.md                Notes for subtree-merge into aioseo-site
```

### Modified files

- `src/main.ts` — add boot data read, MSW start (dev only), mount toast host
- `src/router/index.ts` — add `/downloads/*` child routes, `/404` catch-all, per-route meta titles
- `src/layout/AppLayout.vue` — gate ProfileSwitcher with `import.meta.env.DEV`, fix asset paths, mount `<ToastHost>`
- `src/layout/TabNavigation.vue` — a11y on More dropdown
- `src/components/BaseModal.vue` — focus trap, Escape, scroll lock, focus return, aria-modal
- `src/components/ProfileSwitcher.vue` — switch driver: update `window.aioseoAccount.user` + invalidate queries
- `src/views/OverviewView.vue` — QueryBoundary wrappers, fix broken `/downloads/ai-credits` link
- `src/views/ProfileView.vue` — v-model form, wire Save, add current-password field, dirty-form guard
- `src/views/BillingView.vue` — use SubscriptionRow/OrderRow/PaymentMethodCard, fix localMethods drift, wire mutations
- `src/views/DownloadsView.vue` — **DELETED**
- `src/views/DownloadsAioseoView.vue`, `DownloadsBLCView.vue`, `DownloadsAiCreditsView.vue` — QueryBoundary wrappers
- `src/composables/useAccount.ts`, `useLicenses.ts`, `useAiCredits.ts`, `useSubscriptions.ts`, `useOffers.ts`, `useAnnouncements.ts`, `useHelpArticles.ts` — convert to `useAsyncResource`
- `src/composables/useCancellation.ts` — wire `user.planKey` to `useSubscriptions`
- `src/stores/cancellation.ts` — `confirmCancel` calls `useCancelSubscription`, `selectOffer` calls `useApplySaveOffer`
- `index.html` — `<html lang="en">`
- `package.json` — add dev deps
- `vitest.config.ts`, `.prettierrc`, `tests/setup.ts` — new config files
- `CLAUDE.md` — document new patterns (HTTP client, query layer, toast, form, MSW)

---

## Phases

1. **Dev tooling** (Tasks 1-4): MSW, Vitest, Prettier
2. **Auth boot + HTTP client** (Tasks 5-10): `window.aioseoAccount` contract, fetch wrapper, error types
3. **Query/mutation layer** (Tasks 11-16): `useAsyncResource`, `useMutation`, invalidation bus
4. **Toast + form + small utilities** (Tasks 17-27): Toast, useForm, focus trap, scroll lock, etc.
5. **BaseModal a11y rebuild** (Tasks 28-30)
6. **Structural fixes** (Tasks 31-42): routes, orphan deletion, BillingView rewire, ProfileView form fix, etc.
7. **Icon component extraction** (Tasks 43-46)
8. **MSW handlers + fixtures** (Tasks 47-52): 7 GETs + ~12 mutations
9. **Async composable conversion** (Tasks 53-60)
10. **Mutation composables** (Tasks 61-67)
11. **QueryBoundary + skeletons + empty states** (Tasks 68-74)
12. **Apply UX patterns across views** (Tasks 75-80)
13. **Cancellation flow integration** (Tasks 81-83)
14. **Form guards, docs, handoff** (Tasks 84-87)

---

## Phase 1: Dev Tooling

### Task 1: Install dev dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install MSW, Vitest, happy-dom, Prettier**

Run:
```bash
npm install --save-dev msw@^2 vitest@^2 happy-dom@^15 @vitest/coverage-v8@^2 prettier@^3
```

- [ ] **Step 2: Verify package.json devDependencies updated**

Run: `grep -E "msw|vitest|happy-dom|prettier" package.json`
Expected: 5 matches, all in devDependencies

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add msw, vitest, happy-dom, prettier dev deps"
```

---

### Task 2: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Modify: `package.json` (add test scripts)
- Modify: `tsconfig.node.json` (include vitest.config.ts)

- [ ] **Step 1: Create vitest.config.ts**

```typescript
// vitest.config.ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue()],
	test: {
		environment: 'happy-dom',
		setupFiles: ['./tests/setup.ts'],
		globals: true,
		include: ['tests/**/*.test.ts'],
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
})
```

- [ ] **Step 2: Create tests/setup.ts**

```typescript
// tests/setup.ts
import { afterAll, afterEach, beforeAll } from 'vitest'

// MSW server will be imported here once handlers exist (Task 52).
// For now, this file just exists so vitest.config.ts resolves it.

beforeAll(() => {})
afterEach(() => {})
afterAll(() => {})
```

- [ ] **Step 3: Add test scripts to package.json**

In `package.json`, add to the `scripts` block:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

- [ ] **Step 4: Run vitest to verify config loads**

Run: `npm run test`
Expected: "No test files found, exiting with code 0" OR pass with 0 tests (Vitest 2.x behavior). No config errors.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts tests/setup.ts package.json
git commit -m "chore: configure vitest with happy-dom environment"
```

---

### Task 3: Configure Prettier (minimal)

**Files:**
- Create: `.prettierrc.json`
- Create: `.prettierignore`

- [ ] **Step 1: Create .prettierrc.json**

```json
{
	"useTabs": true,
	"tabWidth": 2,
	"semi": false,
	"singleQuote": true,
	"printWidth": 120,
	"trailingComma": "all",
	"arrowParens": "avoid",
	"vueIndentScriptAndStyle": false
}
```

- [ ] **Step 2: Create .prettierignore**

```
dist/
node_modules/
public/
*.md
package-lock.json
src/assets/main.css
```

- [ ] **Step 3: Commit**

```bash
git add .prettierrc.json .prettierignore
git commit -m "chore: add minimal prettier config preserving tabs convention"
```

Note: Skip running `prettier --write` across the codebase. That would create a massive diff. Prettier is available locally; formatting adoption is incremental.

---

### Task 4: Set up MSW browser worker directory

**Files:**
- Create: `public/mockServiceWorker.js` (via MSW CLI)
- Create: `src/mocks/browser.ts` (stub)
- Create: `src/mocks/server.ts` (stub)
- Create: `src/mocks/handlers.ts` (stub)

- [ ] **Step 1: Generate MSW service worker file**

Run: `npx msw init public/ --save`
Expected: Creates `public/mockServiceWorker.js`

- [ ] **Step 2: Create src/mocks/handlers.ts stub**

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

// Handlers will be added in Phase 8 (Tasks 47-52).
// Starting with an empty array so browser.ts and server.ts can import it.
export const handlers = []
```

- [ ] **Step 3: Create src/mocks/browser.ts**

```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

- [ ] **Step 4: Create src/mocks/server.ts**

```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

- [ ] **Step 5: Commit**

```bash
git add public/mockServiceWorker.js src/mocks/
git commit -m "chore: scaffold msw browser + node setup with empty handlers"
```

---

## Phase 2: Auth Boot + HTTP Client

### Task 5: Define boot contract and window global type

**Files:**
- Create: `src/api/boot.ts`

- [ ] **Step 1: Create src/api/boot.ts**

```typescript
// src/api/boot.ts
import type { User } from '@/types'

export interface BootData {
	user: User
	nonce: string
	apiBase: string
	logoutUrl: string
	loginUrl: string
}

declare global {
	interface Window {
		aioseoAccount?: BootData
	}
}

/**
 * Reads window.aioseoAccount injected by WordPress via wp_localize_script.
 * In dev mode, installDevBootData() populates this before the app boots.
 * Throws if no boot data is available — the SPA cannot run without it.
 */
export function readBootData(): BootData {
	const data = window.aioseoAccount
	if (!data) {
		throw new Error(
			'SPA was not initialized — window.aioseoAccount is missing. ' +
			'In production this means WordPress did not inject boot data via wp_localize_script. ' +
			'In dev mode this means installDevBootData() was not called before mount.',
		)
	}
	return data
}

/**
 * Dev-only: populates window.aioseoAccount with fixture data.
 * Called from main.ts when import.meta.env.DEV is true.
 */
export function installDevBootData(): void {
	window.aioseoAccount = {
		user: {
			id: 1,
			firstName: 'Arnaud',
			lastName: 'Broes',
			email: 'abroes@awesomemotive.com',
			avatarUrl: '/account/assets/images/avatar-arnaud.png',
			billingAddress: {
				line1: '1209 Orange Street',
				line2: 'Suite 100',
				city: 'Wilmington',
				zip: '19801',
				country: 'US',
				state: 'DE',
			},
		},
		nonce: 'dev-nonce-000',
		apiBase: '/wp-json/aioseo/v1/',
		logoutUrl: 'https://aioseo.com/login/',
		loginUrl: 'https://aioseo.com/login/',
	}
}
```

- [ ] **Step 2: Verify User type has an `id` field**

Run: `grep -n "id" src/types/user.ts`
Expected: If `id` field is missing, add it:

```typescript
// src/types/user.ts — add id field if missing
export interface User {
	id: number
	firstName: string
	lastName: string
	email: string
	avatarUrl: string
	billingAddress: BillingAddress
}
```

- [ ] **Step 3: Commit**

```bash
git add src/api/boot.ts src/types/user.ts
git commit -m "feat(api): add boot data contract for window.aioseoAccount"
```

---

### Task 6: Create error types

**Files:**
- Create: `src/api/errors.ts`

- [ ] **Step 1: Create src/api/errors.ts**

```typescript
// src/api/errors.ts

/**
 * Normalized API errors. The HTTP client throws one of these from every request.
 */

export class ApiError extends Error {
	readonly status: number
	readonly data: unknown
	constructor(message: string, status: number, data: unknown = null) {
		super(message)
		this.name = 'ApiError'
		this.status = status
		this.data = data
	}
}

export class AuthError extends ApiError {
	constructor(data: unknown = null) {
		super('Session expired', 401, data)
		this.name = 'AuthError'
	}
}

export class AuthorizationError extends ApiError {
	constructor(data: unknown = null) {
		super('Not authorized', 403, data)
		this.name = 'AuthorizationError'
	}
}

export class NotFoundError extends ApiError {
	constructor(data: unknown = null) {
		super('Not found', 404, data)
		this.name = 'NotFoundError'
	}
}

export class NetworkError extends ApiError {
	constructor(cause: Error) {
		super('Network request failed: ' + cause.message, 0, null)
		this.name = 'NetworkError'
	}
}

export function isAuthError(e: unknown): e is AuthError {
	return e instanceof AuthError
}
```

- [ ] **Step 2: Commit**

```bash
git add src/api/errors.ts
git commit -m "feat(api): add normalized error types"
```

---

### Task 7: Create HTTP client

**Files:**
- Create: `src/api/client.ts`

- [ ] **Step 1: Create src/api/client.ts**

```typescript
// src/api/client.ts
import { ApiError, AuthError, AuthorizationError, NetworkError, NotFoundError } from './errors'

interface ClientConfig {
	baseURL: string
	nonce: string
	onAuthError?: () => void
}

interface RequestOptions {
	method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
	body?: unknown
	signal?: AbortSignal
}

let config: ClientConfig | null = null

export function configureClient(next: ClientConfig): void {
	config = next
}

export function getClientConfig(): ClientConfig {
	if (!config) {
		throw new Error('HTTP client not configured — call configureClient() at boot')
	}
	return config
}

/**
 * Core request function. Every composable and test calls this.
 * Throws typed errors on non-2xx responses.
 */
export async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
	const cfg = getClientConfig()
	const url = cfg.baseURL.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
	const method = options.method ?? 'GET'

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'X-WP-Nonce': cfg.nonce,
	}
	if (options.body !== undefined) {
		headers['Content-Type'] = 'application/json'
	}

	let response: Response
	try {
		response = await fetch(url, {
			method,
			credentials: 'include',
			headers,
			body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
			signal: options.signal,
		})
	} catch (e) {
		throw new NetworkError(e as Error)
	}

	const isJson = response.headers.get('content-type')?.includes('application/json')
	const data = isJson ? await response.json() : await response.text()

	if (response.ok) {
		return data as T
	}

	if (response.status === 401) {
		cfg.onAuthError?.()
		throw new AuthError(data)
	}
	if (response.status === 403) throw new AuthorizationError(data)
	if (response.status === 404) throw new NotFoundError(data)

	const message =
		(isJson && typeof data === 'object' && data && 'message' in data && typeof (data as Record<string, unknown>).message === 'string'
			? ((data as Record<string, unknown>).message as string)
			: null) ?? `Request failed: ${response.status}`
	throw new ApiError(message, response.status, data)
}

// Convenience helpers
export const api = {
	get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: 'GET', signal }),
	post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
	patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
	put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
	delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
```

- [ ] **Step 2: Commit**

```bash
git add src/api/client.ts
git commit -m "feat(api): add fetch wrapper with nonce, error normalization"
```

---

### Task 8: Write HTTP client tests

**Files:**
- Create: `tests/api/client.test.ts`

- [ ] **Step 1: Create tests/api/client.test.ts**

```typescript
// tests/api/client.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { api, configureClient } from '@/api/client'
import { ApiError, AuthError, AuthorizationError, NetworkError, NotFoundError } from '@/api/errors'

const server = setupServer()

beforeEach(() => {
	server.listen({ onUnhandledRequest: 'error' })
	configureClient({
		baseURL: 'https://example.test/api/',
		nonce: 'test-nonce',
	})
})

afterEach(() => {
	server.resetHandlers()
	server.close()
})

describe('HTTP client', () => {
	it('returns parsed JSON on 200', async () => {
		server.use(http.get('https://example.test/api/licenses', () =>
			HttpResponse.json({ licenses: [{ id: 'lic-1' }] }),
		))
		const result = await api.get<{ licenses: { id: string }[] }>('licenses')
		expect(result.licenses[0]?.id).toBe('lic-1')
	})

	it('sends X-WP-Nonce header on every request', async () => {
		let received = ''
		server.use(http.get('https://example.test/api/ping', ({ request }) => {
			received = request.headers.get('X-WP-Nonce') ?? ''
			return HttpResponse.json({ ok: true })
		}))
		await api.get('ping')
		expect(received).toBe('test-nonce')
	})

	it('sends Content-Type: application/json only when body is present', async () => {
		let getType = ''
		let postType = ''
		server.use(
			http.get('https://example.test/api/g', ({ request }) => {
				getType = request.headers.get('Content-Type') ?? ''
				return HttpResponse.json({})
			}),
			http.post('https://example.test/api/p', ({ request }) => {
				postType = request.headers.get('Content-Type') ?? ''
				return HttpResponse.json({})
			}),
		)
		await api.get('g')
		await api.post('p', { x: 1 })
		expect(getType).toBe('')
		expect(postType).toBe('application/json')
	})

	it('throws AuthError on 401 and calls onAuthError', async () => {
		const onAuth = vi.fn()
		configureClient({ baseURL: 'https://example.test/api/', nonce: 'n', onAuthError: onAuth })
		server.use(http.get('https://example.test/api/me', () =>
			HttpResponse.json({ message: 'expired' }, { status: 401 }),
		))
		await expect(api.get('me')).rejects.toBeInstanceOf(AuthError)
		expect(onAuth).toHaveBeenCalledOnce()
	})

	it('throws AuthorizationError on 403', async () => {
		server.use(http.get('https://example.test/api/forbidden', () => new HttpResponse(null, { status: 403 })))
		await expect(api.get('forbidden')).rejects.toBeInstanceOf(AuthorizationError)
	})

	it('throws NotFoundError on 404', async () => {
		server.use(http.get('https://example.test/api/missing', () => new HttpResponse(null, { status: 404 })))
		await expect(api.get('missing')).rejects.toBeInstanceOf(NotFoundError)
	})

	it('throws ApiError with server message on 5xx', async () => {
		server.use(http.get('https://example.test/api/boom', () =>
			HttpResponse.json({ message: 'database down' }, { status: 500 }),
		))
		await expect(api.get('boom')).rejects.toMatchObject({
			name: 'ApiError',
			status: 500,
			message: 'database down',
		})
	})

	it('throws NetworkError on fetch failure', async () => {
		server.use(http.get('https://example.test/api/dead', () => HttpResponse.error()))
		await expect(api.get('dead')).rejects.toBeInstanceOf(NetworkError)
	})

	it('serializes JSON body on POST', async () => {
		let receivedBody: unknown = null
		server.use(http.post('https://example.test/api/things', async ({ request }) => {
			receivedBody = await request.json()
			return HttpResponse.json({ ok: true })
		}))
		await api.post('things', { name: 'x', count: 3 })
		expect(receivedBody).toEqual({ name: 'x', count: 3 })
	})

	it('handles DELETE with no body', async () => {
		server.use(http.delete('https://example.test/api/things/1', () => new HttpResponse(null, { status: 204 })))
		await expect(api.delete('things/1')).resolves.toBeTruthy()
	})
})
```

- [ ] **Step 2: Run the tests**

Run: `npm run test -- tests/api/client.test.ts`
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/api/client.test.ts
git commit -m "test(api): cover http client paths (nonce, errors, body, methods)"
```

---

### Task 9: Create auth store

**Files:**
- Create: `src/stores/auth.ts`

- [ ] **Step 1: Create src/stores/auth.ts**

```typescript
// src/stores/auth.ts
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
	const user = ref<User | null>(null)
	const nonce = ref<string>('')
	const loginUrl = ref<string>('')

	const isAuthenticated = computed(() => user.value !== null)

	function initialize(u: User, n: string, login: string): void {
		user.value = u
		nonce.value = n
		loginUrl.value = login
	}

	function setUser(u: User): void {
		user.value = u
	}

	function clear(): void {
		user.value = null
		nonce.value = ''
	}

	return { user, nonce, loginUrl, isAuthenticated, initialize, setUser, clear }
})
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/auth.ts
git commit -m "feat(stores): add auth store for window.aioseoAccount data"
```

---

### Task 10: Wire boot data + HTTP client into main.ts

**Files:**
- Modify: `src/main.ts`

- [ ] **Step 1: Update src/main.ts**

```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { installDevBootData, readBootData } from '@/api/boot'
import { configureClient } from '@/api/client'
import { useAuthStore } from '@/stores/auth'

async function bootstrap() {
	if (import.meta.env.DEV) {
		installDevBootData()
		const { worker } = await import('@/mocks/browser')
		await worker.start({ onUnhandledRequest: 'bypass' })
	}

	const boot = readBootData()

	configureClient({
		baseURL: boot.apiBase,
		nonce: boot.nonce,
		onAuthError: () => {
			const returnTo = window.location.pathname + window.location.search
			const redirectTo = encodeURIComponent(window.location.origin + returnTo)
			window.location.href = boot.loginUrl + '?redirect_to=' + redirectTo
		},
	})

	const app = createApp(App)
	const pinia = createPinia()
	app.use(pinia)
	app.use(router)

	const authStore = useAuthStore()
	authStore.initialize(boot.user, boot.nonce, boot.loginUrl)

	app.mount('#app')
}

bootstrap()
```

- [ ] **Step 2: Run dev server to verify boot succeeds**

Run: `npm run dev` (in background)
Then navigate to `http://localhost:5173/account/` and verify page renders with no errors in console.
Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add src/main.ts
git commit -m "feat(boot): wire boot data + http client into app startup"
```

---

## Phase 3: Query/Mutation Layer

### Task 11: Create query cache + invalidation bus

**Files:**
- Create: `src/composables/queryCache.ts`

- [ ] **Step 1: Create src/composables/queryCache.ts**

```typescript
// src/composables/queryCache.ts
import { ref, type Ref } from 'vue'

/**
 * Shared cache + invalidation bus. Keyed entries live for the lifetime of the app.
 * Each entry holds data, isLoading, error, and a refetch function.
 */

interface CacheEntry<T = unknown> {
	data: Ref<T | null>
	isLoading: Ref<boolean>
	error: Ref<Error | null>
	refetch: () => Promise<void>
	subscribers: number
	lastFetchedAt: number
}

const entries = new Map<string, CacheEntry>()

export function getOrCreateEntry<T>(
	key: string,
	fetcher: () => Promise<T>,
): CacheEntry<T> {
	const existing = entries.get(key)
	if (existing) return existing as CacheEntry<T>

	const data = ref<T | null>(null) as Ref<T | null>
	const isLoading = ref(false)
	const error = ref<Error | null>(null)

	const entry: CacheEntry<T> = {
		data,
		isLoading,
		error,
		subscribers: 0,
		lastFetchedAt: 0,
		refetch: async () => {
			isLoading.value = true
			error.value = null
			try {
				const result = await fetcher()
				data.value = result
				entry.lastFetchedAt = Date.now()
			} catch (e) {
				error.value = e as Error
			} finally {
				isLoading.value = false
			}
		},
	}
	entries.set(key, entry as CacheEntry)
	return entry
}

export function invalidateQuery(keyOrPrefix: string): void {
	for (const [k, entry] of entries) {
		if (k === keyOrPrefix || k.startsWith(keyOrPrefix + ':')) {
			void entry.refetch()
		}
	}
}

export function clearCache(): void {
	entries.clear()
}

// Test-only helper
export function _getEntries(): Map<string, CacheEntry> {
	return entries
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/queryCache.ts
git commit -m "feat(composables): add query cache + invalidation bus"
```

---

### Task 12: Create useAsyncResource composable

**Files:**
- Create: `src/composables/useAsyncResource.ts`

- [ ] **Step 1: Create src/composables/useAsyncResource.ts**

```typescript
// src/composables/useAsyncResource.ts
import { computed, onMounted, type ComputedRef, type Ref } from 'vue'
import { getOrCreateEntry } from './queryCache'

const DEFAULT_STALE_TIME = 5 * 60 * 1000 // 5 minutes

interface AsyncResourceOptions {
	/** How long cached data is considered fresh (ms). Default: 5 minutes. */
	staleTime?: number
}

export interface AsyncResource<T> {
	data: Ref<T | null>
	isLoading: Ref<boolean>
	error: Ref<Error | null>
	isEmpty: ComputedRef<boolean>
	refetch: () => Promise<void>
}

/**
 * Creates (or joins) a cached async resource identified by `key`.
 * Multiple components calling with the same key share one underlying fetch.
 *
 * On mount, triggers a fetch if data is null OR staleTime has elapsed.
 * Never refetches on window focus (disabled by design).
 */
export function useAsyncResource<T>(
	key: string,
	fetcher: () => Promise<T>,
	options: AsyncResourceOptions = {},
): AsyncResource<T> {
	const staleTime = options.staleTime ?? DEFAULT_STALE_TIME
	const entry = getOrCreateEntry<T>(key, fetcher)

	const isEmpty = computed(() => {
		const d = entry.data.value
		if (d === null || d === undefined) return false
		if (Array.isArray(d)) return d.length === 0
		if (typeof d === 'object' && d !== null && 'length' in d) {
			return (d as { length: number }).length === 0
		}
		return false
	})

	onMounted(() => {
		entry.subscribers += 1
		const age = Date.now() - entry.lastFetchedAt
		const shouldFetch = entry.data.value === null || age > staleTime
		if (shouldFetch && !entry.isLoading.value) {
			void entry.refetch()
		}
	})

	return {
		data: entry.data,
		isLoading: entry.isLoading,
		error: entry.error,
		isEmpty,
		refetch: entry.refetch,
	}
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useAsyncResource.ts
git commit -m "feat(composables): add useAsyncResource with cache sharing"
```

---

### Task 13: Create useMutation composable

**Files:**
- Create: `src/composables/useMutation.ts`

- [ ] **Step 1: Create src/composables/useMutation.ts**

```typescript
// src/composables/useMutation.ts
import { ref, type Ref } from 'vue'
import { invalidateQuery } from './queryCache'

interface MutationOptions<TInput, TResult> {
	/** Query keys (or prefixes) to invalidate after success */
	invalidates?: string[]
	/** Called after successful mutation, before invalidation */
	onSuccess?: (result: TResult, input: TInput) => void | Promise<void>
	/** Called on error */
	onError?: (error: Error, input: TInput) => void
}

export interface MutationResult<TInput, TResult> {
	mutate: (input: TInput) => Promise<TResult>
	isPending: Ref<boolean>
	error: Ref<Error | null>
	reset: () => void
}

/**
 * Wraps an async mutation function with isPending + error state and
 * automatic cache invalidation on success.
 */
export function useMutation<TInput, TResult>(
	mutationFn: (input: TInput) => Promise<TResult>,
	options: MutationOptions<TInput, TResult> = {},
): MutationResult<TInput, TResult> {
	const isPending = ref(false)
	const error = ref<Error | null>(null)

	async function mutate(input: TInput): Promise<TResult> {
		isPending.value = true
		error.value = null
		try {
			const result = await mutationFn(input)
			if (options.onSuccess) await options.onSuccess(result, input)
			if (options.invalidates) {
				for (const key of options.invalidates) invalidateQuery(key)
			}
			return result
		} catch (e) {
			error.value = e as Error
			options.onError?.(e as Error, input)
			throw e
		} finally {
			isPending.value = false
		}
	}

	function reset(): void {
		error.value = null
		isPending.value = false
	}

	return { mutate, isPending, error, reset }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useMutation.ts
git commit -m "feat(composables): add useMutation with auto-invalidation"
```

---

### Task 14: Define query keys

**Files:**
- Create: `src/api/keys.ts`

- [ ] **Step 1: Create src/api/keys.ts**

```typescript
// src/api/keys.ts

/**
 * Canonical cache keys. All composables reference these — never string-literal keys
 * inline. Hierarchical naming lets invalidateQuery('billing') refetch all billing
 * subkeys at once.
 */

export const queryKeys = {
	licenses: 'licenses',
	account: 'account',
	aiCredits: 'ai-credits',
	subscriptions: 'billing:subscriptions',
	paymentMethods: 'billing:payment-methods',
	orders: 'billing:orders',
	offers: 'offers',
	announcements: 'announcements',
	helpArticles: (query: string) => `help:search:${query}`,
	billing: 'billing',
} as const
```

- [ ] **Step 2: Commit**

```bash
git add src/api/keys.ts
git commit -m "feat(api): add canonical query key constants"
```

---

### Task 15: Write useAsyncResource tests

**Files:**
- Create: `tests/composables/useAsyncResource.test.ts`

- [ ] **Step 1: Create the test file**

```typescript
// tests/composables/useAsyncResource.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useAsyncResource } from '@/composables/useAsyncResource'
import { clearCache, invalidateQuery } from '@/composables/queryCache'

afterEach(() => clearCache())

function makeHost<T>(key: string, fetcher: () => Promise<T>) {
	return defineComponent({
		setup() {
			const r = useAsyncResource(key, fetcher)
			return () => h('div', [
				h('span', { class: 'loading' }, String(r.isLoading.value)),
				h('span', { class: 'data' }, JSON.stringify(r.data.value)),
				h('span', { class: 'error' }, r.error.value?.message ?? ''),
			])
		},
	})
}

describe('useAsyncResource', () => {
	it('fetches on mount and exposes data', async () => {
		const fetcher = vi.fn().mockResolvedValue({ id: 1, name: 'foo' })
		const wrapper = mount(makeHost('t1', fetcher))
		await nextTick()
		await nextTick()
		expect(fetcher).toHaveBeenCalledOnce()
		expect(wrapper.find('.data').text()).toBe('{"id":1,"name":"foo"}')
	})

	it('shares one fetch across multiple mounts of same key', async () => {
		const fetcher = vi.fn().mockResolvedValue([1, 2, 3])
		const Host = makeHost('t2', fetcher)
		mount(Host)
		mount(Host)
		mount(Host)
		await nextTick()
		await nextTick()
		expect(fetcher).toHaveBeenCalledOnce()
	})

	it('captures errors into error ref', async () => {
		const fetcher = vi.fn().mockRejectedValue(new Error('boom'))
		const wrapper = mount(makeHost('t3', fetcher))
		await nextTick()
		await nextTick()
		expect(wrapper.find('.error').text()).toBe('boom')
	})

	it('refetches when invalidateQuery is called', async () => {
		const fetcher = vi.fn().mockResolvedValue({ v: 1 })
		mount(makeHost('t4', fetcher))
		await nextTick()
		await nextTick()
		expect(fetcher).toHaveBeenCalledOnce()
		invalidateQuery('t4')
		await nextTick()
		expect(fetcher).toHaveBeenCalledTimes(2)
	})

	it('refetches subkeys by prefix', async () => {
		const fetcherA = vi.fn().mockResolvedValue('a')
		const fetcherB = vi.fn().mockResolvedValue('b')
		mount(makeHost('billing:subs', fetcherA))
		mount(makeHost('billing:orders', fetcherB))
		await nextTick()
		await nextTick()
		expect(fetcherA).toHaveBeenCalledOnce()
		expect(fetcherB).toHaveBeenCalledOnce()
		invalidateQuery('billing')
		await nextTick()
		expect(fetcherA).toHaveBeenCalledTimes(2)
		expect(fetcherB).toHaveBeenCalledTimes(2)
	})
})
```

- [ ] **Step 2: Install @vue/test-utils**

Run: `npm install --save-dev @vue/test-utils@^2`

- [ ] **Step 3: Run the tests**

Run: `npm run test -- tests/composables/useAsyncResource.test.ts`
Expected: All 5 tests pass

- [ ] **Step 4: Commit**

```bash
git add tests/composables/useAsyncResource.test.ts package.json package-lock.json
git commit -m "test(composables): cover useAsyncResource caching + invalidation"
```

---

### Task 16: Write useMutation tests

**Files:**
- Create: `tests/composables/useMutation.test.ts`

- [ ] **Step 1: Create the test file**

```typescript
// tests/composables/useMutation.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useMutation } from '@/composables/useMutation'
import { clearCache, getOrCreateEntry } from '@/composables/queryCache'

afterEach(() => clearCache())

describe('useMutation', () => {
	it('calls mutationFn and resolves with result', async () => {
		const fn = vi.fn().mockResolvedValue({ id: 1 })
		const { mutate } = useMutation(fn)
		const result = await mutate({ name: 'x' })
		expect(fn).toHaveBeenCalledWith({ name: 'x' })
		expect(result).toEqual({ id: 1 })
	})

	it('sets isPending during the mutation', async () => {
		let resolveFn: (v: unknown) => void = () => {}
		const fn = () => new Promise(r => { resolveFn = r })
		const { mutate, isPending } = useMutation(fn as (i: void) => Promise<unknown>)
		expect(isPending.value).toBe(false)
		const p = mutate()
		expect(isPending.value).toBe(true)
		resolveFn('done')
		await p
		expect(isPending.value).toBe(false)
	})

	it('captures errors into error ref and rethrows', async () => {
		const fn = vi.fn().mockRejectedValue(new Error('fail'))
		const { mutate, error } = useMutation(fn)
		await expect(mutate(null)).rejects.toThrow('fail')
		expect(error.value?.message).toBe('fail')
	})

	it('invalidates query keys after success', async () => {
		const refetchSpy = vi.fn().mockResolvedValue(undefined)
		getOrCreateEntry('licenses', () => Promise.resolve(null)).refetch = refetchSpy
		const fn = vi.fn().mockResolvedValue({})
		const { mutate } = useMutation(fn, { invalidates: ['licenses'] })
		await mutate(null)
		expect(refetchSpy).toHaveBeenCalledOnce()
	})

	it('calls onSuccess before invalidation', async () => {
		const order: string[] = []
		getOrCreateEntry('k', () => Promise.resolve(null)).refetch = async () => {
			order.push('invalidate')
		}
		const { mutate } = useMutation(
			async () => ({ ok: true }),
			{
				invalidates: ['k'],
				onSuccess: () => { order.push('onSuccess') },
			},
		)
		await mutate(null)
		expect(order).toEqual(['onSuccess', 'invalidate'])
	})

	it('calls onError on failure', async () => {
		const onError = vi.fn()
		const { mutate } = useMutation(
			() => Promise.reject(new Error('x')),
			{ onError },
		)
		await expect(mutate(null)).rejects.toThrow()
		expect(onError).toHaveBeenCalledOnce()
	})
})
```

- [ ] **Step 2: Run the tests**

Run: `npm run test -- tests/composables/useMutation.test.ts`
Expected: All 6 tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/composables/useMutation.test.ts
git commit -m "test(composables): cover useMutation states + invalidation ordering"
```

---

## Phase 4: Toast + Form + Utility Composables

### Task 17: Create toast store

**Files:**
- Create: `src/stores/toast.ts`

- [ ] **Step 1: Create src/stores/toast.ts**

```typescript
// src/stores/toast.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export type ToastTone = 'success' | 'error' | 'info'

export interface Toast {
	id: number
	tone: ToastTone
	message: string
	durationMs: number
}

let nextId = 1

export const useToastStore = defineStore('toast', () => {
	const toasts = ref<Toast[]>([])

	function push(tone: ToastTone, message: string, durationMs = 3500): number {
		const id = nextId++
		toasts.value.push({ id, tone, message, durationMs })
		if (durationMs > 0) {
			setTimeout(() => dismiss(id), durationMs)
		}
		return id
	}

	function dismiss(id: number): void {
		toasts.value = toasts.value.filter(t => t.id !== id)
	}

	function clear(): void {
		toasts.value = []
	}

	return { toasts, push, dismiss, clear }
})
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/toast.ts
git commit -m "feat(stores): add toast store with tone + auto-dismiss"
```

---

### Task 18: Create useToast composable

**Files:**
- Create: `src/composables/useToast.ts`

- [ ] **Step 1: Create src/composables/useToast.ts**

```typescript
// src/composables/useToast.ts
import { useToastStore } from '@/stores/toast'

export function useToast() {
	const store = useToastStore()
	return {
		success: (message: string, durationMs?: number) => store.push('success', message, durationMs),
		error: (message: string, durationMs?: number) => store.push('error', message, durationMs ?? 6000),
		info: (message: string, durationMs?: number) => store.push('info', message, durationMs),
		dismiss: store.dismiss,
	}
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useToast.ts
git commit -m "feat(composables): add useToast accessor"
```

---

### Task 19: Create ToastHost component

**Files:**
- Create: `src/components/ToastHost.vue`

- [ ] **Step 1: Create src/components/ToastHost.vue**

```vue
<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const store = useToastStore()

function toneClasses(tone: 'success' | 'error' | 'info'): string {
	if (tone === 'success') return 'bg-brand-navy text-white'
	if (tone === 'error') return 'bg-brand-red text-white'
	return 'bg-brand-navy text-white'
}
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] flex flex-col items-center gap-2 pointer-events-none"
			role="region"
			aria-live="polite"
			aria-label="Notifications"
		>
			<TransitionGroup
				enter-active-class="transition duration-300 ease-out"
				enter-from-class="opacity-0 translate-y-4"
				enter-to-class="opacity-100 translate-y-0"
				leave-active-class="transition duration-200 ease-in"
				leave-from-class="opacity-100 translate-y-0"
				leave-to-class="opacity-0 translate-y-2"
			>
				<div
					v-for="t in store.toasts"
					:key="t.id"
					:class="['pointer-events-auto px-6 py-3 rounded-card shadow-xl text-sm font-medium min-w-[280px] max-w-[480px] flex items-center justify-between gap-3', toneClasses(t.tone)]"
				>
					<span>{{ t.message }}</span>
					<button
						@click="store.dismiss(t.id)"
						class="text-white/70 hover:text-white bg-transparent border-0 cursor-pointer shrink-0"
						aria-label="Dismiss"
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</TransitionGroup>
		</div>
	</Teleport>
</template>
```

- [ ] **Step 2: Mount ToastHost in AppLayout**

Modify `src/layout/AppLayout.vue`. Add import at top of `<script setup>`:
```typescript
import ToastHost from '@/components/ToastHost.vue'
```

Add `<ToastHost />` as the last child of the root `<div>` in the template, after `<ProfileSwitcher />`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ToastHost.vue src/layout/AppLayout.vue
git commit -m "feat(components): add ToastHost teleported renderer"
```

---

### Task 20: Write toast store tests

**Files:**
- Create: `tests/stores/toast.test.ts`

- [ ] **Step 1: Create the test file**

```typescript
// tests/stores/toast.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useToastStore } from '@/stores/toast'

beforeEach(() => {
	setActivePinia(createPinia())
	vi.useFakeTimers()
})

afterEach(() => {
	vi.useRealTimers()
})

describe('toast store', () => {
	it('pushes toasts onto the queue', () => {
		const store = useToastStore()
		store.push('success', 'Saved', 1000)
		expect(store.toasts).toHaveLength(1)
		expect(store.toasts[0]?.message).toBe('Saved')
		expect(store.toasts[0]?.tone).toBe('success')
	})

	it('assigns unique ids', () => {
		const store = useToastStore()
		const a = store.push('info', 'one')
		const b = store.push('info', 'two')
		expect(a).not.toBe(b)
	})

	it('auto-dismisses after durationMs', () => {
		const store = useToastStore()
		store.push('success', 'Saved', 1000)
		expect(store.toasts).toHaveLength(1)
		vi.advanceTimersByTime(999)
		expect(store.toasts).toHaveLength(1)
		vi.advanceTimersByTime(2)
		expect(store.toasts).toHaveLength(0)
	})

	it('does not auto-dismiss when durationMs is 0', () => {
		const store = useToastStore()
		store.push('error', 'sticky', 0)
		vi.advanceTimersByTime(60_000)
		expect(store.toasts).toHaveLength(1)
	})

	it('dismisses manually by id', () => {
		const store = useToastStore()
		const id = store.push('info', 'x', 0)
		store.dismiss(id)
		expect(store.toasts).toHaveLength(0)
	})

	it('clears all toasts', () => {
		const store = useToastStore()
		store.push('info', 'a', 0)
		store.push('info', 'b', 0)
		store.clear()
		expect(store.toasts).toHaveLength(0)
	})
})
```

- [ ] **Step 2: Run the tests**

Run: `npm run test -- tests/stores/toast.test.ts`
Expected: All 6 tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/stores/toast.test.ts
git commit -m "test(stores): cover toast push/dismiss/auto-dismiss"
```

---

### Task 21: Create useForm composable

**Files:**
- Create: `src/composables/useForm.ts`

- [ ] **Step 1: Create src/composables/useForm.ts**

```typescript
// src/composables/useForm.ts
import { computed, reactive, ref } from 'vue'

type FieldErrors<T> = Partial<Record<keyof T, string>>
type Validator<T> = (values: T) => FieldErrors<T>

interface UseFormOptions<T> {
	initial: T
	validate?: Validator<T>
}

export function useForm<T extends Record<string, unknown>>(options: UseFormOptions<T>) {
	const values = reactive({ ...options.initial }) as T
	const errors = ref<FieldErrors<T>>({})
	const touched = reactive({}) as Partial<Record<keyof T, boolean>>

	const isDirty = computed(() => {
		for (const key of Object.keys(options.initial) as Array<keyof T>) {
			if (values[key] !== options.initial[key]) return true
		}
		return false
	})

	const isValid = computed(() => Object.keys(errors.value).length === 0)

	function validate(): boolean {
		if (options.validate) {
			errors.value = options.validate(values)
		}
		return Object.keys(errors.value).length === 0
	}

	function reset(nextInitial?: T): void {
		const base = nextInitial ?? options.initial
		for (const key of Object.keys(base) as Array<keyof T>) {
			;(values as Record<keyof T, unknown>)[key] = base[key]
		}
		errors.value = {}
		for (const k of Object.keys(touched) as Array<keyof T>) delete touched[k]
	}

	function setError(field: keyof T, message: string): void {
		errors.value = { ...errors.value, [field]: message }
	}

	function clearErrors(): void {
		errors.value = {}
	}

	function touch(field: keyof T): void {
		touched[field] = true
	}

	return {
		values,
		errors,
		touched,
		isDirty,
		isValid,
		validate,
		reset,
		setError,
		clearErrors,
		touch,
	}
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useForm.ts
git commit -m "feat(composables): add useForm with dirty tracking + validation"
```

---

### Task 22: Write useForm tests

**Files:**
- Create: `tests/composables/useForm.test.ts`

- [ ] **Step 1: Create the test file**

```typescript
// tests/composables/useForm.test.ts
import { describe, expect, it } from 'vitest'
import { useForm } from '@/composables/useForm'

describe('useForm', () => {
	it('initializes with given values', () => {
		const f = useForm({ initial: { name: 'Arnaud', age: 30 } })
		expect(f.values.name).toBe('Arnaud')
		expect(f.values.age).toBe(30)
	})

	it('tracks dirty state when values change', () => {
		const f = useForm({ initial: { name: 'Arnaud' } })
		expect(f.isDirty.value).toBe(false)
		f.values.name = 'Adam'
		expect(f.isDirty.value).toBe(true)
	})

	it('is not dirty when value is changed and changed back', () => {
		const f = useForm({ initial: { x: 1 } })
		f.values.x = 2
		expect(f.isDirty.value).toBe(true)
		f.values.x = 1
		expect(f.isDirty.value).toBe(false)
	})

	it('runs validator and populates errors', () => {
		const f = useForm({
			initial: { email: '' },
			validate: v => ({ email: v.email.includes('@') ? undefined : 'Invalid email' }),
		})
		const ok = f.validate()
		expect(ok).toBe(false)
		expect(f.errors.value.email).toBe('Invalid email')
	})

	it('returns true from validate when no errors', () => {
		const f = useForm({
			initial: { email: 'a@b.com' },
			validate: v => ({ email: v.email.includes('@') ? undefined : 'Invalid' }),
		})
		expect(f.validate()).toBe(true)
		expect(f.errors.value.email).toBeUndefined()
	})

	it('reset restores initial values and clears errors', () => {
		const f = useForm({ initial: { x: 1 } })
		f.values.x = 99
		f.setError('x', 'bad')
		f.reset()
		expect(f.values.x).toBe(1)
		expect(f.errors.value.x).toBeUndefined()
	})

	it('setError manually adds an error', () => {
		const f = useForm({ initial: { x: 1 } })
		f.setError('x', 'server says no')
		expect(f.errors.value.x).toBe('server says no')
		expect(f.isValid.value).toBe(false)
	})

	it('touch marks field as touched', () => {
		const f = useForm({ initial: { x: 1 } })
		expect(f.touched.x).toBeUndefined()
		f.touch('x')
		expect(f.touched.x).toBe(true)
	})
})
```

- [ ] **Step 2: Run the tests**

Run: `npm run test -- tests/composables/useForm.test.ts`
Expected: All 8 tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/composables/useForm.test.ts
git commit -m "test(composables): cover useForm dirty/validate/reset/touch"
```

---

### Task 23: Create small utility composables (scroll lock, click outside, keystroke)

**Files:**
- Create: `src/composables/useScrollLock.ts`
- Create: `src/composables/useClickOutside.ts`
- Create: `src/composables/useKeyStroke.ts`

- [ ] **Step 1: Create src/composables/useScrollLock.ts**

```typescript
// src/composables/useScrollLock.ts
import { onUnmounted, watch, type Ref } from 'vue'

/**
 * Locks body scroll while the given ref is truthy.
 * Preserves scroll position and any existing overflow style.
 */
export function useScrollLock(isLocked: Ref<boolean>): void {
	let originalOverflow = ''
	let originalPaddingRight = ''

	watch(isLocked, locked => {
		if (locked) {
			originalOverflow = document.body.style.overflow
			originalPaddingRight = document.body.style.paddingRight
			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
			document.body.style.overflow = 'hidden'
			if (scrollbarWidth > 0) {
				document.body.style.paddingRight = scrollbarWidth + 'px'
			}
		} else {
			document.body.style.overflow = originalOverflow
			document.body.style.paddingRight = originalPaddingRight
		}
	}, { immediate: true })

	onUnmounted(() => {
		document.body.style.overflow = originalOverflow
		document.body.style.paddingRight = originalPaddingRight
	})
}
```

- [ ] **Step 2: Create src/composables/useClickOutside.ts**

```typescript
// src/composables/useClickOutside.ts
import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export function useClickOutside(
	target: Ref<HTMLElement | null>,
	handler: (e: MouseEvent) => void,
): void {
	function onClick(e: MouseEvent): void {
		const el = target.value
		if (!el) return
		if (el.contains(e.target as Node)) return
		handler(e)
	}

	onMounted(() => document.addEventListener('mousedown', onClick))
	onBeforeUnmount(() => document.removeEventListener('mousedown', onClick))
}
```

- [ ] **Step 3: Create src/composables/useKeyStroke.ts**

```typescript
// src/composables/useKeyStroke.ts
import { onBeforeUnmount, onMounted } from 'vue'

export function useKeyStroke(key: string, handler: (e: KeyboardEvent) => void): void {
	function onKey(e: KeyboardEvent): void {
		if (e.key === key) handler(e)
	}
	onMounted(() => window.addEventListener('keydown', onKey))
	onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
}
```

- [ ] **Step 4: Commit**

```bash
git add src/composables/useScrollLock.ts src/composables/useClickOutside.ts src/composables/useKeyStroke.ts
git commit -m "feat(composables): add scroll lock, click outside, keystroke utilities"
```

---

### Task 24: Create useClipboard + useDebounceFn

**Files:**
- Create: `src/composables/useClipboard.ts`
- Create: `src/composables/useDebounceFn.ts`

- [ ] **Step 1: Create src/composables/useClipboard.ts**

```typescript
// src/composables/useClipboard.ts
import { ref } from 'vue'

export function useClipboard() {
	const copied = ref(false)
	let timer: ReturnType<typeof setTimeout> | null = null

	async function copy(text: string): Promise<boolean> {
		try {
			await navigator.clipboard.writeText(text)
			copied.value = true
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => { copied.value = false }, 2000)
			return true
		} catch {
			copied.value = false
			return false
		}
	}

	return { copied, copy }
}
```

- [ ] **Step 2: Create src/composables/useDebounceFn.ts**

```typescript
// src/composables/useDebounceFn.ts
export function useDebounceFn<T extends (...args: never[]) => void>(
	fn: T,
	delayMs: number,
): T {
	let timer: ReturnType<typeof setTimeout> | null = null
	return ((...args: Parameters<T>) => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => fn(...args), delayMs)
	}) as T
}
```

- [ ] **Step 3: Commit**

```bash
git add src/composables/useClipboard.ts src/composables/useDebounceFn.ts
git commit -m "feat(composables): add useClipboard + useDebounceFn"
```

---

### Task 25: Create useFocusTrap composable

**Files:**
- Create: `src/composables/useFocusTrap.ts`

- [ ] **Step 1: Create src/composables/useFocusTrap.ts**

```typescript
// src/composables/useFocusTrap.ts
import { nextTick, watch, type Ref } from 'vue'

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusable(root: HTMLElement): HTMLElement[] {
	return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
		.filter(el => el.offsetParent !== null)
}

/**
 * Traps Tab focus inside the element referenced by `container` while `active` is true.
 * Stores the previously-focused element on activate and restores it on deactivate.
 */
export function useFocusTrap(container: Ref<HTMLElement | null>, active: Ref<boolean>): void {
	let previouslyFocused: HTMLElement | null = null

	function onKeydown(e: KeyboardEvent): void {
		if (!active.value || e.key !== 'Tab') return
		const root = container.value
		if (!root) return
		const focusables = getFocusable(root)
		if (focusables.length === 0) {
			e.preventDefault()
			return
		}
		const first = focusables[0]!
		const last = focusables[focusables.length - 1]!
		const current = document.activeElement as HTMLElement | null

		if (e.shiftKey) {
			if (current === first || !root.contains(current)) {
				e.preventDefault()
				last.focus()
			}
		} else {
			if (current === last || !root.contains(current)) {
				e.preventDefault()
				first.focus()
			}
		}
	}

	watch(active, async isActive => {
		if (isActive) {
			previouslyFocused = document.activeElement as HTMLElement | null
			document.addEventListener('keydown', onKeydown)
			await nextTick()
			const root = container.value
			if (root) {
				const focusables = getFocusable(root)
				if (focusables.length > 0) {
					focusables[0]!.focus()
				} else {
					root.focus()
				}
			}
		} else {
			document.removeEventListener('keydown', onKeydown)
			if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
				previouslyFocused.focus()
			}
			previouslyFocused = null
		}
	})
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useFocusTrap.ts
git commit -m "feat(composables): add useFocusTrap with focus return"
```

---

### Task 26: Write useFocusTrap tests

**Files:**
- Create: `tests/composables/useFocusTrap.test.ts`

- [ ] **Step 1: Create the test file**

```typescript
// tests/composables/useFocusTrap.test.ts
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useFocusTrap } from '@/composables/useFocusTrap'

afterEach(() => {
	document.body.innerHTML = ''
})

function makeHost(active: { value: boolean }) {
	return defineComponent({
		setup() {
			const container = ref<HTMLElement | null>(null)
			const isActive = ref(active.value)
			useFocusTrap(container, isActive)
			return { container, isActive }
		},
		template: `
			<div>
				<button class="outside">Outside</button>
				<div ref="container">
					<button class="first">First</button>
					<button class="mid">Mid</button>
					<button class="last">Last</button>
				</div>
			</div>
		`,
	})
}

describe('useFocusTrap', () => {
	it('focuses first focusable when activated', async () => {
		const active = { value: false }
		const wrapper = mount(makeHost(active), { attachTo: document.body })
		wrapper.vm.isActive = true
		await nextTick()
		await nextTick()
		expect(document.activeElement?.className).toBe('first')
	})

	it('wraps Tab from last to first', async () => {
		const wrapper = mount(makeHost({ value: false }), { attachTo: document.body })
		wrapper.vm.isActive = true
		await nextTick()
		await nextTick()
		const last = wrapper.element.querySelector<HTMLElement>('.last')!
		last.focus()
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
		await nextTick()
		expect(document.activeElement?.className).toBe('first')
	})

	it('wraps Shift+Tab from first to last', async () => {
		const wrapper = mount(makeHost({ value: false }), { attachTo: document.body })
		wrapper.vm.isActive = true
		await nextTick()
		await nextTick()
		const first = wrapper.element.querySelector<HTMLElement>('.first')!
		first.focus()
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }))
		await nextTick()
		expect(document.activeElement?.className).toBe('last')
	})

	it('restores focus to previously focused element on deactivate', async () => {
		const wrapper = mount(makeHost({ value: false }), { attachTo: document.body })
		const outside = wrapper.element.querySelector<HTMLElement>('.outside')!
		outside.focus()
		expect(document.activeElement).toBe(outside)
		wrapper.vm.isActive = true
		await nextTick()
		await nextTick()
		expect(document.activeElement?.className).toBe('first')
		wrapper.vm.isActive = false
		await nextTick()
		expect(document.activeElement).toBe(outside)
	})
})
```

- [ ] **Step 2: Run the tests**

Run: `npm run test -- tests/composables/useFocusTrap.test.ts`
Expected: All 4 tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/composables/useFocusTrap.test.ts
git commit -m "test(composables): cover focus trap behavior + focus return"
```

---

### Task 27: Create useDocumentTitle + useDirtyForm

**Files:**
- Create: `src/composables/useDocumentTitle.ts`
- Create: `src/composables/useDirtyForm.ts`

- [ ] **Step 1: Create src/composables/useDocumentTitle.ts**

```typescript
// src/composables/useDocumentTitle.ts
import { watch, type Ref } from 'vue'

const SUFFIX = ' · AIOSEO Account'

export function useDocumentTitle(title: Ref<string> | string): void {
	if (typeof title === 'string') {
		document.title = title + SUFFIX
		return
	}
	watch(title, t => { document.title = t + SUFFIX }, { immediate: true })
}
```

- [ ] **Step 2: Create src/composables/useDirtyForm.ts**

```typescript
// src/composables/useDirtyForm.ts
import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

/**
 * Warns the user if they try to leave the page (router navigation OR browser close)
 * while `isDirty` is true.
 */
export function useDirtyForm(isDirty: Ref<boolean>, message = 'You have unsaved changes. Leave anyway?'): void {
	function onBeforeUnload(e: BeforeUnloadEvent): void {
		if (!isDirty.value) return
		e.preventDefault()
		e.returnValue = message
	}

	onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
	onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload))

	onBeforeRouteLeave(() => {
		if (!isDirty.value) return true
		return window.confirm(message)
	})

	// Keep watch reference to avoid unused import (vue's watch is imported for consumer use)
	void watch
}
```

- [ ] **Step 3: Commit**

```bash
git add src/composables/useDocumentTitle.ts src/composables/useDirtyForm.ts
git commit -m "feat(composables): add useDocumentTitle + useDirtyForm"
```

---

## Phase 5: BaseModal A11y Rebuild

### Task 28: Rewrite BaseModal with focus trap, Escape, scroll lock

**Files:**
- Modify: `src/components/BaseModal.vue`

- [ ] **Step 1: Replace BaseModal.vue contents**

```vue
<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useScrollLock } from '@/composables/useScrollLock'
import { useKeyStroke } from '@/composables/useKeyStroke'

const props = defineProps<{
	title: string
	show: boolean
}>()

const emit = defineEmits<{
	close: []
}>()

const panelRef = ref<HTMLElement | null>(null)
const showRef = toRef(props, 'show')

useFocusTrap(panelRef, showRef)
useScrollLock(showRef)
useKeyStroke('Escape', () => {
	if (props.show) emit('close')
})

const titleId = computed(() => `modal-title-${Math.random().toString(36).slice(2, 9)}`)
</script>

<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div v-if="show" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
				<div class="absolute inset-0 bg-brand-navy/40" @click="emit('close')" aria-hidden="true"></div>

				<Transition
					enter-active-class="transition duration-200 ease-out"
					enter-from-class="opacity-0 scale-95 translate-y-2"
					enter-to-class="opacity-100 scale-100 translate-y-0"
					leave-active-class="transition duration-150 ease-in"
					leave-from-class="opacity-100 scale-100 translate-y-0"
					leave-to-class="opacity-0 scale-95 translate-y-2"
				>
					<div
						v-if="show"
						ref="panelRef"
						class="relative bg-white rounded-card shadow-xl w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto"
						role="dialog"
						aria-modal="true"
						:aria-labelledby="titleId"
						tabindex="-1"
					>
						<div class="flex items-center justify-between px-8 pt-8 pb-4 sticky top-0 bg-white z-10">
							<h2 :id="titleId" class="text-h3 font-heading font-semibold text-brand-navy">{{ title }}</h2>
							<button
								@click="emit('close')"
								class="p-1 text-brand-navy-40 hover:text-brand-navy transition-colors duration-200 cursor-pointer rounded-btn"
								aria-label="Close"
							>
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<div class="border-t border-border"></div>

						<div class="px-8 py-6">
							<slot />
						</div>

						<div v-if="$slots.footer" class="border-t border-border px-8 py-5 flex items-center justify-end gap-3">
							<slot name="footer" />
						</div>
					</div>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>
```

- [ ] **Step 2: Run dev server and smoke-test all modals in BillingView**

Run: `npm run dev` (in background)
Navigate to `/account/billing` and verify:
- Add Payment Method modal opens, Tab cycles, Escape closes, backdrop click closes
- Delete Payment Method modal (click Delete on a card) traps focus
- Manage Subscription modal opens, opens Change Plan sub-view, focus stays contained
Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/BaseModal.vue
git commit -m "feat(modal): add focus trap, escape close, scroll lock, aria-modal"
```

---

### Task 29: Write BaseModal a11y tests

**Files:**
- Create: `tests/components/BaseModal.test.ts`

- [ ] **Step 1: Create the test file**

```typescript
// tests/components/BaseModal.test.ts
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import BaseModal from '@/components/BaseModal.vue'

afterEach(() => {
	document.body.innerHTML = ''
	document.body.style.overflow = ''
	document.body.style.paddingRight = ''
})

describe('BaseModal', () => {
	it('renders with role=dialog and aria-modal=true', async () => {
		const wrapper = mount(BaseModal, {
			props: { title: 'Test', show: true },
			slots: { default: '<button>inside</button>' },
			attachTo: document.body,
		})
		await nextTick()
		const dialog = document.querySelector('[role="dialog"]')
		expect(dialog).not.toBeNull()
		expect(dialog?.getAttribute('aria-modal')).toBe('true')
		wrapper.unmount()
	})

	it('locks body scroll while open', async () => {
		const wrapper = mount(BaseModal, {
			props: { title: 'T', show: true },
			attachTo: document.body,
		})
		await nextTick()
		expect(document.body.style.overflow).toBe('hidden')
		wrapper.unmount()
	})

	it('emits close on Escape keydown', async () => {
		const wrapper = mount(BaseModal, {
			props: { title: 'T', show: true },
			attachTo: document.body,
		})
		await nextTick()
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
		expect(wrapper.emitted('close')).toHaveLength(1)
		wrapper.unmount()
	})

	it('emits close on backdrop click', async () => {
		const wrapper = mount(BaseModal, {
			props: { title: 'T', show: true },
			attachTo: document.body,
		})
		await nextTick()
		const backdrop = document.querySelector('.bg-brand-navy\\/40') as HTMLElement
		backdrop?.click()
		expect(wrapper.emitted('close')).toHaveLength(1)
		wrapper.unmount()
	})

	it('emits close on close button click', async () => {
		const wrapper = mount(BaseModal, {
			props: { title: 'T', show: true },
			attachTo: document.body,
		})
		await nextTick()
		const closeBtn = document.querySelector('button[aria-label="Close"]') as HTMLElement
		closeBtn?.click()
		expect(wrapper.emitted('close')).toHaveLength(1)
		wrapper.unmount()
	})
})
```

- [ ] **Step 2: Run the tests**

Run: `npm run test -- tests/components/BaseModal.test.ts`
Expected: All 5 tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/components/BaseModal.test.ts
git commit -m "test(modal): cover a11y + close triggers"
```

---

### Task 30: Wire MSW server into tests/setup.ts

**Files:**
- Modify: `tests/setup.ts`

- [ ] **Step 1: Update tests/setup.ts**

```typescript
// tests/setup.ts
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '@/mocks/server'

beforeAll(() => {
	server.listen({ onUnhandledRequest: 'bypass' })
})

afterEach(() => {
	server.resetHandlers()
})

afterAll(() => {
	server.close()
})
```

- [ ] **Step 2: Run full test suite to verify no regressions**

Run: `npm run test`
Expected: All existing tests still pass. MSW node server starts + stops cleanly.

- [ ] **Step 3: Commit**

```bash
git add tests/setup.ts
git commit -m "test: wire msw node server into vitest setup"
```

---

## Phase 6: Structural Fixes

### Task 31: Create DownloadsIndexView (parent index)

**Files:**
- Create: `src/views/DownloadsIndexView.vue`

- [ ] **Step 1: Create src/views/DownloadsIndexView.vue**

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useLicenses } from '@/composables/useLicenses'
import { useAiCredits } from '@/composables/useAiCredits'
import { computed } from 'vue'

const { hasProduct } = useLicenses()
const { credits } = useAiCredits()

const hasAioseo = hasProduct('aioseo')
const hasBLC = hasProduct('broken-link-checker')
const hasCredits = computed(() => (credits.value?.total ?? 0) > 0)
</script>

<template>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<RouterLink
			v-if="hasAioseo.value"
			to="/downloads/aioseo"
			class="aio-card hover:shadow-card transition-all duration-200 no-underline"
		>
			<h2 class="text-h3 font-heading font-semibold text-brand-navy">AIOSEO</h2>
			<p class="text-sm text-text-muted mt-1">License, addons, and downloads</p>
		</RouterLink>
		<RouterLink
			to="/downloads/blc"
			class="aio-card hover:shadow-card transition-all duration-200 no-underline"
		>
			<h2 class="text-h3 font-heading font-semibold text-brand-navy">Broken Link Checker</h2>
			<p class="text-sm text-text-muted mt-1">{{ hasBLC.value ? 'License and downloads' : 'Add to your plan' }}</p>
		</RouterLink>
		<RouterLink
			v-if="hasCredits"
			to="/downloads/ai-credits"
			class="aio-card hover:shadow-card transition-all duration-200 no-underline"
		>
			<h2 class="text-h3 font-heading font-semibold text-brand-navy">AI Credits</h2>
			<p class="text-sm text-text-muted mt-1">Balance and top-up</p>
		</RouterLink>
	</div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/DownloadsIndexView.vue
git commit -m "feat(views): add DownloadsIndexView as /downloads landing"
```

---

### Task 32: Delete DownloadsView, add child routes

**Files:**
- Delete: `src/views/DownloadsView.vue`
- Modify: `src/router/index.ts`

- [ ] **Step 1: Delete the monolith view**

Run: `rm src/views/DownloadsView.vue`

- [ ] **Step 2: Replace the /downloads route in src/router/index.ts**

Find the existing `downloads` route:
```typescript
{
	path: 'downloads',
	name: 'downloads',
	component: () => import('@/views/DownloadsView.vue'),
},
```

Replace with:
```typescript
{
	path: 'downloads',
	component: () => import('@/views/AppLayout.vue'), // NOTE: just a passthrough, see below
	children: [
		{
			path: '',
			name: 'downloads',
			component: () => import('@/views/DownloadsIndexView.vue'),
		},
		{
			path: 'aioseo',
			name: 'downloads-aioseo',
			component: () => import('@/views/DownloadsAioseoView.vue'),
		},
		{
			path: 'blc',
			name: 'downloads-blc',
			component: () => import('@/views/DownloadsBLCView.vue'),
		},
		{
			path: 'ai-credits',
			name: 'downloads-ai-credits',
			component: () => import('@/views/DownloadsAiCreditsView.vue'),
		},
	],
},
```

Wait — the passthrough is wrong. The downloads routes are already children of `/` (AppLayout). We need flat routes under the same parent. Revise:

Replace with **flat sibling routes** (no nested AppLayout, since the parent AppLayout already wraps all tabs):

```typescript
{
	path: 'downloads',
	name: 'downloads',
	component: () => import('@/views/DownloadsIndexView.vue'),
},
{
	path: 'downloads/aioseo',
	name: 'downloads-aioseo',
	component: () => import('@/views/DownloadsAioseoView.vue'),
},
{
	path: 'downloads/blc',
	name: 'downloads-blc',
	component: () => import('@/views/DownloadsBLCView.vue'),
},
{
	path: 'downloads/ai-credits',
	name: 'downloads-ai-credits',
	component: () => import('@/views/DownloadsAiCreditsView.vue'),
},
```

- [ ] **Step 3: Verify TabNavigation still highlights "Downloads" for sub-routes**

The existing `matchPrefix: 'downloads'` in `src/layout/TabNavigation.vue` already uses `name?.startsWith('downloads')`, which catches `downloads`, `downloads-aioseo`, `downloads-blc`, `downloads-ai-credits`. No change needed.

- [ ] **Step 4: Run dev server and navigate all sub-routes**

Run: `npm run dev`
Navigate: `/account/downloads`, `/account/downloads/aioseo`, `/account/downloads/blc`, `/account/downloads/ai-credits`
Verify: All render, tab stays highlighted.
Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(router): delete DownloadsView monolith, wire 3 sub-views as siblings"
```

---

### Task 33: Fix broken /downloads/ai-credits link in OverviewView

**Files:**
- Modify: `src/views/OverviewView.vue`

- [ ] **Step 1: Verify the link points to the new route name**

The existing `<router-link to="/downloads/ai-credits">` at line 147 should now resolve correctly. Verify by running `npm run dev`, clicking "Add More Credits" on overview, and confirming it navigates to the ai-credits page.

- [ ] **Step 2: If using a name-based link is preferred, update to:**

```vue
<router-link :to="{ name: 'downloads-ai-credits' }" ...>
```

Otherwise leave as path-based link.

- [ ] **Step 3: Commit (if any change)**

```bash
git add src/views/OverviewView.vue
git commit -m "fix(views): resolve /downloads/ai-credits link via named route"
```

---

### Task 34: Add NotFoundView + catch-all route

**Files:**
- Create: `src/views/NotFoundView.vue`
- Modify: `src/router/index.ts`

- [ ] **Step 1: Create src/views/NotFoundView.vue**

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
	<div class="max-w-lg mx-auto py-16 text-center">
		<h1 class="text-display-sm font-heading font-semibold text-brand-navy">404</h1>
		<p class="text-body text-brand-navy-60 mt-2">We couldn't find that page.</p>
		<RouterLink
			to="/overview"
			class="inline-flex items-center gap-1 mt-6 text-brand-blue hover:underline font-semibold"
		>
			← Back to your account
		</RouterLink>
	</div>
</template>
```

- [ ] **Step 2: Add catch-all route**

Inside the `children` array of the root route in `src/router/index.ts`, append:

```typescript
{
	path: ':pathMatch(.*)*',
	name: 'not-found',
	component: () => import('@/views/NotFoundView.vue'),
},
```

- [ ] **Step 3: Verify unknown routes hit the 404**

Run: `npm run dev`, navigate to `/account/bogus-path`
Expected: NotFoundView renders

- [ ] **Step 4: Commit**

```bash
git add src/views/NotFoundView.vue src/router/index.ts
git commit -m "feat(router): add 404 catch-all route + NotFoundView"
```

---

### Task 35: Gate ProfileSwitcher behind import.meta.env.DEV

**Files:**
- Modify: `src/layout/AppLayout.vue`

- [ ] **Step 1: Update the ProfileSwitcher usage**

In `src/layout/AppLayout.vue`, find:
```vue
<ProfileSwitcher />
```

Replace with:
```vue
<ProfileSwitcher v-if="isDev" />
```

Add to `<script setup>`:
```typescript
const isDev = import.meta.env.DEV
```

- [ ] **Step 2: Run prod build to verify ProfileSwitcher is tree-shaken**

Run: `npm run build`
Verify no `ProfileSwitcher` references in dist/assets/*.js

- [ ] **Step 3: Commit**

```bash
git add src/layout/AppLayout.vue
git commit -m "fix(layout): gate ProfileSwitcher behind import.meta.env.DEV"
```

---

### Task 36: Fix asset paths in AppLayout

**Files:**
- Modify: `src/layout/AppLayout.vue`

- [ ] **Step 1: Replace root-relative asset paths with BASE_URL-prefixed paths**

Find:
```vue
<img src="/assets/images/header-graph.svg" alt="" class="w-full max-w-[1440px] h-auto" />
```

Replace with:
```vue
<img :src="baseUrl + 'assets/images/header-graph.svg'" alt="" class="w-full max-w-[1440px] h-auto" />
```

Add to `<script setup>`:
```typescript
const baseUrl = import.meta.env.BASE_URL
```

- [ ] **Step 2: Grep for other root-relative asset refs**

Run: `grep -rn 'src="/assets/' src/ --include="*.vue"`
For each match, convert to `:src="baseUrl + 'assets/...'"`.

- [ ] **Step 3: Verify images load in build preview**

Run: `npm run build && npm run preview`
Visit the served URL. Check header graph + any other images render correctly.

- [ ] **Step 4: Commit**

```bash
git add src/layout/
git commit -m "fix(layout): prefix asset paths with BASE_URL for /account/ subpath"
```

---

### Task 37: Fix html lang attribute

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update <html lang="">**

Replace:
```html
<html lang="">
```

With:
```html
<html lang="en">
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "fix(html): set lang=en on root element"
```

---

### Task 38: Add per-route titles via router meta

**Files:**
- Modify: `src/router/index.ts`
- Modify: `src/layout/AppLayout.vue`

- [ ] **Step 1: Add meta.title to each route**

For each route in `src/router/index.ts`, add a `meta` object. Example:

```typescript
{
	path: 'overview',
	name: 'overview',
	component: () => import('@/views/OverviewView.vue'),
	meta: { title: 'Overview' },
},
{
	path: 'downloads',
	name: 'downloads',
	component: () => import('@/views/DownloadsIndexView.vue'),
	meta: { title: 'Downloads' },
},
// ... etc for every route. Cancel flow routes:
// cancel-support → 'Cancel Subscription'
// cancel-reason → 'Cancel Subscription'
// cancel-offer → 'Save Offer'
// cancel-review → 'Review Cancellation'
// cancel-confirmation → 'Cancellation Confirmed'
```

Meta titles to set (all routes):
- overview → "Overview"
- downloads → "Downloads"
- downloads-aioseo → "Download AIOSEO"
- downloads-blc → "Download Broken Link Checker"
- downloads-ai-credits → "AI Credits"
- services → "Services"
- billing → "Billing"
- profile → "Profile"
- support → "Support"
- suggest-a-feature → "Suggest a Feature"
- giveaway → "Giveaway"
- not-found → "Page Not Found"
- cancel-support → "Cancel Subscription"
- cancel-reason → "Cancel Subscription"
- cancel-offer → "Save Offer"
- cancel-offer-not-using → "Save Offer"
- cancel-review → "Review Cancellation"
- cancel-confirmation → "Cancellation Confirmed"
- cancel-bypass-support → "Contact Support"
- cancel-bypass-plan → "Manage Plan"

- [ ] **Step 2: Apply title via beforeEach guard**

In `src/router/index.ts`, after the `createRouter` call, add:

```typescript
router.beforeEach((to, from, next) => {
	const title = (to.meta.title as string | undefined) ?? 'Account'
	document.title = title + ' · AIOSEO Account'
	next()
})
```

- [ ] **Step 3: Run dev server and verify browser tab title changes per route**

Run: `npm run dev`, navigate through routes, watch tab title update.

- [ ] **Step 4: Commit**

```bash
git add src/router/index.ts
git commit -m "feat(router): add per-route titles via meta + beforeEach guard"
```

---

### Task 39: Fix ProfileView to use v-model + local form state

**Files:**
- Modify: `src/views/ProfileView.vue`

- [ ] **Step 1: Rewrite ProfileView to use useForm**

```vue
<script setup lang="ts">
import { watch } from 'vue'
import { useAccount } from '@/composables/useAccount'
import { useForm } from '@/composables/useForm'
import { useDirtyForm } from '@/composables/useDirtyForm'
import { useSaveProfile } from '@/composables/mutations/useSaveProfile'
import { useToast } from '@/composables/useToast'

const { user } = useAccount()
const toast = useToast()

interface ProfileFormValues {
	firstName: string
	lastName: string
	email: string
	line1: string
	line2: string
	city: string
	zip: string
	country: string
	state: string
	currentPassword: string
	newPassword: string
	confirmPassword: string
}

const initial: ProfileFormValues = {
	firstName: user.value?.firstName ?? '',
	lastName: user.value?.lastName ?? '',
	email: user.value?.email ?? '',
	line1: user.value?.billingAddress.line1 ?? '',
	line2: user.value?.billingAddress.line2 ?? '',
	city: user.value?.billingAddress.city ?? '',
	zip: user.value?.billingAddress.zip ?? '',
	country: user.value?.billingAddress.country ?? '',
	state: user.value?.billingAddress.state ?? '',
	currentPassword: '',
	newPassword: '',
	confirmPassword: '',
}

const form = useForm({
	initial,
	validate: v => {
		const errs: Partial<Record<keyof ProfileFormValues, string>> = {}
		if (!v.firstName.trim()) errs.firstName = 'First name is required'
		if (!v.lastName.trim()) errs.lastName = 'Last name is required'
		if (!v.email.includes('@')) errs.email = 'Valid email required'
		if (v.newPassword && v.newPassword.length < 8) errs.newPassword = 'At least 8 characters'
		if (v.newPassword !== v.confirmPassword) errs.confirmPassword = 'Passwords do not match'
		if (v.newPassword && !v.currentPassword) errs.currentPassword = 'Enter your current password'
		return errs
	},
})

// When user data loads/changes from API, reset the form to match
watch(user, u => {
	if (!u) return
	form.reset({
		...initial,
		firstName: u.firstName,
		lastName: u.lastName,
		email: u.email,
		line1: u.billingAddress.line1,
		line2: u.billingAddress.line2,
		city: u.billingAddress.city,
		zip: u.billingAddress.zip,
		country: u.billingAddress.country,
		state: u.billingAddress.state,
	})
})

useDirtyForm(form.isDirty)

const saveProfile = useSaveProfile()

async function onSave() {
	if (!form.validate()) return
	try {
		await saveProfile.mutate({
			firstName: form.values.firstName,
			lastName: form.values.lastName,
			email: form.values.email,
			billingAddress: {
				line1: form.values.line1,
				line2: form.values.line2,
				city: form.values.city,
				zip: form.values.zip,
				country: form.values.country,
				state: form.values.state,
			},
			currentPassword: form.values.currentPassword || undefined,
			newPassword: form.values.newPassword || undefined,
		})
		toast.success('Profile saved')
		form.reset({
			...form.values,
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		})
	} catch {
		toast.error('Could not save profile')
	}
}
</script>

<template>
	<div class="space-y-10 max-w-2xl mx-auto">
		<section>
			<h2 class="text-xl font-heading font-semibold text-text-primary mb-6">Personal Information</h2>
			<div class="space-y-5">
				<div>
					<p class="text-sm font-semibold text-text-primary mb-1">Name: <span class="text-brand-red">*</span></p>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label for="first-name" class="sr-only">First name</label>
							<input id="first-name" type="text" v-model="form.values.firstName" placeholder="First name" class="aio-input text-sm" />
							<p v-if="form.errors.value.firstName" class="text-xs text-brand-red mt-1">{{ form.errors.value.firstName }}</p>
						</div>
						<div>
							<label for="last-name" class="sr-only">Last name</label>
							<input id="last-name" type="text" v-model="form.values.lastName" placeholder="Last name" class="aio-input text-sm" />
							<p v-if="form.errors.value.lastName" class="text-xs text-brand-red mt-1">{{ form.errors.value.lastName }}</p>
						</div>
					</div>
				</div>
				<div>
					<label for="email" class="text-sm font-semibold text-text-primary mb-1 block">Primary Email Address: <span class="text-brand-red">*</span></label>
					<input id="email" type="email" v-model="form.values.email" placeholder="Email address" class="aio-input text-sm" />
					<p v-if="form.errors.value.email" class="text-xs text-brand-red mt-1">{{ form.errors.value.email }}</p>
				</div>
			</div>
		</section>

		<section>
			<h2 class="text-lg font-heading font-semibold text-text-primary mb-6">Billing Address</h2>
			<div class="space-y-5">
				<div>
					<label for="address-1" class="text-sm font-semibold text-text-primary mb-1 block">Address Line 1</label>
					<input id="address-1" type="text" v-model="form.values.line1" placeholder="Street address" class="aio-input text-sm" />
				</div>
				<div>
					<label for="address-2" class="text-sm font-semibold text-text-primary mb-1 block">Address Line 2</label>
					<input id="address-2" type="text" v-model="form.values.line2" placeholder="Apt, suite, etc. (optional)" class="aio-input text-sm" />
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="city" class="text-sm font-semibold text-text-primary mb-1 block">City</label>
						<input id="city" type="text" v-model="form.values.city" placeholder="City" class="aio-input text-sm" />
					</div>
					<div>
						<label for="zip" class="text-sm font-semibold text-text-primary mb-1 block">Zip / Postal Code</label>
						<input id="zip" type="text" v-model="form.values.zip" placeholder="Zip / Postal code" class="aio-input text-sm" />
					</div>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="country" class="text-sm font-semibold text-text-primary mb-1 block">Country</label>
						<select id="country" v-model="form.values.country" class="aio-input text-sm">
							<option value="">Select a country...</option>
							<option value="US">United States</option>
							<option value="CA">Canada</option>
							<option value="GB">United Kingdom</option>
							<option value="AU">Australia</option>
							<option value="DE">Germany</option>
							<option value="FR">France</option>
						</select>
					</div>
					<div>
						<label for="state" class="text-sm font-semibold text-text-primary mb-1 block">State / Province</label>
						<select id="state" v-model="form.values.state" class="aio-input text-sm">
							<option value="">Select an option...</option>
							<option value="AL">Alabama</option>
							<option value="CA">California</option>
							<option value="DE">Delaware</option>
							<option value="FL">Florida</option>
							<option value="NY">New York</option>
							<option value="TX">Texas</option>
						</select>
					</div>
				</div>
			</div>
		</section>

		<section>
			<h2 class="text-lg font-heading font-semibold text-text-primary mb-6">Change Your Password</h2>
			<div class="space-y-5">
				<div>
					<label for="current-password" class="text-sm font-semibold text-text-primary mb-1 block">Current Password</label>
					<input id="current-password" type="password" v-model="form.values.currentPassword" placeholder="Enter current password" class="aio-input text-sm" />
					<p v-if="form.errors.value.currentPassword" class="text-xs text-brand-red mt-1">{{ form.errors.value.currentPassword }}</p>
				</div>
				<div>
					<label for="new-password" class="text-sm font-semibold text-text-primary mb-1 block">New Password</label>
					<input id="new-password" type="password" v-model="form.values.newPassword" placeholder="Enter new password" class="aio-input text-sm" />
					<p v-if="form.errors.value.newPassword" class="text-xs text-brand-red mt-1">{{ form.errors.value.newPassword }}</p>
				</div>
				<div>
					<label for="confirm-password" class="text-sm font-semibold text-text-primary mb-1 block">Confirm Password</label>
					<input id="confirm-password" type="password" v-model="form.values.confirmPassword" placeholder="Confirm new password" class="aio-input text-sm" />
					<p v-if="form.errors.value.confirmPassword" class="text-xs text-brand-red mt-1">{{ form.errors.value.confirmPassword }}</p>
				</div>
			</div>
		</section>

		<div>
			<button
				@click="onSave"
				:disabled="saveProfile.isPending.value || !form.isDirty.value"
				class="aio-btn-blue hover:opacity-90 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{{ saveProfile.isPending.value ? 'Saving...' : 'Save Changes' }}
			</button>
		</div>
	</div>
</template>
```

Note: this references `useSaveProfile` (Task 61) which does not exist yet. After writing this file, ProfileView will not compile until Task 61 ships. Order is intentional — we stage form UI first, then wire mutation.

- [ ] **Step 2: Add a temporary stub for useSaveProfile so dev server compiles**

Create `src/composables/mutations/useSaveProfile.ts`:

```typescript
// src/composables/mutations/useSaveProfile.ts
// TEMPORARY STUB — replaced in Task 61
import { useMutation } from '@/composables/useMutation'

export function useSaveProfile() {
	return useMutation(async (_input: unknown) => {
		await new Promise(r => setTimeout(r, 500))
		return { ok: true }
	})
}
```

- [ ] **Step 3: Run dev server, verify Profile page loads and Save button enables on typing**

Run: `npm run dev`, navigate to `/account/profile`, type in a field, verify button enables. Click Save, verify "Saving..." label + 500ms delay. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/views/ProfileView.vue src/composables/mutations/useSaveProfile.ts
git commit -m "fix(profile): convert to v-model + useForm with validation and dirty guard"
```

---

### Task 40: Fix BillingView localMethods drift bug

**Files:**
- Modify: `src/views/BillingView.vue`

- [ ] **Step 1: Remove the local reactive copy**

In `src/views/BillingView.vue`, find:
```typescript
const localMethods = reactive<PaymentMethod[]>([...paymentMethods.value])
```

Remove this line and its import of `reactive` if unused elsewhere in the file.

- [ ] **Step 2: Replace localMethods references with paymentMethods (from composable)**

Replace every `localMethods` with `paymentMethods.value`. This change means mutations must go through the composable, which in Task 40b we'll wire.

- [ ] **Step 3: Replace makeDefault() to call the mutation composable (stub for now)**

Replace:
```typescript
function makeDefault(id: string) {
	localMethods.forEach(m => { m.isDefault = m.id === id })
	defaultConfirmed.value = true
	setTimeout(() => { defaultConfirmed.value = false }, 2000)
}
```

With:
```typescript
import { useSetDefaultPaymentMethod } from '@/composables/mutations/useSetDefaultPaymentMethod'
import { useToast } from '@/composables/useToast'

const setDefault = useSetDefaultPaymentMethod()
const toast = useToast()

async function makeDefault(id: string) {
	try {
		await setDefault.mutate({ id })
		toast.success('Default payment method updated')
	} catch {
		toast.error('Could not update default payment method')
	}
}
```

Remove the `defaultConfirmed` ref and the related Transition block (lines 152-165) since toasts now handle this feedback.

- [ ] **Step 4: Replace confirmDelete() similarly**

Replace:
```typescript
function confirmDelete() {
	deleteConfirmed.value = true
	setTimeout(() => {
		showDeletePayment.value = false
		deleteConfirmed.value = false
	}, 1500)
}
```

With:
```typescript
import { useDeletePaymentMethod } from '@/composables/mutations/useDeletePaymentMethod'

const deletePm = useDeletePaymentMethod()

async function confirmDelete() {
	if (!deletingMethod.value) return
	try {
		await deletePm.mutate({ id: deletingMethod.value.id })
		toast.success('Payment method deleted')
		showDeletePayment.value = false
	} catch {
		toast.error('Could not delete payment method')
	}
}
```

Remove `deleteConfirmed` ref and the confirmed-state template branch.

- [ ] **Step 5: Create mutation composable stubs**

Create `src/composables/mutations/useDeletePaymentMethod.ts`:

```typescript
// TEMPORARY STUB — replaced in Task 63
import { useMutation } from '@/composables/useMutation'

export function useDeletePaymentMethod() {
	return useMutation(async (_input: { id: string }) => {
		await new Promise(r => setTimeout(r, 500))
		return { ok: true }
	})
}
```

Create `src/composables/mutations/useSetDefaultPaymentMethod.ts`:

```typescript
// TEMPORARY STUB — replaced in Task 64
import { useMutation } from '@/composables/useMutation'

export function useSetDefaultPaymentMethod() {
	return useMutation(async (_input: { id: string }) => {
		await new Promise(r => setTimeout(r, 500))
		return { ok: true }
	})
}
```

- [ ] **Step 6: Run dev server, verify billing actions still work via stubs**

Run: `npm run dev`, click Delete → modal → Yes Delete → verify toast. Click Make Default → verify toast. Stop.

- [ ] **Step 7: Commit**

```bash
git add src/views/BillingView.vue src/composables/mutations/
git commit -m "fix(billing): remove localMethods drift, wire mutations via composables"
```

---

### Task 41: Rewire BillingView to use extracted row components

**Files:**
- Modify: `src/views/BillingView.vue`
- Verify: `src/components/SubscriptionRow.vue`, `OrderRow.vue`, `PaymentMethodCard.vue`

- [ ] **Step 1: Read the three extracted components to understand their props**

Run: `cat src/components/SubscriptionRow.vue src/components/OrderRow.vue src/components/PaymentMethodCard.vue`

Identify the prop signatures for each. Note: if any of them do not have the prop shape needed by BillingView, update the component OR pass an adapter.

- [ ] **Step 2: Replace inline subscription table rows**

In BillingView.vue, find the subscriptions `<tbody>` block:
```vue
<tbody>
	<tr v-for="sub in subscriptions" :key="sub.id" class="border-t border-border">
		<td class="px-10 py-4 text-body text-brand-navy">{{ formatDate(sub.date) }}</td>
		...
	</tr>
</tbody>
```

Replace with:
```vue
<tbody>
	<SubscriptionRow
		v-for="sub in subscriptions"
		:key="sub.id"
		:subscription="sub"
		@manage="openManageSub(sub)"
	/>
</tbody>
```

Add `import SubscriptionRow from '@/components/SubscriptionRow.vue'` to script. If SubscriptionRow doesn't yet emit `manage` or expect a `subscription` prop, adapt it.

- [ ] **Step 3: Replace inline payment method blocks with `<PaymentMethodCard>`**

Find the `<div v-for="method in localMethods" ...>` block (now `paymentMethods.value`). Replace with:

```vue
<PaymentMethodCard
	v-for="method in paymentMethods ?? []"
	:key="method.id"
	:method="method"
	@delete="openDeleteModal"
	@make-default="makeDefault"
/>
```

Add import and adapt PaymentMethodCard props/emits as needed.

- [ ] **Step 4: Replace inline order table rows with `<OrderRow>`**

Find the orders `<tbody>`, replace with:
```vue
<tbody>
	<OrderRow v-for="order in orders ?? []" :key="order.id" :order="order" />
</tbody>
```

- [ ] **Step 5: Run dev server, verify Billing page renders correctly**

Run: `npm run dev`, navigate to `/account/billing`, verify subscriptions, payment methods, orders all render. Compare visually against pre-change state to ensure no regression. Stop.

- [ ] **Step 6: Commit**

```bash
git add src/views/BillingView.vue src/components/
git commit -m "refactor(billing): use extracted SubscriptionRow/OrderRow/PaymentMethodCard"
```

---

### Task 42: Improve TabNavigation "More" dropdown a11y

**Files:**
- Modify: `src/layout/TabNavigation.vue`

- [ ] **Step 1: Add ARIA attributes and Escape key close**

In `src/layout/TabNavigation.vue`, update the script section to use `useKeyStroke`:

```typescript
// add to <script setup>
import { useKeyStroke } from '@/composables/useKeyStroke'

useKeyStroke('Escape', () => {
	if (moreOpen.value) moreOpen.value = false
})
```

- [ ] **Step 2: Add aria-expanded, aria-haspopup, role=menu to the dropdown button and menu**

Find the "More" toggle button (`<button @click="toggleMore">`) and add:
```vue
<button
	@click="toggleMore"
	aria-haspopup="menu"
	:aria-expanded="moreOpen"
	aria-label="More navigation options"
	...
>
```

Find the dropdown `<ul>` or `<div>` that shows when `moreOpen`, add:
```vue
<ul role="menu" ...>
	<li role="none" v-for="item in moreItems" :key="item.label">
		<a role="menuitem" ...>
```

(Adapt to actual markup — if items are `<RouterLink>` or `<a>`, add `role="menuitem"` to each.)

- [ ] **Step 3: Run dev server, verify Escape closes menu and screen reader announces properly**

Manual test: open the "More" dropdown, press Escape → closes. Tab through menu items.

- [ ] **Step 4: Commit**

```bash
git add src/layout/TabNavigation.vue
git commit -m "a11y(nav): escape close + aria menu roles on More dropdown"
```

---

## Phase 7: Icon Component Extraction

### Task 43: Create icon components for common SVGs

**Files:**
- Create: `src/components/icons/IconDownload.vue`
- Create: `src/components/icons/IconCopy.vue`
- Create: `src/components/icons/IconCheck.vue`
- Create: `src/components/icons/IconChevronDown.vue`
- Create: `src/components/icons/IconClose.vue`
- Create: `src/components/icons/IconArrowRight.vue`
- Create: `src/components/icons/IconArrowLeft.vue`
- Create: `src/components/icons/IconWarning.vue`

- [ ] **Step 1: Create IconDownload.vue**

```vue
<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
	<svg :width="size ?? 16" :height="size ?? 16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
	</svg>
</template>
```

- [ ] **Step 2: Create IconCopy.vue**

```vue
<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
	<svg :width="size ?? 16" :height="size ?? 16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
	</svg>
</template>
```

- [ ] **Step 3: Create IconCheck.vue**

```vue
<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
	<svg :width="size ?? 16" :height="size ?? 16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
	</svg>
</template>
```

- [ ] **Step 4: Create IconChevronDown.vue**

```vue
<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
	<svg :width="size ?? 16" :height="size ?? 16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
	</svg>
</template>
```

- [ ] **Step 5: Create IconClose.vue**

```vue
<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
	<svg :width="size ?? 20" :height="size ?? 20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
	</svg>
</template>
```

- [ ] **Step 6: Create IconArrowRight.vue**

```vue
<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
	<svg :width="size ?? 16" :height="size ?? 16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
	</svg>
</template>
```

- [ ] **Step 7: Create IconArrowLeft.vue**

```vue
<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
	<svg :width="size ?? 16" :height="size ?? 16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
	</svg>
</template>
```

- [ ] **Step 8: Create IconWarning.vue**

```vue
<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
	<svg :width="size ?? 24" :height="size ?? 24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
	</svg>
</template>
```

- [ ] **Step 9: Commit**

```bash
git add src/components/icons/
git commit -m "feat(icons): extract 8 reusable SVG icon components"
```

---

### Task 44: Replace inline SVGs in DownloadsAioseoView, DownloadsBLCView, DownloadsAiCreditsView

**Files:**
- Modify: `src/views/DownloadsAioseoView.vue`
- Modify: `src/views/DownloadsBLCView.vue`
- Modify: `src/views/DownloadsAiCreditsView.vue`

- [ ] **Step 1: In each file, replace matching inline SVGs with the icon components**

Pattern: find `<svg ... viewBox="0 0 24 24" ... stroke-width="2" ...>` with path matching one of the extracted icons. Replace with the icon component:
- Download arrow path → `<IconDownload />`
- Chevron → `<IconChevronDown />`
- ArrowRight → `<IconArrowRight />`
- Lightning/zap path (DownloadsAioseoView) → leave inline (not extracted)

Add the imports at the top of each file's `<script setup>` block.

- [ ] **Step 2: Verify pages still render correctly**

Run: `npm run dev`, navigate to each downloads sub-view. Verify icons render.

- [ ] **Step 3: Commit**

```bash
git add src/views/Downloads*.vue
git commit -m "refactor(views): use icon components in downloads sub-views"
```

---

### Task 45: Replace inline SVGs in BillingView

**Files:**
- Modify: `src/views/BillingView.vue`

- [ ] **Step 1: Replace matching inline SVGs**

In BillingView.vue, replace:
- Back-arrow SVGs (in change-plan and update-payment modal views) → `<IconArrowLeft />`
- X-close in modal (if still in BillingView after modal extract) → `<IconClose />`

Leave cards/money icons inline (they are unique to BillingView, not reused).

- [ ] **Step 2: Run dev server, verify Billing page modals still look correct**

- [ ] **Step 3: Commit**

```bash
git add src/views/BillingView.vue
git commit -m "refactor(billing): use icon components"
```

---

### Task 46: Replace inline SVGs in OverviewView

**Files:**
- Modify: `src/views/OverviewView.vue`

- [ ] **Step 1: Replace matching inline SVGs**

Replace:
- Pencil edit icon (small, line 65-67) → leave inline (unique)
- Arrow right (line 111, 151) → `<IconArrowRight />`

Leave AI sparkle icon inline (unique, 8 paths).

- [ ] **Step 2: Commit**

```bash
git add src/views/OverviewView.vue
git commit -m "refactor(overview): use icon components where applicable"
```

---

## Phase 8: MSW Handlers + Fixtures

### Task 47: Create fixture builders (profile-keyed responses)

**Files:**
- Create: `src/mocks/fixtures.ts`

- [ ] **Step 1: Create src/mocks/fixtures.ts**

```typescript
// src/mocks/fixtures.ts
// Builds MSW response payloads per profile (basic/pro/elite).
// This is the seam between our existing src/data/profiles/*.ts fixtures and MSW handlers.

import * as basic from '@/data/profiles/basic'
import * as pro from '@/data/profiles/pro'
import * as elite from '@/data/profiles/elite'
import { allAnnouncements } from '@/data/announcements'
import { helpArticles } from '@/data/articles'

const profiles = { basic, pro, elite } as const
type ProfileKey = keyof typeof profiles

export function getActiveProfileKey(): ProfileKey {
	const stored = localStorage.getItem('aioseo-mock-profile') as ProfileKey | null
	if (stored && stored in profiles) return stored
	return 'elite'
}

export function setActiveProfileKey(key: ProfileKey): void {
	localStorage.setItem('aioseo-mock-profile', key)
}

export function getProfile(key?: ProfileKey) {
	return profiles[key ?? getActiveProfileKey()]
}

export const fixtures = {
	user: () => getProfile().user,
	licenses: () => getProfile().licenses,
	aiCredits: () => getProfile().aiCredits ?? null,
	subscriptions: () => getProfile().subscriptions ?? [],
	paymentMethods: () => getProfile().paymentMethods ?? [],
	orders: () => getProfile().orders ?? [],
	offers: () => ({
		upgradeOffer: getProfile().upgradeOffer ?? null,
		promoOffers: getProfile().promoOffers ?? [],
	}),
	announcements: () => allAnnouncements,
	helpArticles: (query: string) => {
		const q = query.toLowerCase().trim()
		if (!q) return helpArticles
		return helpArticles.filter(a =>
			a.title.toLowerCase().includes(q) || a.snippet.toLowerCase().includes(q),
		)
	},
}
```

- [ ] **Step 2: Verify profile data files export the expected fields**

Run: `grep -l "export const" src/data/profiles/*.ts`
Run: `grep -n "export const" src/data/profiles/elite.ts`
Expected: user, licenses, aiCredits, subscriptions, paymentMethods, orders, upgradeOffer?, promoOffers? are all exported. If any are missing from basic.ts or pro.ts, add them to match elite.ts signature (empty arrays or nulls are fine).

- [ ] **Step 3: Commit**

```bash
git add src/mocks/fixtures.ts
git commit -m "feat(mocks): add profile-keyed fixture builders"
```

---

### Task 48: Implement GET handlers (read endpoints)

**Files:**
- Modify: `src/mocks/handlers.ts`

- [ ] **Step 1: Replace handlers.ts with all read endpoints**

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse, delay } from 'msw'
import { fixtures } from './fixtures'

const BASE = '/wp-json/aioseo/v1'
const FAKE_LATENCY = 300 // ms

export const handlers = [
	// Account
	http.get(`${BASE}/me`, async () => {
		await delay(FAKE_LATENCY)
		return HttpResponse.json(fixtures.user())
	}),

	// Licenses
	http.get(`${BASE}/licenses`, async () => {
		await delay(FAKE_LATENCY)
		return HttpResponse.json({ licenses: fixtures.licenses() })
	}),

	// AI Credits
	http.get(`${BASE}/credits`, async () => {
		await delay(FAKE_LATENCY)
		const credits = fixtures.aiCredits()
		if (!credits) return HttpResponse.json(null, { status: 200 })
		return HttpResponse.json(credits)
	}),

	// Billing
	http.get(`${BASE}/subscriptions`, async () => {
		await delay(FAKE_LATENCY)
		return HttpResponse.json({ subscriptions: fixtures.subscriptions() })
	}),
	http.get(`${BASE}/payment-methods`, async () => {
		await delay(FAKE_LATENCY)
		return HttpResponse.json({ paymentMethods: fixtures.paymentMethods() })
	}),
	http.get(`${BASE}/orders`, async () => {
		await delay(FAKE_LATENCY)
		return HttpResponse.json({ orders: fixtures.orders() })
	}),

	// Offers
	http.get(`${BASE}/offers`, async () => {
		await delay(FAKE_LATENCY)
		return HttpResponse.json(fixtures.offers())
	}),

	// Announcements
	http.get(`${BASE}/announcements`, async () => {
		await delay(FAKE_LATENCY)
		return HttpResponse.json({ announcements: fixtures.announcements() })
	}),

	// Help
	http.get(`${BASE}/help/search`, async ({ request }) => {
		const url = new URL(request.url)
		const q = url.searchParams.get('q') ?? ''
		await delay(150)
		return HttpResponse.json({ articles: fixtures.helpArticles(q) })
	}),
]
```

- [ ] **Step 2: Verify handler paths match client baseURL**

The HTTP client uses `baseURL: '/wp-json/aioseo/v1/'` (from installDevBootData) and joins with path like `'licenses'` → request goes to `/wp-json/aioseo/v1/licenses`. Handler path is `${BASE}/licenses`. These match.

- [ ] **Step 3: Run dev server, open devtools Network tab, navigate to /account/**

Run: `npm run dev`
Open DevTools → Network → Fetch/XHR filter
Navigate to each route, verify MSW intercepts all requests (Service Worker column will show "(from service worker)").

- [ ] **Step 4: Commit**

```bash
git add src/mocks/handlers.ts
git commit -m "feat(mocks): add read handlers for 9 endpoints"
```

---

### Task 49: Implement mutation handlers

**Files:**
- Modify: `src/mocks/handlers.ts`

- [ ] **Step 1: Append mutation handlers to handlers.ts**

```typescript
// Append to the handlers array in src/mocks/handlers.ts

	// Profile
	http.patch(`${BASE}/me`, async ({ request }) => {
		await delay(FAKE_LATENCY)
		const body = await request.json() as Record<string, unknown>
		return HttpResponse.json({ ...fixtures.user(), ...body })
	}),

	// Payment methods
	http.post(`${BASE}/payment-methods`, async ({ request }) => {
		await delay(FAKE_LATENCY)
		const body = await request.json() as { last4?: string; brand?: string }
		return HttpResponse.json({
			id: 'pm-new-' + Date.now(),
			brand: body.brand ?? 'visa',
			last4: body.last4 ?? '4242',
			expiresAt: '12/29',
			isDefault: false,
		})
	}),
	http.delete(`${BASE}/payment-methods/:id`, async () => {
		await delay(FAKE_LATENCY)
		return new HttpResponse(null, { status: 204 })
	}),
	http.patch(`${BASE}/payment-methods/:id`, async ({ request, params }) => {
		await delay(FAKE_LATENCY)
		const body = await request.json() as Record<string, unknown>
		return HttpResponse.json({ id: params.id, ...body })
	}),

	// Subscriptions
	http.post(`${BASE}/subscriptions/:id/cancel`, async () => {
		await delay(FAKE_LATENCY)
		return HttpResponse.json({ ok: true, cancelledAt: new Date().toISOString() })
	}),
	http.post(`${BASE}/subscriptions/:id/change-plan`, async ({ request }) => {
		await delay(FAKE_LATENCY)
		const body = await request.json() as { tier?: string }
		return HttpResponse.json({ ok: true, newTier: body.tier })
	}),
	http.post(`${BASE}/subscriptions/:id/apply-save-offer`, async ({ request }) => {
		await delay(FAKE_LATENCY)
		const body = await request.json() as { offerVariant?: string }
		return HttpResponse.json({ ok: true, variant: body.offerVariant })
	}),
```

- [ ] **Step 2: Run dev server and test mutations via Billing page**

Click through Delete → confirm → verify toast appears. Click Make Default → verify toast. Stop.

- [ ] **Step 3: Commit**

```bash
git add src/mocks/handlers.ts
git commit -m "feat(mocks): add mutation handlers for profile, payments, subs"
```

---

### Task 50: Rewire ProfileSwitcher to update fixtures + invalidate queries

**Files:**
- Modify: `src/components/ProfileSwitcher.vue`

- [ ] **Step 1: Read current ProfileSwitcher.vue**

Run: `cat src/components/ProfileSwitcher.vue`

- [ ] **Step 2: Replace contents**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { getActiveProfileKey, setActiveProfileKey } from '@/mocks/fixtures'
import { invalidateQuery } from '@/composables/queryCache'

type ProfileKey = 'basic' | 'pro' | 'elite'
const PROFILES: ProfileKey[] = ['basic', 'pro', 'elite']

const active = computed(() => getActiveProfileKey())

function setProfile(key: ProfileKey) {
	setActiveProfileKey(key)
	// Invalidate all queries so components refetch against the new profile
	invalidateQuery('licenses')
	invalidateQuery('account')
	invalidateQuery('ai-credits')
	invalidateQuery('billing')
	invalidateQuery('offers')
	invalidateQuery('announcements')
	// Force a re-render of computed(active) by dispatching a storage event
	window.dispatchEvent(new Event('storage'))
}
</script>

<template>
	<div class="fixed bottom-4 right-4 z-[150] bg-white border border-border rounded-card shadow-xl p-3 text-xs">
		<p class="text-[10px] uppercase tracking-wide text-text-muted mb-2">MOCK PROFILE</p>
		<div class="flex gap-1">
			<button
				v-for="p in PROFILES"
				:key="p"
				@click="setProfile(p)"
				:aria-pressed="active === p"
				:class="[
					'px-3 py-1.5 rounded-btn font-medium capitalize transition-all',
					active === p ? 'bg-brand-blue text-white' : 'bg-white text-brand-navy border border-border hover:border-brand-blue',
				]"
			>
				{{ p }}
			</button>
		</div>
	</div>
</template>
```

- [ ] **Step 3: Run dev server, switch profiles, verify data changes**

Run: `npm run dev`, navigate to `/account/overview`, click Basic → verify data reloads with basic profile. Click Elite → verify elite data returns. Stop.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProfileSwitcher.vue
git commit -m "refactor(dev): rewire ProfileSwitcher through MSW + invalidation"
```

---

### Task 51: Delete old stores/profile.ts and useMockProfile.ts references

**Files:**
- Delete: `src/stores/profile.ts`
- Delete: `src/composables/useMockProfile.ts`
- Modify: composables that import useMockProfile (they'll be rewritten in Phase 9)

- [ ] **Step 1: Find all imports of useMockProfile and useProfileStore**

Run: `grep -rn "useMockProfile\|useProfileStore" src/ --include="*.ts" --include="*.vue"`
Expected matches:
- src/composables/useAccount.ts
- src/composables/useLicenses.ts
- src/composables/useAiCredits.ts
- src/composables/useSubscriptions.ts
- src/composables/useOffers.ts
- (and the profile store itself / useMockProfile itself)

- [ ] **Step 2: Don't delete yet — wait until Phase 9 rewrites these composables**

Skip this task for now. It will be completed as Task 60 (last composable conversion), which deletes `useMockProfile.ts` and `stores/profile.ts`. Move on.

---

### Task 52: Wire MSW handlers into vitest setup

**Files:**
- Verify: `tests/setup.ts` (already done in Task 30)

- [ ] **Step 1: Verify MSW server imports handlers correctly**

Run: `npm run test`
Expected: All tests pass. `server.ts` imports from `./handlers` which now has 16 handlers.

- [ ] **Step 2: No commit needed (already committed in Task 30)**

---

## Phase 9: Async Composable Conversion

### Task 53: Convert useAccount to async

**Files:**
- Modify: `src/composables/useAccount.ts`

- [ ] **Step 1: Replace useAccount contents**

```typescript
// src/composables/useAccount.ts
import { useAsyncResource } from './useAsyncResource'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'
import type { User } from '@/types'

export interface QuickLink {
	label: string
	href: string
}

const quickLinks: QuickLink[] = [
	{ label: 'View Downloads', href: '/downloads' },
	{ label: 'Edit Account Info', href: '/profile' },
	{ label: 'Get Support', href: '/support' },
	{ label: 'Edit Billing Info', href: '/billing' },
	{ label: 'Become an Affiliate', href: 'https://aioseo.com/affiliates/' },
]

export function useAccount() {
	const resource = useAsyncResource(queryKeys.account, () => api.get<User>('me'))

	return {
		user: resource.data,
		isLoading: resource.isLoading,
		error: resource.error,
		refetch: resource.refetch,
		quickLinks,
	}
}
```

- [ ] **Step 2: Ensure QuickLink type is exported**

Check `src/types/index.ts` re-exports QuickLink. If the type lives elsewhere, update this file's import accordingly.

- [ ] **Step 3: Commit**

```bash
git add src/composables/useAccount.ts
git commit -m "refactor(composables): convert useAccount to useAsyncResource"
```

---

### Task 54: Convert useLicenses to async

**Files:**
- Modify: `src/composables/useLicenses.ts`

- [ ] **Step 1: Replace useLicenses contents**

```typescript
// src/composables/useLicenses.ts
import { computed } from 'vue'
import { useAsyncResource } from './useAsyncResource'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'
import type { ProductType, License } from '@/types'

interface LicensesResponse {
	licenses: License[]
}

export function useLicenses() {
	const resource = useAsyncResource(queryKeys.licenses, () =>
		api.get<LicensesResponse>('licenses').then(r => r.licenses),
	)

	const licenses = computed(() => resource.data.value ?? [])

	const licensesByProduct = computed(() => {
		const grouped: Partial<Record<ProductType, License[]>> = {}
		for (const license of licenses.value) {
			const list = grouped[license.product]
			if (list) list.push(license)
			else grouped[license.product] = [license]
		}
		return grouped
	})

	function hasProduct(product: ProductType) {
		return computed(() => licenses.value.some(l => l.product === product))
	}

	return {
		licenses,
		licensesByProduct,
		hasProduct,
		isLoading: resource.isLoading,
		error: resource.error,
		refetch: resource.refetch,
		isEmpty: resource.isEmpty,
	}
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useLicenses.ts
git commit -m "refactor(composables): convert useLicenses to useAsyncResource"
```

---

### Task 55: Convert useAiCredits to async

**Files:**
- Modify: `src/composables/useAiCredits.ts`

- [ ] **Step 1: Read current file to preserve its public API**

Run: `cat src/composables/useAiCredits.ts`

- [ ] **Step 2: Replace contents**

```typescript
// src/composables/useAiCredits.ts
import { computed } from 'vue'
import { useAsyncResource } from './useAsyncResource'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'
import type { AiCredits } from '@/types'

const EMPTY: AiCredits = {
	used: 0,
	total: 0,
	includedInSubscription: 0,
	paidCredits: 0,
	expiresAt: '',
}

export function useAiCredits() {
	const resource = useAsyncResource(queryKeys.aiCredits, () => api.get<AiCredits | null>('credits'))

	const credits = computed(() => resource.data.value ?? EMPTY)
	const remaining = computed(() => Math.max(0, credits.value.total - credits.value.used))
	const percentUsed = computed(() => {
		if (credits.value.total === 0) return 0
		return Math.round((credits.value.used / credits.value.total) * 100)
	})

	return {
		credits,
		remaining,
		percentUsed,
		isLoading: resource.isLoading,
		error: resource.error,
		refetch: resource.refetch,
	}
}
```

- [ ] **Step 3: Commit**

```bash
git add src/composables/useAiCredits.ts
git commit -m "refactor(composables): convert useAiCredits to useAsyncResource"
```

---

### Task 56: Split useSubscriptions into 3 composables

**Files:**
- Modify: `src/composables/useSubscriptions.ts`
- Create: `src/composables/usePaymentMethods.ts`
- Create: `src/composables/useOrders.ts`

- [ ] **Step 1: Rewrite useSubscriptions.ts**

```typescript
// src/composables/useSubscriptions.ts
import { computed } from 'vue'
import { useAsyncResource } from './useAsyncResource'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'
import type { Subscription } from '@/types'

interface SubscriptionsResponse {
	subscriptions: Subscription[]
}

export function useSubscriptions() {
	const resource = useAsyncResource(queryKeys.subscriptions, () =>
		api.get<SubscriptionsResponse>('subscriptions').then(r => r.subscriptions),
	)
	const subscriptions = computed(() => resource.data.value ?? [])
	return {
		subscriptions,
		isLoading: resource.isLoading,
		error: resource.error,
		isEmpty: resource.isEmpty,
		refetch: resource.refetch,
	}
}
```

- [ ] **Step 2: Create usePaymentMethods.ts**

```typescript
// src/composables/usePaymentMethods.ts
import { computed } from 'vue'
import { useAsyncResource } from './useAsyncResource'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'
import type { PaymentMethod } from '@/types'

interface PaymentMethodsResponse {
	paymentMethods: PaymentMethod[]
}

export function usePaymentMethods() {
	const resource = useAsyncResource(queryKeys.paymentMethods, () =>
		api.get<PaymentMethodsResponse>('payment-methods').then(r => r.paymentMethods),
	)
	const paymentMethods = computed(() => resource.data.value ?? [])
	return {
		paymentMethods,
		isLoading: resource.isLoading,
		error: resource.error,
		isEmpty: resource.isEmpty,
		refetch: resource.refetch,
	}
}
```

- [ ] **Step 3: Create useOrders.ts**

```typescript
// src/composables/useOrders.ts
import { computed } from 'vue'
import { useAsyncResource } from './useAsyncResource'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'
import type { Order } from '@/types'

interface OrdersResponse {
	orders: Order[]
}

export function useOrders() {
	const resource = useAsyncResource(queryKeys.orders, () =>
		api.get<OrdersResponse>('orders').then(r => r.orders),
	)
	const orders = computed(() => resource.data.value ?? [])
	return {
		orders,
		isLoading: resource.isLoading,
		error: resource.error,
		isEmpty: resource.isEmpty,
		refetch: resource.refetch,
	}
}
```

- [ ] **Step 4: Update BillingView imports**

In `src/views/BillingView.vue`, replace:
```typescript
const { subscriptions, paymentMethods, orders } = useSubscriptions()
```

With:
```typescript
import { useSubscriptions } from '@/composables/useSubscriptions'
import { usePaymentMethods } from '@/composables/usePaymentMethods'
import { useOrders } from '@/composables/useOrders'

const { subscriptions } = useSubscriptions()
const { paymentMethods } = usePaymentMethods()
const { orders } = useOrders()
```

- [ ] **Step 5: Run dev server to verify BillingView still renders**

Run: `npm run dev`, navigate to `/account/billing`. Verify subs, payments, orders all appear.

- [ ] **Step 6: Commit**

```bash
git add src/composables/useSubscriptions.ts src/composables/usePaymentMethods.ts src/composables/useOrders.ts src/views/BillingView.vue
git commit -m "refactor(composables): split useSubscriptions into subs+payments+orders"
```

---

### Task 57: Convert useOffers to async

**Files:**
- Modify: `src/composables/useOffers.ts`

- [ ] **Step 1: Read current file**

Run: `cat src/composables/useOffers.ts`

- [ ] **Step 2: Replace contents**

```typescript
// src/composables/useOffers.ts
import { computed } from 'vue'
import { useAsyncResource } from './useAsyncResource'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'
import type { UpgradeOffer, PromoOffer } from '@/types'

interface OffersResponse {
	upgradeOffer: UpgradeOffer | null
	promoOffers: PromoOffer[]
}

export function useOffers() {
	const resource = useAsyncResource(queryKeys.offers, () => api.get<OffersResponse>('offers'))

	const upgradeOffer = computed(() => resource.data.value?.upgradeOffer ?? null)
	const promoOffers = computed(() => resource.data.value?.promoOffers ?? [])
	const showUpgrade = computed(() => upgradeOffer.value !== null)
	const showPromos = computed(() => promoOffers.value.length > 0)

	return {
		upgradeOffer,
		promoOffers,
		showUpgrade,
		showPromos,
		isLoading: resource.isLoading,
		error: resource.error,
		refetch: resource.refetch,
	}
}
```

- [ ] **Step 3: Check that UpgradeOffer and PromoOffer types exist**

Run: `grep -rn "UpgradeOffer\|PromoOffer" src/types/`
If missing, add to `src/types/offer.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/composables/useOffers.ts
git commit -m "refactor(composables): convert useOffers to useAsyncResource"
```

---

### Task 58: Convert useAnnouncements to async

**Files:**
- Modify: `src/composables/useAnnouncements.ts`

- [ ] **Step 1: Replace contents**

```typescript
// src/composables/useAnnouncements.ts
import { computed } from 'vue'
import { useAsyncResource } from './useAsyncResource'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'
import type { Announcement } from '@/types'

interface AnnouncementsResponse {
	announcements: Announcement[]
}

export function useAnnouncements() {
	const resource = useAsyncResource(queryKeys.announcements, () =>
		api.get<AnnouncementsResponse>('announcements').then(r => r.announcements),
	)
	const announcements = computed(() => resource.data.value ?? [])
	return {
		announcements,
		isLoading: resource.isLoading,
		error: resource.error,
		isEmpty: resource.isEmpty,
		refetch: resource.refetch,
	}
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useAnnouncements.ts
git commit -m "refactor(composables): convert useAnnouncements to useAsyncResource"
```

---

### Task 59: Convert useHelpArticles to async + debounced search

**Files:**
- Modify: `src/composables/useHelpArticles.ts`

- [ ] **Step 1: Replace contents**

```typescript
// src/composables/useHelpArticles.ts
import { computed, ref, watch } from 'vue'
import { api } from '@/api/client'
import type { HelpArticle } from '@/types'
import { useDebounceFn } from './useDebounceFn'

interface HelpSearchResponse {
	articles: HelpArticle[]
}

export function useHelpArticles() {
	const query = ref('')
	const results = ref<HelpArticle[]>([])
	const isLoading = ref(false)
	const error = ref<Error | null>(null)

	const search = useDebounceFn(async (q: string) => {
		isLoading.value = true
		error.value = null
		try {
			const response = await api.get<HelpSearchResponse>(
				`help/search?q=${encodeURIComponent(q)}`,
			)
			results.value = response.articles
		} catch (e) {
			error.value = e as Error
		} finally {
			isLoading.value = false
		}
	}, 250)

	watch(query, q => search(q), { immediate: true })

	const isEmpty = computed(() => results.value.length === 0 && !isLoading.value && query.value !== '')

	return { query, results, isLoading, error, isEmpty }
}
```

- [ ] **Step 2: Update HelpSearchSection.vue to bind query via v-model**

Run: `cat src/components/HelpSearchSection.vue` to see current structure, then bind its input to the composable's `query` ref.

- [ ] **Step 3: Commit**

```bash
git add src/composables/useHelpArticles.ts src/components/HelpSearchSection.vue
git commit -m "refactor(composables): convert useHelpArticles to async debounced search"
```

---

### Task 60: Delete useMockProfile.ts and stores/profile.ts

**Files:**
- Delete: `src/composables/useMockProfile.ts`
- Delete: `src/stores/profile.ts`

- [ ] **Step 1: Verify no more references**

Run: `grep -rn "useMockProfile\|useProfileStore" src/ --include="*.ts" --include="*.vue"`
Expected: no matches (all composables now use useAsyncResource, ProfileSwitcher uses fixtures directly)

- [ ] **Step 2: Delete the files**

Run:
```bash
rm src/composables/useMockProfile.ts
rm src/stores/profile.ts
```

- [ ] **Step 3: Run dev server + build to confirm no breakage**

Run: `npm run dev` → verify app loads, profile switcher works. Stop. Then `npm run build` → verify clean build.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete obsolete useMockProfile composable + profile store"
```

---

## Phase 10: Mutation Composables

### Task 61: useSaveProfile mutation

**Files:**
- Modify: `src/composables/mutations/useSaveProfile.ts` (replace stub)

- [ ] **Step 1: Replace stub with real mutation**

```typescript
// src/composables/mutations/useSaveProfile.ts
import { useMutation } from '@/composables/useMutation'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'
import type { User, BillingAddress } from '@/types'

export interface SaveProfileInput {
	firstName: string
	lastName: string
	email: string
	billingAddress: BillingAddress
	currentPassword?: string
	newPassword?: string
}

export function useSaveProfile() {
	return useMutation<SaveProfileInput, User>(
		input => api.patch<User>('me', input),
		{ invalidates: [queryKeys.account] },
	)
}
```

- [ ] **Step 2: Run dev, submit Profile form, verify Save succeeds via MSW**

Run: `npm run dev`, navigate to `/account/profile`, change name, click Save. Verify toast "Profile saved". Stop.

- [ ] **Step 3: Commit**

```bash
git add src/composables/mutations/useSaveProfile.ts
git commit -m "feat(mutations): useSaveProfile via PATCH /me"
```

---

### Task 62: useAddPaymentMethod mutation

**Files:**
- Create: `src/composables/mutations/useAddPaymentMethod.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/composables/mutations/useAddPaymentMethod.ts
import { useMutation } from '@/composables/useMutation'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'
import type { PaymentMethod } from '@/types'

export interface AddPaymentMethodInput {
	// In real Stripe flow, this would be a paymentMethodId from Stripe Elements.
	// MSW accepts optional brand/last4 for dev.
	stripePaymentMethodId?: string
	brand?: string
	last4?: string
}

export function useAddPaymentMethod() {
	return useMutation<AddPaymentMethodInput, PaymentMethod>(
		input => api.post<PaymentMethod>('payment-methods', input),
		{ invalidates: [queryKeys.paymentMethods] },
	)
}
```

- [ ] **Step 2: Wire into BillingView Add Payment modal**

In `src/views/BillingView.vue`, find the Add Payment modal footer button:
```vue
<button @click="showAddPayment = false" ...>Add Payment Method</button>
```

Replace with:
```vue
<button @click="onAddPayment" :disabled="addPayment.isPending.value" ...>
	{{ addPayment.isPending.value ? 'Adding...' : 'Add Payment Method' }}
</button>
```

Add to script:
```typescript
import { useAddPaymentMethod } from '@/composables/mutations/useAddPaymentMethod'

const addPayment = useAddPaymentMethod()

async function onAddPayment() {
	try {
		await addPayment.mutate({ brand: 'visa', last4: '4242' }) // TODO: real Stripe Elements integration
		toast.success('Payment method added')
		showAddPayment.value = false
	} catch {
		toast.error('Could not add payment method')
	}
}
```

- [ ] **Step 3: Commit**

```bash
git add src/composables/mutations/useAddPaymentMethod.ts src/views/BillingView.vue
git commit -m "feat(mutations): useAddPaymentMethod + wire into add-payment modal"
```

---

### Task 63: useDeletePaymentMethod (replace stub)

**Files:**
- Modify: `src/composables/mutations/useDeletePaymentMethod.ts`

- [ ] **Step 1: Replace stub**

```typescript
// src/composables/mutations/useDeletePaymentMethod.ts
import { useMutation } from '@/composables/useMutation'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'

export interface DeletePaymentMethodInput { id: string }

export function useDeletePaymentMethod() {
	return useMutation<DeletePaymentMethodInput, { ok: true }>(
		input => api.delete(`payment-methods/${input.id}`),
		{ invalidates: [queryKeys.paymentMethods] },
	)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/mutations/useDeletePaymentMethod.ts
git commit -m "feat(mutations): useDeletePaymentMethod (replace stub)"
```

---

### Task 64: useSetDefaultPaymentMethod (replace stub)

**Files:**
- Modify: `src/composables/mutations/useSetDefaultPaymentMethod.ts`

- [ ] **Step 1: Replace stub**

```typescript
// src/composables/mutations/useSetDefaultPaymentMethod.ts
import { useMutation } from '@/composables/useMutation'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'
import type { PaymentMethod } from '@/types'

export interface SetDefaultPaymentMethodInput { id: string }

export function useSetDefaultPaymentMethod() {
	return useMutation<SetDefaultPaymentMethodInput, PaymentMethod>(
		input => api.patch<PaymentMethod>(`payment-methods/${input.id}`, { isDefault: true }),
		{ invalidates: [queryKeys.paymentMethods] },
	)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/mutations/useSetDefaultPaymentMethod.ts
git commit -m "feat(mutations): useSetDefaultPaymentMethod (replace stub)"
```

---

### Task 65: useCancelSubscription mutation

**Files:**
- Create: `src/composables/mutations/useCancelSubscription.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/composables/mutations/useCancelSubscription.ts
import { useMutation } from '@/composables/useMutation'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'

export interface CancelSubscriptionInput {
	subscriptionId: string
	reasonId: number
	followUp: string
}

export interface CancelSubscriptionResult {
	ok: boolean
	cancelledAt: string
}

export function useCancelSubscription() {
	return useMutation<CancelSubscriptionInput, CancelSubscriptionResult>(
		input => api.post<CancelSubscriptionResult>(`subscriptions/${input.subscriptionId}/cancel`, {
			reasonId: input.reasonId,
			followUp: input.followUp,
		}),
		{ invalidates: [queryKeys.subscriptions, queryKeys.billing] },
	)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/mutations/useCancelSubscription.ts
git commit -m "feat(mutations): useCancelSubscription"
```

---

### Task 66: useChangePlan mutation

**Files:**
- Create: `src/composables/mutations/useChangePlan.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/composables/mutations/useChangePlan.ts
import { useMutation } from '@/composables/useMutation'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'
import type { LicenseTier } from '@/types'

export interface ChangePlanInput {
	subscriptionId: string
	tier: LicenseTier
}

export function useChangePlan() {
	return useMutation<ChangePlanInput, { ok: boolean; newTier: LicenseTier }>(
		input => api.post(`subscriptions/${input.subscriptionId}/change-plan`, { tier: input.tier }),
		{ invalidates: [queryKeys.subscriptions, queryKeys.billing, queryKeys.licenses] },
	)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/mutations/useChangePlan.ts
git commit -m "feat(mutations): useChangePlan"
```

---

### Task 67: useApplySaveOffer mutation

**Files:**
- Create: `src/composables/mutations/useApplySaveOffer.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/composables/mutations/useApplySaveOffer.ts
import { useMutation } from '@/composables/useMutation'
import { api } from '@/api/client'
import { queryKeys } from '@/api/keys'

export interface ApplySaveOfferInput {
	subscriptionId: string
	offerVariant: string
}

export function useApplySaveOffer() {
	return useMutation<ApplySaveOfferInput, { ok: boolean; variant: string }>(
		input => api.post(`subscriptions/${input.subscriptionId}/apply-save-offer`, {
			offerVariant: input.offerVariant,
		}),
		{ invalidates: [queryKeys.subscriptions, queryKeys.billing] },
	)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/mutations/useApplySaveOffer.ts
git commit -m "feat(mutations): useApplySaveOffer"
```

---

## Phase 11: QueryBoundary + Skeletons + Empty States

### Task 68: Create QueryBoundary component

**Files:**
- Create: `src/components/QueryBoundary.vue`

- [ ] **Step 1: Create the file**

```vue
<script setup lang="ts" generic="T">
import type { Ref } from 'vue'

defineProps<{
	isLoading: Ref<boolean> | boolean
	error: Ref<Error | null> | Error | null
	data?: Ref<T | null> | T | null
	refetch?: () => void
}>()
</script>

<template>
	<template v-if="(typeof error === 'object' && error !== null && 'value' in error ? error.value : error)">
		<div class="aio-card bg-brand-red/5 border border-brand-red/20">
			<div class="flex items-start gap-3">
				<svg class="w-5 h-5 text-brand-red shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
				</svg>
				<div class="flex-1">
					<p class="text-body font-semibold text-brand-navy">Couldn't load this content</p>
					<p class="text-sm text-brand-navy-60 mt-1">Something went wrong. You can try again.</p>
					<button
						v-if="refetch"
						@click="refetch"
						class="mt-3 px-4 py-2 text-sm font-semibold text-white bg-brand-red rounded-btn hover:opacity-90 transition-all cursor-pointer"
					>
						Retry
					</button>
				</div>
			</div>
		</div>
	</template>
	<template v-else-if="(typeof isLoading === 'object' && isLoading !== null && 'value' in isLoading ? isLoading.value : isLoading)">
		<slot name="loading">
			<div class="animate-pulse space-y-3">
				<div class="h-4 bg-border rounded w-3/4"></div>
				<div class="h-4 bg-border rounded w-1/2"></div>
				<div class="h-4 bg-border rounded w-5/6"></div>
			</div>
		</slot>
	</template>
	<template v-else>
		<slot />
	</template>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/QueryBoundary.vue
git commit -m "feat(components): add QueryBoundary wrapper (loading/error/content)"
```

---

### Task 69: Create skeleton components

**Files:**
- Create: `src/components/CardSkeleton.vue`
- Create: `src/components/TableSkeleton.vue`

- [ ] **Step 1: Create CardSkeleton.vue**

```vue
<script setup lang="ts">
defineProps<{ rows?: number }>()
</script>

<template>
	<div class="aio-card animate-pulse">
		<div class="space-y-3">
			<div class="h-5 bg-border rounded w-1/3"></div>
			<div class="h-4 bg-border rounded w-2/3"></div>
			<div v-for="i in (rows ?? 3)" :key="i" class="h-4 bg-border rounded" :class="i === (rows ?? 3) ? 'w-1/2' : 'w-full'"></div>
		</div>
	</div>
</template>
```

- [ ] **Step 2: Create TableSkeleton.vue**

```vue
<script setup lang="ts">
defineProps<{ rows?: number; cols?: number }>()
</script>

<template>
	<div class="animate-pulse">
		<div class="border-t border-border">
			<div v-for="i in (rows ?? 3)" :key="i" class="border-b border-border px-10 py-4 flex gap-8">
				<div v-for="j in (cols ?? 3)" :key="j" class="h-4 bg-border rounded flex-1"></div>
			</div>
		</div>
	</div>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CardSkeleton.vue src/components/TableSkeleton.vue
git commit -m "feat(components): add CardSkeleton + TableSkeleton"
```

---

### Task 70: Create EmptyState + ErrorBanner components

**Files:**
- Create: `src/components/EmptyState.vue`
- Create: `src/components/ErrorBanner.vue`

- [ ] **Step 1: Create EmptyState.vue**

```vue
<script setup lang="ts">
defineProps<{
	title: string
	description?: string
}>()
</script>

<template>
	<div class="text-center py-10 px-6">
		<div class="w-12 h-12 rounded-full bg-bg-light flex items-center justify-center mx-auto mb-3">
			<slot name="icon">
				<svg class="w-6 h-6 text-brand-navy-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4" />
				</svg>
			</slot>
		</div>
		<p class="text-body font-semibold text-brand-navy">{{ title }}</p>
		<p v-if="description" class="text-sm text-brand-navy-60 mt-1">{{ description }}</p>
		<div class="mt-4"><slot name="action" /></div>
	</div>
</template>
```

- [ ] **Step 2: Create ErrorBanner.vue**

```vue
<script setup lang="ts">
defineProps<{
	message?: string
	onRetry?: () => void
}>()
</script>

<template>
	<div class="aio-card bg-brand-red/5 border border-brand-red/20">
		<div class="flex items-start gap-3">
			<svg class="w-5 h-5 text-brand-red shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
			</svg>
			<div class="flex-1">
				<p class="text-body font-semibold text-brand-navy">{{ message ?? "Couldn't load this content" }}</p>
				<button v-if="onRetry" @click="onRetry" class="mt-3 px-4 py-2 text-sm font-semibold text-white bg-brand-red rounded-btn hover:opacity-90 cursor-pointer">Retry</button>
			</div>
		</div>
	</div>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/EmptyState.vue src/components/ErrorBanner.vue
git commit -m "feat(components): add EmptyState + ErrorBanner"
```

---

## Phase 12: Apply Async Patterns to Views

### Task 71: Add loading/error/empty states to OverviewView

**Files:**
- Modify: `src/views/OverviewView.vue`

- [ ] **Step 1: Destructure the new loading/error refs**

In OverviewView.vue `<script setup>`, replace the composable destructures:

```typescript
const { user, quickLinks, isLoading: userLoading, error: userError } = useAccount()
const { subscriptions, isLoading: subsLoading, error: subsError, isEmpty: subsEmpty, refetch: subsRefetch } = useSubscriptions()
const { credits, remaining, isLoading: creditsLoading } = useAiCredits()
const { upgradeOffer, promoOffers, showUpgrade, showPromos, isLoading: offersLoading } = useOffers()
const { announcements, isLoading: announcementsLoading } = useAnnouncements()
```

- [ ] **Step 2: Wrap user block with loading state**

Find the user info block (`<div class="flex items-center gap-4">`). Wrap:

```vue
<div v-if="userLoading" class="animate-pulse flex items-center gap-4">
	<div class="w-16 h-16 rounded-full bg-border shrink-0"></div>
	<div class="flex-1 space-y-2">
		<div class="h-6 bg-border rounded w-1/2"></div>
		<div class="h-4 bg-border rounded w-3/4"></div>
	</div>
</div>
<div v-else-if="userError" class="text-sm text-brand-red">Couldn't load profile.</div>
<div v-else-if="user" class="flex items-center gap-4">
	<!-- existing user info block -->
</div>
```

- [ ] **Step 3: Wrap subscriptions block**

Find subscriptions loop. Replace with:

```vue
<div v-if="subsLoading" class="animate-pulse space-y-3">
	<div class="h-6 bg-border rounded"></div>
	<div class="h-6 bg-border rounded"></div>
</div>
<ErrorBanner v-else-if="subsError" message="Couldn't load subscriptions" :on-retry="subsRefetch" />
<EmptyState v-else-if="subsEmpty" title="No active subscriptions" description="Your subscriptions will appear here." />
<div v-else class="space-y-3">
	<!-- existing subscription loop -->
</div>
```

Add imports:
```typescript
import ErrorBanner from '@/components/ErrorBanner.vue'
import EmptyState from '@/components/EmptyState.vue'
```

- [ ] **Step 4: Wrap credits block**

Replace the hasCredits `<template>` wrapper with:

```vue
<div v-if="creditsLoading" class="animate-pulse h-20 bg-border rounded"></div>
<template v-else-if="(credits?.total ?? 0) > 0">
	<!-- existing credits content -->
</template>
```

- [ ] **Step 5: Wrap announcements + offers similarly**

Apply same pattern. For announcements:
```vue
<div v-if="announcementsLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
	<CardSkeleton /><CardSkeleton />
</div>
<EmptyState v-else-if="announcements.length === 0" title="No announcements right now" />
<div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
	<AnnouncementCard v-for="item in announcements" :key="item.id" :announcement="item" />
</div>
```

Add `import CardSkeleton from '@/components/CardSkeleton.vue'`.

- [ ] **Step 6: Run dev, observe loading states by throttling network in DevTools**

Run: `npm run dev`. Open DevTools → Network → Slow 3G. Refresh. Verify skeletons show, then content replaces them.

- [ ] **Step 7: Commit**

```bash
git add src/views/OverviewView.vue
git commit -m "feat(overview): add loading/error/empty states for all sections"
```

---

### Task 72: Add loading/error/empty states to Downloads sub-views

**Files:**
- Modify: `src/views/DownloadsAioseoView.vue`
- Modify: `src/views/DownloadsBLCView.vue`
- Modify: `src/views/DownloadsAiCreditsView.vue`
- Modify: `src/views/DownloadsIndexView.vue`

- [ ] **Step 1: DownloadsAioseoView — add state handling**

At the top of the template, wrap the license loop:

```vue
<template v-if="isLoading">
	<CardSkeleton :rows="4" />
</template>
<ErrorBanner v-else-if="error" message="Couldn't load AIOSEO licenses" :on-retry="refetch" />
<EmptyState v-else-if="aioseoLicenses.length === 0" title="No AIOSEO license" description="You don't have an active AIOSEO license yet." />
<div v-else class="space-y-8">
	<!-- existing license cards loop -->
</div>
```

Update script to destructure `isLoading, error, refetch` from `useLicenses()`.

- [ ] **Step 2: DownloadsBLCView — same pattern**

Wrap the "has BLC license(s)" block with the same loading/error pattern. The upsell card is already the empty state.

- [ ] **Step 3: DownloadsAiCreditsView — same pattern**

Destructure loading/error from `useAiCredits()`. Wrap the "has credits" block.

- [ ] **Step 4: DownloadsIndexView — reactive to licenses loading**

Since it calls `useLicenses()` and `useAiCredits()`, add:

```vue
<div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
	<CardSkeleton /><CardSkeleton /><CardSkeleton />
</div>
<div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
	<!-- existing RouterLink cards -->
</div>
```

- [ ] **Step 5: Commit**

```bash
git add src/views/Downloads*.vue
git commit -m "feat(downloads): add loading/error/empty states across all sub-views"
```

---

### Task 73: Add loading/error/empty states to BillingView

**Files:**
- Modify: `src/views/BillingView.vue`

- [ ] **Step 1: Destructure loading/error from all three composables**

```typescript
const { subscriptions, isLoading: subsLoading, error: subsError, isEmpty: subsEmpty, refetch: refetchSubs } = useSubscriptions()
const { paymentMethods, isLoading: pmLoading, error: pmError, isEmpty: pmEmpty, refetch: refetchPm } = usePaymentMethods()
const { orders, isLoading: ordersLoading, error: ordersError, isEmpty: ordersEmpty, refetch: refetchOrders } = useOrders()
```

- [ ] **Step 2: Wrap each table section**

For subscriptions `<tbody>`:
```vue
<tbody v-if="subsLoading">
	<tr><td colspan="4" class="p-0"><TableSkeleton :rows="2" :cols="4" /></td></tr>
</tbody>
<tbody v-else-if="subsError">
	<tr><td colspan="4" class="p-0"><ErrorBanner message="Couldn't load subscriptions" :on-retry="refetchSubs" /></td></tr>
</tbody>
<tbody v-else-if="subsEmpty">
	<tr><td colspan="4" class="p-0"><EmptyState title="No active subscriptions" /></td></tr>
</tbody>
<tbody v-else>
	<SubscriptionRow v-for="sub in subscriptions" :key="sub.id" :subscription="sub" @manage="openManageSub(sub)" />
</tbody>
```

Repeat pattern for payment methods and orders sections.

- [ ] **Step 3: Commit**

```bash
git add src/views/BillingView.vue
git commit -m "feat(billing): loading/error/empty states on all three sections"
```

---

### Task 74: Add loading state to ProfileView

**Files:**
- Modify: `src/views/ProfileView.vue`

- [ ] **Step 1: Destructure isLoading + wrap form sections**

```typescript
const { user, isLoading: userLoading, error: userError } = useAccount()
```

Wrap the entire form in the template:

```vue
<div v-if="userLoading" class="max-w-2xl mx-auto space-y-6">
	<div class="animate-pulse">
		<div class="h-8 bg-border rounded w-1/3 mb-6"></div>
		<div class="space-y-4">
			<div class="h-12 bg-border rounded"></div>
			<div class="h-12 bg-border rounded"></div>
			<div class="h-12 bg-border rounded"></div>
		</div>
	</div>
</div>
<ErrorBanner v-else-if="userError" message="Couldn't load your profile" />
<div v-else class="space-y-10 max-w-2xl mx-auto">
	<!-- existing form content -->
</div>
```

Add `import ErrorBanner from '@/components/ErrorBanner.vue'`.

- [ ] **Step 2: Commit**

```bash
git add src/views/ProfileView.vue
git commit -m "feat(profile): loading + error states around form"
```

---

### Task 75: Apply mutation button states to BillingView modals

**Files:**
- Modify: `src/views/BillingView.vue`

- [ ] **Step 1: Update Delete modal button to reflect isPending**

In BillingView, find:
```vue
<button @click="confirmDelete" class="... bg-brand-red ...">Yes, Delete</button>
```

Replace with:
```vue
<button
	@click="confirmDelete"
	:disabled="deletePm.isPending.value"
	class="... bg-brand-red ... disabled:opacity-50 disabled:cursor-not-allowed"
>
	{{ deletePm.isPending.value ? 'Deleting...' : 'Yes, Delete' }}
</button>
```

- [ ] **Step 2: Update Make Default button to reflect isPending**

Similar pattern for Make Default buttons.

- [ ] **Step 3: Update Change Plan select buttons to reflect isPending**

In the Change Plan modal sub-view, wire the per-plan buttons:
```vue
<script setup>
// add:
import { useChangePlan } from '@/composables/mutations/useChangePlan'
const changePlan = useChangePlan()

async function selectPlan(tier: LicenseTier) {
	if (!selectedSub.value) return
	try {
		await changePlan.mutate({ subscriptionId: selectedSub.value.id, tier })
		toast.success('Plan changed')
		showManageSub.value = false
		modalView.value = 'main'
	} catch {
		toast.error('Could not change plan')
	}
}
</script>
```

Update each `<button>` in the plan loop:
```vue
<button
	v-for="plan in (['basic','plus','pro','elite'] as LicenseTier[])"
	:key="plan"
	@click="selectPlan(plan)"
	:disabled="changePlan.isPending.value"
	class="w-full ... disabled:opacity-50"
>
	<span class="text-body font-medium text-brand-navy">AIOSEO - {{ plan[0]?.toUpperCase() + plan.slice(1) }}</span>
</button>
```

- [ ] **Step 4: Commit**

```bash
git add src/views/BillingView.vue
git commit -m "feat(billing): mutation pending states on modal buttons"
```

---

## Phase 13: Cancellation Flow Integration

### Task 76: Wire useCancellation to useSubscriptions

**Files:**
- Modify: `src/composables/useCancellation.ts`
- Modify: `src/data/cancellationMockUser.ts`

- [ ] **Step 1: Update useCancellation to derive planKey from subscriptions**

```typescript
// src/composables/useCancellation.ts
import { computed } from 'vue'
import { cancellationReasons } from '@/data/cancellationReasons'
import { cancellationLossItems } from '@/data/cancellationLossItems'
import { cancellationCompetitorData } from '@/data/cancellationCompetitors'
import {
	cancellationMockUser,
	cancellationPlanPricing,
	getLowerPlan as getLowerPlanHelper,
} from '@/data/cancellationMockUser'
import { useSubscriptions } from './useSubscriptions'
import { useAccount } from './useAccount'
import type { PlanTier, LowerPlan } from '@/types/cancellation'

function tierFromProductName(name: string): PlanTier {
	const lower = name.toLowerCase()
	if (lower.includes('elite')) return 'elite'
	if (lower.includes('pro')) return 'pro'
	if (lower.includes('plus')) return 'plus'
	return 'basic'
}

/**
 * Cancellation flow data accessor.
 * Reads user planKey from the active subscription (falls back to mock user if none).
 */
export function useCancellation() {
	const { subscriptions } = useSubscriptions()
	const { user: account } = useAccount()

	const user = computed(() => {
		const activeSub = subscriptions.value.find(s => s.status === 'active')
		const derivedPlanKey = activeSub ? tierFromProductName(activeSub.product) : cancellationMockUser.planKey
		const derivedPlanName = activeSub?.product ?? cancellationMockUser.planName
		const firstName = account.value?.firstName ?? cancellationMockUser.firstName
		return {
			...cancellationMockUser,
			firstName,
			planKey: derivedPlanKey,
			planName: derivedPlanName,
		}
	})

	const reasons = computed(() => cancellationReasons)
	const lossItems = computed(() => cancellationLossItems)
	const competitorData = computed(() => cancellationCompetitorData)
	const planPricing = computed(() => cancellationPlanPricing)

	function getLowerPlan(tier: PlanTier): LowerPlan | null {
		return getLowerPlanHelper(tier)
	}

	return { user, reasons, lossItems, competitorData, planPricing, getLowerPlan }
}
```

- [ ] **Step 2: Remove the TODO comment from cancellationMockUser.ts**

In `src/data/cancellationMockUser.ts`, remove the `// TODO: derive from useSubscriptions()` comment block since it's now done.

- [ ] **Step 3: Verify cancellation flow still renders**

Run: `npm run dev`, click Cancel Subscription in billing, verify all 5 steps render and show the right tier.

- [ ] **Step 4: Commit**

```bash
git add src/composables/useCancellation.ts src/data/cancellationMockUser.ts
git commit -m "refactor(cancel): derive planKey from useSubscriptions (resolves TODO)"
```

---

### Task 77: Wire confirmCancel store action to useCancelSubscription mutation

**Files:**
- Modify: `src/stores/cancellation.ts`
- Modify: `src/views/cancel/Step4LossSummary.vue` (or wherever confirmCancel is called)

- [ ] **Step 1: Keep the store action navigation-only, move mutation into the view**

Leave `confirmCancel(router)` in `src/stores/cancellation.ts` as-is — stores don't do mutations; views do.

- [ ] **Step 2: Find the view that calls confirmCancel**

Run: `grep -rn "confirmCancel" src/views/cancel/ --include="*.vue"`
Expected: `Step4LossSummary.vue` (the Review step).

- [ ] **Step 3: In Step4LossSummary.vue, wrap confirmCancel with mutation call**

Read the file first: `cat src/views/cancel/Step4LossSummary.vue`

Find the button that invokes `store.confirmCancel(router)`. Replace with:

```vue
<script setup lang="ts">
// add imports
import { useRouter } from 'vue-router'
import { useCancellationStore } from '@/stores/cancellation'
import { useCancelSubscription } from '@/composables/mutations/useCancelSubscription'
import { useSubscriptions } from '@/composables/useSubscriptions'
import { useToast } from '@/composables/useToast'
import { computed } from 'vue'

const store = useCancellationStore()
const router = useRouter()
const { subscriptions } = useSubscriptions()
const cancelSub = useCancelSubscription()
const toast = useToast()

const activeSubscriptionId = computed(() => {
	return subscriptions.value.find(s => s.status === 'active')?.id ?? ''
})

async function onConfirm() {
	if (!store.selectedReason || !activeSubscriptionId.value) return
	try {
		await cancelSub.mutate({
			subscriptionId: activeSubscriptionId.value,
			reasonId: store.selectedReason.id,
			followUp: store.followUpValue,
		})
		store.confirmCancel(router)
	} catch {
		toast.error('Could not cancel subscription. Please try again.')
	}
}
</script>
```

Update the confirm button:
```vue
<button
	@click="onConfirm"
	:disabled="cancelSub.isPending.value"
	class="... disabled:opacity-50 disabled:cursor-not-allowed"
>
	{{ cancelSub.isPending.value ? 'Cancelling...' : 'Confirm Cancellation' }}
</button>
```

- [ ] **Step 4: Commit**

```bash
git add src/views/cancel/Step4LossSummary.vue
git commit -m "feat(cancel): wire confirm step to useCancelSubscription mutation"
```

---

### Task 78: Wire save-offer acceptance to useApplySaveOffer

**Files:**
- Modify: `src/views/cancel/Step3SaveOffer.vue`

- [ ] **Step 1: Read current file to find the offer-accept action**

Run: `cat src/views/cancel/Step3SaveOffer.vue | head -80`

- [ ] **Step 2: Wire the "Accept Offer" button through useApplySaveOffer**

Add to script:
```typescript
import { useApplySaveOffer } from '@/composables/mutations/useApplySaveOffer'
import { useSubscriptions } from '@/composables/useSubscriptions'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const applyOffer = useApplySaveOffer()
const { subscriptions } = useSubscriptions()
const toast = useToast()
const router = useRouter()

const activeSubscriptionId = computed(() => subscriptions.value.find(s => s.status === 'active')?.id ?? '')

async function onAcceptOffer(variant: string) {
	if (!activeSubscriptionId.value) return
	try {
		await applyOffer.mutate({ subscriptionId: activeSubscriptionId.value, offerVariant: variant })
		toast.success('Offer applied to your subscription')
		router.push({ name: 'billing' })
	} catch {
		toast.error('Could not apply offer')
	}
}
```

Wire the existing accept-offer button's `@click` to call `onAcceptOffer(reason.variant)` (or the appropriate variant string). Show `applyOffer.isPending.value` in the button label.

- [ ] **Step 3: Commit**

```bash
git add src/views/cancel/Step3SaveOffer.vue
git commit -m "feat(cancel): wire save-offer accept to useApplySaveOffer mutation"
```

---

## Phase 14: Form Guards, Docs, Handoff

### Task 79: Add dirty-form guard to cancellation flow

**Files:**
- Modify: `src/layout/CancelLayout.vue`

- [ ] **Step 1: Add useDirtyForm at the layout level**

Inside `src/layout/CancelLayout.vue` `<script setup>`:

```typescript
import { computed } from 'vue'
import { useCancellationStore } from '@/stores/cancellation'
import { useDirtyForm } from '@/composables/useDirtyForm'

const store = useCancellationStore()
const hasProgress = computed(() => store.selectedReason !== null)

useDirtyForm(hasProgress, 'You have an in-progress cancellation. Leave anyway?')
```

- [ ] **Step 2: Reset store when user completes or abandons flow**

Ensure `store.reset()` is called:
- On cancel-confirmation view mount (flow complete)
- On keepPlan store action (already done)

- [ ] **Step 3: Commit**

```bash
git add src/layout/CancelLayout.vue
git commit -m "feat(cancel): warn before leaving with in-progress cancellation"
```

---

### Task 80: Update CLAUDE.md with new patterns

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add sections documenting new conventions**

Append to CLAUDE.md after the "Mock data & profile tiers" section:

```markdown
## HTTP client & API layer

- All API calls go through `src/api/client.ts` (never raw `fetch` in composables).
- `request()` sends `X-WP-Nonce` header and `credentials: 'include'` automatically.
- 401 responses trigger hard redirect to `window.aioseoAccount.loginUrl` with `redirect_to` param.
- Errors are normalized to `ApiError`, `AuthError`, `AuthorizationError`, `NotFoundError`, `NetworkError` — all from `src/api/errors.ts`.

## Boot contract

- `main.ts` reads `window.aioseoAccount` at boot — injected by WordPress via `wp_localize_script` in production.
- In dev, `installDevBootData()` populates this with fixture data before MSW starts.
- `useAuthStore` holds the user + nonce + loginUrl.

## Data layer conventions

- Reads: use `useAsyncResource(key, fetcher)` — shared cache, subscribers, `isLoading`/`error`/`data`/`isEmpty`/`refetch`.
- Writes: use `useMutation(fn, { invalidates })` — `isPending`/`error` refs, automatic cache invalidation.
- Query keys live in `src/api/keys.ts` — never inline strings.
- Views **must** destructure `isLoading`, `error`, `isEmpty` from composables and render loading/error/empty states.

## MSW (mock layer)

- All `fetch` calls are intercepted by MSW in dev.
- Handlers in `src/mocks/handlers.ts` read from `src/mocks/fixtures.ts`, which selects a profile via `localStorage.getItem('aioseo-mock-profile')`.
- ProfileSwitcher writes to localStorage + invalidates queries to swap profiles live.
- Tests share the same handlers via `src/mocks/server.ts` + `tests/setup.ts`.

## UX state conventions

- Every data-reading composable returns `isLoading`, `error`, `isEmpty`.
- Every mutation composable returns `isPending`, `error`.
- Views use `<ErrorBanner>` for load failures, `<EmptyState>` for empty collections, `<CardSkeleton>` / `<TableSkeleton>` for loading.
- Success/failure of mutations is signaled via `useToast()` — never inline ad-hoc toasts.

## Tests

- Infrastructure-only: HTTP client, query cache, toast store, useForm, focus trap, BaseModal a11y.
- Run: `npm run test`.
- No view tests — those come in the API-integration phase.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(claude): document http client, async composables, msw, ux states"
```

---

### Task 81: Create MERGE_NOTES.md for subtree-merge into aioseo-site

**Files:**
- Create: `docs/MERGE_NOTES.md`

- [ ] **Step 1: Create the file**

```markdown
# Merge notes: aioseo-account → aioseo-site subtree

## Purpose
These notes document what must be reconciled when this repo is merged as a subtree into `awesomemotive/aioseo-site`.

## Dev dependencies added here (check aioseo-site for existing equivalents)
- `msw@^2` — browser + node mocking
- `vitest@^2` — test runner
- `happy-dom@^15` — test environment
- `@vitest/coverage-v8@^2` — coverage
- `prettier@^3` — formatter
- `@vue/test-utils@^2` — Vue component testing

If aioseo-site already has any of these, reconcile versions. If aioseo-site uses a different test framework, either:
- Delete `tests/`, `vitest.config.ts`, `tests/setup.ts` and port infrastructure tests to the host framework
- Keep them alongside if both frameworks can coexist

## Config files (likely discard — host repo owns these)
- `.prettierrc.json` — replace with aioseo-site's
- `.prettierignore` — merge with aioseo-site's
- `vitest.config.ts` — keep only if vitest stays
- No ESLint config added here — use aioseo-site's

## Runtime dependencies added
**None.** All infrastructure is hand-rolled.

## Runtime state assumptions
The SPA requires `window.aioseoAccount` populated at page load. In production, this is the responsibility of the WordPress plugin that serves the SPA. Required shape:
```ts
{
  user: { id, firstName, lastName, email, avatarUrl, billingAddress: {...} },
  nonce: string,            // wp_create_nonce('wp_rest')
  apiBase: string,          // e.g. '/wp-json/aioseo/v1/'
  logoutUrl: string,
  loginUrl: string,
}
```

WP plugin pseudocode:
```php
wp_localize_script('aioseo-account', 'aioseoAccount', [
  'user' => [...],
  'nonce' => wp_create_nonce('wp_rest'),
  'apiBase' => rest_url('aioseo/v1/'),
  'logoutUrl' => wp_logout_url('/'),
  'loginUrl' => 'https://aioseo.com/login/',
]);
```

## API endpoints this SPA expects (stubs live in `src/mocks/handlers.ts`)
Base: `/wp-json/aioseo/v1/`

Reads:
- `GET /me` → User
- `GET /licenses` → { licenses: License[] }
- `GET /credits` → AiCredits | null
- `GET /subscriptions` → { subscriptions: Subscription[] }
- `GET /payment-methods` → { paymentMethods: PaymentMethod[] }
- `GET /orders` → { orders: Order[] }
- `GET /offers` → { upgradeOffer, promoOffers }
- `GET /announcements` → { announcements: Announcement[] }
- `GET /help/search?q=` → { articles: HelpArticle[] }

Writes:
- `PATCH /me` → User
- `POST /payment-methods` → PaymentMethod
- `DELETE /payment-methods/:id` → 204
- `PATCH /payment-methods/:id` → PaymentMethod
- `POST /subscriptions/:id/cancel` → { ok, cancelledAt }
- `POST /subscriptions/:id/change-plan` → { ok, newTier }
- `POST /subscriptions/:id/apply-save-offer` → { ok, variant }

Type shapes are canonical in `src/types/*.ts`. If the real EDD endpoints return different shapes, add an adapter layer at `src/api/adapters/*.ts`.

## Files to remove on merge (dev-only)
- `src/mocks/` — entire directory
- `public/mockServiceWorker.js`
- `src/api/boot.ts` `installDevBootData()` function (keep `readBootData()` + `BootData` type)
- The `import.meta.env.DEV` branch in `src/main.ts` that installs dev boot data + starts MSW

## Files to keep as-is
- All `src/api/*.ts`
- All `src/composables/*.ts`
- All `src/stores/*.ts`
- All `src/components/*.vue`
- All `src/views/**/*.vue`
- All `src/types/*.ts`
- `src/mocks/fixtures.ts` — DELETE, since it references `src/data/profiles/*` which are also mock-only

## Known folders to delete on merge
- `src/data/profiles/` — mock fixtures, no longer needed
- `src/data/cancellationMockUser.ts` — replace with real subscription lookup
- `src/data/announcements.ts`, `articles.ts`, `giveaway.ts`, `addons.ts` — replace with API calls or CMS
- `src/components/ProfileSwitcher.vue` — dev-only, delete

## Tailwind / asset notes
- This project uses Tailwind v4 (`@theme` tokens in `src/assets/main.css`). If aioseo-site uses a different Tailwind version or styling system, these need reconciliation.
- Asset paths use `import.meta.env.BASE_URL` prefix. If aioseo-site serves the SPA under a different path, update `vite.config.ts` `base`.

## Vite config
- `vite.config.ts` has `base: '/account/'`. Confirm this matches the production serving path.

## Tests
Infrastructure tests live in `tests/`:
- `tests/api/client.test.ts`
- `tests/composables/useAsyncResource.test.ts`
- `tests/composables/useMutation.test.ts`
- `tests/composables/useForm.test.ts`
- `tests/composables/useFocusTrap.test.ts`
- `tests/stores/toast.test.ts`
- `tests/components/BaseModal.test.ts`

If port to different runner, preserve the test intents — they cover infrastructure correctness.
```

- [ ] **Step 2: Commit**

```bash
git add docs/MERGE_NOTES.md
git commit -m "docs: add merge notes for subtree integration into aioseo-site"
```

---

### Task 82: Final smoke test and verification

**Files:**
- None (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: All tests pass (infrastructure tests: client, useAsyncResource, useMutation, useForm, useFocusTrap, toast, BaseModal)

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Clean build, no type errors, no ProfileSwitcher in output bundle

- [ ] **Step 3: Run build preview and manually walk through every route**

Run: `npm run preview`
Navigate through:
- `/account/overview` — should load, show loading skeletons briefly, then content
- `/account/downloads` — should show 3 product cards
- `/account/downloads/aioseo` — should show license card + addons
- `/account/downloads/blc` — should show license or upsell
- `/account/downloads/ai-credits` — should show credits panel
- `/account/billing` — open each modal, verify a11y (Tab, Escape, focus trap)
- `/account/profile` — type in a field, verify dirty state enables Save, click Save, verify toast
- `/account/support` — should render iframe placeholders
- `/account/suggest-a-feature` — should render iframe placeholder
- `/account/giveaway` — should render
- `/account/cancel/support` — start cancel flow, proceed through all 5 steps

- [ ] **Step 4: Verify ProfileSwitcher in dev mode only**

Run: `npm run dev` — verify ProfileSwitcher visible in bottom-right corner, switching profiles refetches data.
Run: `npm run preview` after build — verify ProfileSwitcher is NOT visible.

- [ ] **Step 5: Verify network throttle shows loading skeletons**

In `npm run dev`, open DevTools → Network → Slow 3G → refresh any route. Verify skeletons show, then content replaces them.

- [ ] **Step 6: Commit final status note**

```bash
# No file changes — just a tag or status note
git log --oneline | head -20
```

Confirm ~70+ commits landed, all infrastructure tests pass, production build is clean.

---

## Self-Review Notes

**Spec coverage:** All 9 success criteria from the header are addressed:
1. Async composables (Tasks 53–60) ✓
2. Mutation composables (Tasks 61–67) ✓
3. Loading/error/empty states (Tasks 68–74) ✓
4. BaseModal a11y (Tasks 28–29) ✓
5. Orphaned DownloadsView deletion + extracted components (Tasks 31–32, 41) ✓
6. ProfileSwitcher dev gate (Task 35) ✓
7. Cancellation mutation integration (Tasks 76–78) ✓
8. Infrastructure tests (Tasks 8, 15, 16, 20, 22, 26, 29) ✓
9. MERGE_NOTES.md (Task 81) ✓

**Structural fixes from gap audit addressed:**
- 404 route (Task 34) ✓
- Asset path fix (Task 36) ✓
- html lang (Task 37) ✓
- Per-route titles (Task 38) ✓
- ProfileView v-model (Task 39) ✓
- BillingView localMethods drift (Task 40) ✓
- BillingView uses extracted components (Task 41) ✓
- TabNavigation a11y (Task 42) ✓
- Icon extraction (Tasks 43–46) ✓
- Dirty form guards (Tasks 39, 79) ✓

**Deferred from this plan (documented in "Out of scope"):**
- Stripe Elements integration
- Real login screen in SPA
- Pricing API
- View-level tests, E2E
- ESLint config (deferred to aioseo-site merge)
- Visual fixes to edge-case UI (expired licenses, past_due subs)

**Execution order soundness:**
- Dev tooling (Phase 1) before anything else ✓
- HTTP client + boot (Phase 2) before composables ✓
- Query/mutation layer (Phase 3) before mutation composables ✓
- Toast + utilities (Phase 4) before BaseModal rebuild ✓
- BaseModal (Phase 5) before views that use modals ✓
- Structural fixes (Phase 6) can happen in parallel with Phase 4-5 in practice
- MSW handlers (Phase 8) before async composable conversion (Phase 9)
- Mutation composables (Phase 10) after async conversion (replacing temporary stubs)
- Query boundaries (Phase 11-12) after composable conversion
- Cancellation integration (Phase 13) after mutation composables exist
- Docs and smoke test (Phase 14) last

**Known type/name consistency checks:**
- `useForm` returns `errors.value.{field}` — consistent across ProfileView usage
- `useAsyncResource` return shape identical everywhere: `{ data, isLoading, error, isEmpty, refetch }`
- `useMutation` return shape: `{ mutate, isPending, error, reset }`
- Query keys referenced via `queryKeys.X` constants, never inline strings
- `api.get/post/patch/delete` consistent signatures

