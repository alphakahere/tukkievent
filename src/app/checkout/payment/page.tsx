"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/features/hooks";
import {
	selectBuyerInfo,
	selectCartItems,
	selectCartIsEmpty,
	selectCartTotal,
} from "@/store/selectors/cart.selectors";
import { setOrderId } from "@/store/features/cart.slice";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
	useCreateOrderMutation,
	useInitiatePaymentMutation,
} from "@/store/api/order/order.api";
import type { PaymentMethod } from "@/store/api/order/order.type";
import BuyerForm from "./BuyerForm";

export default function PaymentPage() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [createOrder, { isLoading: isCreating, error: createError }] = useCreateOrderMutation();
	const [initiatePayment, { isLoading: isInitiating }] = useInitiatePaymentMutation();
	const [submitting, setSubmitting] = useState(false);

	const cartItems = useAppSelector(selectCartItems);
	const total = useAppSelector(selectCartTotal);
	const isEmpty = useAppSelector(selectCartIsEmpty);
	const buyerInfo = useAppSelector(selectBuyerInfo);

	useEffect(() => {
		if (isEmpty) {
			router.replace("/");
		}
	}, [isEmpty, router]);

	const onSubmit = async (paymentMethod: PaymentMethod) => {
		if (submitting) return;
		const eventId = cartItems[0]?.eventId;
		if (!eventId) {
			toast.error("Panier vide");
			return;
		}
		setSubmitting(true);
		try {
			const order = await createOrder({
				eventId,
				items: cartItems.flatMap((event) =>
					event.tickets.map((ticket) => ({
						ticketTypeId: ticket.ticketTypeId,
						quantity: ticket.quantity,
					})),
				),
				buyer: {
					firstName: buyerInfo.buyerFirstName ?? "",
					lastName: buyerInfo.buyerLastName ?? "",
					email: buyerInfo.buyerEmail || undefined,
					phone: buyerInfo.buyerPhone || undefined,
				},
				currency: "XOF",
			}).unwrap();

			dispatch(setOrderId(order.id));

			const payment = await initiatePayment({
				orderId: order.id,
				payload: {
					method: paymentMethod,
					phone: buyerInfo.buyerPhone,
					returnUrl:
						typeof window !== "undefined"
							? `${window.location.origin}/checkout/processing?orderId=${order.id}`
							: undefined,
				},
			}).unwrap();

			router.push(
				`/checkout/processing?orderId=${order.id}&redirect=${encodeURIComponent(payment.redirectUrl)}`,
			);
		} catch (err) {
			console.error("Order creation failed:", err);
			const message =
				(err as { data?: { message?: string } })?.data?.message ?? "Le paiement a échoué.";
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	};

	if (isEmpty) return null;

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
			<div className="flex items-center justify-between mb-4 sm:mb-6">
				<h1 className="text-xl sm:text-2xl font-bold text-gray-900">Paiement</h1>
			</div>

			<div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
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
									{format(new Date(eventItem.eventDate), "d MMMM yyyy", { locale: fr })}
								</div>
								{eventItem.tickets.map((ticket) => (
									<div
										key={ticket.ticketTypeId}
										className="flex justify-between text-xs text-gray-600 mb-1"
									>
										<span>
											{ticket.ticketTypeName} x{ticket.quantity}
										</span>
										<span>{formatPrice(ticket.totalPrice)}</span>
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

				<div className="lg:col-span-2 order-2 lg:order-1">
					<BuyerForm
						onCreateOrder={onSubmit}
						isLoading={isCreating || isInitiating || submitting}
						error={createError}
					/>
				</div>
			</div>
		</main>
	);
}
