"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
	Building2,
	Crown,
	Loader2,
	Settings as SettingsIcon,
	Trash2,
	UserPlus,
	Users,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { useOrganizerOrg } from "@/contexts/OrganizerOrgContext";
import { getApiErrorMessage } from "@/store/api/auth/error";
import { useListVisitorEventCategoriesQuery } from "@/store/api/event-categories/event-categories.api";
import {
	useDeleteOrganizationMutation,
	useGetOrganizationQuery,
	useListOrganizationMembersQuery,
	useUpdateOrganizationMutation,
} from "@/store/api/organizations/organizations.api";
import type {
	OrganizationMember,
	OrganizationRole,
} from "@/store/api/organizations/organizations.type";
import {
	type OrganizationSettingsValues,
	organizationSettingsSchema,
} from "./_form/schema";

type Tab = "general" | "members";

const ROLE_LABELS: Record<OrganizationRole, string> = {
	OWNER: "Propriétaire",
	ADMIN: "Administrateur",
	EDITOR: "Éditeur",
	VIEWER: "Lecteur",
	STAFF: "Staff",
};

const ROLE_STYLES: Record<OrganizationRole, string> = {
	OWNER: "bg-amber-50 text-amber-700",
	ADMIN: "bg-primary/10 text-primary",
	EDITOR: "bg-emerald-50 text-emerald-700",
	VIEWER: "bg-gray-100 text-gray-600",
	STAFF: "bg-blue-50 text-blue-700",
};

export default function OrganizerSettingsPage() {
	const router = useRouter();
	const { activeOrgId } = useOrganizerOrg();
	const [activeTab, setActiveTab] = useState<Tab>("general");

	const { data: org, isLoading } = useGetOrganizationQuery(
		activeOrgId ?? "",
		{
			skip: !activeOrgId,
		},
	);

	if (isLoading || !org) {
		return (
			<div className="p-6 flex items-center justify-center min-h-[60vh]">
				<Loader2
					size={28}
					className="text-primary animate-spin"
				/>
			</div>
		);
	}

	return (
		<div className="p-5 md:p-8 space-y-6">
			<header>
				<h1 className="text-2xl font-bold text-gray-900">
					Paramètres de l&apos;organisation
				</h1>
				<p className="text-sm text-gray-500 mt-1">{org.name}</p>
			</header>

			<nav className="flex items-center gap-1 p-1 rounded-full bg-gray-100 w-fit">
				<TabButton
					active={activeTab === "general"}
					onClick={() => setActiveTab("general")}
					icon={SettingsIcon}
				>
					Général
				</TabButton>
				<TabButton
					active={activeTab === "members"}
					onClick={() => setActiveTab("members")}
					icon={Users}
				>
					Membres
				</TabButton>
			</nav>

			{activeTab === "general" ? (
				<GeneralTab
					orgId={activeOrgId!}
					org={org}
					router={router}
				/>
			) : (
				<MembersTab
					orgId={activeOrgId!}
					ownerId={org.ownerId}
				/>
			)}
		</div>
	);
}

