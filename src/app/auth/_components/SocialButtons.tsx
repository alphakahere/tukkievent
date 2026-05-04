"use client";

import { toast } from "sonner";

export function SocialButtons({ context }: { context: "login" | "register" }) {
  return (
    <button
      type="button"
      onClick={() =>
        toast.info(`Google ${context === "login" ? "connexion" : "inscription"} bientôt disponible`)
      }
      className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.8h5.4c-.24 1.4-1.7 4.1-5.4 4.1-3.25 0-5.9-2.7-5.9-6s2.65-6 5.9-6c1.85 0 3.1.78 3.8 1.45l2.6-2.5C16.7 3.5 14.6 2.6 12 2.6 6.97 2.6 2.9 6.67 2.9 11.7s4.07 9.1 9.1 9.1c5.25 0 8.7-3.7 8.7-8.9 0-.6-.06-1.05-.15-1.5H12z"
        />
      </svg>
      Continuer avec Google
    </button>
  );
}
