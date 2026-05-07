"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Image as ImageIcon,
  Info,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useOrganizerOrg } from "@/contexts/OrganizerOrgContext";
import { useListVisitorEventCategoriesQuery } from "@/store/api/event-categories/event-categories.api";
import { useCreateEventMutation } from "@/store/api/event/event.api";
import type { CreateEventPayload } from "@/store/api/event/event.resource.type";

const STEPS = [
  "Informations générales",
  "Date & heure",
  "Billets",
  "Médias",
  "Résumé",
];

function combineDateTime(date: string, time: string): string | null {
  if (!date) return null;
  const t = time || "00:00";
  return new Date(`${date}T${t}:00`).toISOString();
}

export default function CreateEventPage() {
  const router = useRouter();
  const { activeOrgId } = useOrganizerOrg();
  const { data: categories = [], isLoading: categoriesLoading } = useListVisitorEventCategoriesQuery();
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();

  const [step, setStep] = useState(0);

  // Step 1: general info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [onlineLink, setOnlineLink] = useState("");
  const [capacity, setCapacity] = useState("");

  // Step 2: date
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  // Step 4: media
  const [coverUrl, setCoverUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Step 5: publish
  const [isDraft, setIsDraft] = useState(true);

  function canProceed(): boolean {
    if (step === 0) return title.trim().length > 0 && capacity.trim().length > 0;
    if (step === 1) return startDate.length > 0 && startTime.length > 0;
    return true;
  }

  async function handleSubmit() {
    if (!activeOrgId) {
      toast.error("Aucune organisation active");
      return;
    }

    const startDatetime = combineDateTime(startDate, startTime);
    if (!startDatetime) {
      toast.error("Date de début invalide");
      return;
    }
    const endDatetime = endDate ? combineDateTime(endDate, endTime || "23:59") : undefined;

    const payload: CreateEventPayload = {
      organizationId: activeOrgId,
      title: title.trim(),
      capacity: Number(capacity) || 0,
      startDatetime,
      status: isDraft ? "DRAFT" : "PUBLISHED",
    };
    if (description.trim()) payload.description = description.trim();
    if (categoryId) payload.categoryId = categoryId;
    if (endDatetime) payload.endDatetime = endDatetime;
    if (isOnline) {
      payload.isOnline = true;
      if (onlineLink.trim()) payload.onlineLink = onlineLink.trim();
    } else {
      if (city.trim()) payload.city = city.trim();
      if (address.trim()) payload.address = address.trim();
    }
    if (coverUrl.trim()) payload.coverImageUrl = coverUrl.trim();
    if (thumbnailUrl.trim()) payload.thumbnailUrl = thumbnailUrl.trim();

    try {
      await createEvent(payload).unwrap();
      toast.success(isDraft ? "Brouillon enregistré !" : "Événement publié !");
      router.push("/organizer/events");
    } catch (err) {
      const message =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: unknown }).message)
          : "Une erreur est survenue";
      toast.error(message);
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => (step > 0 ? setStep(step - 1) : router.push("/organizer/events"))}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          {step > 0 ? "Étape précédente" : "Retour"}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Créer un événement</h1>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Étape {step + 1} / {STEPS.length}: {STEPS[step]}
          </span>
          <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        {step === 0 && (
          <>
            <div>
              <label htmlFor="title" className="text-sm font-medium text-gray-700 block mb-1.5">Titre de l&apos;événement *</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Concert de Youssou Ndour" className={inputClass} />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Décrivez votre événement..." className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label htmlFor="category" className="text-sm font-medium text-gray-700 block mb-1.5">Catégorie</label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={categoriesLoading}
                className={inputClass}
              >
                <option value="">{categoriesLoading ? "Chargement..." : "Sélectionner une catégorie"}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="capacity" className="text-sm font-medium text-gray-700 block mb-1.5">Capacité totale *</label>
              <input
                id="capacity"
                type="number"
                min={0}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="500"
                className={inputClass}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Événement en ligne</span>
              <button type="button" role="switch" aria-checked={isOnline} onClick={() => setIsOnline(!isOnline)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isOnline ? "bg-primary" : "bg-gray-300"}`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isOnline ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            {isOnline ? (
              <div>
                <label htmlFor="onlineLink" className="text-sm font-medium text-gray-700 block mb-1.5">Lien de connexion</label>
                <input id="onlineLink" type="url" value={onlineLink} onChange={(e) => setOnlineLink(e.target.value)} placeholder="https://meet.example.com/..." className={inputClass} />
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="city" className="text-sm font-medium text-gray-700 block mb-1.5">Ville</label>
                  <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dakar" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="address" className="text-sm font-medium text-gray-700 block mb-1.5">Adresse</label>
                  <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Place de l'Obélisque" className={inputClass} />
                </div>
              </>
            )}
          </>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="text-sm font-medium text-gray-700 block mb-1.5">Date de début *</label>
              <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="startTime" className="text-sm font-medium text-gray-700 block mb-1.5">Heure de début *</label>
              <input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="endDate" className="text-sm font-medium text-gray-700 block mb-1.5">Date de fin</label>
              <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="endTime" className="text-sm font-medium text-gray-700 block mb-1.5">Heure de fin</label>
              <input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium">Configuration des billets</p>
              <p className="mt-1 text-blue-700">
                Les types de billets seront configurables depuis la page de l&apos;événement après sa création.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <>
            <div>
              <label htmlFor="coverUrl" className="text-sm font-medium text-gray-700 block mb-1.5">URL de l&apos;image de couverture</label>
              <input id="coverUrl" type="url" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://example.com/image.jpg" className={inputClass} />
              {coverUrl ? (
                <div className="mt-3 h-40 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="mt-3 h-40 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                  <div className="text-center text-gray-400">
                    <ImageIcon size={32} className="mx-auto mb-2" />
                    <p className="text-sm">Ajoutez une URL pour prévisualiser</p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="thumbnailUrl" className="text-sm font-medium text-gray-700 block mb-1.5">URL de la miniature</label>
              <input id="thumbnailUrl" type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://example.com/thumb.jpg" className={inputClass} />
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-base font-semibold text-gray-900">Résumé de l&apos;événement</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between py-2.5 border-b border-gray-100">
                <span className="text-gray-500">Titre</span>
                <span className="font-medium text-gray-900">{title || "—"}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-gray-100">
                <span className="text-gray-500">Catégorie</span>
                <span className="font-medium text-gray-900">{categories.find((c) => c.id === categoryId)?.name || "—"}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-gray-100">
                <span className="text-gray-500">Lieu</span>
                <span className="font-medium text-gray-900">{isOnline ? "En ligne" : `${city || "—"}${address ? `, ${address}` : ""}`}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-gray-100">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-900">{startDate || "—"} {startTime || ""}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-gray-100">
                <span className="text-gray-500">Capacité</span>
                <span className="font-medium text-gray-900">{capacity || "—"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Enregistrer comme brouillon</p>
                <p className="text-xs text-gray-500">L&apos;événement ne sera pas visible publiquement</p>
              </div>
              <button type="button" role="switch" aria-checked={isDraft} onClick={() => setIsDraft(!isDraft)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isDraft ? "bg-primary" : "bg-gray-300"}`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isDraft ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </>
        )}
      </motion.div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={isCreating}
            className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Précédent
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex-1 py-3 px-4 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
          >
            Suivant
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isCreating || !activeOrgId}
            className="flex-1 py-3 px-4 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            {isDraft ? "Enregistrer le brouillon" : "Publier l'événement"}
          </button>
        )}
      </div>
    </div>
  );
}
