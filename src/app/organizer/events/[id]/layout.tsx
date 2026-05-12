"use client";

import { createContext, useContext } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  ExternalLink,
  Loader2,
  Settings,
  Tag,
  Ticket as TicketIcon,
  Users,
  Wallet,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useGetEventQuery } from "@/store/api/event/event.api";
import type { EventResource, EventStatus } from "@/store/api/event/event.resource.type";

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

const EventContext = createContext<EventResource | null>(null);

export function useEvent(): EventResource {
  const event = useContext(EventContext);
  if (!event) throw new Error("useEvent must be used inside an event layout");
  return event;
}

function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
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

  const base = `/organizer/events/${event.id}`;
  const navItems = [
    { href: base, label: "Aperçu", icon: BarChart3, exact: true },
    { href: `${base}/tickets`, label: "Billets", icon: TicketIcon },
    { href: `${base}/attendees`, label: "Participants", icon: Users },
    { href: `${base}/orders`, label: "Commandes", icon: Wallet },
    { href: `${base}/promo-codes`, label: "Codes promo", icon: Tag },
    { href: `${base}/settings`, label: "Paramètres", icon: Settings },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const startDate = format(new Date(event.startDatetime), "EEE d MMM yyyy", { locale: fr });
  const startTime = format(new Date(event.startDatetime), "HH:mm", { locale: fr });

  return (
    <EventContext.Provider value={event}>
      <div className="p-5 md:p-8">
        <Link
          href="/organizer/events"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Événements
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar: event card + sub-nav */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {event.coverImageUrl && (
                <div className="h-32 w-full overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.coverImageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <StatusBadge status={event.status as EventStatus} />
                <h2 className="text-base font-semibold text-gray-900 line-clamp-2">
                  {event.title}
                </h2>
                <p className="text-xs text-gray-500 capitalize">
                  {startDate} · {startTime}
                </p>
                <Link
                  href={`/events/${event.slug}`}
                  target="_blank"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <ExternalLink size={12} />
                  Voir la page publique
                </Link>
              </div>
            </div>

            <nav className="bg-white rounded-2xl border border-gray-200 p-2 space-y-1">
              {navItems.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </EventContext.Provider>
  );
}
