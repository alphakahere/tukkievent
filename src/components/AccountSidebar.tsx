"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Ticket,
  Heart,
  Bell,
  Settings,
  CreditCard,
  BarChart3,
  HelpCircle,
  Briefcase,
  LogOut,
} from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useNotifications } from "@/contexts/NotificationsContext";

const menuItems = [
  { icon: User, label: "Mon profil", path: "/profile", color: "#FF6B35" },
  { icon: Briefcase, label: "Dashboard Organisateur", path: "/organizer/dashboard", color: "#FF6B35" },
  { icon: Ticket, label: "Mes billets", path: "/tickets", color: "#FF6B35" },
  { icon: Heart, label: "Favoris", path: "/favorites", color: "#EF4444", badge: "favorites" as const },
  { icon: Bell, label: "Notifications", path: "/notifications", color: "#F59E0B", badge: "notifications" as const },
  { icon: BarChart3, label: "Historique", path: "/history", color: "#3B82F6" },
  { icon: CreditCard, label: "Moyens de paiement", path: "/payment-methods", color: "#10B981" },
  { icon: Settings, label: "Paramètres", path: "/settings", color: "#6B7280" },
  { icon: HelpCircle, label: "Aide & Support", path: "/support", color: "#8B5CF6" },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { favoriteIds } = useFavorites();
  const { unreadCount } = useNotifications();

  const isActive = (path: string) =>
    path === "/profile" ? pathname === "/profile" : pathname.startsWith(path);

  function getBadge(badge?: "favorites" | "notifications") {
    if (badge === "favorites" && favoriteIds.length > 0) return favoriteIds.length;
    if (badge === "notifications" && unreadCount > 0) return unreadCount;
    return null;
  }

  return (
    <aside className="hidden md:block w-64 shrink-0">
      <div className="sticky top-20 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* User header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
              AD
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">Amadou Diallo</p>
              <p className="text-xs text-muted-foreground truncate">amadou.diallo@email.com</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const badge = getBadge(item.badge);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={18} style={active ? { color: item.color } : undefined} />
                <span className="flex-1">{item.label}</span>
                {badge && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-border">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>
    </aside>
  );
}
