"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Ticket,
  CalendarDays,
  MapPin,
  Shield,
  Zap,
  Users,
  TrendingUp,
  BarChart3,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";

const stats = [
  { value: "50 000+", label: "Billets vendus" },
  { value: "1 200+", label: "Événements organisés" },
  { value: "320+", label: "Organisateurs actifs" },
  { value: "4.8/5", label: "Note moyenne" },
];

const attendeeFeatures = [
  {
    icon: Ticket,
    color: "#FF6B35",
    bg: "#FFF1EC",
    title: "Achat simple & rapide",
    desc: "Réservez vos billets en moins de 2 minutes, sans créer de compte.",
  },
  {
    icon: Smartphone,
    color: "#3B82F6",
    bg: "#EFF6FF",
    title: "Billet sur mobile",
    desc: "Accédez à votre QR code hors-ligne depuis l'application.",
  },
  {
    icon: Shield,
    color: "#10B981",
    bg: "#ECFDF5",
    title: "Paiement sécurisé",
    desc: "Wave, Orange Money et carte bancaire — vos données sont protégées.",
  },
  {
    icon: MapPin,
    color: "#8B5CF6",
    bg: "#F5F3FF",
    title: "Événements près de chez vous",
    desc: "Découvrez ce qui se passe dans votre ville au Sénégal et en Afrique.",
  },
];

const organizerFeatures = [
  {
    icon: CalendarDays,
    color: "#FF6B35",
    bg: "#FFF1EC",
    title: "Création d'événement guidée",
    desc: "Publiez un événement en quelques étapes avec notre assistant intégré.",
  },
  {
    icon: BarChart3,
    color: "#3B82F6",
    bg: "#EFF6FF",
    title: "Analytiques en temps réel",
    desc: "Suivez vos ventes, revenus et taux de remplissage en direct.",
  },
  {
    icon: Users,
    color: "#10B981",
    bg: "#ECFDF5",
    title: "Gestion des participants",
    desc: "Scannez les QR codes à l'entrée et gérez les check-ins facilement.",
  },
  {
    icon: TrendingUp,
    color: "#8B5CF6",
    bg: "#F5F3FF",
    title: "Boost de visibilité",
    desc: "Mettez en avant vos événements auprès de milliers d'utilisateurs.",
  },
];

const steps = [
  { number: "01", title: "Parcourez les événements", desc: "Découvrez les concerts, festivals, conférences et bien plus près de chez vous." },
  { number: "02", title: "Choisissez votre billet", desc: "Sélectionnez le type de billet qui vous convient et payez en toute sécurité." },
  { number: "03", title: "Profitez de l'événement", desc: "Présentez votre QR code à l'entrée depuis votre téléphone. C'est tout !" },
];

const testimonials = [
  {
    name: "Fatou Ndiaye",
    role: "Organisatrice d'événements, Dakar",
    text: "Tukki Event a transformé la façon dont je gère mes événements. Les analytiques en temps réel sont incroyables.",
    rating: 5,
  },
  {
    name: "Ibrahima Sow",
    role: "Mélomane, Saint-Louis",
    text: "J'ai acheté mes billets en 1 minute avec Wave. Le QR code fonctionnait même sans connexion à l'entrée.",
    rating: 5,
  },
  {
    name: "Aminata Diallo",
    role: "Étudiante, Thiès",
    text: "Super plateforme ! Je découvre plein d'événements sympas près de chez moi que je ne connaissais pas.",
    rating: 5,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = (delayBase = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: delayBase } },
});

const viewportOpts = { once: true, margin: "-80px" };

