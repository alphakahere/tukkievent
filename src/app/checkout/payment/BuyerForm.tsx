"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/features/hooks";
import { updateBuyerInfo } from "@/store/features/cart.slice";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Label } from "@/components/ui/label";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

type PaymentMethod = "WAVE" | "PAYPAL";
type Currency = "XOF" | "EUR";

const createBuyerInfoSchema = (paymentMethod: PaymentMethod) => yup.object({
	buyerFirstName: yup
		.string()
		.required("Le prénom est requis")
		.min(2, "Le prénom doit contenir au moins 2 caractères")
		.max(50, "Le prénom ne peut pas dépasser 50 caractères"),

	buyerLastName: yup
		.string()
		.required("Le nom est requis")
		.min(2, "Le nom doit contenir au moins 2 caractères")
		.max(50, "Le nom ne peut pas dépasser 50 caractères"),

	buyerEmail: yup.string().email("Veuillez entrer un email valide").nullable().optional(),

	buyerPhone: paymentMethod === "WAVE"
		? yup
			.string()
			.required("Le numéro de téléphone est requis")
			.min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres")
		: yup.string().optional(),
});

export type BuyerInfoFormData = yup.InferType<ReturnType<typeof createBuyerInfoSchema>>;

interface Props {
	onCreateOrder: (paymentMethod: PaymentMethod, currency: Currency) => void;
	isLoading: boolean;
	error: FetchBaseQueryError | SerializedError | undefined;
}

const BuyerForm = (props: Props) => {
	const { onCreateOrder, isLoading, error } = props;
	const dispatch = useAppDispatch();
	const [buyerPhone, setBuyerPhone] = useState("");
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
	const [currency, setCurrency] = useState<Currency>("XOF");

	const {
		register,
		handleSubmit,
		setValue,
		trigger,
		formState: { errors, isValid },
	} = useForm<BuyerInfoFormData>({
		// @ts-ignore
		resolver: yupResolver(createBuyerInfoSchema(paymentMethod || "WAVE")),
		mode: "onChange",
	});

	// Update currency when payment method changes
	useEffect(() => {
		if (paymentMethod === "WAVE") {
			setCurrency("XOF");
		} else if (paymentMethod === "PAYPAL") {
			setCurrency("EUR");
		}
	}, [paymentMethod]);

	// Re-validate form when payment method changes
	useEffect(() => {
		if (paymentMethod) {
			trigger();
		}
	}, [paymentMethod, trigger]);

	const onSubmit = async (data: BuyerInfoFormData) => {
		if (!paymentMethod) return;

		// Clean the data to handle nullable email
		const cleanedData = {
			...data,
			buyerEmail: data.buyerEmail || undefined, // Convert null to undefined
			buyerPhone: paymentMethod === "PAYPAL" ? undefined : data.buyerPhone,
		};
		dispatch(updateBuyerInfo(cleanedData));
		await onCreateOrder(paymentMethod, currency);
	};

	const handlePhoneChange = async (value: string) => {
		setBuyerPhone(value);
		setValue("buyerPhone", value, { shouldValidate: true });
		// Trigger validation for the phone field
		await trigger("buyerPhone");
	};

	// If no payment method selected, show payment method selection
	if (!paymentMethod) {
		return (
			<div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
				<h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
					Choisissez votre méthode de paiement
				</h3>

				<div className="space-y-4">
					<button
						type="button"
						onClick={() => setPaymentMethod("WAVE")}
						className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 text-left group"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<div className="relative w-12 h-12 flex-shrink-0 bg-blue-200 rounded-full overflow-hidden">
									<Image
										src="/images/wave.png"
										alt="Wave"
										fill
										sizes="48px"
										className="object-contain"
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
						type="button"
						onClick={() => setPaymentMethod("PAYPAL")}
						className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 text-left group"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<div className="relative w-12 h-12 flex-shrink-0 bg-blue-200 rounded-full overflow-hidden">
									<Image
										src="/images/paypal.jpeg"
										alt="PayPal"
										fill
										sizes="48px"
										className="object-contain"
									/>
								</div>
								<div>
									<p className="font-semibold text-gray-900">
										PayPal
									</p>
									<p className="text-sm text-gray-600">
										Carte bancaire (EUR)
									</p>
								</div>
							</div>
							<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
						</div>
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
			{error && (
				<div className="mb-4">
					<p className="text-red-500 text-sm">
						Une erreur est survenue lors de la création de la commande
					</p>
				</div>
			)}

			<div className="mb-4">
				<button
					onClick={() => setPaymentMethod(null)}
					className="text-sm text-gray-600 hover:text-orange-500 flex items-center"
				>
					← Retour
				</button>
			</div>

			<h3 className="text-base sm:text-lg font-semibold text-gray-900">
				Informations de contact
			</h3>
			<p className="text-sm text-gray-500 mb-4 sm:mb-5">
				{paymentMethod === "WAVE"
					? "Entrez vos informations de contact et votre numéro de téléphone Wave pour finaliser l'achat. L'email est optionnel."
					: "Entrez vos informations de contact. Vous serez redirigé vers PayPal pour finaliser le paiement. L'email est optionnel."
				}
			</p>
			{/* @ts-ignore */}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
					<InputField
						{...register("buyerFirstName")}
						id="buyerFirstName"
						label="Prénom"
						type="text"
						required
						error={errors.buyerFirstName?.message}
						placeholder="Entrez votre prénom"
					/>
					<InputField
						{...register("buyerLastName")}
						id="buyerLastName"
						label="Nom"
						type="text"
						required
						error={errors.buyerLastName?.message}
						placeholder="Entrez votre nom"
					/>
				</div>
				<InputField
					{...register("buyerEmail")}
					id="buyerEmail"
					label="Email (optionnel)"
					type="email"
					error={errors.buyerEmail?.message}
					placeholder="exemple@email.com"
				/>

				{paymentMethod === "WAVE" && (
					<div className="space-y-2 col-span-2">
						<Label htmlFor="buyerPhone">
							Numéro de téléphone Wave{" "}
							<small className="text-xs text-red-500">*</small>
						</Label>
						<PhoneInput
							placeholder="Entrez votre numéro de téléphone Wave"
							country="sn"
							onlyCountries={["sn"]}
							preferredCountries={["sn"]}
							value={buyerPhone}
							onChange={handlePhoneChange}
							inputStyle={{
								width: "100%",
								borderColor: errors.buyerPhone ? "#ef4444" : "#d1d5db",
							}}
							masks={{ sn: ".. ... .. .." }}
						/>
						{errors.buyerPhone && (
							<p className="text-red-500 text-sm mt-1">
								{errors.buyerPhone.message}
							</p>
						)}
					</div>
				)}

				{paymentMethod === "PAYPAL" && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<p className="text-sm text-gray-700">
							Vous serez redirigé vers PayPal pour finaliser votre paiement de manière sécurisée.
						</p>
					</div>
				)}

				<div>
					<Button
						type="submit"
						className="w-full py-3 sm:py-4 text-sm sm:text-base"
						disabled={!isValid || isLoading}
					>
						{isLoading
							? "En cours de paiement..."
							: paymentMethod === "WAVE"
								? "Payer avec Wave"
								: "Payer avec PayPal"
						}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default BuyerForm;
