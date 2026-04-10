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
  MoreVertical,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useOrganizer, type OrgEventStatus } from "@/contexts/OrganizerContext";

type TabId = "all" | "PUBLISHED" | "ENDED" | "DRAFT";

function StatusBadge({ status }: { status: OrgEventStatus }) {
  const styles: Record<OrgEventStatus, string> = {
    PUBLISHED: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    DRAFT: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    ENDED: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  };
  const labels: Record<OrgEventStatus, string> = { PUBLISHED: "Publié", DRAFT: "Brouillon", ENDED: "Terminé" };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
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
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Événements</h1>
        <Link
          href="/organizer/events/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
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
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border hover:bg-muted"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Events list */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Aucun événement</h3>
          <p className="text-muted-foreground mb-4">Commencez par créer votre premier événement</p>
          <Link
            href="/organizer/events/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
              >
                <div className="p-4 md:flex md:items-center md:gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0 mb-3 md:mb-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-foreground line-clamp-1">{oe.event.title}</h3>
                          <StatusBadge status={oe.status} />
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar size={14} />{dateStr}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} />{oe.event.city}</span>
                          <span className="flex items-center gap-1"><Users size={14} />{oe.totalSold} vendus</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue + progress */}
                  <div className="flex items-center gap-4 md:shrink-0">
                    <div className="flex-1 md:w-40">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Remplissage</span>
                        <span>{capacityPct}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${capacityPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-foreground text-sm">{oe.totalRevenue.toLocaleString()} F</p>
                      <p className="text-xs text-muted-foreground">Revenu</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/organizer/events/${oe.event.id}/attendees`}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        aria-label="Voir"
                      >
                        <ChevronRight size={18} className="text-muted-foreground" />
                      </Link>
                    </div>
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
