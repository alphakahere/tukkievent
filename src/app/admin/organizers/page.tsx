"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import {
	useListOrganizationsQuery,
	useDeleteOrganizationMutation,
} from "@/store/api/organizations/organizations.api";
import type { Organization } from "@/store/api/organizations/organizations.type";
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

const PAGE_SIZE = 12;

function useDebounced<T>(value: T, delay = 300) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const t = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(t);
	}, [value, delay]);
	return debounced;
}

export default function AdminOrganizersPage() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [toDelete, setToDelete] = useState<Organization | null>(null);

	const debouncedSearch = useDebounced(search, 300);

	useEffect(() => {
		setPage(1);
	}, [debouncedSearch]);

	const queryParams = useMemo(
		() => ({
			page,
			limit: PAGE_SIZE,
			...(debouncedSearch ? { q: debouncedSearch } : {}),
		}),
		[page, debouncedSearch],
	);

	const { data, isLoading, isFetching } =
		useListOrganizationsQuery(queryParams);
	const [deleteOrganization, { isLoading: isDeleting }] =
		useDeleteOrganizationMutation();

	const orgs = data?.data ?? [];
	const total = data?.meta.total ?? 0;
	const totalPages = data?.meta.totalPages ?? 1;

	const handleConfirmDelete = async () => {
		if (!toDelete) return;
		const name = toDelete.name;
		try {
			await deleteOrganization(toDelete.id).unwrap();
			toast.success(`Organisateur «${name}» supprimé`);
			setToDelete(null);
		} catch (err) {
			toast.error(
				getApiErrorMessage(
					err,
					"Impossible de supprimer : événements ou codes promo encore actifs.",
				),
			);
			setToDelete(null);
		}
	};

	return (
		<div className="p-4 lg:p-6 space-y-4">
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<p className="text-2xl font-bold text-gray-900">
					Organisateurs
				</p>
				<p className="text-sm text-gray-500 mt-0.5">
					{isLoading
						? "Chargement…"
						: `${total} organisateur${total !== 1 ? "s" : ""} enregistré${total !== 1 ? "s" : ""}`}
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
						type="text"
						placeholder="Rechercher un organisateur…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
					/>
				</div>
			</motion.div>

			{/* Cards grid */}
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ${isFetching && !isLoading ? "opacity-60" : ""}`}
			>
				{isLoading ? (
					<p className="col-span-full text-sm text-gray-400 text-center py-8">
						Chargement…
					</p>
				) : orgs.length === 0 ? (
					<p className="col-span-full text-sm text-gray-400 text-center py-8">
						Aucun organisateur trouvé
					</p>
				) : (
					orgs.map((org) => (
						<div
							key={org.id}
							className="bg-white rounded-2xl border border-gray-100 p-5"
						>
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3 min-w-0">
									<div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
										{org.name
											.charAt(0)
											.toUpperCase()}
									</div>
									<div className="min-w-0">
										<p className="text-sm font-semibold text-gray-900 truncate">
											{org.name}
										</p>
										<p className="text-xs text-gray-400 font-mono truncate">
											{org.slug}
										</p>
									</div>
								</div>
								<button
									type="button"
									onClick={() =>
										setToDelete(org)
									}
									disabled={isDeleting}
									className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-rose-500 transition-colors disabled:opacity-50 shrink-0"
									title="Supprimer"
								>
									<Trash2 size={15} />
								</button>
							</div>

							<div className="grid grid-cols-2 gap-3 mb-4">
								<div className="bg-gray-50 rounded-xl p-3 text-center">
									{/* TODO: eventsCount aggregate endpoint not yet available */}
									<p className="text-lg font-bold text-gray-400">
										—
									</p>
									<p className="text-xs text-gray-400">
										Événements
									</p>
								</div>
								<div className="bg-gray-50 rounded-xl p-3 text-center">
									{/* TODO: totalRevenue aggregate endpoint not yet available */}
									<p className="text-lg font-bold text-gray-400">
										—
									</p>
									<p className="text-xs text-gray-400">
										Revenus (FCFA)
									</p>
								</div>
							</div>

							<div className="flex items-center justify-between">
								{org.primaryEventType ? (
									<span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-600">
										{
											org.primaryEventType
										}
									</span>
								) : (
									<span />
								)}
								<p className="text-xs text-gray-400">
									Depuis{" "}
									{format(
										new Date(
											org.createdAt,
										),
										"MMM yyyy",
										{ locale: fr },
									)}
								</p>
							</div>
						</div>
					))
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
				open={!!toDelete}
				onOpenChange={(open) => !open && setToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Supprimer cet organisateur ?
						</AlertDialogTitle>
						<AlertDialogDescription>
							{toDelete
								? `«${toDelete.name}» sera supprimé définitivement. La suppression échouera si des événements ou codes promo y sont rattachés.`
								: ""}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>
							Annuler
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							disabled={isDeleting}
							className="bg-red-500 hover:bg-red-600 text-white"
						>
							{isDeleting
								? "Suppression…"
								: "Supprimer"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
