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
  { icon: Briefcase, label: "Dashboard Organisateur", path: "/organizer/dashboard", color: "#FF6B35", highlight: true },
  { icon: Ticket, label: "Mes billets", path: "/tickets", color: "#FF6B35" },
  { icon: Heart, label: "Favoris", path: "/favorites", color: "#EF4444", count: true },
  { icon: Bell, label: "Notifications", path: "/notifications", color: "#F59E0B" },
  { icon: Settings, label: "Paramètres", path: "/settings", color: "#6B7280" },
  { icon: CreditCard, label: "Moyens de paiement", path: "/payment-methods", color: "#10B981" },
  { icon: BarChart3, label: "Historique", path: "/history", color: "#3B82F6" },
  { icon: HelpCircle, label: "Aide & Support", path: "/support", color: "#8B5CF6" },
];

export default function ProfilePage() {
  const { favoriteIds } = useFavorites();
  const favoritesCount = favoriteIds.length;

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
      {/* Mobile header */}
      <header className="bg-white border-b border-gray-100 px-4 pt-12 pb-6 md:hidden">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
            <Link
              href="/profile/edit"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Modifier le profil"
            >
              <Edit size={18} className="text-gray-600" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                  AD
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-gray-900">Amadou Diallo</p>
                <p className="text-sm text-gray-500 truncate">amadou.diallo@email.com</p>
                <p className="text-sm text-gray-500">+221 77 123 45 67</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xl font-bold text-primary">12</p>
                <p className="text-xs font-medium text-gray-500">Événements</p>
              </div>
              <div className="text-center border-x border-gray-100">
                <p className="text-xl font-bold text-primary">{favoritesCount}</p>
                <p className="text-xs font-medium text-gray-500">Favoris</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-primary">24</p>
                <p className="text-xs font-medium text-gray-500">Points</p>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-lg md:max-w-5xl mx-auto px-4 py-6">
        <div className="md:flex md:gap-8">
          <AccountSidebar />

          <div className="flex-1">
            {/* Desktop user card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:block bg-white rounded-2xl p-6 border border-gray-100 mb-6"
            >
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    AD
                  </div>
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xl font-bold text-gray-900">Amadou Diallo</p>
                    <Link
                      href="/profile/edit"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      <Edit size={14} />
                      Modifier
                    </Link>
                  </div>
                  <p className="text-sm text-gray-500">amadou.diallo@email.com</p>
                  <p className="text-sm text-gray-500">+221 77 123 45 67</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-5 mt-5 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-sm font-medium text-gray-500">Événements</p>
                </div>
                <div className="text-center border-x border-gray-100">
                  <p className="text-2xl font-bold text-primary">{favoritesCount}</p>
                  <p className="text-sm font-medium text-gray-500">Favoris</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">24</p>
                  <p className="text-sm font-medium text-gray-500">Points</p>
                </div>
              </div>
            </motion.div>

            {/* Mobile menu */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 mb-4 md:hidden"
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const count = item.count === true ? favoritesCount : undefined;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                      index !== menuItems.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon size={18} style={{ color: item.color }} />
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-900">{item.label}</span>
                    {count !== undefined && count > 0 && (
                      <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                        {count}
                      </span>
                    )}
                    <ChevronRight size={16} className="text-gray-300 shrink-0" />
                  </Link>
                );
              })}
            </motion.div>

            {/* App info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-100 mb-4"
            >
              {[
                { label: "Version de l'app", value: "1.0.0" },
                { label: "Langue", value: "Français" },
                { label: "Thème", value: "Clair" },
              ].map(({ label, value }, i, arr) => (
                <div
                  key={label}
                  className={`flex items-center justify-between px-4 py-3.5 ${i !== arr.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </motion.div>

            {/* Logout */}
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full bg-white text-destructive border border-red-200 py-3.5 px-6 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors md:hidden"
            >
              <LogOut size={18} />
              Déconnexion
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-8 pb-4"
            >
              <p className="text-sm text-gray-400 mb-2">Tukki Event · Votre compagnon événementiel</p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400 flex-wrap">
                <Link href="/terms" className="hover:text-primary transition-colors">Conditions d&apos;utilisation</Link>
                <span>·</span>
                <Link href="/privacy" className="hover:text-primary transition-colors">Confidentialité</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
