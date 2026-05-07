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
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useOrganizerOrg } from "@/contexts/OrganizerOrgContext";
import { useListEventsQuery } from "@/store/api/event/event.api";
import type { EventStatus } from "@/store/api/event/event.resource.type";

type TabId = "all" | "PUBLISHED" | "DRAFT" | "COMPLETED";

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

export default function OrganizerEventsPage() {
  const { activeOrgId } = useOrganizerOrg();
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const { data, isLoading } = useListEventsQuery(
    activeOrgId ? { organizationId: activeOrgId, limit: 50 } : undefined,
    { skip: !activeOrgId },
  );

  const events = data?.data ?? [];

  const filteredEvents =
    activeTab === "all" ? events : events.filter((e) => e.status === activeTab);

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "all", label: "Tous", count: events.length },
    { id: "PUBLISHED", label: "Publiés", count: events.filter((e) => e.status === "PUBLISHED").length },
    { id: "DRAFT", label: "Brouillons", count: events.filter((e) => e.status === "DRAFT").length },
    { id: "COMPLETED", label: "Terminés", count: events.filter((e) => e.status === "COMPLETED").length },
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
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="text-primary animate-spin" />
        </div>
      ) : filteredEvents.length === 0 ? (
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
          {filteredEvents.map((event, index) => {
            const dateStr = format(new Date(event.startDatetime), "d MMM yyyy", { locale: fr });
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="p-5 md:flex md:items-center md:gap-5">
                  <div className="flex-1 min-w-0 mb-4 md:mb-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{event.title}</p>
                      <StatusBadge status={event.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5"><Calendar size={13} />{dateStr}</span>
                      {event.city && (
                        <span className="flex items-center gap-1.5"><MapPin size={13} />{event.city}</span>
                      )}
                      <span className="flex items-center gap-1.5"><Users size={13} />{event.capacity} places</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:shrink-0">
                    <Link
                      href={`/organizer/events/${event.id}`}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Détails
                    </Link>
                    <Link
                      href={`/organizer/events/${event.id}`}
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
