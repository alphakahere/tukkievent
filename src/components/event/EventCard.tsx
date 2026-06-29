"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, TrendingUp, Heart } from "lucide-react";
import { Event } from "@/store/api/event/event.type";
import { format } from "date-fns";
import { useFavorites } from "@/contexts/FavoritesContext";
import { assetUrl } from "@/lib/utils";

function getPriceRange(event: Event): { min: number; max: number } | null {
  if (!event.ticketTypes?.length) return null;
  const prices = event.ticketTypes.map((t) => t.price).filter((p) => p != null) as number[];
  if (prices.length === 0) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

function formatPrice(price: { min: number; max: number }): string {
  if (price.min === 0) return "Gratuit";
  if (price.min === price.max) return `${price.min.toLocaleString()} FCFA`;
  return `${price.min.toLocaleString()} - ${price.max.toLocaleString()} FCFA`;
}

function isNewEvent(event: Event): boolean {
  const created = new Date(event.createdAt).getTime();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return created >= weekAgo;
}

type Props = {
  event: Event;
  compact?: boolean;
};

const EventCard: React.FC<Props> = ({ event, compact = false }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(event.id);
  const priceRange = getPriceRange(event);
  const location = event.city || event.address || "";
  const dateStr = format(new Date(event.startDatetime), "dd MMM yyyy");
  const isNew = isNewEvent(event);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(event.id);
  };

  if (compact) {
    return (
      <Link
        href={`/events/${event.slug}`}
        className="block flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors"
      >
        <div className="relative h-40">
          <Image
            src={assetUrl(event.coverImageUrl)}
            alt={event.title}
            className="w-full h-full object-cover"
            width={256}
            height={160}
          />
          {event.isFeatured && (
            <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
              <TrendingUp size={12} />
              TENDANCE
            </div>
          )}
          {isNew && !event.isFeatured && (
            <div className="absolute top-2 left-2 bg-tukki-success text-white px-2 py-1 rounded-full text-xs font-semibold">
              NOUVEAU
            </div>
          )}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <Heart
              size={16}
              className={favorite ? "fill-primary text-primary" : "text-gray-400"}
            />
          </button>
        </div>
        <div className="p-3">
          {event?.category && (
            <div className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-2">
              {event.category.name}
            </div>
          )}
          <p className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900">
            {event.title}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Calendar size={12} />
            <span>{dateStr}</span>
          </div>
          {location && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <MapPin size={12} />
              <span className="truncate">{location}</span>
            </div>
          )}
          {priceRange && (
            <div className="text-primary font-bold text-sm">{formatPrice(priceRange)}</div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/events/${event.slug}`}
      className="block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors"
    >
      <div className="relative h-48">
        <Image
          src={assetUrl(event.coverImageUrl)}
          alt={event.title}
          className="w-full h-full object-cover"
          width={600}
          height={300}
        />
        {event.isFeatured && (
          <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
            <TrendingUp size={14} />
            TENDANCE
          </div>
        )}
        {isNew && !event.isFeatured && (
          <div className="absolute top-3 left-3 bg-tukki-success text-white px-3 py-1 rounded-full text-xs font-semibold">
            NOUVEAU
          </div>
        )}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <Heart
            size={18}
            className={favorite ? "fill-primary text-primary" : "text-gray-400"}
          />
        </button>
      </div>
      <div className="p-4">
        {event?.category && (
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-2">
            {event.category.name}
          </div>
        )}
        <p className="font-semibold text-base mb-2 line-clamp-2 text-gray-900">
          {event.title}
        </p>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
          <Calendar size={14} />
          <span>{dateStr}</span>
        </div>
        {location && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin size={14} />
            <span className="truncate">{location}</span>
          </div>
        )}
        {priceRange && (
          <div className="text-primary font-bold">{formatPrice(priceRange)}</div>
        )}
      </div>
    </Link>
  );
};

export default EventCard;
