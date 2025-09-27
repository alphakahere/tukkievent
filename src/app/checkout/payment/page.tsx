import Link from "next/link";

export default function PaymentPage() {
	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Wave Payment</h1>
				<span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">14:10</span>
			</div>

			<div className="grid lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<div className="bg-white rounded-xl shadow-sm p-6">
						<div className="mb-6">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-700 font-bold">W</div>
								<div className="text-lg font-semibold text-gray-900">Payer avec Wave</div>
							</div>
							<p className="text-sm text-gray-600 mt-2">Vous recevrez un SMS de Wave pour confirmer le paiement.</p>
						</div>

						<label className="block text-sm font-medium text-gray-700 mb-1">Numéro Wave (Sénégal)</label>
						<input className="w-full border rounded-lg px-3 py-2" placeholder="77 XXX XX XX" />

						<div className="flex items-center justify-end mt-6">
							<Link href="/checkout/confirm" className="px-5 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold">Continuer</Link>
						</div>
					</div>
				</div>
				<div className="lg:col-span-1">
					<div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-24">
						<h3 className="text-base font-semibold text-gray-900 mb-4">Récapitulatif</h3>
						<div className="text-sm text-gray-700 mb-3">Concert Jazz Night</div>
						<div className="text-xs text-gray-500 mb-3">15 Mars 2024 • Le Blue Note, Paris</div>
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-600">Total</span>
							<span className="font-bold text-orange-600">34 000 FCFA</span>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}


