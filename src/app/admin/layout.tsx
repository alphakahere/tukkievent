"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ShoppingBag,
  Flag,
  Tag,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  Home,
  Building2,
  Shield,
} from "lucide-react";
import { AdminProvider } from "@/contexts/AdminContext";
import { RoleGuard } from "@/components/auth/RoleGuard";

const sidebarItems = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/organizers", label: "Organisateurs", icon: Building2 },
  { href: "/admin/events", label: "Événements", icon: CalendarDays },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/categories", label: "Catégories", icon: Tag },
  { href: "/admin/reports", label: "Signalements", icon: Flag },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

const mobileNavItems = [
  { href: "/admin/dashboard", label: "Accueil", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/settings", label: "Config", icon: Settings },
];

function AdminProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
          AD
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-gray-900 leading-tight">Admin</p>
          <p className="text-[11px] text-gray-500 leading-tight">Super Admin</p>
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform hidden lg:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-200 shadow-sm z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">admin@tukkiapp.com</p>
          </div>
          <div className="py-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Home size={16} className="text-gray-400" />
              Retour au site
            </Link>
          </div>
          <div className="border-t border-gray-100 py-1">
            <button
              type="button"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
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

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin/dashboard"
      ? pathname === "/admin/dashboard" || pathname === "/admin"
      : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Fixed sidebar — desktop only */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-60 bg-white border-r border-gray-100 flex-col z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center shrink-0">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900">TukkiEvent</span>
              <span className="ml-2 text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-semibold">
                Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {sidebarItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-rose-50 text-rose-600"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                {label}
                {href === "/admin/reports" && (
                  <span className="ml-auto text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                    3
                  </span>
                )}
                {href === "/admin/events" && (
                  <span className="ml-auto text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                    2
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Home size={18} strokeWidth={2} />
            Retour au site
          </Link>
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut size={18} strokeWidth={2} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Top bar — all screens, offset by sidebar on desktop */}
      <header className="md:ml-60 sticky top-0 z-30 bg-white border-b border-gray-100 h-16">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 md:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center shrink-0">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">
              TukkiEvent <span className="text-rose-600">Admin</span>
            </span>
          </Link>
          {/* Spacer on desktop so actions stay right-aligned */}
          <div className="hidden md:block" />
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                5
              </span>
            </button>
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors ml-1"
            >
              <Home size={15} />
              Retour au site
            </Link>
            <div className="w-px h-6 bg-gray-200 mx-1 hidden md:block" />
            <AdminProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main content — offset by sidebar width on desktop */}
      <main className="md:ml-60 pb-20 md:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="flex justify-between items-center h-16 px-4">
          {mobileNavItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors ${
                  active ? "text-rose-500" : "text-gray-400"
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allow={["ADMIN"]}>
      <AdminProvider>
        <AdminShell>{children}</AdminShell>
      </AdminProvider>
    </RoleGuard>
  );
}
