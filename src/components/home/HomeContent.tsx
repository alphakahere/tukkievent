"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "./Header";
import Hero from "./Hero";
import EventCard from "@/components/event/EventCard";
import EventCardSkeleton from "@/components/event/EventCardSkeleton";
import BottomNav from "@/components/BottomNav";
import { Skeleton } from "@/components/ui/skeleton";
import { mockCategories, mockEvents } from "@/lib/mockData";

const CATEGORY_ICONS: Record<string, string> = {
  Concert: "🎵",
  Sport: "⚽",
  Conférence: "🎤",
  Festival: "🎪",
  Théâtre: "🎭",
  Art: "🎨",
  Gastronomie: "🍽️",
  Défaut: "🎫",
};

function getCategoryIcon(name: string): string {
  return CATEGORY_ICONS[name] ?? CATEGORY_ICONS.Défaut;
}

export default function HomeContent() {
  const events = mockEvents;
  const categories = mockCategories;
  const isLoading = false;
  const categoriesLoading = false;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const nearbyEvents = events.slice(0, 4);
  const popularEvents = events.slice(0, 6);
  const sortedByDate = [...events].sort(
    (a, b) => new Date(b.startDatetime).getTime() - new Date(a.startDatetime).getTime()
  );
  const newEvents = sortedByDate.slice(0, 4);

  return (
    <div className="min-h-screen bg-muted pb-24 md:pb-8">
      <Header />

      <div className="max-w-lg mx-auto">
        <Hero events={events} />

        {/* Categories */}
        <section className="px-4 py-4">
          <h2 className="font-bold text-xl mb-4 text-foreground">🎭 Par catégorie</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {categoriesLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 w-24 rounded-full bg-muted animate-pulse flex-shrink-0" />
                ))
              : categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(selectedCategory === category.id ? null : category.id)
                    }
                    className={`flex-shrink-0 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="mr-2">{getCategoryIcon(category.name)}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
          </div>
        </section>

        {/* Nearby Events */}
        <section className="px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl text-foreground">📍 Près de chez vous</h2>
            <Link href="/events" className="text-primary text-sm font-semibold">
              Voir tout
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-44 flex-shrink-0 rounded-xl overflow-hidden bg-card border border-border">
                    <Skeleton className="h-28 w-full" />
                    <div className="p-2 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))
              : nearbyEvents.map((event) => (
                  <EventCard key={event.id} event={event} compact />
                ))}
          </div>
        </section>

        {/* Popular Events */}
        <section className="px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl text-foreground">🔥 Événements populaires</h2>
            <Link href="/events" className="text-primary text-sm font-semibold">
              Voir tout
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)
              : popularEvents.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </section>

        {/* New Events */}
        <section className="px-4 py-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl text-foreground">✨ Nouveautés</h2>
            <Link href="/events" className="text-primary text-sm font-semibold">
              Voir tout
            </Link>
          </div>
          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4 bg-card rounded-xl p-3">
                    <div className="w-24 h-24 rounded-lg bg-muted animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))
              : newEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="flex gap-4 bg-card rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow border border-border"
                  >
                    <Image
                      src={event.coverImageUrl}
                      alt={event.title}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-1 bg-tukki-success/10 text-tukki-success rounded-full text-xs font-semibold mb-1">
                        NOUVEAU
                      </span>
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1 text-foreground">
                        {event.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-1">
                        {new Date(event.startDatetime).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-primary font-bold text-sm">
                        {event.ticketTypes?.length
                          ? (() => {
                              const min = Math.min(
                                ...event.ticketTypes.map((t) => t.price).filter(Boolean)
                              );
                              return min === 0 ? "Gratuit" : `${min.toLocaleString()} FCFA`;
                            })()
                          : "—"}
                      </p>
                    </div>
                  </Link>
                ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
