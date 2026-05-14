"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  CheckCircle,
  XCircle,
  Download,
  Users,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCheckInTicketMutation,
  useGetAttendeeStatsQuery,
  useListEventAttendeesQuery,
} from "@/store/api/tickets/tickets.api";
import { TicketStatus } from "@/store/api/event/event.type";
import type { Attendee } from "@/store/api/tickets/tickets.type";
import { getApiErrorMessage } from "@/store/api/auth/error";
import { useAppSelector } from "@/store/features/hooks";
import { selectAccessToken } from "@/store/selectors/auth.selectors";
import { useEvent } from "../layout";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const PAGE_SIZE = 20;

function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function holderName(a: Attendee): string {
  const parts = [a.holderFirstName, a.holderLastName].filter(Boolean);
  return parts.join(" ").trim() || "—";
}

function holderInitials(a: Attendee): string {
  const first = a.holderFirstName?.[0] ?? "";
  const last = a.holderLastName?.[0] ?? "";
  return (first + last).toUpperCase() || "?";
}

export default function AttendeesPage() {
  const event = useEvent();
  const eventId = event.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounced(searchQuery, 300);

  // Reset to page 1 whenever the user narrows the result set.
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, statusFilter]);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      ...(debouncedQuery.trim() && { q: debouncedQuery.trim() }),
      ...(statusFilter !== "ALL" && { status: statusFilter }),
    }),
    [page, debouncedQuery, statusFilter],
  );

  const {
    data: attendeesPage,
    isLoading: attendeesLoading,
    isFetching: attendeesFetching,
    error: attendeesError,
  } = useListEventAttendeesQuery(
    { eventId, params: listParams },
    { skip: !eventId },
  );

  const { data: stats } = useGetAttendeeStatsQuery(eventId, { skip: !eventId });

  const [checkInTicket, { isLoading: checkInLoading }] =
    useCheckInTicketMutation();

  const accessToken = useAppSelector(selectAccessToken);
  const [exporting, setExporting] = useState(false);

  const handleCheckIn = async (attendee: Attendee) => {
    try {
      await checkInTicket({
        eventId,
        ticketId: attendee.id,
        checkedIn: attendee.status !== TicketStatus.USED,
      }).unwrap();
      toast.success(
        attendee.status === TicketStatus.USED
          ? "Check-in annulé"
          : "Participant enregistré",
      );
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Impossible de mettre à jour"));
    }
  };

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const qs = params.toString();
      const res = await fetch(
        `${API_BASE_URL}/events/${eventId}/attendees/export${qs ? `?${qs}` : ""}`,
        {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : undefined,
        },
      );
      if (!res.ok) {
        let message = `Échec de l'export (${res.status})`;
        try {
          const body = (await res.json()) as { message?: string };
          if (body?.message) message = body.message;
        } catch {
          /* response wasn't JSON */
        }
        throw new Error(message);
      }
      const blob = await res.blob();
      const filename =
        /filename="?([^";]+)"?/.exec(
          res.headers.get("content-disposition") ?? "",
        )?.[1] ?? `participants-${eventId}.csv`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Export téléchargé");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'exporter",
      );
    } finally {
      setExporting(false);
    }
  };

  const attendees = attendeesPage?.data ?? [];
  const totalPages = attendeesPage?.meta.totalPages ?? 1;
  const total = stats?.total ?? attendeesPage?.meta.total ?? 0;
  const checkedIn = stats?.checkedIn ?? 0;
  const pending = stats?.pending ?? Math.max(0, total - checkedIn);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs font-medium text-gray-500 mt-0.5">
            Total participants
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{checkedIn}</p>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Enregistrés</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{pending}</p>
          <p className="text-xs font-medium text-gray-500 mt-0.5">En attente</p>
        </div>
      </div>

      {/* Search + filter + export */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, email, numéro..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as TicketStatus | "ALL")
          }
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        >
          <option value="ALL">Tous les statuts</option>
          <option value={TicketStatus.VALID}>Valides</option>
          <option value={TicketStatus.USED}>Enregistrés</option>
          <option value={TicketStatus.CANCELLED}>Annulés</option>
          <option value={TicketStatus.REFUNDED}>Remboursés</option>
        </select>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          Exporter CSV
        </button>
      </div>

      {/* Attendees table / list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="hidden md:grid md:grid-cols-[1fr_1fr_120px_100px_80px] gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
          <span>Participant</span>
          <span>Email</span>
          <span>Billet</span>
          <span>Statut</span>
          <span>Action</span>
        </div>

        {attendeesError ? (
          <div className="p-10 text-center">
            <AlertCircle size={40} className="mx-auto text-red-300 mb-3" />
            <p className="text-gray-700 font-medium mb-1">
              Impossible de charger les participants
            </p>
            <p className="text-sm text-gray-500">
              {getApiErrorMessage(attendeesError, "Réessayez dans un instant")}
            </p>
          </div>
        ) : attendeesLoading ? (
          <div className="p-10 text-center">
            <Loader2
              size={28}
              className="mx-auto text-primary animate-spin mb-3"
            />
            <p className="text-sm text-gray-500">Chargement des participants…</p>
          </div>
        ) : attendees.length === 0 ? (
          <div className="p-10 text-center">
            <Users size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Aucun participant trouvé</p>
          </div>
        ) : (
          <div
            className={`divide-y divide-gray-100 ${attendeesFetching ? "opacity-60 transition-opacity" : ""}`}
          >
            {attendees.map((attendee, index) => {
              const used = attendee.status === TicketStatus.USED;
              const canCheckIn =
                attendee.status === TicketStatus.VALID ||
                attendee.status === TicketStatus.USED;
              return (
                <motion.div
                  key={attendee.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="p-4 md:px-6 md:py-3.5 md:grid md:grid-cols-[1fr_1fr_120px_100px_80px] md:gap-4 md:items-center"
                >
                  {/* Mobile layout */}
                  <div className="md:hidden flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {holderName(attendee)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {attendee.holderEmail ?? "—"}
                      </p>
                      <p className="text-xs text-gray-400 font-mono mt-1">
                        {attendee.ticketNumber ?? "—"} ·{" "}
                        {attendee.ticketType.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {used ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                          <CheckCircle size={14} /> Entré
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                          <XCircle size={14} /> Valide
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleCheckIn(attendee)}
                        disabled={checkInLoading || !canCheckIn}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          used
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {used ? "Annuler" : "Check-in"}
                      </button>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">
                      {holderInitials(attendee)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {holderName(attendee)}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        {attendee.ticketNumber ?? "—"}
                      </p>
                    </div>
                  </div>
                  <p className="hidden md:block text-sm text-gray-500 truncate">
                    {attendee.holderEmail ?? "—"}
                  </p>
                  <p className="hidden md:block text-sm text-gray-700">
                    {attendee.ticketType.name}
                  </p>
                  <div className="hidden md:block">
                    {used ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <CheckCircle size={14} /> Entré
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                        <XCircle size={14} /> Valide
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCheckIn(attendee)}
                    disabled={checkInLoading || !canCheckIn}
                    className={`hidden md:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      used
                        ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {used ? "Annuler" : "Check-in"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {attendeesPage && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Page {attendeesPage.meta.page} sur {totalPages} ·{" "}
              {attendeesPage.meta.total} participant
              {attendeesPage.meta.total > 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || attendeesFetching}
                className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Page précédente"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || attendeesFetching}
                className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Page suivante"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
