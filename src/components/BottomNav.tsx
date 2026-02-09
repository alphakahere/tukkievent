"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Ticket, Heart, User } from "lucide-react";

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/search", label: "Découvrir", icon: Search },
  { href: "/tickets", label: "Billets", icon: Ticket },
  { href: "/favorites", label: "Favoris", icon: Heart },
  { href: "/profile", label: "Profil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] transition-colors ${isActive ? "font-semibold" : ""}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
