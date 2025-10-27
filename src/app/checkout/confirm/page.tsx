import Link from "next/link";

export default function ConfirmPage() {
	return (
		<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Confirmation finale</h1>
				<span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
					13:50
				</span>
			</div>

			<div className="grid lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-6">
					<div className="bg-white rounded-xl shadow-sm p-6">
						<h3 className="text-base font-semibold text-gray-900 mb-2">
							Événement
						</h3>
						<p className="text-gray-700">Concert Jazz Night</p>
						<p className="text-sm text-gray-500">
							15 Mars 2024 • Le Blue Note, Dakar
						</p>
					</div>

					<div className="bg-white rounded-xl shadow-sm p-6">
						<h3 className="text-base font-semibold text-gray-900 mb-2">
							Informations de l'acheteur
						</h3>
						<div className="text-gray-700 text-sm space-y-1">
							<p>
								<span className="font-medium">Nom:</span> Awa Diop
							</p>
							<p>
								<span className="font-medium">Téléphone Wave:</span>{" "}
								77 123 45 67
							</p>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-sm p-6">
						<h3 className="text-base font-semibold text-gray-900 mb-2">
							Billets
						</h3>
						<div className="text-gray-700 text-sm space-y-2">
							<div className="flex justify-between">
								<span>Billet Standard x2</span>
								<span>25 000 FCFA</span>
							</div>
							<div className="flex justify-between">
								<span>Billet VIP x1</span>
								<span>15 000 FCFA</span>
							</div>
						</div>
					</div>
				</div>

				<div className="lg:col-span-1">
					<div className="bg-white rounded-xl shadow-sm p-6">
						<h3 className="text-base font-semibold text-gray-900 mb-4">
							Total
						</h3>
						<div className="flex items-center justify-between text-sm mb-2">
							<span className="text-gray-600">Sous-total</span>
							<span className="text-gray-900 font-medium">
								32 000 FCFA
							</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-600">Frais Wave</span>
							<span className="text-gray-900 font-medium">
								2 000 FCFA
							</span>
						</div>
						<hr className="my-3" />
						<div className="flex items-center justify-between text-base">
							<span className="font-semibold text-gray-900">Total</span>
							<span className="font-bold text-orange-600">
								34 000 FCFA
							</span>
						</div>
						<label className="flex items-center gap-2 text-sm text-gray-700 mt-4">
							<input type="checkbox" /> J'accepte les conditions
							générales d'utilisation
						</label>
						<Link
							href="/checkout/processing"
							className="mt-4 block text-center px-5 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold"
						>
							Confirmer et payer 34 000 FCFA
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}


