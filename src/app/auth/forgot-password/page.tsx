"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";

const schema = yup.object({
  email: yup.string().required("L'email est requis").email("Veuillez entrer un email valide"),
});

type FormData = yup.InferType<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSentTo(data.email);
  }

  if (sentTo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-5"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vérifiez votre boîte mail</h1>
          <p className="mt-2 text-sm text-gray-500">
            Nous avons envoyé un lien de réinitialisation à
            <br />
            <span className="font-semibold text-gray-900">{sentTo}</span>.
          </p>
        </div>
        <p className="text-xs text-gray-400">
          Vous ne voyez rien ? Pensez à vérifier vos courriers indésirables.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => setSentTo(null)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Utiliser une autre adresse
          </button>
          <Link
            href="/auth/login"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Retour à la connexion
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={15} />
        Retour
      </Link>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot
          de passe.
        </p>
      </header>

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

        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-11 rounded-md text-sm font-semibold"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Envoi en cours…
            </>
          ) : (
            <>
              <Mail size={16} />
              Envoyer le lien
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Vous vous êtes rappelé ?{" "}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Connectez-vous
        </Link>
      </p>
    </motion.div>
  );
}
