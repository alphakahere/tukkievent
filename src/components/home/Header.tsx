"use client";

import Link from "next/link";
import { Search, Bell, SlidersHorizontal } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-40 md:hidden">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Tukki Event</h1>
            <p className="text-sm text-gray-500">Dakar, Sénégal</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell size={24} className="text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" aria-hidden />
            </button>
            <Link
              href="/profile"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Profil"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full" />
            </Link>
          </div>
        </div>

        <Link
          href="/search"
          className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-full"
        >
          <Search size={20} className="text-gray-400" />
          <span className="text-gray-400 flex-1 text-left text-sm">Rechercher un événement...</span>
          <SlidersHorizontal size={20} className="text-gray-400" />
        </Link>
      </div>
    </header>
  );
}
