"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector, useAppDispatch } from "@/store/features/hooks";
import {
	selectCartItems,
	selectCartSubtotal,
	selectCartFees,
	selectCartTotal,
	selectCartIsEmpty,
} from "@/store/selectors/cart.selectors";
import {
	updateQuantity,
	removeFromCart,
	updateBuyerInfo,
	setCurrentStep,
} from "@/store/features/cart.slice";
import { buyerInfoSchema, BuyerInfoFormData } from "@/schemas/checkout.schema";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function SummaryPage() {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const cartItems = useAppSelector(selectCartItems);
	const subtotal = useAppSelector(selectCartSubtotal);
	const fees = useAppSelector(selectCartFees);
	const total = useAppSelector(selectCartTotal);
	const isEmpty = useAppSelector(selectCartIsEmpty);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<BuyerInfoFormData>({
		resolver: yupResolver(buyerInfoSchema),
		mode: "onChange",
	});

	// Redirect if cart is empty
	React.useEffect(() => {
		if (isEmpty) {
			router.push("/");
		}
	}, [isEmpty, router]);

	const handleQuantityUpdate = (eventId: string, ticketTypeId: string, newQuantity: number) => {
		dispatch(updateQuantity({ eventId, ticketTypeId, quantity: newQuantity }));
	};

	const handleRemoveTicket = (eventId: string, ticketTypeId: string) => {
		dispatch(removeFromCart({ eventId, ticketTypeId }));
	};

	const onSubmit = (data: BuyerInfoFormData) => {
		dispatch(updateBuyerInfo(data));
		dispatch(setCurrentStep("payment"));
		router.push("/checkout/payment");
	};

	if (isEmpty) {
		return null; // Will redirect
	}

	return (
		<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
										className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
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

					{/* Buyer Information Form */}
					<div className="bg-white rounded-xl shadow-sm p-6">
						<h3 className="text-lg font-semibold text-gray-900">
							Informations de contact
						</h3>
						<p className="text-sm text-gray-500 mb-5">
							Entrez vos informations de contact et votre numero de
							téléphone Wave pour finaliser l'achat.
						</p>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Prénom *
									</label>
									<input
										{...register("buyerFirstName")}
										type="text"
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
									{errors.buyerFirstName && (
										<p className="text-red-500 text-sm mt-1">
											{errors.buyerFirstName.message}
										</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Nom *
									</label>
									<input
										{...register("buyerLastName")}
										type="text"
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
									{errors.buyerLastName && (
										<p className="text-red-500 text-sm mt-1">
											{errors.buyerLastName.message}
										</p>
									)}
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email *
								</label>
								<input
									{...register("buyerEmail")}
									type="email"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
								/>
								{errors.buyerEmail && (
									<p className="text-red-500 text-sm mt-1">
										{errors.buyerEmail.message}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Téléphone Wave *
								</label>
								<input
									{...register("buyerPhone")}
									type="tel"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
								/>
								{errors.buyerPhone && (
									<p className="text-red-500 text-sm mt-1">
										{errors.buyerPhone.message}
									</p>
								)}
							</div>
						</form>
					</div>
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
							<div className="flex items-center justify-between">
								<span className="text-gray-600">
									Frais de service
								</span>
								<span className="text-gray-900 font-medium">
									{formatPrice(fees)}
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
						<div className="mt-6 space-y-3">
							<button
								onClick={handleSubmit(onSubmit)}
								disabled={!isValid}
								className="w-full px-5 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold"
							>
								Payer maintenant
							</button>
							<button
								onClick={() => router.back()}
								className="block w-full text-center text-sm text-gray-600 hover:text-gray-800"
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
