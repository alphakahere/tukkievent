"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "motion/react";
import {
	Check,
	Copy,
	EyeOff,
	Globe,
	Image as ImageIcon,
	Loader2,
	MapPin,
	Pencil,
	Trash2,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useOrganizerOrg } from "@/contexts/OrganizerOrgContext";
import { assetUrl } from "@/lib/utils";
import { getApiErrorMessage } from "@/store/api/auth/error";
import { useListVisitorEventCategoriesQuery } from "@/store/api/event-categories/event-categories.api";
import {
	useCreateEventMutation,
	useDeleteEventMutation,
	useUpdateEventMutation,
} from "@/store/api/event/event.api";
import type {
	CreateEventPayload,
	EventStatus,
	UpdateEventPayload,
} from "@/store/api/event/event.resource.type";
import { useUploadImageMutation } from "@/store/api/uploads/uploads.api";
import {
	type EventFormValues,
	eventFormSchema,
} from "../../_form/schema";
import { useEvent } from "../layout";

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
	const h = String(Math.floor(i / 2)).padStart(2, "0");
	const m = i % 2 === 0 ? "00" : "30";
	return `${h}:${m}`;
});

function combineDateTime(date: string, time: string): string | null {
	if (!date) return null;
	const t = time || "00:00";
	return new Date(`${date}T${t}:00`).toISOString();
}

