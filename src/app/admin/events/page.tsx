"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
	Search,
	CheckCircle,
	XCircle,
	Eye,
	ShieldOff,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import {
	useListEventsQuery,
	useUpdateEventMutation,
} from "@/store/api/event/event.api";
import type {
	EventResource,
	EventStatus,
} from "@/store/api/event/event.resource.type";
import { useListOrganizationsQuery } from "@/store/api/organizations/organizations.api";
import { useListEventCategoriesQuery } from "@/store/api/event-categories/event-categories.api";
import { getApiErrorMessage } from "@/store/api/auth/error";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STATUS_CONFIG: Record<EventStatus, { label: string; class: string }> = {
	DRAFT: { label: "Brouillon", class: "bg-amber-50 text-amber-600" },
	PUBLISHED: { label: "Publié", class: "bg-emerald-50 text-emerald-600" },
	REJECTED: { label: "Rejeté", class: "bg-red-50 text-rose-600" },
	SUSPENDED: { label: "Suspendu", class: "bg-gray-200 text-gray-700" },
	CANCELLED: { label: "Annulé", class: "bg-gray-100 text-gray-500" },
	COMPLETED: { label: "Terminé", class: "bg-violet-50 text-violet-600" },
};

const STATUS_FILTERS: ("ALL" | EventStatus)[] = [
	"ALL",
	"DRAFT",
	"PUBLISHED",
	"REJECTED",
	"SUSPENDED",
	"CANCELLED",
	"COMPLETED",
];

const PAGE_SIZE = 20;

type PendingAction = {
	event: EventResource;
	nextStatus: EventStatus;
	verb: string;
};

function useDebounced<T>(value: T, delay = 300) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const t = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(t);
	}, [value, delay]);
	return debounced;
}

