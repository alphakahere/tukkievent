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

export const paymentMethodSchema = yup.object({
  paymentMethod: yup
    .string()
    .required('Veuillez sélectionner une méthode de paiement')
    .oneOf(['card', 'mobile_money', 'bank_transfer'], 'Méthode de paiement invalide'),
});

export type BuyerInfoFormData = yup.InferType<typeof buyerInfoSchema>;
export type PaymentMethodFormData = yup.InferType<typeof paymentMethodSchema>;
