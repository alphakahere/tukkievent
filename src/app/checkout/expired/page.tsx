import Link from "next/link";

export default function ExpiredPage() {
	return (
		<main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
			<div className="bg-white rounded-xl shadow-sm p-8">
				<div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
					<span className="text-gray-600 text-2xl">⌛</span>
				</div>
				<h1 className="text-2xl font-bold text-gray-900 mb-2">Reservation expired</h1>
				<p className="text-gray-600 mb-4">The 15-minute reservation window has ended.</p>
				<Link href="/checkout/summary" className="px-5 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold inline-block">
					Restart reservation
				</Link>
			</div>
		</main>
	);
}


