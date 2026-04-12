"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import Image from "next/image";
import { useAdmin } from "@/contexts/AdminContext";
import type { AdminEvent, EventAdminStatus } from "@/store/api/admin/admin.type";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

const STATUS_CONFIG: Record<EventAdminStatus, { label: string; class: string }> = {
  PENDING: { label: "En attente", class: "bg-amber-50 text-amber-600" },
  APPROVED: { label: "Approuvé", class: "bg-emerald-50 text-emerald-600" },
  REJECTED: { label: "Rejeté", class: "bg-rose-50 text-rose-600" },
  SUSPENDED: { label: "Suspendu", class: "bg-gray-100 text-gray-500" },
};

export default function AdminEventsPage() {
  const { events, updateEventStatus } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventAdminStatus | "ALL">("ALL");

  const filtered = events.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.organizerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = (ev: AdminEvent) => {
    updateEventStatus(ev.id, "APPROVED");
    toast.success(`«${ev.title}» approuvé`);
  };

  const handleReject = (ev: AdminEvent) => {
    updateEventStatus(ev.id, "REJECTED");
    toast.error(`«${ev.title}» rejeté`);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-2xl font-bold text-gray-900">Événements</p>
        <p className="text-sm text-gray-500 mt-0.5">{events.length} événements au total</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un événement…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {(["ALL", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === s
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {s === "ALL" ? "Tous" : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Event list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 px-5 py-8 text-center">
            <p className="text-sm text-gray-400">Aucun événement trouvé</p>
          </div>
        ) : (
          filtered.map((ev) => {
            const status = STATUS_CONFIG[ev.status];
            const isPending = ev.status === "PENDING";
            return (
              <div key={ev.id} className={`bg-white rounded-2xl border overflow-hidden ${isPending ? "border-amber-200" : "border-gray-100"}`}>
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                    <Image src={ev.coverImageUrl} alt={ev.title} fill className="object-cover" sizes="112px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-base font-semibold text-gray-900 leading-tight">{ev.title}</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${status.class}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{ev.organizerName} · {ev.city}</p>
                    <p className="text-xs text-gray-400 mb-3">
                      {format(new Date(ev.startDatetime), "d MMMM yyyy", { locale: fr })} · {ev.category}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span><span className="font-semibold text-gray-900">{ev.ticketsSold}</span> billets</span>
                      <span><span className="font-semibold text-gray-900">{ev.revenue.toLocaleString()}</span> FCFA</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className={`px-4 pb-4 flex items-center gap-2 ${isPending ? "" : "hidden"}`}>
                  <button
                    type="button"
                    onClick={() => handleApprove(ev)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-full text-xs font-semibold hover:bg-emerald-600 transition-colors"
                  >
                    <CheckCircle size={13} /> Approuver
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(ev)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-full text-xs font-semibold hover:bg-rose-50 transition-colors"
                  >
                    <XCircle size={13} /> Rejeter
                  </button>
                  <a
                    href={`/events/${ev.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-semibold hover:bg-gray-50 transition-colors ml-auto"
                  >
                    <Eye size={13} /> Voir
                  </a>
                </div>
                {!isPending && ev.status === "APPROVED" && (
                  <div className="px-4 pb-4 flex">
                    <button
                      type="button"
                      onClick={() => { updateEventStatus(ev.id, "SUSPENDED"); toast.success("Événement suspendu"); }}
                      className="text-xs font-semibold text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      Suspendre
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
