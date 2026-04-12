"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  AdminUser,
  AdminOrganizer,
  AdminEvent,
  AdminOrder,
  AdminCategory,
  AdminReport,
  AdminKpis,
  AdminActivity,
  AdminPlatformSettings,
  UserStatus,
  EventAdminStatus,
  ReportStatus,
} from "@/store/api/admin/admin.type";

// ── Mock Data ────────────────────────────────────────────────────────────────

const now = new Date();
const ago = (days: number) => new Date(now.getTime() - days * 86400000).toISOString();

const mockUsers: AdminUser[] = [
  { id: "u-1", firstName: "Fatou", lastName: "Sow", email: "fatou.sow@email.com", phone: "+221 77 123 4567", status: "ACTIVE", isOrganizer: false, createdAt: ago(30), ordersCount: 5, totalSpent: 75000 },
  { id: "u-2", firstName: "Moussa", lastName: "Diop", email: "moussa.diop@email.com", phone: "+221 76 234 5678", status: "ACTIVE", isOrganizer: true, createdAt: ago(60), ordersCount: 12, totalSpent: 180000 },
  { id: "u-3", firstName: "Awa", lastName: "Ndiaye", email: "awa.ndiaye@email.com", phone: "+221 70 345 6789", status: "ACTIVE", isOrganizer: false, createdAt: ago(15), ordersCount: 3, totalSpent: 45000 },
  { id: "u-4", firstName: "Ibrahim", lastName: "Fall", email: "ibrahim.fall@email.com", phone: "+221 75 456 7890", status: "SUSPENDED", isOrganizer: false, createdAt: ago(90), ordersCount: 8, totalSpent: 120000 },
  { id: "u-5", firstName: "Aminata", lastName: "Ba", email: "aminata.ba@email.com", phone: "+221 77 567 8901", status: "ACTIVE", isOrganizer: false, createdAt: ago(5), ordersCount: 1, totalSpent: 15000 },
  { id: "u-6", firstName: "Cheikh", lastName: "Mbaye", email: "cheikh.mbaye@email.com", phone: "+221 76 678 9012", status: "BANNED", isOrganizer: false, createdAt: ago(120), ordersCount: 2, totalSpent: 10000 },
  { id: "u-7", firstName: "Mariama", lastName: "Diallo", email: "mariama.diallo@email.com", status: "ACTIVE", isOrganizer: false, createdAt: ago(7), ordersCount: 4, totalSpent: 60000 },
  { id: "u-8", firstName: "Ousmane", lastName: "Sarr", email: "ousmane.sarr@email.com", status: "ACTIVE", isOrganizer: true, createdAt: ago(45), ordersCount: 7, totalSpent: 105000 },
];

const mockOrganizers: AdminOrganizer[] = [
  { id: "org-1", name: "Tukki Events", slug: "tukki-events", email: "contact@tukkiapp.com", phone: "+221 33 123 4567", status: "ACTIVE", eventsCount: 8, totalRevenue: 2850000, createdAt: ago(180), verified: true },
  { id: "org-2", name: "Dakar Live", slug: "dakar-live", email: "info@dakarlive.sn", phone: "+221 77 234 5678", status: "ACTIVE", eventsCount: 5, totalRevenue: 1200000, createdAt: ago(90), verified: true },
  { id: "org-3", name: "Festival Sahel", slug: "festival-sahel", email: "hello@festivalsahel.com", status: "ACTIVE", eventsCount: 2, totalRevenue: 450000, createdAt: ago(30), verified: false },
  { id: "org-4", name: "Saint-Louis Events", slug: "saint-louis-events", email: "contact@sl-events.sn", status: "SUSPENDED", eventsCount: 3, totalRevenue: 680000, createdAt: ago(60), verified: true },
  { id: "org-5", name: "Abidjan Connect", slug: "abidjan-connect", email: "info@abjconnect.ci", status: "ACTIVE", eventsCount: 4, totalRevenue: 920000, createdAt: ago(45), verified: false },
];

