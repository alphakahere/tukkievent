"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/features/hooks";
import {
	selectCartItems,
	selectCartTotal,
	selectCartIsEmpty,
	selectBuyerInfo,
} from "@/store/selectors/cart.selectors";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import BuyerForm from "./BuyerForm";
import { useCreateOrderMutation } from "@/store/api/order/order.api";

export default function PaymentPage() {
	const router = useRouter();
	const [createOrder, { isLoading, error }] = useCreateOrderMutation();

	const cartItems = useAppSelector(selectCartItems);
	const total = useAppSelector(selectCartTotal);
	const isEmpty = useAppSelector(selectCartIsEmpty);
	const buyerInfo = useAppSelector(selectBuyerInfo);

	// Redirect if cart is empty or buyer info missing
	useEffect(() => {
		if (isEmpty) {
			router.back();
		}
	}, [isEmpty, router]);

	const onSubmit = async () => {
		try {
			const orderData = {
				eventId: cartItems[0]?.eventId, // For now, assume single event
				buyerEmail: buyerInfo.buyerEmail!,
				buyerPhone: buyerInfo.buyerPhone!,
				buyerFirstName: buyerInfo.buyerFirstName!,
				buyerLastName: buyerInfo.buyerLastName!,
				subtotal: total.toString(),
				fees: "0",
				totalAmount: total.toString(),
				paymentMethod: "WAVE",
				tickets: cartItems.flatMap((event) =>
					event.tickets.map((ticket) => ({
						ticketTypeId: ticket.ticketTypeId,
						quantity: ticket.quantity,
						unitPrice: ticket.unitPrice,
					}))
				),
			};

			const result = await createOrder(orderData).unwrap();
			console.log(result);
		} catch (error) {
			console.error("Order creation failed:", error);
		}
	};

	if (isEmpty) {
		return null; // Will redirect
	}

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Paiement</h1>
			</div>

			<div className="grid lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<BuyerForm onCreateOrder={onSubmit} isLoading={isLoading} />
				</div>

				{/* Order Summary */}
				<div className="lg:col-span-1">
					{error && (
						<div className="flex items-center justify-center">
							<p className="text-red-500">
								Erreur lors de la création de la commande
							</p>
						</div>
					)}
					<div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-24">
						<h3 className="text-base font-semibold text-gray-900 mb-4">
							Récapitulatif
						</h3>

						{cartItems.map((eventItem) => (
							<div key={eventItem.eventId} className="mb-4">
								<div className="text-sm font-medium text-gray-900 mb-1">
									{eventItem.eventTitle}
								</div>
								<div className="text-xs text-gray-500 mb-2">
									{format(
										new Date(eventItem.eventDate),
										"d MMMM yyyy",
										{ locale: fr }
									)}
								</div>
								{eventItem.tickets.map((ticket) => (
									<div
										key={ticket.ticketTypeId}
										className="flex justify-between text-xs text-gray-600 mb-1"
									>
										<span>
											{ticket.ticketTypeName} x
											{ticket.quantity}
										</span>
										<span>
											{formatPrice(ticket.totalPrice)}
										</span>
									</div>
								))}
							</div>
						))}

						<hr className="my-4" />
						<div className="flex items-center justify-between">
							<span className="font-semibold text-gray-900">Total</span>
							<span className="font-bold text-orange-600 text-lg">
								{formatPrice(total)}
							</span>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
