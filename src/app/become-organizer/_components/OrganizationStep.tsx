"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "motion/react";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { useCreateOrganizationMutation } from "@/store/api/organizations/organizations.api";
import { useLazyGetMeQuery } from "@/store/api/users/users.api";
import { getApiErrorMessage } from "@/store/api/auth/error";

const schema = yup.object({
  name: yup
    .string()
    .required("Le nom est requis")
    .min(1, "Trop court")
    .max(150, "Au plus 150 caractères"),
  description: yup.string().default("").max(2000, "Au plus 2000 caractères"),
  primaryEventType: yup.string().default("").max(50, "Au plus 50 caractères"),
});

type FormData = yup.InferType<typeof schema>;

export function OrganizationStep() {
  const router = useRouter();
  const [createOrganization, { isLoading: isCreating }] = useCreateOrganizationMutation();
  const [refetchMe] = useLazyGetMeQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", description: "", primaryEventType: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createOrganization({
        name: data.name,
        description: data.description || undefined,
        primaryEventType: data.primaryEventType || undefined,
      }).unwrap();
      // Refresh the auth user so the freshly granted ORGANIZER role lands in the slice
      // before navigating into the role-guarded /organizer/* tree.
      await refetchMe()
        .unwrap()
        .catch(() => undefined);
      toast.success("Bienvenue parmi les organisateurs !");
      router.replace("/organizer/events/new");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Impossible de créer l'organisation"));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5"
      noValidate
    >
        <p className="text-base font-semibold text-gray-900">Votre organisation</p>

        <InputField
          {...register("name")}
          id="org-name"
          label="Nom de l'organisation"
          required
          placeholder="ex. Tukki Productions"
          error={errors.name?.message}
          helperText="Le slug sera généré automatiquement."
        />

        <InputField
          {...register("primaryEventType")}
          id="org-event-type"
          label="Type d'événements principal"
          placeholder="ex. concerts, conférences, festivals…"
          error={errors.primaryEventType?.message}
        />

        <div className="space-y-2">
          <label htmlFor="org-description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="org-description"
            {...register("description")}
            rows={4}
            placeholder="Présentez votre organisation en quelques phrases…"
            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
          />
          {errors.description?.message && (
            <p className="text-sm text-red-500" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isCreating}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Briefcase size={15} />
            )}
            {isCreating ? "Création…" : "Créer mon organisation"}
          </Button>
        </div>
    </motion.form>
  );
}
