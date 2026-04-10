"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Ticket, User, Bell, Home } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationsContext";

const navLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/events", label: "Événements", icon: null },
  { href: "/search", label: "Rechercher", icon: Search },
];

const rightLinks = [
  { href: "/favorites", label: "Favoris", icon: Heart },
  { href: "/tickets", label: "Billets", icon: Ticket },
];

export default function DesktopNavbar() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="hidden md:block sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-primary shrink-0">
            Tukki Event
          </Link>
          <div className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive(href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {Icon && <Icon size={16} />}
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          {rightLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`p-2.5 rounded-lg transition-colors relative ${
                isActive(href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              aria-label={label}
              title={label}
            >
              <Icon size={20} />
            </Link>
          ))}
          <Link
            href="/notifications"
            className={`p-2.5 rounded-lg transition-colors relative ${
              isActive("/notifications")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            )}
          </Link>
          <Link
            href="/profile"
            className={`ml-2 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive("/profile")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <div className="w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
            <span className="text-sm font-medium hidden lg:inline">Profil</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
