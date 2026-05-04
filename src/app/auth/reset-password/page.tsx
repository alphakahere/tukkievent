"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/password-field";
import { useResetPasswordMutation } from "@/store/api/auth/auth.api";
import { getApiErrorMessage } from "@/store/api/auth/error";

const schema = yup.object({
  password: yup
    .string()
    .required("Le mot de passe est requis")
    .min(8, "Au moins 8 caractères")
    .matches(/[A-Z]/, "Doit contenir une majuscule")
    .matches(/[0-9]/, "Doit contenir un chiffre"),
  confirmPassword: yup
    .string()
    .required("Veuillez confirmer le mot de passe")
    .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas"),
});

type FormData = yup.InferType<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  async function onSubmit(data: FormData) {
    if (!token) {
      toast.error("Lien invalide ou expiré.");
      return;
    }
    try {
      await resetPassword({ token, password: data.password }).unwrap();
      toast.success("Mot de passe mis à jour. Reconnectez-vous.");
      router.push("/auth/login");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Lien invalide ou expiré"));
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header>
        <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center mb-4">
          <ShieldCheck size={26} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Choisissez un mot de passe robuste, différent des précédents.
        </p>
      </header>

      {!token && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Ce lien semble invalide. Veuillez{" "}
          <Link href="/auth/forgot-password" className="font-semibold underline">
            recommencer la procédure
          </Link>
          .
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <PasswordField
          {...register("password")}
          id="password"
          label="Nouveau mot de passe"
          placeholder="8 caractères min., 1 majuscule, 1 chiffre"
          required
          autoComplete="new-password"
          error={errors.password?.message}
        />
        <PasswordField
          {...register("confirmPassword")}
          id="confirmPassword"
          label="Confirmer le mot de passe"
          placeholder="••••••••"
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          disabled={isLoading || !token}
          className="w-full h-11 rounded-md text-sm font-semibold"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Mise à jour…
            </>
          ) : (
            "Mettre à jour le mot de passe"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </motion.div>
  );
}
