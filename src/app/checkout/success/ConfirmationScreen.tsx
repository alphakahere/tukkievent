"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Download, Share2, Calendar } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4 pb-24">
      <div className="max-w-lg mx-auto pt-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-tukki-success rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Paiement réussi !</h1>
          <p className="text-muted-foreground">
            Numéro de commande: <span className="font-semibold">{orderId}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 shadow-xl border border-border mb-4"
        >
          <div className="flex gap-4 mb-6">
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
              <p className="text-sm text-muted-foreground mb-1">
                {eventDate} • {eventTime}
              </p>
              <p className="text-xs text-muted-foreground">
                {event.city || event.address}
              </p>
            </div>
          </div>

          <div className="bg-muted/50 p-6 rounded-xl mb-4 flex items-center justify-center">
            <div className="w-48 h-48 bg-card rounded-lg shadow-inner flex items-center justify-center border-4 border-dashed border-border">
              <div className="text-center">
                <div className="text-6xl mb-2">📱</div>
                <p className="text-sm text-muted-foreground">QR Code</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4 p-4 bg-muted rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nom du porteur</span>
              <span className="font-semibold text-foreground">{order.formData.fullName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email</span>
              <span className="font-semibold text-foreground">{order.formData.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Montant total</span>
              <span className="font-semibold text-primary">
                {order.total.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 mb-6"
        >
          <button
            type="button"
            className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
          >
            <Download size={20} />
            Télécharger le billet
          </button>
          <button
            type="button"
            className="w-full bg-card text-primary border-2 border-primary py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:bg-primary/5 transition-colors"
          >
            <Share2 size={20} />
            Partager
          </button>
          <button
            type="button"
            className="w-full bg-card text-foreground border-2 border-border py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:bg-muted transition-colors"
          >
            <Calendar size={20} />
            Ajouter au calendrier
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <p className="text-sm text-muted-foreground mb-6">
            📧 Un email et un SMS de confirmation ont été envoyés à l&apos;adresse et au numéro
            fournis
          </p>
          <Link href="/tickets" className="text-primary font-semibold hover:underline">
            Voir tous mes billets →
          </Link>
        </motion.div>

        <Link
          href="/"
          className="block w-full bg-secondary text-secondary-foreground py-4 px-6 rounded-xl font-semibold text-center shadow-lg hover:opacity-90 transition-opacity"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
