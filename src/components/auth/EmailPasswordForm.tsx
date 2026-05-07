"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { InputField } from "@/components/ui/input-field";
import { PasswordField } from "@/components/ui/password-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/store/api/auth/auth.api";
import type { AuthUser } from "@/store/api/auth/auth.type";
import { getApiErrorMessage } from "@/store/api/auth/error";

const schema = yup.object({
  email: yup.string().required("L'email est requis").email("Email invalide"),
  password: yup
    .string()
    .required("Le mot de passe est requis")
    .min(8, "Au moins 8 caractères"),
  remember: yup.boolean().default(true),
});

type FormData = yup.InferType<typeof schema>;

// Detects "no account with this email" responses so we can fall through to register.
// Backend can signal this via 404 or any error body whose message matches the patterns below.
function isUserNotFound(err: unknown): boolean {
  if (!err || typeof err !== "object" || !("status" in err)) return false;
  const e = err as FetchBaseQueryError;
  if (e.status === 404) return true;
  const data = e.data as { message?: string | string[]; error?: string } | undefined;
  const raw = Array.isArray(data?.message)
    ? data?.message.join(" ")
    : (data?.message ?? data?.error ?? "");
  return /not found|introuvable|n'existe pas|user[_ ]not[_ ]found|no such user/i.test(
    raw,
  );
}

interface EmailPasswordFormProps {
  // Called when the email already exists and login succeeded.
  onLoginSuccess: (user: AuthUser, email: string) => void;
  // Called when the email did not exist; an account was just registered.
  onSignupSuccess: (email: string) => void;
  submitLabel?: string;
  showRemember?: boolean;
  showForgotPassword?: boolean;
  helperText?: string;
}

export function EmailPasswordForm({
  onLoginSuccess,
  onSignupSuccess,
  submitLabel = "Continuer",
  showRemember = false,
  showForgotPassword = true,
  helperText,
}: EmailPasswordFormProps) {
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [registerUser, { isLoading: regLoading }] = useRegisterMutation();
  const isLoading = loginLoading || regLoading;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { remember: true },
  });

  async function onSubmit(data: FormData) {
    try {
      const { user } = await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      onLoginSuccess(user, data.email);
    } catch (err) {
      if (!isUserNotFound(err)) {
        toast.error(getApiErrorMessage(err, "Email ou mot de passe incorrect"));
        return;
      }
      try {
        await registerUser({
          email: data.email,
          password: data.password,
        }).unwrap();
        toast.success("Compte créé. Vérifiez votre email.");
        onSignupSuccess(data.email);
      } catch (regErr) {
        toast.error(getApiErrorMessage(regErr, "Impossible de créer le compte"));
      }
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
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
          showForgotPassword ? (
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          ) : undefined
        }
      />

      {showRemember && (
        <div className="flex items-center gap-2">
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="remember"
                checked={!!field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            )}
          />
          <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
            Se souvenir de moi
          </Label>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-md text-sm font-semibold"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Connexion en cours…
          </>
        ) : (
          <>
            <Mail size={16} />
            {submitLabel}
          </>
        )}
      </Button>

      {helperText && (
        <p className="text-xs text-center text-gray-500">{helperText}</p>
      )}
    </motion.form>
  );
}
