"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Plus,
  Minus,
  ChevronRight,
  Check,
  CreditCard,
  Smartphone,
  AlertCircle,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import type { Event } from "@/store/api/event/event.type";
import {
  useCreateOrderMutation,
  useInitiatePaymentMutation,
  usePreviewOrderMutation,
} from "@/store/api/order/order.api";
import type { PaymentMethod } from "@/store/api/order/order.type";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TicketSelection {
  ticketId: string;
  name: string;
  price: number;
  quantity: number;
}

type Props = { event: Event };

const inputClass =
  "w-full px-4 py-3 rounded-xl border bg-gray-50 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all";

function splitName(fullName: string): { first: string; last: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { first: "", last: "" };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: parts[0] };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  sub: string;
  icon: typeof Smartphone;
  color: string;
  bg: string;
}[] = [
  { id: "WAVE", label: "Wave", sub: "Paiement mobile", icon: Smartphone, color: "#00A9E0", bg: "#E0F7FD" },
  { id: "ORANGE_MONEY", label: "Orange Money", sub: "Paiement mobile", icon: Smartphone, color: "#FF7900", bg: "#FFF3E0" },
  { id: "CARD", label: "Carte Bancaire", sub: "Visa, Mastercard", icon: CreditCard, color: "#6B7280", bg: "#F3F4F6" },
];

