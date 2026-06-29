"use client";

import { useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	CheckCircle,
	Clock,
	Download,
	Loader2,
	MapPin,
	Share2,
	Ticket,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import BottomNav from "@/components/BottomNav";
import { EventTicket } from "@/components/ticket/EventTicket";
import { assetUrl, formatPrice } from "@/lib/utils";
import { downloadTicketsPdf } from "@/lib/pdf";
import { useGetOrderByIdQuery } from "@/store/api/order/order.api";
import type { OrderTicket } from "@/store/api/order/order.type";

const TICKET_STATUS_STYLES: Record<
	string,
	{ label: string; cls: string; Icon: typeof CheckCircle }
> = {
	VALID: { label: "Valide", cls: "bg-emerald-500 text-white", Icon: CheckCircle },
	USED: { label: "Utilisé", cls: "bg-gray-500 text-white", Icon: XCircle },
	PENDING: { label: "En attente", cls: "bg-amber-500 text-white", Icon: Clock },
	CANCELLED: { label: "Annulé", cls: "bg-red-500 text-white", Icon: XCircle },
	REFUNDED: { label: "Remboursé", cls: "bg-blue-500 text-white", Icon: XCircle },
};

export default function TicketDetailPage() {
	const params = useParams();
	const router = useRouter();
	const orderId = params?.id as string;
	const qrRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

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
						Billet introuvable
					</p>
					<p className="text-sm text-gray-500 mb-6">
						Ce billet n&apos;existe pas ou a été supprimé.
					</p>
					<button
						type="button"
						onClick={() => router.push("/tickets")}
						className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90"
					>
						Retour aux billets
					</button>
				</div>
			</div>
		);
	}

	const event = order.event;
	const tickets = (order.tickets ?? []) as OrderTicket[];
	const eventDate = event?.startDatetime
		? format(new Date(event.startDatetime), "EEEE d MMMM yyyy", { locale: fr })
		: "—";
	const eventTime = event?.startDatetime
		? format(new Date(event.startDatetime), "HH:mm")
		: "—";
	const eventLocation =
		event?.city || event?.address || (event?.isOnline ? "En ligne" : "—");
	const buyerName = [order.buyerFirstName, order.buyerLastName]
		.filter(Boolean)
		.join(" ")
		.trim();
	const typeNameById = new Map(
		(event?.ticketTypes ?? []).map((t) => [t.id, t.name] as const),
	);

	const handleShare = () => {
		if (typeof navigator !== "undefined" && navigator.share) {
			navigator
				.share({
					title: event?.title ?? "Mon billet",
					text: `Mon billet pour ${event?.title ?? "cet événement"}`,
					url: window.location.href,
				})
				.catch(() => {});
		} else if (typeof navigator !== "undefined") {
			navigator.clipboard.writeText(window.location.href);
			toast.success("Lien copié dans le presse-papiers");
		}
	};
	const handleDownload = () => {
		const qrImages: Record<string, string> = {};
		for (const [id, canvas] of Object.entries(qrRefs.current)) {
			if (canvas) {
				try {
					qrImages[id] = canvas.toDataURL("image/png");
				} catch {
					/* tainted canvas — skip QR for this ticket */
				}
			}
		}
		void downloadTicketsPdf(order, qrImages);
	};

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
						Détails du billet
					</h1>
				</div>
			</header>

			<div className="max-w-lg mx-auto px-4 py-6 space-y-4">
				{/* Event card */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
				>
					{event?.coverImageUrl && (
						<div className="relative h-44">
							<Image
								src={assetUrl(event.coverImageUrl)}
								alt={event.title}
								fill
								className="object-cover"
								sizes="(max-width: 512px) 100vw, 512px"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
							<div className="absolute bottom-4 left-4 right-4">
								<p className="font-bold text-lg text-white mb-0.5">
									{event.title}
								</p>
								<p className="text-white/80 text-sm">{eventLocation}</p>
							</div>
						</div>
					)}

					<div className="p-5 space-y-3">
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
								<Calendar size={16} className="text-primary" />
							</div>
							<div>
								<p className="text-xs text-gray-400">Date</p>
								<p className="text-sm font-semibold text-gray-900 capitalize">
									{eventDate}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
								<Clock size={16} className="text-blue-500" />
							</div>
							<div>
								<p className="text-xs text-gray-400">Heure</p>
								<p className="text-sm font-semibold text-gray-900">
									{eventTime}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
								<MapPin size={16} className="text-purple-500" />
							</div>
							<div>
								<p className="text-xs text-gray-400">Lieu</p>
								<p className="text-sm font-semibold text-gray-900">
									{eventLocation}
								</p>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Tickets */}
				{tickets.length === 0 ? (
					<div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
						<Ticket size={36} className="mx-auto text-gray-200 mb-3" />
						<p className="text-sm text-gray-500">
							Aucun billet n&apos;a encore été émis pour cette commande.
						</p>
					</div>
				) : (
					tickets.map((ticket, index) => {
						const statusMeta =
							TICKET_STATUS_STYLES[ticket.status as string] ??
							TICKET_STATUS_STYLES.PENDING;
						const holder = [ticket.holderFirstName, ticket.holderLastName]
							.filter(Boolean)
							.join(" ")
							.trim();
						return (
							<motion.section
								key={ticket.id}
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.05 + index * 0.05 }}
								className="space-y-2"
							>
								<div className="flex items-center justify-between px-1">
									<p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
										Billet {index + 1} / {tickets.length}
									</p>
									<span
										className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusMeta.cls}`}
									>
										<statusMeta.Icon size={12} />
										{statusMeta.label}
									</span>
								</div>

								<EventTicket
									title={event?.title ?? "Événement"}
									dateLabel={eventDate.toUpperCase()}
									timeLabel={eventTime}
									locationName={
										event?.city ?? (event?.isOnline ? "En ligne" : null)
									}
									locationLines={event?.address ? [event.address] : []}
									typeLabel={
										typeNameById.get(ticket.ticketTypeId) ?? "Entrée"
									}
									ticketNumber={ticket.ticketNumber}
									qrValue={ticket.qrCode}
									qrRef={(el) => {
										qrRefs.current[ticket.id] = el;
									}}
								/>

								{(holder || buyerName) && (
									<p className="text-xs text-gray-500 px-1">
										Détenteur :{" "}
										<span className="font-medium text-gray-700">
											{holder || buyerName}
										</span>
										{ticket.holderEmail ? ` · ${ticket.holderEmail}` : ""}
									</p>
								)}
							</motion.section>
						);
					})
				)}

				{/* Order summary */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.15 }}
					className="bg-white rounded-2xl border border-gray-100 p-5"
				>
					<div className="flex items-center justify-between mb-3">
						<div>
							<p className="text-xs text-gray-400 mb-0.5">Commande</p>
							<p className="font-mono font-bold text-gray-900 text-sm">
								#{order.id.slice(-8).toUpperCase()}
							</p>
						</div>
						<p className="text-lg font-bold text-primary">
							{formatPrice(Number(order.totalAmount))}
						</p>
					</div>
					<p className="text-xs text-gray-500">
						Acheté le{" "}
						{format(
							new Date(order.createdAt),
							"d MMMM yyyy 'à' HH:mm",
							{ locale: fr },
						)}
					</p>
				</motion.div>

				{/* Actions */}
				<div className="grid grid-cols-2 gap-3">
					<button
						type="button"
						onClick={handleDownload}
						className="bg-white border border-gray-200 text-gray-700 py-3.5 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm"
					>
						<Download size={17} /> Télécharger
					</button>
					<button
						type="button"
						onClick={handleShare}
						className="bg-white border border-gray-200 text-gray-700 py-3.5 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm"
					>
						<Share2 size={17} /> Partager
					</button>
				</div>
			</div>

			<BottomNav />
		</div>
	);
}
