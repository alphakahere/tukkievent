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
    ticketTypeId: string;
    quantity: number;
}

export interface Order {
    id: string;
    eventId: string;
    ticketTypeId: string;
    quantity: number;
}