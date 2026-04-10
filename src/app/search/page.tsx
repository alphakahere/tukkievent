"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, SlidersHorizontal, X } from "lucide-react";
import EventCard from "@/components/event/EventCard";
import BottomNav from "@/components/BottomNav";
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

type QuickFilterId = "all" | "today" | "weekend" | "free" | "cheap";

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [quickFilter, setQuickFilter] = useState<QuickFilterId>("all");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const weekendStart = new Date(todayStart);
  const dayOfWeek = now.getDay();
  const daysUntilSaturday = dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
  weekendStart.setDate(now.getDate() + daysUntilSaturday);
  const weekendEnd = new Date(weekendStart.getTime() + 2 * 24 * 60 * 60 * 1000);

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      !searchQuery.trim() ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.city && event.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.address && event.address.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      !selectedCategory || event.category?.name === selectedCategory;
    const eventStart = new Date(event.startDatetime).getTime();
    const minPrice = event.ticketTypes?.length
      ? Math.min(...event.ticketTypes.map((t) => t.price))
      : null;

    let matchesQuick = true;
    if (quickFilter === "today") {
      matchesQuick = eventStart >= todayStart.getTime() && eventStart < todayEnd.getTime();
    } else if (quickFilter === "weekend") {
      matchesQuick =
        eventStart >= weekendStart.getTime() && eventStart <= weekendEnd.getTime();
    } else if (quickFilter === "free") {
      matchesQuick = minPrice === 0;
    } else if (quickFilter === "cheap") {
      matchesQuick = minPrice !== null && minPrice < 5000;
    }

    return matchesSearch && matchesCategory && matchesQuick;
  });

  const quickFilters: { id: QuickFilterId; label: string; active: boolean }[] = [
    { id: "all", label: "Tous", active: quickFilter === "all" },
    { id: "today", label: "Aujourd'hui", active: quickFilter === "today" },
    { id: "weekend", label: "Ce weekend", active: quickFilter === "weekend" },
    { id: "free", label: "Gratuit", active: quickFilter === "free" },
    { id: "cheap", label: "Moins de 5000 FCFA", active: quickFilter === "cheap" },
  ];

  return (
    <div className="min-h-screen bg-muted pb-24 md:pb-8">
      <header className="bg-card px-4 pt-12 md:pt-4 pb-4 shadow-sm sticky top-0 z-40 border-b border-border md:top-16">
        <div className="max-w-lg md:max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 -ml-2"
              aria-label="Retour"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un événement..."
                className="w-full pl-12 pr-4 py-3 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X size={20} className="text-muted-foreground" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-muted rounded-lg"
              aria-label="Filtres"
            >
              <SlidersHorizontal size={20} className="text-foreground" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {quickFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setQuickFilter(filter.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full transition-all ${
                  filter.active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-lg md:max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3">Catégories</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full transition-all ${
                !selectedCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              Tous
            </button>
            {mockCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(selectedCategory === category.name ? null : category.name)
                }
                className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
                  selectedCategory === category.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                <span>{getCategoryIcon(category.name)}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1 ? "résultat trouvé" : "résultats trouvés"}
          </p>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Aucun événement trouvé
            </h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
