"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  Link2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useGetAttendeeStatsQuery } from "@/store/api/tickets/tickets.api";
import { useGetEventOrdersStatsQuery } from "@/store/api/order/order.api";
import type { EventStatus } from "@/store/api/event/event.resource.type";
import { assetUrl, formatPrice, getDuration } from "@/lib/utils";
import { useEvent } from "./layout";

const STATUS_LABELS: Record<EventStatus, string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publié",
  CANCELLED: "Annulé",
  COMPLETED: "Terminé",
  REJECTED: "Rejeté",
  SUSPENDED: "Suspendu",
};

const STATUS_STYLES: Record<EventStatus, string> = {
  DRAFT: "bg-amber-50 text-amber-700",
  PUBLISHED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  COMPLETED: "bg-gray-100 text-gray-500",
  REJECTED: "bg-red-50 text-red-700",
  SUSPENDED: "bg-red-50 text-red-700",
};

function StatCard({
  label,
  value,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  accent?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
        <Icon size={16} className="text-gray-300" />
      </div>
      <p className={`mt-2 text-2xl font-bold ${accent ?? "text-gray-900"}`}>{value}</p>
    </div>
  );
}

function DetailRow({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <div className="text-sm text-gray-700 flex items-start gap-2">
        {Icon ? <Icon size={14} className="text-gray-400 mt-0.5 shrink-0" /> : null}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const event = useEvent();
  const { data: stats } = useGetAttendeeStatsQuery(event.id);
  const { data: orderStats } = useGetEventOrdersStatsQuery(event.id);
  const category = event.category ?? null;

  const totalAttendees = stats?.total ?? 0;
  const checkedIn = stats?.checkedIn ?? 0;
  // Net revenue: completed payments minus completed refunds.
  const revenue = (orderStats?.revenue ?? 0) - (orderStats?.refunded ?? 0);
  const remaining = Math.max(0, event.capacity - totalAttendees);

  const startDate = format(new Date(event.startDatetime), "EEEE d MMMM yyyy", { locale: fr });
  const startTime = format(new Date(event.startDatetime), "HH:mm", { locale: fr });
  const endDate = event.endDatetime
    ? format(new Date(event.endDatetime), "EEEE d MMMM yyyy", { locale: fr })
    : null;
  const endTime = event.endDatetime
    ? format(new Date(event.endDatetime), "HH:mm", { locale: fr })
    : null;
  const duration = event.endDatetime
    ? getDuration(event.startDatetime, event.endDatetime)
    : null;

  const createdAt = format(new Date(event.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr });
  const updatedAt = format(new Date(event.updatedAt), "d MMMM yyyy 'à' HH:mm", { locale: fr });
  const featuredUntil = event.featuredUntil
    ? format(new Date(event.featuredUntil), "d MMMM yyyy", { locale: fr })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Hero */}
      <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="relative h-48 sm:h-60 w-full bg-gray-100">
          {event.coverImageUrl ? (
            <Image
              src={assetUrl(event.coverImageUrl)}
              alt={event.title}
              fill
              sizes="(min-width: 1024px) 800px, 100vw"
              className="object-cover"
              priority
            />
          ) : null}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[event.status as EventStatus]}`}
            >
              {STATUS_LABELS[event.status as EventStatus]}
            </span>
            {category ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-gray-700">
                {category.name}
              </span>
            ) : null}
            {event.isFeatured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                <Sparkles size={12} />
                Mis en avant
              </span>
            ) : null}
          </div>
        </div>
        <div className="px-6 py-5">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{event.title}</h1>
            {event.shortDescription ? (
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{event.shortDescription}</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Participants" value={String(totalAttendees)} icon={Users} />
        <StatCard
          label="Enregistrés"
          value={String(checkedIn)}
          accent="text-emerald-600"
          icon={Ticket}
        />
        <StatCard
          label="Revenu"
          value={formatPrice(revenue)}
          accent="text-emerald-600"
          icon={Wallet}
        />
        <StatCard label="Places restantes" value={String(remaining)} icon={Users} />
      </div>

      {/* Details */}
      <section className="bg-white rounded-2xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Détails de l&apos;événement</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <DetailRow label="Description">
              <p className="leading-relaxed whitespace-pre-line">
                {event.description || "—"}
              </p>
            </DetailRow>
            <DetailRow label="Catégorie">
              {category ? category.name : "—"}
            </DetailRow>
            <DetailRow label="Âge minimum" icon={ShieldCheck}>
              {event.minAge > 0 ? `${event.minAge} ans` : "Tout public"}
            </DetailRow>
            <DetailRow label="Capacité" icon={Users}>
              {event.capacity.toLocaleString()} places
            </DetailRow>
          </div>
          <div className="space-y-4">
            <DetailRow label="Début" icon={Calendar}>
              <p className="capitalize">{startDate}</p>
              <p className="text-gray-500 flex items-center gap-1.5 mt-1">
                <Clock size={12} className="text-gray-400" />
                {startTime}
              </p>
            </DetailRow>
            <DetailRow label="Fin" icon={Calendar}>
              {endDate && endTime ? (
                <>
                  <p className="capitalize">{endDate}</p>
                  <p className="text-gray-500 flex items-center gap-1.5 mt-1">
                    <Clock size={12} className="text-gray-400" />
                    {endTime}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">Non renseignée</p>
              )}
            </DetailRow>
            {duration ? (
              <DetailRow label="Durée" icon={Clock}>
                {duration}
              </DetailRow>
            ) : null}
            <DetailRow label="Lieu" icon={MapPin}>
              {event.isOnline ? (
                <>
                  <p>En ligne</p>
                  {event.onlineLink ? (
                    <a
                      href={event.onlineLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-1 text-primary hover:underline break-all"
                    >
                      <Link2 size={12} />
                      {event.onlineLink}
                    </a>
                  ) : null}
                </>
              ) : (
                <>
                  <p>{event.address || event.city || "—"}</p>
                  {event.address && event.city ? (
                    <p className="text-gray-500 mt-0.5">{event.city}</p>
                  ) : null}
                </>
              )}
            </DetailRow>
          </div>
        </div>
      </section>

      {/* Metadata */}
      <section className="bg-white rounded-2xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Informations techniques</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featuredUntil ? (
            <DetailRow label="Mis en avant jusqu'au" icon={Sparkles}>
              {featuredUntil}
            </DetailRow>
          ) : null}
          <DetailRow label="Créé le">
            {createdAt}
          </DetailRow>
          <DetailRow label="Dernière mise à jour">
            {updatedAt}
          </DetailRow>
        </div>
      </section>
    </motion.div>
  );
}
