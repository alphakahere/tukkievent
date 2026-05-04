"use client";

import { toast } from "sonner";

const providers = [
  {
    name: "Google",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" aria-hidden="true">
        <path fill="#EA4335" d="M12 10.2v3.8h5.4c-.24 1.4-1.7 4.1-5.4 4.1-3.25 0-5.9-2.7-5.9-6s2.65-6 5.9-6c1.85 0 3.1.78 3.8 1.45l2.6-2.5C16.7 3.5 14.6 2.6 12 2.6 6.97 2.6 2.9 6.67 2.9 11.7s4.07 9.1 9.1 9.1c5.25 0 8.7-3.7 8.7-8.9 0-.6-.06-1.05-.15-1.5H12z" />
      </svg>
    ),
  },
  {
    name: "Apple",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" aria-hidden="true" fill="currentColor">
        <path d="M16.365 1.43c0 1.14-.41 2.27-1.23 3.07-.83.83-2.16 1.47-3.27 1.38-.13-1.1.41-2.27 1.18-3.05.84-.83 2.21-1.45 3.32-1.4zM21 17.36c-.55 1.27-.81 1.83-1.52 2.94-.99 1.55-2.39 3.48-4.13 3.5-1.55.01-1.95-1.01-4.06-1-2.11.01-2.55 1.02-4.1 1-1.74-.02-3.06-1.76-4.05-3.31-2.78-4.34-3.07-9.43-1.36-12.14 1.22-1.93 3.14-3.06 4.95-3.06 1.84 0 2.99 1.01 4.51 1.01 1.47 0 2.36-1.01 4.49-1.01 1.61 0 3.32.88 4.54 2.4-3.99 2.18-3.34 7.88.73 8.67z" />
      </svg>
    ),
  },
];

export function SocialButtons({ context }: { context: "login" | "register" }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {providers.map((p) => (
        <button
          key={p.name}
          type="button"
          onClick={() =>
            toast.info(`${p.name} ${context === "login" ? "connexion" : "inscription"} bientôt disponible`)
          }
          className="flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {p.icon}
          {p.name}
        </button>
      ))}
    </div>
  );
}
