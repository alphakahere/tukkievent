"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Download, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import {
	useLazyDownloadOrderReceiptQuery,
	useGetOrderByIdQuery,
} from "@/store/api/order/order.api";
import { formatDate } from "@/lib/utils";
import { PageLoading } from "@/components/ui/page-loading";
import { useEffect, useState } from "react";
import { clearCart } from "@/store/features/cart.slice";

export default function SuccessPage() {
	// get order id from url
	const searchParams = useSearchParams();
	const orderId = searchParams.get("orderId");
	const { data: order, isLoading } = useGetOrderByIdQuery(orderId || "", {
		skip: !orderId,
	});

	const [downloadError, setDownloadError] = useState<string | null>(null);

	useEffect(() => {
		// clear cart or any other necessary cleanup can be done here
		clearCart();
	}, [orderId]);

	const [
		downloadOrderReceipt,
		{ isLoading: isDownloading },
	] = useLazyDownloadOrderReceiptQuery();

	if (isLoading) {
		return (
			<PageLoading
				title="Chargement..."
				description="Récupération de votre commande"
			/>
		);
	}

	if (!orderId) {
		return (
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center">
					<p className="text-red-500">
						ID de commande introuvable
					</p>
				</div>
			</div>
		);
	}

	const handleDownloadReceipt = async () => {
		try {
			setDownloadError(null);
			const blob = await downloadOrderReceipt({ orderId }).unwrap();
			const url = window.URL.createObjectURL(new Blob([blob]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `receipt_order_${orderId}.pdf`);
			document.body.appendChild(link);
			link.click();
			link.parentNode?.removeChild(link);
		} catch (err) {
			console.error("Download error:", err);
			setDownloadError(
				"Impossible de télécharger le reçu. Veuillez réessayer."
			);
		}
	};

	return (
		<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
				{/* Success Icon with decorative dots */}
				<div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
					<CheckCircle className="text-green-600 w-8 h-8 sm:w-10 sm:h-10" />

					{/* Decorative dots around the icon */}
					<div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full opacity-60"></div>
					<div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-300 rounded-full opacity-40"></div>
					<div className="absolute top-1/2 -left-3 w-2 h-2 bg-green-300 rounded-full opacity-50"></div>
					<div className="absolute top-1/4 -right-3 w-1.5 h-1.5 bg-green-400 rounded-full opacity-60"></div>
					<div className="absolute bottom-1/4 -right-2 w-1 h-1 bg-green-300 rounded-full opacity-40"></div>
				</div>

				<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
					Paiement confirmé !
				</h1>
				<p className="text-gray-700 font-bold text-lg">
					Commande #{orderId}
				</p>
				<p className="text-gray-600 mt-3 text-sm sm:text-base">
					Votre reçu est prêt à être téléchargé.
				</p>

				{/* Event and Buyer Info */}
				<div className="mt-8 text-left bg-gray-50 rounded-lg p-4 sm:p-6">
					<h3 className="font-semibold text-gray-900 mb-3">
						Récapitulatif de l'événement
					</h3>
					<div className="text-sm sm:text-base text-gray-700 space-y-2 mb-6">
						<div>
							<p className="font-bold text-gray-900 text-base sm:text-lg mb-1">
								{order?.event?.title}
							</p>
						</div>
						<div className="flex items-start gap-2">
							<span className="font-medium text-gray-900 min-w-fit">
								Date:
							</span>
							<span className="text-gray-700">
								{formatDate(
									order?.event
										?.startDatetime as string
								)}
							</span>
						</div>
						<div className="flex items-start gap-2">
							<span className="font-medium text-gray-900 min-w-fit">
								Lieu:
							</span>
							<span className="text-gray-700">
								{order?.event?.address}
							</span>
						</div>
					</div>

					<h3 className="font-semibold text-gray-900 mb-2">
						Informations de l'acheteur
					</h3>
					<div className="text-sm sm:text-base text-gray-700 space-y-1">
						<p>
							<span className="font-medium text-gray-900">
								Nom:
							</span>{" "}
							{order?.buyerFirstName}{" "}
							{order?.buyerLastName}
						</p>
						<p>
							<span className="font-medium text-gray-900">
								Téléphone:
							</span>{" "}
							<span className="text-gray-500">
								{order?.buyerPhone}
							</span>
						</p>
						{order?.buyerEmail && (
							<p>
								<span className="font-medium text-gray-900">
									Email:
								</span>{" "}
								<span className="text-gray-500">
									{order?.buyerEmail}
								</span>
							</p>
						)}
					</div>
				</div>

				{/* Download Error Message */}
				{downloadError && (
					<div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
						<div className="flex-1">
							<p className="text-sm text-red-800 font-medium">
								{downloadError}
							</p>
						</div>
						<button
							onClick={() => setDownloadError(null)}
							className="text-red-500 hover:text-red-700 text-sm font-medium"
						>
							✕
						</button>
					</div>
				)}

				{/* Action Buttons */}
				<div className="mt-8 space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
					{/* Download Receipt Button */}
					<button
						onClick={handleDownloadReceipt}
						disabled={isDownloading}
						className="w-full sm:w-auto px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold inline-flex items-center justify-center transition-colors"
					>
						{isDownloading ? (
							<>
								<Loader2 className="w-5 h-5 mr-2 animate-spin" />
								Téléchargement...
							</>
						) : (
							<>
								<Download className="w-5 h-5 mr-2" />
								Télécharger le reçu
							</>
						)}
					</button>

					{/* Back to Events */}
					<Link
						href="/"
						className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold inline-flex items-center justify-center transition-colors"
					>
						Retour aux événements
					</Link>
				</div>

				{/* Help Text */}
				<div className="mt-8 pt-6 border-t border-gray-200">
					<p className="text-xs sm:text-sm text-gray-500">
						Vous pouvez télécharger votre reçu à tout
						moment. En cas de problème, contactez-nous
						avec votre numéro de commande.
					</p>
				</div>
			</div>
		</main>
	);
}


