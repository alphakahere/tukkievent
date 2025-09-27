import Link from "next/link";

export default function FailedPage() {
	return (
		<main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
			<div className="bg-white rounded-xl shadow-sm p-8">
				<div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
					<span className="text-red-600 text-2xl">!</span>
				</div>
				<h1 className="text-2xl font-bold text-gray-900 mb-2">Payment failed</h1>
				<p className="text-gray-600 mb-4">Possible reasons: insufficient balance, wrong PIN.</p>
				<div className="flex items-center justify-center gap-3">
					<Link href="/checkout/processing" className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600">Retry</Link>
					<Link href="/checkout/payment" className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Change Wave number</Link>
				</div>
			</div>
		</main>
	);
}


