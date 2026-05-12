"use client";

import { motion } from "motion/react";
import { Plus, Ticket as TicketIcon } from "lucide-react";

export default function TicketsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <section className="bg-white rounded-2xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Types de billets</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Configurez les billets disponibles pour cet événement.
            </p>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold opacity-50 cursor-not-allowed"
          >
            <Plus size={14} />
            Ajouter un billet
          </button>
        </div>
        <div className="p-12 text-center">
          <TicketIcon size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-700">La gestion des billets arrive bientôt</p>
          <p className="text-xs text-gray-500 mt-1">
            L&apos;API de configuration des types de billets sera disponible prochainement.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
