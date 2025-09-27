import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { Event, Category } from "./event.type";

export const eventApi = createApi({
	reducerPath: "eventApi",
	baseQuery: baseQuery,
	tagTypes: ["events", "event", "eventCategories"],
	endpoints: (builder) => ({
		getEvents: builder.query<Event[], void>({
			query: () => "/visitors/events",
			providesTags: ["events"],
		}),
		getEvent: builder.query<Event, string>({
			query: (id) => `/visitors/events/${id}`,
			providesTags: ["event"],
		}),
		getEventCategories: builder.query<Category[], void>({
			query: () => "/visitors/event-categories",
			providesTags: ["eventCategories"],
		}),
	}),
});

export const { useGetEventsQuery, useGetEventQuery, useGetEventCategoriesQuery } = eventApi;
