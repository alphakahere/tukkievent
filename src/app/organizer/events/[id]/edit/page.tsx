"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetEventQuery,
  useUpdateEventMutation,
} from "@/store/api/event/event.api";
import { useListVisitorEventCategoriesQuery } from "@/store/api/event-categories/event-categories.api";
import type { UpdateEventPayload } from "@/store/api/event/event.resource.type";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const { data: event, isLoading, isError } = useGetEventQuery(eventId, { skip: !eventId });
  const { data: categories = [] } = useListVisitorEventCategoriesQuery();
  const [updateEvent, { isLoading: isSaving }] = useUpdateEventMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [capacity, setCapacity] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (!event) return;
    setTitle(event.title);
    setDescription(event.description ?? "");
    setCity(event.city ?? "");
    setAddress(event.address ?? "");
    setCoverImageUrl(event.coverImageUrl ?? "");
    setThumbnailUrl(event.thumbnailUrl ?? "");
    setCapacity(String(event.capacity));
    setCategoryId(event.categoryId ?? "");
  }, [event]);

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

  async function handleSave() {
    if (!event) return;
    const patch: UpdateEventPayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      city: city.trim() || undefined,
      address: address.trim() || undefined,
      coverImageUrl: coverImageUrl.trim() || undefined,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      capacity: Number(capacity) || 0,
      categoryId: categoryId || undefined,
    };
    try {
      await updateEvent({ id: event.id, patch }).unwrap();
      toast.success("Modifications enregistrées !");
      router.push(`/organizer/events/${event.id}`);
    } catch (err) {
      const message =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: unknown }).message)
          : "Une erreur est survenue";
      toast.error(message);
    }
  }

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
        <p className="text-sm text-gray-500 mt-0.5">{event.title}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label htmlFor="editTitle" className="text-sm font-medium text-gray-700 block mb-1.5">Titre</label>
          <input id="editTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="editDesc" className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
          <textarea id="editDesc" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={`${inputClass} resize-none`} />
        </div>
        <div>
          <label htmlFor="editCategory" className="text-sm font-medium text-gray-700 block mb-1.5">Catégorie</label>
          <select id="editCategory" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
            <option value="">Aucune</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="editCity" className="text-sm font-medium text-gray-700 block mb-1.5">Ville</label>
          <input id="editCity" type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="editAddress" className="text-sm font-medium text-gray-700 block mb-1.5">Adresse</label>
          <input id="editAddress" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="editCapacity" className="text-sm font-medium text-gray-700 block mb-1.5">Capacité</label>
          <input id="editCapacity" type="number" min={0} value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="editCover" className="text-sm font-medium text-gray-700 block mb-1.5">Image de couverture (URL)</label>
          <input id="editCover" type="url" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="editThumb" className="text-sm font-medium text-gray-700 block mb-1.5">Miniature (URL)</label>
          <input id="editThumb" type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className={inputClass} />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !title.trim()}
          className="w-full py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
