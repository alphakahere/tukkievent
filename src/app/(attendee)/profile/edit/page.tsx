"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "motion/react";
import { ArrowLeft, Camera, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { FormInput } from "@/components/ui/form-input";
import { getApiErrorMessage } from "@/store/api/auth/error";
import { useAppSelector } from "@/store/features/hooks";
import { selectAuthUser } from "@/store/selectors/auth.selectors";
import { useUpdateMeMutation } from "@/store/api/users/users.api";
import {
	type ProfileEditValues,
	profileEditSchema,
} from "./_form/schema";

export default function EditProfilePage() {
	const router = useRouter();
	const user = useAppSelector(selectAuthUser);
	const [updateMe, { isLoading: saving }] = useUpdateMeMutation();

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<ProfileEditValues>({
		resolver: yupResolver(profileEditSchema),
		mode: "onTouched",
		defaultValues: {
			firstname: "",
			lastname: "",
			username: "",
			phone: "",
		},
	});

	useEffect(() => {
		if (!user) return;
		reset({
			firstname: user.firstname ?? "",
			lastname: user.lastname ?? "",
			username: user.username ?? "",
			phone: user.phone ?? "",
		});
	}, [user, reset]);

	const watchedFirst = watch("firstname");
	const watchedLast = watch("lastname");
	const initials =
		`${watchedFirst?.[0] ?? user?.firstname?.[0] ?? ""}${watchedLast?.[0] ?? user?.lastname?.[0] ?? ""}`.toUpperCase() ||
		(user?.email?.[0]?.toUpperCase() ?? "?");

	const onValid = async (data: ProfileEditValues) => {
		try {
			await updateMe({
				firstname: data.firstname,
				lastname: data.lastname,
				...(data.username ? { username: data.username } : {}),
				...(data.phone ? { phone: data.phone } : {}),
			}).unwrap();
			toast.success("Profil mis à jour !");
			router.back();
		} catch (err) {
			toast.error(getApiErrorMessage(err));
		}
	};

	const onInvalid = () => {
		toast.error("Veuillez corriger les champs en erreur");
	};

	return (
		<div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
			<header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-40">
				<div className="max-w-lg mx-auto flex items-center justify-between">
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => router.back()}
							className="p-2 rounded-full hover:bg-gray-100 transition-colors"
						>
							<ArrowLeft size={20} className="text-gray-700" />
						</button>
						<h1 className="text-xl font-bold text-gray-900">Modifier le profil</h1>
					</div>
					<button
						type="submit"
						form="edit-profile-form"
						disabled={saving || isSubmitting}
						className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
					>
						{saving ? (
							<Loader2 size={15} className="animate-spin" />
						) : (
							<Check size={15} />
						)}
						Enregistrer
					</button>
				</div>
			</header>

			<form
				id="edit-profile-form"
				noValidate
				onSubmit={handleSubmit(onValid, onInvalid)}
			>
				<div className="max-w-lg mx-auto px-4 py-6 space-y-4">
					{/* Avatar */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col items-center py-6"
					>
						<div className="relative">
							<div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
								{user?.avatarUrl ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={user.avatarUrl}
										alt={initials}
										className="w-full h-full object-cover"
									/>
								) : (
									initials
								)}
							</div>
							<button
								type="button"
								className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
								onClick={() => toast.info("Fonctionnalité bientôt disponible")}
							>
								<Camera size={14} className="text-gray-600" />
							</button>
						</div>
						<p className="text-xs text-gray-400 mt-3">Appuyez pour changer la photo</p>
					</motion.div>

					{/* Personal info */}
					<motion.section
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.05 }}
						className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
					>
						<div className="px-5 py-4 border-b border-gray-100">
							<p className="text-base font-semibold text-gray-900">
								Informations personnelles
							</p>
						</div>
						<div className="p-5 space-y-4">
							<div className="grid grid-cols-2 gap-3">
								<FormInput
									id="firstname"
									label="Prénom"
									required
									placeholder="Prénom"
									error={errors.firstname?.message}
									{...register("firstname")}
								/>
								<FormInput
									id="lastname"
									label="Nom"
									required
									placeholder="Nom"
									error={errors.lastname?.message}
									{...register("lastname")}
								/>
							</div>

							<FormInput
								id="username"
								label="Nom d'utilisateur"
								placeholder="exemple"
								helperText="3 à 50 caractères. Optionnel."
								error={errors.username?.message}
								{...register("username")}
							/>
						</div>
					</motion.section>

					{/* Contact */}
					<motion.section
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
					>
						<div className="px-5 py-4 border-b border-gray-100">
							<p className="text-base font-semibold text-gray-900">Contact</p>
						</div>
						<div className="p-5 space-y-4">
							<FormInput
								id="email"
								label="Adresse e-mail"
								type="email"
								value={user?.email ?? ""}
								disabled
								readOnly
								helperText="L'adresse e-mail ne peut pas être modifiée."
							/>

							<FormInput
								id="phone"
								label="Numéro de téléphone"
								type="tel"
								placeholder="+221 77 000 00 00"
								error={errors.phone?.message}
								{...register("phone")}
							/>
						</div>
					</motion.section>

					{/* Danger zone */}
					<motion.section
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.15 }}
						className="bg-white rounded-2xl border border-red-100 overflow-hidden"
					>
						<div className="px-5 py-4 border-b border-red-100">
							<p className="text-base font-semibold text-gray-900">Zone de danger</p>
						</div>
						<div className="p-5">
							<button
								type="button"
								onClick={() => toast.error("Fonctionnalité bientôt disponible")}
								className="w-full py-3 px-4 rounded-full border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
							>
								Supprimer mon compte
							</button>
						</div>
					</motion.section>
				</div>
			</form>

			<BottomNav />
		</div>
	);
}
