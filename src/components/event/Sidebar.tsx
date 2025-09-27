"use client";
import React, { useState } from "react";
import { Ticket, Check, Smartphone, ShieldCheck, Undo2, Copy, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { TicketType } from "@/store/api/event/event.type";
import { formatPrice } from "@/lib/utils";

type SidebarProps = {
	ticketTypes: TicketType[];
};

const Sidebar: React.FC<SidebarProps> = ({ ticketTypes }) => {
	const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});
	const [copied, setCopied] = useState(false);

	const updateQuantity = (ticketTypeId: string, quantity: number) => {
		setTicketQuantities((prev) => ({
			...prev,
			[ticketTypeId]: quantity,
		}));
	};

	const total = Object.entries(ticketQuantities).reduce((sum, [ticketTypeId, quantity]) => {
		const ticketType = ticketTypes.find((tt) => tt.id === ticketTypeId);
		return sum + (ticketType ? Number(ticketType.price) * quantity : 0);
	}, 0);

	return (
		<div className="bg-white rounded-xl p-6 mb-6 sticky top-24">
			{/* Ticket Types Selection */}
			{ticketTypes && ticketTypes.length > 0 && (
				<div className="mb-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Types de billets
					</h3>
					<div className="space-y-3">
						{ticketTypes.map((ticketType) => {
							const quantity = ticketQuantities[ticketType.id] || 0;
							return (
								<div
									key={ticketType.id}
									className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200"
								>
									<div className="flex items-start justify-between mb-3">
										<div className="flex items-start">
											<div className="bg-orange-100 p-2 rounded-lg mr-3">
												<Ticket className="w-5 h-5 text-orange-500" />
											</div>
											<div className="flex-1">
												<h4 className="font-semibold text-base text-gray-900 mb-1">
													{ticketType.name}
												</h4>
												{ticketType.description && (
													<p className="text-xs text-gray-600 mb-2">
														{
															ticketType.description
														}
													</p>
												)}
												{ticketType.availableQuantity !==
													undefined && (
													<p className="text-xs text-gray-500">
														{
															ticketType.availableQuantity
														}{" "}
														disponibles
													</p>
												)}
											</div>
										</div>
										<div className="text-right">
											<span className="text-lg font-bold text-orange-500">
												{formatPrice(
													Number(
														ticketType.price
													)
												)}
											</span>
										</div>
									</div>

									<div className="flex items-center justify-between pt-3 border-t border-gray-100">
										<span className="text-sm font-medium text-gray-700">
											Quantité:
										</span>
										<div className="flex items-center bg-gray-50 rounded-full px-3 py-2">
											<button
												onClick={() =>
													updateQuantity(
														ticketType.id,
														Math.max(
															0,
															quantity -
																1
														)
													)
												}
												className="text-gray-600 hover:text-orange-500 hover:bg-white rounded-full p-1 transition-all duration-200 cursor-pointer"
												aria-label="Diminuer"
											>
												<Minus className="w-4 h-4" />
											</button>
											<span className="text-gray-900 font-bold mx-4 min-w-[32px] text-center">
												{quantity}
											</span>
											<button
												onClick={() =>
													updateQuantity(
														ticketType.id,
														Math.min(
															ticketType.maxPurchase,
															quantity +
																1
														)
													)
												}
												className="text-gray-600 hover:text-orange-500 hover:bg-white rounded-full p-1 transition-all duration-200 cursor-pointer"
												aria-label="Augmenter"
											>
												<Plus className="w-4 h-4" />
											</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Total Section */}
			{total > 0 && (
				<div className="flex justify-between items-center mb-6 pb-4 border-t border-gray-200 pt-4">
					<span className="text-lg font-semibold text-gray-700">Total</span>
					<span className="text-2xl font-bold text-orange-500">
						{formatPrice(total)}
					</span>
				</div>
			)}
			<div className="space-y-3">
				<Link
					href="/checkout/summary"
					className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold inline-flex items-center justify-center"
				>
					<Ticket className="w-5 h-5 mr-2" /> Réserver maintenant
				</Link>
				{/* <button className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold inline-flex items-center justify-center">
					<Share2 className="w-5 h-5 mr-2" /> Ajouter au panier
				</button> */}
			</div>
			<div className="mt-6 text-sm text-gray-600 space-y-2">
				<div className="flex items-center">
					<Check className="text-orange-500 w-4 h-4 mr-2" />
					Confirmation instantanée
				</div>
				<div className="flex items-center">
					<Smartphone className="text-orange-500 w-4 h-4 mr-2" />
					Billet électronique
				</div>
				<div className="flex items-center">
					<ShieldCheck className="text-orange-500 w-4 h-4 mr-2" />
					Paiement sécurisé
				</div>
				<div className="flex items-center">
					<Undo2 className="text-orange-500 w-4 h-4 mr-2" />
					Remboursement jusqu'à 7 jours avant
				</div>
			</div>
			<div className="bg-white rounded-xl p-0 mt-6">
				<button
					onClick={async () => {
						try {
							await navigator.clipboard.writeText(window.location.href);
							setCopied(true);
							setTimeout(() => setCopied(false), 2000);
						} catch {}
					}}
					className="w-full mt-3 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
				>
					{copied ? (
						<>
							<Check className="w-4 h-4 mr-2" /> Lien copié !
						</>
					) : (
						<>
							<Copy className="w-4 h-4 mr-2" /> Copier le lien
						</>
					)}
				</button>
			</div>
		</div>
	);
};

export default Sidebar;


