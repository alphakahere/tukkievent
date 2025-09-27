import Link from "next/link";

export default function InfoPage() {
	return (
		<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Participant Information</h1>
				<span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">14:35</span>
			</div>

			<div className="bg-white rounded-xl shadow-sm p-6">
				<div className="grid sm:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
						<input className="w-full border rounded-lg px-3 py-2" placeholder="Awa" />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
						<input className="w-full border rounded-lg px-3 py-2" placeholder="Diop" />
					</div>
					<div className="sm:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">Email (requis)</label>
						<input className="w-full border rounded-lg px-3 py-2" placeholder="awa@example.com" />
					</div>
					<div className="sm:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (optionnel)</label>
						<input className="w-full border rounded-lg px-3 py-2" placeholder="77 123 45 67" />
					</div>
				</div>

				<div className="mt-6">
					<label className="inline-flex items-center">
						<input type="checkbox" defaultChecked className="mr-2" />
						<span className="text-sm text-gray-700">Même personne pour tous les billets</span>
					</label>
				</div>

				<div className="mt-4 space-y-4">
					<h3 className="text-sm font-semibold text-gray-900">Autres participants</h3>
					<div className="grid sm:grid-cols-2 gap-4">
						<input className="w-full border rounded-lg px-3 py-2" placeholder="Prénom" />
						<input className="w-full border rounded-lg px-3 py-2" placeholder="Nom" />
					</div>
					<button className="text-sm text-orange-600">+ Ajouter un participant</button>
				</div>

				<div className="flex items-center justify-end mt-8">
					<Link href="/checkout/payment" className="px-5 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold">Continuer</Link>
				</div>
			</div>
		</main>
	);
}


