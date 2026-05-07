"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "motion/react";
import { Briefcase, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/features/hooks";
import { selectAuthUser } from "@/store/selectors/auth.selectors";
import {
	useCreateOrganizationMutation,
	useListMyOrganizationsQuery,
} from "@/store/api/organizations/organizations.api";
import { useLazyGetMeQuery } from "@/store/api/users/users.api";
import { getApiErrorMessage } from "@/store/api/auth/error";

const schema = yup.object({
	name: yup
		.string()
		.required("Le nom est requis")
		.min(1, "Trop court")
		.max(150, "Au plus 150 caractères"),
	description: yup
		.string()
		.default("")
		.max(2000, "Au plus 2000 caractères"),
	primaryEventType: yup
		.string()
		.default("")
		.max(50, "Au plus 50 caractères"),
});

type FormData = yup.InferType<typeof schema>;

const BENEFITS = [
	"Publiez vos événements en quelques clics",
	"Gérez vos billets, ventes et statistiques en un seul endroit",
	"Touchez une communauté de passionnés en Afrique de l'Ouest",
];

export default function BecomeOrganizerPage() {
	const router = useRouter();
	const user = useAppSelector(selectAuthUser);

	const { data: myOrgs, isLoading: orgsLoading } = useListMyOrganizationsQuery();
	const [createOrganization, { isLoading: isCreating }] = useCreateOrganizationMutation();
	const [refetchMe] = useLazyGetMeQuery();

	const isAlreadyOrganizer =
		Boolean(user?.roles.includes("ORGANIZER")) || (myOrgs && myOrgs.length > 0);

	useEffect(() => {
		if (!orgsLoading && isAlreadyOrganizer) {
			router.replace("/organizer/events/new");
		}
	}, [orgsLoading, isAlreadyOrganizer, router]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: yupResolver(schema),
		defaultValues: { name: "", description: "", primaryEventType: "" },
	});

	const onSubmit = async (data: FormData) => {
		try {
			await createOrganization({
				name: data.name,
				description: data.description || undefined,
				primaryEventType: data.primaryEventType || undefined,
			}).unwrap();
			// Refresh the auth user so the freshly granted ORGANIZER role lands in the slice
			// before navigating into the role-guarded /organizer/* tree.
			await refetchMe().unwrap().catch(() => undefined);
			toast.success("Bienvenue parmi les organisateurs !");
			router.replace("/organizer/events/new");
		} catch (err) {
			toast.error(getApiErrorMessage(err, "Impossible de créer l'organisation"));
		}
	};

	if (orgsLoading || isAlreadyOrganizer) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
				<p className="text-sm text-gray-500">Chargement…</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F7F7F7] py-12 px-4">
			<div className="max-w-2xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8"
				>
					<div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white mb-4">
						<Briefcase size={26} />
					</div>
					<h1 className="text-3xl font-bold text-gray-900">Devenez organisateur</h1>
					<p className="text-sm text-gray-500 mt-2">
						Créez votre organisation pour publier votre premier événement.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.05 }}
					className="bg-white rounded-2xl border border-gray-100 p-5 mb-4"
				>
					<p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
						<Sparkles size={15} className="text-primary" />
						Pourquoi rejoindre TukkiEvent ?
					</p>
					<ul className="space-y-2">
						{BENEFITS.map((b) => (
							<li key={b} className="flex items-start gap-2 text-sm text-gray-600">
								<ArrowRight size={14} className="text-primary mt-0.5 shrink-0" />
								{b}
							</li>
						))}
					</ul>
				</motion.div>

				<motion.form
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					onSubmit={handleSubmit(onSubmit)}
					className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5"
					noValidate
				>
					<p className="text-base font-semibold text-gray-900">Votre organisation</p>

					<InputField
						{...register("name")}
						id="org-name"
						label="Nom de l'organisation"
						required
						placeholder="ex. Tukki Productions"
						error={errors.name?.message}
						helperText="Le slug sera généré automatiquement."
					/>

					<InputField
						{...register("primaryEventType")}
						id="org-event-type"
						label="Type d'événements principal"
						placeholder="ex. concerts, conférences, festivals…"
						error={errors.primaryEventType?.message}
					/>

					<div className="space-y-2">
						<label htmlFor="org-description" className="text-sm font-medium">
							Description
						</label>
						<textarea
							id="org-description"
							{...register("description")}
							rows={4}
							placeholder="Présentez votre organisation en quelques phrases…"
							className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
						/>
						{errors.description?.message && (
							<p className="text-sm text-red-500" role="alert">
								{errors.description.message}
							</p>
						)}
					</div>

					<div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.back()}
							disabled={isCreating}
						>
							Annuler
						</Button>
						<Button type="submit" disabled={isCreating}>
							{isCreating ? (
								<span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
							) : (
								<Briefcase size={15} />
							)}
							{isCreating ? "Création…" : "Créer mon organisation"}
						</Button>
					</div>
				</motion.form>
			</div>
		</div>
	);
}
