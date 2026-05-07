"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import {
	useListEventCategoriesQuery,
	useCreateEventCategoryMutation,
	useDeleteEventCategoryMutation,
} from "@/store/api/event-categories/event-categories.api";
import type { EventCategory } from "@/store/api/event-categories/event-categories.type";
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

export default function AdminCategoriesPage() {
	const { data, isLoading, isFetching } = useListEventCategoriesQuery({ page: 1, limit: 100 });
	const [createCategory, { isLoading: isCreating }] = useCreateEventCategoryMutation();
	const [deleteCategory, { isLoading: isDeleting }] = useDeleteEventCategoryMutation();

	const [newName, setNewName] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [toDelete, setToDelete] = useState<EventCategory | null>(null);

	const categories = data?.data ?? [];
	const total = data?.meta.total ?? 0;

	const handleAdd = async () => {
		const name = newName.trim();
		if (!name) return;
		try {
			await createCategory({ name }).unwrap();
			toast.success(`Catégorie «${name}» ajoutée`);
			setNewName("");
			setShowForm(false);
		} catch (err) {
			toast.error(getApiErrorMessage(err, "Impossible de créer la catégorie"));
		}
	};

	const handleConfirmDelete = async () => {
		if (!toDelete) return;
		const name = toDelete.name;
		try {
			await deleteCategory(toDelete.id).unwrap();
			toast.success(`Catégorie «${name}» supprimée`);
			setToDelete(null);
		} catch (err) {
			toast.error(
				getApiErrorMessage(
					err,
					"Impossible de supprimer : catégorie utilisée par au moins un événement.",
				),
			);
			setToDelete(null);
		}
	};

	return (
		<div className="p-4 lg:p-6 space-y-4">
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex items-start justify-between gap-4"
			>
				<div>
					<p className="text-2xl font-bold text-gray-900">
						Catégories
					</p>
					<p className="text-sm text-gray-500 mt-0.5">
						{isLoading
							? "Chargement…"
							: `${total} catégorie${total !== 1 ? "s" : ""}`}
					</p>
				</div>
				<button
					type="button"
					onClick={() => setShowForm(!showForm)}
					className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors shrink-0"
				>
					<Plus size={16} />
					Ajouter
				</button>
			</motion.div>

			{/* Add form */}
			<AnimatePresence>
				{showForm && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{
							duration: 0.2,
							ease: [0.22, 1, 0.36, 1],
						}}
						className="overflow-hidden"
					>
						<div className="bg-white rounded-2xl border border-gray-100 p-5">
							<p className="text-base font-semibold text-gray-900 mb-3">
								Nouvelle catégorie
							</p>
							<div className="flex gap-3">
								<input
									type="text"
									placeholder="Nom de la catégorie"
									value={newName}
									onChange={(e) =>
										setNewName(
											e.target
												.value,
										)
									}
									onKeyDown={(e) =>
										e.key === "Enter" &&
										handleAdd()
									}
									autoFocus
									disabled={isCreating}
									className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
								/>
								<button
									type="button"
									onClick={handleAdd}
									disabled={
										!newName.trim() ||
										isCreating
									}
									className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
								>
									{isCreating
										? "Création…"
										: "Créer"}
								</button>
								<button
									type="button"
									onClick={() => {
										setShowForm(false);
										setNewName("");
									}}
									disabled={isCreating}
									className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
								>
									Annuler
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Category list */}
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
			>
				<div className="hidden md:grid grid-cols-[1fr_160px_120px_60px] gap-4 px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
					<span>Nom</span>
					<span>Slug</span>
					<span>Actif</span>
					<span />
				</div>

				{isLoading ? (
					<div className="px-5 py-8 text-center text-sm text-gray-500">
						Chargement…
					</div>
				) : categories.length === 0 ? (
					<div className="px-5 py-8 text-center text-sm text-gray-500">
						Aucune catégorie pour le moment.
					</div>
				) : (
					<div
						className={`divide-y divide-gray-100 ${isFetching ? "opacity-60" : ""}`}
					>
						{categories.map((cat) => (
							<div
								key={cat.id}
								className="px-5 py-3.5 flex items-center gap-4 md:grid md:grid-cols-[1fr_160px_120px_60px]"
							>
								<div className="flex items-center gap-3 flex-1 min-w-0">
									<div
										className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
										style={{
											backgroundColor:
												cat.color
													? `${cat.color}1a`
													: undefined,
											color:
												cat.color ??
												undefined,
										}}
									>
										<Tag
											size={14}
											className={
												cat.color
													? ""
													: "text-primary"
											}
										/>
									</div>
									<p className="text-sm font-semibold text-gray-900 truncate">
										{cat.name}
									</p>
								</div>
								<p className="hidden md:block text-xs text-gray-400 font-mono truncate">
									{cat.slug}
								</p>
								<p className="hidden md:block text-xs">
									<span
										className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold ${
											cat.isActive
												? "bg-emerald-50 text-emerald-600"
												: "bg-gray-100 text-gray-500"
										}`}
									>
										{cat.isActive
											? "Actif"
											: "Inactif"}
									</span>
								</p>
								<div className="flex justify-end">
									<button
										type="button"
										onClick={() =>
											setToDelete(
												cat,
											)
										}
										disabled={
											isDeleting
										}
										className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-rose-500 transition-colors disabled:opacity-50"
										title="Supprimer"
									>
										<Trash2 size={15} />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</motion.div>

			<AlertDialog
				open={!!toDelete}
				onOpenChange={(open) => !open && setToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Supprimer cette catégorie ?
						</AlertDialogTitle>
						<AlertDialogDescription>
							{toDelete
								? `La catégorie «${toDelete.name}» sera supprimée définitivement. Cette action est irréversible.`
								: ""}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>
							Annuler
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							disabled={isDeleting}
							className="bg-red-500 hover:bg-red-600 text-white"
						>
							{isDeleting
								? "Suppression…"
								: "Supprimer"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
