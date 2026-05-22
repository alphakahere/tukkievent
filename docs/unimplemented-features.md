# Unimplemented / Unhandled Features Audit

> Generated: 2026-05-21  
> Scope: `src/app/(attendee)/` and `src/app/organizer/`

---

## 👤 Attendee Routes

### `/profile`

| # | Issue | Type |
|---|---|---|
| 1 | **"Aide & Support"** menu → `/support` (route doesn't exist → 404) | Dead link |
| 2 | **"Conditions d'utilisation"** → `/terms` (doesn't exist → 404) | Dead link |
| 3 | **"Confidentialité"** → `/privacy` (doesn't exist → 404) | Dead link |
| 4 | **Version / Langue / Thème** always hardcoded ("1.0.0", "Français", "Clair") | Fake data |

### `/profile/edit`

| # | Issue | Type |
|---|---|---|
| 5 | **Avatar upload button** → just fires a toast ("bientôt disponible") | Stub |
| 6 | **"Supprimer mon compte"** → just fires an error toast, no dialog or API | Stub |

### `/settings`

| # | Issue | Type |
|---|---|---|
| 7 | **"Supprimer mon compte"** button has no `onClick` at all — completely inert | No-op |
| 8 | **SMS notification toggle** — marked in context as "UI-only, no backend support" | Fake feature |
| 9 | **Dark mode toggle** — writes `dark` class to `<html>` but no Tailwind dark variants used anywhere, so visually does nothing | Broken |

### `/payment-methods`

| # | Issue | Type |
|---|---|---|
| 10 | **Entire feature** (add/remove payment methods) is `localStorage`-only — no API | No API |
| 11 | **"Transactions récentes"** reads from `OrdersContext` (also `localStorage`-only mock data) | Mock data |

### `/notifications`

| # | Issue | Type |
|---|---|---|
| 12 | **Dismiss (×) button** only calls `markAsRead()` — notification reappears on reload; comment says "No backend dismiss yet" | Broken |

### `/history/[orderId]`

| # | Issue | Type |
|---|---|---|
| 13 | **"Télécharger le reçu"** button → toast only ("bientôt disponible") | Stub |
| 14 | **Ticket names in breakdown** display the raw `ticketTypeId` UUID instead of resolved name | Data bug |

### `/tickets/[id]`

| # | Issue | Type |
|---|---|---|
| 15 | **"Télécharger"** (download ticket) button → toast only ("bientôt disponible") | Stub |

---

## 🏢 Organizer Routes

### `/organizer/events` (list)

| # | Issue | Type |
|---|---|---|
| 16 | **"Participants"** column always hardcoded to `0` | Hardcoded |
| 17 | **"Revenu"** column always hardcoded to `0 F` | Hardcoded |

### `/organizer/events/[id]` (overview)

| # | Issue | Type |
|---|---|---|
| 18 | **"Revenu" stat card** always shows `0 F` — no API call unlike dashboard/analytics pages | Hardcoded |

### `/organizer/events/[id]/settings`

| # | Issue | Type |
|---|---|---|
| 19 | **"Inviter" (team)** button → toast only; UI even displays "bientôt possible" copy | Stub |

### `/organizer/settings`

| # | Issue | Type |
|---|---|---|
| 20 | **"Inviter" (members)** button → toast only; same "bientôt possible" footer copy | Stub |
| 21 | **Org slug field** is read-only with `disabled`/`readOnly` — no mechanism to ever change it | Missing feature |

### Organizer Layout (shared)

| # | Issue | Type |
|---|---|---|
| 22 | **Global search bar** (top bar) — no `onChange`, no state, no logic — purely cosmetic | Cosmetic |
| 23 | **"Aide & Support"** in profile dropdown → `/support` (doesn't exist → 404) | Dead link |

---

## Summary by Type

| Type | Count |
|------|-------|
| 🔴 Stub (toast only) | 7 |
| 🟠 No API (localStorage-only) | 3 |
| 🟡 Hardcoded / fake data | 5 |
| 🔵 Dead link (404) | 4 |
| ⚪ Broken / cosmetic | 4 |

**23 items total.**

### Highest Impact Gaps
- Ticket & receipt PDF downloads (#13, #15)
- Team / member invitations (#19, #20)
- Payment methods persistence to API (#10)
- Organizer event stats — revenue & participants (#16, #17, #18)
- Account deletion flow (#6, #7)
