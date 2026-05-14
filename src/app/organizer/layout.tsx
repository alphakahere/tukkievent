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
  Building2,
  Loader2,
  Plus,
} from "lucide-react";
import { OrganizerOrgProvider, useOrganizerOrg } from "@/contexts/OrganizerOrgContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { LogoutConfirmDialog } from "@/components/auth/LogoutConfirmDialog";
import { useAppSelector } from "@/store/features/hooks";
import { selectAuthUser } from "@/store/selectors/auth.selectors";

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
  { href: "/", label: "Utilisateur", icon: Home },
];

function ProfileDropdown({ onLogoutRequest }: { onLogoutRequest: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = useAppSelector(selectAuthUser);
  const { activeOrg } = useOrganizerOrg();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user
    ? `${user.firstname[0] ?? ""}${user.lastname[0] ?? ""}`.toUpperCase() || "?"
    : "?";
  const fullName = user ? `${user.firstname} ${user.lastname}` : "Organisateur";
  const orgLabel = activeOrg?.name ?? "—";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-gray-900 leading-tight">{fullName}</p>
          <p className="text-[11px] text-gray-500 leading-tight">{orgLabel}</p>
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform hidden lg:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-200 shadow-sm z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email ?? ""}</p>
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User size={16} className="text-gray-400" />
              Mon profil
            </Link>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Home size={16} className="text-gray-400" />
              Retour au site
            </Link>
            <Link
              href="/support"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <HelpCircle size={16} className="text-gray-400" />
              Aide & Support
            </Link>
          </div>
          <div className="border-t border-gray-100 py-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogoutRequest();
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-red-50 transition-colors w-full"
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

function NoOrganizationState() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <Building2 size={26} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Créez votre organisation
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Pour accéder à l&apos;espace organisateur, vous devez d&apos;abord créer votre organisation.
        </p>
        <Link
          href="/become-organizer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Créer mon organisation
        </Link>
      </div>
    </div>
  );
}

function FullPageLoader() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
      <Loader2 size={28} className="text-primary animate-spin" />
    </div>
  );
}

function OrganizerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeOrg, isLoading, hasNoOrg } = useOrganizerOrg();
  const { unreadCount } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/organizer/dashboard"
      ? pathname === "/organizer/dashboard"
      : pathname.startsWith(href);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading) return <FullPageLoader />;
  if (hasNoOrg) return <NoOrganizationState />;

  const orgName = activeOrg?.name ?? "Organisation";
  const orgInitial = orgName.charAt(0);

  return (
    <div className="h-screen bg-[#F7F7F7] flex flex-col">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 h-16 shrink-0">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 -ml-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/organizer/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
                {orgInitial}
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-semibold text-gray-900">{orgName}</span>
                <span className="ml-2 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-semibold">
                  Organisateur
                </span>
              </div>
            </Link>
          </div>

          {/* Center: search (desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Right: notifications + switch + profile dropdown */}
          <div className="flex items-center gap-1">
            <Link
              href="/notifications"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
            {/* Switch to user mode — desktop */}
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors ml-1"
            >
              <Home size={15} />
              <span className="hidden lg:inline">Mode utilisateur</span>
            </Link>
            <div className="w-px h-6 bg-gray-200 mx-1 hidden lg:block" />
            <ProfileDropdown onLogoutRequest={() => setLogoutOpen(true)} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Mobile sidebar overlay ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`fixed md:static top-16 bottom-0 left-0 z-40 w-60 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200 md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(href)
                    ? "bg-primary text-white"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} strokeWidth={isActive(href) ? 2.5 : 2} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-100 space-y-1">
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-destructive hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} strokeWidth={2} />
              Déconnexion
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-8">{children}</main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="flex justify-between items-center h-16 px-4">
          {mobileNavItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors ${
                  active ? "text-primary" : "text-gray-400"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[10px] ${active ? "font-semibold" : ""}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  );
}

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allow={["ORGANIZER", "ADMIN"]}>
      <OrganizerOrgProvider>
        <OrganizerShell>{children}</OrganizerShell>
      </OrganizerOrgProvider>
    </RoleGuard>
  );
}
