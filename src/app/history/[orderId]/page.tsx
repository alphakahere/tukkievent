"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, MapPin, CreditCard, User, Mail, Phone, Download, AlertCircle, CheckCircle } from "lucide-react";
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
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl font-bold text-gray-900 mb-2">Commande introuvable</p>
          <p className="text-sm text-gray-500 mb-6">Cette commande n&apos;existe pas ou a été supprimée.</p>
          <button type="button" onClick={() => router.push("/history")} className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90">
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
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      <header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button type="button" onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Détails de la commande</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Status card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Numéro de commande</p>
              <p className="font-mono font-bold text-gray-900 text-sm">#{order.orderId.slice(-8).toUpperCase()}</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full">
              <CheckCircle size={14} className="text-emerald-600" />
              <span className="text-emerald-700 text-sm font-semibold">Confirmé</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">Acheté le {purchaseDate}</p>
        </motion.div>

        {/* Event info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-base font-semibold text-gray-900 mb-4">Événement</p>
          <p className="text-sm font-bold text-gray-900 mb-3">{order.event.title}</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar size={16} className="text-primary" />
              </div>
              <span className="text-sm text-gray-700">{eventDate}</span>
            </div>
            {(order.event.city || order.event.address) && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-purple-500" />
                </div>
                <span className="text-sm text-gray-700">{order.event.city || order.event.address}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tickets breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-base font-semibold text-gray-900">Billets</p>
          </div>
          <div className="divide-y divide-gray-100">
            {order.tickets.map((ticket) => (
              <div key={ticket.ticketId} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{ticket.name}</p>
                  <p className="text-xs text-gray-500">{ticket.price.toLocaleString()} FCFA × {ticket.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-900">{(ticket.price * ticket.quantity).toLocaleString()} FCFA</p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-100">
            <p className="text-sm font-bold text-gray-900">Total</p>
            <p className="text-base font-bold text-primary">{order.total.toLocaleString()} FCFA</p>
          </div>
        </motion.div>

        {/* Buyer info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-base font-semibold text-gray-900 mb-4">Acheteur</p>
          <div className="space-y-3">
            {[
              { icon: User, color: "#FF6B35", bg: "#FFF1EC", value: order.formData.fullName },
              { icon: Mail, color: "#004E89", bg: "#EFF6FF", value: order.formData.email },
              { icon: Phone, color: "#8B5CF6", bg: "#F5F3FF", value: order.formData.phone },
              { icon: CreditCard, color: "#10B981", bg: "#ECFDF5", value: order.formData.paymentMethod },
            ].map(({ icon: Icon, color, bg, value }) => (
              <div key={value} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <span className="text-sm text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Download */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleDownload}
          className="w-full bg-white border border-gray-200 text-gray-700 py-4 px-6 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Download size={18} />
          Télécharger le reçu
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
