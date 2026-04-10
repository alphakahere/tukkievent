"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Event, Organization, TicketType } from "@/store/api/event/event.type";

const STORAGE_KEY = "tukki-event-organizer";

export type OrgEventStatus = "PUBLISHED" | "DRAFT" | "ENDED";

export interface OrgTicketSales {
  ticketTypeId: string;
  name: string;
  price: number;
  sold: number;
  total: number;
}

export interface OrgEvent {
  event: Event;
  status: OrgEventStatus;
  ticketSales: OrgTicketSales[];
  totalRevenue: number;
  totalSold: number;
}

export interface OrgOrder {
  id: string;
  eventId: string;
  eventTitle: string;
  buyerName: string;
  buyerEmail: string;
  ticketType: string;
  quantity: number;
  total: number;
  createdAt: string;
}

export interface Attendee {
  id: string;
  ticketNumber: string;
  holderName: string;
  email: string;
  ticketType: string;
  status: "valid" | "used";
  checkedInAt?: string;
}

interface OrganizerState {
  organization: Organization;
  events: OrgEvent[];
  recentOrders: OrgOrder[];
}

type OrganizerContextValue = {
  org: Organization;
  events: OrgEvent[];
  recentOrders: OrgOrder[];
  getEventById: (id: string) => OrgEvent | undefined;
  getAttendees: (eventId: string) => Attendee[];
  checkInAttendee: (eventId: string, attendeeId: string) => void;
  totalRevenue: number;
  totalTicketsSold: number;
  upcomingCount: number;
};

const OrganizerContext = createContext<OrganizerContextValue | null>(null);

const now = new Date();
const inOneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
const inTwoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

const mockOrg: Organization = {
  id: "org-1",
  name: "Tukki Events",
  slug: "tukki-events",
  description: "Organisateur d'événements à Dakar",
  logoUrl: "/images/hero.jpg",
  websiteUrl: "https://tukkiapp.com",
};

function makeEvent(id: string, title: string, date: Date, status: OrgEventStatus, city: string, categoryName: string): Event {
  return {
    id,
    slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    title,
    description: `Description de ${title}`,
    startDatetime: date.toISOString(),
    endDatetime: new Date(date.getTime() + 4 * 60 * 60 * 1000).toISOString(),
    status,
    thumbnailUrl: `https://picsum.photos/seed/${id}/400/300`,
    coverImageUrl: `https://picsum.photos/seed/${id}/800/500`,
    isFeatured: false,
    isOnline: false,
    isPublished: status === "PUBLISHED",
    latitude: "14.7167",
    longitude: "-17.4677",
    city,
    address: city,
    capacity: 500,
    categoryId: "cat-1",
    organizationId: mockOrg.id,
    shortDescription: title,
    metaDescription: title,
    metaTitle: title,
    minAge: 0,
    onlineLink: "",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    organization: mockOrg,
    category: { id: "cat-1", name: categoryName, slug: categoryName.toLowerCase() },
    ticketTypes: [] as TicketType[],
    tickets: [],
  };
}

const defaultOrgEvents: OrgEvent[] = [
  {
    event: makeEvent("org-ev-1", "Festival Mbalakh 2025", inOneWeek, "PUBLISHED", "Dakar", "Festival"),
    status: "PUBLISHED",
    ticketSales: [
      { ticketTypeId: "tt-1", name: "Standard", price: 5000, sold: 320, total: 500 },
      { ticketTypeId: "tt-2", name: "VIP", price: 15000, sold: 45, total: 100 },
    ],
    totalRevenue: 320 * 5000 + 45 * 15000,
    totalSold: 365,
  },
  {
    event: makeEvent("org-ev-2", "Concert Ndongo Darou", inTwoWeeks, "PUBLISHED", "Saint-Louis", "Concert"),
    status: "PUBLISHED",
    ticketSales: [
      { ticketTypeId: "tt-3", name: "Entrée libre", price: 3000, sold: 180, total: 300 },
      { ticketTypeId: "tt-4", name: "VIP", price: 10000, sold: 25, total: 50 },
    ],
    totalRevenue: 180 * 3000 + 25 * 10000,
    totalSold: 205,
  },
  {
    event: makeEvent("org-ev-3", "Conférence Tech Dakar", lastWeek, "ENDED", "Dakar", "Conférence"),
    status: "ENDED",
    ticketSales: [
      { ticketTypeId: "tt-5", name: "Standard", price: 2000, sold: 150, total: 200 },
    ],
    totalRevenue: 150 * 2000,
    totalSold: 150,
  },
  {
    event: makeEvent("org-ev-4", "Gala de l'Excellence", inOneWeek, "DRAFT", "Dakar", "Art"),
    status: "DRAFT",
    ticketSales: [
      { ticketTypeId: "tt-6", name: "Table de 8", price: 50000, sold: 0, total: 20 },
    ],
    totalRevenue: 0,
    totalSold: 0,
  },
];

