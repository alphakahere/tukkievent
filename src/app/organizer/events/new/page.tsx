"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useListVisitorEventCategoriesQuery } from "@/store/api/event-categories/event-categories.api";
import { useCreateEventMutation } from "@/store/api/event/event.api";
import type { CreateEventPayload } from "@/store/api/event/event.resource.type";

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

const TIME_SELECT_OPTIONS = TIME_OPTIONS.map((t) => ({ value: t, label: t }));

export default function CreateEventPage() {
	const router = useRouter();
	const { activeOrgId } = useOrganizerOrg();
	const { data: categories = [], isLoading: categoriesLoading } =
		useListVisitorEventCategoriesQuery();
	const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();

	// General info
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [isOnline, setIsOnline] = useState(false);
	const [city, setCity] = useState("");
	const [address, setAddress] = useState("");
	const [onlineLink, setOnlineLink] = useState("");
	const [capacity, setCapacity] = useState("");

	// Dates
	const [startDate, setStartDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endDate, setEndDate] = useState("");
	const [endTime, setEndTime] = useState("");
	const [sameDayEnd, setSameDayEnd] = useState(false);

	useEffect(() => {
		if (sameDayEnd) setEndDate(startDate);
	}, [sameDayEnd, startDate]);

	// Media
	const [coverUrl, setCoverUrl] = useState("");
	const [thumbnailUrl, setThumbnailUrl] = useState("");
	const [thumbnailFileName, setThumbnailFileName] = useState("");
	const coverInputRef = useRef<HTMLInputElement>(null);
	const thumbnailInputRef = useRef<HTMLInputElement>(null);

	function readFileAsDataUrl(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result));
			reader.onerror = () => reject(reader.error);
			reader.readAsDataURL(file);
		});
	}

	async function handleImageChange(
		e: React.ChangeEvent<HTMLInputElement>,
		setUrl: (v: string) => void,
		setName?: (v: string) => void,
	) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Le fichier doit être une image");
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			toast.error("L'image ne doit pas dépasser 5 Mo");
			return;
		}
		try {
			const dataUrl = await readFileAsDataUrl(file);
			setUrl(dataUrl);
			setName?.(file.name);
		} catch {
			toast.error("Impossible de lire le fichier");
		} finally {
			e.target.value = "";
		}
	}

	// Tickets
	type TicketDraft = {
		id: string;
		name: string;
		price: string;
		quantity: string;
	};
	const [tickets, setTickets] = useState<TicketDraft[]>([]);

	function addTicket() {
		setTickets((prev) => [
			...prev,
			{ id: crypto.randomUUID(), name: "", price: "", quantity: "" },
		]);
	}
	function updateTicket(id: string, patch: Partial<TicketDraft>) {
		setTickets((prev) =>
			prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
		);
	}
	function removeTicket(id: string) {
		setTickets((prev) => prev.filter((t) => t.id !== id));
	}

	// Publish
	const [isDraft, setIsDraft] = useState(true);
	const [pendingAction, setPendingAction] = useState<
		"draft" | "publish" | null
	>(null);

	function isValid(): boolean {
		return (
			title.trim().length > 0 &&
			capacity.trim().length > 0 &&
			startDate.length > 0 &&
			startTime.length > 0
		);
	}

	async function handleSubmit(asDraft: boolean) {
		if (!activeOrgId) {
			toast.error("Aucune organisation active");
			return;
		}
		if (!isValid()) {
			toast.error("Veuillez remplir les champs requis");
			return;
		}

		const startDatetime = combineDateTime(startDate, startTime);
		if (!startDatetime) {
			toast.error("Date de début invalide");
			return;
		}
		const endDatetime = endDate
			? combineDateTime(endDate, endTime || "23:59")
			: undefined;

		const payload: CreateEventPayload = {
			organizationId: activeOrgId,
			title: title.trim(),
			capacity: Number(capacity) || 0,
			startDatetime,
			status: asDraft ? "DRAFT" : "PUBLISHED",
		};
		if (description.trim()) payload.description = description.trim();
		if (categoryId) payload.categoryId = categoryId;
		if (endDatetime) payload.endDatetime = endDatetime;
		if (isOnline) {
			payload.isOnline = true;
			if (onlineLink.trim()) payload.onlineLink = onlineLink.trim();
		} else {
			if (city.trim()) payload.city = city.trim();
			if (address.trim()) payload.address = address.trim();
		}
		if (coverUrl.trim()) payload.coverImageUrl = coverUrl.trim();
		if (thumbnailUrl.trim()) payload.thumbnailUrl = thumbnailUrl.trim();

		setPendingAction(asDraft ? "draft" : "publish");
		try {
			await createEvent(payload).unwrap();
			toast.success(asDraft ? "Brouillon enregistré !" : "Événement publié !");
			router.push("/organizer/events");
		} catch (err) {
			const message =
				err &&
				typeof err === "object" &&
				"data" in err &&
				err.data &&
				typeof err.data === "object" &&
				"message" in err.data
					? String((err.data as { message: unknown }).message)
					: "Une erreur est survenue";
			toast.error(message);
		} finally {
			setPendingAction(null);
		}
	}

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
		<div className="p-5 md:p-8 max-w-6xl mx-auto">
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
					onChange={(e) => handleImageChange(e, setCoverUrl)}
				/>
				<input
					ref={thumbnailInputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={(e) =>
						handleImageChange(e, setThumbnailUrl, setThumbnailFileName)
					}
				/>

				<div className="relative h-56 md:h-72 bg-gradient-to-br from-gray-100 to-gray-50 group">
					{coverUrl ? (
						<>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={coverUrl}
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
									onClick={() => setCoverUrl("")}
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
							{thumbnailUrl ? (
								/* eslint-disable-next-line @next/next/no-img-element */
								<img
									src={thumbnailUrl}
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
									{thumbnailFileName ||
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
								{thumbnailUrl ? "Modifier" : "Ajouter"}
							</button>
							{thumbnailUrl && (
								<button
									type="button"
									onClick={() => {
										setThumbnailUrl("");
										setThumbnailFileName("");
									}}
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
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Nom de votre événement"
						className="w-full text-2xl md:text-3xl font-bold text-gray-900 placeholder:text-gray-300 bg-transparent border-0 focus:outline-none focus:ring-0 px-0"
					/>
					<div className="mt-3 w-full lg:w-1/2">
						<Select
							value={categoryId}
							onValueChange={setCategoryId}
							disabled={categoriesLoading}
						>
							<SelectTrigger
								id="category"
								className="w-full"
							>
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
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Décrivez votre événement, le programme, les artistes, ce que les participants vivront..."
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
							<DatePicker
								id="startDate"
								label="Date de début"
								required
								value={startDate}
								onChange={setStartDate}
							/>
							<FormSelect
								id="startTime"
								label="Heure de début"
								required
								value={startTime}
								onValueChange={setStartTime}
								placeholder="Choisir une heure"
								options={TIME_SELECT_OPTIONS}
							/>
						</div>

						<div className="flex items-center gap-2">
							<Checkbox
								id="sameDayEnd"
								checked={sameDayEnd}
								onCheckedChange={(c) => setSameDayEnd(c === true)}
							/>
							<label
								htmlFor="sameDayEnd"
								className="text-sm text-gray-700 cursor-pointer select-none"
							>
								La date de fin est la même que la date de début
							</label>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<DatePicker
								id="endDate"
								label="Date de fin"
								value={endDate}
								onChange={setEndDate}
								disabled={sameDayEnd}
								disabledDates={(d) =>
									startDate
										? d < new Date(`${startDate}T00:00:00`)
										: false
								}
							/>
							<FormSelect
								id="endTime"
								label="Heure de fin"
								value={endTime}
								onValueChange={setEndTime}
								placeholder="Choisir une heure"
								options={TIME_SELECT_OPTIONS}
							/>
						</div>
					</section>

					{/* Location */}
					<section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
						<header className="flex items-start justify-between gap-3">
							<div>
								<h2 className="text-base font-semibold text-gray-900">
									Lieu
								</h2>
								<p className="text-xs text-gray-500 mt-0.5">
									Où se déroule l&apos;événement ?
								</p>
							</div>
							<div className="inline-flex items-center gap-1 p-1 rounded-full bg-gray-100">
								<button
									type="button"
									onClick={() => setIsOnline(false)}
									className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
										!isOnline
											? "bg-white text-gray-900 shadow-sm"
											: "text-gray-500 hover:text-gray-700"
									}`}
								>
									<MapPin
										size={12}
										className="inline mr-1 -mt-0.5"
									/>
									Présentiel
								</button>
								<button
									type="button"
									onClick={() => setIsOnline(true)}
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
								value={onlineLink}
								onChange={(e) => setOnlineLink(e.target.value)}
								placeholder="https://meet.example.com/..."
							/>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<FormInput
									id="city"
									label="Ville"
									value={city}
									onChange={(e) => setCity(e.target.value)}
									placeholder="Dakar"
								/>
								<FormInput
									id="address"
									label="Adresse"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									placeholder="Place de l'Obélisque"
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
							value={capacity}
							onChange={(e) => setCapacity(e.target.value)}
							placeholder="500"
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

						{tickets.length === 0 ? (
							<div className="flex flex-col items-center justify-center text-center py-8 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
								<TicketIcon
									size={28}
									className="text-gray-300 mb-2"
								/>
								<p className="text-sm font-medium text-gray-700">
									Aucun billet pour le moment
								</p>
								<p className="text-xs text-gray-500 mt-1">
									Ajoutez un type de billet ou configurez-les plus tard.
								</p>
							</div>
						) : (
							<div className="space-y-3">
								{tickets.map((t, idx) => (
									<div
										key={t.id}
										className="rounded-xl border border-gray-200 p-4 space-y-3"
									>
										<div className="flex items-center justify-between">
											<span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
												Billet {idx + 1}
											</span>
											<button
												type="button"
												onClick={() => removeTicket(t.id)}
												aria-label="Supprimer ce billet"
												className="p-1.5 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
											>
												<Trash2 size={16} />
											</button>
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<FormInput
												id={`ticket-name-${t.id}`}
												label="Nom"
												required
												value={t.name}
												onChange={(e) =>
													updateTicket(t.id, { name: e.target.value })
												}
												placeholder="Standard, VIP..."
												containerClassName="sm:col-span-2"
											/>
											<FormInput
												id={`ticket-price-${t.id}`}
												label="Prix (FCFA)"
												required
												type="number"
												min={0}
												value={t.price}
												onChange={(e) =>
													updateTicket(t.id, { price: e.target.value })
												}
												placeholder="0 pour gratuit"
											/>
											<FormInput
												id={`ticket-qty-${t.id}`}
												label="Quantité"
												required
												type="number"
												min={1}
												value={t.quantity}
												onChange={(e) =>
													updateTicket(t.id, {
														quantity: e.target.value,
													})
												}
												placeholder="100"
											/>
										</div>
									</div>
								))}
							</div>
						)}

						<button
							type="button"
							onClick={addTicket}
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
							{!isValid() && (
								<p className="text-xs text-amber-600 mt-1.5">
									Titre, capacité et date de début requis.
								</p>
							)}
						</div>
						<div className="flex flex-col-reverse sm:flex-row sm:justify-end items-stretch sm:items-center gap-2">
							<button
								type="button"
								onClick={() => handleSubmit(true)}
								disabled={isCreating || !activeOrgId || !isValid()}
								className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
							>
								{pendingAction === "draft" ? (
									<Loader2 size={16} className="animate-spin" />
								) : null}
								Enregistrer le brouillon
							</button>
							<button
								type="button"
								onClick={() => handleSubmit(false)}
								disabled={isCreating || !activeOrgId || !isValid()}
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
								value={
									capacity ? `${capacity} place${Number(capacity) > 1 ? "s" : ""}` : null
								}
							/>
							<SummaryRow
								icon={TicketIcon}
								label="Billets"
								value={
									tickets.length === 0
										? null
										: `${tickets.length} type${tickets.length > 1 ? "s" : ""}`
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

						<div className="px-5 py-4 border-t border-gray-100 space-y-3">
							<div className="flex items-center justify-between gap-3">
								<div className="min-w-0">
									<p className="text-sm font-medium text-gray-900">
										Brouillon
									</p>
									<p className="text-xs text-gray-500">
										Non visible publiquement
									</p>
								</div>
								<button
									type="button"
									role="switch"
									aria-checked={isDraft}
									onClick={() => setIsDraft(!isDraft)}
									className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
										isDraft ? "bg-primary" : "bg-gray-300"
									}`}
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
											isDraft ? "translate-x-6" : "translate-x-1"
										}`}
									/>
								</button>
							</div>

							<button
								type="button"
								onClick={() => handleSubmit(isDraft)}
								disabled={isCreating || !activeOrgId || !isValid()}
								className="w-full py-3 px-4 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{isCreating ? (
									<Loader2 size={16} className="animate-spin" />
								) : (
									<Check size={16} />
								)}
								{isDraft
									? "Enregistrer le brouillon"
									: "Publier l'événement"}
							</button>
							{!isValid() && (
								<p className="text-xs text-gray-400 text-center">
									Titre, capacité et date de début requis
								</p>
							)}
						</div>
					</div>
				</aside>
			</div>
		</div>
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
