"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Plus,
  Calendar,
  Copy,
  Eye,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOrganizerOrg } from "@/contexts/OrganizerOrgContext";
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useListEventsQuery,
} from "@/store/api/event/event.api";
import type {
  CreateEventPayload,
  EventResource,
  EventStatus,
} from "@/store/api/event/event.resource.type";
import { formatPrice } from "@/lib/utils";

type TabId = "all" | "PUBLISHED" | "DRAFT" | "COMPLETED";

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
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function EventRow({ event }: { event: EventResource }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [duplicateEvent, { isLoading: isDuplicating }] = useCreateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const start = new Date(event.startDatetime);
  const dayNumber = format(start, "d");
  const monthShort = format(start, "MMM", { locale: fr }).toUpperCase().replace(".", "");
  const dateTimeLabel = format(start, "d MMMM yyyy HH:mm", { locale: fr });
  const relative = formatDistanceToNow(start, { locale: fr, addSuffix: true });
  const attendees = 0;
  const revenue = 0;

  async function handleDuplicate() {
    setMenuOpen(false);
    const payload: CreateEventPayload = {
      organizationId: event.organizationId,
      title: `Copie - ${event.title}`,
      startDatetime: event.startDatetime,
      capacity: event.capacity,
      status: "DRAFT",
    };
    if (event.categoryId) payload.categoryId = event.categoryId;
    if (event.description) payload.description = event.description;
    if (event.shortDescription) payload.shortDescription = event.shortDescription;
    if (event.endDatetime) payload.endDatetime = event.endDatetime;
    if (event.address) payload.address = event.address;
    if (event.city) payload.city = event.city;
    if (event.isOnline) payload.isOnline = true;
    if (event.onlineLink) payload.onlineLink = event.onlineLink;
    if (event.coverImageUrl) payload.coverImageUrl = event.coverImageUrl;
    if (event.thumbnailUrl) payload.thumbnailUrl = event.thumbnailUrl;
    if (event.minAge) payload.minAge = event.minAge;

    try {
      await duplicateEvent(payload).unwrap();
      toast.success("Événement dupliqué");
    } catch {
      toast.error("Impossible de dupliquer l'événement");
    }
  }

  function openDeleteConfirm() {
    setMenuOpen(false);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    try {
      await deleteEvent(event.id).unwrap();
      toast.success("Événement supprimé");
      setConfirmOpen(false);
    } catch {
      toast.error("Impossible de supprimer l'événement");
    }
  }

  return (
		<div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden flex items-stretch hover:border-gray-300 transition-colors">
			{/* Stretched link covers the whole card */}
			<Link
				href={`/organizer/events/${event.id}`}
				aria-label={event.title}
				className="absolute inset-0 z-0"
			/>

			{/* Cover image + date badge + status pill */}
			<div className="relative h-32 w-40 sm:w-48 shrink-0 bg-gray-100">
				{event.coverImageUrl ? (
					<Image
						src={event.coverImageUrl}
						alt={event.title}
						fill
						sizes="192px"
						className="object-cover"
					/>
				) : null}
				<span className="absolute top-2.5 left-2.5">
					<StatusBadge
						status={event.status as EventStatus}
					/>
				</span>
				<span className="absolute bottom-2.5 left-2.5 bg-white rounded-lg px-2.5 py-1 text-center shadow-sm">
					<span className="block text-base font-bold leading-none text-gray-900">
						{dayNumber}
					</span>
					<span className="block text-[10px] font-semibold leading-none mt-0.5 text-gray-500">
						{monthShort}
					</span>
				</span>
			</div>

			{/* Middle: title + date */}
			<div className="flex-1 min-w-0 px-5 py-4 flex flex-col justify-center">
				<p className="font-semibold text-gray-900 line-clamp-1">
					{event.title}
				</p>
				<div className="mt-1.5 text-sm text-gray-700">
					{dateTimeLabel}{" "}
					<span className="text-gray-400">
						({relative})
					</span>
				</div>
			</div>

			{/* Right: stats + menu — z-10 to sit above the stretched link */}
			<div className="relative z-10 shrink-0 hidden md:flex items-center gap-8 pr-5">
				<div className="text-center">
					<div className="text-lg font-bold text-gray-900 leading-tight">
						{attendees}
					</div>
					<div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-0.5">
						Participants
					</div>
				</div>
				<div className="text-center">
					<div className="text-lg font-bold text-emerald-600 leading-tight">
						{formatPrice(revenue)}
					</div>
					<div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-0.5">
						Revenu
					</div>
				</div>
				<Popover open={menuOpen} onOpenChange={setMenuOpen}>
					<PopoverTrigger asChild>
						<button
							type="button"
							aria-label="Actions"
							className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
						>
							<MoreVertical size={18} />
						</button>
					</PopoverTrigger>
					<PopoverContent align="end" className="w-56 p-1">
						<Link
							href={`/events/${event.slug}`}
							onClick={() => setMenuOpen(false)}
							className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
						>
							<Eye
								size={16}
								className="text-gray-400"
							/>
							Voir la page de l&apos;événement
						</Link>
						<button
							type="button"
							onClick={handleDuplicate}
							disabled={isDuplicating}
							className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
						>
							<Copy
								size={16}
								className="text-gray-400"
							/>
							Dupliquer
						</button>
						<button
							type="button"
							onClick={openDeleteConfirm}
							disabled={isDeleting}
							className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
						>
							<Trash2 size={16} />
							Supprimer
						</button>
					</PopoverContent>
				</Popover>
			</div>
			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Supprimer cet événement ?"
				description={
					<>
						Cette action est irréversible.{" "}
						<strong>{event.title}</strong> et toutes ses
						données associées seront définitivement
						supprimés.
					</>
				}
				confirmLabel="Supprimer"
				destructive
				loading={isDeleting}
				onConfirm={handleDelete}
			/>
		</div>
  );
}

export default function OrganizerEventsPage() {
  const { activeOrgId } = useOrganizerOrg();
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const { data, isLoading } = useListEventsQuery(
    activeOrgId ? { organizationId: activeOrgId, limit: 50 } : undefined,
    { skip: !activeOrgId },
  );

  const events = data?.data ?? [];

  const filteredEvents =
    activeTab === "all" ? events : events.filter((e) => e.status === activeTab);

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "all", label: "Tous", count: events.length },
    { id: "PUBLISHED", label: "Publiés", count: events.filter((e) => e.status === "PUBLISHED").length },
    { id: "DRAFT", label: "Brouillons", count: events.filter((e) => e.status === "DRAFT").length },
    { id: "COMPLETED", label: "Terminés", count: events.filter((e) => e.status === "COMPLETED").length },
  ];

  return (
    <div className="p-5 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Événements</h1>
        <Link
          href="/organizer/events/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Créer un événement</span>
          <span className="sm:hidden">Créer</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Events list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="text-primary animate-spin" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun événement</h3>
          <p className="text-gray-500 mb-6">Commencez par créer votre premier événement</p>
          <Link
            href="/organizer/events/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Créer un événement
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <EventRow event={event} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
