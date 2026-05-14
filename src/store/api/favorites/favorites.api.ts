import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export type Currency = "XOF" | "EUR" | "USD";
export type EventStatus =
	| "DRAFT"
	| "PUBLISHED"
	| "CANCELLED"
	| "COMPLETED"
	| "REJECTED"
	| "SUSPENDED";

export interface FavoriteEvent {
	id: string;
	title: string;
	slug: string;
	shortDescription: string | null;
	city: string | null;
	coverImageUrl: string | null;
	startDatetime: string;
	status: EventStatus;
	minPrice: number | null;
	currency: Currency | null;
}

export interface Favorite {
	id: string;
	eventId: string;
	createdAt: string;
	event: FavoriteEvent;
}

export const favoritesApi = createApi({
	reducerPath: "favoritesApi",
	baseQuery,
	tagTypes: ["favorites"],
	endpoints: (builder) => ({
		listMyFavorites: builder.query<Favorite[], void>({
			query: () => "/users/me/favorites",
			providesTags: [{ type: "favorites", id: "LIST" }],
		}),
		addFavorite: builder.mutation<Favorite, string>({
			query: (eventId) => ({
				url: `/users/me/favorites/${eventId}`,
				method: "POST",
			}),
			invalidatesTags: [{ type: "favorites", id: "LIST" }],
		}),
		removeFavorite: builder.mutation<void, string>({
			query: (eventId) => ({
				url: `/users/me/favorites/${eventId}`,
				method: "DELETE",
			}),
			invalidatesTags: [{ type: "favorites", id: "LIST" }],
		}),
	}),
});

export const {
	useListMyFavoritesQuery,
	useAddFavoriteMutation,
	useRemoveFavoriteMutation,
} = favoritesApi;