const defaultRecentOrders: OrgOrder[] = [
  { id: "ord-1", eventId: "org-ev-1", eventTitle: "Festival Mbalakh 2025", buyerName: "Fatou Sow", buyerEmail: "fatou@email.com", ticketType: "VIP", quantity: 2, total: 30000, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "ord-2", eventId: "org-ev-1", eventTitle: "Festival Mbalakh 2025", buyerName: "Moussa Diop", buyerEmail: "moussa@email.com", ticketType: "Standard", quantity: 4, total: 20000, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: "ord-3", eventId: "org-ev-2", eventTitle: "Concert Ndongo Darou", buyerName: "Awa Ndiaye", buyerEmail: "awa@email.com", ticketType: "VIP", quantity: 1, total: 10000, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: "ord-4", eventId: "org-ev-2", eventTitle: "Concert Ndongo Darou", buyerName: "Ibrahim Fall", buyerEmail: "ibrahim@email.com", ticketType: "Entrée libre", quantity: 3, total: 9000, createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
  { id: "ord-5", eventId: "org-ev-3", eventTitle: "Conférence Tech Dakar", buyerName: "Aminata Ba", buyerEmail: "aminata@email.com", ticketType: "Standard", quantity: 2, total: 4000, createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
];

function generateAttendees(orgEvent: OrgEvent): Attendee[] {
  const attendees: Attendee[] = [];
  const names = ["Fatou Sow", "Moussa Diop", "Awa Ndiaye", "Ibrahim Fall", "Aminata Ba", "Cheikh Mbaye", "Mariama Diallo", "Ousmane Sarr"];
  let idx = 0;
  for (const ts of orgEvent.ticketSales) {
    for (let i = 0; i < ts.sold && idx < 20; i++) {
      const name = names[idx % names.length];
      attendees.push({
        id: `att-${orgEvent.event.id}-${idx}`,
        ticketNumber: `TKK-${orgEvent.event.id.slice(-3)}-${String(idx + 1).padStart(3, "0")}`,
        holderName: name,
        email: `${name.split(" ")[0].toLowerCase()}${idx}@email.com`,
        ticketType: ts.name,
        status: idx < Math.floor(ts.sold * 0.3) ? "used" : "valid",
      });
      idx++;
    }
  }
  return attendees;
}

export function OrganizerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OrganizerState>({
    organization: mockOrg,
    events: defaultOrgEvents,
    recentOrders: defaultRecentOrders,
  });
  const [attendeesMap, setAttendeesMap] = useState<Record<string, Attendee[]>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.organization) {
          setState(parsed);
          setMounted(true);
          return;
        }
      }
    } catch { /* ignore */ }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [mounted, state]);

  const getEventById = useCallback(
    (id: string) => state.events.find((e) => e.event.id === id),
    [state.events]
  );

  const getAttendees = useCallback(
    (eventId: string) => {
      if (attendeesMap[eventId]) return attendeesMap[eventId];
      const orgEvent = state.events.find((e) => e.event.id === eventId);
      if (!orgEvent) return [];
      const att = generateAttendees(orgEvent);
      setAttendeesMap((prev) => ({ ...prev, [eventId]: att }));
      return att;
    },
    [state.events, attendeesMap]
  );

  const checkInAttendee = useCallback((eventId: string, attendeeId: string) => {
    setAttendeesMap((prev) => ({
      ...prev,
      [eventId]: (prev[eventId] || []).map((a) =>
        a.id === attendeeId ? { ...a, status: a.status === "used" ? "valid" : "used", checkedInAt: a.status === "valid" ? new Date().toISOString() : undefined } : a
      ),
    }));
  }, []);

  const totalRevenue = state.events.reduce((sum, e) => sum + e.totalRevenue, 0);
  const totalTicketsSold = state.events.reduce((sum, e) => sum + e.totalSold, 0);
  const upcomingCount = state.events.filter((e) => e.status === "PUBLISHED" && new Date(e.event.startDatetime) > new Date()).length;

  const value: OrganizerContextValue = {
    org: state.organization,
    events: state.events,
    recentOrders: state.recentOrders,
    getEventById,
    getAttendees,
    checkInAttendee,
    totalRevenue,
    totalTicketsSold,
    upcomingCount,
  };

  return <OrganizerContext.Provider value={value}>{children}</OrganizerContext.Provider>;
}

export function useOrganizer(): OrganizerContextValue {
  const ctx = useContext(OrganizerContext);
  if (!ctx) throw new Error("useOrganizer must be used within OrganizerProvider");
  return ctx;
}
