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
			// console.log(orderData, buyerInfo);
			// return;
			const result = await createOrder(orderData).unwrap();
			if ("data" in result) {
				console.log(result);
			}
		} catch (error) {
			console.error("Order creation failed:", error);
		}
	};

	if (isEmpty) {
		return null; // Will redirect
	}

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
			<div className="flex items-center justify-between mb-4 sm:mb-6">
				<h1 className="text-xl sm:text-2xl font-bold text-gray-900">Paiement</h1>
			</div>

			{/* Mobile-first layout: Stack summary above form on mobile */}
			<div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
				{/* Order Summary - Appears first on mobile, second on desktop */}
				<div className="lg:col-span-1 order-1 lg:order-2">
					<div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 lg:sticky lg:top-24">
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

				{/* Payment Form - Appears second on mobile, first on desktop */}
				<div className="lg:col-span-2 order-2 lg:order-1">
					<BuyerForm onCreateOrder={onSubmit} isLoading={isLoading} error={error} />
				</div>
			</div>
		</main>
	);
}
