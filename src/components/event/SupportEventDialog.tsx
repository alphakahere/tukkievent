"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Heart, Ticket, Minus, Plus, ChevronRight } from "lucide-react";
import { Event } from "@/store/api/event/event.type";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Image from "next/image";
import { useCreateOrderMutation } from "@/store/api/order/order.api";

type SupportEventDialogProps = {
	event: Event;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

type PaymentMethod = "WAVE" | "PAYPAL";
type Currency = "XOF" | "EUR";

const SupportEventDialog: React.FC<SupportEventDialogProps> = ({
	event,
	open,
	onOpenChange,
}) => {
	const [createOrder, { isLoading: isCreatingOrder, error: orderError }] =
		useCreateOrderMutation();
	const [step, setStep] = useState<
		"method" | "tickets" | "details" | "confirm"
	>("method");
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
		null
	);
	const [currency, setCurrency] = useState<Currency>("XOF");
	const [selectedTickets, setSelectedTickets] = useState<
		Record<string, number>
	>({});
	const [phoneNumber, setPhoneNumber] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);

	const ticketTypes = event.ticketTypes || [];

	// Reset state when dialog opens/closes
	useEffect(() => {
		if (!open) {
			setStep("method");
			setPaymentMethod(null);
			setCurrency("XOF");
			setSelectedTickets({});
			setPhoneNumber("");
			setIsProcessing(false);
		}
	}, [open]);

	// Update currency when payment method changes
	useEffect(() => {
		if (paymentMethod === "WAVE") {
			setCurrency("XOF");
		} else if (paymentMethod === "PAYPAL") {
			setCurrency("EUR");
		}
	}, [paymentMethod]);

	const updateQuantity = (ticketTypeId: string, quantity: number) => {
		setSelectedTickets((prev) => ({
			...prev,
			[ticketTypeId]: quantity,
		}));
	};

	// Calculate total based on currency
	const calculateTotal = () => {
		return Object.entries(selectedTickets).reduce(
			(sum, [ticketTypeId, quantity]) => {
				const ticketType = ticketTypes.find(
					(tt) => tt.id === ticketTypeId
				);
				if (!ticketType) return sum;

				// Use Euro price for PayPal if available, otherwise convert from XOF
				if (currency === "EUR") {
					const euroPrice = ticketType.priceEuro
						? Number(ticketType.priceEuro)
						: Math.round(Number(ticketType.price) / 656 * 100) / 100;
					return sum + euroPrice * quantity;
				}

				// Use XOF price for Wave
				const price = Number(ticketType.price);
				return sum + price * quantity;
			},
			0
		);
	};

	const total = calculateTotal();

	const formatPrice = (price: number) => {
		if (currency === "XOF") {
			return new Intl.NumberFormat("fr-FR", {
				style: "currency",
				currency: "XOF",
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}).format(price);
		} else {
			return new Intl.NumberFormat("fr-FR", {
				style: "currency",
				currency: "EUR",
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}).format(price);
		}
	};

	const handleMethodSelect = (method: PaymentMethod) => {
		setPaymentMethod(method);
		setStep("tickets");
	};

	const handleTicketsNext = () => {
		if (total > 0) {
			setStep("details");
		}
	};

	const handlePayNow = async () => {
		setIsProcessing(true);

		try {
			// Prepare tickets array from selected tickets
			const tickets = Object.entries(selectedTickets)
				.filter(([, quantity]) => quantity > 0)
				.map(([ticketTypeId, quantity]) => ({
					ticketTypeId,
					quantity,
				}));

			// Prepare order data
			const orderData = {
				eventId: event.id,
				buyerEmail: "", // Empty for support donations
				buyerPhone: phoneNumber,
				buyerFirstName: "Support",
				buyerLastName: "Donation",
				subtotal: total.toString(),
				fees: "0",
				totalAmount: total.toString(),
				paymentMethod: paymentMethod || "WAVE",
				currency: currency,
				tickets,
			};

			// Create the order
			const result = await createOrder(orderData).unwrap();

			// Check if payment URL exists and open it
			if (
				"paymentUrl" in result &&
				typeof result.paymentUrl === "string"
			) {
				window.location.href = result.paymentUrl;
			} else {
				// If no payment URL, show confirmation
				setStep("confirm");
			}
		} catch (error) {
			console.error("Order creation failed:", error);
			// Keep processing state false to allow retry
		} finally {
			setIsProcessing(false);
		}
	};

	const handleClose = () => {
		onOpenChange(false);
	};

	const renderStepIndicator = () => (
		<div className="flex items-center justify-center space-x-2 mb-6">
			<div
				className={`h-2 w-2 rounded-full ${
					step === "method"
						? "bg-orange-500"
						: "bg-gray-300"
				}`}
			/>
			<div
				className={`h-2 w-2 rounded-full ${
					step === "tickets"
						? "bg-orange-500"
						: "bg-gray-300"
				}`}
			/>
			<div
				className={`h-2 w-2 rounded-full ${
					step === "details"
						? "bg-orange-500"
						: "bg-gray-300"
				}`}
			/>
		</div>
	);

	const renderMethodSelection = () => (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				Choisissez votre méthode de paiement
			</h3>

			<button
				onClick={() => handleMethodSelect("WAVE")}
				className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 text-left group"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="relative w-12 h-12 flex-shrink-0 bg-blue-200 rounded-full">
							<Image
								src="/images/wave.png"
								alt="Wave"
								fill
								className="object-contain rounded-full"
							/>
						</div>
						<div>
							<p className="font-semibold text-gray-900">
								Wave
							</p>
							<p className="text-sm text-gray-600">
								Paiement mobile (XOF)
							</p>
						</div>
					</div>
					<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
				</div>
			</button>

			<button
				disabled
				className="w-full p-4 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed opacity-60 text-left"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="relative w-12 h-12 flex-shrink-0 bg-blue-200 rounded-full">
							<Image
								src="/images/paypal.jpeg"
								alt="PayPal"
								fill
								className="object-contain rounded-full"
							/>
						</div>
						<div>
							<p className="font-semibold text-gray-900">
								PayPal
							</p>
							<p className="text-sm text-gray-600">
								Carte bancaire (EUR - 9€/18€)
							</p>
							<p className="text-xs text-orange-500 font-medium mt-1">
								Disponible bientôt
							</p>
						</div>
					</div>
				</div>
			</button>
		</div>
	);

	const renderTicketSelection = () => (
		<div className="space-y-4">
			<button
				onClick={() => setStep("method")}
				className="text-sm text-gray-600 hover:text-orange-500 flex items-center mb-2"
			>
				← Retour
			</button>

			<div className="mb-4">
				<h3 className="text-lg font-semibold text-gray-900">
					Sélectionnez vos billets
				</h3>
				<p className="text-sm text-gray-600 mt-1">
					Devise:{" "}
					<span className="font-semibold text-orange-500">
						{currency}
					</span>
				</p>
			</div>

			<div className="space-y-3 max-h-[400px] overflow-y-auto">
				{ticketTypes.map((ticketType) => {
					const quantity =
						selectedTickets[ticketType.id] || 0;
					const price = Number(ticketType.price);
					let displayPrice = price;

					// Use Euro price for PayPal if available, otherwise convert from XOF
					if (currency === "EUR") {
						displayPrice = ticketType.priceEuro
							? Number(ticketType.priceEuro)
							: Math.round(price / 656 * 100) / 100;
					}

					return (
						<div
							key={ticketType.id}
							className="bg-white border border-gray-200 rounded-lg p-4"
						>
							<div className="space-y-3">
								<div className="flex items-start gap-3">
									<div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
										<Ticket className="w-5 h-5 text-orange-500" />
									</div>
									<div className="flex-1 min-w-0">
										<h4 className="font-semibold text-base text-gray-900 mb-1">
											{
												ticketType.name
											}
										</h4>
										{ticketType.description && (
											<p className="text-xs text-gray-600 mb-1">
												{
													ticketType.description
												}
											</p>
										)}
									</div>
									<div className="text-right flex-shrink-0">
										<span className="text-lg font-bold text-orange-500">
											{formatPrice(
												displayPrice
											)}
										</span>
									</div>
								</div>

								<div className="flex items-center justify-between pt-2 border-t border-gray-100">
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
											className="text-gray-600 hover:text-orange-500 hover:bg-white rounded-full p-1 transition-all duration-200"
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
											className="text-gray-600 hover:text-orange-500 hover:bg-white rounded-full p-1 transition-all duration-200"
										>
											<Plus className="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{total > 0 && (
				<div className="flex justify-between items-center pt-4 border-t border-gray-200">
					<span className="text-lg font-semibold text-gray-700">
						Total
					</span>
					<span className="text-2xl font-bold text-orange-500">
						{formatPrice(total)}
					</span>
				</div>
			)}

			<Button
				onClick={handleTicketsNext}
				disabled={total === 0}
				className="w-full py-3 text-base"
			>
				Continuer
			</Button>
		</div>
	);

	const renderPaymentDetails = () => (
		<div className="space-y-4">
			<button
				onClick={() => setStep("tickets")}
				className="text-sm text-gray-600 hover:text-orange-500 flex items-center mb-2"
			>
				← Retour
			</button>

			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				Détails de paiement
			</h3>

			{orderError && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-sm text-red-600">
						Une erreur est survenue lors de la création
						de la commande. Veuillez réessayer.
					</p>
				</div>
			)}

			{paymentMethod === "WAVE" && (
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Numéro de téléphone Wave
						</label>
						<PhoneInput
							country="sn"
							value={phoneNumber}
							onChange={setPhoneNumber}
							placeholder="Entrez votre numéro"
							containerClass="w-full"
							inputClass="w-full"
							specialLabel=""
							inputStyle={{
								width: "100%",
								height: 40,
							}}
							masks={{ sn: ".. ... .. .." }}
						/>
						<p className="text-xs text-gray-500 mt-2">
							Vous recevrez une notification de
							paiement sur votre téléphone
						</p>
					</div>
				</div>
			)}

			{paymentMethod === "PAYPAL" && (
				<div className="space-y-4">
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<p className="text-sm text-gray-700">
							Vous serez redirigé vers PayPal pour
							finaliser votre paiement de manière
							sécurisée.
						</p>
					</div>
				</div>
			)}

			<div className="bg-gray-50 rounded-lg p-4 space-y-2">
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Événement:</span>
					<span className="font-medium text-gray-900">
						{event.title}
					</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">
						Méthode de paiement:
					</span>
					<span className="font-medium text-gray-900">
						{paymentMethod}
					</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Devise:</span>
					<span className="font-medium text-gray-900">
						{currency}
					</span>
				</div>
				<div className="flex justify-between pt-2 border-t border-gray-200">
					<span className="font-semibold text-gray-900">
						Montant total:
					</span>
					<span className="font-bold text-orange-500 text-lg">
						{formatPrice(total)}
					</span>
				</div>
			</div>

			<Button
				onClick={handlePayNow}
				disabled={
					isProcessing ||
					isCreatingOrder ||
					(paymentMethod === "WAVE" &&
						phoneNumber.length < 10)
				}
				className="w-full py-3 text-base"
			>
				{isProcessing || isCreatingOrder
					? "Traitement en cours..."
					: "Payer maintenant"}
			</Button>
		</div>
	);

	const renderConfirmation = () => (
		<div className="space-y-6 text-center py-6">
			<div className="flex justify-center">
				<div className="bg-orange-100 p-6 rounded-full">
					<Heart className="w-12 h-12 text-orange-500" />
				</div>
			</div>

			<div>
				<h3 className="text-2xl font-bold text-gray-900 mb-2">
					Merci de soutenir l'événement !
				</h3>
				<p className="text-gray-600">
					Votre contribution aide à faire de cet événement
					un succès.
				</p>
			</div>

			<div className="bg-gray-50 rounded-lg p-4 space-y-2 text-left">
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Événement:</span>
					<span className="font-medium text-gray-900">
						{event.title}
					</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Montant:</span>
					<span className="font-bold text-orange-500">
						{formatPrice(total)}
					</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Méthode:</span>
					<span className="font-medium text-gray-900">
						{paymentMethod}
					</span>
				</div>
			</div>

			<p className="text-sm text-gray-600">
				{paymentMethod === "WAVE"
					? "La validation finale sera effectuée via webhook."
					: "Vous allez recevoir une confirmation par email de PayPal."}
			</p>

			<Button
				onClick={handleClose}
				className="w-full py-3 text-base"
			>
				Fermer
			</Button>
		</div>
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold flex items-center gap-2">
						<Heart className="w-6 h-6 text-orange-500" />
						Soutenir l'événement
					</DialogTitle>
				</DialogHeader>

				{step !== "confirm" && renderStepIndicator()}

				<div className="mt-4">
					{step === "method" && renderMethodSelection()}
					{step === "tickets" && renderTicketSelection()}
					{step === "details" && renderPaymentDetails()}
					{step === "confirm" && renderConfirmation()}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default SupportEventDialog;
