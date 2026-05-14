"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { getApiErrorMessage } from "@/store/api/auth/error";
import {
	type CreateTicketTypePayload,
	type TicketType,
	useCreateTicketTypeMutation,
	useUpdateTicketTypeMutation,
} from "@/store/api/ticket-types/ticket-types.api";
import {
	type TicketTypeFormValues,
	ticketTypeFormSchema,
} from "./schema";

interface TicketTypeFormSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	eventId: string;
	ticketType?: TicketType | null;
}

const EMPTY_DEFAULTS: TicketTypeFormValues = {
	name: "",
	description: "",
	price: undefined as unknown as number,
	totalQuantity: undefined as unknown as number,
	minPurchase: 1,
	maxPurchase: 10,
	saleStartDate: "",
	saleEndDate: "",
	isVisible: true,
};

function toDefaults(t: TicketType | null | undefined): TicketTypeFormValues {
	if (!t) return EMPTY_DEFAULTS;
	return {
		name: t.name,
		description: t.description ?? "",
		price: t.price,
		totalQuantity: t.totalQuantity,
		minPurchase: t.minPurchase,
		maxPurchase: t.maxPurchase,
		saleStartDate: t.saleStartDatetime ? t.saleStartDatetime.slice(0, 10) : "",
		saleEndDate: t.saleEndDatetime ? t.saleEndDatetime.slice(0, 10) : "",
		isVisible: t.isVisible,
	};
}

function dateToIso(date: string | undefined, endOfDay = false): string | undefined {
	if (!date) return undefined;
	const time = endOfDay ? "T23:59:59" : "T00:00:00";
	return new Date(`${date}${time}`).toISOString();
}

export function TicketTypeFormSheet({
	open,
	onOpenChange,
	eventId,
	ticketType,
}: TicketTypeFormSheetProps) {
	const isEdit = Boolean(ticketType);
	const [createTicketType, { isLoading: isCreating }] =
		useCreateTicketTypeMutation();
	const [updateTicketType, { isLoading: isUpdating }] =
		useUpdateTicketTypeMutation();
	const submitting = isCreating || isUpdating;

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<TicketTypeFormValues>({
		resolver: yupResolver(ticketTypeFormSchema),
		mode: "onTouched",
		defaultValues: toDefaults(ticketType),
	});

	useEffect(() => {
		if (open) reset(toDefaults(ticketType));
	}, [open, ticketType, reset]);

	const onValid = async (data: TicketTypeFormValues) => {
		const payload: CreateTicketTypePayload = {
			name: data.name,
			price: data.price,
			totalQuantity: data.totalQuantity,
			minPurchase: data.minPurchase,
			maxPurchase: data.maxPurchase,
			isVisible: data.isVisible,
		};
		if (data.description) payload.description = data.description;
		const startIso = dateToIso(data.saleStartDate);
		const endIso = dateToIso(data.saleEndDate, true);
		if (startIso) payload.saleStartDatetime = startIso;
		if (endIso) payload.saleEndDatetime = endIso;

		try {
			if (isEdit && ticketType) {
				await updateTicketType({
					id: ticketType.id,
					eventId,
					patch: payload,
				}).unwrap();
				toast.success("Billet mis à jour");
			} else {
				await createTicketType({ eventId, body: payload }).unwrap();
				toast.success("Billet créé");
			}
			onOpenChange(false);
		} catch (err) {
			toast.error(getApiErrorMessage(err));
		}
	};

	const onInvalid = () => {
		toast.error("Veuillez corriger les champs en erreur");
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => {
				if (submitting) return;
				onOpenChange(next);
			}}
		>
			<SheetContent className="flex flex-col w-full sm:max-w-lg">
				<SheetHeader className="border-b border-gray-100">
					<SheetTitle>
						{isEdit ? "Modifier le billet" : "Nouveau type de billet"}
					</SheetTitle>
					<SheetDescription>
						{isEdit
							? "Mettez à jour les informations de ce billet."
							: "Configurez un nouveau billet pour cet événement."}
					</SheetDescription>
				</SheetHeader>

				<form
					noValidate
					onSubmit={handleSubmit(onValid, onInvalid)}
					className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
				>
					<FormInput
						id="ticket-name"
						label="Nom du billet"
						required
						placeholder="Standard, VIP, Early Bird..."
						error={errors.name?.message}
						{...register("name")}
					/>

					<FormTextarea
						id="ticket-description"
						label="Description (facultative)"
						rows={3}
						placeholder="Décrivez ce que ce billet inclut..."
						error={errors.description?.message}
						{...register("description")}
					/>

					<div className="grid grid-cols-2 gap-3">
						<FormInput
							id="ticket-price"
							label="Prix (FCFA)"
							required
							type="number"
							min={0}
							step={50}
							placeholder="0 pour gratuit"
							error={errors.price?.message}
							{...register("price")}
						/>
						<FormInput
							id="ticket-quantity"
							label="Quantité totale"
							required
							type="number"
							min={0}
							placeholder="100"
							error={errors.totalQuantity?.message}
							{...register("totalQuantity")}
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<FormInput
							id="ticket-min"
							label="Achat minimum"
							required
							type="number"
							min={1}
							placeholder="1"
							helperText="Par commande"
							error={errors.minPurchase?.message}
							{...register("minPurchase")}
						/>
						<FormInput
							id="ticket-max"
							label="Achat maximum"
							required
							type="number"
							min={1}
							max={100}
							placeholder="10"
							helperText="Par commande"
							error={errors.maxPurchase?.message}
							{...register("maxPurchase")}
						/>
					</div>

					<div className="space-y-3">
						<p className="text-sm font-medium text-gray-700">
							Période de vente (facultative)
						</p>
						<div className="grid grid-cols-2 gap-3">
							<Controller
								control={control}
								name="saleStartDate"
								render={({ field, fieldState }) => (
									<DatePicker
										id="saleStartDate"
										label="Début"
										value={field.value}
										onChange={field.onChange}
										error={fieldState.error?.message}
									/>
								)}
							/>
							<Controller
								control={control}
								name="saleEndDate"
								render={({ field, fieldState }) => (
									<DatePicker
										id="saleEndDate"
										label="Fin"
										value={field.value}
										onChange={field.onChange}
										error={fieldState.error?.message}
									/>
								)}
							/>
						</div>
					</div>

					<div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
						<Controller
							control={control}
							name="isVisible"
							render={({ field }) => (
								<Checkbox
									id="ticket-visible"
									checked={field.value}
									onCheckedChange={(c) => field.onChange(c === true)}
									className="mt-0.5"
								/>
							)}
						/>
						<label
							htmlFor="ticket-visible"
							className="text-sm text-gray-700 cursor-pointer select-none"
						>
							<span className="font-medium text-gray-900 block">
								Billet visible
							</span>
							<span className="text-xs text-gray-500">
								Décochez pour masquer ce billet sans le supprimer.
							</span>
						</label>
					</div>
				</form>

				<SheetFooter className="border-t border-gray-100 flex-row justify-end gap-2 p-4">
					<button
						type="button"
						onClick={() => onOpenChange(false)}
						disabled={submitting}
						className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
					>
						Annuler
					</button>
					<button
						type="button"
						onClick={() => void handleSubmit(onValid, onInvalid)()}
						disabled={submitting || isSubmitting}
						className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{submitting ? (
							<Loader2 size={14} className="animate-spin" />
						) : (
							<Check size={14} />
						)}
						{isEdit ? "Enregistrer" : "Créer le billet"}
					</button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
