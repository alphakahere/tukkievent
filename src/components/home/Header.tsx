"use client";

import Link from "next/link";
import { Search, Bell, SlidersHorizontal } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-card px-4 pt-12 pb-4 shadow-sm sticky top-0 z-40">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Tukki Event</h1>
            <p className="text-sm text-muted-foreground">Dakar, Sénégal</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="relative p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell size={24} className="text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" aria-hidden />
            </button>
            <Link
              href="/profile"
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Profil"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full" />
            </Link>
          </div>
        </div>

        <Link
          href="/search"
          className="flex items-center gap-3 bg-muted px-4 py-3 rounded-lg"
        >
          <Search size={20} className="text-muted-foreground" />
          <span className="text-muted-foreground flex-1 text-left">Rechercher un événement...</span>
          <SlidersHorizontal size={20} className="text-muted-foreground" />
        </Link>
      </div>
    </header>
  );
}
