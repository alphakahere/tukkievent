import type { Currency, TicketStatus } from "../event/event.type";
import type { PaginationParams } from "../types";

export interface AttendeeTicketType {
	id: string;
	name: string;
	price: string;
	currency: Currency;
}

export interface AttendeeOrder {
	id: string;
	buyerEmail: string | null;
	buyerFirstName: string | null;
	buyerLastName: string | null;
	createdAt: string;
}

export interface AttendeeScanner {
	id: string;
	firstname: string;
	lastname: string;
}

export interface Attendee {
	id: string;
	ticketNumber: string | null;
	qrCode: string | null;
	holderFirstName: string | null;
	holderLastName: string | null;
	holderEmail: string | null;
	holderPhone: string | null;
	status: TicketStatus;
	usedAt: string | null;
	ticketType: AttendeeTicketType;
	scannedBy: AttendeeScanner | null;
	order: AttendeeOrder;
}

export interface AttendeeStats {
	total: number;
	checkedIn: number;
	pending: number;
}

export interface ListAttendeesParams extends PaginationParams {
	q?: string;
	status?: TicketStatus;
	ticketTypeId?: string;
}

export interface CheckInPayload {
	ticketId: string;
	checkedIn: boolean;
}

export interface CheckInByQrPayload {
	eventId: string;
	qrCode: string;
	checkedIn?: boolean;
}

export interface CheckInResult {
	attendee: Attendee;
	alreadyCheckedIn: boolean;
}

export interface AddAttendeePayload {
	eventId: string;
	ticketTypeId: string;
	quantity?: number;
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	sendEmail?: boolean;
}

export interface AddAttendeeResult {
	id: string;
	tickets: { id: string }[];
}

export interface ResendTicketEmailPayload {
	// eventId is carried for future cache-tag invalidation, mirroring CheckInPayload.
	eventId: string;
	ticketId: string;
}

export interface ResendTicketEmailResult {
	queued: boolean;
}
