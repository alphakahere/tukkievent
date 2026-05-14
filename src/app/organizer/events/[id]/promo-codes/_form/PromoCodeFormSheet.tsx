"use client";

import { useEffect } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
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
	type CreatePromoCodePayload,
	type PromoCode,
	useCreatePromoCodeMutation,
	useUpdatePromoCodeMutation,
} from "@/store/api/promo-code/promo-code.api";
import {
	type PromoCodeFormValues,
	promoCodeFormSchema,
} from "./schema";

interface PromoCodeFormSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	eventId: string;
	promoCode?: PromoCode | null;
}

const EMPTY_DEFAULTS: PromoCodeFormValues = {
	code: "",
	name: "",
	description: "",
	discountType: "PERCENTAGE",
	discountValue: undefined as unknown as number,
	maxDiscountAmount: undefined,
	usageLimit: undefined,
	minOrderAmount: undefined,
	validFrom: "",
	validUntil: "",
	isActive: true,
};

function toDefaults(p: PromoCode | null | undefined): PromoCodeFormValues {
	if (!p) return EMPTY_DEFAULTS;
	return {
		code: p.code,
		name: p.name ?? "",
		description: p.description ?? "",
		discountType: p.discountType,
		discountValue: p.discountValue,
		maxDiscountAmount: p.maxDiscountAmount ?? undefined,
		usageLimit: p.usageLimit ?? undefined,
		minOrderAmount: p.minOrderAmount ?? undefined,
		validFrom: p.validFrom ? p.validFrom.slice(0, 10) : "",
		validUntil: p.validUntil ? p.validUntil.slice(0, 10) : "",
		isActive: p.isActive,
	};
}

function dateToIso(date: string | undefined, endOfDay = false): string | undefined {
	if (!date) return undefined;
	const time = endOfDay ? "T23:59:59" : "T00:00:00";
	return new Date(`${date}${time}`).toISOString();
}

