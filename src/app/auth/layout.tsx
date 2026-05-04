import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Sparkles, Ticket } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F7F7] lg:grid lg:grid-cols-2">
      {/* Brand panel — desktop only */}
      <aside className="hidden lg:flex relative overflow-hidden text-white">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0e1f]/85 via-[#0a0e1f]/60 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_40%),radial-gradient(circle_at_80%_60%,white_0,transparent_30%)]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Ticket size={18} />
            </span>
            Tukki Event
          </Link>

          <div className="space-y-8">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-white/70 mb-3">
                Votre compagnon événementiel
              </p>
              <h2 className="text-4xl font-bold leading-tight">
                Découvrez. Réservez.
                <br />
                Vivez l&apos;instant.
              </h2>
              <p className="mt-4 text-white/80 max-w-md">
                Concerts, conférences, festivals et bien plus encore — toute l&apos;Afrique de l&apos;Ouest se retrouve ici.
              </p>
            </div>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Sparkles size={15} />
                </span>
                <div>
                  <p className="font-semibold">Recommandations personnalisées</p>
                  <p className="text-white/70">Des événements choisis selon vos goûts.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <CalendarDays size={15} />
                </span>
                <div>
                  <p className="font-semibold">Billetterie instantanée</p>
                  <p className="text-white/70">Payez avec Wave en quelques secondes.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <MapPin size={15} />
                </span>
                <div>
                  <p className="font-semibold">Près de chez vous</p>
                  <p className="text-white/70">Dakar, Abidjan, Bamako, Cotonou…</p>
                </div>
              </li>
            </ul>
          </div>

          <p className="text-xs text-white/60">
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
