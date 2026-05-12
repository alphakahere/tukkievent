"use client";

import { motion } from "motion/react";
import { Wallet } from "lucide-react";

export default function OrdersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <section className="bg-white rounded-2xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Commandes</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Suivez les commandes et paiements liés à cet événement.
          </p>
        </div>
        <div className="p-12 text-center">
          <Wallet size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-700">Aucune commande pour le moment</p>
          <p className="text-xs text-gray-500 mt-1">
            La liste des commandes apparaîtra ici dès que l&apos;API sera disponible.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
