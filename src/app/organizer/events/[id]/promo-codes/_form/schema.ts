import * as yup from "yup";

const numberFromInput = (_value: unknown, originalValue: unknown) =>
	originalValue === "" || originalValue === null
		? undefined
		: Number(originalValue);

const optionalNumber = yup
	.number()
	.transform(numberFromInput)
	.typeError("Valeur invalide")
	.min(0, "Doit être positif")
	.optional();

const optionalDate = yup.string().trim().default("");

export const promoCodeFormSchema = yup.object({
	code: yup
		.string()
		.trim()
		.required("Code requis")
		.min(3, "Au moins 3 caractères")
		.max(50, "Au plus 50 caractères")
		.matches(/^[A-Z0-9-]+$/, "Lettres majuscules, chiffres et tirets uniquement"),
	name: yup.string().trim().default("").max(100, "Au plus 100 caractères"),
	description: yup
		.string()
		.trim()
		.default("")
		.max(300, "Au plus 300 caractères"),
	discountType: yup
		.mixed<"PERCENTAGE" | "FIXED_AMOUNT">()
		.oneOf(["PERCENTAGE", "FIXED_AMOUNT"])
		.required(),
	discountValue: yup
		.number()
		.transform(numberFromInput)
		.typeError("Valeur invalide")
		.required("Valeur requise")
		.min(0, "Doit être positif")
		.when("discountType", {
			is: "PERCENTAGE",
			then: (s) =>
				s
					.min(1, "Au moins 1 %")
					.max(100, "Au plus 100 %"),
			otherwise: (s) => s.min(1, "Doit être supérieur à 0"),
		}),
	maxDiscountAmount: optionalNumber,
	usageLimit: yup
		.number()
		.transform(numberFromInput)
		.typeError("Valeur invalide")
		.min(1, "Au moins 1")
		.optional(),
	minOrderAmount: optionalNumber,
	validFrom: optionalDate,
	validUntil: optionalDate,
	isActive: yup.boolean().default(true),
});

export type PromoCodeFormValues = yup.InferType<typeof promoCodeFormSchema>;
