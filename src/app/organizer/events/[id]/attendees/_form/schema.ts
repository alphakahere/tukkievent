import * as yup from "yup";

const numberFromInput = (_value: unknown, originalValue: unknown) =>
	originalValue === "" || originalValue === null
		? undefined
		: Number(originalValue);

// Native inputs hand us "" for empty fields; map that to undefined so optional
// string rules (email/phone) don't choke on the empty string.
const emptyToUndefined = (value: unknown) =>
	value === "" || value === null ? undefined : value;

export const addAttendeeFormSchema = yup.object({
	ticketTypeId: yup.string().required("Sélectionnez un type de billet"),
	quantity: yup
		.number()
		.transform(numberFromInput)
		.typeError("Valeur invalide")
		.required("Quantité requise")
		.min(1, "Au moins 1")
		.max(50, "Au plus 50")
		.default(1),
	firstName: yup
		.string()
		.trim()
		.required("Le prénom est requis")
		.max(100, "Au plus 100 caractères"),
	lastName: yup
		.string()
		.trim()
		.required("Le nom est requis")
		.max(100, "Au plus 100 caractères"),
	email: yup
		.string()
		.transform(emptyToUndefined)
		.email("Email invalide")
		.when("sendEmail", {
			is: true,
			then: (s) => s.required("L'email est requis pour envoyer le billet"),
			otherwise: (s) => s.optional(),
		}),
	phone: yup
		.string()
		.transform(emptyToUndefined)
		.matches(/^\+?[0-9 ()-]{7,30}$/, "Téléphone invalide")
		.optional(),
	sendEmail: yup.boolean().default(false),
});

export type AddAttendeeFormValues = yup.InferType<typeof addAttendeeFormSchema>;
