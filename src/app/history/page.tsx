"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, ShoppingBag, ChevronRight, Receipt } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import BottomNav from "@/components/BottomNav";
import AccountSidebar from "@/components/AccountSidebar";
import { useOrders } from "@/contexts/OrdersContext";

export default function HistoryPage() {
  const router = useRouter();
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState<"purchases" | "refunds">("purchases");

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-muted pb-24 md:pb-8">
      <header className="bg-card px-4 pt-12 pb-4 shadow-sm sticky top-0 z-40 border-b border-border md:hidden">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Retour"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Historique</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("purchases")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === "purchases"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Achats ({sortedOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("refunds")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === "refunds"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              Remboursements (0)
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg md:max-w-5xl mx-auto px-4 py-6">
        <div className="md:flex md:gap-8">
        <AccountSidebar />
        <div className="flex-1">
        {/* Desktop title */}
        <h1 className="hidden md:block text-2xl font-bold text-foreground mb-6">Historique</h1>
        {/* Desktop tabs */}
        <div className="hidden md:flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("purchases")}
            className={`py-2.5 px-5 rounded-xl font-semibold transition-all ${
              activeTab === "purchases"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            Achats ({sortedOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("refunds")}
            className={`py-2.5 px-5 rounded-xl font-semibold transition-all ${
              activeTab === "refunds"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            Remboursements (0)
          </button>
        </div>
        {activeTab === "purchases" ? (
          sortedOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Aucun achat</h3>
              <p className="text-muted-foreground mb-6">
                Vos achats de billets apparaîtront ici
              </p>
              <Link
                href="/"
                className="inline-block bg-primary text-primary-foreground py-3 px-8 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Découvrir les événements
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {sortedOrders.map((order, index) => {
                const totalTickets = order.tickets.reduce((sum, t) => sum + t.quantity, 0);
                const purchaseDate = format(new Date(order.createdAt), "d MMM yyyy", { locale: fr });
                return (
                  <motion.div
                    key={order.orderId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/history/${order.orderId}`}
                      className="block bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-border"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                            {order.event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Acheté le {purchaseDate}
                          </p>
                        </div>
                        <span className="ml-3 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full shrink-0">
                          Confirmé
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{totalTickets} billet{totalTickets > 1 ? "s" : ""}</span>
                          <span>•</span>
                          <span>{order.formData.paymentMethod}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">
                            {order.total.toLocaleString()} FCFA
                          </span>
                          <ChevronRight size={18} className="text-muted-foreground" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Aucun remboursement</h3>
            <p className="text-muted-foreground">
              Vos remboursements apparaîtront ici
            </p>
          </motion.div>
        )}
        </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
