import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { Paginated, PaginationParams } from "../types";
import type { Event } from "./event.type";

export interface ListVisitorEventsParams extends PaginationParams {
	categoryId?: string;
	city?: string;
	q?: string;
	startDateFrom?: string;
	startDateTo?: string;
}

export const eventApi = createApi({
	reducerPath: "eventApi",
	baseQuery,
	tagTypes: ["events", "event"],
	endpoints: (builder) => ({
		listVisitorEvents: builder.query<Paginated<Event>, ListVisitorEventsParams | void>({
			query: (params) => ({ url: "/visitor/events", params: params ?? {} }),
			providesTags: ["events"],
		}),
		getVisitorEventBySlug: builder.query<Event, string>({
			query: (slug) => `/visitor/events/slug/${slug}`,
			providesTags: (_r, _e, slug) => [{ type: "event", id: slug }],
		}),
	}),
});

export const { useListVisitorEventsQuery, useGetVisitorEventBySlugQuery } = eventApi;
