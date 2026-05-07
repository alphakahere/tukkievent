"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "motion/react";
import { Check, ShieldCheck, Mail } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { useGetMeQuery, useUpdateMeMutation } from "@/store/api/users/users.api";
import { getApiErrorMessage } from "@/store/api/auth/error";

const phoneRegex = /^\+?[0-9 \-()]{6,20}$/;
const urlRegex = /^https?:\/\/.+/;

const schema = yup.object({
	firstname: yup.string().required("Le prénom est requis").max(100, "Au plus 100 caractères"),
	lastname: yup.string().required("Le nom est requis").max(100, "Au plus 100 caractères"),
	username: yup
		.string()
		.default("")
		.test(
			"username-length",
			"3 à 50 caractères",
			(value) => !value || (value.length >= 3 && value.length <= 50),
		),
	phone: yup
		.string()
		.default("")
		.test("phone-format", "Numéro invalide", (value) => !value || phoneRegex.test(value)),
	avatarUrl: yup
		.string()
		.default("")
		.test("url-format", "URL invalide", (value) => !value || urlRegex.test(value)),
});

type FormData = yup.InferType<typeof schema>;

const STATUS_LABEL: Record<string, { label: string; class: string }> = {
	ACTIVE: { label: "Actif", class: "bg-emerald-50 text-emerald-600" },
	INACTIVE: { label: "Inactif", class: "bg-gray-100 text-gray-500" },
	SUSPENDED: { label: "Suspendu", class: "bg-amber-50 text-amber-600" },
};

export default function AdminProfilePage() {
	const { data: me, isLoading } = useGetMeQuery();
	const [updateMe, { isLoading: isSaving }] = useUpdateMeMutation();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<FormData>({
		resolver: yupResolver(schema),
		defaultValues: { firstname: "", lastname: "" },
	});

	useEffect(() => {
		if (me) {
			reset({
				firstname: me.firstname,
				lastname: me.lastname,
				username: me.username ?? "",
				phone: me.phone ?? "",
				avatarUrl: me.avatarUrl ?? "",
			});
		}
	}, [me, reset]);

	const onSubmit = async (data: FormData) => {
		try {
			await updateMe({
				firstname: data.firstname,
				lastname: data.lastname,
				username: data.username || undefined,
				phone: data.phone || undefined,
				avatarUrl: data.avatarUrl || undefined,
			}).unwrap();
			toast.success("Profil mis à jour");
		} catch (err) {
			toast.error(getApiErrorMessage(err, "Impossible de mettre à jour le profil"));
		}
	};

	if (isLoading || !me) {
		return (
			<div className="p-4 lg:p-6">
				<p className="text-sm text-gray-500">Chargement…</p>
			</div>
		);
	}

	const status = STATUS_LABEL[me.status] ?? { label: me.status, class: "bg-gray-100 text-gray-500" };
	const initials = `${me.firstname[0] ?? ""}${me.lastname[0] ?? ""}`.toUpperCase() || "?";

	return (
		<div className="p-4 lg:p-6 space-y-4 max-w-3xl">
			<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
				<p className="text-2xl font-bold text-gray-900">Mon profil</p>
				<p className="text-sm text-gray-500 mt-0.5">Gérez vos informations personnelles.</p>
			</motion.div>

			{/* Identity card */}
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.05 }}
				className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4"
			>
				<div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden">
					{me.avatarUrl ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={me.avatarUrl} alt="" className="w-full h-full object-cover" />
					) : (
						initials
					)}
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-base font-semibold text-gray-900 truncate">
						{me.firstname} {me.lastname}
					</p>
					<p className="text-xs text-gray-500 flex items-center gap-1.5 truncate">
						<Mail size={12} /> {me.email}
					</p>
					<div className="flex items-center gap-2 mt-2 flex-wrap">
						{me.roles.map((r) => (
							<span
								key={r}
								className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-rose-600 inline-flex items-center gap-1"
							>
								<ShieldCheck size={11} /> {r}
							</span>
						))}
						<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.class}`}>
							{status.label}
						</span>
						<span className="text-[10px] text-gray-400">
							Membre depuis {format(new Date(me.createdAt), "MMMM yyyy", { locale: fr })}
						</span>
					</div>
				</div>
			</motion.div>

			{/* Editable form */}
			<motion.form
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				onSubmit={handleSubmit(onSubmit)}
				className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5"
				noValidate
			>
				<p className="text-base font-semibold text-gray-900">Informations personnelles</p>

				<div className="grid sm:grid-cols-2 gap-4">
					<InputField
						{...register("firstname")}
						id="firstname"
						label="Prénom"
						required
						placeholder="Votre prénom"
						error={errors.firstname?.message}
					/>
					<InputField
						{...register("lastname")}
						id="lastname"
						label="Nom"
						required
						placeholder="Votre nom"
						error={errors.lastname?.message}
					/>
				</div>

				<InputField
					{...register("username")}
					id="username"
					label="Nom d'utilisateur"
					placeholder="ex. admin"
					error={errors.username?.message}
					helperText="3 à 50 caractères. Optionnel."
				/>

				<InputField
					{...register("phone")}
					id="phone"
					label="Téléphone"
					type="tel"
					placeholder="+221 77 000 00 00"
					error={errors.phone?.message}
				/>

				<InputField
					{...register("avatarUrl")}
					id="avatarUrl"
					label="URL de l'avatar"
					type="url"
					placeholder="https://…"
					error={errors.avatarUrl?.message}
				/>

				<div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
					<Button
						type="button"
						variant="outline"
						disabled={!isDirty || isSaving}
						onClick={() =>
							reset({
								firstname: me.firstname,
								lastname: me.lastname,
								username: me.username ?? "",
								phone: me.phone ?? "",
								avatarUrl: me.avatarUrl ?? "",
							})
						}
					>
						Annuler
					</Button>
					<Button type="submit" disabled={!isDirty || isSaving}>
						{isSaving ? (
							<span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
						) : (
							<Check size={15} />
						)}
						{isSaving ? "Enregistrement…" : "Enregistrer"}
					</Button>
				</div>
			</motion.form>

			{/* Read-only account info */}
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.15 }}
				className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3"
			>
				<p className="text-base font-semibold text-gray-900">Informations du compte</p>
				<dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
					<div>
						<dt className="text-xs text-gray-500">Email</dt>
						<dd className="text-gray-900 font-medium truncate">{me.email}</dd>
					</div>
					<div>
						<dt className="text-xs text-gray-500">Email vérifié</dt>
						<dd className="text-gray-900 font-medium">{me.emailVerified ? "Oui" : "Non"}</dd>
					</div>
					<div>
						<dt className="text-xs text-gray-500">Téléphone vérifié</dt>
						<dd className="text-gray-900 font-medium">{me.phoneVerified ? "Oui" : "Non"}</dd>
					</div>
					<div>
						<dt className="text-xs text-gray-500">Identifiant</dt>
						<dd className="text-gray-900 font-mono text-xs truncate">{me.id}</dd>
					</div>
				</dl>
			</motion.div>
		</div>
	);
}
