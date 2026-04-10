"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ChevronRight,
  Ticket,
  Heart,
  Bell,
  Settings,
  CreditCard,
  BarChart3,
  HelpCircle,
  LogOut,
  Edit,
  Briefcase,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import AccountSidebar from "@/components/AccountSidebar";
import { useFavorites } from "@/contexts/FavoritesContext";

const menuItems = [
  {
    icon: Briefcase,
    label: "Dashboard Organisateur",
    path: "/organizer/dashboard",
    color: "#FF6B35",
    highlight: true,
  },
  { icon: Ticket, label: "Mes billets", path: "/tickets", color: "#FF6B35" },
  { icon: Heart, label: "Favoris", path: "/favorites", color: "#EF4444", count: true },
  { icon: Bell, label: "Notifications", path: "/notifications", color: "#F59E0B" },
  { icon: Settings, label: "Paramètres", path: "/settings", color: "#6B7280" },
  {
    icon: CreditCard,
    label: "Moyens de paiement",
    path: "/payment-methods",
    color: "#10B981",
  },
  { icon: BarChart3, label: "Historique", path: "/history", color: "#3B82F6" },
  { icon: HelpCircle, label: "Aide & Support", path: "/support", color: "#8B5CF6" },
];

export default function ProfilePage() {
  const { favoriteIds } = useFavorites();
  const favoritesCount = favoriteIds.length;

  return (
    <div className="min-h-screen bg-muted pb-24 md:pb-8">
      {/* Mobile header */}
      <header className="bg-gradient-to-br from-primary to-secondary px-4 pt-12 pb-8 md:hidden">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Profil</h1>
            <Link
              href="/profile/edit"
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
              aria-label="Modifier le profil"
            >
              <Edit size={20} className="text-white" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-xl border border-border"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  AD
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-tukki-success rounded-full border-4 border-card" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground">Amadou Diallo</h2>
                <p className="text-sm text-muted-foreground truncate">
                  amadou.diallo@email.com
                </p>
                <p className="text-sm text-muted-foreground">+221 77 123 45 67</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-xs text-muted-foreground">Événements</p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-2xl font-bold text-primary">{favoritesCount}</p>
                <p className="text-xs text-muted-foreground">Favoris</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">24</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Desktop layout */}
      <div className="max-w-lg md:max-w-5xl mx-auto px-4 py-6">
        <div className="md:flex md:gap-8">
          <AccountSidebar />

          {/* Main content */}
          <div className="flex-1">
            {/* Desktop user card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:block bg-card rounded-2xl p-6 shadow-sm border border-border mb-6"
            >
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground text-3xl font-bold">
                    AD
                  </div>
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-tukki-success rounded-full border-4 border-card" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-2xl font-bold text-foreground">Amadou Diallo</h2>
                    <Link
                      href="/profile/edit"
                      className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Modifier
                    </Link>
                  </div>
                  <p className="text-muted-foreground">amadou.diallo@email.com</p>
                  <p className="text-muted-foreground">+221 77 123 45 67</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-border">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">12</p>
                  <p className="text-sm text-muted-foreground">Événements</p>
                </div>
                <div className="text-center border-x border-border">
                  <p className="text-3xl font-bold text-primary">{favoritesCount}</p>
                  <p className="text-sm text-muted-foreground">Favoris</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">24</p>
                  <p className="text-sm text-muted-foreground">Points</p>
                </div>
              </div>
            </motion.div>

            {/* Mobile menu - hidden on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl overflow-hidden shadow-sm mb-4 border border-border md:hidden"
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const count = item.count === true ? favoritesCount : undefined;
                return (
                  <motion.div key={item.path} whileTap={{ scale: 0.98 }}>
                    <Link
                      href={item.path}
                      className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                        index !== menuItems.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <Icon size={20} style={{ color: item.color }} />
                      </div>
                      <span className="flex-1 font-medium text-foreground">{item.label}</span>
                      {count !== undefined && count > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                          {count}
                        </span>
                      )}
                      <ChevronRight size={20} className="text-muted-foreground shrink-0" />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* App info - visible on both */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-4 mb-4 shadow-sm border border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Version de l&apos;app</span>
                <span className="text-sm font-semibold text-foreground">1.0.0</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Langue</span>
                <span className="text-sm font-semibold text-foreground">Français</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Thème</span>
                <span className="text-sm font-semibold text-foreground">Clair</span>
              </div>
            </motion.div>

            {/* Logout - mobile only */}
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-card text-destructive border-2 border-destructive py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-destructive/5 transition-colors md:hidden"
            >
              <LogOut size={20} />
              Déconnexion
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-8 pb-4"
            >
              <p className="text-sm text-muted-foreground mb-2">
                Tukki Event - Votre compagnon événementiel
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground flex-wrap">
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Conditions d&apos;utilisation
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Confidentialité
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
