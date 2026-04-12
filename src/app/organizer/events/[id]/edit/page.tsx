"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useOrganizer } from "@/contexts/OrganizerContext";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;
  const { getEventById } = useOrganizer();

  const orgEvent = getEventById(eventId);

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

  const handleSave = () => {
    toast.success("Modifications enregistrées !");
    router.push("/organizer/events");
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Modifier l&apos;événement</h1>
        <p className="text-sm text-gray-500 mt-0.5">{orgEvent.event.title}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label htmlFor="editTitle" className="text-sm font-medium text-gray-700 block mb-1.5">Titre</label>
          <input id="editTitle" type="text" defaultValue={orgEvent.event.title} className={inputClass} />
        </div>
        <div>
          <label htmlFor="editDesc" className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
          <textarea id="editDesc" defaultValue={orgEvent.event.description} rows={4} className={`${inputClass} resize-none`} />
        </div>
        <div>
          <label htmlFor="editCity" className="text-sm font-medium text-gray-700 block mb-1.5">Ville</label>
          <input id="editCity" type="text" defaultValue={orgEvent.event.city} className={inputClass} />
        </div>
        <div>
          <label htmlFor="editCover" className="text-sm font-medium text-gray-700 block mb-1.5">Image de couverture (URL)</label>
          <input id="editCover" type="url" defaultValue={orgEvent.event.coverImageUrl} className={inputClass} />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
