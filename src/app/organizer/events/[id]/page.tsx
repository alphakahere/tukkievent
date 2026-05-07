"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Edit,
  Users,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  AlertCircle,
  ExternalLink,
  Tag,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useGetEventQuery } from "@/store/api/event/event.api";
import type { EventStatus } from "@/store/api/event/event.resource.type";

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

function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const { data: event, isLoading, isError } = useGetEventQuery(eventId, { skip: !eventId });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="p-6 text-center">
        <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Événement introuvable</h2>
        <button
          type="button"
          onClick={() => router.push("/organizer/events")}
          className="mt-4 px-6 py-2.5 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Retour aux événements
        </button>
      </div>
    );
  }

  const startDate = format(new Date(event.startDatetime), "EEEE d MMMM yyyy", { locale: fr });
  const startTime = format(new Date(event.startDatetime), "HH:mm", { locale: fr });
  const endTime = event.endDatetime
    ? format(new Date(event.endDatetime), "HH:mm", { locale: fr })
    : null;

  return (
    <div className="p-5 md:p-8 space-y-6">

      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/organizer/events")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Événements
        </button>
        <div className="flex items-center gap-2">
          <Link
            href={`/events/${event.slug}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Voir la page</span>
          </Link>
          <Link
            href={`/organizer/events/${event.id}/attendees`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Users size={14} />
            <span className="hidden sm:inline">Participants</span>
          </Link>
          <Link
            href={`/organizer/events/${event.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Edit size={14} />
            Modifier
          </Link>
        </div>
      </div>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        {event.coverImageUrl && (
          <div className="h-48 md:h-64 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.coverImageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={event.status} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="capitalize">{startDate}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" />
                  {startTime}{endTime ? ` – ${endTime}` : ""}
                </span>
                {event.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400" />
                    {event.address ? `${event.address}, ` : ""}{event.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Ticket types — placeholder until ticket-types API lands */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Tag size={16} className="text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">Types de billets</h2>
          </div>
          <div className="p-10 text-center">
            <Ticket size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">La gestion des billets arrive bientôt.</p>
          </div>
        </motion.div>

        {/* Capacity card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">Capacité</h2>
          </div>
          <div className="p-6">
            <p className="text-3xl font-bold text-gray-900">{event.capacity.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-0.5">places au total</p>
          </div>
        </motion.div>
      </div>

      {/* Event details */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Détails de l&apos;événement</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{event.description || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Âge minimum</p>
              <p className="text-sm text-gray-700">{event.minAge > 0 ? `${event.minAge} ans` : "Tout public"}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Date & heure</p>
              <p className="text-sm text-gray-700 capitalize">{startDate}</p>
              <p className="text-sm text-gray-500">{startTime}{endTime ? ` – ${endTime}` : ""}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Lieu</p>
              {event.isOnline ? (
                <p className="text-sm text-gray-700">En ligne</p>
              ) : (
                <>
                  <p className="text-sm text-gray-700">{event.address || event.city || "—"}</p>
                  {event.city && <p className="text-sm text-gray-500">{event.city}</p>}
                </>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Capacité totale</p>
              <p className="text-sm text-gray-700">{event.capacity.toLocaleString()} places</p>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
