import { GState, jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { assetUrl, formatPrice } from "./utils";
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

// ---- Landscape "ticket" rendering (matches the on-screen EventTicket) ------

const TICKET_FORMAT: [number, number] = [740, 300];
const SURFACE: [number, number, number] = [247, 248, 250];
const WHITE: [number, number, number] = [255, 255, 255];
// Auth-page hero treatment: dark navy wash + light text over the cover image.
const DARK_NAVY: [number, number, number] = [2, 19, 42];
const DARK_TINT: [number, number, number] = [0, 78, 137];
const LIGHT_MUTED: [number, number, number] = [203, 213, 225];

interface LoadedImage {
	dataUrl: string;
	w: number;
	h: number;
}

interface TicketData {
	eventTitle: string;
	dateLabel: string;
	timeLabel: string;
	locationName?: string | null;
	locationLines?: string[];
	typeLabel: string;
	ticketNumber?: string | null;
	qrImage?: string;
	cover?: LoadedImage | null;
}

/**
 * Loads an image URL into a JPEG data URL (+ natural size) for embedding in the
 * PDF. Resolves to null on any failure (network, or a cross-origin/tainted
 * canvas) so the ticket still renders without the background.
 */
function loadImage(url: string): Promise<LoadedImage | null> {
	return new Promise((resolve) => {
		if (typeof window === "undefined") {
			resolve(null);
			return;
		}
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			try {
				const canvas = document.createElement("canvas");
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					resolve(null);
					return;
				}
				ctx.drawImage(img, 0, 0);
				resolve({
					dataUrl: canvas.toDataURL("image/jpeg", 0.85),
					w: img.naturalWidth,
					h: img.naturalHeight,
				});
			} catch {
				resolve(null);
			}
		};
		img.onerror = () => resolve(null);
		img.src = url;
	});
}

function startLabels(startISO?: string | null): { date: string; time: string } {
	if (!startISO) return { date: "—", time: "—" };
	const d = new Date(startISO);
	return {
		date: format(d, "EEEE d MMMM yyyy", { locale: fr }).toUpperCase(),
		time: format(d, "HH:mm"),
	};
}

/** Truncate `text` with an ellipsis so it fits within `maxW` at the current font. */
function clip(doc: jsPDF, text: string, maxW: number): string {
	if (doc.getTextWidth(text) <= maxW) return text;
	let t = text;
	while (t.length > 1 && doc.getTextWidth(`${t}…`) > maxW) t = t.slice(0, -1);
	return `${t}…`;
}

