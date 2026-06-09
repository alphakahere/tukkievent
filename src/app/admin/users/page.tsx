"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, MoreVertical, UserCheck, UserX, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import {
	useListUsersQuery,
	useAdminUpdateUserMutation,
} from "@/store/api/users/users.api";
import type { User, UserStatus } from "@/store/api/users/users.type";
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

const STATUS_LABELS: Record<UserStatus, { label: string; class: string }> = {
	ACTIVE: { label: "Actif", class: "bg-emerald-50 text-emerald-600" },
	INACTIVE: { label: "Inactif", class: "bg-gray-100 text-gray-500" },
	SUSPENDED: { label: "Suspendu", class: "bg-amber-50 text-amber-600" },
};

const STATUS_FILTERS: ("ALL" | UserStatus)[] = ["ALL", "ACTIVE", "INACTIVE", "SUSPENDED"];
const PAGE_SIZE = 20;

type PendingAction = {
	user: User;
	nextStatus: UserStatus;
	verb: string;
};

function UserActions({
	user,
	onPick,
}: {
	user: User;
	onPick: (next: PendingAction) => void;
}) {
	const [open, setOpen] = useState(false);

	const items: { label: string; status: UserStatus; verb: string; icon: React.ReactNode }[] = [];
	if (user.status !== "ACTIVE") {
		items.push({
			label: "Activer",
			status: "ACTIVE",
			verb: "activer",
			icon: <UserCheck size={14} />,
		});
	}
	if (user.status === "ACTIVE") {
		items.push({
			label: "Suspendre",
			status: "SUSPENDED",
			verb: "suspendre",
			icon: <UserX size={14} />,
		});
	}

	if (items.length === 0) return null;

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
			>
				<MoreVertical size={16} />
			</button>
			{open && (
				<>
					<div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
					<div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-gray-200 shadow-sm z-20 py-1">
						{items.map((a) => (
							<button
								key={a.status}
								type="button"
								onClick={() => {
									onPick({ user, nextStatus: a.status, verb: a.verb });
									setOpen(false);
								}}
								className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors"
							>
								{a.icon}
								{a.label}
							</button>
						))}
					</div>
				</>
			)}
		</div>
	);
}

function useDebounced<T>(value: T, delay = 300) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const t = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(t);
	}, [value, delay]);
	return debounced;
}