export function PromoCodeFormSheet({
	open,
	onOpenChange,
	eventId,
	promoCode,
}: PromoCodeFormSheetProps) {
	const isEdit = Boolean(promoCode);
	const [createPromoCode, { isLoading: isCreating }] =
		useCreatePromoCodeMutation();
	const [updatePromoCode, { isLoading: isUpdating }] =
		useUpdatePromoCodeMutation();
	const submitting = isCreating || isUpdating;

	const {
		register,
		control,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<PromoCodeFormValues>({
		// Cast required: yupResolver's inferred TFieldValues widens optional `?:` keys
		// to required `T | undefined`, which doesn't match yup.InferType's output.
		resolver: yupResolver(promoCodeFormSchema) as Resolver<PromoCodeFormValues>,
		mode: "onTouched",
		defaultValues: toDefaults(promoCode),
	});

	useEffect(() => {
		if (open) reset(toDefaults(promoCode));
	}, [open, promoCode, reset]);

	const discountType = watch("discountType");
	const isPercentage = discountType === "PERCENTAGE";

	const onValid = async (data: PromoCodeFormValues) => {
		const payload: CreatePromoCodePayload = {
			code: data.code.trim().toUpperCase(),
			discountType: data.discountType,
			discountValue: data.discountValue,
			isActive: data.isActive,
		};
		if (data.name) payload.name = data.name;
		if (data.description) payload.description = data.description;
		if (data.maxDiscountAmount !== undefined && isPercentage) {
			payload.maxDiscountAmount = data.maxDiscountAmount;
		}
		if (data.usageLimit !== undefined) payload.usageLimit = data.usageLimit;
		if (data.minOrderAmount !== undefined) {
			payload.minOrderAmount = data.minOrderAmount;
		}
		const fromIso = dateToIso(data.validFrom);
		const untilIso = dateToIso(data.validUntil, true);
		if (fromIso) payload.validFrom = fromIso;
		if (untilIso) payload.validUntil = untilIso;

		try {
			if (isEdit && promoCode) {
				// Code cannot be changed on update — the API omits it from the DTO.
				const { code: _code, ...patch } = payload;
				void _code;
				await updatePromoCode({
					id: promoCode.id,
					eventId,
					patch,
				}).unwrap();
				toast.success("Code promo mis à jour");
			} else {
				await createPromoCode({ eventId, body: payload }).unwrap();
				toast.success("Code promo créé");
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
						{isEdit ? "Modifier le code promo" : "Nouveau code promo"}
					</SheetTitle>
					<SheetDescription>
						{isEdit
							? "Mettez à jour ce code de réduction."
							: "Créez un code de réduction pour cet événement."}
					</SheetDescription>
				</SheetHeader>

				<form
					noValidate
					onSubmit={handleSubmit(onValid, onInvalid)}
					className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
				>
					<FormInput
						id="promo-code"
						label="Code"
						required
						placeholder="SUMMER25"
						disabled={isEdit}
						helperText={
							isEdit
								? "Le code ne peut pas être modifié après création"
								: "Lettres majuscules, chiffres et tirets"
						}
						style={{ textTransform: "uppercase" }}
						error={errors.code?.message}
						{...register("code", {
							setValueAs: (v: string) => (v ?? "").toUpperCase(),
						})}
					/>

					<FormInput
						id="promo-name"
						label="Nom interne (facultatif)"
						placeholder="Promo été 2026"
						error={errors.name?.message}
						{...register("name")}
					/>

					<FormTextarea
						id="promo-description"
						label="Description (facultative)"
						rows={2}
						placeholder="À quoi sert ce code ?"
						error={errors.description?.message}
						{...register("description")}
					/>

					<div className="space-y-2">
						<p className="text-sm font-medium text-gray-700">
							Type de réduction <span className="text-red-500">*</span>
						</p>
						<div className="grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={() => {
									setValue("discountType", "PERCENTAGE", {
										shouldValidate: true,
									});
								}}
								className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
									isPercentage
										? "border-primary bg-primary/5 text-primary"
										: "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
								}`}
							>
								Pourcentage (%)
							</button>
							<button
								type="button"
								onClick={() => {
									setValue("discountType", "FIXED_AMOUNT", {
										shouldValidate: true,
									});
								}}
								className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
									!isPercentage
										? "border-primary bg-primary/5 text-primary"
										: "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
								}`}
							>
								Montant fixe (FCFA)
							</button>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<FormInput
							id="promo-discount-value"
							label={isPercentage ? "Réduction (%)" : "Réduction (FCFA)"}
							required
							type="number"
							min={isPercentage ? 1 : 0}
							max={isPercentage ? 100 : undefined}
							step={isPercentage ? 1 : 50}
							placeholder={isPercentage ? "20" : "5000"}
							error={errors.discountValue?.message}
							{...register("discountValue")}
						/>
						{isPercentage ? (
							<FormInput
								id="promo-max-discount"
								label="Plafond (FCFA)"
								type="number"
								min={0}
								step={50}
								placeholder="Optionnel"
								helperText="Réduction max"
								error={errors.maxDiscountAmount?.message}
								{...register("maxDiscountAmount")}
							/>
						) : (
							<div /> /* keep grid layout */
						)}
					</div>

					<div className="grid grid-cols-2 gap-3">
						<FormInput
							id="promo-usage-limit"
							label="Limite d'utilisations"
							type="number"
							min={1}
							placeholder="Illimité"
							helperText="Total, tous acheteurs"
							error={errors.usageLimit?.message}
							{...register("usageLimit")}
						/>
						<FormInput
							id="promo-min-order"
							label="Commande minimum (FCFA)"
							type="number"
							min={0}
							step={50}
							placeholder="Aucune"
							error={errors.minOrderAmount?.message}
							{...register("minOrderAmount")}
						/>
					</div>

					<div className="space-y-3">
						<p className="text-sm font-medium text-gray-700">
							Période de validité (facultative)
						</p>
						<div className="grid grid-cols-2 gap-3">
							<Controller
								control={control}
								name="validFrom"
								render={({ field, fieldState }) => (
									<DatePicker
										id="promo-valid-from"
										label="Début"
										value={field.value}
										onChange={field.onChange}
										error={fieldState.error?.message}
									/>
								)}
							/>
							<Controller
								control={control}
								name="validUntil"
								render={({ field, fieldState }) => (
									<DatePicker
										id="promo-valid-until"
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
							name="isActive"
							render={({ field }) => (
								<Checkbox
									id="promo-active"
									checked={field.value}
									onCheckedChange={(c) => field.onChange(c === true)}
									className="mt-0.5"
								/>
							)}
						/>
						<label
							htmlFor="promo-active"
							className="text-sm text-gray-700 cursor-pointer select-none"
						>
							<span className="font-medium text-gray-900 block">
								Code actif
							</span>
							<span className="text-xs text-gray-500">
								Décochez pour suspendre le code sans le supprimer.
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
						{isEdit ? "Enregistrer" : "Créer le code"}
					</button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
