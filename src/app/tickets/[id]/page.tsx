"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Ticket,
  Download,
  Share2,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrdersContext";
import { mockBookedTickets } from "@/lib/mockData";
import { QRCodeSVG } from "qrcode.react";
import BottomNav from "@/components/BottomNav";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { getBookedTicketById } = useOrders();

  const ticket = getBookedTicketById(id) ?? mockBookedTickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Billet introuvable</h2>
          <p className="text-muted-foreground mb-6">
            Ce billet n&apos;existe pas ou a été supprimé.
          </p>
          <button
            type="button"
            onClick={() => router.push("/tickets")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90"
          >
            Retour aux billets
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => toast.success("Téléchargement du billet en cours...");
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: ticket.eventTitle,
          text: `Mon billet pour ${ticket.eventTitle}`,
          url: window.location.href,
        })
        .then(() => toast.success("Billet partagé !"))
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papiers !");
    }
  };
  const handleAddToCalendar = () => toast.success("Ajouté au calendrier !");

  return (
    <div className="min-h-screen bg-muted pb-24">
      <header className="bg-gradient-to-br from-primary to-secondary px-4 pt-12 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
            >
              <ArrowLeft size={24} className="text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Détails du billet</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl shadow-xl overflow-hidden mb-6 border border-border"
        >
          <div className="relative h-48">
            <Image
              src={ticket.eventImage}
              alt={ticket.eventTitle}
              fill
              className="object-cover"
              sizes="(max-width: 512px) 100vw, 512px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="font-bold text-xl text-white mb-1">{ticket.eventTitle}</h2>
              <p className="text-white/90 text-sm">{ticket.eventLocation}</p>
            </div>
            <div className="absolute top-4 right-4">
              {ticket.status === "valid" ? (
                <div className="bg-tukki-success text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <CheckCircle size={14} />
                  Valide
                </div>
              ) : (
                <div className="bg-muted-foreground text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <XCircle size={14} />
                  Utilisé
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-b border-border">
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Présentez ce QR code à l&apos;entrée
            </p>
            <div className="w-64 h-64 mx-auto bg-card border-4 border-primary rounded-2xl flex flex-col items-center justify-center p-4 mb-4 shadow-lg">
              <QRCodeSVG
                value={ticket.qrCode}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-xs text-muted-foreground font-mono text-center mb-4">
              {ticket.qrCode}
            </p>
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Numéro de billet</p>
              <p className="font-mono font-bold text-foreground">{ticket.ticketNumber}</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <h3 className="font-bold text-foreground mb-4">Informations de l&apos;événement</h3>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <p className="font-semibold text-foreground">{ticket.eventDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <Clock size={20} className="text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Heure</p>
                <p className="font-semibold text-foreground">{ticket.eventTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Lieu</p>
                <p className="font-semibold text-foreground">{ticket.eventLocation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-tukki-success/10 flex items-center justify-center shrink-0">
                <Ticket size={20} className="text-tukki-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Type de billet</p>
                <p className="font-semibold text-foreground">{ticket.ticketType}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-muted/50 space-y-4">
            <h3 className="font-bold text-foreground mb-4">Détenteur</h3>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Nom</p>
                <p className="font-semibold text-foreground">{ticket.holderName}</p>
              </div>
            </div>
            {ticket.buyerEmail && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-semibold text-foreground">{ticket.buyerEmail}</p>
                </div>
              </div>
            )}
            {ticket.buyerPhone && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Téléphone</p>
                  <p className="font-semibold text-foreground">{ticket.buyerPhone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Quantité</p>
                <p className="font-bold text-foreground text-lg">{ticket.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Prix total</p>
                <p className="font-bold text-primary text-lg">
                  {ticket.totalPrice.toLocaleString()} FCFA
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Date d&apos;achat</p>
                <p className="font-semibold text-foreground">{ticket.purchaseDate}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={handleDownload}
            className="bg-card border-2 border-primary text-primary py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-primary/5"
          >
            <Download size={20} />
            Télécharger
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="bg-card border-2 border-secondary text-secondary py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-secondary/5"
          >
            <Share2 size={20} />
            Partager
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCalendar}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg mb-6"
        >
          <Calendar size={20} />
          Ajouter au calendrier
        </button>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Besoin d&apos;aide ?
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200 mb-3">
                Présentez ce QR code à l&apos;entrée. Assurez-vous que l&apos;écran est bien
                lumineux.
              </p>
              <button type="button" className="text-sm font-semibold text-blue-600">
                Contacter le support →
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
