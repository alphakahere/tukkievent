"use client";

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/store/features/hooks";
import { selectIsAuthenticated } from "@/store/selectors/auth.selectors";
import {
	type Favorite,
	useAddFavoriteMutation,
	useListMyFavoritesQuery,
	useRemoveFavoriteMutation,
} from "@/store/api/favorites/favorites.api";

const STORAGE_KEY = "tukki-event-favorites";

type FavoritesContextValue = {
	favoriteIds: string[];
	/** Full payload — only populated when the user is authenticated. */
	favorites: Favorite[];
	isFavorite: (eventId: string) => boolean;
	toggleFavorite: (eventId: string) => void;
	isLoading: boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	// Guest fallback: keep favorite event ids in localStorage until login.
	const [localIds, setLocalIds] = useState<string[]>([]);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw) as string[];
				if (Array.isArray(parsed)) setLocalIds(parsed);
			}
		} catch {
			/* ignore */
		}
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted || isAuthenticated) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(localIds));
		} catch {
			/* ignore */
		}
	}, [mounted, localIds, isAuthenticated]);

	const {
		data: serverFavorites,
		isLoading: serverLoading,
	} = useListMyFavoritesQuery(undefined, { skip: !isAuthenticated });
	const [addFavorite] = useAddFavoriteMutation();
	const [removeFavorite] = useRemoveFavoriteMutation();

	const favorites = useMemo<Favorite[]>(
		() => (isAuthenticated ? (serverFavorites ?? []) : []),
		[isAuthenticated, serverFavorites],
	);

	const favoriteIds = useMemo<string[]>(
		() =>
			isAuthenticated
				? favorites.map((f) => f.eventId)
				: localIds,
		[isAuthenticated, favorites, localIds],
	);

	const isFavorite = useCallback(
		(eventId: string) => favoriteIds.includes(eventId),
		[favoriteIds],
	);

	const toggleFavorite = useCallback(
		(eventId: string) => {
			if (!isAuthenticated) {
				setLocalIds((prev) =>
					prev.includes(eventId)
						? prev.filter((id) => id !== eventId)
						: [...prev, eventId],
				);
				return;
			}
			const alreadyFav = favoriteIds.includes(eventId);
			const op = alreadyFav
				? removeFavorite(eventId)
				: addFavorite(eventId);
			op.unwrap().catch(() => {
				toast.error("Impossible de mettre à jour les favoris");
			});
		},
		[isAuthenticated, favoriteIds, addFavorite, removeFavorite],
	);

	const value: FavoritesContextValue = {
		favoriteIds,
		favorites,
		isFavorite,
		toggleFavorite,
		isLoading: isAuthenticated && serverLoading,
	};

	return (
		<FavoritesContext.Provider value={value}>
			{children}
		</FavoritesContext.Provider>
	);
}

export function useFavorites(): FavoritesContextValue {
	const ctx = useContext(FavoritesContext);
	if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
	return ctx;
}
