import * as yup from "yup";

/**
 * Coerce blank strings coming from native number inputs into `undefined` so
 * yup's number validators surface a proper "requis" error instead of NaN.
 */
const numberFromInput = (_value: unknown, originalValue: unknown) =>
	originalValue === "" || originalValue === null
		? undefined
		: Number(originalValue);

export const ticketSchema = yup.object({
	name: yup
		.string()
		.trim()
		.required("Nom requis")
		.max(80, "Au plus 80 caractères"),
	price: yup
		.number()
		.transform(numberFromInput)
		.typeError("Prix invalide")
		.required("Prix requis")
		.min(0, "Le prix doit être positif"),
	quantity: yup
		.number()
		.transform(numberFromInput)
		.typeError("Quantité invalide")
		.required("Quantité requise")
		.min(1, "Au moins 1 billet"),
});

export const eventFormSchema = yup.object({
	title: yup
		.string()
		.trim()
		.required("Le titre est requis")
		.max(200, "Au plus 200 caractères"),
	description: yup
		.string()
		.trim()
		.default("")
		.max(5000, "Au plus 5000 caractères"),
	categoryId: yup.string().default(""),
	isOnline: yup.boolean().default(false),
	city: yup.string().trim().default(""),
	address: yup.string().trim().default(""),
	onlineLink: yup
		.string()
		.trim()
		.default("")
		.when("isOnline", {
			is: true,
			then: (s) =>
				s
					.required("Le lien de connexion est requis")
					.url("Lien invalide (https://...)"),
			otherwise: (s) => s.notRequired(),
		}),
	capacity: yup
		.number()
		.transform(numberFromInput)
		.typeError("Capacité invalide")
		.required("La capacité est requise")
		.min(0, "Doit être positif"),
	startDate: yup.string().required("Date de début requise"),
	startTime: yup.string().required("Heure de début requise"),
	endDate: yup.string().default(""),
	endTime: yup.string().default(""),
	sameDayEnd: yup.boolean().default(false),
	coverUrl: yup.string().default(""),
	thumbnailUrl: yup.string().default(""),
	tickets: yup.array().of(ticketSchema).default([]),
});

export type EventFormValues = yup.InferType<typeof eventFormSchema>;
export type TicketFormValues = yup.InferType<typeof ticketSchema>;
