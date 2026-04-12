"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Download, Share2, Calendar, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { CompletedOrder } from "@/contexts/OrdersContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Props = { orderId: string; order: CompletedOrder };

export default function ConfirmationScreen({ orderId, order }: Props) {
  const event = order.event;
  const eventDate = format(new Date(event.startDatetime), "dd MMM yyyy", { locale: fr });
  const eventTime = format(new Date(event.startDatetime), "HH:mm");

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-12">
      <div className="max-w-lg mx-auto px-4 pt-12 space-y-4">

        {/* Success badge */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paiement réussi !</h1>
          <p className="text-sm text-gray-500">
            Commande <span className="font-semibold text-gray-700">#{orderId.slice(-8).toUpperCase()}</span>
          </p>
        </motion.div>

        {/* Ticket card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          {/* Event info */}
          <div className="p-5 flex gap-4 border-b border-gray-100">
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              width={72}
              height={72}
              className="w-[72px] h-[72px] object-cover rounded-xl flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 mb-1 line-clamp-1">{event.title}</p>
              <p className="text-sm text-gray-500 mb-0.5">{eventDate} · {eventTime}</p>
              <p className="text-xs text-gray-400">{event.city || event.address}</p>
            </div>
          </div>

          {/* QR code placeholder */}
          <div className="p-6 border-b border-dashed border-gray-200 flex flex-col items-center">
            <p className="text-xs text-gray-400 mb-4">Présentez ce QR code à l&apos;entrée</p>
            <div className="w-48 h-48 bg-gray-50 border-2 border-gray-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-2">📱</div>
                <p className="text-xs text-gray-400">QR Code</p>
              </div>
            </div>
          </div>

          {/* Order details */}
          <div className="px-5 py-4 space-y-2.5">
            {[
              { label: "Nom du porteur", value: order.formData.fullName },
              { label: "Email", value: order.formData.email },
              { label: "Paiement", value: order.formData.paymentMethod },
              { label: "Montant total", value: `${order.total.toLocaleString()} FCFA`, highlight: true },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className={`font-semibold ${highlight ? "text-primary" : "text-gray-900"}`}>{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          <button
            type="button"
            className="bg-white border border-gray-200 text-gray-700 py-3.5 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm"
          >
            <Download size={16} /> Télécharger
          </button>
          <button
            type="button"
            className="bg-white border border-gray-200 text-gray-700 py-3.5 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm"
          >
            <Share2 size={16} /> Partager
          </button>
        </motion.div>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 px-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Calendar size={16} /> Ajouter au calendrier
        </motion.button>

        {/* Confirmation note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-gray-400 pt-2"
        >
          Un email et un SMS de confirmation ont été envoyés à l&apos;adresse et au numéro fournis.
        </motion.p>

        {/* Navigation CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col gap-3 pb-4"
        >
          <Link
            href="/tickets"
            className="w-full bg-primary text-white py-4 px-6 rounded-full font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            Voir mes billets <ArrowRight size={18} />
          </Link>
          <Link
            href="/"
            className="w-full bg-white border border-gray-200 text-gray-700 py-4 px-6 rounded-full font-semibold flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
