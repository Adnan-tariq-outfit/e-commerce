# E-Commerce Platform — Agentic Project Context

This file is the primary context document for all agents working on this project. Read it at the start of every task before touching any code.

---

## Project Overview

A full-stack e-commerce platform built as part of a supervised assessment. The goal is a working, coherent application — not a polished production product. The project has two sides backed by one API:

- **Customer Storefront** — browse products, cart, checkout, order history
- **Admin Panel** — product management, order management, analytics dashboard

Both sides share a single NestJS backend with PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS 11, TypeScript, Passport.js |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Database | PostgreSQL 16 (Docker) |
| Auth | JWT (access token 1d + refresh token 7d) |
| Frontend | Next.js 16.2.9, React 19, TypeScript |
| State | Redux Toolkit + Redux-Persist + RTK Query |
| Forms | React Hook Form + Yup |
| Styling | Tailwind CSS v4 |
| Notifications | Sonner |
| API Docs | Swagger at `http://localhost:3001/api/docs` |

---

## Agent Roles

| Role | Responsible For |
|---|---|
| **Architect Agent** | Feature planning, endpoint design, identifying reuse — produces plans, never writes code |
| **Backend Agent** | NestJS modules (controller, service, DTOs), Prisma queries, guard wiring |
| **Frontend Agent** | Next.js pages, RTK Query slices, React components in `features/` dirs |
| **QA Agent** | Security checklist, type verification, NOTES.md documentation of findings |

---

## What's Already Built

### Backend
- JWT auth module: `POST /api/v1/auth/register|login|refresh|logout`
- User profile: `GET /api/v1/user/me`
- Prisma schema: all models defined (User, Category, Product, Cart, CartItem, Order, OrderItem, Payment, ProductView)
- Global guards, decorators, exception filter, throttler

### Frontend
- Auth pages: login, register, forgot-password (fully implemented)
- Route groups scaffolded: `(app)`, `(auth)`, `(dashboard)`
- Page stubs: products, cart, checkout, order-history, dashboard, product-management, order-management, access-control
- Feature stub directories in `features/app/` and `features/dashboard/`
- Redux store, RTK Query base API with auto token refresh, auth slice, guards

### Remaining to Build
Backend modules: categories, products, cart, orders, payments, admin, recommendations
Frontend features: all page implementations, RTK Query slices, product suggestions

---

## Architecture Conventions

### Backend Module Pattern
Every new module follows `src/modules/auth/` as the reference:
```
src/modules/<name>/
  <name>.module.ts       — imports PrismaModule (no need, it's global)
  <name>.controller.ts   — HTTP layer only, @ApiTags, @ApiBearerAuth
  <name>.service.ts      — business logic + Prisma queries
  dto/
    create-<name>.dto.ts — class-validator decorators
    update-<name>.dto.ts
```

**Rules:**
- `PrismaService` is globally provided — never add it to a module's `providers` array
- `GlobalExceptionFilter` handles all errors — no try/catch in controllers
- All state/stock validation happens in the **service**, not controller
- Apply `@UseGuards(JwtAuthGuard)` per endpoint or module, or rely on the global guard + `@Public()` for open routes
- Admin-only routes: `@Roles(Role.ADMIN)` + `@UseGuards(RolesGuard)`

### Frontend Feature Pattern
```
features/<group>/<feature>/
  index.tsx       — main feature component
  components/     — sub-components used only in this feature
  hooks.ts        — feature-specific hooks (optional)
  types.ts        — local types (optional)
```
- Wire into `app/<group>/<route>/page.tsx` by importing from `features/`
- RTK Query endpoints go in `services/<feature>Api.ts`, injected into `baseApi`
- Loading states: use `components/skeleton/Skeleton.tsx`
- Buttons: use `components/button/Button.tsx` — never raw `<button>`
- Toasts: use `sonner` — never `alert()`
- Auth state: `useAppSelector(state => state.auth)` via `store/hooks.ts`

---

## Key File Paths

| File | Purpose |
|---|---|
| `backend/src/modules/auth/` | Reference pattern for all new modules |
| `backend/src/common/guards/` | JwtAuthGuard, RolesGuard |
| `backend/src/common/decorators/` | @GetUser, @Public, @Roles, @StrictThrottle |
| `backend/src/common/filters/` | GlobalExceptionFilter |
| `backend/prisma/schema.prisma` | Database schema — read before any module work |
| `backend/prisma/seed.ts` | Seed script |
| `frontend/AGENTS.md` | **CRITICAL: Next.js 16 breaking changes — read before any frontend code** |
| `frontend/services/baseApi.ts` | RTK Query base with token refresh |
| `frontend/services/auth/` | Auth API + slice (reference for new service files) |
| `frontend/guards/` | AuthGuard, PermissionGuard (already wired in dashboard layout) |
| `frontend/components/` | Button, Skeleton, ProfileDropdown (reuse, don't recreate) |

---

## Environment Variables

### Backend (`.env`)
```
DATABASE_URL="postgresql://admin:admin123@localhost:5432/ecommerce_db?schema=public"
JWT_SECRET="your-jwt-access-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
PORT=3001
ALLOWED_ORIGINS="http://localhost:3000"
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## Run Commands

```bash
# 1. Start database
cd backend && docker compose up -d

# 2. Run migrations + seed
npx prisma migrate dev
npx ts-node prisma/seed.ts

# 3. Start backend
npm run start:dev

# 4. Start frontend (separate terminal)
cd frontend && npm run dev
```

URLs:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001/api/v1`
- Swagger: `http://localhost:3001/api/docs`

---

## Hard Rules for All Agents

1. **Never modify the Prisma schema** without explicit user approval of a plan first
2. **Never regenerate or modify** the auth module (`src/modules/auth/`) unless explicitly told to
3. **Always read `frontend/AGENTS.md`** before writing any Next.js code — Next.js 16 has breaking changes
4. **Never hardcode secrets** — all sensitive values come from environment variables
5. **Never install new npm packages** without asking the user first
6. **Never use `try/catch` in controllers** — the GlobalExceptionFilter handles all exceptions
7. **Stock and price validation happen in the service layer** — never trust client-sent totals
8. Prefer editing existing files over creating new ones unless it's a genuinely new module

---

## Skills Available

| Skill | When to use |
|---|---|
| `/plan` | Before starting any new feature — produces endpoint + file plan |
| `/nestjs-module` | When implementing a backend module |
| `/nextjs-feature` | When implementing a frontend page/feature |
| `/write-tests` | After a feature is complete, or when tests are requested |
| `/security-review` | After adding any new endpoint or guard |
| `/update-readme` | When project README needs updating |
| `/update-notes` | After completing any significant task (use proactively) |

---

## Open-Ended Requirement: Product Recommendations

**Interpretation:** "Relevant suggestions" = products from categories the user has previously viewed, excluding products they've already seen.

**Implementation:** `GET /api/v1/recommendations` (JWT required)
1. Fetch the authenticated user's `ProductView` history
2. Extract the `categoryId` values of viewed products
3. Return products in those categories that the user has NOT yet viewed
4. Fallback (no view history): return newest products by `createdAt DESC`
5. Limit: 10 products max

**Reasoning:** The `ProductView` model is already in the schema — this was clearly designed for this purpose. It's a lightweight collaborative-filtering proxy that works without complex ML, is explainable, and can be built entirely in Prisma queries. More sophisticated approaches (user-user similarity, matrix factorization) are noted in NOTES.md as future work.
