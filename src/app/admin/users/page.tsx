"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search, MoreVertical, UserCheck, UserX, ShieldBan } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import type { AdminUser, UserStatus } from "@/store/api/admin/admin.type";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

const STATUS_LABELS: Record<UserStatus, { label: string; class: string }> = {
  ACTIVE: { label: "Actif", class: "bg-emerald-50 text-emerald-600" },
  SUSPENDED: { label: "Suspendu", class: "bg-amber-50 text-amber-600" },
  BANNED: { label: "Banni", class: "bg-rose-50 text-rose-600" },
};

function UserActions({ user, onUpdate }: { user: AdminUser; onUpdate: (id: string, s: UserStatus) => void }) {
  const [open, setOpen] = useState(false);

  const allActions: { label: string; status: UserStatus; icon: React.ReactNode }[] = [
    { label: "Activer", status: "ACTIVE" as UserStatus, icon: <UserCheck size={14} /> },
    { label: "Suspendre", status: "SUSPENDED" as UserStatus, icon: <UserX size={14} /> },
    { label: "Bannir", status: "BANNED" as UserStatus, icon: <ShieldBan size={14} /> },
  ];
  const actions = allActions.filter((a) => a.status !== user.status);

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
                  onUpdate(user.id, a.status);
                  toast.success(`Utilisateur ${a.label.toLowerCase()}`);
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

export default function AdminUsersPage() {
  const { users, updateUserStatus } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "ALL">("ALL");

  const filtered = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-2xl font-bold text-gray-900">Utilisateurs</p>
        <p className="text-sm text-gray-500 mt-0.5">{users.length} comptes enregistrés</p>
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
            placeholder="Rechercher un utilisateur…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "ACTIVE", "SUSPENDED", "BANNED"] as const).map((s) => (
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

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        {/* Desktop table header */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_100px_80px_80px_40px] gap-4 px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <span>Utilisateur</span>
          <span>Email</span>
          <span>Commandes</span>
          <span>Dépensé</span>
          <span>Statut</span>
          <span />
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">Aucun utilisateur trouvé</p>
          ) : (
            filtered.map((user) => {
              const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
              const status = STATUS_LABELS[user.status];
              return (
                <div
                  key={user.id}
                  className="px-5 py-3.5 flex flex-col md:grid md:grid-cols-[1fr_1fr_100px_80px_80px_40px] md:items-center gap-2 md:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-400 md:hidden">{user.email}</p>
                      <p className="text-xs text-gray-400">
                        Inscrit {format(new Date(user.createdAt), "d MMM yyyy", { locale: fr })}
                        {user.isOrganizer && <span className="ml-2 text-violet-600 font-semibold">Organisateur</span>}
                      </p>
                    </div>
                  </div>
                  <p className="hidden md:block text-sm text-gray-500 truncate">{user.email}</p>
                  <p className="hidden md:block text-sm text-gray-700 font-semibold">{user.ordersCount}</p>
                  <p className="hidden md:block text-sm text-gray-700 font-semibold">{(user.totalSpent / 1000).toFixed(0)}k</p>
                  <div className="flex items-center gap-2 md:block">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.class}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <UserActions user={user} onUpdate={updateUserStatus} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
