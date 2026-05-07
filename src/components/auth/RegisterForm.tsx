"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { motion } from "motion/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordField } from "@/components/ui/password-field";
import { useRegisterMutation } from "@/store/api/auth/auth.api";
import type { AuthUser } from "@/store/api/auth/auth.type";
import { getApiErrorMessage } from "@/store/api/auth/error";
import { SocialButtons } from "@/app/auth/_components/SocialButtons";

const schema = yup.object({
  firstName: yup.string().required("Le prénom est requis").min(2, "Au moins 2 caractères"),
  lastName: yup.string().required("Le nom est requis").min(2, "Au moins 2 caractères"),
  email: yup.string().required("L'email est requis").email("Veuillez entrer un email valide"),
  phone: yup.string().required("Le numéro de téléphone est requis").min(10, "Numéro invalide"),
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
  acceptTerms: yup
    .boolean()
    .oneOf([true], "Vous devez accepter les conditions")
    .required(),
});

type FormData = yup.InferType<typeof schema>;

function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "Trop court", color: "bg-gray-200" },
    { label: "Faible", color: "bg-red-400" },
    { label: "Correct", color: "bg-amber-400" },
    { label: "Bon", color: "bg-emerald-400" },
    { label: "Excellent", color: "bg-emerald-500" },
  ];
  return { score: score as 0 | 1 | 2 | 3 | 4, ...map[score] };
}

interface RegisterFormProps {
  onSuccess?: (user: AuthUser, email: string) => void;
  // Default redirect on success. Set to null to suppress routing and rely on onSuccess.
  redirectAfter?: string | null;
  // When false, omit the title block (orchestrator page provides its own header).
  showHeader?: boolean;
  // When false, omit the "Déjà un compte ?" link.
  showLoginLink?: boolean;
  submitLabel?: string;
}

export function RegisterForm({
  onSuccess,
  redirectAfter = "/auth/verify",
  showHeader = true,
  showLoginLink = true,
  submitLabel = "Créer mon compte",
}: RegisterFormProps) {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const password = watch("password") || "";
  const strength = useMemo(() => passwordStrength(password), [password]);

  async function onSubmit(data: FormData) {
    try {
      const res = await registerUser({
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        phone: data.phone ? `+${data.phone}` : undefined,
        password: data.password,
      }).unwrap();
      toast.success("Compte créé ! Vérifiez votre email.");
      onSuccess?.(res.user, data.email);
      if (redirectAfter) {
        router.push(`${redirectAfter}?email=${encodeURIComponent(data.email)}`);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Impossible de créer le compte"));
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {showHeader && (
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Rejoignez Tukki Event et accédez aux meilleurs événements.
          </p>
        </header>
      )}

      <SocialButtons context="register" />

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <InputField
            {...register("firstName")}
            id="firstName"
            label="Prénom"
            placeholder="Awa"
            required
            autoComplete="given-name"
            error={errors.firstName?.message}
          />
          <InputField
            {...register("lastName")}
            id="lastName"
            label="Nom"
            placeholder="Diop"
            required
            autoComplete="family-name"
            error={errors.lastName?.message}
          />
        </div>

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

        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="after:content-['*'] after:ml-0.5 after:text-red-500"
          >
            Numéro de téléphone
          </Label>
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <PhoneInput
                country="sn"
                preferredCountries={["sn", "ci", "ml", "bj", "bf", "tg"]}
                value={field.value}
                onChange={(v) => field.onChange(v)}
                inputProps={{ id: "phone", name: "phone", ref: field.ref }}
                inputStyle={{
                  width: "100%",
                  height: "44px",
                  borderRadius: "12px",
                  borderColor: errors.phone ? "#f87171" : "#e5e7eb",
                  fontSize: "14px",
                }}
                buttonStyle={{
                  borderTopLeftRadius: "12px",
                  borderBottomLeftRadius: "12px",
                  borderColor: errors.phone ? "#f87171" : "#e5e7eb",
                  backgroundColor: "white",
                }}
              />
            )}
          />
          {errors.phone && (
            <p className="text-xs text-red-500" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <PasswordField
            {...register("password")}
            id="password"
            label="Mot de passe"
            placeholder="8 caractères min., 1 majuscule, 1 chiffre"
            required
            autoComplete="new-password"
            error={errors.password?.message}
          />
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < strength.score ? strength.color : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">Force : {strength.label}</p>
            </div>
          )}
        </div>

        <PasswordField
          {...register("confirmPassword")}
          id="confirmPassword"
          label="Confirmer le mot de passe"
          placeholder="••••••••"
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        <div className="space-y-1.5">
          <div className="flex items-start gap-2.5">
            <Controller
              name="acceptTerms"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  id="acceptTerms"
                  className="mt-0.5"
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  aria-invalid={errors.acceptTerms ? "true" : "false"}
                />
              )}
            />
            <Label
              htmlFor="acceptTerms"
              className="text-xs text-gray-600 leading-relaxed font-normal cursor-pointer whitespace-nowrap"
            >
              J&apos;accepte les{" "}
              <Link href="/terms" className="text-primary font-medium hover:underline">
                Conditions d&apos;utilisation
              </Link>{" "}
              et la{" "}
              <Link href="/privacy" className="text-primary font-medium hover:underline">
                Politique de confidentialité
              </Link>
              .
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-xs text-red-500" role="alert">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-md text-sm font-semibold"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Création du compte…
            </>
          ) : (
            <>
              <UserPlus size={16} />
              {submitLabel}
            </>
          )}
        </Button>
      </form>

      {showLoginLink && (
        <p className="text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Connectez-vous
          </Link>
        </p>
      )}
    </motion.div>
  );
}
