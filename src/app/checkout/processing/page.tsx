import Link from "next/link";

export default function ProcessingPage() {
	return (
		<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="bg-white rounded-xl shadow-sm p-8 text-center">
				<div className="mx-auto w-14 h-14 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin mb-4" />
				<h1 className="text-2xl font-bold text-gray-900 mb-2">Payment request sent</h1>
				<p className="text-gray-600">Check your Wave phone to confirm the payment.</p>
				<div className="mt-6 text-sm text-gray-700">
					<p>Steps: SMS → PIN → Confirm</p>
				</div>
				<div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">05:00</div>
				<div className="mt-8 flex items-center justify-center gap-3">
					<button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Resend SMS</button>
					<button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Change number</button>
				</div>
				<p className="mt-6 text-sm text-gray-500">Payment being validated...</p>
				<div className="mt-8">
					<Link href="/checkout/success/ORDER123" className="px-5 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold inline-block">
						Continue
					</Link>
				</div>
			</div>
		</main>
	);
}


