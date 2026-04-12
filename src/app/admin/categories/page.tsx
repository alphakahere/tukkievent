"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Tag } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const { categories, addCategory, deleteCategory } = useAdmin();
  const [newName, setNewName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    addCategory(name);
    toast.success(`Catégorie «${name}» ajoutée`);
    setNewName("");
    setShowForm(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (deletingId === id) {
      deleteCategory(id);
      toast.success(`Catégorie «${name}» supprimée`);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <p className="text-2xl font-bold text-gray-900">Catégories</p>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} catégories</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors shrink-0"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </motion.div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-base font-semibold text-gray-900 mb-3">Nouvelle catégorie</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nom de la catégorie"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  autoFocus
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
                >
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setNewName(""); }}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="hidden md:grid grid-cols-[1fr_120px_140px_60px] gap-4 px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <span>Nom</span>
          <span>Slug</span>
          <span>Événements</span>
          <span />
        </div>
        <div className="divide-y divide-gray-100">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="px-5 py-3.5 flex items-center gap-4 md:grid md:grid-cols-[1fr_120px_140px_60px]"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Tag size={14} className="text-primary" />
                </div>
                <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
              </div>
              <p className="hidden md:block text-xs text-gray-400 font-mono">{cat.slug}</p>
              <p className="hidden md:block text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{cat.eventsCount}</span> événement{cat.eventsCount !== 1 ? "s" : ""}
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className={`p-1.5 rounded-full transition-colors ${
                    deletingId === cat.id
                      ? "bg-rose-100 text-rose-600"
                      : "hover:bg-gray-100 text-gray-400 hover:text-rose-500"
                  }`}
                  title={deletingId === cat.id ? "Cliquer à nouveau pour confirmer" : "Supprimer"}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {deletingId && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-center text-rose-500 font-medium"
        >
          Cliquez à nouveau sur la corbeille pour confirmer la suppression
        </motion.p>
      )}
    </div>
  );
}
