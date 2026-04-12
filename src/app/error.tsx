"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4">
      <div className="text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-gray-300" />
        </div>
        <p className="text-xl font-semibold text-gray-900 mb-2">Une erreur est survenue</p>
        <p className="text-sm text-gray-500 mb-8">
          Quelque chose s&apos;est mal passé. Veuillez réessayer.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="bg-primary text-white py-3 px-8 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="bg-white border border-gray-200 text-gray-700 py-3 px-8 rounded-full font-semibold hover:bg-gray-50 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
