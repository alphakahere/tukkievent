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
  { icon: CalendarDays, color: "#FF6B35", bg: "#FF6B3515" },
  { icon: Ticket, color: "#3B82F6", bg: "#3B82F615" },
  { icon: TrendingUp, color: "#10B981", bg: "#10B98115" },
  { icon: Clock, color: "#F59E0B", bg: "#F59E0B15" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PUBLISHED: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    DRAFT: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    ENDED: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  };
  const labels: Record<string, string> = { PUBLISHED: "Publié", DRAFT: "Brouillon", ENDED: "Terminé" };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.DRAFT}`}>
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
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground">{org.name}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const { icon: Icon, color, bg } = kpiIcons[i];
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl p-4 border border-border shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: bg }}>
                  <Icon size={20} style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 flex-wrap">
        <Link
          href="/organizer/events/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Créer un événement
        </Link>
        <Link
          href="/organizer/events"
          className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
        >
          <Eye size={16} />
          Voir les événements
        </Link>
        <Link
          href="/organizer/analytics"
          className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
        >
          <BarChart3 size={16} />
          Analytiques
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border shadow-sm"
        >
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">Événements récents</h2>
            <Link href="/organizer/events" className="text-sm text-primary font-semibold">
              Tout voir
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentEvents.map((oe) => {
              const eventDate = format(new Date(oe.event.startDatetime), "d MMM yyyy", { locale: fr });
              return (
                <Link
                  key={oe.event.id}
                  href={`/organizer/events/${oe.event.id}/attendees`}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground line-clamp-1">{oe.event.title}</p>
                    <p className="text-xs text-muted-foreground">{eventDate} · {oe.event.city}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusBadge status={oe.status} />
                    <p className="text-xs text-muted-foreground mt-1">{oe.totalSold} vendus</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border shadow-sm"
        >
          <div className="p-5 border-b border-border">
            <h2 className="font-bold text-foreground">Ventes récentes</h2>
          </div>
          <div className="divide-y divide-border">
            {lastOrders.map((order) => {
              const timeAgo = formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: fr });
              return (
                <div key={order.id} className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-bold shrink-0">
                    {order.buyerName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{order.buyerName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {order.quantity}× {order.ticketType} · {order.eventTitle}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-foreground text-sm">{order.total.toLocaleString()} F</p>
                    <p className="text-xs text-muted-foreground">{timeAgo}</p>
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
