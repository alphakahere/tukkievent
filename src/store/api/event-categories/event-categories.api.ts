import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { Paginated } from "../types";
import type { Category } from "../event/event.type";
import type {
	CreateEventCategoryPayload,
	EventCategory,
	ListEventCategoriesParams,
	UpdateEventCategoryPayload,
} from "./event-categories.type";

export const eventCategoriesApi = createApi({
	reducerPath: "eventCategoriesApi",
	baseQuery,
	tagTypes: ["eventCategories", "eventCategory"],
	endpoints: (builder) => ({
		listVisitorEventCategories: builder.query<Category[], void>({
			query: () => "/visitor/event-categories",
			providesTags: ["eventCategories"],
		}),
		listEventCategories: builder.query<Paginated<EventCategory>, ListEventCategoriesParams | void>(
			{
				query: (params) => ({ url: "/event-categories", params: params ?? {} }),
				providesTags: (result) =>
					result
						? [
								{ type: "eventCategories" as const, id: "LIST" },
								...result.data.map((c) => ({ type: "eventCategory" as const, id: c.id })),
							]
						: [{ type: "eventCategories" as const, id: "LIST" }],
			},
		),
		getEventCategory: builder.query<EventCategory, string>({
			query: (id) => `/event-categories/${id}`,
			providesTags: (_r, _e, id) => [{ type: "eventCategory", id }],
		}),
		createEventCategory: builder.mutation<EventCategory, CreateEventCategoryPayload>({
			query: (body) => ({ url: "/event-categories", method: "POST", body }),
			invalidatesTags: [{ type: "eventCategories", id: "LIST" }],
		}),
		updateEventCategory: builder.mutation<
			EventCategory,
			{ id: string; patch: UpdateEventCategoryPayload }
		>({
			query: ({ id, patch }) => ({ url: `/event-categories/${id}`, method: "PATCH", body: patch }),
			invalidatesTags: (_r, _e, { id }) => [
				{ type: "eventCategory", id },
				{ type: "eventCategories", id: "LIST" },
			],
		}),
		deleteEventCategory: builder.mutation<void, string>({
			query: (id) => ({ url: `/event-categories/${id}`, method: "DELETE" }),
			invalidatesTags: (_r, _e, id) => [
				{ type: "eventCategory", id },
				{ type: "eventCategories", id: "LIST" },
			],
		}),
	}),
});

export const {
	useListVisitorEventCategoriesQuery,
	useListEventCategoriesQuery,
	useGetEventCategoryQuery,
	useCreateEventCategoryMutation,
	useUpdateEventCategoryMutation,
	useDeleteEventCategoryMutation,
} = eventCategoriesApi;
