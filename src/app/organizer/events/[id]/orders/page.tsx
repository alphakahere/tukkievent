"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import {
	AlertCircle,
	ChevronLeft,
	ChevronRight,
	Loader2,
	Mail,
	Phone,
	RotateCcw,
	Search,
	Wallet,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { getApiErrorMessage } from "@/store/api/auth/error";
import {
	useGetEventOrdersStatsQuery,
	useListEventOrdersQuery,
	useRefundOrderMutation,
} from "@/store/api/order/order.api";
import {
	OrderStatus,
	type OrderListItem,
	type RefundOrderInput,
} from "@/store/api/order/order.type";
import { useEvent } from "../layout";

const PAGE_SIZE = 20;

const STATUS_LABELS: Record<OrderStatus | string, string> = {
	[OrderStatus.PENDING]: "En attente",
	[OrderStatus.PAID]: "Payée",
	[OrderStatus.FAILED]: "Échouée",
	[OrderStatus.CANCELLED]: "Annulée",
	[OrderStatus.REFUNDED]: "Remboursée",
};

const STATUS_STYLES: Record<OrderStatus | string, string> = {
	[OrderStatus.PENDING]: "bg-amber-50 text-amber-700",
	[OrderStatus.PAID]: "bg-emerald-50 text-emerald-700",
	[OrderStatus.FAILED]: "bg-red-50 text-red-700",
	[OrderStatus.CANCELLED]: "bg-gray-100 text-gray-500",
	[OrderStatus.REFUNDED]: "bg-blue-50 text-blue-700",
};

function useDebounced<T>(value: T, delay = 300): T {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const t = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(t);
	}, [value, delay]);
	return debounced;
}

function buyerName(o: OrderListItem): string {
	const parts = [o.buyerFirstName, o.buyerLastName].filter(Boolean);
	return parts.join(" ").trim() || o.buyerEmail || "—";
}

function buyerInitials(o: OrderListItem): string {
	const first = o.buyerFirstName?.[0] ?? "";
	const last = o.buyerLastName?.[0] ?? "";
	const seed = (first + last).toUpperCase();
	if (seed) return seed;
	return (o.buyerEmail?.[0] ?? "?").toUpperCase();
}

