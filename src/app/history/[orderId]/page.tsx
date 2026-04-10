"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  User,
  Mail,
  Phone,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrdersContext";
import BottomNav from "@/components/BottomNav";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;
  const { getOrderById } = useOrders();

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Commande introuvable</h2>
          <p className="text-muted-foreground mb-6">
            Cette commande n&apos;existe pas ou a été supprimée.
          </p>
          <button
            type="button"
            onClick={() => router.push("/history")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90"
          >
            Retour à l&apos;historique
          </button>
        </div>
      </div>
    );
  }

  const purchaseDate = format(new Date(order.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr });
  const eventDate = format(new Date(order.event.startDatetime), "d MMMM yyyy", { locale: fr });

  const handleDownload = () => toast.success("Téléchargement du reçu en cours...");

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
            <h1 className="text-2xl font-bold text-white">Détails de la commande</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-4">
        {/* Status card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-sm border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Numéro de commande</p>
              <p className="font-mono font-bold text-foreground text-sm">#{order.orderId.slice(-8).toUpperCase()}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-400 text-sm font-semibold">Confirmé</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Acheté le {purchaseDate}</p>
        </motion.div>

        {/* Event info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl p-5 shadow-sm border border-border"
        >
          <h3 className="font-bold text-foreground mb-4">Événement</h3>
          <h4 className="font-semibold text-foreground text-lg mb-3">{order.event.title}</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar size={18} className="text-primary" />
              </div>
              <span className="text-sm text-foreground">{eventDate}</span>
            </div>
            {(order.event.city || order.event.address) && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-purple-500" />
                </div>
                <span className="text-sm text-foreground">
                  {order.event.city || order.event.address}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tickets breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border"
        >
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Billets</h3>
          </div>
          <div className="divide-y divide-border">
            {order.tickets.map((ticket) => (
              <div key={ticket.ticketId} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{ticket.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.price.toLocaleString()} FCFA × {ticket.quantity}
                  </p>
                </div>
                <p className="font-semibold text-foreground">
                  {(ticket.price * ticket.quantity).toLocaleString()} FCFA
                </p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 bg-muted/50 flex items-center justify-between border-t border-border">
            <p className="font-bold text-foreground">Total</p>
            <p className="font-bold text-primary text-lg">{order.total.toLocaleString()} FCFA</p>
          </div>
        </motion.div>

        {/* Buyer info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl p-5 shadow-sm border border-border"
        >
          <h3 className="font-bold text-foreground mb-4">Acheteur</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User size={18} className="text-primary" />
              </div>
              <span className="text-sm text-foreground">{order.formData.fullName}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-secondary" />
              </div>
              <span className="text-sm text-foreground">{order.formData.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                <Phone size={18} className="text-purple-500" />
              </div>
              <span className="text-sm text-foreground">{order.formData.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-green-500" />
              </div>
              <span className="text-sm text-foreground">{order.formData.paymentMethod}</span>
            </div>
          </div>
        </motion.div>

        {/* Download receipt */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          className="w-full bg-card border-2 border-primary text-primary py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-primary/5 transition-colors"
        >
          <Download size={20} />
          Télécharger le reçu
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
