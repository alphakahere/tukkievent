"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  CalendarDays,
  Ticket,
  TrendingUp,
  Clock,
  Plus,
  BarChart3,
  ChevronRight,
  Eye,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useOrganizer } from "@/contexts/OrganizerContext";

const kpiIcons = [
  { icon: CalendarDays, color: "#FF6B35", bg: "#FFF1EC" },
  { icon: Ticket, color: "#3B82F6", bg: "#EFF6FF" },
  { icon: TrendingUp, color: "#10B981", bg: "#ECFDF5" },
  { icon: Clock, color: "#F59E0B", bg: "#FFFBEB" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PUBLISHED: "bg-emerald-50 text-emerald-700",
    DRAFT: "bg-amber-50 text-amber-700",
    ENDED: "bg-gray-100 text-gray-500",
  };
  const labels: Record<string, string> = { PUBLISHED: "Publié", DRAFT: "Brouillon", ENDED: "Terminé" };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.DRAFT}`}>
      {labels[status] || status}
    </span>
  );
}

export default function OrganizerDashboardPage() {
  const { org, events, recentOrders, totalRevenue, totalTicketsSold, upcomingCount } = useOrganizer();

  const kpis = [
    { label: "Événements", value: events.length.toString() },
    { label: "Billets vendus", value: totalTicketsSold.toLocaleString() },
    { label: "Revenu total", value: `${(totalRevenue / 1000).toFixed(0)}K FCFA` },
    { label: "À venir", value: upcomingCount.toString() },
  ];

  const recentEvents = events.slice(0, 4);
  const lastOrders = recentOrders.slice(0, 5);

  return (
    <div className="p-5 md:p-8 space-y-8">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-0.5">{org.name}</p>
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
          <div>
            {recentEvents.map((oe, idx) => {
              const eventDate = format(new Date(oe.event.startDatetime), "d MMM yyyy", { locale: fr });
              return (
                <Link
                  key={oe.event.id}
                  href={`/organizer/events/${oe.event.id}`}
                  className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${idx !== recentEvents.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <CalendarDays size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-1">{oe.event.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{eventDate} · {oe.event.city}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <StatusBadge status={oe.status} />
                    <p className="text-xs text-gray-400">{oe.totalSold} vendus</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Ventes récentes</h2>
          </div>
          <div>
            {lastOrders.map((order, idx) => {
              const timeAgo = formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: fr });
              return (
                <div
                  key={order.id}
                  className={`flex items-center gap-4 px-6 py-4 ${idx !== lastOrders.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-secondary/80 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {order.buyerName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{order.buyerName}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {order.quantity}× {order.ticketType} · {order.eventTitle}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900 text-sm">{order.total.toLocaleString()} F</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
