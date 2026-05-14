"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
	Check,
	Copy,
	EyeOff,
	Loader2,
	Pencil,
	Trash2,
	UserPlus,
	Users,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useOrganizerOrg } from "@/contexts/OrganizerOrgContext";
import { getApiErrorMessage } from "@/store/api/auth/error";
import {
	useCreateEventMutation,
	useDeleteEventMutation,
	useUpdateEventMutation,
} from "@/store/api/event/event.api";
import type {
	CreateEventPayload,
	EventStatus,
} from "@/store/api/event/event.resource.type";
import { useEvent } from "../layout";

const STATUS_META: Record<
	EventStatus,
	{ label: string; tone: "draft" | "ok" | "danger" | "neutral" | "warn" }
> = {
	DRAFT: { label: "Brouillon", tone: "draft" },
	PUBLISHED: { label: "Publié", tone: "ok" },
	CANCELLED: { label: "Annulé", tone: "danger" },
	COMPLETED: { label: "Terminé", tone: "neutral" },
	REJECTED: { label: "Rejeté", tone: "danger" },
	SUSPENDED: { label: "Suspendu", tone: "warn" },
};

const STATUS_TONE_CLASS: Record<
	"draft" | "ok" | "danger" | "neutral" | "warn",
	string
> = {
	draft: "bg-gray-100 text-gray-700",
	ok: "bg-green-100 text-green-700",
	danger: "bg-red-100 text-red-700",
	neutral: "bg-blue-100 text-blue-700",
	warn: "bg-orange-100 text-orange-700",
};