/** Draws one landscape ticket filling the current page. */
function drawTicket(doc: jsPDF, data: TicketData): void {
	const [pageW, pageH] = TICKET_FORMAT;

	// Surface behind the ticket so the perforation notches read as cut-outs.
	doc.setFillColor(...SURFACE);
	doc.rect(0, 0, pageW, pageH, "F");

	const m = 18;
	const card = { x: m, y: m, w: pageW - 2 * m, h: pageH - 2 * m, r: 16 };

	// White card.
	doc.setFillColor(...WHITE);
	doc.roundedRect(card.x, card.y, card.w, card.h, card.r, card.r, "F");

	const stubW = 180;
	const stubX = card.x + card.w - stubW;

	// Event cover fills the full-height left panel (aligned with the stub) with
	// the auth-page dark hero treatment (navy wash + warm tint) so light text
	// reads over it. Cover-fit, clipped to the card's rounded left corners (a
	// white hairline stroke hides the clip outline).
	const onDark = Boolean(data.cover);
	if (data.cover) {
		const boxW = stubX - card.x;
		const boxH = card.h;
		doc.saveGraphicsState();
		doc.setDrawColor(...WHITE);
		doc.setLineWidth(0.1);
		doc.roundedRect(card.x, card.y, card.w, card.h, card.r, card.r);
		doc.clip();
		doc.discardPath();
		// Cover-fit: fill the panel on both axes, cropping the overflow.
		const scale = Math.max(boxW / data.cover.w, boxH / data.cover.h);
		const dw = data.cover.w * scale;
		const dh = data.cover.h * scale;
		doc.addImage(
			data.cover.dataUrl,
			"JPEG",
			card.x + (boxW - dw) / 2,
			card.y + (boxH - dh) / 2,
			dw,
			dh,
		);
		doc.setGState(new GState({ opacity: 0.86 }));
		doc.setFillColor(...DARK_NAVY);
		doc.rect(card.x, card.y, boxW, boxH, "F");
		doc.setGState(new GState({ opacity: 0.16 }));
		doc.setFillColor(...DARK_TINT);
		doc.rect(card.x, card.y, boxW, boxH, "F");
		doc.restoreGraphicsState();
	}

	const titleColor = onDark ? WHITE : INK;
	const mutedColor = onDark ? LIGHT_MUTED : MUTED;

	// Orange stub — rounded right corners, squared on the seam side.
	doc.setFillColor(...PRIMARY);
	doc.roundedRect(stubX, card.y, stubW, card.h, card.r, card.r, "F");
	doc.rect(stubX, card.y, card.r, card.h, "F");

	// Perforation: dashed line + two surface-colored notches at the seam ends.
	doc.setDrawColor(...WHITE);
	doc.setLineWidth(1.5);
	doc.setLineDashPattern([3, 3], 0);
	doc.line(stubX, card.y + 8, stubX, card.y + card.h - 8);
	doc.setLineDashPattern([], 0);
	doc.setFillColor(...SURFACE);
	doc.circle(stubX, card.y, 8, "F");
	doc.circle(stubX, card.y + card.h, 8, "F");

	// ---- Main panel ----
	const mx = card.x + 28;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(16);
	doc.setTextColor(...titleColor);
	doc.text("Tukkievent", mx, card.y + 38);

	doc.setFontSize(7);
	doc.setTextColor(...PRIMARY);
	doc.text("VOS ÉVÉNEMENTS, NOTRE PASSION", mx, card.y + 52);

	doc.setFontSize(24);
	doc.setTextColor(...titleColor);
	doc.text("TICKET", mx, card.y + 98);
	const headW = doc.getTextWidth("TICKET ");
	doc.setTextColor(...PRIMARY);
	doc.text("D'ENTRÉE", mx + headW, card.y + 98);

	doc.setFontSize(13);
	doc.setTextColor(...titleColor);
	doc.text(clip(doc, data.eventTitle, stubX - mx - 16), mx, card.y + 126);

	doc.setFontSize(11);
	doc.text(data.dateLabel, mx, card.y + 154);
	doc.text(data.timeLabel, mx, card.y + 176);
	let ly = card.y + 198;
	if (data.locationName) {
		doc.text(clip(doc, data.locationName.toUpperCase(), stubX - mx - 16), mx, ly);
		ly += 18;
	}
	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	doc.setTextColor(...mutedColor);
	(data.locationLines ?? []).forEach((line) => {
		doc.text(clip(doc, line, stubX - mx - 16), mx, ly);
		ly += 14;
	});

	doc.setFont("helvetica", "bold");
	doc.setFontSize(7);
	doc.setTextColor(...mutedColor);
	doc.text("PLUS D'INFOS SUR", mx, card.y + card.h - 30);
	doc.setFontSize(10);
	doc.setTextColor(...PRIMARY);
	doc.text("WWW.TUKKIEVENT.COM", mx, card.y + card.h - 16);

	// ---- Stub ----
	const cx = stubX + stubW / 2;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(9);
	const badge = clip(doc, (data.typeLabel || "Entrée").toUpperCase(), stubW - 44);
	const badgeW = doc.getTextWidth(badge) + 24;
	doc.setDrawColor(...WHITE);
	doc.setLineWidth(1);
	doc.roundedRect(cx - badgeW / 2, card.y + 22, badgeW, 22, 6, 6, "S");
	doc.setTextColor(...WHITE);
	doc.text(badge, cx, card.y + 37, { align: "center" });

	const qrBox = 116;
	const qrY = card.y + 58;
	doc.setFillColor(...WHITE);
	doc.roundedRect(cx - qrBox / 2, qrY, qrBox, qrBox, 8, 8, "F");
	if (data.qrImage) {
		const inner = qrBox - 16;
		doc.addImage(data.qrImage, "PNG", cx - inner / 2, qrY + 8, inner, inner);
	} else {
		doc.setFontSize(8);
		doc.setTextColor(...MUTED);
		doc.text("QR en attente", cx, qrY + qrBox / 2, { align: "center" });
	}

	doc.setDrawColor(...WHITE);
	doc.setLineDashPattern([3, 3], 0);
	doc.setLineWidth(1);
	doc.line(stubX + 20, qrY + qrBox + 18, stubX + stubW - 20, qrY + qrBox + 18);
	doc.setLineDashPattern([], 0);

	if (data.ticketNumber) {
		doc.setFont("helvetica", "bold");
		doc.setFontSize(8);
		doc.setTextColor(...WHITE);
		doc.text("NUMÉRO DE BILLET", cx, qrY + qrBox + 44, { align: "center" });
		doc.setFontSize(16);
		doc.text(`N° ${data.ticketNumber}`, cx, qrY + qrBox + 64, {
			align: "center",
		});
	}
}

