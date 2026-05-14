import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export type NotificationType =
	| "ORDER_PAID"
	| "ORDER_FAILED"
	| "ORDER_REFUNDED"
	| "EVENT_REMINDER"
	| "EVENT_CANCELLED"
	| "PROMO_APPLIED"
	| "SYSTEM";

export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	body: string | null;
	data: unknown;
	readAt: string | null;
	createdAt: string;
}

export const notificationsApi = createApi({
	reducerPath: "notificationsApi",
	baseQuery,
	tagTypes: ["notifications", "unread-count"],
	endpoints: (builder) => ({
		listMyNotifications: builder.query<Notification[], void>({
			query: () => "/users/me/notifications",
			providesTags: [{ type: "notifications", id: "LIST" }],
		}),
		getUnreadCount: builder.query<{ unread: number }, void>({
			query: () => "/users/me/notifications/unread-count",
			providesTags: [{ type: "unread-count", id: "ME" }],
		}),
		markNotificationRead: builder.mutation<Notification, string>({
			query: (id) => ({
				url: `/users/me/notifications/${id}/read`,
				method: "PATCH",
			}),
			invalidatesTags: [
				{ type: "notifications", id: "LIST" },
				{ type: "unread-count", id: "ME" },
			],
		}),
		markAllNotificationsRead: builder.mutation<{ updated: number }, void>({
			query: () => ({
				url: "/users/me/notifications/read-all",
				method: "PATCH",
			}),
			invalidatesTags: [
				{ type: "notifications", id: "LIST" },
				{ type: "unread-count", id: "ME" },
			],
		}),
	}),
});

export const {
	useListMyNotificationsQuery,
	useGetUnreadCountQuery,
	useMarkNotificationReadMutation,
	useMarkAllNotificationsReadMutation,
} = notificationsApi;
