"use client";
import React, { useState, useEffect } from "react";
import { Ticket, Check, Smartphone, ShieldCheck, Undo2, Copy, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/features/hooks";
import { setTicketsForEvent } from "@/store/features/cart.slice";
import { selectCartItems } from "@/store/selectors/cart.selectors";
import { Event } from "@/store/api/event/event.type";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

type SidebarProps = {
	event: Event;
};

const Sidebar: React.FC<SidebarProps> = ({ event }) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [copied, setCopied] = useState(false);
	const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const ticketTypes = event.ticketTypes || [];

	const cartItems = useAppSelector(selectCartItems);

	useEffect(() => {
		const initialQuantities: Record<string, number> = {};
		const eventInCart = cartItems.find((item) => item.eventId === event.id);

		ticketTypes.forEach((ticketType) => {
			const ticketInCart = eventInCart?.tickets.find(
				(t) => t.ticketTypeId === ticketType.id
			);
			initialQuantities[ticketType.id] = ticketInCart?.quantity || 0;
		});
		setLocalQuantities(initialQuantities);
	}, [event.id, ticketTypes, cartItems]);

	const updateQuantity = (ticketTypeId: string, quantity: number) => {
		setLocalQuantities((prev) => ({
			...prev,
			[ticketTypeId]: quantity,
		}));
	};

	// Calculate local total
	const total = Object.entries(localQuantities).reduce((sum, [ticketTypeId, quantity]) => {
		const ticketType = ticketTypes.find((tt) => tt.id === ticketTypeId);
		return sum + (ticketType ? Number(ticketType.price) * quantity : 0);
	}, 0);

	// Update cart when user clicks "Réserver maintenant"
	const handleReserveNow = () => {
		const tickets = Object.entries(localQuantities)
			.filter(([, quantity]) => quantity > 0)
			.map(([ticketTypeId, quantity]) => {
				const ticketType = ticketTypes.find((tt) => tt.id === ticketTypeId)!;
				return {
					ticketTypeId,
					ticketTypeName: ticketType.name,
					quantity,
					unitPrice: Number(ticketType.price),
				};
			});

		if (tickets.length > 0) {
			dispatch(
				setTicketsForEvent({
					eventId: event.id,
					eventTitle: event.title,
					eventDate: event.startDatetime,
					tickets,
				})
			);

			setIsDialogOpen(false); // Close dialog on mobile
			router.push("/checkout/summary");
		}
	};

	// Ticket Selection Component (reusable for desktop and mobile)
	const TicketSelection = ({ isMobile = false }: { isMobile?: boolean }) => (
		<>
			{ticketTypes && ticketTypes.length > 0 && (
				<div className="mb-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Types de billets
					</h3>
					<div className="space-y-3">
						{ticketTypes.map((ticketType) => {
							const quantity = localQuantities[ticketType.id] || 0;
							return (
								<div
									key={ticketType.id}
									className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 transition-all duration-200"
								>
									{/* Mobile-first layout */}
									<div className="space-y-3">
										{/* Header with icon and title */}
										<div className="flex items-start gap-3">
											<div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
												<Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
													{ticketType.name}
												</h4>
												{ticketType.description && (
													<p className="text-xs text-gray-600 mb-1">
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
											<div className="text-right flex-shrink-0">
												<span className="text-base sm:text-lg font-bold text-orange-500">
													{formatPrice(
														Number(
															ticketType.price
														)
													)}
												</span>
											</div>
										</div>

										{/* Quantity controls */}
										<div className="flex items-center justify-between pt-2 border-t border-gray-100">
											<span className="text-sm font-medium text-gray-700">
												Quantité:
											</span>
											<div className="flex items-center bg-gray-50 rounded-full px-2 sm:px-3 py-1.5 sm:py-2">
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
													<Minus className="w-3 h-3 sm:w-4 sm:h-4" />
												</button>
												<span className="text-gray-900 font-bold mx-3 sm:mx-4 min-w-[24px] sm:min-w-[32px] text-center text-sm sm:text-base">
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
													<Plus className="w-3 h-3 sm:w-4 sm:h-4" />
												</button>
											</div>
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
				<Button
					onClick={handleReserveNow}
					disabled={total === 0}
					className="w-full py-3 sm:py-5 text-sm sm:text-base"
				>
					<Ticket className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Réserver maintenant
				</Button>
			</div>

			<div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600 space-y-2">
				<div className="flex items-center">
					<Check className="text-orange-500 w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
					<span>Confirmation instantanée</span>
				</div>
				<div className="flex items-center">
					<Smartphone className="text-orange-500 w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
					<span>Billet électronique</span>
				</div>
				<div className="flex items-center">
					<ShieldCheck className="text-orange-500 w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
					<span>Paiement sécurisé</span>
				</div>
				<div className="flex items-center">
					<Undo2 className="text-orange-500 w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
					<span>Remboursement jusqu'à 7 jours avant</span>
				</div>
			</div>

			{!isMobile && (
				<div className="bg-white rounded-xl p-0 mt-6">
					<button
						onClick={async () => {
							try {
								await navigator.clipboard.writeText(
									window.location.href
								);
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
			)}
		</>
	);

	return (
		<>
			{/* Desktop Sidebar - Hidden on mobile */}
			<div className="hidden lg:block bg-white rounded-xl p-4 sm:p-6 mb-6 lg:sticky lg:top-24">
				<TicketSelection />
			</div>

			{/* Mobile Fixed Bottom Button */}
			<div className="lg:hidden">
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4 shadow-lg">
							<div className="flex items-center justify-between mb-3">
								<div>
									<p className="text-sm text-gray-600">
										À partir de
									</p>
									<p className="text-lg font-bold text-orange-500">
										{ticketTypes.length > 0
											? formatPrice(
													Math.min(
														...ticketTypes.map(
															(t) =>
																Number(
																	t.price
																)
														)
													)
											  )
											: "0 €"}
									</p>
								</div>
								{total > 0 && (
									<div className="text-right">
										<p className="text-sm text-gray-600">
											Total sélectionné
										</p>
										<p className="text-lg font-bold text-orange-500">
											{formatPrice(total)}
										</p>
									</div>
								)}
							</div>
							<Button className="w-full py-3 text-base font-semibold">
								<Ticket className="w-5 h-5 mr-2" />
								{total > 0
									? "Voir ma sélection"
									: "Choisir mes billets"}
							</Button>
						</div>
					</DialogTrigger>

					<DialogContent className="sm:max-w-lg max-h-[95vh] overflow-y-auto p-4 sm:p-6 m-2 sm:m-0">
						<DialogHeader className="pb-4">
							<DialogTitle className="text-left text-lg sm:text-xl font-bold">
								Réserver vos billets
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<TicketSelection isMobile={true} />
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
};

export default Sidebar;


