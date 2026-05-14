"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
	AlertCircle,
	ChevronRight,
	Loader2,
	Ticket as TicketIcon,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import BottomNav from "@/components/BottomNav";
import AccountSidebar from "@/components/AccountSidebar";
import { assetUrl, formatPrice } from "@/lib/utils";
import { getApiErrorMessage } from "@/store/api/auth/error";
import { useListMyOrdersQuery } from "@/store/api/order/order.api";
import {
	OrderStatus,
	type MyOrderListItem,
} from "@/store/api/order/order.type";

function isUpcoming(o: MyOrderListItem): boolean {
	if (!o.event.startDatetime) return true;
	return new Date(o.event.startDatetime).getTime() >= Date.now();
}

export default function TicketsPage() {
	const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

	const {
		data: ordersPage,
		isLoading,
		isError,
		error,
	} = useListMyOrdersQuery({ status: OrderStatus.PAID, limit: 50 });

	const allOrders = ordersPage?.data ?? [];

	const upcomingOrders = useMemo(
		() => allOrders.filter(isUpcoming),
		[allOrders],
	);
	const pastOrders = useMemo(
		() => allOrders.filter((o) => !isUpcoming(o)),
		[allOrders],
	);
	const currentOrders = activeTab === "upcoming" ? upcomingOrders : pastOrders;

	return (
		<div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
			<header className="bg-white border-b border-gray-100 px-4 pt-12 md:pt-4 pb-4 sticky top-0 z-40 md:top-16">
				<div className="max-w-lg md:max-w-6xl mx-auto">
					<h1 className="text-2xl font-bold text-gray-900 mb-4 md:hidden">
						Mes Billets
					</h1>
					<div className="flex gap-2 md:hidden">
						<TabButton
							active={activeTab === "upcoming"}
							onClick={() => setActiveTab("upcoming")}
						>
							À venir ({upcomingOrders.length})
						</TabButton>
						<TabButton
							active={activeTab === "past"}
							onClick={() => setActiveTab("past")}
						>
							Passés ({pastOrders.length})
						</TabButton>
					</div>
				</div>
			</header>

			<div className="max-w-lg md:max-w-6xl mx-auto px-4 py-6">
				<div className="md:flex md:gap-8">
					<AccountSidebar />

					<div className="flex-1">
						<div className="hidden md:flex items-center justify-between mb-6">
							<h1 className="text-2xl font-bold text-gray-900">
								Mes Billets
							</h1>
							<div className="flex gap-2">
								<TabButton
									active={activeTab === "upcoming"}
									onClick={() => setActiveTab("upcoming")}
								>
									À venir ({upcomingOrders.length})
								</TabButton>
								<TabButton
									active={activeTab === "past"}
									onClick={() => setActiveTab("past")}
								>
									Passés ({pastOrders.length})
								</TabButton>
							</div>
						</div>

						{isLoading ? (
							<div className="p-10 text-center">
								<Loader2
									size={28}
									className="mx-auto text-primary animate-spin"
								/>
							</div>
						) : isError ? (
							<div className="p-10 text-center">
								<AlertCircle
									size={40}
									className="mx-auto text-red-300 mb-3"
								/>
								<p className="text-sm text-gray-500">
									{getApiErrorMessage(
										error,
										"Impossible de charger les billets",
									)}
								</p>
							</div>
						) : currentOrders.length === 0 ? (
							<EmptyState tab={activeTab} />
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{currentOrders.map((order, index) => (
									<TicketCard
										key={order.id}
										order={order}
										delay={index * 0.04}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			<BottomNav />
		</div>
	);
}

function TabButton({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`flex-1 md:flex-initial py-2.5 px-4 md:px-5 rounded-full text-sm font-semibold transition-all ${
				active
					? "bg-primary text-white"
					: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
			}`}
		>
			{children}
		</button>
	);
}

function EmptyState({ tab }: { tab: "upcoming" | "past" }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			className="text-center py-20"
		>
			<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<TicketIcon size={36} className="text-gray-300" />
			</div>
			<p className="text-base font-semibold text-gray-900 mb-1">
				Aucun billet {tab === "upcoming" ? "à venir" : "passé"}
			</p>
			<p className="text-sm text-gray-500 mb-6">
				{tab === "upcoming"
					? "Réservez vos prochains événements dès maintenant"
					: "Vos billets passés apparaîtront ici"}
			</p>
			{tab === "upcoming" && (
				<Link
					href="/"
					className="inline-block bg-primary text-white py-3 px-8 rounded-full font-semibold hover:opacity-90 transition-opacity"
				>
					Découvrir les événements
				</Link>
			)}
		</motion.div>
	);
}

function TicketCard({
	order,
	delay,
}: {
	order: MyOrderListItem;
	delay: number;
}) {
	const eventDate = format(
		new Date(order.event.startDatetime),
		"d MMM yyyy",
		{ locale: fr },
	);
	const eventTime = format(new Date(order.event.startDatetime), "HH:mm");

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay }}
		>
			<Link
				href={`/tickets/${order.id}`}
				className="block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors"
			>
				<div className="flex gap-4 p-4">
					<Image
						src={assetUrl(order.event.coverImageUrl)}
						alt={order.event.title}
						width={80}
						height={80}
						className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
					/>
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between mb-1.5">
							<div className="flex-1 min-w-0">
								<p className="text-sm font-semibold text-gray-900 line-clamp-1">
									{order.event.title}
								</p>
								<p className="text-xs text-gray-500 mt-0.5">
									{eventDate} · {eventTime}
								</p>
								{order.event.city && (
									<p className="text-xs text-gray-400 line-clamp-1">
										{order.event.city}
									</p>
								)}
							</div>
						</div>
						<div className="flex items-center justify-between mt-2">
							<div>
								<p className="text-xs text-gray-400">
									{order.ticketCount} billet
									{order.ticketCount > 1 ? "s" : ""}
								</p>
								<p className="text-sm font-bold text-primary">
									{formatPrice(order.totalAmount)}
								</p>
							</div>
							<ChevronRight size={16} className="text-gray-300" />
						</div>
					</div>
				</div>
			</Link>
		</motion.div>
	);
}
