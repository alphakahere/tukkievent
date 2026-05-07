"use client";

import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";
import type { AuthUser } from "@/store/api/auth/auth.type";

interface AccountStepProps {
  onSuccess: (user: AuthUser | null, email: string) => void;
}

export function AccountStep({ onSuccess }: AccountStepProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Connectez-vous ou créez votre compte
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Saisissez votre email et un mot de passe — nous créerons un compte
          automatiquement si vous n&apos;en avez pas encore.
        </p>
      </div>
      <EmailPasswordForm
        submitLabel="Continuer"
        showForgotPassword
        onLoginSuccess={(user, email) => onSuccess(user, email)}
        onSignupSuccess={(email) => onSuccess(null, email)}
      />
    </div>
  );
}
