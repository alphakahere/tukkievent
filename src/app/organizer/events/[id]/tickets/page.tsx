"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
	AlertCircle,
	EyeOff,
	Loader2,
	Pencil,
	Plus,
	Ticket as TicketIcon,
	Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatPrice } from "@/lib/utils";
import { getApiErrorMessage } from "@/store/api/auth/error";
import {
	type TicketType,
	useDeleteTicketTypeMutation,
	useListTicketTypesQuery,
} from "@/store/api/ticket-types/ticket-types.api";
import { TicketTypeFormSheet } from "./_form/TicketTypeFormSheet";

export default function TicketsPage() {
	const params = useParams();
	const eventId = params?.id as string;

	const {
		data: ticketTypes,
		isLoading,
		isError,
	} = useListTicketTypesQuery(eventId, { skip: !eventId });

	const [deleteTicketType, { isLoading: isDeleting }] =
		useDeleteTicketTypeMutation();

	const [editing, setEditing] = useState<TicketType | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [confirmingDelete, setConfirmingDelete] = useState<TicketType | null>(
		null,
	);

	const openCreate = () => {
		setEditing(null);
		setSheetOpen(true);
	};

	const openEdit = (t: TicketType) => {
		setEditing(t);
		setSheetOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!confirmingDelete) return;
		try {
			await deleteTicketType({
				id: confirmingDelete.id,
				eventId,
			}).unwrap();
			toast.success("Billet supprimé");
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
							Types de billets
						</h2>
						<p className="text-xs text-gray-500 mt-0.5">
							Configurez les billets disponibles pour cet événement.
						</p>
					</div>
					<button
						type="button"
						onClick={openCreate}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
					>
						<Plus size={14} />
						Ajouter un billet
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
							Impossible de charger les billets
						</p>
						<p className="text-xs text-gray-500 mt-1">
							Veuillez réessayer dans un instant.
						</p>
					</div>
				) : !ticketTypes || ticketTypes.length === 0 ? (
					<div className="p-12 text-center">
						<TicketIcon size={36} className="mx-auto text-gray-200 mb-3" />
						<p className="text-sm font-medium text-gray-700">
							Aucun type de billet
						</p>
						<p className="text-xs text-gray-500 mt-1 mb-4">
							Ajoutez un premier billet pour ouvrir les inscriptions.
						</p>
						<button
							type="button"
							onClick={openCreate}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
						>
							<Plus size={14} />
							Créer un type de billet
						</button>
					</div>
				) : (
					<ul className="divide-y divide-gray-100">
						{ticketTypes.map((t) => (
							<TicketRow
								key={t.id}
								ticket={t}
								onEdit={() => openEdit(t)}
								onDelete={() => setConfirmingDelete(t)}
							/>
						))}
					</ul>
				)}
			</section>

			<TicketTypeFormSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				eventId={eventId}
				ticketType={editing}
			/>

			<ConfirmDialog
				open={Boolean(confirmingDelete)}
				onOpenChange={(open) => {
					if (!open) setConfirmingDelete(null);
				}}
				title="Supprimer ce type de billet ?"
				description={
					confirmingDelete ? (
						<>
							Le billet « <b>{confirmingDelete.name}</b> » sera définitivement
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

function TicketRow({
	ticket,
	onEdit,
	onDelete,
}: {
	ticket: TicketType;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const sold = ticket.soldQuantity;
	const total = ticket.totalQuantity;
	const pct = total > 0 ? Math.min(100, Math.round((sold / total) * 100)) : 0;
	const hasSales = sold > 0;

	return (
		<li className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
			<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
				<TicketIcon size={18} />
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 flex-wrap">
					<p className="text-sm font-semibold text-gray-900 truncate">
						{ticket.name}
					</p>
					{!ticket.isVisible && (
						<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold uppercase tracking-wider">
							<EyeOff size={10} />
							Masqué
						</span>
					)}
				</div>
				{ticket.description && (
					<p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
						{ticket.description}
					</p>
				)}
				<div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
					<span className="font-semibold text-gray-900">
						{ticket.price === 0 ? "Gratuit" : formatPrice(ticket.price)}
					</span>
					<span>
						{sold} / {total} vendus
					</span>
					<span>
						Min {ticket.minPurchase} · Max {ticket.maxPurchase}
					</span>
				</div>
				<div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-sm">
					<div
						className="h-full bg-primary rounded-full"
						style={{ width: `${pct}%` }}
					/>
				</div>
			</div>
			<div className="flex items-center gap-1 shrink-0">
				<button
					type="button"
					onClick={onEdit}
					aria-label="Modifier le billet"
					className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
				>
					<Pencil size={15} />
				</button>
				<button
					type="button"
					onClick={onDelete}
					disabled={hasSales}
					aria-label="Supprimer le billet"
					title={
						hasSales
							? "Impossible de supprimer un billet déjà vendu"
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