const mockEvents: AdminEvent[] = [
  { id: "ev-1", slug: "festival-mbalakh-2025", title: "Festival Mbalakh 2025", coverImageUrl: "https://picsum.photos/seed/ev1/400/250", startDatetime: new Date(now.getTime() + 7 * 86400000).toISOString(), city: "Dakar", organizerName: "Tukki Events", category: "Festival", status: "APPROVED", ticketsSold: 365, revenue: 2275000, createdAt: ago(10) },
  { id: "ev-2", slug: "concert-ndongo-darou", title: "Concert Ndongo Darou", coverImageUrl: "https://picsum.photos/seed/ev2/400/250", startDatetime: new Date(now.getTime() + 14 * 86400000).toISOString(), city: "Saint-Louis", organizerName: "Dakar Live", category: "Concert", status: "APPROVED", ticketsSold: 205, revenue: 790000, createdAt: ago(8) },
  { id: "ev-3", slug: "gala-excellence", title: "Gala de l'Excellence", coverImageUrl: "https://picsum.photos/seed/ev3/400/250", startDatetime: new Date(now.getTime() + 21 * 86400000).toISOString(), city: "Dakar", organizerName: "Festival Sahel", category: "Art", status: "PENDING", ticketsSold: 0, revenue: 0, createdAt: ago(1) },
  { id: "ev-4", slug: "forum-tech-dakar", title: "Forum Tech Dakar 2025", coverImageUrl: "https://picsum.photos/seed/ev4/400/250", startDatetime: new Date(now.getTime() + 30 * 86400000).toISOString(), city: "Dakar", organizerName: "Abidjan Connect", category: "Conférence", status: "PENDING", ticketsSold: 0, revenue: 0, createdAt: ago(2) },
  { id: "ev-5", slug: "soiree-afrobeats", title: "Soirée Afrobeats", coverImageUrl: "https://picsum.photos/seed/ev5/400/250", startDatetime: new Date(now.getTime() - 7 * 86400000).toISOString(), city: "Abidjan", organizerName: "Abidjan Connect", category: "Concert", status: "APPROVED", ticketsSold: 480, revenue: 3600000, createdAt: ago(30) },
  { id: "ev-6", slug: "hackathon-dakar", title: "Hackathon Dakar", coverImageUrl: "https://picsum.photos/seed/ev6/400/250", startDatetime: new Date(now.getTime() + 5 * 86400000).toISOString(), city: "Dakar", organizerName: "Saint-Louis Events", category: "Tech", status: "REJECTED", ticketsSold: 0, revenue: 0, createdAt: ago(5) },
];

const mockOrders: AdminOrder[] = [
  { id: "ord-1", eventTitle: "Festival Mbalakh 2025", buyerName: "Fatou Sow", buyerEmail: "fatou.sow@email.com", total: 30000, status: "COMPLETED", paymentMethod: "Wave", createdAt: ago(0.1), ticketsCount: 2 },
  { id: "ord-2", eventTitle: "Festival Mbalakh 2025", buyerName: "Moussa Diop", buyerEmail: "moussa.diop@email.com", total: 20000, status: "COMPLETED", paymentMethod: "Orange Money", createdAt: ago(0.3), ticketsCount: 4 },
  { id: "ord-3", eventTitle: "Concert Ndongo Darou", buyerName: "Awa Ndiaye", buyerEmail: "awa.ndiaye@email.com", total: 10000, status: "COMPLETED", paymentMethod: "Wave", createdAt: ago(1), ticketsCount: 1 },
  { id: "ord-4", eventTitle: "Soirée Afrobeats", buyerName: "Ibrahim Fall", buyerEmail: "ibrahim.fall@email.com", total: 25000, status: "REFUNDED", paymentMethod: "PayPal", createdAt: ago(3), ticketsCount: 1 },
  { id: "ord-5", eventTitle: "Concert Ndongo Darou", buyerName: "Aminata Ba", buyerEmail: "aminata.ba@email.com", total: 9000, status: "COMPLETED", paymentMethod: "Orange Money", createdAt: ago(2), ticketsCount: 3 },
  { id: "ord-6", eventTitle: "Forum Tech Dakar 2025", buyerName: "Cheikh Mbaye", buyerEmail: "cheikh.mbaye@email.com", total: 5000, status: "PENDING", paymentMethod: "Wave", createdAt: ago(0.5), ticketsCount: 1 },
  { id: "ord-7", eventTitle: "Festival Mbalakh 2025", buyerName: "Mariama Diallo", buyerEmail: "mariama.diallo@email.com", total: 15000, status: "COMPLETED", paymentMethod: "Wave", createdAt: ago(1.5), ticketsCount: 3 },
  { id: "ord-8", eventTitle: "Soirée Afrobeats", buyerName: "Ousmane Sarr", buyerEmail: "ousmane.sarr@email.com", total: 50000, status: "COMPLETED", paymentMethod: "Carte bancaire", createdAt: ago(7), ticketsCount: 5 },
];