export default function AboutPage() {
  return (
    <div className="bg-[#F7F7F7]">

      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <motion.div
            variants={stagger(0)}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center"
          >
            <motion.span variants={fadeUp} className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
              La billetterie événementielle de l&apos;Afrique de l&apos;Ouest
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-5xl font-bold text-gray-900 leading-tight mb-6 max-w-3xl">
              Vivez les meilleurs événements du Sénégal
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
              Tukki Event vous connecte aux concerts, festivals, conférences et spectacles les plus attendus.
              Achetez vos billets en quelques secondes, gérez votre agenda événementiel.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/events"
                className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold text-base hover:opacity-90 transition-opacity"
              >
                Découvrir les événements
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/organizer/events/new"
                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-50 transition-colors"
              >
                Créer un événement
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <motion.div
            variants={stagger()}
            initial="hidden"
            whileInView="show"
            viewport={viewportOpts}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map(({ value, label }) => (
              <motion.div key={label} variants={fadeUp} className="text-center">
                <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={stagger()}
            initial="hidden"
            whileInView="show"
            viewport={viewportOpts}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Comment ça marche</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">Réservez en 3 étapes simples</motion.h2>
          </motion.div>
          <motion.div
            variants={stagger()}
            initial="hidden"
            whileInView="show"
            viewport={viewportOpts}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {steps.map(({ number, title, desc }) => (
              <motion.div key={number} variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 p-8 relative overflow-hidden">
                <p className="text-8xl font-bold text-gray-100 absolute -top-2 right-4 select-none leading-none">{number}</p>
                <p className="text-4xl font-bold text-primary mb-4">{number}</p>
                <p className="text-base font-semibold text-gray-900 mb-2">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── For attendees ── */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={stagger()}
              initial="hidden"
              whileInView="show"
              viewport={viewportOpts}
            >
              <motion.p variants={fadeUp} className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Pour les participants</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900 mb-5">
                L&apos;expérience billet la plus fluide
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-500 leading-relaxed mb-8">
                De la découverte à l&apos;entrée de l&apos;événement, chaque étape est pensée pour être simple, rapide et agréable — même sans connexion internet à l&apos;entrée.
              </motion.p>
              <motion.ul variants={stagger()} className="space-y-3 mb-8">
                {["Achat en moins de 2 minutes", "Paiement mobile (Wave, Orange Money)", "QR code disponible hors-ligne", "Remboursement facilité"].map((item) => (
                  <motion.li key={item} variants={fadeUp} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle size={17} className="text-primary shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div variants={fadeUp}>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Voir les événements <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={stagger()}
              initial="hidden"
              whileInView="show"
              viewport={viewportOpts}
              className="grid grid-cols-2 gap-4"
            >
              {attendeeFeatures.map(({ icon: Icon, color, bg, title, desc }) => (
                <motion.div key={title} variants={fadeUp} className="bg-[#F7F7F7] rounded-2xl p-5 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: bg }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── For organizers ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={stagger()}
              initial="hidden"
              whileInView="show"
              viewport={viewportOpts}
              className="grid grid-cols-2 gap-4 order-2 lg:order-1"
            >
              {organizerFeatures.map(({ icon: Icon, color, bg, title, desc }) => (
                <motion.div key={title} variants={fadeUp} className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: bg }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={stagger()}
              initial="hidden"
              whileInView="show"
              viewport={viewportOpts}
              className="order-1 lg:order-2"
            >
              <motion.p variants={fadeUp} className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Pour les organisateurs</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900 mb-5">
                Gérez vos événements comme un pro
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-500 leading-relaxed mb-8">
                Un tableau de bord complet pour publier, promouvoir et analyser vos événements. Tout ce dont vous avez besoin, sans complexité.
              </motion.p>
              <motion.ul variants={stagger()} className="space-y-3 mb-8">
                {["Publication en quelques minutes", "Ventes et revenus en temps réel", "Gestion des check-ins par QR", "Plusieurs types de billets"].map((item) => (
                  <motion.li key={item} variants={fadeUp} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle size={17} className="text-primary shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div variants={fadeUp}>
                <Link
                  href="/organizer/dashboard"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors"
                >
                  Accéder au dashboard <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={stagger()}
            initial="hidden"
            whileInView="show"
            viewport={viewportOpts}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Témoignages</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">Ce qu&apos;ils en disent</motion.h2>
          </motion.div>
          <motion.div
            variants={stagger()}
            initial="hidden"
            whileInView="show"
            viewport={viewportOpts}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map(({ name, role, text, rating }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[#F7F7F7] rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-5">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOpts}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <motion.h2 variants={fadeUp} className="text-4xl font-bold text-gray-900 mb-5">
            Prêt à vivre l&apos;expérience Tukki ?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-gray-500 mb-10">
            Rejoignez des milliers d&apos;amateurs d&apos;événements et d&apos;organisateurs qui font confiance à Tukki Event.
          </motion.p>
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/events"
              className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold text-base hover:opacity-90 transition-opacity"
            >
              Découvrir les événements
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/organizer/events/new"
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-50 transition-colors"
            >
              Créer un événement
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
