# NOTES.md — Assessment Submission Notes

Project: Full-Stack Developer Assessment — Mini E-Commerce Platform
Date: 2026-06-29
Developer: Adnan Tariq

---

## 1. Agent Workflow

**Tool Used:** Claude Code (Anthropic) via VS Code extension, model claude-sonnet-4-6.

**How work was scoped and driven:**

The project was driven through Claude Code with a CLAUDE.md file at the project root as the persistent context anchor. Every new task started with "read CLAUDE.md" as the first instruction, ensuring the agent always had the current project state, conventions, and hard rules before writing code.

Work was decomposed into role-based agents (Architect → Backend → Frontend → QA), each with a dedicated skill file under `.claude/commands/`. Tasks were issued one module at a time — never "build the whole backend." The Architect skill was invoked first to plan endpoints and file structure before any implementation agent touched code.

**Skills used as reusable prompts:**
- `/plan` — called before every new module; produces endpoint list + file plan
- `/nestjs-module` — scaffolds a NestJS module following the auth pattern
- `/nextjs-feature` — builds a Next.js page + RTK Query slice
- `/write-tests` — generates focused Jest tests
- `/security-review` — runs checklist after each completed feature
- `/update-readme` — keeps README current
- `/update-notes` — appends findings here after each task

**Context management:** CLAUDE.md served as the project memory between sessions. The file was updated whenever a new module was completed or a decision was made.

---

## 2. Where the Agent Helped — and Where It Failed

_This section is updated after each task._

### Helped
- Scaffolding NestJS modules with correct guard wiring, DTO validation, and Swagger decorators — saved significant boilerplate time
- Writing Prisma queries for complex joins (cart with products and totals, order with items and payment status)
- Setting up RTK Query slices with the correct tag invalidation patterns
- Identifying reuse opportunities (e.g., the existing `@GetUser()` decorator was already exactly what was needed)

### Failed / Required Correction
- **Auth module**: Agent initially tried to regenerate the auth module from scratch when asked to add a new module — caught by the CLAUDE.md hard rule "never modify auth module." Redirected the agent to only create the new module.
- **Prisma PrismaService**: On first backend module attempt, agent added `PrismaService` to the module's `providers` array — incorrect since it's globally provided. Fixed by explicit instruction in the `/nestjs-module` skill.
- **Next.js 16**: Agent wrote `export default async function Page()` without reading `frontend/AGENTS.md` first — produced code incompatible with Next.js 16 conventions. The AGENTS.md rule in CLAUDE.md and the skill template prevented this in subsequent tasks.
- **Stock validation**: Agent placed stock check in the controller — moved to service layer per project convention.

---

## 3. Supervision & Verification

After every backend module:
1. Hit the endpoint via Swagger (`http://localhost:3001/api/docs`) with both a valid JWT and no JWT
2. Verified 401 returned for unauthenticated requests, 403 for wrong role
3. Ran `npm run test` in backend — watched for regressions
4. Read the generated service file and checked that Prisma queries matched the schema

After every frontend feature:
1. Manually navigated the golden path in browser
2. Checked Redux DevTools for correct state transitions
3. Verified loading skeleton appeared and was replaced by real data
4. Checked Network tab to confirm correct API endpoint was called with the Bearer token

Security review (`/security-review`) was run after every completed module.

---

## 4. Design Workflow

The UI design was produced through Tailwind CSS classes driven by explicit agent prompts. The approach:

1. Described the layout and visual intent in the prompt (e.g., "card grid with 3 columns, each card showing image top-right, product name and price below, add-to-cart button at bottom")
2. Agent produced the Tailwind markup
3. Iterated by describing what looked wrong and asking for specific adjustments (spacing, color, hover states)
4. Used the existing design tokens already in the project (theme toggle, dark mode class on `<html>`)

Design was not copied from any template or UI kit. Component primitives from the project's existing `Button` and `Skeleton` components were used as building blocks.

---

## 5. Assumptions

| Decision | Choice Made | Reasoning |
|---|---|---|
| Product images | URL field (`imageUrl` in schema) — not file upload | Simpler infra, image can be hosted anywhere; file upload adds S3/CDN complexity not needed for the assessment |
| Payment | Mock flow — `Payment` record created with `status: COMPLETED` and fake `transactionId` immediately | Assessment explicitly allows mock payment; Stripe test mode integration noted as what would come next |
| Recommendations | View-history + category-based (see Section 7) | `ProductView` model was already in the schema — clearly designed for this |
| Cart persistence | Database-backed `Cart` model tied to user ID | Assessment requires "cart persists across sessions for logged-in users" |
| Order total | Calculated in service from `priceAtPurchase × quantity` — not trusted from client | Data integrity requirement: client cannot send manipulated total |
| Admin access | Role check via `@Roles(Role.ADMIN)` + `RolesGuard` on all admin endpoints | Customers get 403, not 404, so they know the resource exists but they're not authorized |
| Seed image URLs | Public placeholder images (e.g., picsum.photos) | Avoids needing any upload infrastructure for the seed |

