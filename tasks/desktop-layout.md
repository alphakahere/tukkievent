# Task: Extend all screens for desktop layout

**Status**: pending  
**Created**: 2026-04-10

## Overview

Currently all pages are designed mobile-first with a `max-w-lg` container. They need proper desktop layouts that take advantage of larger screens using CSS breakpoints (`md:`, `lg:`).

## Screens to extend

| Screen | Desktop layout |
|---|---|
| `/` | Sidebar with categories/filters + main event grid |
| `/events` | 2–3 column grid + left filter sidebar |
| `/events/[id]` | Two-column: content left, sticky booking sidebar right |
| `/search` | Filter panel left + results grid right |
| `/tickets` | Wider card layout, QR visible inline |
| `/tickets/[id]` | Two-column: QR + details left, event info right |
| `/favorites` | 2–3 column event grid |
| `/profile` | Two-column: user card + stats left, menu right |
| `/history` | Table-style list with columns (event, date, amount, status) |
| `/history/[orderId]` | Two-column: order summary left, ticket breakdown right |
| `/notifications` | Centered `max-w-2xl` with larger cards |
| `/settings` | Two-column: nav sidebar left (sections), content right |
| `/payment-methods` | Two-column: saved methods left, transaction history right |
| Checkout flow | Centered wide card layout, progress bar at top |

## Approach

- Keep `<BottomNav>` hidden on `md+` (already `md:hidden`)
- Add a top `<Navbar>` visible on `md+` for desktop navigation
- Use CSS grid/flex breakpoints (`md:`, `lg:`) to switch from stacked mobile to side-by-side desktop
- Reuse existing components, only change layout at breakpoints — no rewrites
- Add a desktop sidebar nav for profile sub-pages (Settings, History, Notifications, Payment Methods) so they feel like a unified account section
