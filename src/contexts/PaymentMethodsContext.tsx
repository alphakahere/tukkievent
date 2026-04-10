"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "tukki-event-payment-methods";

export type PaymentMethodType = "wave" | "orange" | "card";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  maskedIdentifier: string;
}

type PaymentMethodsContextValue = {
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void;
  removePaymentMethod: (id: string) => void;
};

const PaymentMethodsContext = createContext<PaymentMethodsContextValue | null>(null);

const defaultMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "wave",
    label: "Wave",
    maskedIdentifier: "+221 77 *** ** 67",
  },
];

export function PaymentMethodsProvider({ children }: { children: React.ReactNode }) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PaymentMethod[];
        if (Array.isArray(parsed)) {
          setPaymentMethods(parsed);
          setMounted(true);
          return;
        }
      }
    } catch {
      // ignore
    }
    setPaymentMethods(defaultMethods);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(paymentMethods));
    } catch {
      // ignore
    }
  }, [mounted, paymentMethods]);

  const addPaymentMethod = useCallback((method: Omit<PaymentMethod, "id">) => {
    const newMethod: PaymentMethod = { ...method, id: `pm-${Date.now()}` };
    setPaymentMethods((prev) => [...prev, newMethod]);
  }, []);

  const removePaymentMethod = useCallback((id: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const value: PaymentMethodsContextValue = {
    paymentMethods,
    addPaymentMethod,
    removePaymentMethod,
  };

  return (
    <PaymentMethodsContext.Provider value={value}>{children}</PaymentMethodsContext.Provider>
  );
}

export function usePaymentMethods(): PaymentMethodsContextValue {
  const ctx = useContext(PaymentMethodsContext);
  if (!ctx) throw new Error("usePaymentMethods must be used within PaymentMethodsProvider");
  return ctx;
}
