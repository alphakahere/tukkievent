"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
	CheckCircle,
	Clock,
	Download,
	Loader2,
	Mail,
	MessageCircle,
	User,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { getApiErrorMessage } from "@/store/api/auth/error";
import { useResendTicketEmailMutation } from "@/store/api/tickets/tickets.api";
import type { Attendee } from "@/store/api/tickets/tickets.type";
import type { EventResource } from "@/store/api/event/event.resource.type";
import { downloadAttendeeTicketPdf } from "@/lib/pdf";

const STATUS_STYLES: Record<
	string,
	{ label: string; cls: string; Icon: typeof CheckCircle }
> = {
	VALID: { label: "Valide", cls: "bg-emerald-500 text-white", Icon: CheckCircle },
	USED: { label: "Enregistré", cls: "bg-gray-500 text-white", Icon: XCircle },
	PENDING: { label: "En attente", cls: "bg-amber-500 text-white", Icon: Clock },
	CANCELLED: { label: "Annulé", cls: "bg-red-500 text-white", Icon: XCircle },
	REFUNDED: { label: "Remboursé", cls: "bg-blue-500 text-white", Icon: XCircle },
};

interface ViewTicketSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	attendee: Attendee | null;
	event: EventResource;
}

export function ViewTicketSheet({
	open,
	onOpenChange,
	attendee,
	event,
}: ViewTicketSheetProps) {
	const qrRef = useRef<HTMLCanvasElement | null>(null);
	const [resendEmail, { isLoading: resending }] = useResendTicketEmailMutation();

	const handleResend = async () => {
		if (!attendee?.holderEmail) return;
		try {
			await resendEmail({ eventId: event.id, ticketId: attendee.id }).unwrap();
			toast.success("Billet envoyé par email");
		} catch (err) {
			toast.error(getApiErrorMessage(err, "Impossible d'envoyer le billet"));
		}
	};

	const handleDownload = () => {
		if (!attendee) return;
		let qrPng: string | undefined;
		if (qrRef.current) {
			try {
				qrPng = qrRef.current.toDataURL("image/png");
			} catch {
				/* tainted canvas — skip QR in the PDF */
			}
		}
		downloadAttendeeTicketPdf(event, attendee, qrPng);
	};

	const handleWhatsApp = () => {
		if (!attendee?.holderPhone) return;
		const digits = attendee.holderPhone.replace(/\D/g, "");
		if (!digits) return;
		const ticketUrl = `${window.location.origin}/tickets/${attendee.order.id}`;
		const lines = [
			`Bonjour ${attendee.holderFirstName ?? ""},`.trim(),
			`Voici votre billet pour ${event.title}.`,
			attendee.ticketNumber ? `Numéro : ${attendee.ticketNumber}` : "",
			ticketUrl,
		].filter(Boolean);
		const text = encodeURIComponent(lines.join("\n"));
		window.open(
			`https://wa.me/${digits}?text=${text}`,
			"_blank",
			"noopener,noreferrer",
		);
	};

	const status = attendee
		? (STATUS_STYLES[attendee.status] ?? STATUS_STYLES.PENDING)
		: null;
	const holder = attendee
		? [attendee.holderFirstName, attendee.holderLastName]
				.filter(Boolean)
				.join(" ")
				.trim()
		: "";

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="flex flex-col w-full sm:max-w-md p-0">
				<SheetHeader className="border-b border-gray-100 px-6 py-4">
					<SheetTitle>Billet du participant</SheetTitle>
					<SheetDescription>
						QR code et détails du billet émis.
					</SheetDescription>
				</SheetHeader>

				{attendee && status && (
					<div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
						<div className="flex items-center justify-between gap-3">
							<p className="text-sm font-semibold text-gray-900 truncate">
								{event.title}
							</p>
							<span
								className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${status.cls}`}
							>
								<status.Icon size={12} /> {status.label}
							</span>
						</div>

						<div className="text-center">
							<div className="w-52 h-52 mx-auto bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center p-4">
								{attendee.qrCode ? (
									<QRCodeCanvas
										ref={(el) => {
											qrRef.current = el;
										}}
										value={attendee.qrCode}
										size={184}
										level="H"
										marginSize={2}
									/>
								) : (
									<p className="text-xs text-gray-400">QR en attente</p>
								)}
							</div>
							{attendee.ticketNumber && (
								<div className="mt-3 bg-gray-50 rounded-xl p-3">
									<p className="text-xs text-gray-400 mb-0.5">
										Numéro de billet
									</p>
									<p className="font-mono font-bold text-gray-900 text-sm">
										{attendee.ticketNumber}
									</p>
								</div>
							)}
						</div>

						<div className="bg-gray-50 rounded-2xl p-4 space-y-2">
							<p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
								Détenteur
							</p>
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
									<User size={16} className="text-primary" />
								</div>
								<div className="min-w-0">
									<p className="text-sm font-semibold text-gray-900 truncate">
										{holder || "—"}
									</p>
									{attendee.holderEmail && (
										<p className="text-xs text-gray-500 truncate">
											{attendee.holderEmail}
										</p>
									)}
									{attendee.holderPhone && (
										<p className="text-xs text-gray-500">
											{attendee.holderPhone}
										</p>
									)}
								</div>
							</div>
							<p className="text-xs text-gray-500 pt-1">
								{attendee.ticketType.name}
							</p>
						</div>
					</div>
				)}

				<SheetFooter className="border-t border-gray-100 flex-col gap-2 p-4">
					<button
						type="button"
						onClick={handleDownload}
						disabled={!attendee}
						className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
					>
						<Download size={16} /> Télécharger le billet (PDF)
					</button>
					<div className="grid grid-cols-2 gap-2">
						<button
							type="button"
							onClick={handleResend}
							disabled={resending || !attendee?.holderEmail}
							className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
						>
							{resending ? (
								<Loader2 size={16} className="animate-spin" />
							) : (
								<Mail size={16} />
							)}
							Renvoyer
						</button>
						<button
							type="button"
							onClick={handleWhatsApp}
							disabled={!attendee?.holderPhone}
							className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
						>
							<MessageCircle size={16} /> WhatsApp
						</button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