export default function AdminUsersPage() {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<"ALL" | UserStatus>("ALL");
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

	const { data, isLoading, isFetching } = useListUsersQuery(queryParams);
	const [adminUpdateUser, { isLoading: isUpdating }] = useAdminUpdateUserMutation();

	const users = data?.data ?? [];
	const total = data?.meta.total ?? 0;
	const totalPages = data?.meta.totalPages ?? 1;

	const handleConfirm = async () => {
		if (!pending) return;
		const { user, nextStatus, verb } = pending;
		try {
			await adminUpdateUser({ id: user.id, patch: { status: nextStatus } }).unwrap();
			toast.success(`Utilisateur ${verb}`);
			setPending(null);
		} catch (err) {
			toast.error(getApiErrorMessage(err, `Impossible de ${verb} l'utilisateur`));
			setPending(null);
		}
	};

	return (
		<div className="p-4 lg:p-6 space-y-4">
			<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
				<p className="text-2xl font-bold text-gray-900">Utilisateurs</p>
				<p className="text-sm text-gray-500 mt-0.5">
					{isLoading ? "Chargement…" : `${total} compte${total !== 1 ? "s" : ""} enregistré${total !== 1 ? "s" : ""}`}
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
					<Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="search"
						placeholder="Rechercher un utilisateur…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
					/>
				</div>
				<div className="flex gap-2 flex-wrap">
					{STATUS_FILTERS.map((s) => (
						<button
							key={s}
							type="button"
							onClick={() => setStatusFilter(s)}
							className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap ${
								statusFilter === s
									? "bg-gray-900 text-white border-gray-900"
									: "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
							}`}
						>
							{s === "ALL" ? "Tous" : STATUS_LABELS[s].label}
						</button>
					))}
				</div>
			</motion.div>

			{/* Table */}
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
			>
				{/* Desktop table header */}
				<div className="hidden md:grid grid-cols-[1fr_1fr_100px_80px_80px_40px] gap-4 px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
					<span>Utilisateur</span>
					<span>Email</span>
					<span>Commandes</span>
					<span>Dépensé</span>
					<span>Statut</span>
					<span />
				</div>

				<div className={`divide-y divide-gray-100 ${isFetching && !isLoading ? "opacity-60" : ""}`}>
					{isLoading ? (
						<p className="px-5 py-8 text-sm text-gray-400 text-center">Chargement…</p>
					) : users.length === 0 ? (
						<p className="px-5 py-8 text-sm text-gray-400 text-center">Aucun utilisateur trouvé</p>
					) : (
						users.map((user) => {
							const initials = `${user.firstname[0] ?? ""}${user.lastname[0] ?? ""}`.toUpperCase();
							const status = STATUS_LABELS[user.status];
							const isOrganizer = user.roles.includes("ORGANIZER");
							return (
								<div
									key={user.id}
									className="px-5 py-3.5 flex flex-col md:grid md:grid-cols-[1fr_1fr_100px_80px_80px_40px] md:items-center gap-2 md:gap-4"
								>
									<div className="flex items-center gap-3">
										<div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
											{initials || "?"}
										</div>
										<div>
											<p className="text-sm font-semibold text-gray-900">
												{user.firstname} {user.lastname}
											</p>
											<p className="text-xs text-gray-400 md:hidden">{user.email}</p>
											<p className="text-xs text-gray-400">
												Inscrit {format(new Date(user.createdAt), "d MMM yyyy", { locale: fr })}
												{isOrganizer && (
													<span className="ml-2 text-violet-600 font-semibold">Organisateur</span>
												)}
											</p>
										</div>
									</div>
									<p className="hidden md:block text-sm text-gray-500 truncate">{user.email}</p>
									{/* TODO: ordersCount aggregate endpoint not yet available on the backend */}
									<p className="hidden md:block text-sm text-gray-400">—</p>
									{/* TODO: totalSpent aggregate endpoint not yet available on the backend */}
									<p className="hidden md:block text-sm text-gray-400">—</p>
									<div className="flex items-center gap-2 md:block">
										<span
											className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.class}`}
										>
											{status.label}
										</span>
									</div>
									<div className="flex justify-end">
										<UserActions user={user} onPick={setPending} />
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* Pagination */}
				{!isLoading && totalPages > 1 && (
					<div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs">
						<p className="text-gray-500">
							Page {page} sur {totalPages}
						</p>
						<div className="flex gap-1">
							<button
								type="button"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page <= 1 || isFetching}
								className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
							>
								<ChevronLeft size={16} />
							</button>
							<button
								type="button"
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page >= totalPages || isFetching}
								className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
							>
								<ChevronRight size={16} />
							</button>
						</div>
					</div>
				)}
			</motion.div>

			<AlertDialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{pending?.nextStatus === "SUSPENDED"
								? "Suspendre cet utilisateur ?"
								: "Activer cet utilisateur ?"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{pending
								? `${pending.user.firstname} ${pending.user.lastname} (${pending.user.email}) passera au statut «${STATUS_LABELS[pending.nextStatus].label}».`
								: ""}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isUpdating}>Annuler</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirm}
							disabled={isUpdating}
							className={
								pending?.nextStatus === "SUSPENDED"
									? "bg-amber-500 hover:bg-amber-600 text-white"
									: "bg-emerald-500 hover:bg-emerald-600 text-white"
							}
						>
							{isUpdating ? "Mise à jour…" : "Confirmer"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