export default function OrdersPage() {
	const event = useEvent();
	const eventId = event.id;

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
	const [page, setPage] = useState(1);
	const debouncedQuery = useDebounced(searchQuery, 300);

	useEffect(() => {
		setPage(1);
	}, [debouncedQuery, statusFilter]);

	const listParams = useMemo(
		() => ({
			page,
			limit: PAGE_SIZE,
			...(debouncedQuery.trim() && { q: debouncedQuery.trim() }),
			...(statusFilter !== "ALL" && { status: statusFilter }),
		}),
		[page, debouncedQuery, statusFilter],
	);

	const {
		data: ordersPage,
		isLoading: ordersLoading,
		isFetching: ordersFetching,
		error: ordersError,
	} = useListEventOrdersQuery({ eventId, params: listParams });

	const { data: stats } = useGetEventOrdersStatsQuery(eventId);

	const orders = ordersPage?.data ?? [];
	const totalPages = ordersPage?.meta.totalPages ?? 1;
	const total = ordersPage?.meta.total ?? 0;

	return (
		<div className="space-y-6">
			{/* Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
				<StatCard
					label="Revenu"
					value={stats ? formatPrice(stats.revenue) : "—"}
					accent="text-emerald-600"
				/>
				<StatCard
					label="Billets vendus"
					value={stats ? String(stats.soldTickets) : "—"}
				/>
				<StatCard
					label="Commandes payées"
					value={stats ? String(stats.paidOrders) : "—"}
					accent="text-emerald-600"
				/>
				<StatCard
					label="En attente"
					value={stats ? String(stats.pendingOrders) : "—"}
					accent="text-amber-600"
				/>
			</div>

			{/* Filters */}
			<div className="flex gap-3 flex-col sm:flex-row">
				<div className="relative flex-1">
					<Search
						size={16}
						className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
					/>
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Rechercher par email, nom, référence..."
						className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
					/>
				</div>
				<select
					value={statusFilter}
					onChange={(e) =>
						setStatusFilter(e.target.value as OrderStatus | "ALL")
					}
					className="px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
				>
					<option value="ALL">Tous les statuts</option>
					<option value={OrderStatus.PAID}>Payées</option>
					<option value={OrderStatus.PENDING}>En attente</option>
					<option value={OrderStatus.FAILED}>Échouées</option>
					<option value={OrderStatus.CANCELLED}>Annulées</option>
					<option value={OrderStatus.REFUNDED}>Remboursées</option>
				</select>
			</div>

			{/* Orders table */}
			<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
				<div className="hidden md:grid md:grid-cols-[1.4fr_1fr_90px_110px_120px_140px_64px] gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
					<span>Acheteur</span>
					<span>Contact</span>
					<span>Billets</span>
					<span>Statut</span>
					<span>Montant</span>
					<span>Date</span>
					<span className="text-right">Actions</span>
				</div>

				{ordersError ? (
					<div className="p-10 text-center">
						<AlertCircle size={40} className="mx-auto text-red-300 mb-3" />
						<p className="text-gray-700 font-medium mb-1">
							Impossible de charger les commandes
						</p>
						<p className="text-sm text-gray-500">
							{getApiErrorMessage(ordersError, "Réessayez dans un instant")}
						</p>
					</div>
				) : ordersLoading ? (
					<div className="p-10 text-center">
						<Loader2
							size={28}
							className="mx-auto text-primary animate-spin mb-3"
						/>
						<p className="text-sm text-gray-500">Chargement des commandes…</p>
					</div>
				) : orders.length === 0 ? (
					<div className="p-10 text-center">
						<Wallet size={40} className="mx-auto text-gray-300 mb-3" />
						<p className="text-gray-500">Aucune commande trouvée</p>
					</div>
				) : (
					<ul
						className={`divide-y divide-gray-100 ${ordersFetching ? "opacity-60 transition-opacity" : ""}`}
					>
						{orders.map((order, index) => (
							<OrderRow
								key={order.id}
								order={order}
								index={index}
								eventId={eventId}
							/>
						))}
					</ul>
				)}

				{/* Pagination */}
				{ordersPage && totalPages > 1 && (
					<div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50">
						<p className="text-xs text-gray-500">
							Page {ordersPage.meta.page} sur {totalPages} · {total} commande
							{total > 1 ? "s" : ""}
						</p>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page <= 1 || ordersFetching}
								aria-label="Page précédente"
								className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
							>
								<ChevronLeft size={16} />
							</button>
							<button
								type="button"
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page >= totalPages || ordersFetching}
								aria-label="Page suivante"
								className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
							>
								<ChevronRight size={16} />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function StatCard({
	label,
	value,
	accent,
}: {
	label: string;
	value: string;
	accent?: string;
}) {
	return (
		<div className="bg-white rounded-2xl border border-gray-100 p-4">
			<p className={`text-2xl font-bold ${accent ?? "text-gray-900"}`}>
				{value}
			</p>
			<p className="text-xs font-medium text-gray-500 mt-0.5">{label}</p>
		</div>
	);
}

function OrderRow({
	order,
	index,
	eventId,
}: {
	order: OrderListItem;
	index: number;
	eventId: string;
}) {
	const [refundOpen, setRefundOpen] = useState(false);
	const date = format(new Date(order.createdAt), "d MMM yyyy 'à' HH:mm", {
		locale: fr,
	});
	const status = order.status as OrderStatus | string;
	const canRefund = status === OrderStatus.PAID;

	return (
		<motion.li
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: index * 0.02 }}
			className="p-4 md:px-6 md:py-3.5 md:grid md:grid-cols-[1.4fr_1fr_90px_110px_120px_140px_64px] md:gap-4 md:items-center"
		>
			{/* Mobile layout */}
			<div className="md:hidden space-y-2">
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-3 min-w-0">
						<div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">
							{buyerInitials(order)}
						</div>
						<div className="min-w-0">
							<p className="font-semibold text-gray-900 text-sm truncate">
								{buyerName(order)}
							</p>
							<p className="text-xs text-gray-500 truncate">
								{order.buyerEmail ?? "—"}
							</p>
						</div>
					</div>
					<StatusBadge status={status} />
				</div>
				<div className="flex items-center justify-between text-xs">
					<span className="text-gray-500">
						{order.ticketCount} billet{order.ticketCount > 1 ? "s" : ""} · {date}
					</span>
					<span className="font-semibold text-gray-900">
						{formatPrice(order.totalAmount)}
					</span>
				</div>
				{order.paymentReference && (
					<p className="text-xs text-gray-400 font-mono truncate">
						{order.paymentReference}
					</p>
				)}
				{canRefund && (
					<button
						type="button"
						onClick={() => setRefundOpen(true)}
						className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
					>
						<RotateCcw size={13} />
						Rembourser
					</button>
				)}
			</div>

			{/* Desktop layout */}
			<div className="hidden md:flex items-center gap-3 min-w-0">
				<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">
					{buyerInitials(order)}
				</div>
				<div className="min-w-0">
					<p className="font-semibold text-gray-900 text-sm truncate">
						{buyerName(order)}
					</p>
					{order.paymentReference && (
						<p className="text-xs text-gray-400 font-mono truncate">
							{order.paymentReference}
						</p>
					)}
				</div>
			</div>
			<div className="hidden md:block min-w-0 text-xs text-gray-500 space-y-0.5">
				{order.buyerEmail && (
					<p className="flex items-center gap-1.5 truncate">
						<Mail size={11} className="text-gray-400 shrink-0" />
						<span className="truncate">{order.buyerEmail}</span>
					</p>
				)}
				{order.buyerPhone && (
					<p className="flex items-center gap-1.5 truncate">
						<Phone size={11} className="text-gray-400 shrink-0" />
						<span className="truncate">{order.buyerPhone}</span>
					</p>
				)}
				{!order.buyerEmail && !order.buyerPhone && <span>—</span>}
			</div>
			<p className="hidden md:block text-sm font-semibold text-gray-700">
				{order.ticketCount}
			</p>
			<div className="hidden md:block">
				<StatusBadge status={status} />
			</div>
			<div className="hidden md:block">
				<p className="text-sm font-semibold text-gray-900">
					{formatPrice(order.totalAmount)}
				</p>
				{order.paidAmount > 0 && order.paidAmount !== order.totalAmount && (
					<p className="text-xs text-emerald-600">
						Payé {formatPrice(order.paidAmount)}
					</p>
				)}
			</div>
			<p className="hidden md:block text-xs text-gray-500">{date}</p>
			<div className="hidden md:flex md:justify-end">
				{canRefund && (
					<button
						type="button"
						onClick={() => setRefundOpen(true)}
						title="Rembourser"
						aria-label="Rembourser la commande"
						className="p-1.5 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
					>
						<RotateCcw size={15} />
					</button>
				)}
			</div>

			{canRefund && (
				<RefundDialog
					order={order}
					eventId={eventId}
					open={refundOpen}
					onOpenChange={setRefundOpen}
				/>
			)}
		</motion.li>
	);
}

