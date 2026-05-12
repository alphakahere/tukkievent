"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CreditCard,
  Smartphone,
  X,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { usePaymentMethods, type PaymentMethodType } from "@/contexts/PaymentMethodsContext";
import { useOrders } from "@/contexts/OrdersContext";
import BottomNav from "@/components/BottomNav";
import AccountSidebar from "@/components/AccountSidebar";

const METHOD_META: Record<PaymentMethodType, { label: string; color: string; bg: string }> = {
  wave: { label: "Wave", color: "#00C3F5", bg: "#E0F9FF" },
  orange: { label: "Orange Money", color: "#FF6600", bg: "#FFF0E6" },
  card: { label: "Carte bancaire", color: "#6B7280", bg: "#F3F4F6" },
};

function MethodIcon({ type }: { type: PaymentMethodType }) {
  const meta = METHOD_META[type];
  if (type === "card") {
    return <CreditCard size={20} style={{ color: meta.color }} />;
  }
  return <Smartphone size={20} style={{ color: meta.color }} />;
}

function AddMethodSheet({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (type: PaymentMethodType, identifier: string) => void;
}) {
  const [selectedType, setSelectedType] = useState<PaymentMethodType>("wave");
  const [identifier, setIdentifier] = useState("");

  const placeholder =
    selectedType === "card" ? "XXXX XXXX XXXX 1234" : "+221 77 000 00 00";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    onAdd(selectedType, identifier.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <p className="text-xl font-bold text-gray-900">Ajouter un moyen de paiement</p>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-3">Type</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(METHOD_META) as [PaymentMethodType, typeof METHOD_META[PaymentMethodType]][]).map(
                ([type, meta]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`py-3 px-2 rounded-full text-sm font-semibold transition-all border-2 ${
                      selectedType === type
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 bg-gray-50 text-gray-500"
                    }`}
                  >
                    {meta.label}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label htmlFor="identifier" className="text-sm font-medium text-gray-500 block mb-2">
              {selectedType === "card" ? "Numéro de carte" : "Numéro de téléphone"}
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Ajouter
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function PaymentMethodsPage() {
  const router = useRouter();
  const { paymentMethods, addPaymentMethod, removePaymentMethod } = usePaymentMethods();
  const { orders } = useOrders();
  const [showSheet, setShowSheet] = useState(false);

  const recentTransactions = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  function handleAdd(type: PaymentMethodType, identifier: string) {
    const meta = METHOD_META[type];
    const masked =
      type === "card"
        ? `•••• •••• •••• ${identifier.replace(/\s/g, "").slice(-4)}`
        : identifier.replace(/(\+\d{3}\s\d{2})\s\d{3}\s\d{2}\s(\d{2})/, "$1 *** ** $2");

    addPaymentMethod({ type, label: meta.label, maskedIdentifier: masked });
    setShowSheet(false);
    toast.success("Moyen de paiement ajouté !");
  }

  function handleRemove(id: string) {
    removePaymentMethod(id);
    toast.success("Moyen de paiement supprimé");
  }

  return (
		<>
			<div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
				<header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-40 md:hidden">
					<div className="max-w-lg mx-auto flex items-center gap-3">
						<button
							type="button"
							onClick={() => router.back()}
							className="p-2 rounded-full hover:bg-gray-100 transition-colors"
							aria-label="Retour"
						>
							<ArrowLeft
								size={20}
								className="text-gray-700"
							/>
						</button>
						<h1 className="text-xl font-bold text-gray-900">
							Moyens de paiement
						</h1>
					</div>
				</header>

				<div className="max-w-lg md: px-4 py-6">
					<div className="md:flex md:gap-8">
						<AccountSidebar />
						<div className="flex-1 space-y-6">
							<h1 className="hidden md:block text-2xl font-bold text-gray-900">
								Moyens de paiement
							</h1>

							{/* Saved methods */}
							<motion.div
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
							>
								<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
									Méthodes sauvegardées
								</p>
								<div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
									<AnimatePresence>
										{paymentMethods.length ===
										0 ? (
											<motion.div
												initial={{
													opacity: 0,
												}}
												animate={{
													opacity: 1,
												}}
												className="p-6 text-center text-gray-400 text-sm"
											>
												Aucune
												méthode
												enregistrée
											</motion.div>
										) : (
											paymentMethods.map(
												(
													method,
													index,
												) => {
													const meta =
														METHOD_META[
															method
																.type
														];
													return (
														<motion.div
															key={
																method.id
															}
															layout
															initial={{
																opacity: 0,
																x: -20,
															}}
															animate={{
																opacity: 1,
																x: 0,
															}}
															exit={{
																opacity: 0,
																x: 20,
															}}
															className={`flex items-center gap-4 p-4 ${
																index !==
																paymentMethods.length -
																	1
																	? "border-b border-gray-100"
																	: ""
															}`}
														>
															<div
																className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
																style={{
																	backgroundColor:
																		meta.bg,
																}}
															>
																<MethodIcon
																	type={
																		method.type
																	}
																/>
															</div>
															<div className="flex-1 min-w-0">
																<p className="text-sm font-semibold text-gray-900">
																	{
																		method.label
																	}
																</p>
																<p className="text-xs text-gray-500 font-mono">
																	{
																		method.maskedIdentifier
																	}
																</p>
															</div>
															<button
																type="button"
																onClick={() =>
																	handleRemove(
																		method.id,
																	)
																}
																className="p-2 rounded-full hover:bg-red-50 transition-colors"
																aria-label="Supprimer"
															>
																<Trash2
																	size={
																		16
																	}
																	className="text-red-400"
																/>
															</button>
														</motion.div>
													);
												},
											)
										)}
									</AnimatePresence>
								</div>

								<button
									type="button"
									onClick={() =>
										setShowSheet(true)
									}
									className="mt-3 w-full bg-white border-2 border-dashed border-gray-200 text-gray-500 py-4 px-6 rounded-2xl font-medium flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors"
								>
									<Plus size={18} />
									Ajouter un moyen de
									paiement
								</button>
							</motion.div>

							{/* Recent transactions */}
							<motion.div
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
							>
								<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
									Transactions récentes
								</p>
								<div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
									{recentTransactions.length ===
									0 ? (
										<div className="p-8 text-center">
											<ShoppingBag
												size={
													32
												}
												className="mx-auto text-gray-300 mb-2"
											/>
											<p className="text-sm text-gray-400">
												Aucune
												transaction
											</p>
										</div>
									) : (
										<div className="divide-y divide-gray-100">
											{recentTransactions.map(
												(
													order,
												) => {
													const date =
														format(
															new Date(
																order.createdAt,
															),
															"d MMM yyyy",
															{
																locale: fr,
															},
														);
													return (
														<div
															key={
																order.orderId
															}
															className="flex items-center gap-4 p-4"
														>
															<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
																<Smartphone
																	size={
																		16
																	}
																	className="text-primary"
																/>
															</div>
															<div className="flex-1 min-w-0">
																<p className="text-sm font-semibold text-gray-900 line-clamp-1">
																	{
																		order
																			.event
																			.title
																	}
																</p>
																<p className="text-xs text-gray-400">
																	{
																		date
																	}{" "}
																	·{" "}
																	{
																		order
																			.formData
																			.paymentMethod
																	}
																</p>
															</div>
															<div className="flex items-center gap-1">
																<span className="text-sm font-bold text-primary">
																	{order.total.toLocaleString()}{" "}
																	F
																</span>
																<ChevronRight
																	size={
																		16
																	}
																	className="text-gray-300"
																/>
															</div>
														</div>
													);
												},
											)}
										</div>
									)}
								</div>
							</motion.div>
						</div>
					</div>
				</div>

				<BottomNav />
			</div>

			<AnimatePresence>
				{showSheet && (
					<AddMethodSheet
						onClose={() => setShowSheet(false)}
						onAdd={handleAdd}
					/>
				)}
			</AnimatePresence>
		</>
  );
}
