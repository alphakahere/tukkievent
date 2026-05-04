"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { PasswordField } from "../_components/PasswordField";
import { SocialButtons } from "../_components/SocialButtons";

const schema = yup.object({
  email: yup.string().required("L'email est requis").email("Veuillez entrer un email valide"),
  password: yup.string().required("Le mot de passe est requis").min(6, "Au moins 6 caractères"),
  remember: yup.boolean().default(true),
});

type FormData = yup.InferType<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/profile";
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { remember: true },
    mode: "onTouched",
  });

  async function onSubmit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast.success("Bienvenue ! Vous êtes connecté.");
    router.push(redirect);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-7"
    >
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Bon retour 👋</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Connectez-vous pour accéder à vos billets et favoris.
        </p>
      </header>

      <SocialButtons context="login" />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#F7F7F7] px-3 text-gray-400 uppercase tracking-wider">
            ou avec votre email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <InputField
          {...register("email")}
          id="email"
          type="email"
          label="Adresse e-mail"
          placeholder="vous@email.com"
          required
          autoComplete="email"
          error={errors.email?.message}
        />

        <PasswordField
          {...register("password")}
          id="password"
          label="Mot de passe"
          placeholder="••••••••"
          required
          autoComplete="current-password"
          error={errors.password?.message}
          hint={
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          }
        />

        <label className="flex items-center gap-2 select-none cursor-pointer">
          <input
            type="checkbox"
            {...register("remember")}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
          />
          <span className="text-sm text-gray-600">Se souvenir de moi</span>
        </label>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-11 rounded-xl text-sm font-semibold"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Connexion en cours…
            </>
          ) : (
            <>
              <Mail size={16} />
              Se connecter
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Pas encore de compte ?{" "}
        <Link href="/auth/register" className="font-semibold text-primary hover:underline">
          Inscrivez-vous
        </Link>
      </p>
    </motion.div>
  );
}