---

## 6. Trade-offs & Scope

### Fully Built
- Auth system (register, login, refresh, logout) with JWT refresh tokens
- Customer storefront: product catalog with search/filter/sort/paginate, product detail, cart, checkout, order history
- Admin panel: product CRUD, order status management, analytics dashboard
- Product recommendations based on view history
- Seed script with admin + customer users and sample data
- Tests for cart and order service logic

### Mocked / Simplified
- **Payment**: mock flow (no real Stripe); `transactionId` is a generated UUID
- **Image upload**: URL string only; no actual file upload endpoint
- **Email notifications**: not implemented; noted as next step
- **Stock reservation**: no pessimistic locking — race condition possible under high concurrency (noted; would need DB-level lock or Redis in production)

### What Would Come Next With More Time
- Stripe test mode integration (drop-in replacement for mock payment)
- Presigned S3 URLs for image upload
- Email confirmation on order (Resend or SendGrid)
- Redis caching for product catalog queries
- Proper stock reservation with database transactions and `SELECT FOR UPDATE`
- More sophisticated recommendations (user-user similarity using ProductView co-occurrence)
- E2E tests with Playwright covering the full checkout flow

---

## 7. Open-Ended Requirement: Product Recommendations

**Requirement:** "Customers should be able to see product suggestions that are relevant to them."

**Interpretation:** "Relevant" means products that align with the user's demonstrated interests, inferred from what they've already looked at.

**Implementation:** `GET /api/v1/recommendations` (JWT required)

Algorithm:
1. Fetch the authenticated user's view history from `ProductView`
2. Extract the distinct `categoryId` values of products they've viewed
3. Return up to 10 products in those categories that the user has **not** yet viewed
4. Order by `createdAt DESC` (newest first) as a tie-breaker
5. **Fallback** (user has no view history): return the 10 newest products overall

**Why this interpretation:**
- The `ProductView` model was already in the schema with `userId`, `productId`, and `viewedAt` fields — this was clearly designed to support exactly this use case
- Category-affinity is a proven lightweight proxy for interest (used by Amazon, Netflix category rows)
- It's explainable: "because you looked at running shoes, here are more running products"
- It works immediately from day one with zero historical data overhead (falls back gracefully)
- More sophisticated approaches (collaborative filtering, matrix factorization, embedding similarity) require user-user interaction data and are noted as future work

**View tracking:** Products are recorded to `ProductView` when a logged-in user visits a product detail page (`GET /products/:id`). Unauthenticated views are not recorded.

---

## 8. Post-Submission Fixes & Iterations

### 2026-06-30 — Dashboard Product Search

**Problem:** The search input in the admin product management table was not working. The Search icon was purely decorative (not a button), so clicking it did nothing. The form required pressing Enter to submit, which was not obvious to users. Additionally, clearing the input did not reset results — the stale `search` state continued filtering until the form was resubmitted.

**Fix (`frontend/features/dashboard/products/index.tsx`):**
- Converted the Search icon into a `<button type="submit">` so clicking it triggers the search
- Added a `useEffect`-based 300ms debounce: search now fires automatically as the user types without needing to press Enter or click the button
- Clearing the input now resets results immediately via the debounce

**Pattern used:** Two-state approach retained (`searchInput` for the controlled input, `search` for the active query param). The `useEffect` debounce bridges them — `handleSearchSubmit` still works for immediate submission via Enter or icon click.

### 2026-06-30 — Database Credentials Mismatch

**Problem:** Backend threw `PrismaClientKnownRequestError: Authentication failed against the database server` on every request. The `.env` file had `DATABASE_URL` pointing to user `admin` / password `admin123`, but `docker-compose.yml` creates the container with `POSTGRES_USER: postgres` / `POSTGRES_PASSWORD: postgres`.

**Fix (`backend/.env`):** Updated `DATABASE_URL` to `postgresql://postgres:postgres@localhost:5432/ecommerce_db?schema=public` to match the actual Docker container credentials.

---

### 2026-06-30 — Products Not Showing (Max Price Filter Bug)

**Problem:** The products page showed "0 products" and "No products match your filters" even though categories were visible in the sidebar. The API was returning empty results.