function RefundDialog({
	order,
	eventId,
	open,
	onOpenChange,
}: {
	order: OrderListItem;
	eventId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [refund, { isLoading }] = useRefundOrderMutation();
	const [amount, setAmount] = useState("");
	const [reason, setReason] = useState("");

	const submit = async () => {
		const trimmedAmount = amount.trim();
		const body: RefundOrderInput = {};
		if (trimmedAmount) {
			const parsed = Number(trimmedAmount);
			if (!Number.isFinite(parsed) || parsed <= 0) {
				toast.error("Montant invalide");
				return;
			}
			if (parsed > order.totalAmount) {
				toast.error("Le montant dépasse le total de la commande");
				return;
			}
			body.amount = parsed;
		}
		if (reason.trim()) body.reason = reason.trim();

		try {
			const res = await refund({ eventId, orderId: order.id, body }).unwrap();
			toast.success(
				res.fullyRefunded
					? "Commande remboursée"
					: `Remboursement de ${formatPrice(res.amount)} effectué`,
			);
			onOpenChange(false);
			setAmount("");
			setReason("");
		} catch (err) {
			toast.error(getApiErrorMessage(err, "Le remboursement a échoué"));
		}
	};

	return (
		<Dialog open={open} onOpenChange={(next) => !isLoading && onOpenChange(next)}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rembourser la commande</DialogTitle>
					<DialogDescription>
						Total de la commande : {formatPrice(order.totalAmount)}. Laissez le
						montant vide pour un remboursement total.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-1.5">
						<label
							htmlFor="refund-amount"
							className="text-sm font-medium text-gray-700"
						>
							Montant (optionnel)
						</label>
						<input
							id="refund-amount"
							type="number"
							min={1}
							max={order.totalAmount}
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder={`Total : ${order.totalAmount}`}
							className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
						/>
					</div>
					<div className="space-y-1.5">
						<label
							htmlFor="refund-reason"
							className="text-sm font-medium text-gray-700"
						>
							Motif (optionnel)
						</label>
						<textarea
							id="refund-reason"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							rows={3}
							maxLength={500}
							placeholder="Raison du remboursement…"
							className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
						/>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
					>
						Annuler
					</Button>
					<Button variant="destructive" onClick={submit} disabled={isLoading}>
						{isLoading && <Loader2 size={16} className="mr-2 animate-spin" />}
						Rembourser
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function StatusBadge({ status }: { status: OrderStatus | string }) {
	const label = STATUS_LABELS[status] ?? status;
	const className = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";
	return (
		<span
			className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}
		>
			{label}
		</span>
	);
}