function TabButton({
	active,
	onClick,
	icon: Icon,
	children,
}: {
	active: boolean;
	onClick: () => void;
	icon: React.ComponentType<{ size?: number; className?: string }>;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
				active
					? "bg-white text-gray-900 shadow-sm"
					: "text-gray-500 hover:text-gray-900"
			}`}
		>
			<Icon size={14} />
			{children}
		</button>
	);
}

function GeneralTab({
	orgId,
	org,
	router,
}: {
	orgId: string;
	org: {
		name: string;
		slug: string;
		description: string | null;
		primaryEventType: string | null;
	};
	router: ReturnType<typeof useRouter>;
}) {
	const [updateOrg, { isLoading: isSaving }] =
		useUpdateOrganizationMutation();
	const [deleteOrg, { isLoading: isDeleting }] =
		useDeleteOrganizationMutation();
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const { data: categories = [], isLoading: categoriesLoading } =
		useListVisitorEventCategoriesQuery();

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<OrganizationSettingsValues>({
		resolver: yupResolver(organizationSettingsSchema),
		mode: "onTouched",
		defaultValues: {
			name: "",
			description: "",
			primaryEventType: "",
		},
	});

	useEffect(() => {
		reset({
			name: org.name,
			description: org.description ?? "",
			primaryEventType: org.primaryEventType ?? "",
		});
	}, [org, reset]);

	const onValid = async (data: OrganizationSettingsValues) => {
		try {
			await updateOrg({
				id: orgId,
				patch: {
					name: data.name,
					description: data.description || undefined,
					primaryEventType:
						data.primaryEventType || undefined,
				},
			}).unwrap();
			toast.success("Paramètres enregistrés !");
		} catch (err) {
			toast.error(getApiErrorMessage(err));
		}
	};

	const onInvalid = () => {
		toast.error("Veuillez corriger les champs en erreur");
	};

	const handleConfirmDelete = async () => {
		try {
			await deleteOrg(orgId).unwrap();
			toast.success("Organisation supprimée");
			setConfirmingDelete(false);
			router.push("/organizer");
		} catch (err) {
			toast.error(getApiErrorMessage(err));
		}
	};

	const categoryOptions = categories.map((c) => ({
		value: c.slug,
		label: c.name,
	}));

	return (
		<>
			<motion.form
				noValidate
				onSubmit={handleSubmit(onValid, onInvalid)}
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5"
			>
				<div className="flex items-center gap-3 mb-2">
					<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
						<Building2
							size={20}
							className="text-primary"
						/>
					</div>
					<div>
						<h2 className="text-base font-semibold text-gray-900">
							Informations générales
						</h2>
						<p className="text-xs text-gray-500">
							Détails publics de votre organisation
						</p>
					</div>
				</div>

				<FormInput
					id="orgName"
					label="Nom de l'organisation"
					required
					placeholder="Tukki Productions"
					error={errors.name?.message}
					{...register("name")}
				/>

				<FormInput
					id="orgSlug"
					label="Slug"
					value={org.slug}
					disabled
					readOnly
					helperText="Le slug ne peut pas être modifié."
				/>

				<FormTextarea
					id="orgDesc"
					label="Description"
					rows={3}
					placeholder="Présentez votre organisation en quelques mots..."
					error={errors.description?.message}
					{...register("description")}
				/>

				<Controller
					control={control}
					name="primaryEventType"
					render={({ field, fieldState }) => (
						<FormSelect
							id="orgEventType"
							label="Type d'événements principal"
							value={field.value}
							onValueChange={field.onChange}
							placeholder={
								categoriesLoading
									? "Chargement..."
									: "Choisir une catégorie"
							}
							disabled={categoriesLoading}
							options={categoryOptions}
							error={fieldState.error?.message}
							helperText="La catégorie qui décrit le mieux vos événements"
						/>
					)}
				/>

				<button
					type="submit"
					disabled={isSaving}
					className="w-full py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
				>
					{isSaving && (
						<Loader2
							size={16}
							className="animate-spin"
						/>
					)}
					Enregistrer les modifications
				</button>
			</motion.form>

			{/* Danger zone */}
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-white rounded-2xl border border-red-100 p-6 mt-6"
			>
				<div className="flex items-center gap-3 mb-5">
					<div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
						<Trash2
							size={20}
							className="text-destructive"
						/>
					</div>
					<div>
						<h2 className="text-base font-semibold text-gray-900">
							Zone dangereuse
						</h2>
						<p className="text-xs text-gray-500">
							Actions irréversibles
						</p>
					</div>
				</div>
				<button
					type="button"
					onClick={() => setConfirmingDelete(true)}
					className="w-full px-4 py-3 text-sm font-semibold text-destructive border border-red-200 rounded-full hover:bg-red-50 transition-colors"
				>
					Supprimer l&apos;organisation
				</button>
				<p className="text-xs text-gray-400 mt-3">
					Cette action supprimera définitivement votre
					organisation et tous ses événements.
				</p>
			</motion.div>

			<ConfirmDialog
				open={confirmingDelete}
				onOpenChange={setConfirmingDelete}
				title="Supprimer cette organisation ?"
				description={
					<>
						L&apos;organisation « <b>{org.name}</b> » et
						tous ses événements seront définitivement
						supprimés. Cette action est irréversible.
					</>
				}
				confirmLabel="Supprimer"
				destructive
				loading={isDeleting}
				onConfirm={handleConfirmDelete}
			/>
		</>
	);
}

function MembersTab({ orgId, ownerId }: { orgId: string; ownerId: string }) {
	void ownerId;
	const {
		data: members,
		isLoading,
		isError,
	} = useListOrganizationMembersQuery(orgId);

	return (
		<motion.section
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white rounded-2xl border border-gray-100"
		>
			<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
						<Users size={20} className="text-primary" />
					</div>
					<div>
						<h2 className="text-base font-semibold text-gray-900">
							Membres de l&apos;organisation
						</h2>
						<p className="text-xs text-gray-500">
							{members
								? `${members.length} membre${members.length > 1 ? "s" : ""}`
								: "—"}
						</p>
					</div>
				</div>
				<button
					type="button"
					onClick={() =>
						toast.info(
							"Invitations bientôt disponibles",
						)
					}
					className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
				>
					<UserPlus size={14} />
					Inviter
				</button>
			</div>

			{isLoading ? (
				<div className="p-12 flex items-center justify-center">
					<Loader2
						size={24}
						className="text-primary animate-spin"
					/>
				</div>
			) : isError ? (
				<div className="p-12 text-center text-sm text-gray-500">
					Impossible de charger les membres.
				</div>
			) : !members || members.length === 0 ? (
				<div className="p-12 text-center text-sm text-gray-500">
					Aucun membre pour le moment.
				</div>
			) : (
				<ul className="divide-y divide-gray-100">
					{members.map((m) => (
						<MemberRow key={m.id} member={m} />
					))}
				</ul>
			)}

			<p className="px-6 py-4 border-t border-gray-100 text-xs text-gray-400">
				Inviter des co-organisateurs sera bientôt possible —
				chacun pourra gérer les événements, les billets et les
				paramètres selon son rôle.
			</p>
		</motion.section>
	);
}

function MemberRow({ member }: { member: OrganizationMember }) {
	const fullName =
		`${member.user.firstname} ${member.user.lastname}`.trim() ||
		member.user.email;
	const initials =
		(member.user.firstname?.[0] ?? "") +
		(member.user.lastname?.[0] ?? "");
	const role = member.isOwner ? "OWNER" : member.role;
	const joined = format(new Date(member.createdAt), "d MMM yyyy", {
		locale: fr,
	});

	return (
		<li className="px-6 py-4 flex items-center gap-4">
			<div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0 uppercase">
				{initials || <Users size={16} />}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 flex-wrap">
					<p className="text-sm font-semibold text-gray-900 truncate">
						{fullName}
					</p>
					{member.isOwner && (
						<Crown
							size={12}
							className="text-amber-500 shrink-0"
						/>
					)}
				</div>
				<p className="text-xs text-gray-500 truncate">
					{member.user.email}
				</p>
			</div>
			<div className="flex flex-col items-end gap-1 shrink-0">
				<span
					className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${ROLE_STYLES[role as OrganizationRole]}`}
				>
					{ROLE_LABELS[role as OrganizationRole]}
				</span>
				<span className="text-[11px] text-gray-400">
					Depuis {joined}
				</span>
			</div>
		</li>
	);
}
