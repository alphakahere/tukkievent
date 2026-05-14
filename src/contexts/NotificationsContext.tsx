"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useAppSelector } from "@/store/features/hooks";
import { selectIsAuthenticated } from "@/store/selectors/auth.selectors";
import {
	type Notification as ServerNotification,
	type NotificationType,
	useListMyNotificationsQuery,
	useMarkAllNotificationsReadMutation,
	useMarkNotificationReadMutation,
} from "@/store/api/notifications/notifications.api";

export type { NotificationType };

/**
 * UI-facing shape preserved from the previous localStorage-backed context so
 * that downstream components don't need to be touched in a single sweep.
 */
export interface AppNotification {
	id: string;
	type: NotificationType;
	title: string;
	body: string;
	read: boolean;
	createdAt: string;
}

type NotificationsContextValue = {
	notifications: AppNotification[];
	unreadCount: number;
	isLoading: boolean;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	/** No server endpoint yet — UI hides the notification optimistically. */
	dismiss: (id: string) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(
	null,
);

function toAppNotification(n: ServerNotification): AppNotification {
	return {
		id: n.id,
		type: n.type,
		title: n.title,
		body: n.body ?? "",
		read: n.readAt !== null,
		createdAt: n.createdAt,
	};
}

export function NotificationsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const {
		data: serverNotifications,
		isLoading,
	} = useListMyNotificationsQuery(undefined, { skip: !isAuthenticated });
	const [markRead] = useMarkNotificationReadMutation();
	const [markAllRead] = useMarkAllNotificationsReadMutation();

	const notifications = useMemo<AppNotification[]>(
		() =>
			isAuthenticated
				? (serverNotifications ?? []).map(toAppNotification)
				: [],
		[isAuthenticated, serverNotifications],
	);

	const unreadCount = useMemo(
		() => notifications.filter((n) => !n.read).length,
		[notifications],
	);

	const markAsRead = useCallback(
		(id: string) => {
			if (!isAuthenticated) return;
			markRead(id).unwrap().catch(() => {});
		},
		[isAuthenticated, markRead],
	);

	const markAllAsRead = useCallback(() => {
		if (!isAuthenticated) return;
		markAllRead().unwrap().catch(() => {});
	}, [isAuthenticated, markAllRead]);

	const dismiss = useCallback(
		(id: string) => {
			// No backend dismiss yet — fall back to marking as read.
			void id;
			markAsRead(id);
		},
		[markAsRead],
	);

	const value: NotificationsContextValue = {
		notifications,
		unreadCount,
		isLoading: isAuthenticated && isLoading,
		markAsRead,
		markAllAsRead,
		dismiss,
	};

	return (
		<NotificationsContext.Provider value={value}>
			{children}
		</NotificationsContext.Provider>
	);
}

export function useNotifications(): NotificationsContextValue {
	const ctx = useContext(NotificationsContext);
	if (!ctx)
		throw new Error("useNotifications must be used within NotificationsProvider");
	return ctx;
}
