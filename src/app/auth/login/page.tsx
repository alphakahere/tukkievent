"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";
import { resolveAuthRedirect } from "@/lib/auth-redirect";
import { SocialButtons } from "../_components/SocialButtons";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-7"
    >
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Bon retour 👋</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Connectez-vous, ou créez votre compte en saisissant simplement vos identifiants.
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

      <EmailPasswordForm
        submitLabel="Continuer"
        showRemember
        helperText="Pas encore de compte ? Il sera créé automatiquement."
        onLoginSuccess={(user) => {
          toast.success("Bienvenue ! Vous êtes connecté.");
          router.push(resolveAuthRedirect(redirect, user.roles));
        }}
        onSignupSuccess={(email) => {
          const params = new URLSearchParams({ email });
          if (redirect) params.set("redirect", redirect);
          router.push(`/auth/verify?${params.toString()}`);
        }}
      />
    </motion.div>
  );
}
