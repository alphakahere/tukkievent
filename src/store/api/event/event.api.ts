import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { Paginated, PaginationParams } from "../types";
import type { Event } from "./event.type";
import type {
	EventResource,
	ListEventsParams,
	UpdateEventPayload,
} from "./event.resource.type";

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
			providesTags: (_r, _e, slug) => [{ type: "event", id: `slug:${slug}` }],
		}),
		listEvents: builder.query<Paginated<EventResource>, ListEventsParams | void>({
			query: (params) => ({ url: "/events", params: params ?? {} }),
			providesTags: (result) =>
				result
					? [
							{ type: "events" as const, id: "LIST" },
							...result.data.map((e) => ({ type: "event" as const, id: e.id })),
						]
					: [{ type: "events" as const, id: "LIST" }],
		}),
		getEvent: builder.query<EventResource, string>({
			query: (id) => `/events/${id}`,
			providesTags: (_r, _e, id) => [{ type: "event", id }],
		}),
		updateEvent: builder.mutation<EventResource, { id: string; patch: UpdateEventPayload }>({
			query: ({ id, patch }) => ({ url: `/events/${id}`, method: "PATCH", body: patch }),
			invalidatesTags: (_r, _e, { id }) => [
				{ type: "event", id },
				{ type: "events", id: "LIST" },
			],
		}),
		deleteEvent: builder.mutation<void, string>({
			query: (id) => ({ url: `/events/${id}`, method: "DELETE" }),
			invalidatesTags: (_r, _e, id) => [
				{ type: "event", id },
				{ type: "events", id: "LIST" },
			],
		}),
	}),
});

export const {
	useListVisitorEventsQuery,
	useGetVisitorEventBySlugQuery,
	useListEventsQuery,
	useGetEventQuery,
	useUpdateEventMutation,
	useDeleteEventMutation,
} = eventApi;
