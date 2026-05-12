"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Eye,
  Image as ImageIcon,
  Info,
  Loader2,
  MapPin,
  Plus,
  Ticket as TicketIcon,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizerOrg } from "@/contexts/OrganizerOrgContext";
import { cn } from "@/lib/utils";
import { useListVisitorEventCategoriesQuery } from "@/store/api/event-categories/event-categories.api";
import { useCreateEventMutation } from "@/store/api/event/event.api";
import type { CreateEventPayload } from "@/store/api/event/event.resource.type";

const STEPS = [
  "Informations générales",
  "Billets",
  "Résumé",
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

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
  const [sameDayEnd, setSameDayEnd] = useState(false);

  useEffect(() => {
    if (sameDayEnd) setEndDate(startDate);
  }, [sameDayEnd, startDate]);

  // Step 4: media
  const [coverUrl, setCoverUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Step Billets: ticket types (local state — backend wiring not yet available)
  type TicketDraft = { id: string; name: string; price: string; quantity: string };
  const [tickets, setTickets] = useState<TicketDraft[]>([]);

  function addTicket() {
    setTickets((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", price: "", quantity: "" },
    ]);
  }
  function updateTicket(id: string, patch: Partial<TicketDraft>) {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }
  function removeTicket(id: string) {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  }

  // Step 5: publish
  const [isDraft, setIsDraft] = useState(true);

  // Preview dialog
  const [previewOpen, setPreviewOpen] = useState(false);

  function canProceed(): boolean {
    if (step === 0)
      return (
        title.trim().length > 0 &&
        capacity.trim().length > 0 &&
        startDate.length > 0 &&
        startTime.length > 0
      );
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
    <div className="p-5 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => (step > 0 ? setStep(step - 1) : router.push("/organizer/events"))}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          {step > 0 ? "Étape précédente" : "Retour"}
        </button>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Créer un événement</h1>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            disabled={!title.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Eye size={16} />
            <span className="hidden sm:inline">Prévisualiser</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-10">
        {/* Stepper sidebar (desktop) */}
        <aside className="hidden md:block">
          <ol className="space-y-1 sticky top-6">
            {STEPS.map((label, i) => {
              const isCurrent = i === step;
              const isCompleted = i < step;
              const isClickable = i < step;
              return (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => isClickable && setStep(i)}
                    disabled={!isClickable && !isCurrent}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      isCurrent
                        ? "bg-primary/10 text-primary"
                        : isCompleted
                        ? "text-gray-700 hover:bg-gray-50 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold shrink-0 ${
                        isCurrent
                          ? "bg-primary text-white"
                          : isCompleted
                          ? "bg-primary/20 text-primary"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <Check size={14} /> : i + 1}
                    </span>
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* Right column: progress (mobile) + form */}
        <div className="space-y-6 min-w-0">
          {/* Progress (mobile only) */}
          <div className="md:hidden">
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
            className="space-y-6"
          >
        {step === 0 && (
          <Accordion
            type="multiple"
            defaultValue={["media", "info", "datetime"]}
            className="space-y-4"
          >
            {/* Section: Médias */}
            <AccordionItem value="media">
              <AccordionTrigger>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Médias</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Image de couverture et miniature pour votre événement.</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
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
              </AccordionContent>
            </AccordionItem>

            {/* Section: General info */}
            <AccordionItem value="info">
              <AccordionTrigger>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Informations générales</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Titre, description, catégorie et lieu de l&apos;événement.</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
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
                <Select
                  value={categoryId}
                  onValueChange={setCategoryId}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger id="category">
                    <SelectValue
                      placeholder={categoriesLoading ? "Chargement..." : "Sélectionner une catégorie"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              </AccordionContent>
            </AccordionItem>

            {/* Section: Date & heure */}
            <AccordionItem value="datetime">
              <AccordionTrigger>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Date & heure</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Quand votre événement commence-t-il et se termine-t-il ?</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="text-sm font-medium text-gray-700 block mb-1.5">Date de début *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="startDate"
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start h-12 px-4 rounded-xl border-gray-200 bg-gray-50 text-sm font-normal text-gray-900 hover:bg-gray-100 hover:text-gray-900",
                          !startDate && "text-gray-400"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        {startDate
                          ? format(new Date(`${startDate}T00:00:00`), "dd MMMM yyyy", { locale: fr })
                          : "Choisir une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        locale={fr}
                        selected={startDate ? new Date(`${startDate}T00:00:00`) : undefined}
                        onSelect={(d) => setStartDate(d ? format(d, "yyyy-MM-dd") : "")}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label htmlFor="startTime" className="text-sm font-medium text-gray-700 block mb-1.5">Heure de début *</label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger id="startTime">
                      <SelectValue placeholder="Choisir une heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <Checkbox
                    id="sameDayEnd"
                    checked={sameDayEnd}
                    onCheckedChange={(c) => setSameDayEnd(c === true)}
                  />
                  <label htmlFor="sameDayEnd" className="text-sm text-gray-700 cursor-pointer select-none">
                    La date de fin est la même que la date de début
                  </label>
                </div>
                <div>
                  <label htmlFor="endDate" className="text-sm font-medium text-gray-700 block mb-1.5">Date de fin</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        type="button"
                        variant="outline"
                        disabled={sameDayEnd}
                        className={cn(
                          "w-full justify-start h-12 px-4 rounded-xl border-gray-200 bg-gray-50 text-sm font-normal text-gray-900 hover:bg-gray-100 hover:text-gray-900",
                          !endDate && "text-gray-400"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        {endDate
                          ? format(new Date(`${endDate}T00:00:00`), "dd MMMM yyyy", { locale: fr })
                          : "Choisir une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        locale={fr}
                        selected={endDate ? new Date(`${endDate}T00:00:00`) : undefined}
                        onSelect={(d) => setEndDate(d ? format(d, "yyyy-MM-dd") : "")}
                        disabled={(d) =>
                          startDate ? d < new Date(`${startDate}T00:00:00`) : false
                        }
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label htmlFor="endTime" className="text-sm font-medium text-gray-700 block mb-1.5">Heure de fin</label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger id="endTime">
                      <SelectValue placeholder="Choisir une heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {step === 1 && (
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Types de billets</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ajoutez les billets que vous souhaitez proposer. Vous pouvez passer cette étape et les configurer plus tard.
                </p>
              </div>
            </div>

            {tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-8 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <TicketIcon size={28} className="text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-700">Aucun billet pour le moment</p>
                <p className="text-xs text-gray-500 mt-1">Ajoutez un type de billet ou passez à l&apos;étape suivante.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t, idx) => (
                  <div key={t.id} className="rounded-xl border border-gray-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Billet {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTicket(t.id)}
                        aria-label="Supprimer ce billet"
                        className="p-1.5 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label htmlFor={`ticket-name-${t.id}`} className="text-sm font-medium text-gray-700 block mb-1.5">Nom *</label>
                        <input
                          id={`ticket-name-${t.id}`}
                          type="text"
                          value={t.name}
                          onChange={(e) => updateTicket(t.id, { name: e.target.value })}
                          placeholder="Standard, VIP..."
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor={`ticket-price-${t.id}`} className="text-sm font-medium text-gray-700 block mb-1.5">Prix (FCFA) *</label>
                        <input
                          id={`ticket-price-${t.id}`}
                          type="number"
                          min={0}
                          value={t.price}
                          onChange={(e) => updateTicket(t.id, { price: e.target.value })}
                          placeholder="0 pour gratuit"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor={`ticket-qty-${t.id}`} className="text-sm font-medium text-gray-700 block mb-1.5">Quantité *</label>
                        <input
                          id={`ticket-qty-${t.id}`}
                          type="number"
                          min={1}
                          value={t.quantity}
                          onChange={(e) => updateTicket(t.id, { quantity: e.target.value })}
                          placeholder="100"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={addTicket}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus size={16} />
              Ajouter un type de billet
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
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
              <div className="flex justify-between py-2.5 border-b border-gray-100">
                <span className="text-gray-500">Billets</span>
                <span className="font-medium text-gray-900">
                  {tickets.length === 0
                    ? "Aucun"
                    : `${tickets.length} type${tickets.length > 1 ? "s" : ""}`}
                </span>
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
          </section>
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
      </div>

      {/* Preview sheet */}
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="border-b border-gray-100">
            <SheetTitle>Aperçu de l&apos;événement</SheetTitle>
          </SheetHeader>
          <div className="p-6 overflow-y-auto">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="relative h-48 bg-gray-100">
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt={title || "Aperçu"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={40} />
                  </div>
                )}
              </div>
              <div className="p-4">
                {(() => {
                  const categoryName = categories.find((c) => c.id === categoryId)?.name;
                  return categoryName ? (
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-2">
                      {categoryName}
                    </div>
                  ) : null;
                })()}
                <p className="font-semibold text-base mb-2 line-clamp-2 text-gray-900">
                  {title || "Titre de l'événement"}
                </p>
                {startDate && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <Calendar size={14} />
                    <span>
                      {format(new Date(`${startDate}T${startTime || "00:00"}:00`), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </span>
                  </div>
                )}
                {(isOnline || city || address) && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <MapPin size={14} />
                    <span className="truncate">
                      {isOnline ? "En ligne" : `${city}${city && address ? ", " : ""}${address}`}
                    </span>
                  </div>
                )}
                {description && (
                  <p className="text-sm text-gray-600 line-clamp-3 mt-2">{description}</p>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
