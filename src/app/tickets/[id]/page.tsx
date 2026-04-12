"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowLeft, MapPin, Calendar, Clock, User, Ticket, Download, Share2, CheckCircle, XCircle, Mail, Phone, AlertCircle } from "lucide-react";
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
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl font-bold text-gray-900 mb-2">Billet introuvable</p>
          <p className="text-sm text-gray-500 mb-6">Ce billet n&apos;existe pas ou a été supprimé.</p>
          <button type="button" onClick={() => router.push("/tickets")} className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90">
            Retour aux billets
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => toast.success("Téléchargement du billet en cours...");
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: ticket.eventTitle, text: `Mon billet pour ${ticket.eventTitle}`, url: window.location.href })
        .then(() => toast.success("Billet partagé !")).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papiers !");
    }
  };
  const handleAddToCalendar = () => toast.success("Ajouté au calendrier !");

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button type="button" onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Détails du billet</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Main ticket card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          {/* Cover image */}
          <div className="relative h-44">
            <Image src={ticket.eventImage} alt={ticket.eventTitle} fill className="object-cover" sizes="(max-width: 512px) 100vw, 512px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-bold text-lg text-white mb-0.5">{ticket.eventTitle}</p>
              <p className="text-white/80 text-sm">{ticket.eventLocation}</p>
            </div>
            <div className="absolute top-3 right-3">
              {ticket.status === "valid" ? (
                <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                  <CheckCircle size={13} /> Valide
                </div>
              ) : (
                <div className="bg-gray-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                  <XCircle size={13} /> Utilisé
                </div>
              )}
            </div>
          </div>

          {/* QR Code */}
          <div className="p-6 border-b border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-4">Présentez ce QR code à l&apos;entrée</p>
            <div className="w-56 h-56 mx-auto bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center p-4 mb-3">
              <QRCodeSVG value={ticket.qrCode} size={200} level="H" includeMargin={false} />
            </div>
            <p className="text-xs text-gray-400 font-mono mb-4">{ticket.qrCode}</p>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-0.5">Numéro de billet</p>
              <p className="font-mono font-bold text-gray-900 text-sm">{ticket.ticketNumber}</p>
            </div>
          </div>

          {/* Event info */}
          <div className="p-6 space-y-4">
            <p className="text-base font-semibold text-gray-900">Informations de l&apos;événement</p>
            {[
              { icon: Calendar, color: "#FF6B35", bg: "#FFF1EC", label: "Date", value: ticket.eventDate },
              { icon: Clock, color: "#004E89", bg: "#EFF6FF", label: "Heure", value: ticket.eventTime },
              { icon: MapPin, color: "#8B5CF6", bg: "#F5F3FF", label: "Lieu", value: ticket.eventLocation },
              { icon: Ticket, color: "#10B981", bg: "#ECFDF5", label: "Type de billet", value: ticket.ticketType },
            ].map(({ icon: Icon, color, bg, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Holder info */}
          <div className="p-6 bg-gray-50 space-y-4 border-t border-gray-100">
            <p className="text-base font-semibold text-gray-900">Détenteur</p>
            {[
              { icon: User, color: "#FF6B35", bg: "#FFF1EC", label: "Nom", value: ticket.holderName },
              ...(ticket.buyerEmail ? [{ icon: Mail, color: "#004E89", bg: "#EFF6FF", label: "Email", value: ticket.buyerEmail }] : []),
              ...(ticket.buyerPhone ? [{ icon: Phone, color: "#8B5CF6", bg: "#F5F3FF", label: "Téléphone", value: ticket.buyerPhone }] : []),
            ].map(({ icon: Icon, color, bg, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Price summary */}
          <div className="p-6 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Quantité</p>
                <p className="text-lg font-bold text-gray-900">{ticket.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Prix total</p>
                <p className="text-lg font-bold text-primary">{ticket.totalPrice.toLocaleString()} FCFA</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400 mb-0.5">Date d&apos;achat</p>
                <p className="text-sm font-semibold text-gray-900">{ticket.purchaseDate}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={handleDownload} className="bg-white border border-gray-200 text-gray-700 py-3.5 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm">
            <Download size={17} /> Télécharger
          </button>
          <button type="button" onClick={handleShare} className="bg-white border border-gray-200 text-gray-700 py-3.5 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm">
            <Share2 size={17} /> Partager
          </button>
        </div>

        <button type="button" onClick={handleAddToCalendar} className="w-full bg-primary text-white py-4 px-6 rounded-full font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <Calendar size={18} /> Ajouter au calendrier
        </button>

        {/* Help notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex gap-3">
            <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Besoin d&apos;aide ?</p>
              <p className="text-sm text-blue-600 mb-2">Présentez ce QR code à l&apos;entrée. Assurez-vous que l&apos;écran est bien lumineux.</p>
              <button type="button" className="text-sm font-semibold text-blue-600">Contacter le support →</button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
