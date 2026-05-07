"use client";

import { MailCheck } from "lucide-react";
import { OtpForm } from "@/components/auth/OtpForm";

interface VerifyStepProps {
  email: string;
  onSuccess: () => void;
}

export function VerifyStep({ email, onSuccess }: VerifyStepProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <MailCheck size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Vérifiez votre email</h2>
          <p className="mt-1 text-sm text-gray-500">
            Code à 6 chiffres envoyé à{" "}
            <span className="font-semibold text-gray-900">{email}</span>.
          </p>
        </div>
      </div>
      <OtpForm
        email={email}
        onSuccess={onSuccess}
        redirectAfter={null}
        showHeader={false}
      />
    </div>
  );
}
