"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "tukki-event-settings";

export type Currency = "XOF" | "EUR";
export type Theme = "light" | "dark";

export interface Settings {
  theme: Theme;
  currency: Currency;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
}

const defaultSettings: Settings = {
  theme: "light",
  currency: "XOF",
  notifications: {
    push: true,
    email: true,
    sms: false,
  },
};

type SettingsContextValue = {
  settings: Settings;
  updateTheme: (theme: Theme) => void;
  updateCurrency: (currency: Currency) => void;
  updateNotificationPref: (key: keyof Settings["notifications"], value: boolean) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Settings;
        if (parsed && typeof parsed === "object") {
          const merged = { ...defaultSettings, ...parsed, notifications: { ...defaultSettings.notifications, ...parsed.notifications } };
          setSettings(merged);
          applyTheme(merged.theme);
          setMounted(true);
          return;
        }
      }
    } catch {
      // ignore
    }
    applyTheme(defaultSettings.theme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [mounted, settings]);

  function applyTheme(theme: Theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  const updateTheme = useCallback((theme: Theme) => {
    applyTheme(theme);
    setSettings((prev) => ({ ...prev, theme }));
  }, []);

  const updateCurrency = useCallback((currency: Currency) => {
    setSettings((prev) => ({ ...prev, currency }));
  }, []);

  const updateNotificationPref = useCallback(
    (key: keyof Settings["notifications"], value: boolean) => {
      setSettings((prev) => ({
        ...prev,
        notifications: { ...prev.notifications, [key]: value },
      }));
    },
    []
  );

  const value: SettingsContextValue = {
    settings,
    updateTheme,
    updateCurrency,
    updateNotificationPref,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
