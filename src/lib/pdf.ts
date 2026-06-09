import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatPrice } from "./utils";
import type { Order, OrderTicket } from "@/store/api/order/order.type";
import type { TicketType } from "@/store/api/event/event.type";
import type { Attendee } from "@/store/api/tickets/tickets.type";
import type { EventResource } from "@/store/api/event/event.resource.type";

// A4 in points (jsPDF default "pt" unit).
const PAGE_W = 595.28;
const MARGIN = 48;

// Brand palette (matches the app primary / secondary).
const PRIMARY: [number, number, number] = [255, 107, 53];
const INK: [number, number, number] = [17, 24, 39];
const MUTED: [number, number, number] = [107, 114, 128];
const LINE: [number, number, number] = [229, 231, 235];

const shortId = (id: string) => `#${id.slice(-8).toUpperCase()}`;

function drawHeader(doc: jsPDF, subtitle: string): number {
	doc.setFillColor(...PRIMARY);
	doc.rect(0, 0, PAGE_W, 96, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(22);
	doc.text("Tukki Event", MARGIN, 50);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(12);
	doc.text(subtitle, MARGIN, 72);
	return 132; // y cursor below the band
}

function sectionTitle(doc: jsPDF, text: string, y: number): number {
	doc.setTextColor(...MUTED);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(9);
	doc.text(text.toUpperCase(), MARGIN, y);
	return y + 8;
}

function divider(doc: jsPDF, y: number): number {
	doc.setDrawColor(...LINE);
	doc.setLineWidth(1);
	doc.line(MARGIN, y, PAGE_W - MARGIN, y);
	return y + 16;
}

/** Left label / right value row. Returns the next y. */
function row(
	doc: jsPDF,
	label: string,
	value: string,
	y: number,
	opts: { bold?: boolean; valueColor?: [number, number, number] } = {},
): number {
	doc.setFont("helvetica", "normal");
	doc.setFontSize(11);
	doc.setTextColor(...MUTED);
	doc.text(label, MARGIN, y);
	doc.setFont("helvetica", opts.bold ? "bold" : "normal");
	doc.setTextColor(...(opts.valueColor ?? INK));
	doc.text(value, PAGE_W - MARGIN, y, { align: "right" });
	return y + 18;
}

function buyerName(order: Order): string {
	return [order.buyerFirstName, order.buyerLastName]
		.filter(Boolean)
		.join(" ")
		.trim();
}

function eventLine(order: Order): {
	title: string;
	date: string | null;
	location: string | null;
} {
	const e = order.event;
	return {
		title: e?.title ?? "Événement",
		date: e?.startDatetime
			? format(new Date(e.startDatetime), "EEEE d MMMM yyyy 'à' HH:mm", {
					locale: fr,
				})
			: null,
		location: e?.city || e?.address || (e?.isOnline ? "En ligne" : null),
	};
}

/**
 * Generates a downloadable PDF receipt for a paid/created order.
 */
export function downloadOrderReceiptPdf(
	order: Order,
	ticketTypes: TicketType[] = [],
): void {
	const doc = new jsPDF({ unit: "pt", format: "a4" });
	let y = drawHeader(doc, "Reçu de commande");

	// Order meta
	const created = format(new Date(order.createdAt), "d MMMM yyyy 'à' HH:mm", {
		locale: fr,
	});
	y = row(doc, "Numéro de commande", shortId(order.id), y, { bold: true });
	y = row(doc, "Date", created, y);
	if (order.paymentMethod) y = row(doc, "Paiement", order.paymentMethod, y);
	y += 8;
	y = divider(doc, y);

	// Event
	const ev = eventLine(order);
	y = sectionTitle(doc, "Événement", y);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(13);
	doc.setTextColor(...INK);
	y += 6;
	doc.text(ev.title, MARGIN, y);
	y += 18;
	doc.setFont("helvetica", "normal");
	doc.setFontSize(11);
	doc.setTextColor(...MUTED);
	if (ev.date) {
		doc.text(ev.date, MARGIN, y);
		y += 16;
	}
	if (ev.location) {
		doc.text(ev.location, MARGIN, y);
		y += 16;
	}
	y += 8;
	y = divider(doc, y);

	// Ticket lines (grouped by ticket type)
	y = sectionTitle(doc, "Billets", y);
	y += 10;
	const tickets = (order.tickets ?? []) as OrderTicket[];
	const groups = new Map<
		string,
		{ name: string; quantity: number; unitPrice: number }
	>();
	for (const t of tickets) {
		const existing = groups.get(t.ticketTypeId);
		if (existing) {
			existing.quantity += 1;
		} else {
			const tt = ticketTypes.find((x) => x.id === t.ticketTypeId);
			groups.set(t.ticketTypeId, {
				name: tt?.name ?? "Billet",
				quantity: 1,
				unitPrice: tt?.price ?? 0,
			});
		}
	}
	if (groups.size === 0) {
		y = row(doc, "Aucun billet émis", "", y);
	} else {
		for (const g of groups.values()) {
			y = row(
				doc,
				`${g.name} × ${g.quantity}`,
				formatPrice(g.unitPrice * g.quantity),
				y,
			);
		}
	}
	y += 6;
	y = divider(doc, y);

	// Totals
	y = row(doc, "Sous-total", formatPrice(Number(order.subtotal)), y);
	y = row(doc, "Frais de service", formatPrice(Number(order.fees)), y);
	y = row(doc, "Total", formatPrice(Number(order.totalAmount)), y, {
		bold: true,
		valueColor: PRIMARY,
	});
	y += 8;
	y = divider(doc, y);

	// Buyer
	y = sectionTitle(doc, "Acheteur", y);
	y += 10;
	const name = buyerName(order);
	if (name) y = row(doc, "Nom", name, y);
	if (order.buyerEmail) y = row(doc, "E-mail", order.buyerEmail, y);
	if (order.buyerPhone) y = row(doc, "Téléphone", order.buyerPhone, y);

	// Footer
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.setTextColor(...MUTED);
	doc.text(
		"Merci pour votre achat sur Tukki Event.",
		PAGE_W / 2,
		800,
		{ align: "center" },
	);

	doc.save(`recu-${order.id.slice(-8).toUpperCase()}.pdf`);
}

/**
 * Generates a downloadable PDF holding one page per ticket, with the QR code.
 * `qrImages` maps ticket id -> PNG data URL (read from a rendered canvas).
 */
export function downloadTicketsPdf(
	order: Order,
	qrImages: Record<string, string> = {},
): void {
	const doc = new jsPDF({ unit: "pt", format: "a4" });
	const tickets = (order.tickets ?? []) as OrderTicket[];
	const ev = eventLine(order);

	const list = tickets.length > 0 ? tickets : [null];

	list.forEach((ticket, index) => {
		if (index > 0) doc.addPage();
		let y = drawHeader(doc, "Billet électronique");

		// Event
		doc.setFont("helvetica", "bold");
		doc.setFontSize(15);
		doc.setTextColor(...INK);
		doc.text(ev.title, MARGIN, y);
		y += 22;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(11);
		doc.setTextColor(...MUTED);
		if (ev.date) {
			doc.text(ev.date, MARGIN, y);
			y += 16;
		}
		if (ev.location) {
			doc.text(ev.location, MARGIN, y);
			y += 16;
		}
		y += 10;
		y = divider(doc, y);

		if (!ticket) {
			doc.setTextColor(...MUTED);
			doc.setFontSize(11);
			doc.text("Aucun billet n'a encore été émis pour cette commande.", MARGIN, y);
			return;
		}

		// QR code
		const qr = ticket.qrCode ? qrImages[ticket.id] : undefined;
		const qrSize = 200;
		const qrX = (PAGE_W - qrSize) / 2;
		if (qr) {
			doc.addImage(qr, "PNG", qrX, y, qrSize, qrSize);
			y += qrSize + 12;
			doc.setFontSize(9);
			doc.setTextColor(...MUTED);
			doc.text("Présentez ce QR code à l'entrée", PAGE_W / 2, y, {
				align: "center",
			});
			y += 24;
		} else {
			doc.setFontSize(11);
			doc.setTextColor(...MUTED);
			doc.text("QR code en attente", PAGE_W / 2, y + 40, { align: "center" });
			y += 80;
		}

		y = divider(doc, y);

		// Ticket details
		if (ticket.ticketNumber) {
			y = row(doc, "Numéro de billet", ticket.ticketNumber, y, { bold: true });
		}
		const holder = [ticket.holderFirstName, ticket.holderLastName]
			.filter(Boolean)
			.join(" ")
			.trim();
		if (holder || buyerName(order)) {
			y = row(doc, "Détenteur", holder || buyerName(order), y);
		}
		if (ticket.holderEmail) y = row(doc, "E-mail", ticket.holderEmail, y);
		y = row(doc, "Commande", shortId(order.id), y);
		y = row(doc, "Billet", `${index + 1} / ${tickets.length}`, y);
	});

	doc.save(`billet-${order.id.slice(-8).toUpperCase()}.pdf`);
}

const ATTENDEE_STATUS_LABELS: Record<string, string> = {
	VALID: "Valide",
	USED: "Enregistré",
	PENDING: "En attente",
	CANCELLED: "Annulé",
	REFUNDED: "Remboursé",
};

/**
 * Generates a single-page PDF ticket for one organizer-side attendee.
 * `qrImage` is a PNG data URL read from a rendered QR canvas (optional).
 */
export function downloadAttendeeTicketPdf(
	event: EventResource,
	attendee: Attendee,
	qrImage?: string,
): void {
	const doc = new jsPDF({ unit: "pt", format: "a4" });
	let y = drawHeader(doc, "Billet électronique");

	// Event
	doc.setFont("helvetica", "bold");
	doc.setFontSize(15);
	doc.setTextColor(...INK);
	doc.text(event.title, MARGIN, y);
	y += 22;
	doc.setFont("helvetica", "normal");
	doc.setFontSize(11);
	doc.setTextColor(...MUTED);
	const date = event.startDatetime
		? format(new Date(event.startDatetime), "EEEE d MMMM yyyy 'à' HH:mm", {
				locale: fr,
			})
		: null;
	const location =
		event.city || event.address || (event.isOnline ? "En ligne" : null);
	if (date) {
		doc.text(date, MARGIN, y);
		y += 16;
	}
	if (location) {
		doc.text(location, MARGIN, y);
		y += 16;
	}
	y += 10;
	y = divider(doc, y);

	// QR code
	const qrSize = 200;
	const qrX = (PAGE_W - qrSize) / 2;
	if (qrImage) {
		doc.addImage(qrImage, "PNG", qrX, y, qrSize, qrSize);
		y += qrSize + 12;
		doc.setFontSize(9);
		doc.setTextColor(...MUTED);
		doc.text("Présentez ce QR code à l'entrée", PAGE_W / 2, y, {
			align: "center",
		});
		y += 24;
	} else {
		doc.setFontSize(11);
		doc.setTextColor(...MUTED);
		doc.text("QR code en attente", PAGE_W / 2, y + 40, { align: "center" });
		y += 80;
	}
	y = divider(doc, y);

	// Details
	if (attendee.ticketNumber) {
		y = row(doc, "Numéro de billet", attendee.ticketNumber, y, { bold: true });
	}
	const holder = [attendee.holderFirstName, attendee.holderLastName]
		.filter(Boolean)
		.join(" ")
		.trim();
	if (holder) y = row(doc, "Détenteur", holder, y);
	if (attendee.holderEmail) y = row(doc, "E-mail", attendee.holderEmail, y);
	if (attendee.holderPhone) y = row(doc, "Téléphone", attendee.holderPhone, y);
	y = row(doc, "Type de billet", attendee.ticketType.name, y);
	y = row(
		doc,
		"Statut",
		ATTENDEE_STATUS_LABELS[attendee.status] ?? attendee.status,
		y,
	);

	const fileTag = attendee.ticketNumber ?? attendee.id.slice(-8).toUpperCase();
	doc.save(`billet-${fileTag}.pdf`);
}
