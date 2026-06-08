"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type {
	IDetectedBarcode,
	IScannerError,
} from "@yudiel/react-qr-scanner";
import { CheckCircle2, AlertTriangle, XCircle, Camera } from "lucide-react";

// The scanner pulls in barcode-detector/WASM and touches browser globals at
// import time, so it must never enter the server bundle. Load it client-only.
const Scanner = dynamic(
	() => import("@yudiel/react-qr-scanner").then((m) => m.Scanner),
	{ ssr: false },
);
import { getApiErrorMessage } from "@/store/api/auth/error";
import { useCheckInByQrMutation } from "@/store/api/tickets/tickets.api";
import type { Attendee } from "@/store/api/tickets/tickets.type";

type ScanFeedback = {
	kind: "success" | "already" | "error";
	message: string;
};

function holderLabel(a: Attendee): string {
	const name = [a.holderFirstName, a.holderLastName].filter(Boolean).join(" ");
	return name.trim() || a.ticketNumber || "Participant";
}

export function ScanCheckInDialog({
	open,
	onOpenChange,
	eventId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	eventId: string;
}) {
	const [checkInByQr] = useCheckInByQrMutation();
	const [feedback, setFeedback] = useState<ScanFeedback | null>(null);
	const [count, setCount] = useState(0);
	const [cameraError, setCameraError] = useState<string | null>(null);
	// Lock so overlapping detections don't fire concurrent requests.
	const processingRef = useRef(false);

	const close = () => {
		setFeedback(null);
		setCount(0);
		setCameraError(null);
		processingRef.current = false;
		onOpenChange(false);
	};

	const handleScan = async (codes: IDetectedBarcode[]) => {
		const qrCode = codes[0]?.rawValue?.trim();
		if (!qrCode || processingRef.current) return;
		processingRef.current = true;
		try {
			const res = await checkInByQr({ eventId, qrCode }).unwrap();
			if (res.alreadyCheckedIn) {
				setFeedback({
					kind: "already",
					message: `${holderLabel(res.attendee)} — déjà enregistré`,
				});
			} else {
				setCount((c) => c + 1);
				setFeedback({
					kind: "success",
					message: `${holderLabel(res.attendee)} — validé`,
				});
			}
		} catch (err) {
			setFeedback({
				kind: "error",
				message: getApiErrorMessage(err, "Billet introuvable"),
			});
		} finally {
			// Brief cooldown to avoid re-scanning the same code in a burst.
			setTimeout(() => {
				processingRef.current = false;
			}, 1200);
		}
	};

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
			role="dialog"
			aria-modal="true"
			aria-label="Scanner les billets"
			onClick={close}
		>
			<div
				className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
					<div className="flex items-center gap-2">
						<Camera size={18} className="text-primary" />
						<h2 className="font-semibold text-gray-900">Scanner les billets</h2>
					</div>
					<span className="text-xs font-medium text-gray-500">
						{count} enregistré{count > 1 ? "s" : ""}
					</span>
				</div>

				<div className="relative aspect-square bg-black">
					{cameraError ? (
						<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-white">
							<XCircle size={40} className="text-red-400" />
							<p className="text-sm">{cameraError}</p>
						</div>
					) : (
						<Scanner
							onScan={(codes) => void handleScan(codes)}
							onError={(err: IScannerError) =>
								setCameraError(
									err?.message ??
										"Impossible d'accéder à la caméra. Vérifiez les autorisations.",
								)
							}
							formats={["qr_code"]}
							scanDelay={300}
							components={{ finder: true }}
							styles={{ container: { height: "100%", width: "100%" } }}
						/>
					)}
				</div>

				{feedback && (
					<div
						className={`flex items-center gap-2 px-5 py-3 text-sm font-medium ${
							feedback.kind === "success"
								? "bg-emerald-50 text-emerald-700"
								: feedback.kind === "already"
									? "bg-amber-50 text-amber-700"
									: "bg-red-50 text-red-700"
						}`}
					>
						{feedback.kind === "success" ? (
							<CheckCircle2 size={16} />
						) : feedback.kind === "already" ? (
							<AlertTriangle size={16} />
						) : (
							<XCircle size={16} />
						)}
						{feedback.message}
					</div>
				)}

				<div className="px-5 py-4 border-t border-gray-100">
					<p className="text-xs text-gray-500 mb-3">
						Pointez la caméra vers le QR code du billet. Le check-in est
						automatique.
					</p>
					<button
						type="button"
						onClick={close}
						className="w-full px-4 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
					>
						Terminer
					</button>
				</div>
			</div>
		</div>
	);
}
