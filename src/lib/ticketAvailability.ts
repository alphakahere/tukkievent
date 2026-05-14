import type { TicketType } from "@/store/api/event/event.type";

export type TicketAvailability =
	| { kind: "ok"; cap: number; min: number; remaining: number | undefined }
	| { kind: "sold_out" }
	| { kind: "not_started"; from: Date }
	| { kind: "ended" }
	| { kind: "hidden" };

export function getTicketAvailability(
	tt: TicketType,
	now: Date = new Date(),
): TicketAvailability {
	if (tt.isVisible === false) return { kind: "hidden" };
	if (tt.saleStartDatetime) {
		const start = new Date(tt.saleStartDatetime);
		if (start.getTime() > now.getTime()) return { kind: "not_started", from: start };
	}
	if (tt.saleEndDatetime) {
		const end = new Date(tt.saleEndDatetime);
		if (end.getTime() < now.getTime()) return { kind: "ended" };
	}
	const remaining = tt.availableQuantity ?? tt.totalQuantity;
	if (remaining !== undefined && remaining <= 0) return { kind: "sold_out" };
	const cap = Math.max(1, Math.min(tt.maxPurchase ?? 10, remaining ?? 99));
	const min = Math.max(1, tt.minPurchase ?? 1);
	return { kind: "ok", cap, min, remaining };
}

export function hasAnyBuyableTicket(
	tickets: TicketType[] | undefined,
	now: Date = new Date(),
): boolean {
	if (!tickets || tickets.length === 0) return false;
	return tickets.some((t) => getTicketAvailability(t, now).kind === "ok");
}
