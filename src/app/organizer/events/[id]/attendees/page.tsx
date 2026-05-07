"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Loader2, Users } from "lucide-react";
import { useGetEventQuery } from "@/store/api/event/event.api";

export default function AttendeesPage() {
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

  return (
    <div className="p-5 md:p-8 space-y-6">
      <div>
        <button
          type="button"
          onClick={() => router.push(`/organizer/events/${event.id}`)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Retour à l&apos;événement
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gestion des participants</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <Users size={26} className="text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Bientôt disponible</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          La gestion des participants et le check-in seront disponibles dès que le module de billetterie sera connecté.
        </p>
      </div>
    </div>
  );
}
