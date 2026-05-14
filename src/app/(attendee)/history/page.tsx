"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
	AlertCircle,
	ArrowLeft,
	ChevronRight,
	Loader2,
	Receipt,
	ShoppingBag,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import BottomNav from "@/components/BottomNav";
import AccountSidebar from "@/components/AccountSidebar";
import { formatPrice } from "@/lib/utils";
import { getApiErrorMessage } from "@/store/api/auth/error";
import { useListMyOrdersQuery } from "@/store/api/order/order.api";
import { OrderStatus } from "@/store/api/order/order.type";

const STATUS_META: Record<
	string,
	{ label: string; cls: string }
> = {
	PENDING: { label: "En attente", cls: "bg-amber-50 text-amber-700" },
	PAID: { label: "Confirmé", cls: "bg-emerald-50 text-emerald-700" },
	FAILED: { label: "Échoué", cls: "bg-red-50 text-red-700" },
	CANCELLED: { label: "Annulé", cls: "bg-gray-100 text-gray-500" },
	REFUNDED: { label: "Remboursé", cls: "bg-blue-50 text-blue-700" },
};

export default function HistoryPage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<"purchases" | "refunds">(
		"purchases",
	);

	const {
		data: ordersPage,
		isLoading,
		isError,
		error,
	} = useListMyOrdersQuery(
		activeTab === "purchases"
			? { limit: 30 }
			: { limit: 30, status: OrderStatus.REFUNDED },
	);

	const orders = ordersPage?.data ?? [];
	const purchasesCount = ordersPage?.meta.total ?? 0;

	return (
		<div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
			<header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-40 md:hidden">
				<div className="max-w-lg mx-auto">
					<div className="flex items-center gap-3 mb-4">
						<button
							type="button"
							onClick={() => router.back()}
							className="p-2 rounded-full hover:bg-gray-100 transition-colors"
						>
							<ArrowLeft size={20} className="text-gray-700" />
						</button>
						<h1 className="text-xl font-bold text-gray-900">Historique</h1>
					</div>
					<div className="flex gap-2">
						<TabButton
							active={activeTab === "purchases"}
							onClick={() => setActiveTab("purchases")}
						>
							Achats
						</TabButton>
						<TabButton
							active={activeTab === "refunds"}
							onClick={() => setActiveTab("refunds")}
						>
							Remboursements
						</TabButton>
					</div>
				</div>
			</header>

			<div className="max-w-lg md:max-w-6xl mx-auto px-4 py-6">
				<div className="md:flex md:gap-8">
					<AccountSidebar />
					<div className="flex-1">
						<h1 className="hidden md:block text-2xl font-bold text-gray-900 mb-4">
							Historique
						</h1>

						{/* Desktop tabs */}
						<div className="hidden md:flex gap-2 mb-6">
							<TabButton
								active={activeTab === "purchases"}
								onClick={() => setActiveTab("purchases")}
							>
								Achats ({purchasesCount})
							</TabButton>
							<TabButton
								active={activeTab === "refunds"}
								onClick={() => setActiveTab("refunds")}
							>
								Remboursements
							</TabButton>
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
										"Impossible de charger l'historique",
									)}
								</p>
							</div>
						) : orders.length === 0 ? (
							<EmptyState tab={activeTab} />
						) : (
							<div className="space-y-3">
								{orders.map((order, index) => {
									const status =
										STATUS_META[order.status as string] ??
										STATUS_META.PENDING;
									const purchaseDate = format(
										new Date(order.createdAt),
										"d MMM yyyy",
										{ locale: fr },
									);
									return (
										<motion.div
											key={order.id}
											initial={{ opacity: 0, y: 16 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.04 }}
										>
											<Link
												href={`/history/${order.id}`}
												className="block bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 transition-colors"
											>
												<div className="flex items-start justify-between mb-3 gap-3">
													<div className="flex-1 min-w-0">
														<p className="text-sm font-semibold text-gray-900 line-clamp-1 mb-0.5">
															{order.event.title}
														</p>
														<p className="text-xs text-gray-500">
															Acheté le {purchaseDate}
														</p>
													</div>
													<span
														className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${status.cls}`}
													>
														{status.label}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<p className="text-xs text-gray-400">
														{order.ticketCount} billet
														{order.ticketCount > 1 ? "s" : ""}
														{order.event.city
															? ` · ${order.event.city}`
															: ""}
													</p>
													<div className="flex items-center gap-1.5">
														<span className="text-sm font-bold text-primary">
															{formatPrice(order.totalAmount)}
														</span>
														<ChevronRight
															size={16}
															className="text-gray-300"
														/>
													</div>
												</div>
											</Link>
										</motion.div>
									);
								})}
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
			className={`py-2.5 px-5 rounded-full text-sm font-semibold transition-all ${
				active
					? "bg-primary text-white"
					: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
			}`}
		>
			{children}
		</button>
	);
}

function EmptyState({ tab }: { tab: "purchases" | "refunds" }) {
	const Icon = tab === "purchases" ? ShoppingBag : Receipt;
	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			className="text-center py-20"
		>
			<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Icon size={36} className="text-gray-300" />
			</div>
			<p className="text-base font-semibold text-gray-900 mb-1">
				{tab === "purchases" ? "Aucun achat" : "Aucun remboursement"}
			</p>
			<p className="text-sm text-gray-500 mb-6">
				{tab === "purchases"
					? "Vos achats de billets apparaîtront ici"
					: "Vos remboursements apparaîtront ici"}
			</p>
			{tab === "purchases" && (
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
