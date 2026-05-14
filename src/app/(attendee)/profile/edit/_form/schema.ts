import * as yup from "yup";

export const profileEditSchema = yup.object({
	firstname: yup
		.string()
		.trim()
		.required("Le prénom est requis")
		.max(100, "Au plus 100 caractères"),
	lastname: yup
		.string()
		.trim()
		.required("Le nom est requis")
		.max(100, "Au plus 100 caractères"),
	username: yup
		.string()
		.trim()
		.default("")
		.test(
			"length-or-empty",
			"Entre 3 et 50 caractères",
			(v) => !v || (v.length >= 3 && v.length <= 50),
		),
	phone: yup
		.string()
		.trim()
		.default("")
		.test(
			"phone-or-empty",
			"Numéro invalide",
			(v) => !v || /^\+?[0-9 \-()]{6,20}$/.test(v),
		),
});

export type ProfileEditValues = yup.InferType<typeof profileEditSchema>;
