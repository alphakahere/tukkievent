"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Building2, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useOrganizerOrg } from "@/contexts/OrganizerOrgContext";
import {
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
} from "@/store/api/organizations/organizations.api";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

export default function OrganizerSettingsPage() {
  const { activeOrgId } = useOrganizerOrg();
  const { data: org, isLoading } = useGetOrganizationQuery(activeOrgId ?? "", {
    skip: !activeOrgId,
  });
  const [updateOrg, { isLoading: isSaving }] = useUpdateOrganizationMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [primaryEventType, setPrimaryEventType] = useState("");

  useEffect(() => {
    if (!org) return;
    setName(org.name);
    setDescription(org.description ?? "");
    setPrimaryEventType(org.primaryEventType ?? "");
  }, [org]);

  async function handleSave() {
    if (!activeOrgId) return;
    try {
      await updateOrg({
        id: activeOrgId,
        patch: {
          name: name.trim(),
          description: description.trim() || undefined,
          primaryEventType: primaryEventType.trim() || undefined,
        },
      }).unwrap();
      toast.success("Paramètres enregistrés !");
    } catch (err) {
      const message =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: unknown }).message)
          : "Une erreur est survenue";
      toast.error(message);
    }
  }

  if (isLoading || !org) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
		<div className="p-5 md:p-8 space-y-6">
			<h1 className="text-2xl font-bold text-gray-900">
				Paramètres de l&apos;organisation
			</h1>

			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5"
			>
				<div className="flex items-center gap-3 mb-2">
					<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
						<Building2
							size={20}
							className="text-primary"
						/>
					</div>
					<div>
						<h2 className="text-base font-semibold text-gray-900">
							Informations générales
						</h2>
						<p className="text-xs text-gray-500">
							Détails publics de votre organisation
						</p>
					</div>
				</div>

				<div>
					<label
						htmlFor="orgName"
						className="text-sm font-medium text-gray-700 block mb-1.5"
					>
						Nom de l&apos;organisation
					</label>
					<input
						id="orgName"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className={inputClass}
					/>
				</div>

				<div>
					<label
						htmlFor="orgSlug"
						className="text-sm font-medium text-gray-700 block mb-1.5"
					>
						Slug
					</label>
					<input
						id="orgSlug"
						type="text"
						value={org.slug}
						disabled
						className={`${inputClass} cursor-not-allowed opacity-60`}
					/>
					<p className="text-xs text-gray-400 mt-1">
						Le slug ne peut pas être modifié.
					</p>
				</div>

				<div>
					<label
						htmlFor="orgDesc"
						className="text-sm font-medium text-gray-700 block mb-1.5"
					>
						Description
					</label>
					<textarea
						id="orgDesc"
						value={description}
						onChange={(e) =>
							setDescription(e.target.value)
						}
						rows={3}
						className={`${inputClass} resize-none`}
					/>
				</div>

				<div>
					<label
						htmlFor="orgEventType"
						className="text-sm font-medium text-gray-700 block mb-1.5"
					>
						Type d&apos;événements principal
					</label>
					<input
						id="orgEventType"
						type="text"
						value={primaryEventType}
						onChange={(e) =>
							setPrimaryEventType(e.target.value)
						}
						placeholder="Ex: Concerts, Conférences"
						className={inputClass}
					/>
				</div>

				<button
					type="button"
					onClick={handleSave}
					disabled={isSaving || !name.trim()}
					className="w-full py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
				>
					{isSaving && (
						<Loader2
							size={16}
							className="animate-spin"
						/>
					)}
					Enregistrer les modifications
				</button>
			</motion.div>

			{/* Danger zone */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-white rounded-2xl border border-red-100 p-6"
			>
				<div className="flex items-center gap-3 mb-5">
					<div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
						<Trash2
							size={20}
							className="text-destructive"
						/>
					</div>
					<div>
						<h2 className="text-base font-semibold text-gray-900">
							Zone dangereuse
						</h2>
						<p className="text-xs text-gray-500">
							Actions irréversibles
						</p>
					</div>
				</div>
				<button
					type="button"
					className="w-full px-4 py-3 text-sm font-semibold text-destructive border border-red-200 rounded-full hover:bg-red-50 transition-colors"
				>
					Supprimer l&apos;organisation
				</button>
				<p className="text-xs text-gray-400 mt-3">
					Cette action supprimera définitivement votre
					organisation et tous ses événements.
				</p>
			</motion.div>
		</div>
  );
}
