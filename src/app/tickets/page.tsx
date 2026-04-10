"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Ticket as TicketIcon } from "lucide-react";
import { motion } from "motion/react";
import BottomNav from "@/components/BottomNav";
import { useOrders } from "@/contexts/OrdersContext";
import { mockBookedTickets } from "@/lib/mockData";
import type { BookedTicket } from "@/lib/mockData";

function isUpcoming(t: BookedTicket): boolean {
  const dt = t.eventDatetime ? new Date(t.eventDatetime) : null;
  if (!dt) return true;
  return dt.getTime() >= Date.now();
}

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const { bookedTickets } = useOrders();

  const allTickets = useMemo(() => {
    const byId = new Map<string, BookedTicket>();
    mockBookedTickets.forEach((t) => byId.set(t.id, t));
    bookedTickets.forEach((t) => byId.set(t.id, t));
    return Array.from(byId.values());
  }, [bookedTickets]);
  const upcomingTickets = allTickets.filter(isUpcoming);
  const pastTickets = allTickets.filter((t) => !isUpcoming(t));
  const currentTickets = activeTab === "upcoming" ? upcomingTickets : pastTickets;

  return (
    <div className="min-h-screen bg-muted pb-24 md:pb-8">
      <header className="bg-card px-4 pt-12 md:pt-4 pb-4 shadow-sm sticky top-0 z-40 border-b border-border md:top-16">
        <div className="max-w-lg md:max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-6">Mes Billets</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === "upcoming"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              À venir ({upcomingTickets.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === "past"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Passés ({pastTickets.length})
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg md:max-w-6xl mx-auto px-4 py-6">
        {currentTickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <TicketIcon size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Aucun billet {activeTab === "upcoming" ? "à venir" : "passé"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === "upcoming"
                ? "Réservez vos prochains événements dès maintenant"
                : "Vos billets passés apparaîtront ici"}
            </p>
            {activeTab === "upcoming" && (
              <Link
                href="/"
                className="inline-block bg-primary text-primary-foreground py-3 px-8 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Découvrir les événements
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
                >
                  <div className="flex gap-4 p-4">
                    <Image
                      src={ticket.eventImage}
                      alt={ticket.eventTitle}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                            {ticket.eventTitle}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {ticket.eventDate} • {ticket.eventTime}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {ticket.eventLocation}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                            ticket.status === "valid"
                              ? "bg-tukki-success/10 text-tukki-success"
                              : "bg-muted-foreground/10 text-muted-foreground"
                          }`}
                        >
                          {ticket.status === "valid" ? "Valide" : "Utilisé"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {ticket.ticketType} × {ticket.quantity}
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            {ticket.totalPrice.toLocaleString()} FCFA
                          </p>
                        </div>
                        <ChevronRight size={20} className="text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  {ticket.status === "valid" && (
                    <div className="border-t border-dashed border-border p-4 bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📱</span>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Numéro de billet</p>
                            <p className="text-sm font-semibold text-foreground">
                              {ticket.ticketNumber}
                            </p>
                          </div>
                        </div>
                        <span className="text-primary text-sm font-semibold">Afficher QR</span>
                      </div>
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