/**
 * Generates a downloadable PDF holding one landscape ticket per page.
 * `qrImages` maps ticket id -> PNG data URL (read from a rendered canvas).
 */
export async function downloadTicketsPdf(
	order: Order,
	qrImages: Record<string, string> = {},
): Promise<void> {
	const tickets = (order.tickets ?? []) as OrderTicket[];
	const list = tickets.length > 0 ? tickets : [null];
	const ev = order.event;
	const { date, time } = startLabels(ev?.startDatetime);
	const locationName =
		ev?.city || (ev?.isOnline ? "En ligne" : null) || ev?.address || null;
	const locationLines = ev?.city && ev?.address ? [ev.address] : [];
	const typeNameById = new Map(
		(ev?.ticketTypes ?? []).map((t) => [t.id, t.name] as const),
	);
	const cover = ev?.coverImageUrl
		? await loadImage(assetUrl(ev.coverImageUrl))
		: null;

	const doc = new jsPDF({
		unit: "pt",
		format: TICKET_FORMAT,
		orientation: "landscape",
	});
	list.forEach((ticket, index) => {
		if (index > 0) doc.addPage(TICKET_FORMAT, "landscape");
		drawTicket(doc, {
			eventTitle: ev?.title ?? "Événement",
			dateLabel: date,
			timeLabel: time,
			locationName,
			locationLines,
			typeLabel: ticket
				? (typeNameById.get(ticket.ticketTypeId) ?? "Entrée")
				: "Entrée",
			ticketNumber: ticket?.ticketNumber ?? null,
			qrImage: ticket?.qrCode ? qrImages[ticket.id] : undefined,
			cover,
		});
	});

	doc.save(`billet-${order.id.slice(-8).toUpperCase()}.pdf`);
}

/**
 * Generates a single landscape PDF ticket for one organizer-side attendee.
 * `qrImage` is a PNG data URL read from a rendered QR canvas (optional).
 */
export async function downloadAttendeeTicketPdf(
	event: EventResource,
	attendee: Attendee,
	qrImage?: string,
): Promise<void> {
	const { date, time } = startLabels(event.startDatetime);
	const locationName =
		event.city || (event.isOnline ? "En ligne" : null) || event.address || null;
	const locationLines = event.city && event.address ? [event.address] : [];
	const cover = event.coverImageUrl
		? await loadImage(assetUrl(event.coverImageUrl))
		: null;

	const doc = new jsPDF({
		unit: "pt",
		format: TICKET_FORMAT,
		orientation: "landscape",
	});
	drawTicket(doc, {
		eventTitle: event.title,
		dateLabel: date,
		timeLabel: time,
		locationName,
		locationLines,
		typeLabel: attendee.ticketType.name,
		ticketNumber: attendee.ticketNumber,
		qrImage,
		cover,
	});

	const fileTag = attendee.ticketNumber ?? attendee.id.slice(-8).toUpperCase();
	doc.save(`billet-${fileTag}.pdf`);
}
