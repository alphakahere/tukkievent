import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import React from "react";
import { useAppDispatch } from "@/store/features/hooks";
import { updateBuyerInfo, } from "@/store/features/cart.slice";
import { Button } from "@/components/ui/button";
import * as yup from 'yup';

export const buyerInfoSchema = yup.object({
    buyerFirstName: yup
      .string()
      .required('Le prénom est requis')
      .min(2, 'Le prénom doit contenir au moins 2 caractères')
      .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
    
    buyerLastName: yup
      .string()
      .required('Le nom est requis')
      .min(2, 'Le nom doit contenir au moins 2 caractères')
      .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
    
    buyerEmail: yup
      .string()
      .required('L\'email est requis')
      .email('Veuillez entrer un email valide'),
    
    buyerPhone: yup
      .string()
      .required('Le numéro de téléphone est requis')
      // .matches(
      //   /^[1-9](\d{8})$/,
      //   'Veuillez entrer un numéro de téléphone valide'
      // ),
  });

export type BuyerInfoFormData = yup.InferType<typeof buyerInfoSchema>;


const BuyerForm = () => {
    const dispatch = useAppDispatch();

    const {
		register,
		handleSubmit,
		formState: { errors,  isValid},
	} = useForm<BuyerInfoFormData>({
		resolver: yupResolver(buyerInfoSchema),
		mode: "onChange",
	});

    const onSubmit = (data: BuyerInfoFormData) => {
		dispatch(updateBuyerInfo(data));
        console.log(data);
	};

	return (
		<div className="bg-white rounded-xl shadow-sm p-6">
			<h3 className="text-lg font-semibold text-gray-900">Informations de contact</h3>
			<p className="text-sm text-gray-500 mb-5">
				Entrez vos informations de contact et votre numero de téléphone Wave pour
				finaliser l'achat.
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
                <div>
                    <Button type="submit" className="w-full" disabled={!isValid}>Payer maintenant</Button>
                </div>
			</form>
		</div>
	);
};

export default BuyerForm;
