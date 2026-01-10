"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Download, CheckCircle } from "lucide-react";
import { useLazyDownloadOrderTicketsQuery, useGetOrderByIdQuery } from "@/store/api/order/order.api";
import { formatDate } from "@/lib/utils";

export default function SuccessPage() {
	// get order id from url
	const searchParams = useSearchParams();
	const orderId = searchParams.get("orderId");
	const { data: order, isLoading } = useGetOrderByIdQuery(orderId || "", {
		skip: !orderId,
	});

	const [downloadOrderTickets] = useLazyDownloadOrderTicketsQuery();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!orderId) {
		return (
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center">
					<p className="text-red-500">ID de commande introuvable</p>
				</div>
			</div>
		);
	}

	const handleDownloadTickets = () => {
		const tickets = downloadOrderTickets({ orderId }).unwrap();
		tickets.then((blob) => {
			const url = window.URL.createObjectURL(new Blob([blob]));
			const link = document.createElement("a");
			link.href
			 = url;
			link.setAttribute("download", `tickets_order_${orderId}.pdf`);
			document.body.appendChild(link);
			link.click();
			link.parentNode?.removeChild(link);
		});
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
				<p className="text-gray-700 font-bold text-lg">Commande #{orderId}</p>
				<p className="text-gray-600 mt-3 text-sm sm:text-base">
					Vos billets sont prêts à être téléchargés.
				</p>

				{/* Event and Buyer Info */}
				<div className="mt-8 text-left bg-gray-50 rounded-lg p-4 sm:p-6">
					<h3 className="font-semibold text-gray-900 mb-3">
						Récapitulatif de l'événement
					</h3>
					<p className="text-sm sm:text-base text-gray-700 mb-4">
						{order?.event?.title} le {formatDate(order?.event?.startDatetime as string)} <br />
						{order?.event?.address}
					</p>

					<h3 className="font-semibold text-gray-900 mb-2">
						Informations de l'acheteur
					</h3>
					<div className="text-sm sm:text-base text-gray-700 space-y-1">
						<p>
							<span className="font-medium text-gray-900">Nom:</span> {order?.buyerFirstName} {order?.buyerLastName}
						</p>
						<p>
							<span className="font-medium text-gray-900">Téléphone:</span> <span className="text-gray-500">{order?.buyerPhone}</span>
						</p>
						<p>
							<span className="font-medium text-gray-900">Email:</span> <span className="text-gray-500">{order?.buyerEmail}</span>
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="mt-8 space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
					{/* Download Tickets Button */}
					<button
						onClick={handleDownloadTickets}
						className="w-full sm:w-auto px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold inline-flex items-center justify-center transition-colors"
					>
						<Download className="w-5 h-5 mr-2" />
						Télécharger mes billets
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
						Vous pouvez télécharger vos billets à tout moment. En cas de
						problème, contactez-nous avec votre numéro de commande.
					</p>
				</div>
			</div>
		</main>
	);
}