const mockCategories: AdminCategory[] = [
  { id: "cat-1", name: "Concert", slug: "concert", eventsCount: 12, createdAt: ago(365) },
  { id: "cat-2", name: "Festival", slug: "festival", eventsCount: 8, createdAt: ago(365) },
  { id: "cat-3", name: "Conférence", slug: "conference", eventsCount: 6, createdAt: ago(300) },
  { id: "cat-4", name: "Art & Culture", slug: "art-culture", eventsCount: 5, createdAt: ago(300) },
  { id: "cat-5", name: "Sport", slug: "sport", eventsCount: 4, createdAt: ago(200) },
  { id: "cat-6", name: "Gastronomie", slug: "gastronomie", eventsCount: 3, createdAt: ago(150) },
  { id: "cat-7", name: "Tech", slug: "tech", eventsCount: 4, createdAt: ago(200) },
  { id: "cat-8", name: "Mode", slug: "mode", eventsCount: 2, createdAt: ago(100) },
];

const mockReports: AdminReport[] = [
  { id: "rep-1", reason: "FRAUD", description: "Les billets vendus semblent être faux. Plusieurs acheteurs ont signalé des problèmes à l'entrée.", status: "OPEN", reporterName: "Fatou Sow", targetType: "EVENT", targetId: "ev-5", targetName: "Soirée Afrobeats", createdAt: ago(0.5) },
  { id: "rep-2", reason: "SPAM", description: "Cet utilisateur envoie des messages non sollicités à d'autres participants.", status: "OPEN", reporterName: "Moussa Diop", targetType: "USER", targetId: "u-6", targetName: "Cheikh Mbaye", createdAt: ago(1) },
  { id: "rep-3", reason: "INAPPROPRIATE", description: "Le contenu de l'événement ne respecte pas les conditions d'utilisation.", status: "RESOLVED", reporterName: "Awa Ndiaye", targetType: "EVENT", targetId: "ev-6", targetName: "Hackathon Dakar", createdAt: ago(5) },
  { id: "rep-4", reason: "FRAUD", description: "Organisateur qui prend des paiements sans jamais organiser les événements.", status: "OPEN", reporterName: "Ibrahim Fall", targetType: "ORGANIZER", targetId: "org-4", targetName: "Saint-Louis Events", createdAt: ago(2) },
  { id: "rep-5", reason: "OTHER", description: "Informations incorrectes sur l'événement (lieu différent de ce qui est indiqué).", status: "DISMISSED", reporterName: "Aminata Ba", targetType: "EVENT", targetId: "ev-1", targetName: "Festival Mbalakh 2025", createdAt: ago(10) },
];

