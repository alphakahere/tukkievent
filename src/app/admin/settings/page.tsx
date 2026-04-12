"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Save, AlertTriangle } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdmin();
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateSettings(form);
    setSaving(false);
    toast.success("Paramètres enregistrés");
  };

  const inputClass =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors";

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-2xl font-bold text-gray-900">Paramètres</p>
        <p className="text-sm text-gray-500 mt-0.5">Configuration de la plateforme</p>
      </motion.div>

      {/* General */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4"
      >
        <p className="text-base font-semibold text-gray-900">Informations générales</p>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nom de la plateforme</label>
          <input
            type="text"
            value={form.siteName}
            onChange={(e) => setForm((p) => ({ ...p, siteName: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email support</label>
          <input
            type="email"
            value={form.supportEmail}
            onChange={(e) => setForm((p) => ({ ...p, supportEmail: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Téléphone support</label>
          <input
            type="text"
            value={form.supportPhone}
            onChange={(e) => setForm((p) => ({ ...p, supportPhone: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            Taux de commission (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={form.commissionRate}
            onChange={(e) => setForm((p) => ({ ...p, commissionRate: parseFloat(e.target.value) }))}
            className={inputClass}
          />
          <p className="text-xs text-gray-400 mt-1">
            Pourcentage prélevé sur chaque transaction
          </p>
        </div>
      </motion.div>

      {/* Toggles */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4"
      >
        <p className="text-base font-semibold text-gray-900">Fonctionnalités</p>

        {[
          {
            key: "allowNewOrganizers" as const,
            label: "Autoriser les nouveaux organisateurs",
            sub: "Les utilisateurs peuvent créer un compte organisateur",
          },
          {
            key: "requireEventApproval" as const,
            label: "Approbation des événements requise",
            sub: "Chaque nouvel événement doit être approuvé avant publication",
          },
        ].map(({ key, label, sub }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, [key]: !p[key] }))}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                form[key] ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  form[key] ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Maintenance mode — danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl border border-amber-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-amber-500" />
          <p className="text-base font-semibold text-gray-900">Mode maintenance</p>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Lorsque le mode maintenance est activé, le site affiche une page de maintenance pour tous les visiteurs sauf les administrateurs.
        </p>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${form.maintenanceMode ? "text-amber-600" : "text-gray-400"}`}>
            {form.maintenanceMode ? "Activé" : "Désactivé"}
          </span>
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, maintenanceMode: !p.maintenanceMode }))}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              form.maintenanceMode ? "bg-amber-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                form.maintenanceMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </motion.div>

      {/* Save button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-semibold text-sm hover:bg-gray-800 disabled:opacity-60 transition-all"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Enregistrement…" : "Enregistrer les paramètres"}
        </button>
      </motion.div>
    </div>
  );
}
