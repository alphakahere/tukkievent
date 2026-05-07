"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Flag, CheckCircle, XCircle } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import type { AdminReport, ReportStatus } from "@/store/api/admin/admin.type";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

const REASON_LABELS: Record<string, string> = {
  FRAUD: "Fraude",
  SPAM: "Spam",
  INAPPROPRIATE: "Contenu inapproprié",
  OTHER: "Autre",
};

const STATUS_CONFIG: Record<ReportStatus, { label: string; class: string }> = {
	OPEN: { label: "Ouvert", class: "bg-red-50 text-rose-600" },
	RESOLVED: { label: "Résolu", class: "bg-emerald-50 text-emerald-600" },
	DISMISSED: { label: "Ignoré", class: "bg-gray-100 text-gray-500" },
};

const TARGET_LABELS: Record<string, string> = {
  EVENT: "Événement",
  USER: "Utilisateur",
  ORGANIZER: "Organisateur",
};

export default function AdminReportsPage() {
  const { reports, updateReportStatus } = useAdmin();
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("OPEN");

  const filtered = reports.filter(
    (r) => statusFilter === "ALL" || r.status === statusFilter
  );

  const handleResolve = (r: AdminReport) => {
    updateReportStatus(r.id, "RESOLVED");
    toast.success("Signalement marqué comme résolu");
  };

  const handleDismiss = (r: AdminReport) => {
    updateReportStatus(r.id, "DISMISSED");
    toast("Signalement ignoré");
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-2xl font-bold text-gray-900">Signalements</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {reports.filter((r) => r.status === "OPEN").length} ouverts · {reports.length} total
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2"
      >
        {(["OPEN", "RESOLVED", "DISMISSED", "ALL"] as const).map((s) => (
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
            {s === "ALL" ? "Tous" : STATUS_CONFIG[s].label}
          </button>
        ))}
      </motion.div>

      {/* Report list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 px-5 py-10 text-center">
            <Flag size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Aucun signalement dans cette catégorie</p>
          </div>
        ) : (
          filtered.map((report) => {
            const status = STATUS_CONFIG[report.status];
            const isOpen = report.status === "OPEN";
            return (
              <div
                key={report.id}
                className={`bg-white rounded-2xl border overflow-hidden ${isOpen ? "border-rose-200" : "border-gray-100"}`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.class}`}>
                        {status.label}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        {REASON_LABELS[report.reason]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {TARGET_LABELS[report.targetType]} : <span className="font-semibold text-gray-700">{report.targetName}</span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 shrink-0">
                      {formatDistanceToNow(new Date(report.createdAt), { locale: fr, addSuffix: true })}
                    </p>
                  </div>

                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">{report.description}</p>

                  <p className="text-xs text-gray-400">
                    Signalé par <span className="font-semibold text-gray-600">{report.reporterName}</span>
                  </p>
                </div>

                {isOpen && (
                  <div className="px-5 pb-4 flex gap-2 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => handleResolve(report)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-full text-xs font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      <CheckCircle size={13} /> Résoudre
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDismiss(report)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-semibold hover:bg-gray-50 transition-colors"
                    >
                      <XCircle size={13} /> Ignorer
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
