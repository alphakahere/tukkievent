"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Calendar, Heart, Loader2, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import BottomNav from "@/components/BottomNav";
import AccountSidebar from "@/components/AccountSidebar";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAppSelector } from "@/store/features/hooks";
import { selectIsAuthenticated } from "@/store/selectors/auth.selectors";
import { assetUrl, formatPrice } from "@/lib/utils";
import type { FavoriteEvent } from "@/store/api/favorites/favorites.api";

export default function FavoritesPage() {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const { favorites, isLoading } = useFavorites();

	const showLogin = !isAuthenticated;
	const events = favorites.map((f) => f.event);

	return (
		<div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
			<header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-40 md:hidden">
				<div className="max-w-lg mx-auto flex items-center justify-between">
					<Link href="/" className="text-lg font-bold text-primary">
						Tukki Event
					</Link>
					<span className="text-sm font-medium text-gray-500">Favoris</span>
				</div>
			</header>

			<main className="max-w-lg md:max-w-6xl mx-auto px-4 py-6">
				<div className="md:flex md:gap-8">
					<AccountSidebar />

					<div className="flex-1">
						<h1 className="hidden md:block text-2xl font-bold text-gray-900 mb-6">
							Favoris
						</h1>

						{showLogin ? (
							<GuestPrompt />
						) : isLoading ? (
							<div className="p-10 text-center">
								<Loader2
									size={28}
									className="mx-auto text-primary animate-spin"
								/>
							</div>
						) : events.length === 0 ? (
							<EmptyState />
						) : (
							<>
								<p className="text-sm font-medium text-gray-500 mb-4">
									{events.length} événement
									{events.length !== 1 ? "s" : ""} en favori
								</p>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{events.map((event, index) => (
										<FavoriteCard
											key={event.id}
											event={event}
											delay={index * 0.04}
										/>
									))}
								</div>
							</>
						)}
					</div>
				</div>
			</main>

			<BottomNav />
		</div>
	);
}

function FavoriteCard({
	event,
	delay,
}: {
	event: FavoriteEvent;
	delay: number;
}) {
	const dateStr = format(new Date(event.startDatetime), "d MMM yyyy", {
		locale: fr,
	});
	const isPast = new Date(event.startDatetime).getTime() < Date.now();

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay }}
		>
			<Link
				href={`/events/${event.slug}`}
				className="block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors"
			>
				<div className="relative h-40">
					<Image
						src={assetUrl(event.coverImageUrl)}
						alt={event.title}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 33vw"
					/>
					{isPast && (
						<span className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white rounded-full text-xs font-semibold">
							Passé
						</span>
					)}
				</div>
				<div className="p-3 space-y-1.5">
					<p className="font-semibold text-sm text-gray-900 line-clamp-1">
						{event.title}
					</p>
					<div className="flex items-center gap-1 text-xs text-gray-500">
						<Calendar size={12} />
						<span>{dateStr}</span>
					</div>
					{event.city && (
						<div className="flex items-center gap-1 text-xs text-gray-500">
							<MapPin size={12} />
							<span className="truncate">{event.city}</span>
						</div>
					)}
					{event.minPrice !== null && (
						<p className="text-primary font-bold text-sm pt-1">
							{event.minPrice === 0 ? "Gratuit" : formatPrice(event.minPrice)}
						</p>
					)}
				</div>
			</Link>
		</motion.div>
	);
}

function EmptyState() {
	return (
		<div className="text-center py-20">
			<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Heart size={36} className="text-gray-300" />
			</div>
			<p className="text-base font-semibold text-gray-900 mb-1">
				Aucun favori pour le moment
			</p>
			<p className="text-sm text-gray-500 mb-6">
				Ajoutez des événements à vos favoris en cliquant sur le cœur
			</p>
			<Link
				href="/events"
				className="inline-block px-6 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
			>
				Découvrir les événements
			</Link>
		</div>
	);
}

function GuestPrompt() {
	return (
		<div className="text-center py-20">
			<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Heart size={36} className="text-gray-300" />
			</div>
			<p className="text-base font-semibold text-gray-900 mb-1">
				Connectez-vous pour synchroniser vos favoris
			</p>
			<p className="text-sm text-gray-500 mb-6">
				Vos favoris seront sauvegardés sur tous vos appareils.
			</p>
			<Link
				href="/auth/login?redirect=/favorites"
				className="inline-block px-6 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
			>
				Se connecter
			</Link>
		</div>
	);
}
