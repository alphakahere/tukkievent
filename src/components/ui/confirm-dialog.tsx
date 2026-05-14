"use client";

import { Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: React.ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	destructive?: boolean;
	loading?: boolean;
	onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = "Confirmer",
	cancelLabel = "Annuler",
	destructive,
	loading,
	onConfirm,
}: ConfirmDialogProps) {
	return (
		<AlertDialog
			open={open}
			onOpenChange={(next) => {
				if (loading) return;
				onOpenChange(next);
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description && (
						<AlertDialogDescription>{description}</AlertDialogDescription>
					)}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
					<AlertDialogAction
						disabled={loading}
						onClick={(e) => {
							// Prevent Radix's default auto-close so async confirmations
							// keep the dialog open until the caller flips `open` to false.
							e.preventDefault();
							void onConfirm();
						}}
						className={cn(
							destructive &&
								"bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/40",
						)}
					>
						{loading && <Loader2 size={16} className="mr-2 animate-spin" />}
						{confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
