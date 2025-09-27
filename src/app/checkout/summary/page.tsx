import Link from "next/link";

export default function SummaryPage() {
	return (
		<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">
					Récapitulatif de la réservation
				</h1>
			</div>

			{/* Event Recap */}
			<div className="bg-white rounded-xl shadow-sm p-6 mb-6">
				<div className="flex items-start justify-between">
					<div>
						<h2 className="text-lg font-semibold text-gray-900">
							Concert Jazz Night
						</h2>
						<p className="text-sm text-gray-600">
							Vendredi 15 Mars 2024 • Jazz Club Le Blue Note, Paris
						</p>
					</div>
					<span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
						Musique
					</span>
				</div>
			</div>

			{/* Tickets */}
			<div className="bg-white rounded-xl shadow-sm p-6 mb-6">
				<h3 className="text-base font-semibold text-gray-900 mb-4">Tickets</h3>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium text-gray-800">
								Entrée générale
							</p>
							<p className="text-sm text-gray-500">
								Prix unitaire: 25€
							</p>
						</div>
						<div className="flex items-center gap-3">
							<button className="w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-50">
								-
							</button>
							<span className="w-8 text-center font-semibold">2</span>
							<button className="w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-50">
								+
							</button>
						</div>
						<div className="min-w-[72px] text-right font-semibold text-gray-900">
							50€
						</div>
					</div>
				</div>
			</div>

			{/* Cost Breakdown */}
			<div className="bg-white rounded-xl shadow-sm p-6">
				<h3 className="text-base font-semibold text-gray-900 mb-4">Total</h3>
				<div className="space-y-2 text-sm">
					<div className="flex items-center justify-between">
						<span className="text-gray-600">Sous-total</span>
						<span className="text-gray-900 font-medium">50€</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-gray-600">Frais Wave</span>
						<span className="text-gray-900 font-medium">2€</span>
					</div>
					<hr className="my-3" />
					<div className="flex items-center justify-between text-base">
						<span className="font-semibold text-gray-900">Total</span>
						<span className="font-bold text-orange-600">52€</span>
					</div>
				</div>
				<div className="flex items-center justify-between mt-6">
					<Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
						Modifier la sélection
					</Link>
					<Link
						href="/checkout/info"
						className="px-5 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold"
					>
						Continuer
					</Link>
				</div>
			</div>
		</main>
	);
}