export default function AdminEventsPage() {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<"ALL" | EventStatus>(
		"ALL",
	);
	const [page, setPage] = useState(1);
	const [pending, setPending] = useState<PendingAction | null>(null);

	const debouncedSearch = useDebounced(search, 300);

	useEffect(() => {
		setPage(1);
	}, [debouncedSearch, statusFilter]);

	const queryParams = useMemo(
		() => ({
			page,
			limit: PAGE_SIZE,
			...(debouncedSearch ? { q: debouncedSearch } : {}),
			...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
		}),
		[page, debouncedSearch, statusFilter],
	);

	const { data, isLoading, isFetching } = useListEventsQuery(queryParams);
	const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

	// TODO: replace with `?include=organization,category` once backend supports it
	const { data: orgsData } = useListOrganizationsQuery({
		page: 1,
		limit: 100,
	});
	const { data: categoriesData } = useListEventCategoriesQuery({
		page: 1,
		limit: 100,
	});

	const orgsById = useMemo(() => {
		const map = new Map<string, string>();
		orgsData?.data.forEach((o) => map.set(o.id, o.name));
		return map;
	}, [orgsData]);

	const categoriesById = useMemo(() => {
		const map = new Map<string, string>();
		categoriesData?.data.forEach((c) => map.set(c.id, c.name));
		return map;
	}, [categoriesData]);

	const events = data?.data ?? [];
	const total = data?.meta.total ?? 0;
	const totalPages = data?.meta.totalPages ?? 1;

	const handleConfirm = async () => {
		if (!pending) return;
		const { event, nextStatus, verb } = pending;
		try {
			await updateEvent({
				id: event.id,
				patch: { status: nextStatus },
			}).unwrap();
			toast.success(`«${event.title}» ${verb}`);
			setPending(null);
		} catch (err) {
			toast.error(
				getApiErrorMessage(
					err,
					`Impossible de ${verb} l'événement`,
				),
			);
			setPending(null);
		}
	};

	return (
		<div className="p-4 lg:p-6 space-y-4">
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<p className="text-2xl font-bold text-gray-900">
					Événements
				</p>
				<p className="text-sm text-gray-500 mt-0.5">
					{isLoading
						? "Chargement…"
						: `${total} événement${total !== 1 ? "s" : ""} au total`}
				</p>
			</motion.div>

			{/* Filters */}
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.05 }}
				className="flex flex-col sm:flex-row gap-3"
			>
				<div className="relative flex-1">
					<Search
						size={15}
						className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
					/>
					<input
						type="search"
						placeholder="Rechercher un événement…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
					/>
				</div>
				<div className="flex gap-2 overflow-x-auto pb-0.5">
					{STATUS_FILTERS.map((s) => (
						<button
							key={s}
							type="button"
							onClick={() => setStatusFilter(s)}
							className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
								statusFilter === s
									? "bg-gray-900 text-white border-gray-900"
									: "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
							}`}
						>
							{s === "ALL"
								? "Tous"
								: STATUS_CONFIG[s].label}
						</button>
					))}
				</div>
			</motion.div>

			{/* Event list */}
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className={`space-y-3 ${isFetching && !isLoading ? "opacity-60" : ""}`}
			>
				{isLoading ? (
					<div className="bg-white rounded-2xl border border-gray-100 px-5 py-8 text-center">
						<p className="text-sm text-gray-400">
							Chargement…
						</p>
					</div>
				) : events.length === 0 ? (
					<div className="bg-white rounded-2xl border border-gray-100 px-5 py-8 text-center">
						<p className="text-sm text-gray-400">
							Aucun événement trouvé
						</p>
					</div>
				) : (
					events.map((ev) => {
						const status = STATUS_CONFIG[ev.status];
						const orgName =
							orgsById.get(ev.organizationId) ??
							"—";
						const categoryName = ev.categoryId
							? (categoriesById.get(
									ev.categoryId,
								) ?? "—")
							: "—";
						const isDraft = ev.status === "DRAFT";
						const isPublished =
							ev.status === "PUBLISHED";

						return (
							<div
								key={ev.id}
								className={`bg-white rounded-2xl border overflow-hidden ${isDraft ? "border-amber-200" : "border-gray-100"}`}
							>
								<div className="flex flex-col sm:flex-row gap-4 p-4">
									<div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
										{ev.coverImageUrl && (
											<Image
												src={
													ev.coverImageUrl
												}
												alt={
													ev.title
												}
												fill
												className="object-cover"
												sizes="112px"
											/>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-2 mb-1">
											<p className="text-base font-semibold text-gray-900 leading-tight truncate">
												{
													ev.title
												}
											</p>
											<span
												className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${status.class}`}
											>
												{
													status.label
												}
											</span>
										</div>
										<p className="text-xs text-gray-500 mb-1 truncate">
											{orgName} ·{" "}
											{ev.city ??
												"—"}
										</p>
										<p className="text-xs text-gray-400 mb-3">
											{format(
												new Date(
													ev.startDatetime,
												),
												"d MMMM yyyy",
												{
													locale: fr,
												},
											)}{" "}
											·{" "}
											{categoryName}
										</p>
										<div className="flex items-center gap-4 text-xs text-gray-500">
											{/* TODO: ticketsSold aggregate endpoint not yet available */}
											<span>
												<span className="font-semibold text-gray-400">
													—
												</span>{" "}
												billets
											</span>
											{/* TODO: revenue aggregate endpoint not yet available */}
											<span>
												<span className="font-semibold text-gray-400">
													—
												</span>{" "}
												FCFA
											</span>
											<span className="ml-auto">
												Capacité{" "}
												<span className="font-semibold text-gray-700">
													{
														ev.capacity
													}
												</span>
											</span>
										</div>
									</div>
								</div>

								{(isDraft || isPublished) && (
									<div className="px-4 pb-4 flex items-center gap-2 flex-wrap">
										{isDraft && (
											<>
												<button
													type="button"
													onClick={() =>
														setPending(
															{
																event: ev,
																nextStatus:
																	"PUBLISHED",
																verb: "approuvé",
															},
														)
													}
													className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-full text-xs font-semibold hover:bg-emerald-600 transition-colors"
												>
													<CheckCircle
														size={
															13
														}
													/>{" "}
													Approuver
												</button>
												<button
													type="button"
													onClick={() =>
														setPending(
															{
																event: ev,
																nextStatus:
																	"REJECTED",
																verb: "rejeté",
															},
														)
													}
													className="flex items-center gap-1.5 px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-full text-xs font-semibold hover:bg-red-50 transition-colors"
												>
													<XCircle
														size={
															13
														}
													/>{" "}
													Rejeter
												</button>
											</>
										)}
										{isPublished && (
											<button
												type="button"
												onClick={() =>
													setPending(
														{
															event: ev,
															nextStatus:
																"SUSPENDED",
															verb: "suspendu",
														},
													)
												}
												className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-50 transition-colors"
											>
												<ShieldOff
													size={
														13
													}
												/>{" "}
												Suspendre
											</button>
										)}
										<a
											href={`/events/${ev.slug}`}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-semibold hover:bg-gray-50 transition-colors ml-auto"
										>
											<Eye
												size={
													13
												}
											/>{" "}
											Voir
										</a>
									</div>
								)}
							</div>
						);
					})
				)}
			</motion.div>

			{/* Pagination */}
			{!isLoading && totalPages > 1 && (
				<div className="flex items-center justify-between text-xs">
					<p className="text-gray-500">
						Page {page} sur {totalPages}
					</p>
					<div className="flex gap-1">
						<button
							type="button"
							onClick={() =>
								setPage((p) =>
									Math.max(1, p - 1),
								)
							}
							disabled={page <= 1 || isFetching}
							className="p-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
						>
							<ChevronLeft size={16} />
						</button>
						<button
							type="button"
							onClick={() =>
								setPage((p) =>
									Math.min(
										totalPages,
										p + 1,
									),
								)
							}
							disabled={
								page >= totalPages || isFetching
							}
							className="p-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
						>
							<ChevronRight size={16} />
						</button>
					</div>
				</div>
			)}

			<AlertDialog
				open={!!pending}
				onOpenChange={(open) => !open && setPending(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{pending?.nextStatus ===
								"PUBLISHED" &&
								"Approuver cet événement ?"}
							{pending?.nextStatus === "REJECTED" &&
								"Rejeter cet événement ?"}
							{pending?.nextStatus ===
								"SUSPENDED" &&
								"Suspendre cet événement ?"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{pending
								? `«${pending.event.title}» passera au statut «${STATUS_CONFIG[pending.nextStatus].label}».`
								: ""}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isUpdating}>
							Annuler
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirm}
							disabled={isUpdating}
							className={
								pending?.nextStatus ===
								"PUBLISHED"
									? "bg-emerald-500 hover:bg-emerald-600 text-white"
									: pending?.nextStatus ===
										  "REJECTED"
										? "bg-red-500 hover:bg-red-600 text-white"
										: "bg-gray-700 hover:bg-gray-800 text-white"
							}
						>
							{isUpdating
								? "Mise à jour…"
								: "Confirmer"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
