# Organizer Dashboard — Next Version Backlog

Features deferred to a future release. Current-version tasks live in
[`ORGANIZER_TASKS.md`](./ORGANIZER_TASKS.md).

## Payouts

Blocked on real payment collection — online payments are currently stubbed
(orders are auto-confirmed as `PAID` with no gateway), so there are no real funds to pay out.

- [ ] **Payout account settings** — bank / mobile-money (Wave, Orange Money) destination. New model + API + UI.
- [ ] **Payout history & settlement** — paid-out vs. pending amounts per event/period.
- [ ] **Fee breakdown / net display** — platform fee vs. net payable (fees are already tracked per order
      in the backend; needs a payable/settlement view).
- [ ] **Balance ledger + real transfers** — Wave/Orange Money payout API integration once collection is live.

## Team & Access

- [ ] **Event-level team invitations** — `events/[id]/settings/page.tsx:300` invite button is a toast stub
      ("Invitations d'équipe bientôt disponibles"). Needs invite flow + API.
- [ ] **Org-level member invitations** — `organizer/settings/page.tsx:414` invite button is a toast stub
      ("Invitations bientôt disponibles"). Members are view/list only.
- [ ] **Member role management** — org settings lists roles (OWNER/ADMIN/EDITOR/VIEWER/STAFF) read-only;
      no UI to change a member's role or remove a member.

## Attendee Communication

- [ ] **Email / SMS attendees** — announcements, reminders, "event updated/cancelled" notices.
- [ ] **Resend tickets** — re-send tickets to a buyer.

## Analytics Depth

- [ ] **Sales-over-time charts** — time-series, not just totals/breakdowns.
- [ ] **Conversion funnel / traffic sources** — views → cart → purchase.
- [ ] **Downloadable reports** — sales report (PDF/Excel). Only attendee CSV export exists today.

## Event Capabilities

- [ ] **Recurring / multi-session events** — event model is single-date today.
- [ ] **Reserved seating / seat maps**.
- [ ] **Waitlist** for sold-out tickets.
- [ ] **Event branding / customization** beyond SEO meta fields.

## Check-in

- [ ] **Bulk check-in** — multi-select check-in. (QR scan, phone lookup, and undo shipped in the current version.)

## Orders

- [ ] **Order detail view** — drill-in from the orders list (`useGetOrderQuery` / `/visitor/orders/:id` exists, no UI).
