"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "tukki-event-notifications";

export type NotificationType = "booking" | "reminder" | "promo" | "cancelled";

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
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

const defaultNotifications: AppNotification[] = [
  {
    id: "notif-1",
    type: "booking",
    title: "Réservation confirmée",
    body: "Votre billet pour Festival Mbalakh a été confirmé. Numéro: TKK-001234.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    type: "reminder",
    title: "Rappel d'événement",
    body: "Concert Ndongo Darou commence demain à 20h00. Ne soyez pas en retard !",
    read: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    type: "promo",
    title: "Nouvel événement disponible",
    body: "Gala de l'Excellence Sénégalaise vient d'être publié. Réservez vos places dès maintenant.",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-4",
    type: "cancelled",
    title: "Événement annulé",
    body: "Match de Football Dakar a été annulé. Un remboursement sera effectué sous 5 jours.",
    read: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppNotification[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
          setMounted(true);
          return;
        }
      }
    } catch {
      // ignore
    }
    setNotifications(defaultNotifications);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [mounted, notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value: NotificationsContextValue = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismiss,
  };

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
