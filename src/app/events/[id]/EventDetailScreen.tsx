"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Share2,
  Heart,
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useFavorites } from "@/contexts/FavoritesContext";
import type { Event } from "@/store/api/event/event.type";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import BottomNav from "@/components/BottomNav";

type Props = { event: Event };

export default function EventDetailScreen({ event }: Props) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(event.id);
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleFavoriteClick = () => {
    toggleFavorite(event.id);
    toast.success(favorite ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: event.title, text: event.shortDescription || event.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier");
    }
  };

  const handleTicketChange = (ticketId: string, delta: number) => {
    setSelectedTickets((prev) => {
      const current = prev[ticketId] || 0;
      const newValue = Math.max(0, current + delta);
      if (newValue === 0) {
        const next = { ...prev };
        delete next[ticketId];
        return next;
      }
      return { ...prev, [ticketId]: newValue };
    });
  };

  const ticketTypes = event.ticketTypes || [];
  const totalPrice = Object.entries(selectedTickets).reduce((sum, [ticketId, quantity]) => {
    const tt = ticketTypes.find((t) => t.id === ticketId);
    return sum + (tt?.price ?? 0) * quantity;
  }, 0);
  const totalQuantity = Object.values(selectedTickets).reduce((s, q) => s + q, 0);

  const dateStr = format(new Date(event.startDatetime), "EEEE d MMMM yyyy", { locale: fr });
  const timeStr = format(new Date(event.startDatetime), "HH:mm");
  const location = event.city || event.address || "";
  const description = event.description || event.shortDescription || "";

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      {/* Cover */}
      <div className="relative h-80">
        <Image src={event.coverImageUrl} alt={event.title} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-900" />
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Share2 size={18} className="text-gray-900" />
            </button>
            <button
              type="button"
              onClick={handleFavoriteClick}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Heart size={18} className={favorite ? "fill-primary text-primary" : "text-gray-900"} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-5 relative z-10 pb-6 space-y-4">
        {/* Title card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 p-5">
          {event.category && (
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-3">
              {event.category.name}
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h1>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Calendar size={20} className="text-primary mx-auto mb-1.5" />
              <p className="text-xs text-gray-400 mb-0.5">Date</p>
              <p className="text-xs font-semibold text-gray-900 leading-tight">{dateStr}</p>
              <p className="text-xs text-gray-500">{timeStr}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <MapPin size={20} className="text-primary mx-auto mb-1.5" />
              <p className="text-xs text-gray-400 mb-0.5">Lieu</p>
              <p className="text-xs font-semibold text-gray-900 truncate leading-tight" title={location}>
                {location || "—"}
              </p>
              <button type="button" className="text-xs text-primary font-semibold mt-0.5">
                Itinéraire
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Users size={20} className="text-primary mx-auto mb-1.5" />
              <p className="text-xs text-gray-400 mb-0.5">Places</p>
              <p className="text-xs font-semibold text-gray-900">{event.capacity || "—"}</p>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-base font-semibold text-gray-900 mb-3">À propos de l&apos;événement</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            {showFullDescription ? description : `${description.slice(0, 150)}${description.length > 150 ? "..." : ""}`}
          </p>
          {description.length > 150 && (
            <button
              type="button"
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-primary font-semibold text-sm mt-2"
            >
              {showFullDescription ? "Voir moins" : "Lire plus"}
            </button>
          )}
        </motion.div>

        {/* Ticket selection */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-base font-semibold text-gray-900">Choisissez votre billet</p>
          </div>
          <div className="divide-y divide-gray-100">
            {ticketTypes.map((ticket) => (
              <div key={ticket.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">{ticket.name}</p>
                    {ticket.description && (
                      <p className="text-xs text-gray-500 mb-1">{ticket.description}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {(ticket.availableQuantity ?? ticket.totalQuantity ?? 99)} places disponibles
                    </p>
                  </div>
                  <p className="text-lg font-bold text-primary ml-4">
                    {ticket.price === 0 ? "Gratuit" : `${ticket.price.toLocaleString()} FCFA`}
                  </p>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                  <span className="text-sm text-gray-500">Quantité</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleTicketChange(ticket.id, -1)}
                      disabled={!selectedTickets[ticket.id]}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200 disabled:opacity-40"
                    >
                      <Minus size={15} className="text-gray-600" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-gray-900">
                      {selectedTickets[ticket.id] || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTicketChange(ticket.id, 1)}
                      className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fixed bottom CTA */}
      {totalQuantity > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 z-50 pb-[calc(1rem+env(safe-area-inset-bottom))]"
        >
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400">Prix total</p>
              <p className="text-xl font-bold text-gray-900">{totalPrice.toLocaleString()} FCFA</p>
              <p className="text-xs text-gray-400">{totalQuantity} billet{totalQuantity > 1 ? "s" : ""}</p>
            </div>
            <Link
              href={`/checkout/event/${event.slug}`}
              className="flex-1 bg-primary text-white py-4 px-6 rounded-full font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Acheter maintenant
              <ChevronRight size={18} />
            </Link>
          </div>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}
