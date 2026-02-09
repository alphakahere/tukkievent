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
    toast.success(favorite ? "Retiré des favoris" : "Ajouté aux favoris ❤️");
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: event.title,
          text: event.shortDescription || event.title,
          url: window.location.href,
        })
        .catch(() => {});
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

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="relative h-80">
        <Image
          src={event.coverImageUrl}
          alt={event.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
            >
              <Share2 size={20} className="text-foreground" />
            </button>
            <button
              type="button"
              onClick={handleFavoriteClick}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
            >
              <Heart
                size={20}
                className={favorite ? "fill-primary text-primary" : "text-foreground"}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 -mt-6 relative z-10">
        <div className="bg-card rounded-t-2xl border border-border border-b-0 shadow-lg pt-6 px-4 pb-8">
          {event.category && (
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-3">
              {event.category.name}
            </div>
          )}
          <h1 className="text-2xl font-bold mb-4 text-foreground">{event.title}</h1>

          <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-border">
            <div className="bg-muted rounded-xl p-3 text-center">
              <Calendar size={24} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Date & Heure</p>
              <p className="text-sm font-semibold text-foreground">{dateStr}</p>
              <p className="text-xs text-muted-foreground">{timeStr}</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <MapPin size={24} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Lieu</p>
              <p className="text-sm font-semibold text-foreground truncate" title={location}>
                {location || "—"}
              </p>
              <button type="button" className="text-xs text-primary font-semibold mt-1">
                Itinéraire
              </button>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <Users size={24} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Participants</p>
              <p className="text-sm font-semibold text-foreground">{event.capacity || "—"}</p>
              <p className="text-xs text-muted-foreground">places</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 text-foreground">
              À propos de l&apos;événement
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {showFullDescription
                ? event.description
                : `${(event.description || event.shortDescription || "").slice(0, 150)}...`}
            </p>
            {(event.description || event.shortDescription || "").length > 150 && (
              <button
                type="button"
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-primary font-semibold text-sm mt-2"
              >
                {showFullDescription ? "Voir moins" : "Lire plus"}
              </button>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-lg mb-4 text-foreground">Choisissez votre billet</h3>
            <div className="space-y-3">
              {ticketTypes.map((ticket) => (
                <div key={ticket.id} className="bg-muted rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{ticket.name}</h4>
                      {ticket.description && (
                        <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {(ticket.availableQuantity ?? ticket.totalQuantity ?? 99)} places
                        disponibles
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        {ticket.price === 0
                          ? "Gratuit"
                          : `${ticket.price.toLocaleString()} FCFA`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">Quantité</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleTicketChange(ticket.id, -1)}
                        disabled={!selectedTickets[ticket.id]}
                        className="w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-sm border border-border disabled:opacity-40"
                      >
                        <Minus size={16} className="text-muted-foreground" />
                      </button>
                      <span className="w-8 text-center font-semibold text-foreground">
                        {selectedTickets[ticket.id] || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTicketChange(ticket.id, 1)}
                        className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-sm text-primary-foreground"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {totalQuantity > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg z-50 pb-[env(safe-area-inset-bottom)]"
        >
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Prix total</p>
              <p className="text-2xl font-bold text-foreground">
                {totalPrice.toLocaleString()} FCFA
              </p>
              <p className="text-xs text-muted-foreground">{totalQuantity} billet(s)</p>
            </div>
            <Link
              href={`/checkout/event/${event.slug}`}
              className="flex-1 bg-primary text-primary-foreground py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity text-center"
            >
              Acheter maintenant
              <ChevronRight size={20} />
            </Link>
          </div>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}
