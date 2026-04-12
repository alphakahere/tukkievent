"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X } from "lucide-react";
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
      matchesQuick = eventStart >= weekendStart.getTime() && eventStart <= weekendEnd.getTime();
    } else if (quickFilter === "free") {
      matchesQuick = minPrice === 0;
    } else if (quickFilter === "cheap") {
      matchesQuick = minPrice !== null && minPrice < 5000;
    }

    return matchesSearch && matchesCategory && matchesQuick;
  });

  const quickFilters: { id: QuickFilterId; label: string }[] = [
    { id: "all", label: "Tous" },
    { id: "today", label: "Aujourd'hui" },
    { id: "weekend", label: "Ce weekend" },
    { id: "free", label: "Gratuit" },
    { id: "cheap", label: "Moins de 5 000 FCFA" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
      <header className="bg-white border-b border-gray-100 px-4 pt-12 md:pt-4 pb-4 sticky top-0 z-40 md:top-16">
        <div className="max-w-lg md:max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0"
              aria-label="Retour"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un événement..."
                className="w-full pl-11 pr-10 py-3 bg-gray-100 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {quickFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setQuickFilter(filter.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  quickFilter === filter.id
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:bg-primary/5"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-lg md:max-w-6xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Catégories</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:bg-primary/5"
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedCategory === category.name
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:bg-primary/5"
                }`}
              >
                <span>{getCategoryIcon(category.name)}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="text-sm text-gray-500 mb-4">
          {filteredEvents.length}{" "}
          {filteredEvents.length === 1 ? "résultat trouvé" : "résultats trouvés"}
        </p>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <p className="text-base font-semibold text-gray-900 mb-1">Aucun événement trouvé</p>
            <p className="text-sm text-gray-500">Essayez de modifier vos critères de recherche</p>
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
