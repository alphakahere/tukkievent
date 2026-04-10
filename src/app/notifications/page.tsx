"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Bell,
  Ticket,
  Clock,
  Tag,
  XCircle,
  X,
  CheckCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNotifications, type AppNotification, type NotificationType } from "@/contexts/NotificationsContext";
import BottomNav from "@/components/BottomNav";

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "booking":
      return { Icon: Ticket, color: "#10B981", bg: "#10B98115" };
    case "reminder":
      return { Icon: Clock, color: "#F59E0B", bg: "#F59E0B15" };
    case "promo":
      return { Icon: Tag, color: "#3B82F6", bg: "#3B82F615" };
    case "cancelled":
      return { Icon: XCircle, color: "#EF4444", bg: "#EF444415" };
  }
}

function groupByDate(notifications: AppNotification[]) {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const oneWeekMs = 7 * oneDayMs;

  const today: AppNotification[] = [];
  const thisWeek: AppNotification[] = [];
  const older: AppNotification[] = [];

  for (const n of notifications) {
    const age = now - new Date(n.createdAt).getTime();
    if (age < oneDayMs) today.push(n);
    else if (age < oneWeekMs) thisWeek.push(n);
    else older.push(n);
  }

  return { today, thisWeek, older };
}

function NotificationItem({
  notification,
  onMarkRead,
  onDismiss,
}: {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const { Icon, color, bg } = getNotificationIcon(notification.type);
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`relative bg-card rounded-xl p-4 border transition-colors ${
        notification.read ? "border-border" : "border-primary/30 bg-primary/5"
      }`}
      onClick={() => !notification.read && onMarkRead(notification.id)}
    >
      {!notification.read && (
        <span className="absolute top-4 right-10 w-2 h-2 bg-primary rounded-full" />
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(notification.id);
        }}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
        aria-label="Supprimer"
      >
        <X size={14} className="text-muted-foreground" />
      </button>

      <div className="flex gap-3 pr-6">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: bg }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm mb-1">{notification.title}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{notification.body}</p>
          <p className="text-xs text-muted-foreground mt-2">{timeAgo}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, items, onMarkRead, onDismiss }: {
  title: string;
  items: AppNotification[];
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </p>
      <div className="space-y-3">
        <AnimatePresence>
          {items.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={onMarkRead}
              onDismiss={onDismiss}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismiss } = useNotifications();

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const { today, thisWeek, older } = groupByDate(sorted);

  return (
    <div className="min-h-screen bg-muted pb-24 md:pb-8">
      <header className="bg-card px-4 pt-12 pb-4 shadow-sm sticky top-0 z-40 border-b border-border">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Retour"
              >
                <ArrowLeft size={24} className="text-foreground" />
              </button>
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:opacity-80 transition-opacity"
              >
                <CheckCheck size={16} />
                Tout lire
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Aucune notification</h3>
            <p className="text-muted-foreground">
              Vos notifications apparaîtront ici
            </p>
          </motion.div>
        ) : (
          <>
            <Section title="Aujourd'hui" items={today} onMarkRead={markAsRead} onDismiss={dismiss} />
            <Section title="Cette semaine" items={thisWeek} onMarkRead={markAsRead} onDismiss={dismiss} />
            <Section title="Plus ancien" items={older} onMarkRead={markAsRead} onDismiss={dismiss} />
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
