import type { Currency, Event, Ticket, TicketStatus } from "../event/event.type";

export enum OrderStatus {
	PENDING = "PENDING",
	PAID = "PAID",
	FAILED = "FAILED",
	CANCELLED = "CANCELLED",
	REFUNDED = "REFUNDED",
}

export type PaymentMethod =
	| "WAVE"
	| "ORANGE_MONEY"
	| "FREE_MONEY"
	| "CARD"
	| "PAYPAL";

export interface OrderTicketHolder {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
}

export interface OrderItem {
	ticketTypeId: string;
	quantity: number;
	holders?: OrderTicketHolder[];
}

export interface OrderBuyer {
	firstName: string;
	lastName: string;
	email?: string;
	phone?: string;
}

export interface CreateOrderInput {
	eventId: string;
	items: OrderItem[];
	buyer: OrderBuyer;
	currency?: Currency;
	promoCode?: string;
}

export interface OrderPreviewLine {
	ticketTypeId: string;
	name: string;
	unitPrice: number;
	quantity: number;
	lineTotal: number;
}

export interface OrderPreview {
	eventId: string;
	currency: Currency;
	lines: OrderPreviewLine[];
	subtotal: number;
	fees: number;
	discount: number;
	total: number;
	promoCode: string | null;
}

export interface OrderTicket {
	id: string;
	ticketTypeId: string;
	ticketNumber: string | null;
	qrCode: string | null;
	holderFirstName: string | null;
	holderLastName: string | null;
	holderEmail: string | null;
	holderPhone: string | null;
	status: TicketStatus | string;
}

export interface Order {
	id: string;
	eventId: string;
	buyerId: string | null;
	buyerEmail: string | null;
	buyerPhone: string | null;
	buyerFirstName: string | null;
	buyerLastName: string | null;
	subtotal: string;
	fees: string;
	totalAmount: string;
	status: OrderStatus | string;
	paymentMethod: string | null;
	paymentReference: string | null;
	expiresAt: string | null;
	paidAt: string | null;
	createdAt: string;
	updatedAt: string;
	tickets: OrderTicket[] | Ticket[];
	event?: Event;
}

export interface OrderStatusResponse {
	id: string;
	status: OrderStatus | string;
	expiresAt: string | null;
	paidAt: string | null;
	paymentMethod: string | null;
}

export interface InitiatePaymentInput {
	method: PaymentMethod;
	returnUrl?: string;
	phone?: string;
}

export interface PaymentInitiationResponse {
	orderId: string;
	paymentId: string;
	reference: string;
	redirectUrl: string;
	instructions: string;
}
