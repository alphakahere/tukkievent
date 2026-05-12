"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDeleteEventMutation,
  useUpdateEventMutation,
} from "@/store/api/event/event.api";
import { useListVisitorEventCategoriesQuery } from "@/store/api/event-categories/event-categories.api";
import type { UpdateEventPayload } from "@/store/api/event/event.resource.type";
import { useEvent } from "../layout";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

export default function SettingsPage() {
  const event = useEvent();
  const router = useRouter();
  const { data: categories = [] } = useListVisitorEventCategoriesQuery();
  const [updateEvent, { isLoading: isSaving }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [capacity, setCapacity] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    setTitle(event.title);
    setDescription(event.description ?? "");
    setCity(event.city ?? "");
    setAddress(event.address ?? "");
    setCoverImageUrl(event.coverImageUrl ?? "");
    setThumbnailUrl(event.thumbnailUrl ?? "");
    setCapacity(String(event.capacity));
    setCategoryId(event.categoryId ?? "");
  }, [event]);

  async function handleSave() {
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
    } catch (err) {
      const message =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: unknown }).message)
          : "Une erreur est survenue";
      toast.error(message);
    }
  }

  async function handleDelete() {
    const ok = window.confirm(
      `Supprimer définitivement "${event.title}" ? Cette action est irréversible.`,
    );
    if (!ok) return;
    try {
      await deleteEvent(event.id).unwrap();
      toast.success("Événement supprimé");
      router.push("/organizer/events");
    } catch {
      toast.error("Impossible de supprimer l'événement");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Edit form */}
      <section className="bg-white rounded-2xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Informations</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Mettez à jour les informations principales de votre événement.
          </p>
        </div>
        <div className="p-6 space-y-5">
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
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="editCategory">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="editCity" className="text-sm font-medium text-gray-700 block mb-1.5">Ville</label>
              <input id="editCity" type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="editAddress" className="text-sm font-medium text-gray-700 block mb-1.5">Adresse</label>
              <input id="editAddress" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="editCapacity" className="text-sm font-medium text-gray-700 block mb-1.5">Capacité</label>
            <input id="editCapacity" type="number" min={0} value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="editCover" className="text-sm font-medium text-gray-700 block mb-1.5">Image de couverture (URL)</label>
              <input id="editCover" type="url" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="editThumb" className="text-sm font-medium text-gray-700 block mb-1.5">Miniature (URL)</label>
              <input id="editThumb" type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !title.trim()}
              className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              Enregistrer
            </button>
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-white rounded-2xl border border-red-200">
        <div className="px-6 py-4 border-b border-red-100">
          <h2 className="text-base font-semibold text-red-700">Zone de danger</h2>
          <p className="text-xs text-red-600/80 mt-0.5">
            Les actions ci-dessous sont irréversibles.
          </p>
        </div>
        <div className="p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-gray-900">Supprimer cet événement</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Toutes les données associées seront définitivement perdues.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Supprimer
          </button>
        </div>
      </section>
    </motion.div>
  );
}
