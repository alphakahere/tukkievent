"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Building2, Globe, FileText, Trash2 } from "lucide-react";
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
    <div className="p-4 md:p-6 max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Paramètres de l&apos;organisation</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-5"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Informations générales</h2>
            <p className="text-xs text-muted-foreground">Détails publics de votre organisation</p>
          </div>
        </div>

        <div>
          <label htmlFor="orgName" className="text-sm font-medium text-foreground block mb-1.5">Nom de l&apos;organisation</label>
          <input id="orgName" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <div>
          <label htmlFor="orgDesc" className="text-sm font-medium text-foreground block mb-1.5">Description</label>
          <textarea id="orgDesc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
        </div>

        <div>
          <label htmlFor="orgLogo" className="text-sm font-medium text-foreground block mb-1.5">URL du logo</label>
          <div className="flex items-center gap-3">
            {logoUrl && (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-border shrink-0">
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              </div>
            )}
            <input id="orgLogo" type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." className="flex-1 px-4 py-3 rounded-xl border border-border bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div>
          <label htmlFor="orgWebsite" className="text-sm font-medium text-foreground block mb-1.5">
            <span className="flex items-center gap-2"><Globe size={14} /> Site web</span>
          </label>
          <input id="orgWebsite" type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Enregistrer les modifications
        </button>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-destructive/30 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <Trash2 size={20} className="text-destructive" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Zone dangereuse</h2>
            <p className="text-xs text-muted-foreground">Actions irréversibles</p>
          </div>
        </div>
        <button
          type="button"
          className="w-full px-4 py-3 text-sm font-medium text-destructive border-2 border-destructive rounded-xl hover:bg-destructive/5 transition-colors"
        >
          Supprimer l&apos;organisation
        </button>
        <p className="text-xs text-muted-foreground mt-2">
          Cette action supprimera définitivement votre organisation et tous ses événements.
        </p>
      </motion.div>
    </div>
  );
}
