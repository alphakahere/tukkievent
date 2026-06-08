"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
	ArrowLeft,
	Mail,
	Phone,
	MessageCircle,
	ChevronDown,
} from "lucide-react";

const CONTACTS = [
	{
		Icon: Mail,
		color: "#3B82F6",
		bg: "#EFF6FF",
		label: "E-mail",
		value: "support@tukkievent.com",
		href: "mailto:support@tukkievent.com",
	},
	{
		Icon: Phone,
		color: "#10B981",
		bg: "#ECFDF5",
		label: "Téléphone",
		value: "+221 33 800 00 00",
		href: "tel:+221338000000",
	},
	{
		Icon: MessageCircle,
		color: "#22C55E",
		bg: "#F0FDF4",
		label: "WhatsApp",
		value: "+221 77 000 00 00",
		href: "https://wa.me/221770000000",
	},
];

const FAQ = [
	{
		q: "Comment recevoir mes billets ?",
		a: "Une fois votre paiement confirmé, vos billets électroniques sont disponibles immédiatement dans la rubrique « Mes Billets ». Chaque billet contient un QR code à présenter à l'entrée.",
	},
	{
		q: "Puis-je me faire rembourser ?",
		a: "Les conditions de remboursement dépendent de l'organisateur de l'événement. En cas d'annulation de l'événement, le remboursement est traité automatiquement selon la politique applicable.",
	},
	{
		q: "Quels moyens de paiement sont acceptés ?",
		a: "Vous pouvez payer avec Wave, Orange Money, Free Money, carte bancaire ou PayPal, selon les options proposées lors du paiement.",
	},
	{
		q: "Je n'ai pas reçu mon billet, que faire ?",
		a: "Vérifiez d'abord la rubrique « Mes Billets » et vos e-mails (y compris les spams). Si le problème persiste, contactez-nous avec votre numéro de commande.",
	},
	{
		q: "Comment devenir organisateur ?",
		a: "Rendez-vous sur la page « Devenir organisateur » depuis votre profil et suivez les étapes pour créer votre espace organisateur.",
	},
];

function FaqItem({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="border-b border-gray-100 last:border-0">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="w-full flex items-center justify-between gap-3 py-4 text-left"
				aria-expanded={open}
			>
				<span className="text-sm font-semibold text-gray-900">{q}</span>
				<ChevronDown
					size={18}
					className={`text-gray-400 shrink-0 transition-transform ${
						open ? "rotate-180" : ""
					}`}
				/>
			</button>
			{open && (
				<p className="text-sm text-gray-600 leading-relaxed pb-4 -mt-1">
					{a}
				</p>
			)}
		</div>
	);
}

export default function SupportPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-[#F7F7F7]">
			<header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-40">
				<div className="max-w-3xl mx-auto flex items-center gap-3">
					<button
						type="button"
						onClick={() => router.back()}
						className="p-2 rounded-full hover:bg-gray-100 transition-colors"
						aria-label="Retour"
					>
						<ArrowLeft size={20} className="text-gray-700" />
					</button>
					<h1 className="text-xl font-bold text-gray-900">Aide & Support</h1>
				</div>
			</header>

			<main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
				{/* Contact channels */}
				<motion.section
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
						Nous contacter
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						{CONTACTS.map(({ Icon, color, bg, label, value, href }) => (
							<a
								key={label}
								href={href}
								target={href.startsWith("http") ? "_blank" : undefined}
								rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
								className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 transition-colors"
							>
								<div
									className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
									style={{ backgroundColor: bg }}
								>
									<Icon size={18} style={{ color }} />
								</div>
								<p className="text-xs text-gray-400">{label}</p>
								<p className="text-sm font-semibold text-gray-900 break-words">
									{value}
								</p>
							</a>
						))}
					</div>
				</motion.section>

				{/* FAQ */}
				<motion.section
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
						Questions fréquentes
					</p>
					<div className="bg-white rounded-2xl border border-gray-100 px-5">
						{FAQ.map((item) => (
							<FaqItem key={item.q} {...item} />
						))}
					</div>
				</motion.section>

				<p className="text-center text-sm text-gray-400">
					Notre équipe vous répond du lundi au vendredi, de 9h à 18h (GMT).
				</p>
			</main>
		</div>
	);
}
