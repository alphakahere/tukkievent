"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { BookedTicket } from "@/lib/mockData";
import type { Event } from "@/store/api/event/event.type";
import { format } from "date-fns";

const STORAGE_KEY = "tukki-event-orders";

export interface TicketSelection {
  ticketId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CompletedOrder {
  orderId: string;
  event: Event;
  tickets: TicketSelection[];
  total: number;
  formData: { fullName: string; email: string; phone: string; paymentMethod: string };
  createdAt: string;
}

function orderToBookedTickets(order: CompletedOrder): BookedTicket[] {
  const tickets: BookedTicket[] = [];
  const event = order.event;
  const eventDate = format(new Date(event.startDatetime), "dd MMM yyyy");
  const eventTime = format(new Date(event.startDatetime), "HH:mm");
  const eventLocation = event.city || event.address || "";
  const eventDatetime = event.startDatetime;

  order.tickets.forEach((ts, idx) => {
    for (let i = 0; i < ts.quantity; i++) {
      const ticketNumber = `TKK-${order.orderId.slice(-6)}-${idx}-${i + 1}`;
      tickets.push({
        id: `${order.orderId}-${ts.ticketId}-${i}`,
        orderId: order.orderId,
        status: "valid",
        eventId: event.id,
        eventSlug: event.slug,
        eventImage: event.coverImageUrl,
        eventTitle: event.title,
        eventDate,
        eventTime,
        eventDatetime,
        eventLocation,
        ticketType: ts.name,
        quantity: 1,
        totalPrice: ts.price,
        ticketNumber,
        qrCode: ticketNumber,
        holderName: order.formData.fullName,
        buyerEmail: order.formData.email,
        buyerPhone: order.formData.phone,
        purchaseDate: format(new Date(), "dd MMM yyyy"),
      });
    }
  });

  return tickets;
}

type OrdersContextValue = {
  orders: CompletedOrder[];
  bookedTickets: BookedTicket[];
  addOrder: (order: CompletedOrder) => void;
  getOrderById: (orderId: string) => CompletedOrder | undefined;
  getBookedTicketById: (id: string) => BookedTicket | undefined;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CompletedOrder[];
        if (Array.isArray(parsed)) setOrders(parsed);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [mounted, orders]);

  const bookedTickets = orders.flatMap(orderToBookedTickets);

  const addOrder = useCallback((order: CompletedOrder) => {
    setOrders((prev) => [...prev, order]);
  }, []);

  const getOrderById = useCallback(
    (orderId: string) => orders.find((o) => o.orderId === orderId),
    [orders]
  );

  const getBookedTicketById = useCallback(
    (id: string) => bookedTickets.find((t) => t.id === id),
    [bookedTickets]
  );

  const value: OrdersContextValue = {
    orders,
    bookedTickets,
    addOrder,
    getOrderById,
    getBookedTicketById,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
