# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TukkiEvent is a French-language event ticketing platform built for West African markets. Currency is XOF (CFA franc) with optional EUR. All UI copy is hardcoded in French (no i18n library).

## Tech Stack

- **Next.js 15** with App Router and Turbopack
- **React 19**, TypeScript 5 (strict)
- **Tailwind CSS 4** (PostCSS v4 plugin)
- **Redux Toolkit + RTK Query** for state/API
- **React Hook Form + Yup** for forms (French validation via `yup-locale-fr`)
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
