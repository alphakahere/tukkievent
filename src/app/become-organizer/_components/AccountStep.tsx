"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import type { AuthUser } from "@/store/api/auth/auth.type";

interface AccountStepProps {
  onSuccess: (user: AuthUser, email: string) => void;
}

export function AccountStep({ onSuccess }: AccountStepProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Créez votre compte</h2>
        <p className="mt-1 text-sm text-gray-500">
          Vos identifiants vous serviront aussi à vous connecter à l&apos;espace organisateur.
        </p>
      </div>
      <RegisterForm
        onSuccess={onSuccess}
        redirectAfter={null}
        showHeader={false}
        showLoginLink={false}
        submitLabel="Continuer"
      />
    </div>
  );
}
