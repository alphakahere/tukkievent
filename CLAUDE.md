# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TukkiEvent is a French-language event ticketing platform built for West African markets. Currency is XOF (CFA franc) with optional EUR. All UI copy is hardcoded in French (no i18n library).

## Tech Stack

- **Next.js 15** with App Router and Turbopack
- **React 19**, TypeScript 5 (strict)
- **Tailwind CSS 4** (PostCSS v4 plugin)
- **Redux Toolkit + RTK Query** for state/API
- **React Hook Form + Yup** for forms (French error messages written inline; `yup-locales` is installed but not wired — do not call `setLocale`)
- **shadcn/ui** (new-york style, lucide icons) — config in `components.json`
- **date-fns** with French locale for date formatting

## Commands

```bash
npm run dev      # Dev server with Turbopack (localhost:3000)
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint
```

No test framework is configured.

## Architecture

### Directory Layout (`src/`)

- **app/** — Next.js pages using App Router. Key routes:
  - `/` (home), `/events`, `/events/[slug]`, `/search`, `/tickets`, `/profile`, `/favorites`
  - `/checkout/{event,info,summary,payment,processing,success,error,confirm}` — multi-step checkout flow
- **components/** — shadcn/ui primitives (`ui/`) and domain components (`EventCard`, `Home/`, etc.)
- **store/** — Redux store, cart slice, RTK Query API definitions (`eventApi`, `orderApi`)
- **contexts/** — React Context for Favorites and Orders (both localStorage-backed)
- **layouts/** — Layout shell, Navbar, Footer
- **lib/** — Utilities (`cn`, `formatDate`, `formatPrice`) and `mockData.ts`

### State Management

- **Cart (Redux)**: items, buyerInfo, totals, currency, paymentMethod, currentStep, orderId. Persisted via `redux-persist` to localStorage.
- **Favorites & Orders (Context)**: stored in localStorage, managed through React Context providers.
- **API data (RTK Query)**: baseQuery targets `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8001/api`). Currently mostly using mock data.

### Data Flow

1. Users browse events → add ticket types to cart (Redux)
2. Checkout steps: Event Select → Summary → Buyer Info → Payment → Processing → Success
3. Orders saved to localStorage via OrdersContext on completion

### Forms

All forms use **React Hook Form + yup** (`@hookform/resolvers/yup`). No ad-hoc `useState`-per-field validation.

- **Schema lives in a sibling file** so create/edit pages can share it. Example: `src/app/organizer/events/_form/schema.ts` exports `eventFormSchema` + `EventFormValues` (`yup.InferType`), consumed by `new/page.tsx` (and later by the Paramètres edit tab). Underscore-prefixed folders (`_form/`) are private to the route tree.
- **Field components** (in `components/ui/`): `FormInput`, `FormTextarea`, `FormSelect`, `DatePicker`. They each accept `label`, `error`, `required`, `helperText` and handle the a11y wiring (`aria-invalid`, `aria-describedby`, `role="alert"`). Spread `register("field")` into `FormInput`/`FormTextarea`; wrap `FormSelect`, `DatePicker`, `Checkbox`, and shadcn `Select` in a `Controller` because they're controlled.
- **Error messages are French and written inline** on each rule (e.g. `.required("Le titre est requis")`). Match the existing tone (sentence case, no trailing period for short messages).
- **Numbers from native inputs**: yup's `.number()` chokes on the empty string. Use a transform to map `""`/`null` → `undefined` so `.required()` surfaces a clean "requis" message instead of `NaN`. See `numberFromInput` in `_form/schema.ts`.
- **`watch()` returns raw input values** (e.g. `"500"` for a number input), not the yup-transformed value — the transformed value only exists inside the validated `onValid` handler. Coerce with `Number(...)` if you use watched values for live UI math.
- **Field arrays**: use `useFieldArray` (e.g. for ticket rows). The field's own `id` is the React key — don't generate your own.
- **API errors**: catch RTK mutation errors with `getApiErrorMessage` from `src/store/api/auth/error.ts` rather than re-parsing `err.data.message` inline.

### Key Types

- **Event**: id, slug, title, startDatetime, city, coverImageUrl, ticketTypes[], organization, category
- **TicketType**: id, eventId, name, price, totalQuantity, minPurchase, maxPurchase
- **CartItem**: eventId, eventTitle, eventDate, tickets[]

## Configuration

- **Path alias**: `@/*` → `src/*`
- **Image domains** (next.config.ts): Cloudinary, Unsplash, Picsum
- **Environment**: `NEXT_PUBLIC_API_BASE_URL` in `.env.local`

## Current Status

- Auth is not implemented (Bearer token logic commented out in RTK Query baseQuery)
- Payment integrations (Wave, PayPal) are UI placeholders only
- API integration is partial; mock data in `src/lib/mockData.ts` is used in many components
