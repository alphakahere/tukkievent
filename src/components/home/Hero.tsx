"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Event } from "@/store/api/event/event.type";
import { assetUrl } from "@/lib/utils";
import { format } from "date-fns";

type HeroProps = {
  events: Event[];
};

export default function Hero({ events }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const trendingEvents = events.filter((e) => e.isFeatured).slice(0, 5);
  const displayEvents = trendingEvents.length > 0 ? trendingEvents : events.slice(0, 5);

  useEffect(() => {
    if (displayEvents.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayEvents.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayEvents.length]);

  if (displayEvents.length === 0) return null;

  const prev = () => setCurrentSlide((s) => (s - 1 + displayEvents.length) % displayEvents.length);
  const next = () => setCurrentSlide((s) => (s + 1) % displayEvents.length);

  return (
    <section className="px-4 py-6">
      {/* Mobile: horizontal scroll */}
      <div className="md:hidden flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
        {displayEvents.map((event) => (
          <div key={event.id} className="snap-center flex-shrink-0">
            <Link
              href={`/events/${event.slug}`}
              className="block w-[280px] sm:w-80 h-48 rounded-2xl overflow-hidden relative group"
            >
              <Image
                src={assetUrl(event.coverImageUrl)}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                width={320}
                height={192}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              {event.isFeatured && (
                <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <TrendingUp size={12} />
                  TENDANCE
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="font-bold text-lg mb-1 line-clamp-2">{event.title}</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="shrink-0" />
                  <span className="truncate">{event.city || event.address || "Lieu à préciser"}</span>
                </div>
                <p className="text-white/90 text-xs mt-1">
                  {format(new Date(event.startDatetime), "EEEE d MMMM · HH:mm")}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Mobile dots */}
      {displayEvents.length > 1 && (
        <div className="md:hidden flex justify-center gap-2 mt-4">
          {displayEvents.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide % displayEvents.length ? "w-8 bg-primary" : "w-2 bg-gray-300"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Desktop: large featured card + side list */}
      <div className="hidden md:grid md:grid-cols-3 gap-4 h-80">
        {/* Main featured card */}
        <Link
          href={`/events/${displayEvents[currentSlide].slug}`}
          className="col-span-2 relative rounded-2xl overflow-hidden group"
        >
          <Image
            src={assetUrl(displayEvents[currentSlide].coverImageUrl)}
            alt={displayEvents[currentSlide].title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 66vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          {displayEvents[currentSlide].isFeatured && (
            <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
              <TrendingUp size={13} />
              TENDANCE
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <p className="font-bold text-2xl mb-2 line-clamp-2">{displayEvents[currentSlide].title}</p>
            <div className="flex items-center gap-2 text-sm mb-1">
              <MapPin size={15} className="shrink-0" />
              <span className="truncate">
                {displayEvents[currentSlide].city || displayEvents[currentSlide].address || "Lieu à préciser"}
              </span>
            </div>
            <p className="text-white/80 text-sm">
              {format(new Date(displayEvents[currentSlide].startDatetime), "EEEE d MMMM · HH:mm")}
            </p>
          </div>
          {/* Prev/Next controls */}
          {displayEvents.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-colors"
                aria-label="Précédent"
              >
                <ChevronLeft size={18} className="text-white" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-colors"
                aria-label="Suivant"
              >
                <ChevronRight size={18} className="text-white" />
              </button>
            </>
          )}
          {/* Dots */}
          {displayEvents.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-1.5">
              {displayEvents.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => { e.preventDefault(); setCurrentSlide(index); }}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentSlide ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </Link>

        {/* Side list */}
        <div className="flex flex-col gap-3 overflow-hidden">
          {displayEvents.slice(0, 3).map((event, index) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              onClick={() => setCurrentSlide(index)}
              className={`flex gap-3 bg-white rounded-xl p-3 border transition-colors flex-1 items-center ${
                index === currentSlide ? "border-primary/30 bg-primary/[0.02]" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={assetUrl(event.coverImageUrl)}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold line-clamp-1 mb-0.5 ${index === currentSlide ? "text-primary" : "text-gray-900"}`}>
                  {event.title}
                </p>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {event.city || event.address || "Lieu à préciser"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {format(new Date(event.startDatetime), "d MMM · HH:mm")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
