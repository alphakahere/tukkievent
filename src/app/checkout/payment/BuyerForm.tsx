import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import React from "react";
import { useAppDispatch } from "@/store/features/hooks";
import { updateBuyerInfo, } from "@/store/features/cart.slice";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import * as yup from "yup";

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

	buyerPhone: yup
		.string()
		.required("Le numéro de téléphone est requis")
		.matches(/^[1-9](\d{8})$/, "Veuillez entrer un numéro de téléphone valide"),
});

export type BuyerInfoFormData = yup.InferType<typeof buyerInfoSchema>;

const BuyerForm = ({
	onCreateOrder,
	isLoading,
}: {
	onCreateOrder: () => void;
	isLoading: boolean;
}) => {
	const dispatch = useAppDispatch();

	const {
		register,
		handleSubmit,
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

	return (
		<div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
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
				<InputField
					{...register("buyerPhone")}
					id="buyerPhone"
					label="Téléphone Wave"
					type="tel"
					required
					error={errors.buyerPhone?.message}
					placeholder="77 123 45 67"
					helperText="Votre numéro Wave pour recevoir la demande de paiement"
				/>
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
