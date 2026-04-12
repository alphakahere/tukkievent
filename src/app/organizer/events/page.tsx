"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Plus,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useOrganizer, type OrgEventStatus } from "@/contexts/OrganizerContext";

type TabId = "all" | "PUBLISHED" | "ENDED" | "DRAFT";

function StatusBadge({ status }: { status: OrgEventStatus }) {
  const styles: Record<OrgEventStatus, string> = {
    PUBLISHED: "bg-emerald-50 text-emerald-700",
    DRAFT: "bg-amber-50 text-amber-700",
    ENDED: "bg-gray-100 text-gray-500",
  };
  const labels: Record<OrgEventStatus, string> = { PUBLISHED: "Publié", DRAFT: "Brouillon", ENDED: "Terminé" };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function OrganizerEventsPage() {
  const { events } = useOrganizer();
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const filteredEvents =
    activeTab === "all" ? events : events.filter((e) => e.status === activeTab);

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "all", label: "Tous", count: events.length },
    { id: "PUBLISHED", label: "À venir", count: events.filter((e) => e.status === "PUBLISHED").length },
    { id: "ENDED", label: "Terminés", count: events.filter((e) => e.status === "ENDED").length },
    { id: "DRAFT", label: "Brouillons", count: events.filter((e) => e.status === "DRAFT").length },
  ];

  return (
    <div className="p-5 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Événements</h1>
        <Link
          href="/organizer/events/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Créer un événement</span>
          <span className="sm:hidden">Créer</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Events list */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun événement</h3>
          <p className="text-gray-500 mb-6">Commencez par créer votre premier événement</p>
          <Link
            href="/organizer/events/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Créer un événement
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((oe, index) => {
            const dateStr = format(new Date(oe.event.startDatetime), "d MMM yyyy", { locale: fr });
            const capacityPct = oe.ticketSales.reduce((s, t) => s + t.total, 0) > 0
              ? Math.round((oe.totalSold / oe.ticketSales.reduce((s, t) => s + t.total, 0)) * 100)
              : 0;
            return (
              <motion.div
                key={oe.event.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="p-5 md:flex md:items-center md:gap-5">
                  {/* Info */}
                  <div className="flex-1 min-w-0 mb-4 md:mb-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{oe.event.title}</p>
                      <StatusBadge status={oe.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5"><Calendar size={13} />{dateStr}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={13} />{oe.event.city}</span>
                      <span className="flex items-center gap-1.5"><Users size={13} />{oe.totalSold} vendus</span>
                    </div>
                  </div>

                  {/* Revenue + progress */}
                  <div className="flex items-center gap-5 md:shrink-0">
                    <div className="flex-1 md:w-36">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                        <span>Remplissage</span>
                        <span className="font-medium text-gray-600">{capacityPct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${capacityPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900 text-sm">{oe.totalRevenue.toLocaleString()} F</p>
                      <p className="text-xs text-gray-400">Revenu</p>
                    </div>
                    <Link
                      href={`/organizer/events/${oe.event.id}`}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Voir"
                    >
                      <ChevronRight size={18} className="text-gray-400" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