**Root cause (`frontend/features/products/ProductListView.tsx`):** `maxPrice` was always sent to the API with its default value of `1000`. The backend applies `price <= maxPrice` whenever the parameter is present — so any product priced above Rs. 1,000 was silently filtered out. Since all products in the database were priced above that threshold, the response was always empty.

**Fix:** Changed `maxPrice` to only be included in the query when the user actively moves the slider below the maximum: `...(maxPrice < 500000 && { maxPrice })`. At default, no price filter is applied and all products are returned.

**Additional fix:** Raised the slider maximum from `1,000` to `500,000` and the step from `10` to `5,000` to match realistic Rs. pricing.

---

### 2026-06-30 — Currency Symbol: $ → Rs.

**Problem:** All price displays used `$` (US dollar) throughout the storefront, cart, checkout, order history, admin orders, and dashboard. The admin product management page already used `Rs.` inconsistently.

**Fix:** Replaced all inline `$` currency formatting with `Rs.` across 9 files:
- `features/home/components/ExtendedProductCard.tsx`
- `features/app/product-detail/index.tsx`
- `features/cart/index.tsx`
- `features/checkout/index.tsx`
- `features/order-history/components/OrderDetailModal.tsx`
- `features/dashboard/orders/index.tsx`
- `features/dashboard/orders/components/AdminOrderDetailModal.tsx`
- `features/dashboard/components/RevenueChart.tsx`
- `features/dashboard/index.tsx`

Formatting changed from `$x.toFixed(2)` to `Rs. x.toLocaleString()` — whole numbers with locale-aware thousands separators (e.g. Rs. 1,299 instead of $1299.00).

---

### 2026-06-30 — Product Delete: Foreign Key Constraint Error

**Problem:** Attempting to delete a product that had existing order items failed with a raw `PrismaClientKnownRequestError` (foreign key constraint on `OrderItem_productId_fkey`). The `GlobalExceptionFilter` was not catching it — the duck-typing check on `code.startsWith('P')` is unreliable with Prisma 7's adapter-pg, which wraps errors differently. The frontend showed a generic unhandled error.

**Fix (two-layer):**

1. **Backend (`backend/src/modules/product/product.service.ts`):** Added a targeted try-catch inside the `remove()` method around `prisma.product.delete()`. Detects the foreign key error by checking the error message for `"foreign key"` (case-insensitive), which is reliable across Prisma versions and adapter configurations. Throws `ConflictException` (409) with a clear user-facing message: *"This product cannot be deleted because it is linked to existing orders."*

2. **Frontend (`frontend/features/dashboard/products/index.tsx`):** Updated `DeleteConfirmDialog` to have two states — a normal confirm state and an error state. On failure, the dialog transitions to the error state showing the backend message inline, rather than closing or firing a generic toast. The user sees exactly why deletion failed without leaving the context.

3. **Filter improvement (`backend/src/common/filters/http-exception.filter.ts`):** Updated `isPrismaError()` to use `exception.constructor.name.startsWith('PrismaClient')` — more reliable than duck-typing on the `code` property. Also maps P2002 (unique constraint) → 409 and P2025 (not found) → 404 for consistent error handling across all future modules.

---

### 2026-06-30 — Search Input Styling

**Dashboard search (`frontend/features/dashboard/products/index.tsx`):**
- Updated focus ring from `indigo-500/30` to project theme tokens: `focus:border-primary focus:ring-ring/20`
- Changed `rounded-lg` to `rounded-xl` for visual consistency

**Storefront search (`frontend/features/products/components/ProductListHeader.tsx`):**
- Search bar was `w-full` spanning the entire `max-w-7xl` container width — visually stretched across the full page
- Fixed by adding `max-w-lg` to the search wrapper, constraining it to 32rem

---

## 9. Agent Session Context

Claude Code session logs are stored at `.claude/` and can be reviewed alongside this file. Each task is committed with a clear message describing what was built, which agent built it, and what was corrected.

The git history is structured as:
1. `setup: scaffold project and auth` (existing)
2. `backend: add categories and products modules` 
3. `backend: add cart module with stock validation`
4. `backend: add orders and mock payment modules`
5. `backend: add admin and analytics endpoints`
6. `backend: add recommendations endpoint`
7. `seed: populate categories, products, users, orders`
8. `frontend: implement product catalog and detail pages`
9. `frontend: implement cart and checkout flow`
10. `frontend: implement order history page`
11. `frontend: implement admin dashboard with chart`
12. `frontend: implement admin product and order management`
13. `test: add service unit tests for cart and orders`
14. `docs: add README and finalize NOTES.md`
