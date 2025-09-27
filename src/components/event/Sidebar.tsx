"use client";
import React, { useState } from "react";
import { Ticket, Share2, Check, Smartphone, ShieldCheck, Undo2, Copy } from "lucide-react";

type SidebarProps = {
	unitPrice: number;
};

const Sidebar: React.FC<SidebarProps> = ({ unitPrice }) => {
	const [count, setCount] = useState(1);
	const [copied, setCopied] = useState(false);
	const total = unitPrice * count;

	return (
		<div className="bg-white rounded-xl p-6 mb-6 sticky top-24">
			<div className="text-center mb-6">
				<div className="text-3xl font-bold text-orange-500 mb-1">{unitPrice}€</div>
				<p className="text-gray-600">par personne</p>
			</div>
			<div className="mb-6">
				<label className="block text-sm font-medium text-gray-700 mb-2">Nombre de billets</label>
				<div className="flex items-center justify-center space-x-4">
					<button onClick={() => setCount((c) => Math.max(1, c - 1))} className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50" aria-label="Diminuer">-</button>
					<span className="text-xl font-bold text-gray-900 w-12 text-center">{count}</span>
					<button onClick={() => setCount((c) => Math.min(10, c + 1))} className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50" aria-label="Augmenter">+</button>
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
			<div className="bg-white rounded-xl p-0 mt-6">
				<button
					onClick={async () => {
						try {
							await navigator.clipboard.writeText(window.location.href);
							setCopied(true);
							setTimeout(() => setCopied(false), 2000);
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
		</div>
	);
};

export default Sidebar;


