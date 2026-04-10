"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Sun, Moon, DollarSign, Bell, BellOff, Mail, MessageSquare } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import BottomNav from "@/components/BottomNav";

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  id: string;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        checked ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
      {children}
    </p>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateTheme, updateCurrency, updateNotificationPref } = useSettings();

  return (
    <div className="min-h-screen bg-muted pb-24 md:pb-8">
      <header className="bg-card px-4 pt-12 pb-4 shadow-sm sticky top-0 z-40 border-b border-border">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft size={24} className="text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Apparence */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <SectionTitle>Apparence</SectionTitle>
          <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
            <div className="p-4 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  {settings.theme === "light" ? (
                    <Sun size={20} className="text-amber-500" />
                  ) : (
                    <Moon size={20} className="text-indigo-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">Thème</p>
                  <p className="text-xs text-muted-foreground">
                    {settings.theme === "light" ? "Mode clair" : "Mode sombre"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateTheme("light")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    settings.theme === "light"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Clair
                </button>
                <button
                  type="button"
                  onClick={() => updateTheme("dark")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    settings.theme === "dark"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Sombre
                </button>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign size={20} className="text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Devise</p>
                  <p className="text-xs text-muted-foreground">Affichage des prix</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateCurrency("XOF")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    settings.currency === "XOF"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  XOF
                </button>
                <button
                  type="button"
                  onClick={() => updateCurrency("EUR")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    settings.currency === "EUR"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  EUR
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SectionTitle>Notifications</SectionTitle>
          <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border divide-y divide-border">
            {[
              {
                key: "push" as const,
                label: "Notifications push",
                description: "Rappels et confirmations",
                Icon: Bell,
                color: "#F59E0B",
              },
              {
                key: "email" as const,
                label: "Notifications email",
                description: "Reçus et confirmations",
                Icon: Mail,
                color: "#3B82F6",
              },
              {
                key: "sms" as const,
                label: "Notifications SMS",
                description: "Alertes importantes uniquement",
                Icon: MessageSquare,
                color: "#10B981",
              },
            ].map(({ key, label, description, Icon, color }) => (
              <div key={key} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    {settings.notifications[key] ? (
                      <Icon size={20} style={{ color }} />
                    ) : (
                      <BellOff size={20} className="text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
                <Toggle
                  id={`notif-${key}`}
                  checked={settings.notifications[key]}
                  onChange={(val) => updateNotificationPref(key, val)}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* App info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionTitle>À propos</SectionTitle>
          <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border divide-y divide-border">
            {[
              { label: "Version", value: "1.0.0" },
              { label: "Langue", value: "Français" },
            ].map(({ label, value }) => (
              <div key={label} className="px-4 py-3.5 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <SectionTitle>Zone dangereuse</SectionTitle>
          <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-destructive/30">
            <button
              type="button"
              className="w-full px-4 py-4 text-left text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
            >
              Supprimer mon compte
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 px-1">
            Cette action est irréversible. Toutes vos données seront effacées.
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