const mockActivity: AdminActivity[] = [
  { id: "act-1", type: "USER_REGISTERED", description: "Aminata Ba vient de s'inscrire", createdAt: ago(0.1) },
  { id: "act-2", type: "ORDER_PLACED", description: "Nouvelle commande #ord-1 — 30 000 FCFA", createdAt: ago(0.2) },
  { id: "act-3", type: "EVENT_CREATED", description: "Nouvel événement soumis : «Forum Tech Dakar 2025»", createdAt: ago(0.5) },
  { id: "act-4", type: "REPORT_SUBMITTED", description: "Signalement reçu sur «Soirée Afrobeats»", createdAt: ago(0.5) },
  { id: "act-5", type: "EVENT_APPROVED", description: "«Concert Ndongo Darou» approuvé", createdAt: ago(1) },
  { id: "act-6", type: "USER_REGISTERED", description: "Mariama Diallo vient de s'inscrire", createdAt: ago(1) },
  { id: "act-7", type: "ORDER_PLACED", description: "Nouvelle commande #ord-3 — 10 000 FCFA", createdAt: ago(1) },
  { id: "act-8", type: "EVENT_CREATED", description: "Nouvel événement soumis : «Gala de l'Excellence»", createdAt: ago(1) },
];

const mockKpis: AdminKpis = {
  totalUsers: 1248,
  totalOrganizers: 38,
  totalEvents: 94,
  totalOrders: 3762,
  totalRevenue: 47850000,
  pendingEvents: 2,
  openReports: 3,
  newUsersThisMonth: 127,
};

const mockSettings: AdminPlatformSettings = {
  siteName: "TukkiEvent",
  supportEmail: "support@tukkiapp.com",
  supportPhone: "+221 33 800 0000",
  commissionRate: 5,
  maintenanceMode: false,
  allowNewOrganizers: true,
  requireEventApproval: true,
};

// ── Context ──────────────────────────────────────────────────────────────────

type AdminContextValue = {
  kpis: AdminKpis;
  users: AdminUser[];
  organizers: AdminOrganizer[];
  events: AdminEvent[];
  orders: AdminOrder[];
  categories: AdminCategory[];
  reports: AdminReport[];
  activity: AdminActivity[];
  settings: AdminPlatformSettings;
  updateUserStatus: (userId: string, status: UserStatus) => void;
  updateOrganizerStatus: (orgId: string, status: UserStatus) => void;
  updateEventStatus: (eventId: string, status: EventAdminStatus) => void;
  updateReportStatus: (reportId: string, status: ReportStatus) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  updateSettings: (patch: Partial<AdminPlatformSettings>) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [organizers, setOrganizers] = useState<AdminOrganizer[]>(mockOrganizers);
  const [events, setEvents] = useState<AdminEvent[]>(mockEvents);
  const [reports, setReports] = useState<AdminReport[]>(mockReports);
  const [categories, setCategories] = useState<AdminCategory[]>(mockCategories);
  const [settings, setSettings] = useState<AdminPlatformSettings>(mockSettings);

  const updateUserStatus = useCallback((userId: string, status: UserStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
  }, []);

  const updateOrganizerStatus = useCallback((orgId: string, status: UserStatus) => {
    setOrganizers((prev) => prev.map((o) => (o.id === orgId ? { ...o, status } : o)));
  }, []);

  const updateEventStatus = useCallback((eventId: string, status: EventAdminStatus) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status } : e)));
  }, []);

  const updateReportStatus = useCallback((reportId: string, status: ReportStatus) => {
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status } : r)));
  }, []);

  const addCategory = useCallback((name: string) => {
    const newCat: AdminCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      eventsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCat]);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateSettings = useCallback((patch: Partial<AdminPlatformSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <AdminContext.Provider
      value={{
        kpis: mockKpis,
        users,
        organizers,
        events,
        orders: mockOrders,
        categories,
        reports,
        activity: mockActivity,
        settings,
        updateUserStatus,
        updateOrganizerStatus,
        updateEventStatus,
        updateReportStatus,
        addCategory,
        deleteCategory,
        updateSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
