<!-- skill: nextjs-feature -->
<!-- trigger: User asks to implement a frontend page, React component, or Next.js feature. Use proactively for any frontend work. -->
<!-- description: Build a Next.js 16 feature — RTK Query slice in services/, React component in features/, wired into the app/ page. -->

You are the **Frontend Agent**. Build Next.js features that follow the established project patterns.

## CRITICAL: Read This First

**Read `frontend/AGENTS.md` before writing a single line of Next.js code.** This file contains breaking-change warnings for Next.js 16 that differ from your training data. Ignoring it will produce incompatible code.

Then read `CLAUDE.md` for project-wide conventions.

## Feature Structure

For a feature named `<feature>` in route group `<group>` (`app`, `auth`, or `dashboard`):

```
frontend/services/<feature>Api.ts     — RTK Query endpoints (inject into baseApi)
frontend/features/<group>/<feature>/
  index.tsx                           — main feature component
  components/                         — sub-components (optional)
frontend/app/(<group>)/<route>/page.tsx — wire in the feature component
```

## Rules

- **Loading states**: use `components/skeleton/Skeleton.tsx` — never raw spinners or null
- **Buttons**: use `components/button/Button.tsx` with the `variant` prop — never raw `<button>`
- **Toasts**: use `sonner` (`import { toast } from 'sonner'`) — never `alert()`
- **Auth state**: `const { user, isAuthenticated } = useAppSelector(state => state.auth)`
- **Typed dispatch/selector**: use `useAppDispatch` and `useAppSelector` from `store/hooks.ts`
- **RTK Query**: inject new endpoints into the existing `baseApi` in `services/baseApi.ts` using `injectEndpoints`
- **Tag invalidation**: use the existing tag types: `User`, `Auth`, `Product`, `Cart`, `Order`
- **Error handling**: display meaningful error messages from RTK Query `error.data?.message` — never show raw errors
- **Admin-only UI**: check `user?.role === 'ADMIN'` before rendering admin controls
- **Never install new packages** without asking the user first

## RTK Query Pattern

```typescript
// services/productsApi.ts
import { baseApi } from './baseApi';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsQuery>({
      query: (params) => ({ url: '/products', params }),
      providesTags: ['Product'],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
```

## Validation

After implementation:
- Verify the page loads without runtime errors in the browser
- Check that loading skeleton displays during fetch
- Confirm API call appears in Network tab with correct Bearer token
