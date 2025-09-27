import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { Event, Category } from "./event.type";

export const eventApi = createApi({
	reducerPath: "eventApi",
	baseQuery: baseQuery,
	tagTypes: ["events", "event", "eventCategories"],
	endpoints: (builder) => ({
		getEvents: builder.query<Event[], void>({
			query: () => "/visitor/events",
			providesTags: ["events"],
		}),
		getEventBySlug: builder.query<Event, string>({
			query: (slug) => `/visitor/events/slug/${slug}`,
			providesTags: ["event"],
		}),
		getEventCategories: builder.query<Category[], void>({
			query: () => "/visitor/event-categories",
			providesTags: ["eventCategories"],
		}),
	}),
});

export const { useGetEventsQuery, useGetEventBySlugQuery, useGetEventCategoriesQuery } = eventApi;
