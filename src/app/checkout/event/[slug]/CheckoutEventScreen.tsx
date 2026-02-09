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
} from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrdersContext";
import type { Event } from "@/store/api/event/event.type";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TicketSelection {
  ticketId: string;
  name: string;
  price: number;
  quantity: number;
}

type Props = { event: Event };

export default function CheckoutEventScreen({ event }: Props) {
  const router = useRouter();
  const { addOrder } = useOrders();
  const [currentStep, setCurrentStep] = useState(1);
  const [ticketSelections, setTicketSelections] = useState<TicketSelection[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    paymentMethod: "wave",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalTickets = ticketSelections.reduce((sum, ts) => sum + ts.quantity, 0);
  const totalPrice = ticketSelections.reduce((sum, ts) => sum + ts.price * ts.quantity, 0);
  const serviceFee = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + serviceFee;

  const handleTicketQuantityChange = (
    ticketId: string,
    name: string,
    price: number,
    delta: number
  ) => {
    setTicketSelections((prev) => {
      const existing = prev.find((ts) => ts.ticketId === ticketId);
      if (existing) {
        const newQuantity = Math.max(0, Math.min(10, existing.quantity + delta));
        if (newQuantity === 0) return prev.filter((ts) => ts.ticketId !== ticketId);
        return prev.map((ts) =>
          ts.ticketId === ticketId ? { ...ts, quantity: newQuantity } : ts
        );
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
    else if (!/^(\+221)?[0-9]{9}$/.test(formData.phone.replace(/\s/g, "")))
      newErrors.phone = "Numéro invalide (format: +221 77 123 45 67)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (totalTickets === 0) {
        toast.error("Veuillez sélectionner au moins un billet");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
      else toast.error("Veuillez remplir tous les champs correctement");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleConfirmPayment = () => {
    toast.loading("Traitement du paiement...");
    setTimeout(() => {
      toast.dismiss();
      const orderId = `ORD-${Date.now()}`;
      addOrder({
        orderId,
        event,
        tickets: ticketSelections,
        total: grandTotal,
        formData,
        createdAt: new Date().toISOString(),
      });
      toast.success("Paiement confirmé !");
      router.push(`/checkout/success?orderId=${orderId}`);
    }, 2000);
  };

  const progressPercentage = (currentStep / 3) * 100;
  const tickets = event.ticketTypes || [];
  const available = (tt: { availableQuantity?: number }) => tt.availableQuantity ?? 99;

  return (
    <div className="min-h-screen bg-muted pb-32">
      <header className="bg-card px-4 pt-12 pb-4 sticky top-0 z-50 shadow-sm border-b border-border">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => (currentStep === 1 ? router.back() : handlePreviousStep())}
              className="p-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-lg text-foreground">Réservation</h1>
              <p className="text-sm text-muted-foreground">
                Étape {currentStep}/3 -{" "}
                {currentStep === 1 ? "Billets" : currentStep === 2 ? "Informations" : "Paiement"}
              </p>
            </div>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute h-full bg-primary rounded-full"
            />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 mb-6 shadow-sm border border-border"
        >
          <div className="flex gap-4">
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              width={80}
              height={80}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground mb-1 line-clamp-1">{event.title}</h3>
              <p className="text-sm text-muted-foreground mb-1">
                {format(new Date(event.startDatetime), "EEEE d MMMM · HH:mm", { locale: fr })}
              </p>
              <p className="text-sm text-muted-foreground">
                {event.city || event.address}
              </p>
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
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h2 className="font-bold text-xl text-foreground mb-4">Sélectionnez vos billets</h2>
              {tickets.map((ticket) => {
                const quantity = getTicketQuantity(ticket.id);
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-xl p-4 shadow-sm border border-border"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{ticket.name}</h3>
                        {ticket.description && (
                          <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                        )}
                        <p className="font-bold text-primary">
                          {ticket.price === 0
                            ? "Gratuit"
                            : `${ticket.price.toLocaleString()} FCFA`}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {available(ticket)} disponibles
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-muted rounded-lg p-2">
                      <span className="text-sm font-medium text-muted-foreground">Quantité</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleTicketQuantityChange(ticket.id, ticket.name, ticket.price, -1)
                          }
                          disabled={quantity === 0}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-card border border-border disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} className="text-primary" />
                        </button>
                        <span className="w-8 text-center font-semibold text-foreground">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleTicketQuantityChange(ticket.id, ticket.name, ticket.price, 1)
                          }
                          disabled={
                            quantity >= 10 || quantity >= available(ticket)
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    {quantity > 0 && (
                      <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Sous-total</span>
                        <span className="font-bold text-foreground">
                          {(ticket.price * quantity).toLocaleString()} FCFA
                        </span>
                      </div>
                    )}
                  </motion.div>
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
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h2 className="font-bold text-xl text-foreground mb-4">Vos informations</h2>
              <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      setErrors({ ...errors, fullName: "" });
                    }}
                    placeholder="Ex: Amadou Diallo"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground ${
                      errors.fullName ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setErrors({ ...errors, email: "" });
                    }}
                    placeholder="exemple@email.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground ${
                      errors.email ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      setErrors({ ...errors, phone: "" });
                    }}
                    placeholder="+221 77 123 45 67"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground ${
                      errors.phone ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.phone}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Votre billet sera envoyé par SMS et email
                  </p>
                </div>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                <h3 className="font-semibold text-foreground mb-3">Récapitulatif</h3>
                <div className="space-y-2">
                  {ticketSelections.map((ts) => (
                    <div key={ts.ticketId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {ts.name} × {ts.quantity}
                      </span>
                      <span className="font-medium text-foreground">
                        {(ts.price * ts.quantity).toLocaleString()} FCFA
                      </span>
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
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h2 className="font-bold text-xl text-foreground mb-4">Mode de paiement</h2>
              {["wave", "orange", "card"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: method })}
                  className={`w-full bg-card rounded-xl p-4 shadow-sm border-2 transition-all text-left ${
                    formData.paymentMethod === method
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        method === "wave"
                          ? "bg-[#00A9E0]/10"
                          : method === "orange"
                            ? "bg-[#FF7900]/10"
                            : "bg-secondary/10"
                      }`}
                    >
                      {method === "card" ? (
                        <CreditCard size={24} className="text-secondary" />
                      ) : (
                        <Smartphone
                          size={24}
                          className={
                            method === "wave" ? "text-[#00A9E0]" : "text-[#FF7900]"
                          }
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {method === "wave"
                          ? "Wave"
                          : method === "orange"
                            ? "Orange Money"
                            : "Carte Bancaire"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {method === "card" ? "Visa, Mastercard" : "Paiement mobile"}
                      </p>
                    </div>
                    {formData.paymentMethod === method && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check size={16} className="text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
              <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                <h3 className="font-semibold text-foreground mb-4">Détails de la commande</h3>
                <div className="space-y-3">
                  {ticketSelections.map((ts) => (
                    <div key={ts.ticketId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {ts.name} × {ts.quantity}
                      </span>
                      <span className="font-medium text-foreground">
                        {(ts.price * ts.quantity).toLocaleString()} FCFA
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Frais de service (5%)</span>
                      <span className="font-medium text-foreground">
                        {serviceFee.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-primary text-lg">
                        {grandTotal.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-tukki-success/10 rounded-xl p-4 flex gap-3 border border-tukki-success/20">
                <div className="w-10 h-10 bg-tukki-success rounded-full flex items-center justify-center shrink-0">
                  <Check size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Paiement sécurisé</h4>
                  <p className="text-sm text-muted-foreground">
                    Vos informations sont cryptées. Vos billets seront envoyés après confirmation.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-4 z-40">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Total ({totalTickets} billet{totalTickets > 1 ? "s" : ""})
              </p>
              <p className="font-bold text-xl text-foreground">
                {grandTotal.toLocaleString()} FCFA
              </p>
            </div>
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
              >
                Continuer
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
              >
                Confirmer le paiement
                <Check size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
