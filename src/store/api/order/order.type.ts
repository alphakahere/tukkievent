export enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PAID = "PAID",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
    REFUNDED = "REFUNDED"
  }

export interface OrderInput {
	eventId: string;
	totalAmount: string;
	buyerEmail: string;
	buyerPhone: string;
	buyerFirstName: string;
	buyerLastName: string;
	paymentMethod: string;
	subtotal: string;
	fees: string;
	tickets: {
		ticketTypeId: string;
		quantity: number;
	}[];
}

export interface Order {
    id: string;
    eventId: string;
    ticketTypeId: string;
    quantity: number;
}