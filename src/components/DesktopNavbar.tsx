"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Search, User, Bell, Briefcase, LogIn } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useAppSelector } from "@/store/features/hooks";

export default function DesktopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const user = useAppSelector((s) => s.auth.user);
  const isAuthenticated = Boolean(useAppSelector((s) => s.auth.accessToken));
  const [query, setQuery] = useState("");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const initials = user
    ? `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase()
    : "";

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <nav className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary shrink-0">
          Tukki Event
        </Link>

        {/* Search trigger */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl"
          role="search"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un événement, un artiste, un lieu…"
              className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              aria-label="Rechercher"
            />
          </div>
        </form>

        {/* Right: actions */}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          {isAuthenticated && (
            <Link
              href="/notifications"
              className={`p-2.5 rounded-full transition-colors relative ${
                isActive("/notifications")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              }`}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link
                href="/organizer/dashboard"
                className="ml-1 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                title="Mode organisateur"
              >
                <Briefcase size={16} />
                <span className="hidden lg:inline">Mode organisateur</span>
              </Link>
              <Link
                href="/profile"
                className={`ml-2 flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                  isActive("/profile")
                    ? "bg-primary/10 text-primary"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {initials || <User size={14} />}
                </div>
                <span className="text-sm font-medium hidden lg:inline">Profil</span>
              </Link>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="ml-1 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity"
            >
              <LogIn size={16} />
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
