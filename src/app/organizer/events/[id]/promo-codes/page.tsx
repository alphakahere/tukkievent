"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
	AlertCircle,
	Copy,
	Loader2,
	Pencil,
	Plus,
	Power,
	Tag,
	Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatPrice } from "@/lib/utils";
import { getApiErrorMessage } from "@/store/api/auth/error";
import {
	type PromoCode,
	useDeletePromoCodeMutation,
	useListPromoCodesQuery,
	useUpdatePromoCodeMutation,
} from "@/store/api/promo-code/promo-code.api";
import { PromoCodeFormSheet } from "./_form/PromoCodeFormSheet";

export default function PromoCodesPage() {
	const params = useParams();
	const eventId = params?.id as string;

	const {
		data: promoCodes,
		isLoading,
		isError,
	} = useListPromoCodesQuery(eventId, { skip: !eventId });

	const [updatePromoCode] = useUpdatePromoCodeMutation();
	const [deletePromoCode, { isLoading: isDeleting }] =
		useDeletePromoCodeMutation();

	const [editing, setEditing] = useState<PromoCode | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [confirmingDelete, setConfirmingDelete] = useState<PromoCode | null>(
		null,
	);

	const openCreate = () => {
		setEditing(null);
		setSheetOpen(true);
	};

	const openEdit = (p: PromoCode) => {
		setEditing(p);
		setSheetOpen(true);
	};

	const handleToggleActive = async (p: PromoCode) => {
		try {
			await updatePromoCode({
				id: p.id,
				eventId,
				patch: { isActive: !p.isActive },
			}).unwrap();
			toast.success(p.isActive ? "Code désactivé" : "Code activé");
		} catch (err) {
			toast.error(getApiErrorMessage(err));
		}
	};

	const handleCopyCode = async (code: string) => {
		try {
			await navigator.clipboard.writeText(code);
			toast.success("Code copié");
		} catch {
			toast.error("Impossible de copier le code");
		}
	};

	const handleConfirmDelete = async () => {
		if (!confirmingDelete) return;
		try {
			await deletePromoCode({
				id: confirmingDelete.id,
				eventId,
			}).unwrap();
			toast.success("Code promo supprimé");
			setConfirmingDelete(null);
		} catch (err) {
			toast.error(getApiErrorMessage(err));
		}
	};

	return (
		<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
			<section className="bg-white rounded-2xl border border-gray-200">
				<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
					<div>
						<h2 className="text-base font-semibold text-gray-900">
							Codes promo
						</h2>
						<p className="text-xs text-gray-500 mt-0.5">
							Créez des codes de réduction pour vos participants.
						</p>
					</div>
					<button
						type="button"
						onClick={openCreate}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
					>
						<Plus size={14} />
						Créer un code
					</button>
				</div>

				{isLoading ? (
					<div className="p-12 flex items-center justify-center">
						<Loader2 size={24} className="text-primary animate-spin" />
					</div>
				) : isError ? (
					<div className="p-12 text-center">
						<AlertCircle size={36} className="mx-auto text-red-300 mb-3" />
						<p className="text-sm font-medium text-gray-700">
							Impossible de charger les codes promo
						</p>
						<p className="text-xs text-gray-500 mt-1">
							Veuillez réessayer dans un instant.
						</p>
					</div>
				) : !promoCodes || promoCodes.length === 0 ? (
					<div className="p-12 text-center">
						<Tag size={36} className="mx-auto text-gray-200 mb-3" />
						<p className="text-sm font-medium text-gray-700">
							Aucun code promo
						</p>
						<p className="text-xs text-gray-500 mt-1 mb-4">
							Créez un code pour offrir une réduction à vos participants.
						</p>
						<button
							type="button"
							onClick={openCreate}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
						>
							<Plus size={14} />
							Créer un code promo
						</button>
					</div>
				) : (
					<ul className="divide-y divide-gray-100">
						{promoCodes.map((p) => (
							<PromoCodeRow
								key={p.id}
								promoCode={p}
								onCopy={() => handleCopyCode(p.code)}
								onToggleActive={() => handleToggleActive(p)}
								onEdit={() => openEdit(p)}
								onDelete={() => setConfirmingDelete(p)}
							/>
						))}
					</ul>
				)}
			</section>

			<PromoCodeFormSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				eventId={eventId}
				promoCode={editing}
			/>

			<ConfirmDialog
				open={Boolean(confirmingDelete)}
				onOpenChange={(open) => {
					if (!open) setConfirmingDelete(null);
				}}
				title="Supprimer ce code promo ?"
				description={
					confirmingDelete ? (
						<>
							Le code « <b>{confirmingDelete.code}</b> » sera définitivement
							supprimé. Cette action est irréversible.
						</>
					) : null
				}
				confirmLabel="Supprimer"
				destructive
				loading={isDeleting}
				onConfirm={handleConfirmDelete}
			/>
		</motion.div>
	);
}

