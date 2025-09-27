"use client";
import React, { useState } from "react";
import { Ticket, Share2, Check, Smartphone, ShieldCheck, Undo2, Copy } from "lucide-react";
import Link from "next/link";
import { TicketType } from "@/store/api/event/event.type";

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
		return sum + (ticketType ? ticketType.price * quantity : 0);
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
									className="p-4 border border-gray-200 rounded-lg"
								>
									<div className="flex justify-between items-start mb-2">
										<h4 className="font-semibold text-gray-900">
											{ticketType.name}
										</h4>
										<span className="text-lg font-bold text-orange-500">
											{ticketType.price}€
										</span>
									</div>
									{ticketType.description && (
										<p className="text-sm text-gray-600 mb-3">
											{ticketType.description}
										</p>
									)}
									<div className="flex justify-between items-center text-xs text-gray-500 mb-3">
										{ticketType.availableQuantity !==
											undefined && (
											<span>
												{
													ticketType.availableQuantity
												}{" "}
												disponibles
											</span>
										)}
										<span>
											Min: {ticketType.minPurchase} |
											Max: {ticketType.maxPurchase}
										</span>
									</div>
									{/* Quantity selector directly on card */}
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium text-gray-700">
											Quantité:
										</span>
										<div className="flex items-center space-x-3">
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
												className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
												aria-label="Diminuer"
											>
												-
											</button>
											<span className="text-lg font-bold text-gray-900 w-8 text-center">
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
												className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
												aria-label="Augmenter"
											>
												+
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
					<span className="text-2xl font-bold text-orange-500">{total}€</span>
				</div>
			)}
			<div className="space-y-3">
				<Link
					href="/checkout/summary"
					className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold inline-flex items-center justify-center"
				>
					<Ticket className="w-5 h-5 mr-2" /> Réserver maintenant
				</Link>
				<button className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold inline-flex items-center justify-center">
					<Share2 className="w-5 h-5 mr-2" /> Ajouter au panier
				</button>
			</div>
			<div className="mt-6 text-sm text-gray-600 space-y-2">
				<div className="flex items-center">
					<Check className="text-green-500 w-4 h-4 mr-2" />
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


