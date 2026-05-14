"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	Download,
	Loader2,
	Mail,
	MapPin,
	Phone,
	User,
	XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { formatPrice } from "@/lib/utils";
import { useGetOrderByIdQuery } from "@/store/api/order/order.api";
import type { OrderTicket } from "@/store/api/order/order.type";

const STATUS_META: Record<
	string,
	{ label: string; cls: string; Icon: typeof CheckCircle }
> = {
	PENDING: { label: "En attente", cls: "bg-amber-50 text-amber-700", Icon: Clock },
	PAID: { label: "Confirmée", cls: "bg-emerald-50 text-emerald-700", Icon: CheckCircle },
	FAILED: { label: "Échouée", cls: "bg-red-50 text-red-700", Icon: XCircle },
	CANCELLED: { label: "Annulée", cls: "bg-gray-100 text-gray-500", Icon: XCircle },
	REFUNDED: { label: "Remboursée", cls: "bg-blue-50 text-blue-700", Icon: XCircle },
};

export default function OrderDetailPage() {
	const params = useParams();
	const router = useRouter();
	const orderId = params?.orderId as string;

	const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId, {
		skip: !orderId,
	});

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4">
				<Loader2 size={28} className="text-primary animate-spin" />
			</div>
		);
	}

	if (isError || !order) {
		return (
			<div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4">
				<div className="text-center">
					<AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
					<p className="text-xl font-bold text-gray-900 mb-2">
						Commande introuvable
					</p>
					<p className="text-sm text-gray-500 mb-6">
						Cette commande n&apos;existe pas ou a été supprimée.
					</p>
					<button
						type="button"
						onClick={() => router.push("/history")}
						className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90"
					>
						Retour à l&apos;historique
					</button>
				</div>
			</div>
		);
	}

	const status = STATUS_META[order.status as string] ?? STATUS_META.PENDING;
	const event = order.event;
	const tickets = (order.tickets ?? []) as OrderTicket[];
	const purchaseDate = format(
		new Date(order.createdAt),
		"d MMMM yyyy 'à' HH:mm",
		{ locale: fr },
	);
	const eventDate = event?.startDatetime
		? format(new Date(event.startDatetime), "d MMMM yyyy", { locale: fr })
		: null;
	const eventLocation = event?.city || event?.address || null;
	const buyerName = [order.buyerFirstName, order.buyerLastName]
		.filter(Boolean)
		.join(" ")
		.trim();

	// Group tickets by ticketTypeId so we can show "Standard × 2" style lines.
	const groups = new Map<string, { name: string; quantity: number }>();
	for (const t of tickets) {
		const key = t.ticketTypeId;
		const existing = groups.get(key);
		if (existing) {
			existing.quantity += 1;
		} else {
			groups.set(key, { name: t.ticketTypeId, quantity: 1 });
		}
	}

	const handleDownload = () =>
		toast.info("Téléchargement du reçu bientôt disponible");

	return (
		<div className="min-h-screen bg-[#F7F7F7] pb-24">
			<header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-40">
				<div className="max-w-lg mx-auto flex items-center gap-3">
					<button
						type="button"
						onClick={() => router.back()}
						className="p-2 rounded-full hover:bg-gray-100 transition-colors"
					>
						<ArrowLeft size={20} className="text-gray-700" />
					</button>
					<h1 className="text-xl font-bold text-gray-900">
						Détails de la commande
					</h1>
				</div>
			</header>

			<div className="max-w-lg mx-auto px-4 py-6 space-y-4">
				{/* Status */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white rounded-2xl p-5 border border-gray-100"
				>
					<div className="flex items-center justify-between mb-3">
						<div>
							<p className="text-xs text-gray-400 mb-0.5">
								Numéro de commande
							</p>
							<p className="font-mono font-bold text-gray-900 text-sm">
								#{order.id.slice(-8).toUpperCase()}
							</p>
						</div>
						<div
							className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${status.cls}`}
						>
							<status.Icon size={14} />
							{status.label}
						</div>
					</div>
					<p className="text-sm text-gray-500">Acheté le {purchaseDate}</p>
					{order.paidAt && (
						<p className="text-xs text-gray-400 mt-1">
							Payé le{" "}
							{format(new Date(order.paidAt), "d MMM yyyy 'à' HH:mm", {
								locale: fr,
							})}
						</p>
					)}
				</motion.div>

				{/* Event */}
				{event && (
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.05 }}
						className="bg-white rounded-2xl p-5 border border-gray-100"
					>
						<p className="text-base font-semibold text-gray-900 mb-4">
							Événement
						</p>
						<p className="text-sm font-bold text-gray-900 mb-3">
							{event.title}
						</p>
						<div className="space-y-3">
							{eventDate && (
								<div className="flex items-center gap-3">
									<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
										<Calendar size={16} className="text-primary" />
									</div>
									<span className="text-sm text-gray-700">{eventDate}</span>
								</div>
							)}
							{eventLocation && (
								<div className="flex items-center gap-3">
									<div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
										<MapPin size={16} className="text-purple-500" />
									</div>
									<span className="text-sm text-gray-700">
										{eventLocation}
									</span>
								</div>
							)}
						</div>
					</motion.div>
				)}

				{/* Tickets breakdown */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
				>
					<div className="px-5 py-4 border-b border-gray-100">
						<p className="text-base font-semibold text-gray-900">Billets</p>
					</div>
					<div className="divide-y divide-gray-100">
						{tickets.length === 0 ? (
							<p className="px-5 py-4 text-sm text-gray-500">
								Aucun billet sur cette commande.
							</p>
						) : (
							Array.from(groups.values()).map((g, idx) => (
								<div
									key={idx}
									className="px-5 py-4 flex items-center justify-between"
								>
									<p className="text-sm font-semibold text-gray-900">
										Billet × {g.quantity}
									</p>
								</div>
							))
						)}
					</div>
					<div className="px-5 py-4 bg-gray-50 grid grid-cols-2 gap-2 border-t border-gray-100">
						<p className="text-xs text-gray-500">Sous-total</p>
						<p className="text-xs text-gray-700 text-right">
							{formatPrice(Number(order.subtotal))}
						</p>
						<p className="text-xs text-gray-500">Frais de service</p>
						<p className="text-xs text-gray-700 text-right">
							{formatPrice(Number(order.fees))}
						</p>
						<p className="text-sm font-bold text-gray-900">Total</p>
						<p className="text-sm font-bold text-primary text-right">
							{formatPrice(Number(order.totalAmount))}
						</p>
					</div>
				</motion.div>

				{/* Buyer */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.15 }}
					className="bg-white rounded-2xl p-5 border border-gray-100"
				>
					<p className="text-base font-semibold text-gray-900 mb-4">Acheteur</p>
					<div className="space-y-3">
						{buyerName && (
							<Row icon={User} color="#FF6B35" bg="#FFF1EC" value={buyerName} />
						)}
						{order.buyerEmail && (
							<Row icon={Mail} color="#004E89" bg="#EFF6FF" value={order.buyerEmail} />
						)}
						{order.buyerPhone && (
							<Row icon={Phone} color="#8B5CF6" bg="#F5F3FF" value={order.buyerPhone} />
						)}
						{order.paymentMethod && (
							<Row
								icon={CreditCard}
								color="#10B981"
								bg="#ECFDF5"
								value={order.paymentMethod}
							/>
						)}
					</div>
				</motion.div>

				<motion.button
					type="button"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					onClick={handleDownload}
					className="w-full bg-white border border-gray-200 text-gray-700 py-4 px-6 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
				>
					<Download size={18} />
					Télécharger le reçu
				</motion.button>
			</div>

			<BottomNav />
		</div>
	);
}

function Row({
	icon: Icon,
	color,
	bg,
	value,
}: {
	icon: typeof User;
	color: string;
	bg: string;
	value: string;
}) {
	return (
		<div className="flex items-center gap-3">
			<div
				className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
				style={{ backgroundColor: bg }}
			>
				<Icon size={16} style={{ color }} />
			</div>
			<span className="text-sm text-gray-700">{value}</span>
		</div>
	);
}
