"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
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

export const buyerInfoSchema = yup.object({
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

	buyerEmail: yup.string().email("Veuillez entrer un email valide").optional(),

	buyerPhone: yup.string().required("Le numéro de téléphone est requis"),
});

export type BuyerInfoFormData = yup.InferType<typeof buyerInfoSchema>;

interface Props {
	onCreateOrder: () => void;
	isLoading: boolean;
	error: FetchBaseQueryError | SerializedError | undefined;
}

const BuyerForm = (props: Props) => {
	const { onCreateOrder, isLoading, error } = props;
	const dispatch = useAppDispatch();
	const [buyerPhone, setBuyerPhone] = useState("");

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isValid },
	} = useForm<BuyerInfoFormData>({
		// @ts-ignore
		resolver: yupResolver(buyerInfoSchema),
		mode: "onChange",
	});

	const onSubmit = async (data: BuyerInfoFormData) => {
		dispatch(updateBuyerInfo(data));
		await onCreateOrder();
	};

	const handlePhoneChange = (value: string) => {
		setBuyerPhone(value);
		setValue("buyerPhone", value);
	};

	useEffect(() => {
		console.log(errors);
		console.log({ isValid });
	}, []);

	return (
		<div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
			{error && (
				<div className="mb-4">
					<p className="text-red-500 text-sm">
						Une erreur est survenue lors de la création de la commande
					</p>
				</div>
			)}
			<h3 className="text-base sm:text-lg font-semibold text-gray-900">
				Informations de contact
			</h3>
			<p className="text-sm text-gray-500 mb-4 sm:mb-5">
				Entrez vos informations de contact et votre numero de téléphone Wave pour
				finaliser l'achat.
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
					label="Email"
					type="email"
					error={errors.buyerEmail?.message}
					placeholder="exemple@email.com"
				/>
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
						inputStyle={{ width: "100%" }}
						masks={{ sn: ".. ... .. .." }}
					/>
				</div>
				<div>
					<Button
						type="submit"
						className="w-full py-3 sm:py-4 text-sm sm:text-base"
						disabled={!isValid || isLoading}
					>
						{isLoading ? "En cours de paiement..." : "Payer avec Wave"}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default BuyerForm;
