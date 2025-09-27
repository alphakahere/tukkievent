import Link from "next/link";

type PageProps = { params: { orderID: string } };

export default function SuccessPage({ params }: PageProps) {
	return (
		<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="bg-white rounded-xl shadow-sm p-8 text-center">
				<div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
					<span className="text-green-600 text-2xl">✓</span>
				</div>
				<h1 className="text-2xl font-bold text-gray-900 mb-1">Payment confirmed!</h1>
				<p className="text-gray-700">Order #{params.orderID}</p>
				<p className="text-gray-600 mt-2">Your tickets will arrive by email in 2 minutes.</p>

				<div className="mt-6 text-left bg-gray-50 rounded-lg p-4">
					<h3 className="font-semibold text-gray-900 mb-2">Event Recap</h3>
					<p className="text-sm text-gray-700">Concert Jazz Night • 15 Mars 2024 • Le Blue Note, Paris</p>
					<h3 className="font-semibold text-gray-900 mt-4 mb-2">Participants</h3>
					<ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
						<li>Awa Diop</li>
						<li>Cheikh Ndiaye</li>
					</ul>
				</div>

				<p className="text-sm text-gray-500 mt-6">Check your email.</p>
				<div className="mt-6">
					<Link href="/" className="px-5 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold inline-block">
						Back to events
					</Link>
				</div>
			</div>
		</main>
	);
}


