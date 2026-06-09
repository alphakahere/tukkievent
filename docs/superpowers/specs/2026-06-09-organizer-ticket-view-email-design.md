# Organizer ticket view + email delivery — design

**Date:** 2026-06-09
**Branch:** feat/organizer-refunds-checkin-attendees
**Scope:** Frontend only (this repo). QR generation, email sending, and the queue live in a
separate backend service.

## Goal

When an organizer adds an attendee, let them optionally have the ticket emailed (queued by the
backend), and let them view the issued ticket — QR code, ticket number, holder, status — from the
attendees page, with options to download a full PDF, resend the email, and share via WhatsApp.

## Context / current state

- This is the Next.js frontend. There is **no backend** here (no email/queue/QR-gen libraries).
  `qrcode.react` is installed for rendering only.
- The backend already issues QR codes: the `Attendee` object returned by
  `GET /events/:eventId/attendees` includes `qrCode`, `ticketNumber`, holder fields, `status`,
  `ticketType`, and `order`. **Viewing a ticket needs no new fetch** — the list row already has the data.
- An attendee-facing ticket view exists at `src/app/(attendee)/tickets/[id]/page.tsx` using
  `QRCodeCanvas` + `downloadTicketsPdf`. We mirror its look for the organizer.
- The attendees page (`src/app/organizer/events/[id]/attendees/page.tsx`) lists attendees and shows
  holder name/email/phone. Add (`_form/AddAttendeeSheet.tsx`) and scan (`_components/`) already exist.

## Assumed backend contracts (to-be-built; frontend codes against these)

1. **Send email on add** — extend existing `POST /events/:eventId/attendees`:
   - Request body gains `sendEmail?: boolean`.
   - When `true`, backend generates the QR (already does) and enqueues the ticket email to the
     holder's address. `email` must be present in the request.
   - Response unchanged (`AddAttendeeResult`).

2. **Resend ticket email** — NEW, treated as not-yet-implemented:
   - `POST /tickets/:ticketId/resend-email`
   - Empty body. Returns `202 Accepted` with `{ queued: true }`.
   - Enqueues a fresh ticket email to the holder. 4xx if the ticket has no email on file.

The frontend ships the mutation against this shape now; backend follows.

## Components & changes

### 1. Types — `src/store/api/tickets/tickets.type.ts`
- `AddAttendeePayload`: add `sendEmail?: boolean`.
- New `ResendTicketEmailPayload { eventId: string; ticketId: string }` (`eventId` carried only for
  cache-tag invalidation).
- New `ResendTicketEmailResult { queued: boolean }`.

### 2. API — `src/store/api/tickets/tickets.api.ts`
- `addAttendee`: no code change needed — it already spreads `...body`, so `sendEmail` passes through
  once it's on the payload type.
- New `resendTicketEmail` mutation → `POST /tickets/:ticketId/resend-email`. No tag invalidation
  (there's no email-status field on `Attendee` to refresh).
- Export `useResendTicketEmailMutation`.

### 3. Add-attendee schema — `_form/schema.ts`
- Add `sendEmail: yup.boolean().default(false)`.
- Make `email` conditionally required:
  `.when("sendEmail", { is: true, then: (s) => s.required("L'email est requis pour envoyer le billet") })`.

### 4. Add-attendee sheet — `_form/AddAttendeeSheet.tsx`
- Add a `Controller`-wrapped `Checkbox`: **"Envoyer le billet par email au participant"**, placed
  under the email field. Helper text clarifies email is required when checked.
- Include `sendEmail` in the `addAttendee` call and in `EMPTY_DEFAULTS`.

### 5. View Ticket sheet — `_components/ViewTicketSheet.tsx` (new)
- Props: `open`, `onOpenChange`, `attendee: Attendee | null`, `event` (from page, for PDF + WhatsApp).
- Body mirrors the attendee ticket card: `QRCodeCanvas` (with a `ref` to read the PNG), ticket
  number, holder name/email/phone, status badge, ticket-type name. Graceful "QR en attente" when
  `qrCode` is null.
- Footer actions:
  - **Télécharger le billet (PDF)** — calls `downloadAttendeeTicketPdf(event, attendee, qrPng)`.
  - **Renvoyer le billet** — `resendTicketEmail`; toast "Billet envoyé par email"; disabled when
    `holderEmail` is null.
  - **Partager via WhatsApp** — opens `https://wa.me/<digits>?text=<encoded message>`; disabled when
    `holderPhone` is null. Phone is sanitized to digits (strip `+`, spaces, punctuation). Message:
    event title + ticket number + link to `/<origin>/tickets/<attendee.order.id>`.

### 6. Attendees page — `page.tsx`
- New state: `viewAttendee: Attendee | null`.
- Open the sheet from a row click and/or a "Voir le billet" affordance. Keep existing Check-in
  button working (stop propagation so clicking it doesn't also open the sheet).
- Render `<ViewTicketSheet open={!!viewAttendee} attendee={viewAttendee} event={event} ... />`.

### 7. PDF — `src/lib/pdf.ts`
- Add `downloadAttendeeTicketPdf(event, attendee, qrImage?)`, reusing existing helpers
  (`drawHeader`, `sectionTitle`, `divider`, `row`). One page: event header, centered QR (or
  "QR code en attente"), ticket number, holder, status, ticket type. Saves
  `billet-<ticketNumber|id>.pdf`. No change to existing exports.

## Data flow

1. Organizer opens Add sheet → optionally ticks "Envoyer par email" (email becomes required) →
   submit → backend issues QR + enqueues email → list refetches (existing tag invalidation).
2. Organizer clicks a row → View Ticket sheet renders the QR from the already-loaded `Attendee`.
3. From the sheet: download PDF (client-side jsPDF), resend email (queued by backend), or share via
   WhatsApp (client-side `wa.me` deep link).

## Error handling

- Add/resend mutation errors surface via `getApiErrorMessage` + `toast.error` (existing pattern).
- Resend disabled without `holderEmail`; WhatsApp disabled without `holderPhone`.
- Null `qrCode` → "QR en attente" placeholder; PDF/WhatsApp still work with ticket number.
- Tainted-canvas guard around `canvas.toDataURL` (mirrors attendee page) so PDF degrades gracefully.

## Testing

No test framework configured. Manual verification:
- Add with checkbox off → no email expectation; with checkbox on but blank email → French
  validation error.
- Open sheet for an attendee with/without QR, with/without email, with/without phone → correct
  enabled/disabled states.
- PDF downloads and contains the QR; WhatsApp link opens with prefilled text.

## Out of scope / follow-ups

- Backend implementation of `sendEmail` handling and the resend endpoint.
- Per-attendee "email sent / delivered" status indicator (no field exists yet).
- Bulk resend / bulk email.
