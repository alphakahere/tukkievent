"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Building2, Globe, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useOrganizer } from "@/contexts/OrganizerContext";

export default function OrganizerSettingsPage() {
  const { org } = useOrganizer();
  const [name, setName] = useState(org.name);
  const [description, setDescription] = useState(org.description);
  const [logoUrl, setLogoUrl] = useState(org.logoUrl);
  const [websiteUrl, setWebsiteUrl] = useState(org.websiteUrl);

  const handleSave = () => {
    toast.success("Paramètres enregistrés !");
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Paramètres de l&apos;organisation</h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Informations générales</h2>
            <p className="text-xs text-gray-500">Détails publics de votre organisation</p>
          </div>
        </div>

        <div>
          <label htmlFor="orgName" className="text-sm font-medium text-gray-700 block mb-1.5">Nom de l&apos;organisation</label>
          <input
            id="orgName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label htmlFor="orgDesc" className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
          <textarea
            id="orgDesc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
          />
        </div>

        <div>
          <label htmlFor="orgLogo" className="text-sm font-medium text-gray-700 block mb-1.5">URL du logo</label>
          <div className="flex items-center gap-3">
            {logoUrl && (
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              id="orgLogo"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="orgWebsite" className="text-sm font-medium text-gray-700 block mb-1.5">
            <span className="flex items-center gap-2"><Globe size={14} /> Site web</span>
          </label>
          <input
            id="orgWebsite"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Enregistrer les modifications
        </button>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-red-100 p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <Trash2 size={20} className="text-destructive" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Zone dangereuse</h2>
            <p className="text-xs text-gray-500">Actions irréversibles</p>
          </div>
        </div>
        <button
          type="button"
          className="w-full px-4 py-3 text-sm font-semibold text-destructive border border-red-200 rounded-full hover:bg-red-50 transition-colors"
        >
          Supprimer l&apos;organisation
        </button>
        <p className="text-xs text-gray-400 mt-3">
          Cette action supprimera définitivement votre organisation et tous ses événements.
        </p>
      </motion.div>
    </div>
  );
}
