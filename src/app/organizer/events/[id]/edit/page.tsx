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
        <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Événement introuvable</h2>
        <button
          type="button"
          onClick={() => router.push("/organizer/events")}
          className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-semibold"
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

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
        <h1 className="text-2xl font-bold text-foreground">Modifier l&apos;événement</h1>
        <p className="text-muted-foreground">{orgEvent.event.title}</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <div>
          <label htmlFor="editTitle" className="text-sm font-medium text-foreground block mb-1.5">Titre</label>
          <input id="editTitle" type="text" defaultValue={orgEvent.event.title} className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="editDesc" className="text-sm font-medium text-foreground block mb-1.5">Description</label>
          <textarea id="editDesc" defaultValue={orgEvent.event.description} rows={4} className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
        </div>
        <div>
          <label htmlFor="editCity" className="text-sm font-medium text-foreground block mb-1.5">Ville</label>
          <input id="editCity" type="text" defaultValue={orgEvent.event.city} className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="editCover" className="text-sm font-medium text-foreground block mb-1.5">Image de couverture (URL)</label>
          <input id="editCover" type="url" defaultValue={orgEvent.event.coverImageUrl} className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
