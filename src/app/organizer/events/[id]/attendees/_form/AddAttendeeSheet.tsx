"use client";

import { useEffect } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { getApiErrorMessage } from "@/store/api/auth/error";
import { useAddAttendeeMutation } from "@/store/api/tickets/tickets.api";
import { useListTicketTypesQuery } from "@/store/api/ticket-types/ticket-types.api";
import { type AddAttendeeFormValues, addAttendeeFormSchema } from "./schema";

interface AddAttendeeSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	eventId: string;
}

const EMPTY_DEFAULTS: AddAttendeeFormValues = {
	ticketTypeId: "",
	quantity: 1,
	firstName: "",
	lastName: "",
	email: undefined,
	phone: undefined,
	sendEmail: false,
};

export function AddAttendeeSheet({
	open,
	onOpenChange,
	eventId,
}: AddAttendeeSheetProps) {
	const { data: ticketTypes } = useListTicketTypesQuery(eventId, {
		skip: !eventId || !open,
	});
	const [addAttendee, { isLoading: submitting }] = useAddAttendeeMutation();

	const {
		register,
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<AddAttendeeFormValues>({
		// Cast required: yupResolver widens optional `?:` keys vs yup.InferType output.
		resolver: yupResolver(
			addAttendeeFormSchema,
		) as Resolver<AddAttendeeFormValues>,
		mode: "onTouched",
		defaultValues: EMPTY_DEFAULTS,
	});

	useEffect(() => {
		if (open) reset(EMPTY_DEFAULTS);
	}, [open, reset]);

	const ticketTypeOptions = (ticketTypes ?? []).map((tt) => ({
		value: tt.id,
		label:
			tt.price > 0
				? `${tt.name} — ${tt.price} FCFA (${tt.availableQuantity} dispo)`
				: `${tt.name} — Gratuit (${tt.availableQuantity} dispo)`,
	}));

	const onValid = async (data: AddAttendeeFormValues) => {
		try {
			await addAttendee({
				eventId,
				ticketTypeId: data.ticketTypeId,
				quantity: data.quantity,
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email || undefined,
				phone: data.phone || undefined,
				sendEmail: data.sendEmail,
			}).unwrap();
			toast.success(
				data.quantity > 1
					? `${data.quantity} participants ajoutés`
					: "Participant ajouté",
			);
			onOpenChange(false);
		} catch (err) {
			toast.error(getApiErrorMessage(err, "Impossible d'ajouter le participant"));
		}
	};

	const sendEmail = watch("sendEmail");

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
					<SheetTitle>Ajouter un participant</SheetTitle>
					<SheetDescription>
						Émettez un billet gratuit (invitation / vente hors-ligne). Le billet
						est valide immédiatement et apparaît dans la liste des participants.
					</SheetDescription>
				</SheetHeader>

				<form
					noValidate
					onSubmit={handleSubmit(onValid, onInvalid)}
					className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
				>
					<Controller
						control={control}
						name="ticketTypeId"
						render={({ field, fieldState }) => (
							<FormSelect
								id="attendee-ticket-type"
								label="Type de billet"
								required
								value={field.value}
								onValueChange={field.onChange}
								options={ticketTypeOptions}
								placeholder="Choisir un type de billet"
								error={fieldState.error?.message}
							/>
						)}
					/>

					<FormInput
						id="attendee-quantity"
						label="Quantité"
						required
						type="number"
						min={1}
						max={50}
						error={errors.quantity?.message}
						{...register("quantity")}
					/>

					<div className="grid grid-cols-2 gap-3">
						<FormInput
							id="attendee-first-name"
							label="Prénom"
							required
							placeholder="Awa"
							error={errors.firstName?.message}
							{...register("firstName")}
						/>
						<FormInput
							id="attendee-last-name"
							label="Nom"
							required
							placeholder="Diop"
							error={errors.lastName?.message}
							{...register("lastName")}
						/>
					</div>

					<FormInput
						id="attendee-email"
						label={sendEmail ? "Email" : "Email (facultatif)"}
						required={sendEmail}
						type="email"
						placeholder="awa.diop@email.com"
						error={errors.email?.message}
						{...register("email")}
					/>

					<FormInput
						id="attendee-phone"
						label="Téléphone (facultatif)"
						placeholder="+221 77 000 00 00"
						error={errors.phone?.message}
						{...register("phone")}
					/>

					<Controller
						control={control}
						name="sendEmail"
						render={({ field }) => (
							<label
								htmlFor="attendee-send-email"
								className="flex items-start gap-3 cursor-pointer rounded-xl border border-gray-200 p-3"
							>
								<Checkbox
									id="attendee-send-email"
									checked={field.value}
									onCheckedChange={(v) => field.onChange(v === true)}
									className="mt-0.5"
								/>
								<span className="text-sm">
									<span className="font-medium text-gray-900">
										Envoyer le billet par email
									</span>
									<span className="block text-xs text-gray-500">
										Le participant recevra son billet avec QR code. L&apos;email
										est requis.
									</span>
								</span>
							</label>
						)}
					/>
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
						Ajouter
					</button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
