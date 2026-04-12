"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search, MoreVertical, CheckCircle, UserX, ShieldBan } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import type { AdminOrganizer, UserStatus } from "@/store/api/admin/admin.type";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

const STATUS_LABELS: Record<UserStatus, { label: string; class: string }> = {
  ACTIVE: { label: "Actif", class: "bg-emerald-50 text-emerald-600" },
  SUSPENDED: { label: "Suspendu", class: "bg-amber-50 text-amber-600" },
  BANNED: { label: "Banni", class: "bg-rose-50 text-rose-600" },
};

function OrgActions({ org, onUpdate }: { org: AdminOrganizer; onUpdate: (id: string, s: UserStatus) => void }) {
  const [open, setOpen] = useState(false);

  const allActions: { label: string; status: UserStatus; icon: React.ReactNode }[] = [
    { label: "Activer", status: "ACTIVE" as UserStatus, icon: <CheckCircle size={14} /> },
    { label: "Suspendre", status: "SUSPENDED" as UserStatus, icon: <UserX size={14} /> },
    { label: "Bannir", status: "BANNED" as UserStatus, icon: <ShieldBan size={14} /> },
  ];
  const actions = allActions.filter((a) => a.status !== org.status);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-gray-200 shadow-sm z-20 py-1">
            {actions.map((a) => (
              <button
                key={a.status}
                type="button"
                onClick={() => {
                  onUpdate(org.id, a.status);
                  toast.success(`Organisateur ${a.label.toLowerCase()}`);
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors"
              >
                {a.icon}
                {a.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminOrganizersPage() {
  const { organizers, updateOrganizerStatus } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "ALL">("ALL");

  const filtered = organizers.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-2xl font-bold text-gray-900">Organisateurs</p>
        <p className="text-sm text-gray-500 mt-0.5">{organizers.length} organisateurs enregistrés</p>
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
            placeholder="Rechercher un organisateur…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "ACTIVE", "SUSPENDED"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap ${
                statusFilter === s
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {s === "ALL" ? "Tous" : STATUS_LABELS[s].label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filtered.length === 0 ? (
          <p className="col-span-full text-sm text-gray-400 text-center py-8">Aucun organisateur trouvé</p>
        ) : (
          filtered.map((org) => {
            const status = STATUS_LABELS[org.status];
            return (
              <div key={org.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {org.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-gray-900">{org.name}</p>
                        {org.verified && (
                          <CheckCircle size={13} className="text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{org.email}</p>
                    </div>
                  </div>
                  <OrgActions org={org} onUpdate={updateOrganizerStatus} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{org.eventsCount}</p>
                    <p className="text-xs text-gray-400">Événements</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{(org.totalRevenue / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-gray-400">Revenus (FCFA)</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.class}`}>
                    {status.label}
                  </span>
                  <p className="text-xs text-gray-400">
                    Depuis {format(new Date(org.createdAt), "MMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
