"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import type { OrderAdminStatus } from "@/store/api/admin/admin.type";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const STATUS_CONFIG: Record<
	OrderAdminStatus,
	{ label: string; class: string }
> = {
	PENDING: { label: "En attente", class: "bg-amber-50 text-amber-600" },
	COMPLETED: { label: "Complété", class: "bg-emerald-50 text-emerald-600" },
	REFUNDED: { label: "Remboursé", class: "bg-red-50 text-rose-600" },
	CANCELLED: { label: "Annulé", class: "bg-gray-100 text-gray-500" },
};

export default function AdminOrdersPage() {
  const { orders } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderAdminStatus | "ALL">("ALL");

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      o.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-2xl font-bold text-gray-900">Commandes</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {orders.length} commandes · {totalRevenue.toLocaleString()} FCFA collectés
        </p>
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
            placeholder="Rechercher par acheteur ou événement…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {(["ALL", "COMPLETED", "PENDING", "REFUNDED", "CANCELLED"] as const).map((s) => (
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

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="hidden md:grid grid-cols-[1fr_1fr_120px_80px_100px] gap-4 px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <span>Acheteur</span>
          <span>Événement</span>
          <span>Paiement</span>
          <span>Montant</span>
          <span>Statut</span>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">Aucune commande trouvée</p>
          ) : (
            filtered.map((order) => {
              const status = STATUS_CONFIG[order.status];
              return (
                <div
                  key={order.id}
                  className="px-5 py-4 flex flex-col md:grid md:grid-cols-[1fr_1fr_120px_80px_100px] md:items-center gap-2 md:gap-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.buyerName}</p>
                    <p className="text-xs text-gray-400">{order.buyerEmail}</p>
                    <p className="text-xs text-gray-400 md:hidden">
                      {format(new Date(order.createdAt), "d MMM yyyy HH:mm", { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 line-clamp-1">{order.eventTitle}</p>
                    <p className="text-xs text-gray-400">{order.ticketsCount} billet{order.ticketsCount > 1 ? "s" : ""}</p>
                  </div>
                  <p className="hidden md:block text-sm text-gray-500">{order.paymentMethod}</p>
                  <p className="hidden md:block text-sm font-bold text-gray-900">
                    {order.total.toLocaleString()} F
                  </p>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${status.class}`}>
                    {status.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