export default function CheckoutEventScreen({ event }: Props) {
  const router = useRouter();
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [initiatePayment, { isLoading: isInitiating }] = useInitiatePaymentMutation();
  const [, { isLoading: isPreviewing }] = usePreviewOrderMutation();

  const [currentStep, setCurrentStep] = useState(1);
  const [ticketSelections, setTicketSelections] = useState<TicketSelection[]>([]);
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    paymentMethod: PaymentMethod;
  }>({
    fullName: "",
    email: "",
    phone: "",
    paymentMethod: "WAVE",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const totalTickets = ticketSelections.reduce((sum, ts) => sum + ts.quantity, 0);
  const totalPrice = ticketSelections.reduce((sum, ts) => sum + ts.price * ts.quantity, 0);
  const serviceFee = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + serviceFee;

  const handleTicketQuantityChange = (
    ticketId: string,
    name: string,
    price: number,
    delta: number,
    cap: number,
  ) => {
    setTicketSelections((prev) => {
      const existing = prev.find((ts) => ts.ticketId === ticketId);
      if (existing) {
        const newQuantity = Math.max(0, Math.min(cap, existing.quantity + delta));
        if (newQuantity === 0) return prev.filter((ts) => ts.ticketId !== ticketId);
        return prev.map((ts) => ts.ticketId === ticketId ? { ...ts, quantity: newQuantity } : ts);
      }
      if (delta > 0) return [...prev, { ticketId, name, price, quantity: 1 }];
      return prev;
    });
  };

  const getTicketQuantity = (ticketId: string) =>
    ticketSelections.find((ts) => ts.ticketId === ticketId)?.quantity || 0;

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Le nom complet est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.phone.trim()) newErrors.phone = "Le numéro de téléphone est requis";
    else if (!/^(\+221)?[0-9 ]{9,}$/.test(formData.phone.replace(/\s/g, "")))
      newErrors.phone = "Numéro invalide (format: +221 77 123 45 67)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (totalTickets === 0) { toast.error("Veuillez sélectionner au moins un billet"); return; }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
      else toast.error("Veuillez remplir tous les champs correctement");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleConfirmPayment = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const { first, last } = splitName(formData.fullName);
      const order = await createOrder({
        eventId: event.id,
        items: ticketSelections.map((ts) => ({
          ticketTypeId: ts.ticketId,
          quantity: ts.quantity,
        })),
        buyer: {
          firstName: first,
          lastName: last,
          email: formData.email,
          phone: formData.phone,
        },
        currency: "XOF",
      }).unwrap();

      const payment = await initiatePayment({
        orderId: order.id,
        payload: {
          method: formData.paymentMethod,
          phone: formData.phone,
          returnUrl:
            typeof window !== "undefined"
              ? `${window.location.origin}/checkout/processing?orderId=${order.id}`
              : undefined,
        },
      }).unwrap();

      router.push(
        `/checkout/processing?orderId=${order.id}&redirect=${encodeURIComponent(payment.redirectUrl)}`,
      );
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ?? "Le paiement a échoué.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const ticketTypes = event.ticketTypes ?? [];
  const available = (tt: { availableQuantity?: number; totalQuantity?: number; maxPurchase?: number }) =>
    Math.max(0, Math.min(tt.maxPurchase ?? 10, tt.availableQuantity ?? tt.totalQuantity ?? 99));
  const stepLabels = ["Billets", "Informations", "Paiement"];
  const isBusy = submitting || isCreating || isInitiating || isPreviewing;

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-32">
      <header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-50">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => currentStep === 1 ? router.back() : handlePreviousStep()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Réservation</p>
              <p className="text-xs text-gray-500">Étape {currentStep}/3 — {stepLabels[currentStep - 1]}</p>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    s === currentStep ? "w-6 bg-primary" : s < currentStep ? "w-4 bg-primary/40" : "w-4 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute h-full bg-primary rounded-full"
            />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex gap-4">
            {event.coverImageUrl && (
              <Image
                src={event.coverImageUrl}
                alt={event.title}
                width={72}
                height={72}
                className="w-[72px] h-[72px] rounded-xl object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 mb-1 line-clamp-1">{event.title}</p>
              <p className="text-xs text-gray-500 mb-0.5">
                {format(new Date(event.startDatetime), "EEEE d MMMM · HH:mm", { locale: fr })}
              </p>
              <p className="text-xs text-gray-400">{event.city || event.address}</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              <p className="text-base font-semibold text-gray-900">Sélectionnez vos billets</p>
              {ticketTypes.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4 text-sm text-gray-500">
                  Aucun billet disponible pour cet événement.
                </div>
              )}
              {ticketTypes.map((ticket) => {
                const quantity = getTicketQuantity(ticket.id);
                const cap = available(ticket);
                return (
                  <div key={ticket.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 mb-0.5">{ticket.name}</p>
                        {ticket.description && (
                          <p className="text-xs text-gray-500 mb-1">{ticket.description}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          {ticket.availableQuantity ?? ticket.totalQuantity ?? 99} disponibles
                        </p>
                      </div>
                      <p className="text-base font-bold text-primary ml-3">
                        {Number(ticket.price) === 0 ? "Gratuit" : `${Number(ticket.price).toLocaleString()} FCFA`}
                      </p>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                      <span className="text-sm text-gray-500">Quantité</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleTicketQuantityChange(ticket.id, ticket.name, Number(ticket.price), -1, cap)}
                          disabled={quantity === 0}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 disabled:opacity-40"
                        >
                          <Minus size={15} className="text-gray-600" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-gray-900">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleTicketQuantityChange(ticket.id, ticket.name, Number(ticket.price), 1, cap)}
                          disabled={quantity >= cap}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white disabled:opacity-40"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>
                    {quantity > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs text-gray-400">Sous-total</span>
                        <span className="text-sm font-bold text-gray-900">
                          {(Number(ticket.price) * quantity).toLocaleString()} FCFA
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <p className="text-base font-semibold text-gray-900">Vos informations</p>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom complet *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => { setFormData({ ...formData, fullName: e.target.value }); setErrors({ ...errors, fullName: "" }); }}
                    placeholder="Ex: Amadou Diallo"
                    className={`${inputClass} ${errors.fullName ? "border-red-300" : "border-gray-200"}`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                    placeholder="exemple@email.com"
                    className={`${inputClass} ${errors.email ? "border-red-300" : "border-gray-200"}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Téléphone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setErrors({ ...errors, phone: "" }); }}
                    placeholder="+221 77 123 45 67"
                    className={`${inputClass} ${errors.phone ? "border-red-300" : "border-gray-200"}`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.phone}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Votre billet sera envoyé par SMS et email</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Récapitulatif</p>
                </div>
                <div className="px-5 py-4 space-y-2">
                  {ticketSelections.map((ts) => (
                    <div key={ts.ticketId} className="flex justify-between text-sm">
                      <span className="text-gray-500">{ts.name} × {ts.quantity}</span>
                      <span className="font-medium text-gray-900">{(ts.price * ts.quantity).toLocaleString()} FCFA</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <p className="text-base font-semibold text-gray-900">Mode de paiement</p>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(({ id, label, sub, icon: Icon, color, bg }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: id })}
                    className={`w-full bg-white rounded-2xl p-4 border-2 transition-all text-left flex items-center gap-4 ${
                      formData.paymentMethod === id ? "border-primary bg-primary/[0.02]" : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500">{sub}</p>
                    </div>
                    {formData.paymentMethod === id && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Détails de la commande</p>
                </div>
                <div className="px-5 py-4 space-y-2">
                  {ticketSelections.map((ts) => (
                    <div key={ts.ticketId} className="flex justify-between text-sm">
                      <span className="text-gray-500">{ts.name} × {ts.quantity}</span>
                      <span className="font-medium text-gray-900">{(ts.price * ts.quantity).toLocaleString()} FCFA</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-3 mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Frais de service (5%)</span>
                      <span className="text-gray-900">{serviceFee.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-gray-900">Total</span>
                      <span className="text-base font-bold text-primary">{grandTotal.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <Shield size={16} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900 mb-0.5">Paiement sécurisé</p>
                  <p className="text-xs text-emerald-700">Vos informations sont cryptées. Vos billets seront envoyés après confirmation.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 z-40 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">Total ({totalTickets} billet{totalTickets > 1 ? "s" : ""})</p>
            <p className="text-xl font-bold text-gray-900">{grandTotal.toLocaleString()} FCFA</p>
          </div>
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              Continuer <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={isBusy}
              className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isBusy ? "Traitement..." : "Confirmer"}
              {!isBusy && <Check size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
