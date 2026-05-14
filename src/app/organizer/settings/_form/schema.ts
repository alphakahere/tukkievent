import * as yup from "yup";

export const organizationSettingsSchema = yup.object({
	name: yup
		.string()
		.trim()
		.required("Le nom est requis")
		.max(150, "Au plus 150 caractères"),
	description: yup
		.string()
		.trim()
		.default("")
		.max(1000, "Au plus 1000 caractères"),
	primaryEventType: yup
		.string()
		.trim()
		.default("")
		.max(50, "Au plus 50 caractères"),
});

export type OrganizationSettingsValues = yup.InferType<
	typeof organizationSettingsSchema
>;
