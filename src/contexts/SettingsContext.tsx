"use client";

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/store/features/hooks";
import { selectIsAuthenticated } from "@/store/selectors/auth.selectors";
import {
	useGetMySettingsQuery,
	useUpdateMySettingsMutation,
} from "@/store/api/user-settings/user-settings.api";

const STORAGE_KEY = "tukki-event-settings";

export type Currency = "XOF" | "EUR";
export type Theme = "light" | "dark";

export interface Settings {
	theme: Theme;
	currency: Currency;
	notifications: {
		push: boolean;
		email: boolean;
		/** SMS is a UI-only toggle — no backend support. */
		sms: boolean;
	};
}

const defaultSettings: Settings = {
	theme: "light",
	currency: "XOF",
	notifications: { push: true, email: true, sms: false },
};

type SettingsContextValue = {
	settings: Settings;
	updateTheme: (theme: Theme) => void;
	updateCurrency: (currency: Currency) => void;
	updateNotificationPref: (
		key: keyof Settings["notifications"],
		value: boolean,
	) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function applyTheme(theme: Theme) {
	if (typeof document === "undefined") return;
	if (theme === "dark") document.documentElement.classList.add("dark");
	else document.documentElement.classList.remove("dark");
}

function loadLocal(): Settings {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw) as Settings;
			if (parsed && typeof parsed === "object") {
				return {
					...defaultSettings,
					...parsed,
					notifications: {
						...defaultSettings.notifications,
						...parsed.notifications,
					},
				};
			}
		}
	} catch {
		/* ignore */
	}
	return defaultSettings;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const [local, setLocal] = useState<Settings>(defaultSettings);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const loaded = loadLocal();
		setLocal(loaded);
		applyTheme(loaded.theme);
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
		} catch {
			/* ignore */
		}
	}, [mounted, local]);

	const { data: serverSettings } = useGetMySettingsQuery(undefined, {
		skip: !isAuthenticated,
	});
	const [updateSettings] = useUpdateMySettingsMutation();

	const settings = useMemo<Settings>(() => {
		if (!isAuthenticated || !serverSettings) return local;
		return {
			...local,
			currency:
				serverSettings.preferredCurrency === "USD"
					? "XOF"
					: serverSettings.preferredCurrency,
			notifications: {
				push: serverSettings.notificationsPush,
				email: serverSettings.notificationsEmail,
				sms: local.notifications.sms,
			},
		};
	}, [isAuthenticated, serverSettings, local]);

	const persistRemote = useCallback(
		(patch: Parameters<typeof updateSettings>[0]) => {
			if (!isAuthenticated) return;
			updateSettings(patch)
				.unwrap()
				.catch(() => toast.error("Impossible d'enregistrer la préférence"));
		},
		[isAuthenticated, updateSettings],
	);

	const updateTheme = useCallback((theme: Theme) => {
		applyTheme(theme);
		setLocal((prev) => ({ ...prev, theme }));
	}, []);

	const updateCurrency = useCallback(
		(currency: Currency) => {
			setLocal((prev) => ({ ...prev, currency }));
			persistRemote({ preferredCurrency: currency });
		},
		[persistRemote],
	);

	const updateNotificationPref = useCallback(
		(key: keyof Settings["notifications"], value: boolean) => {
			setLocal((prev) => ({
				...prev,
				notifications: { ...prev.notifications, [key]: value },
			}));
			if (key === "push") persistRemote({ notificationsPush: value });
			else if (key === "email") persistRemote({ notificationsEmail: value });
			// sms is local-only.
		},
		[persistRemote],
	);

	const value: SettingsContextValue = {
		settings,
		updateTheme,
		updateCurrency,
		updateNotificationPref,
	};

	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings(): SettingsContextValue {
	const ctx = useContext(SettingsContext);
	if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
	return ctx;
}
