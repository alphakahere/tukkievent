"use client";

import { motion } from "motion/react";
import { CalendarDays, FileEdit, Loader2, TrendingUp, Users } from "lucide-react";
import { useOrganizerOrg } from "@/contexts/OrganizerOrgContext";
import { useListEventsQuery } from "@/store/api/event/event.api";
import type { EventStatus } from "@/store/api/event/event.resource.type";

const STATUS_LABELS: Record<EventStatus, string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publié",
  CANCELLED: "Annulé",
  COMPLETED: "Terminé",
  REJECTED: "Rejeté",
  SUSPENDED: "Suspendu",
};

export default function AnalyticsPage() {
  const { activeOrgId } = useOrganizerOrg();
  const { data, isLoading } = useListEventsQuery(
    activeOrgId ? { organizationId: activeOrgId, limit: 100 } : undefined,
    { skip: !activeOrgId },
  );

  const events = data?.data ?? [];
  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
  const publishedCount = events.filter((e) => e.status === "PUBLISHED").length;
  const draftCount = events.filter((e) => e.status === "DRAFT").length;

  const statusBreakdown = (Object.keys(STATUS_LABELS) as EventStatus[])
    .map((status) => ({
      status,
      label: STATUS_LABELS[status],
      count: events.filter((e) => e.status === status).length,
    }))
    .filter((s) => s.count > 0);

  const topByCapacity = [...events]
    .sort((a, b) => (b.capacity || 0) - (a.capacity || 0))
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytiques</h1>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-900">
        Les indicateurs de revenu et de billets vendus seront disponibles dès que le module de ventes sera connecté.
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <CalendarDays size={20} className="text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{events.length}</p>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Événements totaux</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <TrendingUp size={20} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Publiés</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <FileEdit size={20} className="text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{draftCount}</p>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Brouillons</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <Users size={20} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalCapacity.toLocaleString()}</p>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Capacité totale</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <h2 className="text-base font-semibold text-gray-900 mb-5">Répartition par statut</h2>
          {statusBreakdown.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Aucun événement</p>
          ) : (
            <div className="space-y-4">
              {statusBreakdown.map((s) => {
                const pct = events.length > 0 ? (s.count / events.length) * 100 : 0;
                return (
                  <div key={s.status}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-gray-500">{s.label}</span>
                      <span className="font-semibold text-gray-900">{s.count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Top events by capacity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <h2 className="text-base font-semibold text-gray-900 mb-5">Top événements par capacité</h2>
          {topByCapacity.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Aucun événement</p>
          ) : (
            <div className="space-y-3">
              {topByCapacity.map((event, i) => (
                <div key={event.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-gray-400">{STATUS_LABELS[event.status]}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 shrink-0">
                    {event.capacity.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
