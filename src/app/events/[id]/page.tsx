"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Star,
  Percent,
  Music2,
  Heart,
  Check,
  Ticket,
  Share2,
  Copy,
  Bus,
  Car,
  Train,
  BadgeCheck,
  Smartphone,
  ShieldCheck,
  Undo2,
  Guitar,
  Mic2,
  Drum,
} from "lucide-react";
import { getEventById, getSimilarEvents } from "@/data/events";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const event = useMemo(() => getEventById(params?.id as string), [params]);
  const [favorite, setFavorite] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const price = 25; // static, from provided HTML example
  const total = ticketCount * price;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Événement introuvable</h1>
        <p className="text-gray-600 mt-2">L'événement que vous recherchez n'existe pas.</p>
        <Link href="/" className="mt-6 inline-block px-5 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          Accueil
        </Link>
      </div>
    );
  }

  const similar = getSimilarEvents(event.category, event.id, 3);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header substitute (simple) */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => router.back()} className="text-gray-600 hover:text-orange-500 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <Link href="/" className="text-2xl font-bold text-orange-500">
                TukkiEvent
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">Accueil</Link>
              <a className="text-gray-700 hover:text-orange-500 transition-colors font-medium" href="#events">Événements</a>
              <a className="text-gray-700 hover:text-orange-500 transition-colors font-medium" href="#contact">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-orange-500 transition-colors font-medium">Connexion</button>
              <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-orange-500">Accueil</Link>
          <span className="text-xs">/</span>
          <span className="hover:text-orange-500">Événements</span>
          <span className="text-xs">/</span>
          <span className="hover:text-orange-500">{event.category}</span>
          <span className="text-xs">/</span>
          <span className="text-gray-900 font-medium">{event.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2">
            {/* Main image */}
            <div className="relative mb-6">
              <div className="h-96 bg-orange-100 rounded-xl overflow-hidden flex items-center justify-center">
                <Image src={event.image} alt={event.title} width={1200} height={600} className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => setFavorite((f) => !f)}
                className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full transition-colors shadow-lg"
                aria-label="Favori"
              >
                <Heart className={`text-xl ${favorite ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium inline-flex items-center">
                  <Music2 className="w-4 h-4 mr-2" />{event.category}
                </span>
              </div>
            </div>

            {/* Title and base info */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-0">{event.title}</h1>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <Star className="w-4 h-4" />
                  </div>
                  <span className="text-gray-600 text-sm">(4.8/5 - 234 avis)</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <CalendarIcon className="text-orange-500 w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Vendredi 15 Mars 2024</p>
                    <p className="text-sm text-gray-500">Dans 12 jours</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="text-orange-500 w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">20h00 - 23h30</p>
                    <p className="text-sm text-gray-500">Durée: 3h30</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="text-orange-500 w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Jazz Club Le Blue Note</p>
                    <p className="text-sm text-gray-500">123 Rue de la Musique, Paris 1er</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="text-orange-500 w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">156 participants</p>
                    <p className="text-sm text-gray-500">Places limitées</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-orange-500">25€</span>
                    <span className="text-gray-500 ml-2">par personne</span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <span className="line-through">30€</span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded ml-2 inline-flex items-center">
                      <Percent className="w-3 h-3 mr-1" />-17%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos de cet événement</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Plongez dans l'univers envoûtant du jazz lors d'une soirée exceptionnelle au Jazz Club Le Blue Note. Cette soirée mettra en vedette des artistes de renommée internationale dans un cadre intimiste et chaleureux.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">Au programme de cette soirée jazz inoubliable :</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Concert du quartet de Marcus Johnson (saxophone, piano, contrebasse, batterie)</li>
                  <li>Interprétation de standards jazz et compositions originales</li>
                  <li>Ambiance feutrée avec service de cocktails et petites restaurations</li>
                  <li>Possibilité de rencontrer les artistes après le spectacle</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">Que vous soyez amateur de jazz chevronné ou simplement curieux, cette soirée saura vous séduire par la qualité de sa programmation et l'authenticité de son atmosphère.</p>
              </div>
            </div>

            {/* Programme */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Programme de la soirée</h2>
              <div className="space-y-4">
                {[
                  { time: "20h00", title: "Ouverture des portes & accueil", desc: "Installation et service de boissons" },
                  { time: "20h30", title: "Premier set - Standards Jazz", desc: "Interprétation des grands classiques du jazz" },
                  { time: "21h30", title: "Pause & intermission", desc: "Temps d'échange et rafraîchissements" },
                  { time: "22h00", title: "Deuxième set - Compositions originales", desc: "Découverte des créations du quartet" },
                  { time: "23h00", title: "Rencontre avec les artistes", desc: "Échange et dédicaces (optionnel)" },
                ].map((item) => (
                  <div key={item.time} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold text-sm">{item.time}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lieu */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Lieu et accès</h2>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Jazz Club Le Blue Note</h3>
                <p className="text-gray-700 mb-1">123 Rue de la Musique, 75001 Paris</p>
                <p className="text-gray-600 text-sm mb-4">Métro: Châtelet (lignes 1, 4, 7, 11, 14) - 5 min à pied</p>
              </div>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-orange-500 mb-2 mx-auto" />
                  <p className="text-gray-600">Carte interactive</p>
                  <p className="text-sm text-gray-500">Jazz Club Le Blue Note</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Transport</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li className="flex items-center"><Train className="w-4 h-4 mr-2 text-orange-500" />Métro: Châtelet (5 min)</li>
                    <li className="flex items-center"><Bus className="w-4 h-4 mr-2 text-orange-500" />Bus: 21, 38, 47, 58</li>
                    <li className="flex items-center"><Car className="w-4 h-4 mr-2 text-orange-500" />Parking Rivoli à 200m</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Informations</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li className="flex items-center"><BadgeCheck className="w-4 h-4 mr-2 text-orange-500" />Accessible PMR</li>
                    <li className="flex items-center"><BadgeCheck className="w-4 h-4 mr-2 text-orange-500" />Vestiaire disponible</li>
                    <li className="flex items-center"><BadgeCheck className="w-4 h-4 mr-2 text-orange-500" />Bar et restauration</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Organisateur */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Organisateur</h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Music2 className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Jazz Club Le Blue Note</h3>
                  <p className="text-gray-600 text-sm mb-2">Organisateur d'événements musicaux depuis 2015</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4 inline-flex items-center"><CalendarIcon className="w-4 h-4 mr-1" />47 événements</span>
                    <span className="mr-4 inline-flex items-center"><Users className="w-4 h-4 mr-1" />12k participants</span>
                    <span className="inline-flex items-center"><Star className="w-4 h-4 mr-1" />4.9/5</span>
                  </div>
                </div>
                <button className="ml-auto bg-orange-50 text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium">
                  Voir le profil
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 mb-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-orange-500 mb-1">25€</div>
                <p className="text-gray-600">par personne</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de billets</label>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setTicketCount((c) => Math.max(1, c - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                    aria-label="Diminuer"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-gray-900 w-12 text-center">{ticketCount}</span>
                  <button
                    onClick={() => setTicketCount((c) => Math.min(10, c + 1))}
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                    aria-label="Augmenter"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <span className="text-gray-700">Total</span>
                <span className="text-2xl font-bold text-orange-500">{total}€</span>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold inline-flex items-center justify-center">
                  <Ticket className="w-5 h-5 mr-2" /> Réserver maintenant
                </button>
                <button className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold inline-flex items-center justify-center">
                  <Share2 className="w-5 h-5 mr-2" /> Ajouter au panier
                </button>
              </div>
              <div className="mt-6 text-sm text-gray-600 space-y-2">
                <div className="flex items-center"><Check className="text-green-500 w-4 h-4 mr-2" />Confirmation instantanée</div>
                <div className="flex items-center"><Smartphone className="text-orange-500 w-4 h-4 mr-2" />Billet électronique</div>
                <div className="flex items-center"><ShieldCheck className="text-orange-500 w-4 h-4 mr-2" />Paiement sécurisé</div>
                <div className="flex items-center"><Undo2 className="text-orange-500 w-4 h-4 mr-2" />Remboursement jusqu'à 24h avant</div>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Partager cet événement</h3>
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors">Facebook</button>
                <button className="flex-1 bg-sky-400 text-white py-2 px-3 rounded-lg hover:bg-sky-500 transition-colors">Twitter</button>
                <button className="flex-1 bg-pink-600 text-white py-2 px-3 rounded-lg hover:bg-pink-700 transition-colors">Instagram</button>
                <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors">WhatsApp</button>
              </div>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                  } catch {}
                }}
                className="w-full mt-3 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Lien copié !
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" /> Copier le lien
                  </>
                )}
              </button>
            </div>

            {/* Similar events */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Événements similaires</h3>
              <div className="space-y-4">
                {similar.map((ev) => (
                  <Link key={ev.id} href={`/events/${ev.id}`} className="block">
                    <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex space-x-3">
                        <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {ev.category === "Music" ? (
                            <Guitar className="w-6 h-6 text-orange-500" />
                          ) : ev.category === "Arts" ? (
                            <Drum className="w-6 h-6 text-orange-500" />
                          ) : (
                            <Mic2 className="w-6 h-6 text-orange-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{ev.title}</h4>
                          <p className="text-xs text-gray-500 mb-1">{ev.date} - {ev.time}</p>
                          <p className="text-sm font-bold text-orange-500">{ev.price}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


