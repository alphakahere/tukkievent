"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCw, ArrowLeft, Phone, HelpCircle } from "lucide-react";
import { PageLoading } from "@/components/ui/page-loading";
import { useState, useEffect } from "react";

export default function FailedPage() {
	const searchParams = useSearchParams();
	const orderId = searchParams.get("orderId");
	const errorCode = searchParams.get("error") || "unknown";
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate loading state for better UX
		const timer = setTimeout(() => setIsLoading(false), 500);
		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return (
			<PageLoading
				title="Traitement..."
				description="Analyse de l'erreur de paiement"
				showSkeleton={false}
			/>
		);
	}

	// Error messages mapping
	const getErrorMessage = (code: string) => {
		switch (code) {
			case "insufficient_balance":
				return "Solde insuffisant sur votre compte Wave";
			case "wrong_pin":
				return "Code PIN incorrect";
			case "network_error":
				return "Erreur de connexion réseau";
			case "timeout":
				return "La transaction a expiré";
			case "cancelled":
				return "Transaction annulée par l'utilisateur";
			case "invalid_number":
				return "Numéro de téléphone Wave invalide";
			default:
				return "Une erreur inattendue s'est produite";
		}
	};

	const getErrorSolution = (code: string) => {
		switch (code) {
			case "insufficient_balance":
				return "Vérifiez votre solde Wave ou rechargez votre compte";
			case "wrong_pin":
				return "Vérifiez votre code PIN Wave";
			case "network_error":
				return "Vérifiez votre connexion internet et réessayez";
			case "timeout":
				return "La transaction a pris trop de temps, veuillez réessayer";
			case "cancelled":
				return "Vous avez annulé la transaction";
			case "invalid_number":
				return "Vérifiez que votre numéro Wave est correct";
			default:
				return "Contactez le support client pour obtenir de l'aide";
		}
	};

	return (
		<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
				{/* Error Icon with decorative dots */}
				<div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
					<AlertCircle className="text-red-600 w-8 h-8 sm:w-10 sm:h-10" />

					{/* Decorative dots around the icon */}
					<div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full opacity-60"></div>
					<div className="absolute -bottom-1 -left-1 w-2 h-2 bg-red-300 rounded-full opacity-40"></div>
					<div className="absolute top-1/2 -left-3 w-2 h-2 bg-red-300 rounded-full opacity-50"></div>
					<div className="absolute top-1/4 -right-3 w-1.5 h-1.5 bg-red-400 rounded-full opacity-60"></div>
					<div className="absolute bottom-1/4 -right-2 w-1 h-1 bg-red-300 rounded-full opacity-40"></div>
				</div>

				<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
					Échec du paiement
				</h1>

				{orderId && (
					<p className="text-gray-500 text-sm mb-4">Commande #{orderId}</p>
				)}

				{/* Error Details */}
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
					<div className="flex items-start gap-3">
						<AlertCircle className="text-red-500 w-5 h-5 mt-0.5 flex-shrink-0" />
						<div>
							<h3 className="font-semibold text-red-800 mb-1">
								{getErrorMessage(errorCode)}
							</h3>
							<p className="text-red-700 text-sm">
								{getErrorSolution(errorCode)}
							</p>
						</div>
					</div>
				</div>

				{/* Common Issues */}
				<div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-8 text-left">
					<h3 className="font-semibold text-gray-900 mb-4 flex items-center">
						<HelpCircle className="w-5 h-5 mr-2 text-gray-600" />
						Problèmes courants
					</h3>
					<ul className="space-y-3 text-sm text-gray-700">
						<li className="flex items-start gap-2">
							<span className="text-orange-500 font-bold">•</span>
							<span>Vérifiez que votre solde Wave est suffisant</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-orange-500 font-bold">•</span>
							<span>
								Assurez-vous d'avoir une connexion internet stable
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-orange-500 font-bold">•</span>
							<span>Vérifiez que votre numéro Wave est correct</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-orange-500 font-bold">•</span>
							<span>
								Contactez Wave au 33 33 si le problème persiste
							</span>
						</li>
					</ul>
				</div>

				{/* Action Buttons */}
				<div className="sm:flex sm:justify-center flex-wrap gap-4">
					{/* Retry Payment */}
					<Link
						href="/checkout/payment"
						className="w-full sm:w-auto px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold inline-flex items-center justify-center transition-colors whitespace-nowrap"
					>
						<RefreshCw className="w-5 h-5 mr-2" />
						Réessayer le paiement
					</Link>

					{/* Change Payment Method */}
					<Link
						href="/checkout/payment"
						className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold inline-flex items-center justify-center transition-colors whitespace-nowrap"
					>
						<Phone className="w-5 h-5 mr-2" />
						Changer de numéro
					</Link>

					{/* Back to Event */}
					<Link
						href="/"
						className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold inline-flex items-center justify-center transition-colors whitespace-nowrap"
					>
						<ArrowLeft className="w-5 h-5 mr-2" />
						Retour aux événements
					</Link>
				</div>

				{/* Support Information */}
				<div className="mt-8 pt-6 border-t border-gray-200">
					<p className="text-xs sm:text-sm text-gray-500 mb-2">
						Besoin d'aide ? Contactez notre support client
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
						<a
							href="tel:+221338889999"
							className="text-orange-600 hover:text-orange-700 font-medium"
						>
							📞 +221 33 888 99 99
						</a>
						<a
							href="mailto:support@tukkievent.sn"
							className="text-orange-600 hover:text-orange-700 font-medium"
						>
							✉️ support@tukkievent.sn
						</a>
					</div>
				</div>
			</div>
		</main>
	);
}
