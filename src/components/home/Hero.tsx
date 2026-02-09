"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, MapPin } from "lucide-react";
import { Event } from "@/store/api/event/event.type";
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

  return (
    <section className="px-4 py-6">
      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory max-w-lg mx-auto">
        {displayEvents.map((event) => (
          <div key={event.id} className="snap-center flex-shrink-0">
            <Link
              href={`/events/${event.slug}`}
              className="block w-[280px] sm:w-80 h-48 rounded-2xl overflow-hidden relative group"
            >
              <Image
                src={event.coverImageUrl}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                width={320}
                height={192}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              {event.isFeatured && (
                <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <TrendingUp size={12} />
                  TENDANCE
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg mb-1 line-clamp-2">{event.title}</h3>
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

      {displayEvents.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {displayEvents.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${index === currentSlide % displayEvents.length
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
                }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
