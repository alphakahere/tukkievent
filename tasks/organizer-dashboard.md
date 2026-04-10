# Task: Build Organizer Dashboard

**Status**: pending  
**Created**: 2026-04-10

## Overview

Create the full organizer dashboard section at `/organizer`. The profile page already links to `/organizer/dashboard` but the route doesn't exist yet. The `Organization` type (`id`, `name`, `slug`, `description`, `logoUrl`, `websiteUrl`) is defined in `src/store/api/event/event.type.ts`.

## Routes to create

| Route | Description |
|---|---|
| `/organizer/dashboard` | Overview / home |
| `/organizer/events` | List of organizer's events |
| `/organizer/events/new` | Create new event (multi-step form) |
| `/organizer/events/[id]/edit` | Edit existing event |
| `/organizer/events/[id]/attendees` | Attendee list + check-in |
| `/organizer/analytics` | Revenue + ticket sales charts |
| `/organizer/settings` | Organization profile settings |

## Screen details

### Dashboard (`/organizer/dashboard`)
- Header: org logo, name, "Tableau de bord" title
- KPI cards row: total events, total tickets sold, total revenue (FCFA), upcoming events count
- Quick actions: Create event, View events, View analytics
- Recent events list (last 3–5) with status badges (Publié / Brouillon / Terminé)
- Recent orders/sales feed (last 5 ticket purchases)

### Events list (`/organizer/events`)
- Tabs: Tous / À venir / Terminés / Brouillons
- Event rows: cover thumbnail, title, date, city, tickets sold / capacity, status badge, actions (Edit, View attendees, Delete)
- FAB / top button: "+ Créer un événement"

### Create / Edit event form (`/organizer/events/new` and `/[id]/edit`)
Multi-step form using React Hook Form + Yup (already in project):
1. **Informations générales** — title, description, category, online/offline toggle, city, address
2. **Date & heure** — startDatetime, endDatetime
3. **Billets** — dynamic list of ticket types (name, price, quantity, min/max purchase)
4. **Médias** — cover image URL, thumbnail URL
5. **Résumé & publication** — review all fields, Brouillon / Publier toggle

### Attendees (`/organizer/events/[id]/attendees`)
- Search bar by name / email / ticket number
- Table: ticket number, holder name, email, ticket type, status badge (Valide / Utilisé), check-in button
- Check-in toggles status Valide → Utilisé
- Export CSV button (placeholder)

### Analytics (`/organizer/analytics`)
- Revenue over time — bar chart, last 6 months
- Tickets sold by type — pie/donut chart
- Top events by revenue
- Conversion funnel: views → checkout started → completed
- Add **recharts** as dependency (lightweight, React-native)

### Organization settings (`/organizer/settings`)
- Edit org name, description, logo URL, website URL
- Danger zone: delete organization

## Layout

- Dedicated `/organizer` layout with **left sidebar nav** on desktop (Dashboard, Événements, Analytiques, Paramètres)
- Mobile: organizer-specific bottom tabs (replaces global BottomNav inside the organizer section)
- Breadcrumb on all sub-pages

## State / Data

- `OrganizerContext` (localStorage for now, API-ready interface) holding: current org, org events, org orders
- Mock data: 3–4 sample org events with ticket sales numbers
- All forms submit to mock handlers with `toast` feedback until API is ready
