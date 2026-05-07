"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { OtpForm } from "@/components/auth/OtpForm";

export default function VerifyPage() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const redirect = params.get("redirect");

  return (
    <div className="space-y-6">
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={15} />
        Retour
      </Link>
      <OtpForm email={email} redirectAfter={redirect || "/profile"} />
    </div>
  );
}
