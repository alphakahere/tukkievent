"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  CalendarDays,
  Users,
  Clock,
  Plus,
  BarChart3,
  ChevronRight,
  Eye,
  FileEdit,
  Loader2,
  Ticket,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useOrganizerOrg } from "@/contexts/OrganizerOrgContext";
import { formatPrice } from "@/lib/utils";
import { useListEventsQuery } from "@/store/api/event/event.api";
import type { EventStatus } from "@/store/api/event/event.resource.type";
import { useGetOrganizationRevenueQuery } from "@/store/api/order/order.api";

const kpiIcons = [
  { icon: CalendarDays, color: "#FF6B35", bg: "#FFF1EC" },
  { icon: Clock, color: "#3B82F6", bg: "#EFF6FF" },
  { icon: Users, color: "#10B981", bg: "#ECFDF5" },
  { icon: FileEdit, color: "#F59E0B", bg: "#FFFBEB" },
];

const STATUS_LABELS: Record<EventStatus, string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publié",
  CANCELLED: "Annulé",
  COMPLETED: "Terminé",
  REJECTED: "Rejeté",
  SUSPENDED: "Suspendu",
};

const STATUS_STYLES: Record<EventStatus, string> = {
  DRAFT: "bg-amber-50 text-amber-700",
  PUBLISHED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  COMPLETED: "bg-gray-100 text-gray-500",
  REJECTED: "bg-red-50 text-red-700",
  SUSPENDED: "bg-red-50 text-red-700",
};

function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function OrganizerDashboardPage() {
  const { activeOrg, activeOrgId } = useOrganizerOrg();
  const { data, isLoading } = useListEventsQuery(
    activeOrgId ? { organizationId: activeOrgId, limit: 50 } : undefined,
    { skip: !activeOrgId },
  );
  const { data: revenue, isLoading: revenueLoading } =
    useGetOrganizationRevenueQuery(activeOrgId ?? "", { skip: !activeOrgId });

  const events = data?.data ?? [];
  const now = Date.now();
  const upcomingCount = events.filter(
    (e) => e.status === "PUBLISHED" && new Date(e.startDatetime).getTime() > now,
  ).length;
  const draftCount = events.filter((e) => e.status === "DRAFT").length;
  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);

  const kpis = [
    { label: "Événements", value: events.length.toString() },
    { label: "À venir", value: upcomingCount.toString() },
    { label: "Capacité totale", value: totalCapacity.toLocaleString() },
    { label: "Brouillons", value: draftCount.toString() },
  ];

  const recentEvents = [...events]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="p-5 md:p-8 space-y-8">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-0.5">{activeOrg?.name ?? "—"}</p>
        </div>
        <Link
          href="/organizer/events/new"
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus size={16} />
          Créer un événement
        </Link>
      </div>

      {/* KPIs */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => {
            const { icon: Icon, color, bg } = kpiIcons[i];
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl p-5 border border-gray-100"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: bg }}
                >
                  <Icon size={20} style={{ color }} strokeWidth={2} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">{kpi.label}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Quick actions */}
      <div className="flex gap-3 flex-wrap sm:hidden">
        <Link
          href="/organizer/events/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Créer un événement
        </Link>
        <Link
          href="/organizer/events"
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <Eye size={16} />
          Événements
        </Link>
        <Link
          href="/organizer/analytics"
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <BarChart3 size={16} />
          Analytiques
        </Link>
      </div>

      {/* Desktop secondary actions */}
      <div className="hidden sm:flex gap-3 flex-wrap">
        <Link
          href="/organizer/events"
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <Eye size={16} />
          Voir les événements
        </Link>
        <Link
          href="/organizer/analytics"
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <BarChart3 size={16} />
          Analytiques
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent events */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Événements récents</h2>
            <Link href="/organizer/events" className="text-sm text-primary font-semibold hover:underline">
              Tout voir
            </Link>
          </div>
          {recentEvents.length === 0 ? (
            <div className="p-10 text-center">
              <CalendarDays size={36} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">Aucun événement pour le moment</p>
            </div>
          ) : (
            <div>
              {recentEvents.map((event, idx) => {
                const eventDate = format(new Date(event.startDatetime), "d MMM yyyy", { locale: fr });
                return (
                  <Link
                    key={event.id}
                    href={`/organizer/events/${event.id}`}
                    className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${idx !== recentEvents.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <CalendarDays size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1">{event.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {eventDate}{event.city ? ` · ${event.city}` : ""}
                      </p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <StatusBadge status={event.status} />
                      <p className="text-xs text-gray-400">{event.capacity} places</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Sales summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Ventes</h2>
            <Link
              href="/organizer/analytics"
              className="text-sm text-primary font-semibold hover:underline"
            >
              Détails
            </Link>
          </div>
          {revenueLoading ? (
            <div className="p-10 text-center">
              <Loader2 size={28} className="mx-auto text-primary animate-spin" />
            </div>
          ) : !revenue || revenue.revenue === 0 ? (
            <div className="p-10 text-center">
              <Ticket size={36} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">
                Aucune vente pour le moment.
              </p>
            </div>
          ) : (
            <>
              <div className="px-6 py-5 grid grid-cols-3 gap-4 border-b border-gray-100">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatPrice(revenue.revenue)}
                  </p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    Revenu total
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {revenue.soldTickets}
                  </p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    Billets vendus
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {revenue.ordersCount}
                  </p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    Commandes payées
                  </p>
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Top événements
                </p>
                <div className="space-y-3">
                  {revenue.perEvent
                    .filter((e) => e.revenue > 0)
                    .slice(0, 4)
                    .map((e) => (
                      <Link
                        key={e.eventId}
                        href={`/organizer/events/${e.eventId}/orders`}
                        className="flex items-center justify-between gap-3 group"
                      >
                        <p className="text-sm font-medium text-gray-700 group-hover:text-primary truncate transition-colors">
                          {e.title}
                        </p>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatPrice(e.revenue)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {e.soldTickets} billet
                            {e.soldTickets > 1 ? "s" : ""}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
