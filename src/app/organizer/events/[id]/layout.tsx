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
  Pencil,
  Settings,
  Tag,
  Ticket as TicketIcon,
  Users,
  Wallet,
} from "lucide-react";
import { useGetEventQuery } from "@/store/api/event/event.api";
import type { EventResource } from "@/store/api/event/event.resource.type";

const EventContext = createContext<EventResource | null>(null);

export function useEvent(): EventResource {
  const event = useContext(EventContext);
  if (!event) throw new Error("useEvent must be used inside an event layout");
  return event;
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

  // Standalone routes opt out of the sub-nav shell so they can render
  // full-screen like /events/new.
  const isStandalone = pathname.endsWith("/edit");
  if (isStandalone) {
    return (
      <EventContext.Provider value={event}>{children}</EventContext.Provider>
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

  const isPubliclyVisible = event.status === "PUBLISHED" || event.status === "COMPLETED";

  return (
    <EventContext.Provider value={event}>
      <div className="p-5 md:p-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <Link
            href="/organizer/events"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Événements
          </Link>
          <div className="flex items-center gap-2">
            {isPubliclyVisible && (
              <Link
                href={`/events/${event.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <ExternalLink size={14} />
                Voir la page publique
              </Link>
            )}
            <Link
              href={`${base}/edit`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              <Pencil size={14} />
              Modifier
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar: sub-nav */}
          <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
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
