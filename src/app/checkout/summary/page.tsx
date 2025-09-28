"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/features/hooks";
import {
	selectCartItems,
	selectCartSubtotal,
	selectCartTotal,
	selectCartIsEmpty,
} from "@/store/selectors/cart.selectors";
import { updateQuantity, removeFromCart } from "@/store/features/cart.slice";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SummaryPage() {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const cartItems = useAppSelector(selectCartItems);
	const subtotal = useAppSelector(selectCartSubtotal);
	const total = useAppSelector(selectCartTotal);
	const isEmpty = useAppSelector(selectCartIsEmpty);

	// Redirect if cart is empty
	React.useEffect(() => {
		if (isEmpty) {
			router.back();
		}
	}, [isEmpty, router]);

	const handleQuantityUpdate = (eventId: string, ticketTypeId: string, newQuantity: number) => {
		dispatch(updateQuantity({ eventId, ticketTypeId, quantity: newQuantity }));
	};

	const handleRemoveTicket = (eventId: string, ticketTypeId: string) => {
		dispatch(removeFromCart({ eventId, ticketTypeId }));
	};

	return (
		<main>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">
					Récapitulatif de la réservation
				</h1>
			</div>

			<div className="grid lg:grid-cols-3 gap-8">
				{/* Left Column - Cart Items */}
				<div className="lg:col-span-2 space-y-6">
					{cartItems.map((eventItem) => (
						<div
							key={eventItem.eventId}
							className="bg-white rounded-xl shadow-sm p-6"
						>
							{/* Event Header */}
							<div className="flex items-start justify-between mb-4">
								<div>
									<h2 className="text-lg font-semibold text-gray-900">
										{eventItem.eventTitle}
									</h2>
									<p className="text-sm text-gray-600">
										{format(
											new Date(eventItem.eventDate),
											"EEEE d MMMM yyyy",
											{ locale: fr }
										)}
									</p>
								</div>
							</div>

							{/* Tickets */}
							<div className="space-y-4">
								<h3 className="text-base font-semibold text-gray-900">
									Tickets
								</h3>
								{eventItem.tickets.map((ticket) => (
									<div
										key={ticket.ticketTypeId}
										className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 gap-4"
									>
										<div className="flex-1">
											<p className="font-medium text-gray-800">
												{ticket.ticketTypeName}
											</p>
											<p className="text-sm text-gray-500">
												Prix unitaire:{" "}
												{formatPrice(
													ticket.unitPrice
												)}
											</p>
										</div>
										<div className="flex items-center gap-3">
											<button
												onClick={() =>
													handleQuantityUpdate(
														eventItem.eventId,
														ticket.ticketTypeId,
														ticket.quantity -
															1
													)
												}
												className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
											>
												<Minus className="w-4 h-4" />
											</button>
											<span className="w-8 text-center font-semibold">
												{ticket.quantity}
											</span>
											<button
												onClick={() =>
													handleQuantityUpdate(
														eventItem.eventId,
														ticket.ticketTypeId,
														ticket.quantity +
															1
													)
												}
												className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
											>
												<Plus className="w-4 h-4" />
											</button>
											<button
												onClick={() =>
													handleRemoveTicket(
														eventItem.eventId,
														ticket.ticketTypeId
													)
												}
												className="ml-2 p-1 text-red-500 hover:text-red-700"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
										<div className="min-w-[80px] text-right font-semibold text-gray-900">
											{formatPrice(ticket.totalPrice)}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Right Column - Order Summary */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
						<h3 className="text-base font-semibold text-gray-900 mb-4">
							Récapitulatif
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex items-center justify-between">
								<span className="text-gray-600">Sous-total</span>
								<span className="text-gray-900 font-medium">
									{formatPrice(subtotal)}
								</span>
							</div>
							<hr className="my-3" />
							<div className="flex items-center justify-between text-base">
								<span className="font-semibold text-gray-900">
									Total
								</span>
								<span className="font-bold text-orange-600">
									{formatPrice(total)}
								</span>
							</div>
						</div>
						<div className="mt-6 space-y-3 flex flex-col gap-3 items-center">
							<Button
								onClick={() => router.push("/checkout/payment")}
								className="w-min"
							>
								Continuer vers le paiement
							</Button>
							<button
								onClick={() => router.back()}
								className="block text-center text-sm text-gray-600 hover:text-gray-800"
							>
								Modifier la sélection
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
