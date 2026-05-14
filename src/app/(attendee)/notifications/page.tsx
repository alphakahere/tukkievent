"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Bell, Ticket, Clock, Tag, XCircle, X, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNotifications, type AppNotification, type NotificationType } from "@/contexts/NotificationsContext";
import BottomNav from "@/components/BottomNav";
import AccountSidebar from "@/components/AccountSidebar";

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "ORDER_PAID":
      return { Icon: Ticket, color: "#10B981", bg: "#ECFDF5" };
    case "ORDER_FAILED":
      return { Icon: XCircle, color: "#EF4444", bg: "#FEF2F2" };
    case "ORDER_REFUNDED":
      return { Icon: Tag, color: "#3B82F6", bg: "#EFF6FF" };
    case "EVENT_REMINDER":
      return { Icon: Clock, color: "#F59E0B", bg: "#FFFBEB" };
    case "EVENT_CANCELLED":
      return { Icon: XCircle, color: "#EF4444", bg: "#FEF2F2" };
    case "PROMO_APPLIED":
      return { Icon: Tag, color: "#3B82F6", bg: "#EFF6FF" };
    case "SYSTEM":
    default:
      return { Icon: Bell, color: "#6B7280", bg: "#F3F4F6" };
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

function NotificationItem({ notification, onMarkRead, onDismiss }: {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const { Icon, color, bg } = getNotificationIcon(notification.type);
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      className={`relative bg-white rounded-2xl p-4 border transition-colors cursor-pointer ${
        notification.read ? "border-gray-100" : "border-primary/20 bg-primary/[0.02]"
      }`}
      onClick={() => !notification.read && onMarkRead(notification.id)}
    >
      {!notification.read && (
        <span className="absolute top-4 right-10 w-2 h-2 bg-primary rounded-full" />
      )}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDismiss(notification.id); }}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Supprimer"
      >
        <X size={13} className="text-gray-400" />
      </button>

      <div className="flex gap-3 pr-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 mb-0.5">{notification.title}</p>
          <p className="text-sm text-gray-500 leading-relaxed">{notification.body}</p>
          <p className="text-xs text-gray-400 mt-1.5">{timeAgo}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, items, onMarkRead, onDismiss }: {
  title: string; items: AppNotification[];
  onMarkRead: (id: string) => void; onDismiss: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</p>
      <div className="space-y-2">
        <AnimatePresence>
          {items.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={onMarkRead} onDismiss={onDismiss} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismiss } = useNotifications();
  const sorted = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const { today, thisWeek, older } = groupByDate(sorted);

  return (
		<div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
			<header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-40 md:hidden">
				<div className="max-w-lg mx-auto">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => router.back()}
								className="p-2 rounded-full hover:bg-gray-100 transition-colors"
							>
								<ArrowLeft
									size={20}
									className="text-gray-700"
								/>
							</button>
							<h1 className="text-xl font-bold text-gray-900">
								Notifications
							</h1>
							{unreadCount > 0 && (
								<span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
									{unreadCount}
								</span>
							)}
						</div>
						{unreadCount > 0 && (
							<button
								type="button"
								onClick={markAllAsRead}
								className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:opacity-80"
							>
								<CheckCheck size={15} /> Tout
								lire
							</button>
						)}
					</div>
				</div>
			</header>

			<div className="max-w-lg md:max-w-6xl mx-auto px-4 py-6">
				<div className="md:flex md:gap-8">
					<AccountSidebar />
					<div className="flex-1">
						<div className="hidden md:flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<h1 className="text-2xl font-bold text-gray-900">
									Notifications
								</h1>
								{unreadCount > 0 && (
									<span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
										{unreadCount}
									</span>
								)}
							</div>
							{unreadCount > 0 && (
								<button
									type="button"
									onClick={markAllAsRead}
									className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:opacity-80"
								>
									<CheckCheck size={15} />{" "}
									Tout marquer comme lu
								</button>
							)}
						</div>

						{notifications.length === 0 ? (
							<motion.div
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-center py-16"
							>
								<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Bell
										size={36}
										className="text-gray-300"
									/>
								</div>
								<p className="text-base font-semibold text-gray-900 mb-1">
									Aucune notification
								</p>
								<p className="text-sm text-gray-500">
									Vos notifications
									apparaîtront ici
								</p>
							</motion.div>
						) : (
							<>
								<Section
									title="Aujourd'hui"
									items={today}
									onMarkRead={markAsRead}
									onDismiss={dismiss}
								/>
								<Section
									title="Cette semaine"
									items={thisWeek}
									onMarkRead={markAsRead}
									onDismiss={dismiss}
								/>
								<Section
									title="Plus ancien"
									items={older}
									onMarkRead={markAsRead}
									onDismiss={dismiss}
								/>
							</>
						)}
					</div>
				</div>
			</div>

			<BottomNav />
		</div>
  );
}
