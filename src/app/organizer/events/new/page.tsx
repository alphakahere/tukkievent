"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
	ArrowLeft,
	Calendar,
	Check,
	Globe,
	Image as ImageIcon,
	Loader2,
	MapPin,
	Pencil,
	Plus,
	Ticket as TicketIcon,
	Trash2,
	Users,
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
import { useOrganizerOrg } from "@/contexts/OrganizerOrgContext";
import { getApiErrorMessage } from "@/store/api/auth/error";
import { useListVisitorEventCategoriesQuery } from "@/store/api/event-categories/event-categories.api";
import { useCreateEventMutation } from "@/store/api/event/event.api";
import type { CreateEventPayload } from "@/store/api/event/event.resource.type";
import { useUploadImageMutation } from "@/store/api/uploads/uploads.api";
import {
	type EventFormValues,
	eventFormSchema,
} from "../_form/schema";

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
	const h = String(Math.floor(i / 2)).padStart(2, "0");
	const m = i % 2 === 0 ? "00" : "30";
	return `${h}:${m}`;
});

const TIME_SELECT_OPTIONS = TIME_OPTIONS.map((t) => ({ value: t, label: t }));

function combineDateTime(date: string, time: string): string | null {
	if (!date) return null;
	const t = time || "00:00";
	return new Date(`${date}T${t}:00`).toISOString();
}

// Sale-window dates carry no time: start at day-open, end at day-close.
function saleDateToIso(date: string, endOfDay = false): string | undefined {
	if (!date) return undefined;
	return new Date(`${date}${endOfDay ? "T23:59:59" : "T00:00:00"}`).toISOString();
}

