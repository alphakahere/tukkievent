"use client";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useGetOrderByIdQuery } from "@/store/api/order/order.api";
import { useAppDispatch } from "@/store/features/hooks";
import { clearCart } from "@/store/features/cart.slice";
import { PageLoading } from "@/components/ui/page-loading";
import { formatDate, formatPrice } from "@/lib/utils";

function SuccessInner() {
	const dispatch = useAppDispatch();
	const searchParams = useSearchParams();
	const orderId = searchParams.get("orderId");

	const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId ?? "", {
		skip: !orderId,
	});

	useEffect(() => {
		if (order && order.status === "PAID") {
			dispatch(clearCart());
		}
	}, [order, dispatch]);

	if (isLoading) {
		return (
			<PageLoading
				title="Chargement..."
				description="Récupération de votre commande"
			/>
		);
	}

	if (!orderId || isError || !order) {
		return (
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
					<div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
						<AlertCircle className="text-red-600 w-8 h-8 sm:w-10 sm:h-10" />
					</div>
					<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
						Commande introuvable
					</h1>
					<p className="text-gray-600 mb-6">
						{orderId
							? `Impossible de trouver la commande #${orderId}.`
							: "ID de commande introuvable"}
					</p>
					<Link
						href="/"
						className="inline-block px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
					>
						Retour à l&apos;accueil
					</Link>
				</div>
			</div>
		);
	}

	const ticketsCount = order.tickets?.length ?? 0;

	return (
		<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
				<div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
					<CheckCircle className="text-green-600 w-8 h-8 sm:w-10 sm:h-10" />
				</div>

				<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
					{order.status === "PAID" ? "Paiement confirmé !" : "Commande créée"}
				</h1>
				<p className="text-gray-700 font-bold text-lg">
					Commande #{order.id.slice(-8).toUpperCase()}
				</p>
				<p className="text-gray-600 mt-3 text-sm sm:text-base">
					{ticketsCount} billet{ticketsCount > 1 ? "s" : ""} ·{" "}
					{formatPrice(Number(order.totalAmount))}
				</p>

				<div className="mt-8 text-left bg-gray-50 rounded-lg p-4 sm:p-6">
					<h3 className="font-semibold text-gray-900 mb-3">
						Récapitulatif
					</h3>
					<div className="text-sm sm:text-base text-gray-700 space-y-2 mb-6">
						{order.event?.title && (
							<p className="font-bold text-gray-900 text-base sm:text-lg mb-1">
								{order.event.title}
							</p>
						)}
						{order.event?.startDatetime && (
							<div className="flex items-start gap-2">
								<span className="font-medium text-gray-900 min-w-fit">Date:</span>
								<span className="text-gray-700">
									{formatDate(order.event.startDatetime)}
								</span>
							</div>
						)}
						{order.event?.address && (
							<div className="flex items-start gap-2">
								<span className="font-medium text-gray-900 min-w-fit">Lieu:</span>
								<span className="text-gray-700">{order.event.address}</span>
							</div>
						)}
					</div>

					<h3 className="font-semibold text-gray-900 mb-2">Acheteur</h3>
					<div className="text-sm sm:text-base text-gray-700 space-y-1">
						{order.buyerFirstName && (
							<p>
								<span className="font-medium text-gray-900">Nom:</span>{" "}
								{order.buyerFirstName} {order.buyerLastName ?? ""}
							</p>
						)}
						{order.buyerPhone && (
							<p>
								<span className="font-medium text-gray-900">Téléphone:</span>{" "}
								<span className="text-gray-500">{order.buyerPhone}</span>
							</p>
						)}
						{order.buyerEmail && (
							<p>
								<span className="font-medium text-gray-900">Email:</span>{" "}
								<span className="text-gray-500">{order.buyerEmail}</span>
							</p>
						)}
					</div>
				</div>

				<div className="mt-8 space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
					<Link
						href="/tickets"
						className="w-full sm:w-auto px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold inline-flex items-center justify-center transition-colors"
					>
						Voir mes billets
					</Link>
					<Link
						href="/"
						className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold inline-flex items-center justify-center transition-colors"
					>
						Retour aux événements
					</Link>
				</div>

				<div className="mt-8 pt-6 border-t border-gray-200">
					<p className="text-xs sm:text-sm text-gray-500">
						Une confirmation a été envoyée par email et SMS.
					</p>
				</div>
			</div>
		</main>
	);
}

export default function SuccessPage() {
	return (
		<Suspense fallback={<div className="p-8 text-center text-gray-500">Chargement…</div>}>
			<SuccessInner />
		</Suspense>
	);
}