function splitIso(iso: string | null): { date: string; time: string } {
	if (!iso) return { date: "", time: "" };
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return { date: "", time: "" };
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	const hh = String(d.getHours()).padStart(2, "0");
	const mi = String(d.getMinutes()).padStart(2, "0");
	return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${mi}` };
}

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
	const { activeOrgId } = useOrganizerOrg();
	const { data: categories = [], isLoading: categoriesLoading } =
		useListVisitorEventCategoriesQuery();
	const [updateEvent, { isLoading: isSaving }] = useUpdateEventMutation();
	const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
	const [createEvent, { isLoading: isDuplicating }] = useCreateEventMutation();
	const [uploadImage] = useUploadImageMutation();

	const [statusActionLoading, setStatusActionLoading] = useState<
		"publish" | "unpublish" | "cancel" | "reactivate" | null
	>(null);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [confirmCancel, setConfirmCancel] = useState(false);

	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [coverPreview, setCoverPreview] = useState<string>(() =>
		event.coverImageUrl ? assetUrl(event.coverImageUrl) : "",
	);
	const [thumbnailPreview, setThumbnailPreview] = useState<string>(() =>
		event.thumbnailUrl ? assetUrl(event.thumbnailUrl) : "",
	);

	const initialDefaults = useMemo<EventFormValues>(() => {
		const start = splitIso(event.startDatetime);
		const end = splitIso(event.endDatetime);
		return {
			title: event.title,
			description: event.description ?? "",
			shortDescription: event.shortDescription ?? "",
			categoryId: event.categoryId ?? "",
			isOnline: event.isOnline,
			city: event.city ?? "",
			address: event.address ?? "",
			onlineLink: event.onlineLink ?? "",
			capacity: event.capacity,
			minAge: event.minAge,
			startDate: start.date,
			startTime: start.time,
			endDate: end.date,
			endTime: end.time,
			sameDayEnd: Boolean(end.date) && end.date === start.date,
			coverUrl: event.coverImageUrl ?? "",
			thumbnailUrl: event.thumbnailUrl ?? "",
			tickets: [],
		};
	}, [event]);

	const {
		register,
		control,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors, isDirty, isSubmitting },
	} = useForm<EventFormValues>({
		resolver: yupResolver(eventFormSchema),
		mode: "onTouched",
		defaultValues: initialDefaults,
	});

	useEffect(() => {
		reset(initialDefaults);
		setCoverFile(null);
		setThumbnailFile(null);
		setCoverPreview(
			event.coverImageUrl ? assetUrl(event.coverImageUrl) : "",
		);
		setThumbnailPreview(
			event.thumbnailUrl ? assetUrl(event.thumbnailUrl) : "",
		);
	}, [event, initialDefaults, reset]);

	// Warn on tab close when there are unsaved edits.
	useEffect(() => {
		const dirty = isDirty || coverFile !== null || thumbnailFile !== null;
		if (!dirty) return;
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	}, [isDirty, coverFile, thumbnailFile]);

	const isOnline = watch("isOnline");
	const sameDayEnd = watch("sameDayEnd");
	const startDate = watch("startDate");
	const startTime = watch("startTime");
	const endTime = watch("endTime");

	// Mirror start date into end date while "same day" is toggled on.
	useEffect(() => {
		if (sameDayEnd) {
			setValue("endDate", startDate, { shouldValidate: true });
		}
	}, [sameDayEnd, startDate, setValue]);

	const timeOptions = useMemo(() => {
		const set = new Set(TIME_OPTIONS);
		if (startTime) set.add(startTime);
		if (endTime) set.add(endTime);
		return Array.from(set)
			.sort()
			.map((t) => ({ value: t, label: t }));
	}, [startTime, endTime]);

	// Cover + thumbnail upload pickers
	const coverInputRef = useRef<HTMLInputElement>(null);
	const thumbnailInputRef = useRef<HTMLInputElement>(null);
	const objectUrlsRef = useRef<Set<string>>(new Set());

	useEffect(() => {
		const urls = objectUrlsRef.current;
		return () => {
			urls.forEach((u) => URL.revokeObjectURL(u));
			urls.clear();
		};
	}, []);

	function revokeIfLocal(url: string) {
		if (objectUrlsRef.current.has(url)) {
			URL.revokeObjectURL(url);
			objectUrlsRef.current.delete(url);
		}
	}

	function handleImageChange(
		e: React.ChangeEvent<HTMLInputElement>,
		field: "coverUrl" | "thumbnailUrl",
	) {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Le fichier doit être une image");
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			toast.error("L'image ne doit pas dépasser 5 Mo");
			return;
		}
		const preview = URL.createObjectURL(file);
		objectUrlsRef.current.add(preview);
		if (field === "coverUrl") {
			revokeIfLocal(coverPreview);
			setCoverFile(file);
			setCoverPreview(preview);
		} else {
			revokeIfLocal(thumbnailPreview);
			setThumbnailFile(file);
			setThumbnailPreview(preview);
		}
		setValue(field, "", { shouldDirty: true });
	}

	function clearImage(field: "coverUrl" | "thumbnailUrl") {
		if (field === "coverUrl") {
			revokeIfLocal(coverPreview);
			setCoverFile(null);
			setCoverPreview("");
		} else {
			revokeIfLocal(thumbnailPreview);
			setThumbnailFile(null);
			setThumbnailPreview("");
		}
		setValue(field, "", { shouldDirty: true });
	}

	const onValid = async (data: EventFormValues) => {
		const startDatetime = combineDateTime(data.startDate, data.startTime);
		if (!startDatetime) {
			toast.error("Date de début invalide");
			return;
		}
		const endDatetime = data.endDate
			? combineDateTime(data.endDate, data.endTime || "23:59")
			: undefined;

		let coverImageUrl = data.coverUrl;
		let thumbnailUrl = data.thumbnailUrl;
		try {
			const [coverRes, thumbRes] = await Promise.all([
				coverFile ? uploadImage(coverFile).unwrap() : Promise.resolve(null),
				thumbnailFile
					? uploadImage(thumbnailFile).unwrap()
					: Promise.resolve(null),
			]);
			if (coverRes) coverImageUrl = coverRes.path;
			if (thumbRes) thumbnailUrl = thumbRes.path;
		} catch (err) {
			toast.error(getApiErrorMessage(err, "Échec de l'envoi des images"));
			return;
		}

		const patch: UpdateEventPayload = {
			title: data.title,
			description: data.description || undefined,
			shortDescription: data.shortDescription || undefined,
			categoryId: data.categoryId || undefined,
			capacity: data.capacity,
			minAge: data.minAge,
			startDatetime,
			endDatetime: endDatetime ?? undefined,
			isOnline: data.isOnline,
			coverImageUrl: coverImageUrl || undefined,
			thumbnailUrl: thumbnailUrl || undefined,
		};
		if (data.isOnline) {
			patch.onlineLink = data.onlineLink || undefined;
			patch.city = undefined;
			patch.address = undefined;
		} else {
			patch.city = data.city || undefined;
			patch.address = data.address || undefined;
			patch.onlineLink = undefined;
		}

		try {
			await updateEvent({ id: event.id, patch }).unwrap();
			toast.success("Modifications enregistrées !");
			setCoverFile(null);
			setThumbnailFile(null);
		} catch (err) {
			toast.error(getApiErrorMessage(err));
		}
	};

	const onInvalid = () => {
		toast.error("Veuillez corriger les champs en erreur");
	};

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
			toast.error(getApiErrorMessage(err, "Impossible de supprimer l'événement"));
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
	const canCancel =
		event.status === "DRAFT" || event.status === "PUBLISHED";
	const canReactivate = event.status === "CANCELLED";

	const formDirty = isDirty || coverFile !== null || thumbnailFile !== null;
	const saveDisabled = isSubmitting || isSaving || !formDirty;

	return (
		<motion.form
			noValidate
			onSubmit={handleSubmit(onValid, onInvalid)}
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-6"
		>
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

			{/* Media */}
			<section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-100">
					<h2 className="text-base font-semibold text-gray-900">Médias</h2>
					<p className="text-xs text-gray-500 mt-0.5">
						Image de couverture et miniature utilisées sur les pages publiques.
					</p>
				</div>
				<input
					ref={coverInputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={(e) => handleImageChange(e, "coverUrl")}
				/>
				<input
					ref={thumbnailInputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={(e) => handleImageChange(e, "thumbnailUrl")}
				/>
				<div className="relative h-56 md:h-64 bg-gradient-to-br from-gray-100 to-gray-50 group">
					{coverPreview ? (
						<>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={coverPreview}
								alt="Couverture"
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
							<div className="absolute top-4 right-4 flex items-center gap-2">
								<button
									type="button"
									onClick={() => coverInputRef.current?.click()}
									className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-xs font-semibold text-gray-800 shadow-sm hover:bg-white transition-colors"
								>
									<Pencil size={12} />
									Modifier
								</button>
								<button
									type="button"
									onClick={() => clearImage("coverUrl")}
									aria-label="Retirer la couverture"
									className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/95 backdrop-blur text-gray-700 shadow-sm hover:bg-white transition-colors"
								>
									<Trash2 size={12} />
								</button>
							</div>
						</>
					) : (
						<button
							type="button"
							onClick={() => coverInputRef.current?.click()}
							className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
						>
							<div className="flex items-center justify-center w-14 h-14 rounded-full bg-white border border-gray-200 shadow-sm">
								<ImageIcon size={24} />
							</div>
							<p className="text-sm font-medium">
								Ajouter une image de couverture
							</p>
							<p className="text-xs text-gray-400">
								JPG ou PNG, max 5 Mo (recommandé 1280×720)
							</p>
						</button>
					)}
				</div>
				<div className="px-5 md:px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3 flex-wrap">
					<div className="flex items-center gap-3 min-w-0">
						{thumbnailPreview ? (
							/* eslint-disable-next-line @next/next/no-img-element */
							<img
								src={thumbnailPreview}
								alt="Miniature"
								className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
							/>
						) : (
							<div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
								<ImageIcon size={18} />
							</div>
						)}
						<div className="min-w-0">
							<p className="text-sm font-medium text-gray-700">
								Miniature (facultatif)
							</p>
							<p className="text-xs text-gray-500">
								Utilisée dans les listes et résultats de recherche.
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						<button
							type="button"
							onClick={() => thumbnailInputRef.current?.click()}
							className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
						>
							<Pencil size={12} />
							{thumbnailPreview ? "Modifier" : "Ajouter"}
						</button>
						{thumbnailPreview && (
							<button
								type="button"
								onClick={() => clearImage("thumbnailUrl")}
								aria-label="Retirer la miniature"
								className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
							>
								<Trash2 size={12} />
							</button>
						)}
					</div>
				</div>
			</section>

			{/* Information */}
			<section className="bg-white rounded-2xl border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-100">
					<h2 className="text-base font-semibold text-gray-900">Informations</h2>
					<p className="text-xs text-gray-500 mt-0.5">
						Le contenu principal de votre événement.
					</p>
				</div>
				<div className="p-6 space-y-5">
					<FormInput
						id="title"
						label="Titre"
						required
						placeholder="Nom de votre événement"
						error={errors.title?.message}
						{...register("title")}
					/>
					<div>
						<label
							htmlFor="categoryId"
							className="text-sm font-medium text-gray-700 block mb-1.5"
						>
							Catégorie
						</label>
						<Controller
							control={control}
							name="categoryId"
							render={({ field }) => (
								<Select
									value={field.value}
									onValueChange={field.onChange}
									disabled={categoriesLoading}
								>
									<SelectTrigger id="categoryId" className="w-full">
										<SelectValue
											placeholder={
												categoriesLoading
													? "Chargement..."
													: "Choisir une catégorie"
											}
										/>
									</SelectTrigger>
									<SelectContent>
										{categories.map((c) => (
											<SelectItem key={c.id} value={c.id}>
												{c.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</div>
					<FormTextarea
						id="shortDescription"
						label="Accroche"
						helperText="Une phrase courte affichée sur les cartes et résultats."
						rows={2}
						placeholder="Un résumé en une ou deux phrases."
						error={errors.shortDescription?.message}
						{...register("shortDescription")}
					/>
					<FormTextarea
						id="description"
						label="Description"
						placeholder="Décrivez le programme, les intervenants, l'ambiance..."
						error={errors.description?.message}
						{...register("description")}
					/>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<FormInput
							id="capacity"
							label="Capacité totale"
							required
							type="number"
							min={0}
							error={errors.capacity?.message}
							{...register("capacity")}
						/>
						<FormInput
							id="minAge"
							label="Âge minimum"
							helperText="0 si l'événement est ouvert à tous."
							type="number"
							min={0}
							error={errors.minAge?.message}
							{...register("minAge")}
						/>
					</div>
				</div>
			</section>

			{/* Date & time */}
			<section className="bg-white rounded-2xl border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-100">
					<h2 className="text-base font-semibold text-gray-900">
						Date &amp; heure
					</h2>
					<p className="text-xs text-gray-500 mt-0.5">
						Quand votre événement commence et se termine.
					</p>
				</div>
				<div className="p-6 space-y-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Controller
							control={control}
							name="startDate"
							render={({ field, fieldState }) => (
								<DatePicker
									id="startDate"
									label="Date de début"
									required
									value={field.value}
									onChange={field.onChange}
									error={fieldState.error?.message}
								/>
							)}
						/>
						<Controller
							control={control}
							name="startTime"
							render={({ field, fieldState }) => (
								<FormSelect
									id="startTime"
									label="Heure de début"
									required
									value={field.value}
									onValueChange={field.onChange}
									placeholder="Choisir une heure"
									options={timeOptions}
									error={fieldState.error?.message}
								/>
							)}
						/>
					</div>
					<div className="flex items-center gap-2">
						<Controller
							control={control}
							name="sameDayEnd"
							render={({ field }) => (
								<Checkbox
									id="sameDayEnd"
									checked={field.value}
									onCheckedChange={(c) => field.onChange(c === true)}
								/>
							)}
						/>
						<label
							htmlFor="sameDayEnd"
							className="text-sm text-gray-700 cursor-pointer select-none"
						>
							La date de fin est la même que la date de début
						</label>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Controller
							control={control}
							name="endDate"
							render={({ field, fieldState }) => (
								<DatePicker
									id="endDate"
									label="Date de fin"
									value={field.value}
									onChange={field.onChange}
									disabled={sameDayEnd}
									disabledDates={(d) =>
										startDate ? d < new Date(`${startDate}T00:00:00`) : false
									}
									error={fieldState.error?.message}
								/>
							)}
						/>
						<Controller
							control={control}
							name="endTime"
							render={({ field, fieldState }) => (
								<FormSelect
									id="endTime"
									label="Heure de fin"
									value={field.value}
									onValueChange={field.onChange}
									placeholder="Choisir une heure"
									options={timeOptions}
									error={fieldState.error?.message}
								/>
							)}
						/>
					</div>
				</div>
			</section>

			{/* Location */}
			<section className="bg-white rounded-2xl border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-3 flex-wrap">
					<div>
						<h2 className="text-base font-semibold text-gray-900">Lieu</h2>
						<p className="text-xs text-gray-500 mt-0.5">
							Où se déroule l&apos;événement ?
						</p>
					</div>
					<div className="inline-flex items-center gap-1 p-1 rounded-full bg-gray-100">
						<button
							type="button"
							onClick={() =>
								setValue("isOnline", false, {
									shouldValidate: true,
									shouldDirty: true,
								})
							}
							className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
								!isOnline
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							<MapPin size={12} className="inline mr-1 -mt-0.5" />
							Présentiel
						</button>
						<button
							type="button"
							onClick={() =>
								setValue("isOnline", true, {
									shouldValidate: true,
									shouldDirty: true,
								})
							}
							className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
								isOnline
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							<Globe size={12} className="inline mr-1 -mt-0.5" />
							En ligne
						</button>
					</div>
				</div>
				<div className="p-6 space-y-4">
					{isOnline ? (
						<FormInput
							id="onlineLink"
							label="Lien de connexion"
							type="url"
							placeholder="https://meet.example.com/..."
							error={errors.onlineLink?.message}
							{...register("onlineLink")}
						/>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<FormInput
								id="city"
								label="Ville"
								placeholder="Dakar"
								error={errors.city?.message}
								{...register("city")}
							/>
							<FormInput
								id="address"
								label="Adresse"
								placeholder="Place de l'Obélisque"
								error={errors.address?.message}
								{...register("address")}
							/>
						</div>
					)}
				</div>
			</section>

			{/* Save bar */}
			<section className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between gap-3 flex-wrap">
				<p className="text-xs text-gray-500">
					{formDirty
						? "Vous avez des modifications non enregistrées."
						: "Aucune modification en attente."}
				</p>
				<button
					type="submit"
					disabled={saveDisabled}
					className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{(isSubmitting || isSaving) && (
						<Loader2 size={16} className="animate-spin" />
					)}
					Enregistrer les modifications
				</button>
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
		</motion.form>
	);
}