function PromoCodeRow({
	promoCode,
	onCopy,
	onToggleActive,
	onEdit,
	onDelete,
}: {
	promoCode: PromoCode;
	onCopy: () => void;
	onToggleActive: () => void;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const hasUsages = promoCode.usageCount > 0;
	const discountLabel =
		promoCode.discountType === "PERCENTAGE"
			? `-${promoCode.discountValue}%`
			: `-${formatPrice(promoCode.discountValue)}`;

	const statusLabel = (() => {
		if (!promoCode.isActive) return { text: "Inactif", className: "bg-gray-100 text-gray-600" };
		const now = new Date();
		if (promoCode.validFrom && new Date(promoCode.validFrom) > now) {
			return { text: "À venir", className: "bg-amber-50 text-amber-700" };
		}
		if (promoCode.validUntil && new Date(promoCode.validUntil) < now) {
			return { text: "Expiré", className: "bg-red-50 text-red-600" };
		}
		if (
			promoCode.usageLimit !== null &&
			promoCode.usageCount >= promoCode.usageLimit
		) {
			return { text: "Épuisé", className: "bg-red-50 text-red-600" };
		}
		return { text: "Actif", className: "bg-emerald-50 text-emerald-700" };
	})();

	const usageLabel =
		promoCode.usageLimit !== null
			? `${promoCode.usageCount} / ${promoCode.usageLimit} utilisations`
			: `${promoCode.usageCount} utilisation${promoCode.usageCount > 1 ? "s" : ""}`;

	const validityLabel = (() => {
		const from = promoCode.validFrom
			? format(new Date(promoCode.validFrom), "d MMM", { locale: fr })
			: null;
		const until = promoCode.validUntil
			? format(new Date(promoCode.validUntil), "d MMM yyyy", { locale: fr })
			: null;
		if (from && until) return `${from} → ${until}`;
		if (from) return `Dès le ${from}`;
		if (until) return `Jusqu'au ${until}`;
		return null;
	})();

	return (
		<li className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
			<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
				<Tag size={18} />
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 flex-wrap">
					<button
						type="button"
						onClick={onCopy}
						className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-gray-900 hover:text-primary transition-colors"
						title="Copier le code"
					>
						{promoCode.code}
						<Copy size={12} className="text-gray-400" />
					</button>
					<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
						{discountLabel}
					</span>
					<span
						className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${statusLabel.className}`}
					>
						{statusLabel.text}
					</span>
				</div>
				{promoCode.name && (
					<p className="text-xs text-gray-700 mt-0.5 truncate">
						{promoCode.name}
					</p>
				)}
				<div className="mt-1.5 flex items-center gap-4 text-xs text-gray-500 flex-wrap">
					<span>{usageLabel}</span>
					{promoCode.minOrderAmount !== null && (
						<span>Min {formatPrice(promoCode.minOrderAmount)}</span>
					)}
					{promoCode.discountType === "PERCENTAGE" &&
						promoCode.maxDiscountAmount !== null && (
							<span>Plafond {formatPrice(promoCode.maxDiscountAmount)}</span>
						)}
					{validityLabel && <span>{validityLabel}</span>}
				</div>
			</div>
			<div className="flex items-center gap-1 shrink-0">
				<button
					type="button"
					onClick={onToggleActive}
					aria-label={promoCode.isActive ? "Désactiver" : "Activer"}
					title={promoCode.isActive ? "Désactiver" : "Activer"}
					className={`p-2 rounded-full transition-colors ${
						promoCode.isActive
							? "text-emerald-600 hover:bg-emerald-50"
							: "text-gray-400 hover:bg-gray-100"
					}`}
				>
					<Power size={15} />
				</button>
				<button
					type="button"
					onClick={onEdit}
					aria-label="Modifier le code"
					className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
				>
					<Pencil size={15} />
				</button>
				<button
					type="button"
					onClick={onDelete}
					disabled={hasUsages}
					aria-label="Supprimer le code"
					title={
						hasUsages
							? "Impossible de supprimer un code déjà utilisé"
							: "Supprimer"
					}
					className="p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
				>
					<Trash2 size={15} />
				</button>
			</div>
		</li>
	);
}
