"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Search, User, Bell, Home, Briefcase } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationsContext";

const navLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/events", label: "Événements", icon: null },
  { href: "/search", label: "Rechercher", icon: Search },
];


export default function DesktopNavbar() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-100">
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive(href)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
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
              AD
            </div>
            <span className="text-sm font-medium hidden lg:inline">Profil</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
