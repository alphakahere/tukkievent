"use client";

import { motion } from "motion/react";
import { Calendar, Clock, MapPin, Users, Ticket, Wallet } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useGetAttendeeStatsQuery } from "@/store/api/tickets/tickets.api";
import { formatPrice } from "@/lib/utils";
import { useEvent } from "./layout";

function StatCard({
  label,
  value,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  accent?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
        <Icon size={16} className="text-gray-300" />
      </div>
      <p className={`mt-2 text-2xl font-bold ${accent ?? "text-gray-900"}`}>{value}</p>
    </div>
  );
}

export default function OverviewPage() {
  const event = useEvent();
  const { data: stats } = useGetAttendeeStatsQuery(event.id);

  const totalAttendees = stats?.total ?? 0;
  const checkedIn = stats?.checkedIn ?? 0;
  const revenue = 0;
  const remaining = Math.max(0, event.capacity - totalAttendees);

  const startDate = format(new Date(event.startDatetime), "EEEE d MMMM yyyy", { locale: fr });
  const startTime = format(new Date(event.startDatetime), "HH:mm", { locale: fr });
  const endTime = event.endDatetime
    ? format(new Date(event.endDatetime), "HH:mm", { locale: fr })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Participants" value={String(totalAttendees)} icon={Users} />
        <StatCard
          label="Enregistrés"
          value={String(checkedIn)}
          accent="text-emerald-600"
          icon={Ticket}
        />
        <StatCard
          label="Revenu"
          value={formatPrice(revenue)}
          accent="text-emerald-600"
          icon={Wallet}
        />
        <StatCard label="Places restantes" value={String(remaining)} icon={Users} />
      </div>

      <section className="bg-white rounded-2xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Détails de l&apos;événement</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Âge minimum</p>
              <p className="text-sm text-gray-700">
                {event.minAge > 0 ? `${event.minAge} ans` : "Tout public"}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Date & heure</p>
              <p className="text-sm text-gray-700 capitalize flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                {startDate}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <Clock size={14} className="text-gray-400" />
                {startTime}{endTime ? ` – ${endTime}` : ""}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Lieu</p>
              {event.isOnline ? (
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400" />
                  En ligne
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    {event.address || event.city || "—"}
                  </p>
                  {event.address && event.city && (
                    <p className="text-sm text-gray-500 ml-6">{event.city}</p>
                  )}
                </>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Capacité</p>
              <p className="text-sm text-gray-700">{event.capacity.toLocaleString()} places</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
