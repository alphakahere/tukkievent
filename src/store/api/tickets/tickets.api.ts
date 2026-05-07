import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { Paginated } from "../types";
import type {
	Attendee,
	AttendeeStats,
	CheckInPayload,
	ListAttendeesParams,
} from "./tickets.type";

export const ticketApi = createApi({
	reducerPath: "ticketApi",
	baseQuery,
	tagTypes: ["attendees", "attendee", "attendee-stats"],
	endpoints: (builder) => ({
		listEventAttendees: builder.query<
			Paginated<Attendee>,
			{ eventId: string; params?: ListAttendeesParams }
		>({
			query: ({ eventId, params }) => ({
				url: `/events/${eventId}/attendees`,
				params: params ?? {},
			}),
			providesTags: (_r, _e, { eventId }) => [
				{ type: "attendees" as const, id: eventId },
			],
		}),
		getAttendeeStats: builder.query<AttendeeStats, string>({
			query: (eventId) => `/events/${eventId}/attendees/stats`,
			providesTags: (_r, _e, eventId) => [
				{ type: "attendee-stats" as const, id: eventId },
			],
		}),
		checkInTicket: builder.mutation<Attendee, CheckInPayload & { eventId: string }>({
			query: ({ ticketId, checkedIn }) => ({
				url: `/tickets/${ticketId}/check-in`,
				method: "PATCH",
				body: { checkedIn },
			}),
			invalidatesTags: (_r, _e, { eventId }) => [
				{ type: "attendees" as const, id: eventId },
				{ type: "attendee-stats" as const, id: eventId },
			],
		}),
	}),
});

export const {
	useListEventAttendeesQuery,
	useGetAttendeeStatsQuery,
	useCheckInTicketMutation,
} = ticketApi;
