"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Settings,
  Home,
  Bell,
  ChevronDown,
  LogOut,
  User,
  HelpCircle,
  Search,
  Menu,
  X,
} from "lucide-react";
import { OrganizerProvider, useOrganizer } from "@/contexts/OrganizerContext";
import { useNotifications } from "@/contexts/NotificationsContext";

const sidebarItems = [
  { href: "/organizer/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/organizer/events", label: "Événements", icon: CalendarDays },
  { href: "/organizer/analytics", label: "Analytiques", icon: BarChart3 },
  { href: "/organizer/settings", label: "Paramètres", icon: Settings },
];

const mobileNavItems = [
  { href: "/organizer/dashboard", label: "Accueil", icon: LayoutDashboard },
  { href: "/organizer/events", label: "Événements", icon: CalendarDays },
  { href: "/organizer/analytics", label: "Stats", icon: BarChart3 },
  { href: "/organizer/settings", label: "Config", icon: Settings },
];

function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { org } = useOrganizer();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
          AD
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-medium text-foreground leading-tight">Amadou Diallo</p>
          <p className="text-[11px] text-muted-foreground leading-tight">{org.name}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform hidden lg:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl border border-border shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Amadou Diallo</p>
            <p className="text-xs text-muted-foreground">amadou.diallo@email.com</p>
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <User size={16} className="text-muted-foreground" />
              Mon profil
            </Link>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Home size={16} className="text-muted-foreground" />
              Retour au site
            </Link>
            <Link
              href="/support"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <HelpCircle size={16} className="text-muted-foreground" />
              Aide & Support
            </Link>
          </div>
          <div className="border-t border-border py-1">
            <button
              type="button"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors w-full"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrganizerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { org } = useOrganizer();
  const { unreadCount } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/organizer/dashboard"
      ? pathname === "/organizer/dashboard"
      : pathname.startsWith(href);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm h-14 shrink-0">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 -ml-1 rounded-lg hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/organizer/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                {org.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-foreground text-sm">{org.name}</span>
                <span className="ml-2 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md font-medium">
                  Organisateur
                </span>
              </div>
            </Link>
          </div>

          {/* Center: search (desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-9 pr-4 py-2 bg-muted border-none rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Right: notifications + profile dropdown */}
          <div className="flex items-center gap-1">
            <Link
              href="/notifications"
              className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
            <div className="w-px h-6 bg-border mx-1 hidden lg:block" />
            <ProfileDropdown />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Mobile sidebar overlay ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`fixed md:static top-14 bottom-0 left-0 z-40 w-60 bg-card border-r border-border flex flex-col transition-transform duration-200 md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {sidebarItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="p-3 border-t border-border">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Home size={18} />
              Retour au site
            </Link>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-8">{children}</main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="flex justify-between items-center h-16 px-4">
          {mobileNavItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[10px] ${active ? "font-semibold" : ""}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrganizerProvider>
      <OrganizerShell>{children}</OrganizerShell>
    </OrganizerProvider>
  );
}
