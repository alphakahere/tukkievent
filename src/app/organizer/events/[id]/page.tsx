"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Edit,
  Users,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Tag,
  BarChart2,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useOrganizer } from "@/contexts/OrganizerContext";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PUBLISHED: { label: "Publié", className: "bg-emerald-50 text-emerald-700" },
    DRAFT:     { label: "Brouillon", className: "bg-amber-50 text-amber-700" },
    ENDED:     { label: "Terminé", className: "bg-gray-100 text-gray-500" },
  };
  const { label, className } = map[status] ?? map.DRAFT;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;
  const { getEventById, recentOrders } = useOrganizer();

  const oe = getEventById(eventId);

  if (!oe) {
    return (
      <div className="p-6 text-center">
        <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Événement introuvable</h2>
        <button
          type="button"
          onClick={() => router.push("/organizer/events")}
          className="mt-4 px-6 py-2.5 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Retour aux événements
        </button>
      </div>
    );
  }

  const { event, status, ticketSales, totalRevenue, totalSold } = oe;
  const totalCapacity = ticketSales.reduce((s, t) => s + t.total, 0);
  const capacityPct = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;
  const remaining = totalCapacity - totalSold;

  const startDate = format(new Date(event.startDatetime), "EEEE d MMMM yyyy", { locale: fr });
  const startTime = format(new Date(event.startDatetime), "HH:mm", { locale: fr });
  const endTime = format(new Date(event.endDatetime), "HH:mm", { locale: fr });

  const eventOrders = recentOrders.filter((o) => o.eventId === eventId);

  const kpis = [
    { label: "Billets vendus", value: totalSold.toLocaleString(), icon: Ticket, color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Revenu total", value: `${totalRevenue.toLocaleString()} F`, icon: TrendingUp, color: "#10B981", bg: "#ECFDF5" },
    { label: "Remplissage", value: `${capacityPct}%`, icon: BarChart2, color: "#FF6B35", bg: "#FFF1EC" },
    { label: "Disponibles", value: remaining.toLocaleString(), icon: Users, color: "#8B5CF6", bg: "#F5F3FF" },
  ];

  return (
    <div className="p-5 md:p-8 space-y-6">

      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/organizer/events")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Événements
        </button>
        <div className="flex items-center gap-2">
          <Link
            href={`/events/${event.slug}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Voir la page</span>
          </Link>
          <Link
            href={`/organizer/events/${event.id}/attendees`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Users size={14} />
            <span className="hidden sm:inline">Participants</span>
          </Link>
          <Link
            href={`/organizer/events/${event.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Edit size={14} />
            Modifier
          </Link>
        </div>
      </div>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        {event.coverImageUrl && (
          <div className="h-48 md:h-64 w-full overflow-hidden">
            <img
              src={event.coverImageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={status} />
                <span className="text-xs text-gray-400">{event.category?.name}</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="capitalize">{startDate}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" />
                  {startTime} – {endTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-400" />
                  {event.address ? `${event.address}, ` : ""}{event.city}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: kpi.bg }}
            >
              <kpi.icon size={18} style={{ color: kpi.color }} strokeWidth={2} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Ticket types */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Tag size={16} className="text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">Types de billets</h2>
          </div>
          <div className="p-6 space-y-5">
            {ticketSales.map((ts) => {
              const pct = ts.total > 0 ? Math.round((ts.sold / ts.total) * 100) : 0;
              const revenue = ts.sold * ts.price;
              return (
                <div key={ts.ticketTypeId}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{ts.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{ts.price.toLocaleString()} FCFA / billet</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{revenue.toLocaleString()} F</p>
                      <p className="text-xs text-gray-400 mt-0.5">{ts.sold} / {ts.total} vendus</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{pct}% vendu</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Commandes récentes</h2>
            </div>
            {eventOrders.length > 0 && (
              <span className="text-xs font-medium text-gray-400">{eventOrders.length} commandes</span>
            )}
          </div>

          {eventOrders.length === 0 ? (
            <div className="p-10 text-center">
              <Ticket size={36} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">Aucune commande pour cet événement</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {eventOrders.map((order) => {
                const timeAgo = formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: fr });
                return (
                  <div key={order.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary/80 to-secondary/80 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {order.buyerName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{order.buyerName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.quantity}× {order.ticketType}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900">{order.total.toLocaleString()} F</p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Event details */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Détails de l&apos;événement</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{event.description || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Catégorie</p>
              <p className="text-sm text-gray-700">{event.category?.name || "—"}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Date & heure</p>
              <p className="text-sm text-gray-700 capitalize">{startDate}</p>
              <p className="text-sm text-gray-500">{startTime} – {endTime}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Lieu</p>
              <p className="text-sm text-gray-700">{event.address || event.city}</p>
              <p className="text-sm text-gray-500">{event.city}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Capacité totale</p>
              <p className="text-sm text-gray-700">{totalCapacity.toLocaleString()} places</p>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
