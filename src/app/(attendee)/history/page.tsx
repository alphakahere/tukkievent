"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, ShoppingBag, ChevronRight, Receipt } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import BottomNav from "@/components/BottomNav";
import AccountSidebar from "@/components/AccountSidebar";
import { useOrders } from "@/contexts/OrdersContext";

export default function HistoryPage() {
  const router = useRouter();
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState<"purchases" | "refunds">("purchases");

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
							<ArrowLeft
								size={20}
								className="text-gray-700"
							/>
						</button>
						<h1 className="text-xl font-bold text-gray-900">
							Historique
						</h1>
					</div>
					<div className="flex gap-2">
						{[
							{
								id: "purchases" as const,
								label: `Achats (${sortedOrders.length})`,
							},
							{
								id: "refunds" as const,
								label: "Remboursements (0)",
							},
						].map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() =>
									setActiveTab(tab.id)
								}
								className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${
									activeTab === tab.id
										? "bg-primary text-white"
										: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
								}`}
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>
			</header>

			<div className="max-w-lg md: px-4 py-6">
				<div className="md:flex md:gap-8">
					<AccountSidebar />
					<div className="flex-1">
						<h1 className="hidden md:block text-2xl font-bold text-gray-900 mb-4">
							Historique
						</h1>

						{/* Desktop tabs */}
						<div className="hidden md:flex gap-2 mb-6">
							{[
								{
									id: "purchases" as const,
									label: `Achats (${sortedOrders.length})`,
								},
								{
									id: "refunds" as const,
									label: "Remboursements (0)",
								},
							].map((tab) => (
								<button
									key={tab.id}
									type="button"
									onClick={() =>
										setActiveTab(tab.id)
									}
									className={`py-2.5 px-5 rounded-full text-sm font-semibold transition-all ${
										activeTab === tab.id
											? "bg-primary text-white"
											: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
									}`}
								>
									{tab.label}
								</button>
							))}
						</div>

						{activeTab === "purchases" ? (
							sortedOrders.length === 0 ? (
								<motion.div
									initial={{
										opacity: 0,
										y: 16,
									}}
									animate={{
										opacity: 1,
										y: 0,
									}}
									className="text-center py-20"
								>
									<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<ShoppingBag
											size={36}
											className="text-gray-300"
										/>
									</div>
									<p className="text-base font-semibold text-gray-900 mb-1">
										Aucun achat
									</p>
									<p className="text-sm text-gray-500 mb-6">
										Vos achats de
										billets apparaîtront
										ici
									</p>
									<Link
										href="/"
										className="inline-block bg-primary text-white py-3 px-8 rounded-full font-semibold hover:opacity-90 transition-opacity"
									>
										Découvrir les
										événements
									</Link>
								</motion.div>
							) : (
								<div className="space-y-3">
									{sortedOrders.map(
										(order, index) => {
											const totalTickets =
												order.tickets.reduce(
													(
														sum,
														t,
													) =>
														sum +
														t.quantity,
													0,
												);
											const purchaseDate =
												format(
													new Date(
														order.createdAt,
													),
													"d MMM yyyy",
													{
														locale: fr,
													},
												);
											return (
												<motion.div
													key={
														order.orderId
													}
													initial={{
														opacity: 0,
														y: 16,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													transition={{
														delay:
															index *
															0.05,
													}}
												>
													<Link
														href={`/history/${order.orderId}`}
														className="block bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 transition-colors"
													>
														<div className="flex items-start justify-between mb-3">
															<div className="flex-1 min-w-0">
																<p className="text-sm font-semibold text-gray-900 line-clamp-1 mb-0.5">
																	{
																		order
																			.event
																			.title
																	}
																</p>
																<p className="text-xs text-gray-500">
																	Acheté
																	le{" "}
																	{
																		purchaseDate
																	}
																</p>
															</div>
															<span className="ml-3 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full shrink-0">
																Confirmé
															</span>
														</div>
														<div className="flex items-center justify-between">
															<div className="flex gap-3 text-xs text-gray-400">
																<span>
																	{
																		totalTickets
																	}{" "}
																	billet
																	{totalTickets >
																	1
																		? "s"
																		: ""}
																</span>
																<span>
																	·
																</span>
																<span>
																	{
																		order
																			.formData
																			.paymentMethod
																	}
																</span>
															</div>
															<div className="flex items-center gap-1.5">
																<span className="text-sm font-bold text-primary">
																	{order.total.toLocaleString()}{" "}
																	FCFA
																</span>
																<ChevronRight
																	size={
																		16
																	}
																	className="text-gray-300"
																/>
															</div>
														</div>
													</Link>
												</motion.div>
											);
										},
									)}
								</div>
							)
						) : (
							<motion.div
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-center py-20"
							>
								<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Receipt
										size={36}
										className="text-gray-300"
									/>
								</div>
								<p className="text-base font-semibold text-gray-900 mb-1">
									Aucun remboursement
								</p>
								<p className="text-sm text-gray-500">
									Vos remboursements
									apparaîtront ici
								</p>
							</motion.div>
						)}
					</div>
				</div>
			</div>

			<BottomNav />
		</div>
  );
}
