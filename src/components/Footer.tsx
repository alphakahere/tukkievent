import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube, MapPin, Mail, Phone } from "lucide-react";

const links = {
  discover: [
    { label: "Événements à venir", href: "/events" },
    { label: "Rechercher", href: "/search" },
    { label: "Concerts", href: "/events?category=concert" },
    { label: "Festivals", href: "/events?category=festival" },
    { label: "Conférences", href: "/events?category=conference" },
  ],
  account: [
    { label: "Mon profil", href: "/profile" },
    { label: "Mes billets", href: "/tickets" },
    { label: "Favoris", href: "/favorites" },
    { label: "Historique", href: "/history" },
    { label: "Paramètres", href: "/settings" },
  ],
  organizers: [
    { label: "Créer un événement", href: "/organizer/events/new" },
    { label: "Tableau de bord", href: "/organizer/dashboard" },
    { label: "Analytiques", href: "/organizer/analytics" },
    { label: "Aide organisateurs", href: "/support" },
  ],
  legal: [
    { label: "Conditions d'utilisation", href: "/terms" },
    { label: "Politique de confidentialité", href: "/privacy" },
    { label: "Mentions légales", href: "/legal" },
    { label: "Cookies", href: "/cookies" },
  ],
};

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "X / Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 hidden md:block">
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
        {/* Top row */}
        <div className="grid grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="text-xl font-bold text-primary">
              Tukki Event
            </Link>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              La plateforme de billetterie événementielle de référence en Afrique de l&apos;Ouest.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
            >
              En savoir plus →
            </Link>
            <div className="flex gap-3 mt-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Découvrir */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-4">Découvrir</p>
            <ul className="space-y-2.5">
              {links.discover.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mon compte */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-4">Mon compte</p>
            <ul className="space-y-2.5">
              {links.account.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organisateurs */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-4">Organisateurs</p>
            <ul className="space-y-2.5">
              {links.organizers.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-4">Contact</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-500">
                <MapPin size={15} className="shrink-0 mt-0.5 text-gray-400" />
                Dakar, Sénégal
              </li>
              <li>
                <a href="mailto:support@tukkievent.com" className="flex items-start gap-2.5 text-sm text-gray-500 hover:text-primary transition-colors">
                  <Mail size={15} className="shrink-0 mt-0.5 text-gray-400" />
                  support@tukkievent.com
                </a>
              </li>
              <li>
                <a href="tel:+221338001234" className="flex items-start gap-2.5 text-sm text-gray-500 hover:text-primary transition-colors">
                  <Phone size={15} className="shrink-0 mt-0.5 text-gray-400" />
                  +221 33 800 12 34
                </a>
              </li>
            </ul>

            <div className="mt-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Paiements acceptés</p>
              <div className="flex gap-2 flex-wrap">
                {["Wave", "Orange Money", "Carte"].map((m) => (
                  <span key={m} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-6 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Tukki Event. Tous droits réservés.
          </p>
          <div className="flex items-center gap-5 flex-wrap">
            {links.legal.map(({ label, href }) => (
              <Link key={label} href={href} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
