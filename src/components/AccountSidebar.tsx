"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
	User,
	Ticket,
	Heart,
	Bell,
	Settings,
	CreditCard,
	BarChart3,
	HelpCircle,
	LogOut,
	RefreshCw,
} from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { LogoutConfirmDialog } from "@/components/auth/LogoutConfirmDialog";
import { useAppSelector } from "@/store/features/hooks";
import { selectAuthUser } from "@/store/selectors/auth.selectors";

const menuItems = [
  { icon: User, label: "Mon profil", path: "/profile", color: "#FF6B35" },
  { icon: Ticket, label: "Mes billets", path: "/tickets", color: "#FF6B35" },
  { icon: Heart, label: "Favoris", path: "/favorites", color: "#EF4444", badge: "favorites" as const },
  { icon: Bell, label: "Notifications", path: "/notifications", color: "#F59E0B", badge: "notifications" as const },
  { icon: Settings, label: "Paramètres", path: "/settings", color: "#6B7280" },
  { icon: CreditCard, label: "Moyens de paiement", path: "/payment-methods", color: "#10B981" },
  { icon: BarChart3, label: "Historique", path: "/history", color: "#3B82F6" },
  { icon: HelpCircle, label: "Aide & Support", path: "/support", color: "#8B5CF6" },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { favoriteIds } = useFavorites();
  const { unreadCount } = useNotifications();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const user = useAppSelector(selectAuthUser);
  const fullName = user
		? `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim() ||
			user.email
		: "—";
  const initials = user
		? `${(user.firstname?.[0] ?? "").toUpperCase()}${(user.lastname?.[0] ?? "").toUpperCase()}` ||
			(user.email?.[0]?.toUpperCase() ?? "?")
		: "?";

  const isActive = (path: string) =>
    path === "/profile" ? pathname === "/profile" : pathname.startsWith(path);

  function getBadge(badge?: "favorites" | "notifications") {
    if (badge === "favorites" && favoriteIds.length > 0) return favoriteIds.length;
    if (badge === "notifications" && unreadCount > 0) return unreadCount;
    return null;
  }

  return (
		<aside className="hidden md:block w-[260px] shrink-0">
			<div className="sticky top-20 bg-white rounded-2xl border border-gray-100 overflow-hidden">
				{/* User header */}
				<div className="p-5 border-b border-gray-100">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
							{initials}
						</div>
						<div className="min-w-0">
							<p className="font-semibold text-gray-900 truncate">
								{fullName}
							</p>
							<p className="text-xs text-gray-500 truncate">
								{user?.email ?? ""}
							</p>
						</div>
					</div>
				</div>

				{/* Menu */}
				<nav className="p-2">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const active = isActive(item.path);
						const badge = getBadge(item.badge);
						return (
							<Link
								key={item.path}
								href={item.path}
								className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
									active
										? "bg-primary/10 text-primary"
										: "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
								}`}
							>
								<Icon
									size={18}
									style={
										active
											? {
													color: item.color,
												}
											: undefined
									}
								/>
								<span className="flex-1">
									{item.label}
								</span>
								{badge && (
									<span className="bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
										{badge}
									</span>
								)}
							</Link>
						);
					})}
				</nav>

				{/* Switch mode */}
				<div className="p-2 border-t border-gray-100">
					<Link
						href="/organizer/dashboard"
						className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition-colors whitespace-nowrap"
					>
						<RefreshCw size={16} className="shrink-0" />
						Passer en mode organisateur
					</Link>
				</div>

				{/* Logout */}
				<div className="p-2 border-t border-gray-100">
					<button
						type="button"
						onClick={() => setLogoutOpen(true)}
						className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
					>
						<LogOut size={18} />
						Déconnexion
					</button>
				</div>
			</div>
			<LogoutConfirmDialog
				open={logoutOpen}
				onOpenChange={setLogoutOpen}
			/>
		</aside>
  );
}