export default function SettingsPage() {
	const event = useEvent();
	const router = useRouter();
	const { activeOrg, activeOrgId } = useOrganizerOrg();
	const [updateEvent] = useUpdateEventMutation();
	const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
	const [createEvent, { isLoading: isDuplicating }] = useCreateEventMutation();

	const [statusActionLoading, setStatusActionLoading] = useState<
		"publish" | "unpublish" | "cancel" | "reactivate" | null
	>(null);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [confirmCancel, setConfirmCancel] = useState(false);

	async function changeStatus(
		next: EventStatus,
		action: "publish" | "unpublish" | "cancel" | "reactivate",
		successMsg: string,
	) {
		setStatusActionLoading(action);
		try {
			await updateEvent({ id: event.id, patch: { status: next } }).unwrap();
			toast.success(successMsg);
			if (action === "cancel") setConfirmCancel(false);
		} catch (err) {
			toast.error(getApiErrorMessage(err));
		} finally {
			setStatusActionLoading(null);
		}
	}

	async function handleDelete() {
		try {
			await deleteEvent(event.id).unwrap();
			toast.success("Événement supprimé");
			setConfirmDelete(false);
			router.push("/organizer/events");
		} catch (err) {
			toast.error(
				getApiErrorMessage(err, "Impossible de supprimer l'événement"),
			);
		}
	}

	async function handleDuplicate() {
		if (!activeOrgId) {
			toast.error("Aucune organisation active");
			return;
		}
		const payload: CreateEventPayload = {
			organizationId: activeOrgId,
			title: `Copie de ${event.title}`,
			capacity: event.capacity,
			startDatetime: event.startDatetime,
			status: "DRAFT",
		};
		if (event.categoryId) payload.categoryId = event.categoryId;
		if (event.description) payload.description = event.description;
		if (event.shortDescription)
			payload.shortDescription = event.shortDescription;
		if (event.endDatetime) payload.endDatetime = event.endDatetime;
		if (event.isOnline) {
			payload.isOnline = true;
			if (event.onlineLink) payload.onlineLink = event.onlineLink;
		} else {
			if (event.city) payload.city = event.city;
			if (event.address) payload.address = event.address;
		}
		if (event.coverImageUrl) payload.coverImageUrl = event.coverImageUrl;
		if (event.thumbnailUrl) payload.thumbnailUrl = event.thumbnailUrl;
		if (event.minAge) payload.minAge = event.minAge;
		if (event.metaTitle) payload.metaTitle = event.metaTitle;
		if (event.metaDescription)
			payload.metaDescription = event.metaDescription;
		try {
			const created = await createEvent(payload).unwrap();
			toast.success("Événement dupliqué en brouillon");
			router.push(`/organizer/events/${created.id}/settings`);
		} catch (err) {
			toast.error(getApiErrorMessage(err, "Échec de la duplication"));
		}
	}

	const statusMeta = STATUS_META[event.status];
	const canPublish = event.status === "DRAFT";
	const canUnpublish = event.status === "PUBLISHED";
	const canCancel = event.status === "DRAFT" || event.status === "PUBLISHED";
	const canReactivate = event.status === "CANCELLED";

	const editHref = `/organizer/events/${event.id}/edit`;

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-6"
		>
			{/* Edit shortcut */}
			<section className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h2 className="text-base font-semibold text-gray-900">
						Détails de l&apos;événement
					</h2>
					<p className="text-xs text-gray-500 mt-0.5">
						Titre, description, dates, lieu, médias, référencement…
					</p>
				</div>
				<Link
					href={editHref}
					className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
				>
					<Pencil size={14} />
					Éditer
				</Link>
			</section>

			{/* Status & visibility */}
			<section className="bg-white rounded-2xl border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
					<div>
						<h2 className="text-base font-semibold text-gray-900">
							Statut &amp; visibilité
						</h2>
						<p className="text-xs text-gray-500 mt-0.5">
							Contrôlez la mise en ligne de votre événement.
						</p>
					</div>
					<span
						className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_TONE_CLASS[statusMeta.tone]}`}
					>
						<span className="w-1.5 h-1.5 rounded-full bg-current" />
						{statusMeta.label}
					</span>
				</div>
				<div className="p-6 flex items-center justify-between gap-4 flex-wrap">
					<div className="text-xs text-gray-500 space-y-0.5">
						<p>
							Créé le{" "}
							<span className="text-gray-700 font-medium">
								{new Date(event.createdAt).toLocaleDateString("fr-FR", {
									day: "2-digit",
									month: "long",
									year: "numeric",
								})}
							</span>
						</p>
						<p>
							Dernière mise à jour le{" "}
							<span className="text-gray-700 font-medium">
								{new Date(event.updatedAt).toLocaleDateString("fr-FR", {
									day: "2-digit",
									month: "long",
									year: "numeric",
								})}
							</span>
						</p>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						{canPublish && (
							<button
								type="button"
								onClick={() =>
									changeStatus("PUBLISHED", "publish", "Événement publié")
								}
								disabled={statusActionLoading !== null}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
							>
								{statusActionLoading === "publish" ? (
									<Loader2 size={14} className="animate-spin" />
								) : (
									<Check size={14} />
								)}
								Publier
							</button>
						)}
						{canUnpublish && (
							<button
								type="button"
								onClick={() =>
									changeStatus(
										"DRAFT",
										"unpublish",
										"Événement remis en brouillon",
									)
								}
								disabled={statusActionLoading !== null}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50"
							>
								{statusActionLoading === "unpublish" ? (
									<Loader2 size={14} className="animate-spin" />
								) : (
									<EyeOff size={14} />
								)}
								Dépublier
							</button>
						)}
						{canReactivate && (
							<button
								type="button"
								onClick={() =>
									changeStatus(
										"DRAFT",
										"reactivate",
										"Événement réactivé en brouillon",
									)
								}
								disabled={statusActionLoading !== null}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50"
							>
								{statusActionLoading === "reactivate" ? (
									<Loader2 size={14} className="animate-spin" />
								) : (
									<Check size={14} />
								)}
								Réactiver
							</button>
						)}
						{canCancel && (
							<button
								type="button"
								onClick={() => setConfirmCancel(true)}
								disabled={statusActionLoading !== null}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-white text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
							>
								<XCircle size={14} />
								Annuler l&apos;événement
							</button>
						)}
					</div>
				</div>
			</section>

			{/* Team / admins */}
			<section className="bg-white rounded-2xl border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
					<div>
						<h2 className="text-base font-semibold text-gray-900">Équipe</h2>
						<p className="text-xs text-gray-500 mt-0.5">
							Les personnes qui peuvent gérer cet événement.
						</p>
					</div>
					<button
						type="button"
						onClick={() =>
							toast.info("Invitations d'équipe bientôt disponibles")
						}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
					>
						<UserPlus size={14} />
						Inviter
					</button>
				</div>
				<div className="p-6 space-y-3">
					<div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
						<div className="flex items-center gap-3 min-w-0">
							<div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
								<Users size={16} />
							</div>
							<div className="min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate">
									{activeOrg?.name ?? "Organisation propriétaire"}
								</p>
								<p className="text-xs text-gray-500">Propriétaire</p>
							</div>
						</div>
						<span className="text-xs font-medium text-gray-400">
							Accès total
						</span>
					</div>
					<p className="text-xs text-gray-400">
						Inviter des co-organisateurs sera bientôt possible — chacun pourra
						gérer les billets, les participants et les paramètres.
					</p>
				</div>
			</section>

			{/* Danger zone */}
			<section className="bg-white rounded-2xl border border-red-200">
				<div className="px-6 py-4 border-b border-red-100">
					<h2 className="text-base font-semibold text-red-700">
						Zone de danger
					</h2>
					<p className="text-xs text-red-600/80 mt-0.5">
						Les actions ci-dessous peuvent être lourdes de conséquences.
					</p>
				</div>
				<div className="divide-y divide-red-100">
					<div className="p-6 flex items-center justify-between gap-4 flex-wrap">
						<div>
							<p className="text-sm font-medium text-gray-900">
								Dupliquer cet événement
							</p>
							<p className="text-xs text-gray-500 mt-0.5">
								Crée un nouveau brouillon avec les mêmes informations et
								médias.
							</p>
						</div>
						<button
							type="button"
							onClick={handleDuplicate}
							disabled={isDuplicating || !activeOrgId}
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
						>
							{isDuplicating ? (
								<Loader2 size={14} className="animate-spin" />
							) : (
								<Copy size={14} />
							)}
							Dupliquer
						</button>
					</div>
					<div className="p-6 flex items-center justify-between gap-4 flex-wrap">
						<div>
							<p className="text-sm font-medium text-gray-900">
								Supprimer cet événement
							</p>
							<p className="text-xs text-gray-500 mt-0.5">
								Toutes les données associées seront définitivement perdues.
							</p>
						</div>
						<button
							type="button"
							onClick={() => setConfirmDelete(true)}
							disabled={isDeleting}
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
						>
							{isDeleting ? (
								<Loader2 size={14} className="animate-spin" />
							) : (
								<Trash2 size={14} />
							)}
							Supprimer
						</button>
					</div>
				</div>
			</section>

			<ConfirmDialog
				open={confirmCancel}
				onOpenChange={setConfirmCancel}
				title="Annuler cet événement ?"
				description={
					<>
						Les participants ayant un billet en seront informés.{" "}
						<strong>{event.title}</strong> ne sera plus visible publiquement.
					</>
				}
				confirmLabel="Annuler l'événement"
				cancelLabel="Revenir"
				destructive
				loading={statusActionLoading === "cancel"}
				onConfirm={() =>
					changeStatus("CANCELLED", "cancel", "Événement annulé")
				}
			/>

			<ConfirmDialog
				open={confirmDelete}
				onOpenChange={setConfirmDelete}
				title="Supprimer cet événement ?"
				description={
					<>
						Cette action est irréversible. <strong>{event.title}</strong> et
						toutes ses données associées seront définitivement supprimés.
					</>
				}
				confirmLabel="Supprimer"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>
		</motion.div>
	);
}
