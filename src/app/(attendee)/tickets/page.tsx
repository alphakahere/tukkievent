"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Ticket as TicketIcon } from "lucide-react";
import { motion } from "motion/react";
import BottomNav from "@/components/BottomNav";
import AccountSidebar from "@/components/AccountSidebar";
import { useOrders } from "@/contexts/OrdersContext";
import { mockBookedTickets } from "@/lib/mockData";
import type { BookedTicket } from "@/lib/mockData";

function isUpcoming(t: BookedTicket): boolean {
  const dt = t.eventDatetime ? new Date(t.eventDatetime) : null;
  if (!dt) return true;
  return dt.getTime() >= Date.now();
}

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const { bookedTickets } = useOrders();

  const allTickets = useMemo(() => {
    const byId = new Map<string, BookedTicket>();
    mockBookedTickets.forEach((t) => byId.set(t.id, t));
    bookedTickets.forEach((t) => byId.set(t.id, t));
    return Array.from(byId.values());
  }, [bookedTickets]);

  const upcomingTickets = allTickets.filter(isUpcoming);
  const pastTickets = allTickets.filter((t) => !isUpcoming(t));
  const currentTickets = activeTab === "upcoming" ? upcomingTickets : pastTickets;

  return (
		<div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
			<header className="bg-white border-b border-gray-100 px-4 pt-12 md:pt-4 pb-4 sticky top-0 z-40 md:top-16">
				<div className="max-w-lg md:max-w-6xl mx-auto">
					<h1 className="text-2xl font-bold text-gray-900 mb-4 md:hidden">
						Mes Billets
					</h1>
					<div className="flex gap-2 md:hidden">
						{[
							{
								id: "upcoming" as const,
								label: `À venir (${upcomingTickets.length})`,
							},
							{
								id: "past" as const,
								label: `Passés (${pastTickets.length})`,
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

			<div className="max-w-lg md:max-w-6xl mx-auto px-4 py-6">
				<div className="md:flex md:gap-8">
					<AccountSidebar />

					<div className="flex-1">
						<div className="hidden md:flex items-center justify-between mb-6">
							<h1 className="text-2xl font-bold text-gray-900">
								Mes Billets
							</h1>
							<div className="flex gap-2">
								{[
									{
										id: "upcoming" as const,
										label: `À venir (${upcomingTickets.length})`,
									},
									{
										id: "past" as const,
										label: `Passés (${pastTickets.length})`,
									},
								].map((tab) => (
									<button
										key={tab.id}
										type="button"
										onClick={() =>
											setActiveTab(
												tab.id,
											)
										}
										className={`py-2.5 px-5 rounded-full text-sm font-semibold transition-all ${
											activeTab ===
											tab.id
												? "bg-primary text-white"
												: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
										}`}
									>
										{tab.label}
									</button>
								))}
							</div>
						</div>

						{currentTickets.length === 0 ? (
							<motion.div
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-center py-20"
							>
								<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<TicketIcon
										size={36}
										className="text-gray-300"
									/>
								</div>
								<p className="text-base font-semibold text-gray-900 mb-1">
									Aucun billet{" "}
									{activeTab === "upcoming"
										? "à venir"
										: "passé"}
								</p>
								<p className="text-sm text-gray-500 mb-6">
									{activeTab === "upcoming"
										? "Réservez vos prochains événements dès maintenant"
										: "Vos billets passés apparaîtront ici"}
								</p>
								{activeTab === "upcoming" && (
									<Link
										href="/"
										className="inline-block bg-primary text-white py-3 px-8 rounded-full font-semibold hover:opacity-90 transition-opacity"
									>
										Découvrir les
										événements
									</Link>
								)}
							</motion.div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{currentTickets.map(
									(ticket, index) => (
										<motion.div
											key={
												ticket.id
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
												href={`/tickets/${ticket.id}`}
												className="block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors"
											>
												<div className="flex gap-4 p-4">
													<Image
														src={
															ticket.eventImage
														}
														alt={
															ticket.eventTitle
														}
														width={
															80
														}
														height={
															80
														}
														className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
													/>
													<div className="flex-1 min-w-0">
														<div className="flex items-start justify-between mb-1.5">
															<div className="flex-1 min-w-0">
																<p className="text-sm font-semibold text-gray-900 line-clamp-1">
																	{
																		ticket.eventTitle
																	}
																</p>
																<p className="text-xs text-gray-500 mt-0.5">
																	{
																		ticket.eventDate
																	}{" "}
																	·{" "}
																	{
																		ticket.eventTime
																	}
																</p>
																<p className="text-xs text-gray-400 line-clamp-1">
																	{
																		ticket.eventLocation
																	}
																</p>
															</div>
															<span
																className={`ml-2 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
																	ticket.status ===
																	"valid"
																		? "bg-emerald-50 text-emerald-700"
																		: "bg-gray-100 text-gray-500"
																}`}
															>
																{ticket.status ===
																"valid"
																	? "Valide"
																	: "Utilisé"}
															</span>
														</div>
														<div className="flex items-center justify-between mt-2">
															<div>
																<p className="text-xs text-gray-400">
																	{
																		ticket.ticketType
																	}{" "}
																	×{" "}
																	{
																		ticket.quantity
																	}
																</p>
																<p className="text-sm font-bold text-primary">
																	{ticket.totalPrice.toLocaleString()}{" "}
																	FCFA
																</p>
															</div>
															<ChevronRight
																size={
																	16
																}
																className="text-gray-300"
															/>
														</div>
													</div>
												</div>
												{ticket.status ===
													"valid" && (
													<div className="border-t border-dashed border-gray-100 px-4 py-3 bg-gray-50 flex items-center justify-between">
														<div className="flex items-center gap-2">
															<span className="text-lg">
																📱
															</span>
															<div>
																<p className="text-xs text-gray-400">
																	Numéro
																	de
																	billet
																</p>
																<p className="text-xs font-semibold text-gray-900">
																	{
																		ticket.ticketNumber
																	}
																</p>
															</div>
														</div>
														<span className="text-xs font-semibold text-primary">
															Afficher
															QR
														</span>
													</div>
												)}
											</Link>
										</motion.div>
									),
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			<BottomNav />
		</div>
  );
}
