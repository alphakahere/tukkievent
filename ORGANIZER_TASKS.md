# Organizer Dashboard — Task List

Status snapshot of the organizer dashboard (`src/app/organizer/`), split into what's
done and what's still outstanding. Generated 2026-06-08.

## ✅ Implemented (wired to real APIs)

- [x] **Navigation shell** — `layout.tsx`: sidebar, role guard, org context, notifications, profile/logout
- [x] **Dashboard home** — `dashboard/page.tsx`: KPIs (total/upcoming/capacity/drafts), recent events, sales summary
- [x] **Analytics** — `analytics/page.tsx`: revenue, tickets sold, orders, status breakdown, top events
- [x] **Events list** — `events/page.tsx`: list/grid view, search, tab filtering, duplicate, delete
- [x] **Create event** — `events/new/page.tsx`: full form + Yup validation, cover upload, categories, draft/publish
- [x] **Edit event** — `events/[id]/edit/page.tsx`: pre-populated form, image upload, update, dirty-state warning, SEO fields
- [x] **Event sub-nav** — `events/[id]/layout.tsx`: single-event fetch, tabbed sub-routes, public link
- [x] **Attendees / check-in** — `events/[id]/attendees/page.tsx`: list + pagination, search/filter, check-in mutation, CSV export
- [x] **Orders** — `events/[id]/orders/page.tsx`: orders list, stats (revenue/sold/paid/pending), search/filter, pagination
- [x] **Ticket types** — `events/[id]/tickets/page.tsx`: create/edit/delete, inventory bar, visibility, min/max constraints
- [x] **Promo codes** — `events/[id]/promo-codes/page.tsx`: create/edit/delete, toggle active, copy, usage tracking, validity windows
- [x] **Event settings** — `events/[id]/settings/page.tsx`: status management (publish/unpublish/cancel/reactivate), duplicate, delete
- [x] **Org settings** — `organizer/settings/page.tsx`: edit name/description/primary type, member list, delete org

## Current Version

Payments are still stubbed, so **Payouts are deferred** to
[`ORGANIZER_TASKS_NEXT.md`](./ORGANIZER_TASKS_NEXT.md). Refunds in this version are
state-only (record + status change + inventory restock), no gateway transfer.

### Quick wins (data already available via existing endpoints)

- [x] **Wire revenue on event overview** — `events/[id]/page.tsx`: net revenue
      (`useGetEventOrdersStatsQuery` → `revenue − refunded`).
- [x] **Wire attendee + revenue counts on events list** — `events/page.tsx`: per-row sold-tickets +
      revenue from `useGetOrganizationRevenueQuery().perEvent`.

### Refunds

- [x] **Issue refunds (full + partial)** — `POST /events/:eventId/orders/:orderId/refund`
      (`refundOrder` in `orders.service.ts`, OWNER/ADMIN). Full refund → order/tickets/payment
      `REFUNDED` + inventory released; partial → Refund record only, nets out of stats revenue.
      UI: "Rembourser" action + amount/reason dialog on the orders page (`useRefundOrderMutation`).

### QR Scan & Check-in

- [x] **QR scanner mode** — camera scan dialog (`_components/ScanCheckInDialog.tsx`,
      `@yudiel/react-qr-scanner`) → `POST /tickets/check-in/by-qr` (`checkInByQr` resolves the
      `qrCode` token, returns `alreadyCheckedIn`). Shows validé / déjà scanné / introuvable.
- [x] **Check-in by phone** — attendee `q` search now matches `holderPhone` (backend), search
      placeholder updated; check in via the existing per-row action.
- [x] **Undo check-in** — already supported by the existing toggle (`checkedIn: false`).
- [ ] **Bulk check-in** — multi-select check-in (not yet implemented).

### Attendee Management

- [x] **Organizer can add an attendee** — `POST /events/:eventId/attendees` (`createCompAttendee`,
      OWNER/ADMIN/EDITOR) creates a zero-amount `PAID` order (`paymentMethod "COMP"`) with `VALID`
      tickets. UI: "Ajouter" form sheet (`_form/AddAttendeeSheet.tsx`, `useAddAttendeeMutation`).
