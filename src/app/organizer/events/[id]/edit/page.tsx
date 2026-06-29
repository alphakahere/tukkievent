"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	ArrowLeft,
	Check,
	Globe,
	Image as ImageIcon,
	Loader2,
	MapPin,
	Pencil,
	Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
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
import { assetUrl } from "@/lib/utils";
import { getApiErrorMessage } from "@/store/api/auth/error";
import { useListVisitorEventCategoriesQuery } from "@/store/api/event-categories/event-categories.api";
import { useUpdateEventMutation } from "@/store/api/event/event.api";
import type { UpdateEventPayload } from "@/store/api/event/event.resource.type";
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

export default function EditEventPage() {
	const event = useEvent();
	const router = useRouter();
	const backHref = `/organizer/events/${event.id}/settings`;
	const { data: categories = [], isLoading: categoriesLoading } =
		useListVisitorEventCategoriesQuery();
	const [updateEvent, { isLoading: isSaving }] = useUpdateEventMutation();
	const [uploadImage] = useUploadImageMutation();

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
			metaTitle: event.metaTitle ?? "",
			metaDescription: event.metaDescription ?? "",
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
	const metaTitle = watch("metaTitle");
	const metaDescription = watch("metaDescription");

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
			metaTitle: data.metaTitle || undefined,
			metaDescription: data.metaDescription || undefined,
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

	const formDirty = isDirty || coverFile !== null || thumbnailFile !== null;
	const saveDisabled = isSubmitting || isSaving || !formDirty;

	return (
		<form
			noValidate
			onSubmit={handleSubmit(onValid, onInvalid)}
			className="p-5 md:p-8 max-w-5xl mx-auto"
		>
			<div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
				<Link
					href={backHref}
					className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
				>
					<ArrowLeft size={16} />
					Retour
				</Link>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => router.push(backHref)}
						className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
					>
						Annuler
					</button>
					<button
						type="submit"
						disabled={saveDisabled}
						className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{isSubmitting || isSaving ? (
							<Loader2 size={14} className="animate-spin" />
						) : (
							<Check size={14} />
						)}
						Enregistrer
					</button>
				</div>
			</div>

			{/* Hero: cover + title */}
			<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
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

				<div className="relative h-56 md:h-72 bg-gradient-to-br from-gray-100 to-gray-50 group">
					{coverPreview ? (
						<>
							<Image
								src={coverPreview}
								alt="Couverture"
								fill
								unoptimized
								sizes="(min-width: 768px) 800px, 100vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
							<div className="absolute top-4 right-4 flex items-center gap-2">
								<button
									type="button"
									onClick={() => coverInputRef.current?.click()}
									className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-xs font-semibold text-gray-800 shadow-sm hover:bg-white transition-colors"
								>
									<Pencil size={12} />
									Modifier la couverture
								</button>
								<button
									type="button"
									onClick={() => clearImage("coverUrl")}
									className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-xs font-semibold text-gray-800 shadow-sm hover:bg-white transition-colors"
									aria-label="Retirer la couverture"
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

				<div className="px-5 md:px-6 pt-4 border-t border-gray-100 bg-gray-50/50">
					<div className="flex items-center justify-between gap-3 py-1">
						<div className="flex items-center gap-3 min-w-0">
							{thumbnailPreview ? (
								<Image
									src={thumbnailPreview}
									alt="Miniature"
									width={48}
									height={48}
									unoptimized
									className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
								/>
							) : (
								<div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
									<ImageIcon size={18} />
								</div>
							)}
							<div className="min-w-0">
								<p className="text-xs font-medium text-gray-700">
									Miniature (facultatif)
								</p>
								<p className="text-xs text-gray-500 truncate">
									Utilisée dans les listes et résultats.
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
				</div>

				<div className="p-5 md:p-6">
					<input
						type="text"
						{...register("title")}
						placeholder="Nom de votre événement"
						className="w-full text-2xl md:text-3xl font-bold text-gray-900 placeholder:text-gray-300 bg-transparent border-0 focus:outline-none focus:ring-0 px-0"
					/>
					{errors.title?.message && (
						<p className="text-xs text-red-500 mt-1" role="alert">
							{errors.title.message}
						</p>
					)}
					<div className="mt-3 w-full lg:w-1/2">
						<Controller
							control={control}
							name="categoryId"
							render={({ field }) => (
								<Select
									value={field.value}
									onValueChange={field.onChange}
									disabled={categoriesLoading}
								>
									<SelectTrigger id="category" className="w-full">
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
				</div>
			</div>

			<div className="space-y-4">
				{/* À propos */}
				<section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
					<header>
						<h2 className="text-base font-semibold text-gray-900">À propos</h2>
						<p className="text-xs text-gray-500 mt-0.5">
							Décrivez l&apos;événement pour donner envie.
						</p>
					</header>
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
						placeholder="Décrivez votre événement, le programme, les artistes..."
						error={errors.description?.message}
						{...register("description")}
					/>
				</section>

				{/* Date & heure */}
				<section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
					<header>
						<h2 className="text-base font-semibold text-gray-900">
							Date &amp; heure
						</h2>
						<p className="text-xs text-gray-500 mt-0.5">
							Quand votre événement commence et se termine.
						</p>
					</header>

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
				</section>

				{/* Lieu */}
				<section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
					<header className="flex items-start justify-between gap-3 flex-wrap">
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
					</header>

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
				</section>

				{/* Capacité & âge */}
				<section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
					<header>
						<h2 className="text-base font-semibold text-gray-900">
							Capacité &amp; accès
						</h2>
						<p className="text-xs text-gray-500 mt-0.5">
							Limites de places et restrictions d&apos;âge.
						</p>
					</header>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
				</section>

				{/* SEO */}
				<section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
					<header>
						<h2 className="text-base font-semibold text-gray-900">
							Référencement
						</h2>
						<p className="text-xs text-gray-500 mt-0.5">
							Comment votre événement apparaît sur Google et les réseaux
							sociaux.
						</p>
					</header>
					<FormInput
						id="metaTitle"
						label="Titre SEO"
						helperText={`${(metaTitle ?? "").length}/70 caractères. Laissez vide pour utiliser le titre de l'événement.`}
						placeholder={event.title}
						maxLength={70}
						error={errors.metaTitle?.message}
						{...register("metaTitle")}
					/>
					<FormTextarea
						id="metaDescription"
						label="Description SEO"
						helperText={`${(metaDescription ?? "").length}/160 caractères. Affichée dans les résultats de recherche.`}
						placeholder="Un résumé concis pour les moteurs de recherche."
						rows={3}
						maxLength={160}
						error={errors.metaDescription?.message}
						{...register("metaDescription")}
					/>
					<div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
						<p className="text-xs text-gray-400 mb-1">Aperçu Google</p>
						<p className="text-sm text-blue-700 truncate">
							{metaTitle || event.title}
						</p>
						<p className="text-xs text-green-700 mt-0.5 truncate">
							tukki.com/events/{event.slug}
						</p>
						<p className="text-xs text-gray-600 mt-1 line-clamp-2">
							{metaDescription ||
								event.shortDescription ||
								event.description ||
								"Aucune description fournie."}
						</p>
					</div>
				</section>

				{/* Bottom save bar */}
				<section className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between gap-3 flex-wrap">
					<p className="text-xs text-gray-500">
						{formDirty
							? "Vous avez des modifications non enregistrées."
							: "Aucune modification en attente."}
					</p>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => router.push(backHref)}
							className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
						>
							Annuler
						</button>
						<button
							type="submit"
							disabled={saveDisabled}
							className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
						>
							{(isSubmitting || isSaving) && (
								<Loader2 size={16} className="animate-spin" />
							)}
							Enregistrer
						</button>
					</div>
				</section>
			</div>
		</form>
	);
}
