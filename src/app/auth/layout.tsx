import Link from "next/link";
import { CalendarDays, MapPin, Sparkles, Ticket } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F7F7] lg:grid lg:grid-cols-2">
      {/* Brand panel — desktop only */}
      <aside
        className="hidden lg:flex relative overflow-hidden text-white bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#02132a]/95 via-[#020a1c]/92 to-black/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,78,137,0.35)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,107,53,0.18)_0%,transparent_55%)]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-white">
            <span className="w-9 h-9 rounded-xl bg-white/[0.06] ring-1 ring-white/10 backdrop-blur flex items-center justify-center">
              <Ticket size={18} className="text-primary" />
            </span>
            Tukki Event
          </Link>

          <div className="space-y-8">
            <div>
              <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary mb-4">
                <span className="h-px w-7 bg-primary/70" />
                Votre compagnon événementiel
              </p>
              <h2 className="text-4xl font-bold leading-tight text-white">
                Découvrez. Réservez.
                <br />
                Vivez{" "}
                <span className="text-primary">l&apos;instant.</span>
              </h2>
              <p className="mt-4 text-white/65 max-w-md leading-relaxed">
                Concerts, conférences, festivals et bien plus encore — toute l&apos;Afrique de l&apos;Ouest se retrouve ici.
              </p>
            </div>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-9 h-9 rounded-xl bg-primary/10 ring-1 ring-primary/25 flex items-center justify-center shrink-0">
                  <Sparkles size={15} className="text-primary" />
                </span>
                <div>
                  <p className="font-semibold text-white">Recommandations personnalisées</p>
                  <p className="text-white/55">Des événements choisis selon vos goûts.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-9 h-9 rounded-xl bg-primary/10 ring-1 ring-primary/25 flex items-center justify-center shrink-0">
                  <CalendarDays size={15} className="text-primary" />
                </span>
                <div>
                  <p className="font-semibold text-white">Billetterie instantanée</p>
                  <p className="text-white/55">Payez avec Wave en quelques secondes.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-9 h-9 rounded-xl bg-primary/10 ring-1 ring-primary/25 flex items-center justify-center shrink-0">
                  <MapPin size={15} className="text-primary" />
                </span>
                <div>
                  <p className="font-semibold text-white">Près de chez vous</p>
                  <p className="text-white/55">Dakar, Abidjan, Bamako, Cotonou…</p>
                </div>
              </li>
            </ul>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Tukki Event · Tous droits réservés
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-5 pt-12 pb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold text-gray-900">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center">
              <Ticket size={16} />
            </span>
            Tukki Event
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center px-5 py-8 lg:py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <footer className="px-5 py-6 text-center text-xs text-gray-400">
          <Link href="/terms" className="hover:text-primary transition-colors">
            Conditions d&apos;utilisation
          </Link>
          <span className="mx-2">·</span>
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Confidentialité
          </Link>
        </footer>
      </main>
    </div>
  );
}
