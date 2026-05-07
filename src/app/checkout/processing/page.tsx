"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetOrderStatusQuery } from "@/store/api/order/order.api";

function ProcessingInner() {
	const router = useRouter();
	const params = useSearchParams();
	const orderId = params.get("orderId");
	const redirectUrl = params.get("redirect");
	const [hasOpened, setHasOpened] = useState(false);

	const { data, error } = useGetOrderStatusQuery(orderId ?? "", {
		skip: !orderId,
		pollingInterval: 3000,
	});

	useEffect(() => {
		if (!hasOpened && redirectUrl) {
			setHasOpened(true);
			window.open(redirectUrl, "_blank", "noopener,noreferrer");
		}
	}, [hasOpened, redirectUrl]);

	useEffect(() => {
		if (!data || !orderId) return;
		if (data.status === "PAID") {
			router.replace(`/checkout/success?orderId=${orderId}`);
		} else if (
			data.status === "FAILED" ||
			data.status === "CANCELLED" ||
			data.status === "REFUNDED"
		) {
			router.replace(`/checkout/error?orderId=${orderId}&error=${data.status.toLowerCase()}`);
		}
	}, [data, orderId, router]);

	return (
		<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="bg-white rounded-xl shadow-sm p-8 text-center">
				<div className="mx-auto w-14 h-14 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin mb-4" />
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Paiement en cours
				</h1>
				<p className="text-gray-600">
					Confirmez le paiement sur votre téléphone ou la passerelle de paiement.
				</p>
				{redirectUrl && (
					<a
						href={redirectUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-6 inline-block px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold"
					>
						Rouvrir la page de paiement
					</a>
				)}
				<p className="mt-6 text-sm text-gray-500">
					Vérification automatique du paiement…
				</p>
				{error && (
					<p className="mt-4 text-sm text-red-600">
						Impossible de récupérer le statut de la commande.
					</p>
				)}
				<div className="mt-8">
					<Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
						Annuler et revenir à l&apos;accueil
					</Link>
				</div>
			</div>
		</main>
	);
}

export default function ProcessingPage() {
	return (
		<Suspense fallback={<div className="p-8 text-center text-gray-500">Chargement…</div>}>
			<ProcessingInner />
		</Suspense>
	);
}
