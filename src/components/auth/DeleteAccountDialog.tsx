"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLogout } from "@/lib/use-logout";
import { useDeleteMeMutation } from "@/store/api/users/users.api";
import { getApiErrorMessage } from "@/store/api/auth/error";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteAccountDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const CONFIRM_WORD = "SUPPRIMER";

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
	const performLogout = useLogout();
	const [deleteMe, { isLoading }] = useDeleteMeMutation();
	const [confirmText, setConfirmText] = useState("");

	const canDelete = confirmText.trim().toUpperCase() === CONFIRM_WORD;

	const handleDelete = async () => {
		if (!canDelete) return;
		try {
			await deleteMe().unwrap();
			toast.success("Votre compte a été supprimé");
			performLogout();
		} catch (err) {
			toast.error(getApiErrorMessage(err, "Impossible de supprimer le compte"));
		}
	};

	return (
		<AlertDialog
			open={open}
			onOpenChange={(next) => {
				if (!next) setConfirmText("");
				onOpenChange(next);
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Supprimer votre compte ?</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action est irréversible. Toutes vos données — billets,
						favoris et historique — seront définitivement effacées.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="space-y-2">
					<label
						htmlFor="delete-confirm"
						className="text-sm text-gray-600"
					>
						Tapez <span className="font-bold text-gray-900">{CONFIRM_WORD}</span> pour
						confirmer.
					</label>
					<input
						id="delete-confirm"
						type="text"
						autoComplete="off"
						value={confirmText}
						onChange={(e) => setConfirmText(e.target.value)}
						placeholder={CONFIRM_WORD}
						className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
					/>
				</div>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
					<AlertDialogAction
						onClick={(e) => {
							e.preventDefault();
							handleDelete();
						}}
						disabled={!canDelete || isLoading}
						className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
					>
						{isLoading && <Loader2 size={15} className="animate-spin mr-1.5" />}
						Supprimer définitivement
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
