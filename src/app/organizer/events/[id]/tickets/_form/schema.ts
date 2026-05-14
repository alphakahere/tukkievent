import * as yup from "yup";

const numberFromInput = (_value: unknown, originalValue: unknown) =>
	originalValue === "" || originalValue === null
		? undefined
		: Number(originalValue);

const optionalDate = yup.string().trim().default("");

export const ticketTypeFormSchema = yup.object({
	name: yup
		.string()
		.trim()
		.required("Nom requis")
		.max(100, "Au plus 100 caractères"),
	description: yup
		.string()
		.trim()
		.default("")
		.max(300, "Au plus 300 caractères"),
	price: yup
		.number()
		.transform(numberFromInput)
		.typeError("Prix invalide")
		.required("Prix requis")
		.min(0, "Le prix doit être positif"),
	totalQuantity: yup
		.number()
		.transform(numberFromInput)
		.typeError("Quantité invalide")
		.required("Quantité requise")
		.min(0, "Doit être positif"),
	minPurchase: yup
		.number()
		.transform(numberFromInput)
		.typeError("Valeur invalide")
		.required("Minimum requis")
		.min(1, "Au moins 1"),
	maxPurchase: yup
		.number()
		.transform(numberFromInput)
		.typeError("Valeur invalide")
		.required("Maximum requis")
		.min(1, "Au moins 1")
		.max(100, "Au plus 100")
		.test(
			"gte-min",
			"Doit être ≥ minimum",
			(val, ctx) => val === undefined || val >= (ctx.parent.minPurchase ?? 1),
		),
	saleStartDate: optionalDate,
	saleEndDate: optionalDate,
	isVisible: yup.boolean().default(true),
});

export type TicketTypeFormValues = yup.InferType<typeof ticketTypeFormSchema>;
