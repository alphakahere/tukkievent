"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector, useAppDispatch } from "@/store/features/hooks";
import {
	selectCartItems,
	selectCartTotal,
	selectCartIsEmpty,
	selectBuyerInfo,
} from "@/store/selectors/cart.selectors";
import { setPaymentMethod, setCurrentStep } from "@/store/features/cart.slice";
import { useCreateOrderMutation } from "@/store/api/order/order.api";
import { paymentMethodSchema, PaymentMethodFormData } from "@/schemas/checkout.schema";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CreditCard, Smartphone, Building2, Clock } from "lucide-react";

export default function PaymentPage() {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const cartItems = useAppSelector(selectCartItems);
	const total = useAppSelector(selectCartTotal);
	const isEmpty = useAppSelector(selectCartIsEmpty);
	const buyerInfo = useAppSelector(selectBuyerInfo);

	const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
	const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm<PaymentMethodFormData>({
		resolver: yupResolver(paymentMethodSchema),
		mode: "onChange",
	});

	const selectedPaymentMethod = watch("paymentMethod");

	// Redirect if cart is empty or buyer info missing
	useEffect(() => {
		if (isEmpty) {
			router.push("/");
		} else if (
			!buyerInfo.buyerEmail ||
			!buyerInfo.buyerFirstName ||
			!buyerInfo.buyerLastName
		) {
			router.push("/checkout/summary");
		}
	}, [isEmpty, buyerInfo, router]);

	// Countdown timer
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					router.push("/checkout/expired");
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [router]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const onSubmit = async (data: PaymentMethodFormData) => {
		try {
			dispatch(setPaymentMethod(data.paymentMethod));
			dispatch(setCurrentStep("processing"));

			// Create order
			const orderData = {
				eventId: cartItems[0]?.eventId, // For now, assume single event
				buyerEmail: buyerInfo.buyerEmail!,
				buyerPhone: buyerInfo.buyerPhone!,
				buyerFirstName: buyerInfo.buyerFirstName!,
				buyerLastName: buyerInfo.buyerLastName!,
				subtotal: total,
				fees: 0,
				totalAmount: total,
				paymentMethod: data.paymentMethod,
				tickets: cartItems.flatMap((event) =>
					event.tickets.map((ticket) => ({
						ticketTypeId: ticket.ticketTypeId,
						quantity: ticket.quantity,
						unitPrice: ticket.unitPrice,
					}))
				),
			};

			const result = await createOrder(orderData).unwrap();

			// Navigate to processing page
			router.push("/checkout/processing");
		} catch (error) {
			console.error("Order creation failed:", error);
			router.push("/checkout/failed");
		}
	};

	if (isEmpty) {
		return null; // Will redirect
	}

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Paiement</h1>
				<span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
					<Clock className="w-4 h-4 mr-1" />
					{formatTime(timeLeft)}
				</span>
			</div>

			<div className="grid lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Payment Methods */}
						<div className="bg-white rounded-xl shadow-sm p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Choisissez votre méthode de paiement
							</h3>

							<div className="space-y-4">
								{/* Mobile Money */}
								<label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
									<input
										{...register("paymentMethod")}
										type="radio"
										value="mobile_money"
										className="sr-only"
									/>
									<div
										className={`w-4 h-4 rounded-full border-2 mr-3 ${
											selectedPaymentMethod ===
											"mobile_money"
												? "border-orange-500 bg-orange-500"
												: "border-gray-300"
										}`}
									>
										{selectedPaymentMethod ===
											"mobile_money" && (
											<div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
										)}
									</div>
									<div className="flex items-center gap-3 flex-1">
										<div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
											<Smartphone className="w-5 h-5 text-blue-600" />
										</div>
										<div>
											<div className="font-medium text-gray-900">
												Mobile Money
											</div>
											<div className="text-sm text-gray-500">
												Wave, Orange Money, Free
												Money
											</div>
										</div>
									</div>
								</label>

								{/* Credit Card */}
								<label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
									<input
										{...register("paymentMethod")}
										type="radio"
										value="card"
										className="sr-only"
									/>
									<div
										className={`w-4 h-4 rounded-full border-2 mr-3 ${
											selectedPaymentMethod === "card"
												? "border-orange-500 bg-orange-500"
												: "border-gray-300"
										}`}
									>
										{selectedPaymentMethod === "card" && (
											<div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
										)}
									</div>
									<div className="flex items-center gap-3 flex-1">
										<div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center">
											<CreditCard className="w-5 h-5 text-green-600" />
										</div>
										<div>
											<div className="font-medium text-gray-900">
												Carte bancaire
											</div>
											<div className="text-sm text-gray-500">
												Visa, Mastercard
											</div>
										</div>
									</div>
								</label>

								{/* Bank Transfer */}
								<label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
									<input
										{...register("paymentMethod")}
										type="radio"
										value="bank_transfer"
										className="sr-only"
									/>
									<div
										className={`w-4 h-4 rounded-full border-2 mr-3 ${
											selectedPaymentMethod ===
											"bank_transfer"
												? "border-orange-500 bg-orange-500"
												: "border-gray-300"
										}`}
									>
										{selectedPaymentMethod ===
											"bank_transfer" && (
											<div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
										)}
									</div>
									<div className="flex items-center gap-3 flex-1">
										<div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center">
											<Building2 className="w-5 h-5 text-purple-600" />
										</div>
										<div>
											<div className="font-medium text-gray-900">
												Virement bancaire
											</div>
											<div className="text-sm text-gray-500">
												Transfert direct
											</div>
										</div>
									</div>
								</label>
							</div>

							{errors.paymentMethod && (
								<p className="text-red-500 text-sm mt-2">
									{errors.paymentMethod.message}
								</p>
							)}
						</div>

						{/* Payment Details */}
						{selectedPaymentMethod === "mobile_money" && (
							<div className="bg-white rounded-xl shadow-sm p-6">
								<h4 className="font-semibold text-gray-900 mb-4">
									Informations Mobile Money
								</h4>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Numéro de téléphone
									</label>
									<input
										type="tel"
										placeholder="77 XXX XX XX"
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
								</div>
							</div>
						)}

						{selectedPaymentMethod === "card" && (
							<div className="bg-white rounded-xl shadow-sm p-6">
								<h4 className="font-semibold text-gray-900 mb-4">
									Informations de carte
								</h4>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Numéro de carte
										</label>
										<input
											type="text"
											placeholder="1234 5678 9012 3456"
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Date d'expiration
											</label>
											<input
												type="text"
												placeholder="MM/YY"
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												CVV
											</label>
											<input
												type="text"
												placeholder="123"
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
											/>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex items-center justify-between">
							<Link
								href="/checkout/summary"
								className="text-gray-600 hover:text-gray-800"
							>
								← Retour
							</Link>
							<button
								type="submit"
								disabled={!isValid || isCreatingOrder}
								className="px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold"
							>
								{isCreatingOrder
									? "Traitement..."
									: "Confirmer le paiement"}
							</button>
						</div>
					</form>
				</div>

				{/* Order Summary */}
				<div className="lg:col-span-1">
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
