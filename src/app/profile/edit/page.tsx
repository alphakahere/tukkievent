"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Calendar, Check } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all";

export default function EditProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "Amadou",
    lastName: "Diallo",
    email: "amadou.diallo@email.com",
    phone: "+221 77 123 45 67",
    city: "Dakar",
    birthdate: "1995-04-12",
    bio: "",
  });

  const [saving, setSaving] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Profil mis à jour !");
    router.back();
  }

  const initials = `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
      <header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Modifier le profil</h1>
          </div>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Check size={15} />
            )}
            Enregistrer
          </button>
        </div>
      </header>

      <form id="edit-profile-form" onSubmit={handleSubmit}>
        <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-6"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {initials}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                onClick={() => toast.info("Fonctionnalité bientôt disponible")}
              >
                <Camera size={14} className="text-gray-600" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">Appuyez pour changer la photo</p>
          </motion.div>

          {/* Personal info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-base font-semibold text-gray-900">Informations personnelles</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-medium text-gray-500 mb-1.5">
                    Prénom
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Prénom"
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs font-medium text-gray-500 mb-1.5">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Nom"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="birthdate" className="block text-xs font-medium text-gray-500 mb-1.5">
                  Date de naissance
                </label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    value={form.birthdate}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-xs font-medium text-gray-500 mb-1.5">
                  Bio <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Parlez-nous de vous..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-base font-semibold text-gray-900">Contact</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1.5">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-gray-500 mb-1.5">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+221 77 000 00 00"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="city" className="block text-xs font-medium text-gray-500 mb-1.5">
                  Ville
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Dakar"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Danger zone */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-red-100 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-red-100">
              <p className="text-base font-semibold text-gray-900">Zone de danger</p>
            </div>
            <div className="p-5 space-y-3">
              <button
                type="button"
                onClick={() => toast.error("Fonctionnalité bientôt disponible")}
                className="w-full py-3 px-4 rounded-full border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                Supprimer mon compte
              </button>
            </div>
          </motion.div>

        </div>
      </form>

      <BottomNav />
    </div>
  );
}
