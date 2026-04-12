"use client";

import Link from "next/link";
import EventCard from "@/components/event/EventCard";
import BottomNav from "@/components/BottomNav";
import { useFavorites } from "@/contexts/FavoritesContext";
import { mockEvents } from "@/lib/mockData";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const favoriteEvents = mockEvents.filter((e) => favoriteIds.includes(e.id));

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-40 md:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-primary">Tukki Event</Link>
          <span className="text-sm font-medium text-gray-500">Favoris</span>
        </div>
      </header>

      <main className="max-w-lg md:max-w-6xl mx-auto px-4 py-6">
        {favoriteEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={36} className="text-gray-300" />
            </div>
            <p className="text-base font-semibold text-gray-900 mb-1">Aucun favori pour le moment</p>
            <p className="text-sm text-gray-500 mb-6">Ajoutez des événements à vos favoris en cliquant sur le cœur</p>
            <Link
              href="/events"
              className="inline-block px-6 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Découvrir les événements
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-500 mb-4">
              {favoriteEvents.length} événement{favoriteEvents.length !== 1 ? "s" : ""} en favori
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
