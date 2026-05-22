import * as yup from "yup";

export const checkoutFormSchema = yup.object({
	fullName: yup
		.string()
		.trim()
		.required("Le nom complet est requis")
		.min(2, "Au moins 2 caractères")
		.max(120, "Au plus 120 caractères"),
	email: yup
		.string()
		.trim()
		.email("Email invalide")
		.default(""),
	phone: yup
		.string()
		.trim()
		.required("Le numéro de téléphone est requis")
		.matches(
			/^(\+221)?[\s0-9]{9,}$/,
			"Numéro invalide (format: +221 77 123 45 67)",
		),
});

export type CheckoutFormValues = yup.InferType<typeof checkoutFormSchema>;

export function splitName(fullName: string): { first: string; last: string } {
	const trimmed = fullName.trim();
	if (!trimmed) return { first: "", last: "" };
	const parts = trimmed.split(/\s+/);
	if (parts.length === 1) return { first: parts[0], last: parts[0] };
	return { first: parts[0], last: parts.slice(1).join(" ") };
}
