import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/store/Provider";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { PaymentMethodsProvider } from "@/contexts/PaymentMethodsContext";
import { Toaster } from "sonner";
import AppShell from "@/components/AppShell";

const inter = Inter({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "TukkiEvent - Réservez vos billets d'événements au Sénégal",
	description: "Découvrez et réservez facilement vos billets pour les meilleurs événements au Sénégal. Concerts, spectacles, conférences et plus encore - tout en un seul endroit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
		<html lang="en">
			<body className={`${inter.variable} ${geistMono.variable} antialiased`}>
			  <ReduxProvider>
				  <SettingsProvider>
					  <FavoritesProvider>
						  <OrdersProvider>
							  <NotificationsProvider>
								  <PaymentMethodsProvider>
									  <AppShell>{children}</AppShell>
									  <Toaster richColors position="top-center" />
								  </PaymentMethodsProvider>
							  </NotificationsProvider>
						  </OrdersProvider>
					  </FavoritesProvider>
				  </SettingsProvider>
			  </ReduxProvider>
			</body>
		</html>
  );
}
