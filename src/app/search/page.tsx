"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Search, X } from "lucide-react";
import EventCard from "@/components/event/EventCard";
import EventCardSkeleton from "@/components/event/EventCardSkeleton";
import BottomNav from "@/components/BottomNav";
import { useListVisitorEventsQuery } from "@/store/api/event/event.api";
import { useListVisitorEventCategoriesQuery } from "@/store/api/event-categories/event-categories.api";

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
  const params = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(params.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quickFilter, setQuickFilter] = useState<QuickFilterId>("all");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data: categories } = useListVisitorEventCategoriesQuery();

  const filterParams = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const dayOfWeek = now.getDay();
    const daysUntilSaturday = dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
    const weekendStart = new Date(todayStart);
    weekendStart.setDate(now.getDate() + daysUntilSaturday);
    const weekendEnd = new Date(weekendStart.getTime() + 2 * 24 * 60 * 60 * 1000);

    const out: Record<string, string | number | boolean | undefined> = {
      limit: 30,
    };
    if (debouncedQuery) out.q = debouncedQuery;
    if (selectedCategory) out.categoryId = selectedCategory;
    if (quickFilter === "today") {
      out.startDateFrom = todayStart.toISOString();
      out.startDateTo = todayEnd.toISOString();
    } else if (quickFilter === "weekend") {
      out.startDateFrom = weekendStart.toISOString();
      out.startDateTo = weekendEnd.toISOString();
    } else if (quickFilter === "free") {
      out.priceMax = 0;
    } else if (quickFilter === "cheap") {
      out.priceMax = 5000;
    }
    return out;
  }, [debouncedQuery, selectedCategory, quickFilter]);

  const { data, isLoading, isFetching } = useListVisitorEventsQuery(filterParams);
  const events = data?.data ?? [];
  const showSkeleton = isLoading || (isFetching && events.length === 0);

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
            <div className="flex-1 relative md:max-w-3xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un événement..."
                className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
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
            {(categories ?? []).map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(selectedCategory === category.id ? null : category.id)
                }
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedCategory === category.id
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
          {showSkeleton
            ? "Recherche en cours..."
            : `${events.length} ${events.length === 1 ? "résultat trouvé" : "résultats trouvés"}`}
        </p>

        {showSkeleton ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <p className="text-base font-semibold text-gray-900 mb-1">Aucun événement trouvé</p>
            <p className="text-sm text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
