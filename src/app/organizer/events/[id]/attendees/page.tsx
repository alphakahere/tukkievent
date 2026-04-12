"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Search,
  CheckCircle,
  XCircle,
  Download,
  Users,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useOrganizer } from "@/contexts/OrganizerContext";

export default function AttendeesPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;
  const { getEventById, getAttendees, checkInAttendee } = useOrganizer();
  const [searchQuery, setSearchQuery] = useState("");

  const orgEvent = getEventById(eventId);
  const attendees = getAttendees(eventId);

  if (!orgEvent) {
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

  const filtered = attendees.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.holderName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.ticketNumber.toLowerCase().includes(q)
    );
  });

  const checkedIn = attendees.filter((a) => a.status === "used").length;

  const handleCheckIn = (id: string) => {
    checkInAttendee(eventId, id);
    toast.success("Statut mis à jour");
  };

  const handleExport = () => toast.success("Export CSV en cours...");

  return (
    <div className="p-5 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => router.push("/organizer/events")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Retour aux événements
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{orgEvent.event.title}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gestion des participants</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{attendees.length}</p>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Total participants</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{checkedIn}</p>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Enregistrés</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{attendees.length - checkedIn}</p>
          <p className="text-xs font-medium text-gray-500 mt-0.5">En attente</p>
        </div>
      </div>

      {/* Search + export */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, email, numéro..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shrink-0"
        >
          <Download size={16} />
          Exporter CSV
        </button>
      </div>

      {/* Attendees table / list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Desktop table header */}
        <div className="hidden md:grid md:grid-cols-[1fr_1fr_120px_100px_80px] gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
          <span>Participant</span>
          <span>Email</span>
          <span>Billet</span>
          <span>Statut</span>
          <span>Action</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Users size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Aucun participant trouvé</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((attendee, index) => (
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
                    <p className="font-semibold text-gray-900">{attendee.holderName}</p>
                    <p className="text-xs text-gray-500">{attendee.email}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">{attendee.ticketNumber} · {attendee.ticketType}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {attendee.status === "used" ? (
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
                      onClick={() => handleCheckIn(attendee.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        attendee.status === "used"
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {attendee.status === "used" ? "Annuler" : "Check-in"}
                    </button>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {attendee.holderName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{attendee.holderName}</p>
                    <p className="text-xs text-gray-400 font-mono">{attendee.ticketNumber}</p>
                  </div>
                </div>
                <p className="hidden md:block text-sm text-gray-500 truncate">{attendee.email}</p>
                <p className="hidden md:block text-sm text-gray-700">{attendee.ticketType}</p>
                <div className="hidden md:block">
                  {attendee.status === "used" ? (
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
                  onClick={() => handleCheckIn(attendee.id)}
                  className={`hidden md:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    attendee.status === "used"
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {attendee.status === "used" ? "Annuler" : "Check-in"}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