export default function CreateEventPage() {
	const router = useRouter();
	const { activeOrgId } = useOrganizerOrg();
	const { data: categories = [], isLoading: categoriesLoading } =
		useListVisitorEventCategoriesQuery();
	const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
	const [uploadImage] = useUploadImageMutation();
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [coverPreview, setCoverPreview] = useState<string>("");
	const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

	const {
		register,
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<EventFormValues>({
		resolver: yupResolver(eventFormSchema),
		mode: "onTouched",
		defaultValues: {
			title: "",
			description: "",
			categoryId: "",
			isOnline: false,
			city: "",
			address: "",
			onlineLink: "",
			capacity: undefined,
			startDate: "",
			startTime: "",
			endDate: "",
			endTime: "",
			sameDayEnd: false,
			coverUrl: "",
			thumbnailUrl: "",
			tickets: [],
		},
	});

	const {
		fields: ticketFields,
		append: appendTicket,
		remove: removeTicket,
	} = useFieldArray({ control, name: "tickets" });

	const title = watch("title");
	const categoryId = watch("categoryId");
	const isOnline = watch("isOnline");
	const city = watch("city");
	const address = watch("address");
	const capacity = watch("capacity");
	const startDate = watch("startDate");
	const startTime = watch("startTime");
	const sameDayEnd = watch("sameDayEnd");

	// Mirror start date into end date while "same day" is toggled on.
	useEffect(() => {
		if (sameDayEnd) {
			setValue("endDate", startDate, { shouldValidate: true });
		}
	}, [sameDayEnd, startDate, setValue]);

	// Media file pickers — values are kept in form state as data URLs.
	const thumbnailFileNameRef = useRef("");
	const coverInputRef = useRef<HTMLInputElement>(null);
	const thumbnailInputRef = useRef<HTMLInputElement>(null);

	// Object URLs we created locally so they can be revoked on replace/unmount.
	// Remote/already-uploaded URLs in `coverPreview` are not tracked here.
	const objectUrlsRef = useRef<Set<string>>(new Set());

	function revokeObjectUrl(url: string) {
		if (objectUrlsRef.current.has(url)) {
			URL.revokeObjectURL(url);
			objectUrlsRef.current.delete(url);
		}
	}

	useEffect(() => {
		const urls = objectUrlsRef.current;
		return () => {
			urls.forEach((u) => URL.revokeObjectURL(u));
			urls.clear();
		};
	}, []);

	function handleImageChange(
		e: React.ChangeEvent<HTMLInputElement>,
		field: "coverUrl" | "thumbnailUrl",
	) {
		const file = e.target.files?.[0];
		// Reset the native input so picking the same file twice still fires a
		// change event.
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
			revokeObjectUrl(coverPreview);
			setCoverFile(file);
			setCoverPreview(preview);
		} else {
			revokeObjectUrl(thumbnailPreview);
			setThumbnailFile(file);
			setThumbnailPreview(preview);
			thumbnailFileNameRef.current = file.name;
		}
		// Clear any stale URL stored on the form — it'll be filled in by the
		// upload call at submit time.
		setValue(field, "", { shouldDirty: true });
	}

	function clearImage(field: "coverUrl" | "thumbnailUrl") {
		if (field === "coverUrl") {
			revokeObjectUrl(coverPreview);
			setCoverFile(null);
			setCoverPreview("");
		} else {
			revokeObjectUrl(thumbnailPreview);
			setThumbnailFile(null);
			setThumbnailPreview("");
			thumbnailFileNameRef.current = "";
		}
		setValue(field, "", { shouldDirty: true });
	}

	const pendingActionRef = useRef<"draft" | "publish" | null>(null);

	const onValid = async (data: EventFormValues) => {
		const asDraft = pendingActionRef.current !== "publish";
		if (!activeOrgId) {
			toast.error("Aucune organisation active");
			return;
		}

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

		const payload: CreateEventPayload = {
			organizationId: activeOrgId,
			title: data.title,
			capacity: data.capacity,
			startDatetime,
			status: asDraft ? "DRAFT" : "PUBLISHED",
		};
		if (data.description) payload.description = data.description;
		if (data.categoryId) payload.categoryId = data.categoryId;
		if (endDatetime) payload.endDatetime = endDatetime;
		if (data.isOnline) {
			payload.isOnline = true;
			if (data.onlineLink) payload.onlineLink = data.onlineLink;
		} else {
			if (data.city) payload.city = data.city;
			if (data.address) payload.address = data.address;
		}
		if (coverImageUrl) payload.coverImageUrl = coverImageUrl;
		if (thumbnailUrl) payload.thumbnailUrl = thumbnailUrl;

		// Ticket types are created atomically with the event by the API.
		// Map the form's `quantity` onto the API's `totalQuantity` and the
		// optional sale-window dates onto full ISO datetimes.
		if (data.tickets.length > 0) {
			payload.ticketTypes = data.tickets.map((ticket, i) => {
				const saleStart = saleDateToIso(ticket.saleStartDate);
				const saleEnd = saleDateToIso(ticket.saleEndDate, true);
				return {
					name: ticket.name,
					price: ticket.price,
					totalQuantity: ticket.quantity,
					sortOrder: i,
					...(saleStart && { saleStartDatetime: saleStart }),
					...(saleEnd && { saleEndDatetime: saleEnd }),
				};
			});
		}

		try {
			await createEvent(payload).unwrap();
			toast.success(asDraft ? "Brouillon enregistré !" : "Événement publié !");
			router.push("/organizer/events");
		} catch (err) {
			toast.error(getApiErrorMessage(err));
		}
	};

	const onInvalid = () => {
		toast.error("Veuillez corriger les champs en erreur");
	};

	const submitWith = (action: "draft" | "publish") => () => {
		pendingActionRef.current = action;
		void handleSubmit(onValid, onInvalid)();
	};

	const pendingAction = isSubmitting ? pendingActionRef.current : null;
	const submitDisabled = isSubmitting || isCreating || !activeOrgId;

	const ticketsLength = ticketFields.length;
	const categoryName = categories.find((c) => c.id === categoryId)?.name;
	const formattedStart =
		startDate && startTime
			? format(
					new Date(`${startDate}T${startTime}:00`),
					"EEE d MMM yyyy 'à' HH:mm",
					{ locale: fr },
				)
			: null;
	const locationLabel = isOnline
		? "En ligne"
		: [city, address].filter(Boolean).join(", ") || null;

	return (
		<form
			noValidate
			onSubmit={(e) => e.preventDefault()}
			className="p-5 md:p-8 max-w-6xl mx-auto"
		>
			{/* Back link */}
			<button
				type="button"
				onClick={() => router.push("/organizer/events")}
				className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
			>
				<ArrowLeft size={16} />
				Événements
			</button>

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
								<p className="text-xs font-medium text-gray-700">
									Miniature (facultatif)
								</p>
								<p className="text-xs text-gray-500 truncate">
									{thumbnailFileNameRef.current ||
										"Utilisée dans les listes et résultats"}
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

			{/* Two-column layout */}
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
				{/* Left: form sections */}
				<div className="space-y-4 min-w-0">
					{/* Description */}
					<section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
						<header>
							<h2 className="text-base font-semibold text-gray-900">
								À propos
							</h2>
							<p className="text-xs text-gray-500 mt-0.5">
								Décrivez l&apos;événement pour donner envie.
							</p>
						</header>
						<FormTextarea
							id="description"
							label="Description"
							labelClassName="sr-only"
							placeholder="Décrivez votre événement, le programme, les artistes, ce que les participants vivront..."
							error={errors.description?.message}
							{...register("description")}
						/>
					</section>

					{/* Date & time */}
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
										options={TIME_SELECT_OPTIONS}
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
											startDate
												? d < new Date(`${startDate}T00:00:00`)
												: false
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
										options={TIME_SELECT_OPTIONS}
										error={fieldState.error?.message}
									/>
								)}
							/>
						</div>
					</section>

					{/* Location */}
					<section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
						<header className="flex items-start justify-between gap-3">
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
										setValue("isOnline", false, { shouldValidate: true })
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
										setValue("isOnline", true, { shouldValidate: true })
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

					{/* Capacity */}
					<section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
						<header>
							<h2 className="text-base font-semibold text-gray-900">
								Capacité
							</h2>
							<p className="text-xs text-gray-500 mt-0.5">
								Le nombre total de places disponibles.
							</p>
						</header>
						<FormInput
							id="capacity"
							label="Capacité"
							labelClassName="sr-only"
							type="number"
							min={0}
							placeholder="500"
							error={errors.capacity?.message}
							{...register("capacity")}
						/>
					</section>

					{/* Tickets */}
					<section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
						<header>
							<h2 className="text-base font-semibold text-gray-900">
								Billets
							</h2>
							<p className="text-xs text-gray-500 mt-0.5">
								Les types de billets proposés. Configurables plus tard.
							</p>
						</header>

						{ticketFields.length === 0 ? (
							<div className="flex flex-col items-center justify-center text-center py-8 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
								<TicketIcon size={28} className="text-gray-300 mb-2" />
								<p className="text-sm font-medium text-gray-700">
									Aucun billet pour le moment
								</p>
								<p className="text-xs text-gray-500 mt-1">
									Ajoutez un type de billet ou configurez-les plus tard.
								</p>
							</div>
						) : (
							<div className="space-y-3">
								{ticketFields.map((field, idx) => (
									<div
										key={field.id}
										className="rounded-xl border border-gray-200 p-4 space-y-3"
									>
										<div className="flex items-center justify-between">
											<span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
												Billet {idx + 1}
											</span>
											<button
												type="button"
												onClick={() => removeTicket(idx)}
												aria-label="Supprimer ce billet"
												className="p-1.5 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
											>
												<Trash2 size={16} />
											</button>
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<FormInput
												id={`ticket-name-${field.id}`}
												label="Nom"
												required
												placeholder="Standard, VIP..."
												containerClassName="sm:col-span-2"
												error={errors.tickets?.[idx]?.name?.message}
												{...register(`tickets.${idx}.name`)}
											/>
											<FormInput
												id={`ticket-price-${field.id}`}
												label="Prix (FCFA)"
												required
												type="number"
												min={0}
												placeholder="0 pour gratuit"
												error={errors.tickets?.[idx]?.price?.message}
												{...register(`tickets.${idx}.price`)}
											/>
											<FormInput
												id={`ticket-qty-${field.id}`}
												label="Quantité"
												required
												type="number"
												min={1}
												placeholder="100"
												error={errors.tickets?.[idx]?.quantity?.message}
												{...register(`tickets.${idx}.quantity`)}
											/>
										</div>
										<div className="space-y-2">
											<p className="text-xs font-medium text-gray-500">
												Période de vente (facultative)
											</p>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
												<Controller
													control={control}
													name={`tickets.${idx}.saleStartDate`}
													render={({ field: f, fieldState }) => (
														<DatePicker
															id={`ticket-sale-start-${field.id}`}
															label="Début des ventes"
															value={f.value}
															onChange={f.onChange}
															error={fieldState.error?.message}
														/>
													)}
												/>
												<Controller
													control={control}
													name={`tickets.${idx}.saleEndDate`}
													render={({ field: f, fieldState }) => (
														<DatePicker
															id={`ticket-sale-end-${field.id}`}
															label="Fin des ventes"
															value={f.value}
															onChange={f.onChange}
															disabledDates={(d) => {
																const start =
																	watch(`tickets.${idx}.saleStartDate`);
																return start
																	? d < new Date(`${start}T00:00:00`)
																	: false;
															}}
															error={fieldState.error?.message}
														/>
													)}
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						<button
							type="button"
							onClick={() =>
								// Start price/quantity empty (not 0/1) so the placeholders
								// show and the user types straight in. The schema coerces
								// blank → undefined and surfaces a "requis" error on submit.
								appendTicket({
									name: "",
									price: undefined as unknown as number,
									quantity: undefined as unknown as number,
									saleStartDate: "",
									saleEndDate: "",
								})
							}
							className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors"
						>
							<Plus size={16} />
							Ajouter un type de billet
						</button>
					</section>

					{/* Bottom actions */}
					<section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
						<div>
							<p className="text-sm font-semibold text-gray-900">
								Prêt à finaliser&nbsp;?
							</p>
							<p className="text-xs text-gray-500 mt-0.5">
								Enregistrez en brouillon pour continuer plus tard, ou publiez
								pour rendre l&apos;événement visible.
							</p>
						</div>
						<div className="flex flex-col-reverse sm:flex-row sm:justify-end items-stretch sm:items-center gap-2">
							<button
								type="button"
								onClick={submitWith("draft")}
								disabled={submitDisabled}
								className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
							>
								{pendingAction === "draft" ? (
									<Loader2 size={16} className="animate-spin" />
								) : null}
								Enregistrer le brouillon
							</button>
							<button
								type="button"
								onClick={submitWith("publish")}
								disabled={submitDisabled}
								className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
							>
								{pendingAction === "publish" ? (
									<Loader2 size={16} className="animate-spin" />
								) : (
									<Check size={16} />
								)}
								Publier
							</button>
						</div>
					</section>
				</div>

				{/* Right: sticky summary */}
				<aside className="lg:sticky lg:top-6 lg:self-start space-y-4">
					<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
						<div className="px-5 py-4 border-b border-gray-100">
							<p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
								Détails
							</p>
							<p className="text-sm font-semibold text-gray-900 mt-0.5">
								{title || "Sans titre"}
							</p>
						</div>

						<dl className="px-5 py-4 space-y-3.5 text-sm">
							<SummaryRow
								icon={Calendar}
								label="Quand"
								value={formattedStart}
							/>
							<SummaryRow
								icon={isOnline ? Globe : MapPin}
								label="Où"
								value={locationLabel}
							/>
							<SummaryRow
								icon={Users}
								label="Capacité"
								value={(() => {
									const n = Number(capacity);
									if (!Number.isFinite(n) || n <= 0) return null;
									return `${n} place${n > 1 ? "s" : ""}`;
								})()}
							/>
							<SummaryRow
								icon={TicketIcon}
								label="Billets"
								value={
									ticketsLength === 0
										? null
										: `${ticketsLength} type${ticketsLength > 1 ? "s" : ""}`
								}
							/>
							{categoryName && (
								<SummaryRow
									icon={null}
									label="Catégorie"
									value={categoryName}
								/>
							)}
						</dl>
					</div>
				</aside>
			</div>
		</form>
	);
}

function SummaryRow({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ComponentType<{ size?: number; className?: string }> | null;
	label: string;
	value: string | null;
}) {
	return (
		<div className="flex items-start gap-3">
			{Icon && (
				<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-500 shrink-0">
					<Icon size={14} />
				</div>
			)}
			<div className={`min-w-0 flex-1 ${Icon ? "" : "ml-11"}`}>
				<dt className="text-xs text-gray-500">{label}</dt>
				<dd
					className={`text-sm font-medium mt-0.5 truncate ${
						value ? "text-gray-900" : "text-gray-400"
					}`}
				>
					{value || "À compléter"}
				</dd>
			</div>
		</div>
	);
}
