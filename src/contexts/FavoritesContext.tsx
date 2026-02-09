"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "tukki-event-favorites";

type FavoritesContextValue = {
  favoriteIds: string[];
  isFavorite: (eventId: string) => boolean;
  toggleFavorite: (eventId: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        if (Array.isArray(parsed)) setFavoriteIds(parsed);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // ignore
    }
  }, [mounted, favoriteIds]);

  const isFavorite = useCallback(
    (eventId: string) => favoriteIds.includes(eventId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback((eventId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  }, []);

  const value: FavoritesContextValue = { favoriteIds, isFavorite, toggleFavorite };

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
