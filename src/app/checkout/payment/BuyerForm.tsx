"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/features/hooks";
import { updateBuyerInfo } from "@/store/features/cart.slice";
import { selectBuyerInfo } from "@/store/selectors/cart.selectors";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Label } from "@/components/ui/label";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import Image from "next/image";
import { ChevronRight, CreditCard } from "lucide-react";
import type { PaymentMethod } from "@/store/api/order/order.type";

const PAYMENT_OPTIONS: {
	id: PaymentMethod;
	label: string;
	sub: string;
	logo?: string;
	icon?: typeof CreditCard;
}[] = [
	{ id: "WAVE", label: "Wave", sub: "Paiement mobile (XOF)", logo: "/images/wave.png" },
	{ id: "ORANGE_MONEY", label: "Orange Money", sub: "Paiement mobile (XOF)", icon: CreditCard },
	{ id: "CARD", label: "Carte bancaire", sub: "Visa, Mastercard", icon: CreditCard },
];

const buildSchema = (method: PaymentMethod) =>
	yup.object({
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
		buyerPhone:
			method === "WAVE" || method === "ORANGE_MONEY" || method === "FREE_MONEY"
				? yup
						.string()
						.required("Le numéro de téléphone est requis")
						.min(10, "Numéro trop court")
				: yup.string().optional(),
	});

export type BuyerInfoFormData = yup.InferType<ReturnType<typeof buildSchema>>;

interface Props {
	onCreateOrder: (paymentMethod: PaymentMethod) => void;
	isLoading: boolean;
	error: FetchBaseQueryError | SerializedError | undefined;
}

export default function BuyerForm({ onCreateOrder, isLoading, error }: Props) {
	const dispatch = useAppDispatch();
	const buyer = useAppSelector(selectBuyerInfo);
	const [buyerPhone, setBuyerPhone] = useState(buyer.buyerPhone ?? "");
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		trigger,
		formState: { errors, isValid },
	} = useForm<BuyerInfoFormData>({
		// @ts-expect-error generic resolver typing mismatch
		resolver: yupResolver(buildSchema(paymentMethod ?? "WAVE")),
		mode: "onChange",
		defaultValues: {
			buyerFirstName: buyer.buyerFirstName ?? "",
			buyerLastName: buyer.buyerLastName ?? "",
			buyerEmail: buyer.buyerEmail ?? "",
			buyerPhone: buyer.buyerPhone ?? "",
		},
	});

	useEffect(() => {
		if (paymentMethod) trigger();
	}, [paymentMethod, trigger]);

	const onSubmit = async (data: BuyerInfoFormData) => {
		if (!paymentMethod) return;
		const cleaned = {
			...data,
			buyerEmail: data.buyerEmail || undefined,
			buyerPhone: data.buyerPhone || undefined,
		};
		dispatch(updateBuyerInfo(cleaned));
		await onCreateOrder(paymentMethod);
	};

	const handlePhoneChange = async (value: string) => {
		setBuyerPhone(value);
		setValue("buyerPhone", value, { shouldValidate: true });
		await trigger("buyerPhone");
	};

	if (!paymentMethod) {
		return (
			<div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
				<h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
					Choisissez votre méthode de paiement
				</h3>
				<div className="space-y-3">
					{PAYMENT_OPTIONS.map((opt) => {
						const Icon = opt.icon;
						return (
							<button
								key={opt.id}
								type="button"
								onClick={() => setPaymentMethod(opt.id)}
								className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-left group"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="relative w-12 h-12 flex-shrink-0 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden">
											{opt.logo ? (
												<Image src={opt.logo} alt={opt.label} fill sizes="48px" className="object-contain" />
											) : Icon ? (
												<Icon className="w-5 h-5 text-orange-500" />
											) : null}
										</div>
										<div>
											<p className="font-semibold text-gray-900">{opt.label}</p>
											<p className="text-sm text-gray-600">{opt.sub}</p>
										</div>
									</div>
									<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
								</div>
							</button>
						);
					})}
				</div>
			</div>
		);
	}

	const isMobileMoney =
		paymentMethod === "WAVE" || paymentMethod === "ORANGE_MONEY" || paymentMethod === "FREE_MONEY";

	return (
		<div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
			{error && (
				<div className="mb-4">
					<p className="text-red-500 text-sm">
						Une erreur est survenue lors de la création de la commande.
					</p>
				</div>
			)}

			<div className="mb-4">
				<button
					type="button"
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
				{isMobileMoney
					? "Entrez vos informations et le numéro mobile money à débiter."
					: "Entrez vos informations. Vous serez redirigé vers la passerelle de paiement."}
			</p>

			{/* @ts-expect-error generic resolver typing mismatch */}
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

				{isMobileMoney && (
					<div className="space-y-2 col-span-2">
						<Label htmlFor="buyerPhone">
							Numéro de téléphone <small className="text-xs text-red-500">*</small>
						</Label>
						<PhoneInput
							placeholder="Entrez votre numéro"
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
							<p className="text-red-500 text-sm mt-1">{errors.buyerPhone.message}</p>
						)}
					</div>
				)}

				{!isMobileMoney && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<p className="text-sm text-gray-700">
							Vous serez redirigé vers la passerelle de paiement pour finaliser de manière sécurisée.
						</p>
					</div>
				)}

				<Button
					type="submit"
					className="w-full py-3 sm:py-4 text-sm sm:text-base"
					disabled={!isValid || isLoading}
				>
					{isLoading ? "Traitement..." : `Payer avec ${paymentMethod.replace("_", " ")}`}
				</Button>
			</form>
		</div>
	);
}
