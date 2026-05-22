"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion, AnimatePresence } from "motion/react";
import {
	ArrowLeft,
	Plus,
	Minus,
	ChevronRight,
	Check,
	Shield,
	Loader2,
	Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import type { Event, TicketType } from "@/store/api/event/event.type";
import {
	useCreateOrderMutation,
	useInitiatePaymentMutation,
	usePreviewOrderMutation,
} from "@/store/api/order/order.api";
import type { OrderPreview } from "@/store/api/order/order.type";
import { getApiErrorMessage } from "@/store/api/auth/error";
import { useAppDispatch, useAppSelector } from "@/store/features/hooks";
import { setTicketsForEvent } from "@/store/features/cart.slice";
import { selectCartItemByEventId } from "@/store/selectors/cart.selectors";
import { FormInput } from "@/components/ui/form-input";
import {
	getTicketAvailability,
	type TicketAvailability,
} from "@/lib/ticketAvailability";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
	checkoutFormSchema,
	splitName,
	type CheckoutFormValues,
} from "./_form/schema";

type Props = { event: Event };

export default function CheckoutEventScreen({ event }: Props) {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const cartItem = useAppSelector((s) => selectCartItemByEventId(s, event.id));

	const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
	const [initiatePayment, { isLoading: isInitiating }] =
		useInitiatePaymentMutation();
	const [previewOrder, { isLoading: isPreviewing }] = usePreviewOrderMutation();

	const ticketTypes = useMemo(() => event.ticketTypes ?? [], [event.ticketTypes]);
	const now = useMemo(() => new Date(), []);
	const availabilityById = useMemo(() => {
		const map = new Map<string, TicketAvailability>();
		ticketTypes.forEach((tt) => map.set(tt.id, getTicketAvailability(tt, now)));
		return map;
	}, [ticketTypes, now]);

	// Hydrate selections from cart slice
	const selections = cartItem?.tickets ?? [];
	const totalTickets = selections.reduce((s, t) => s + t.quantity, 0);
	const subtotal = selections.reduce((s, t) => s + t.unitPrice * t.quantity, 0);
	const getQuantity = (ticketId: string) =>
		selections.find((t) => t.ticketTypeId === ticketId)?.quantity ?? 0;

	// Start at step 2 if cart already has selections for this event
	const [currentStep, setCurrentStep] = useState<1 | 2>(() =>
		totalTickets > 0 ? 2 : 1,
	);

	const [preview, setPreview] = useState<OrderPreview | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm<CheckoutFormValues>({
		resolver: yupResolver(checkoutFormSchema),
		mode: "onBlur",
		defaultValues: { fullName: "", email: "", phone: "" },
	});

	// Debounced previewOrder whenever selections change from step 2 onward
	const itemsKey = useMemo(
		() =>
			selections
				.map((t) => `${t.ticketTypeId}:${t.quantity}`)
				.sort()
				.join(","),
		[selections],
	);
	const previewRef = useRef(previewOrder);
	previewRef.current = previewOrder;
	useEffect(() => {
		if (currentStep < 2 || selections.length === 0) {
			setPreview(null);
			return;
		}
		let cancelled = false;
		const handle = setTimeout(async () => {
			try {
				const result = await previewRef.current({
					eventId: event.id,
					items: selections.map((t) => ({
						ticketTypeId: t.ticketTypeId,
						quantity: t.quantity,
					})),
					buyer: { firstName: "", lastName: "", phone: "" },
					currency: "XOF",
				}).unwrap();
				if (!cancelled) {
					setPreview(result);
				}
			} catch {
				if (!cancelled) {
					setPreview(null);
				}
			}
		}, 300);
		return () => {
			cancelled = true;
			clearTimeout(handle);
		};
		// itemsKey captures the selection signature
	}, [itemsKey, currentStep, event.id, selections]);

	const fees = preview?.fees ?? 0;
	const discount = preview?.discount ?? 0;
	const grandTotal = preview?.total ?? subtotal;
	const isFree = grandTotal === 0 && totalTickets > 0;

	const adjustQuantity = (ticket: TicketType, delta: number) => {
		const av = availabilityById.get(ticket.id);
		if (!av || av.kind !== "ok") return;
		const current = getQuantity(ticket.id);
		const newQty = Math.max(0, Math.min(av.cap, current + delta));
		if (newQty === current) return;

		const others = selections.filter((t) => t.ticketTypeId !== ticket.id);
		const next = newQty > 0
			? [
					...others,
					{
						ticketTypeId: ticket.id,
						ticketTypeName: ticket.name,
						quantity: newQty,
						unitPrice: Number(ticket.price),
					},
				]
			: others;
		dispatch(
			setTicketsForEvent({
				eventId: event.id,
				eventTitle: event.title,
				eventDate: event.startDatetime,
				tickets: next,
			}),
		);
	};

	// Step 1 advance gate: at least one ticket and all respect minPurchase
	const step1Error = useMemo(() => {
		if (totalTickets === 0) return "Veuillez sélectionner au moins un billet";
		for (const sel of selections) {
			const av = availabilityById.get(sel.ticketTypeId);
			if (av?.kind === "ok" && sel.quantity < av.min) {
				return `Minimum ${av.min} billet${av.min > 1 ? "s" : ""} pour ${sel.ticketTypeName}`;
			}
		}
		return null;
	}, [totalTickets, selections, availabilityById]);

	const handleNext = () => {
		if (currentStep === 1) {
			if (step1Error) {
				toast.error(step1Error);
				return;
			}
			setCurrentStep(2);
			return;
		}
		if (currentStep === 2) {
			handleSubmit(onStep2Valid)();
		}
	};

	const onStep2Valid = async () => {
		await submitOrder({ skipPayment: isFree });
	};

	const submitOrder = async ({ skipPayment }: { skipPayment: boolean }) => {
		if (submitting) return;
		setSubmitting(true);
		try {
			const values = getValues();
			const { first, last } = splitName(values.fullName);
			const order = await createOrder({
				eventId: event.id,
				items: selections.map((t) => ({
					ticketTypeId: t.ticketTypeId,
					quantity: t.quantity,
				})),
				buyer: {
					firstName: first,
					lastName: last,
					...(values.email?.trim() ? { email: values.email.trim() } : {}),
					phone: values.phone,
				},
				currency: "XOF",
			}).unwrap();

			if (skipPayment) {
				router.push(`/checkout/success?orderId=${order.id}`);
				return;
			}

			const payment = await initiatePayment({
				orderId: order.id,
				payload: {
					method: "WAVE",
					phone: values.phone,
					returnUrl:
						typeof window !== "undefined"
							? `${window.location.origin}/checkout/processing?orderId=${order.id}`
							: undefined,
				},
			}).unwrap();

			router.push(
				`/checkout/processing?orderId=${order.id}&redirect=${encodeURIComponent(payment.redirectUrl)}`,
			);
		} catch (err) {
			toast.error(getApiErrorMessage(err, "Le paiement a échoué."));
		} finally {
			setSubmitting(false);
		}
	};

	const handlePreviousStep = () => {
		if (currentStep > 1) setCurrentStep(1);
	};

	const stepLabels = ["Billets", "Informations"];
	const isBusy = submitting || isCreating || isInitiating;
	const ctaLabel = (() => {
		if (isBusy) return "Traitement...";
		if (currentStep === 2 && isFree) return "Confirmer la réservation";
		if (currentStep === 2) return "Payer avec Wave";
		return "Continuer";
	})();

	return (
		<div className="min-h-screen bg-[#F7F7F7] pb-32">
			<header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-50">
				<div className="max-w-lg mx-auto">
					<div className="flex items-center gap-3 mb-4">
						<button
							type="button"
							onClick={() =>
								currentStep === 1 ? router.back() : handlePreviousStep()
							}
							className="p-2 rounded-full hover:bg-gray-100 transition-colors"
						>
							<ArrowLeft size={20} className="text-gray-700" />
						</button>
						<div className="flex-1">
							<p className="font-bold text-gray-900">Réservation</p>
							<p className="text-xs text-gray-500">
								Étape {currentStep}/2 — {stepLabels[currentStep - 1]}
							</p>
						</div>
						<div className="flex gap-1.5">
							{[1, 2].map((s) => (
								<div
									key={s}
									className={`h-1.5 rounded-full transition-all ${
										s === currentStep
											? "w-6 bg-primary"
											: s < currentStep
												? "w-4 bg-primary/40"
												: "w-4 bg-gray-200"
									}`}
								/>
							))}
						</div>
					</div>
					<div className="relative h-1 bg-gray-100 rounded-full overflow-hidden">
						<motion.div
							initial={{ width: 0 }}
							animate={{
								width: `${(currentStep / 2) * 100}%`,
							}}
							transition={{ duration: 0.4, ease: "easeOut" }}
							className="absolute h-full bg-primary rounded-full"
						/>
					</div>
				</div>
			</header>

			<div className="max-w-lg mx-auto px-4 py-6 space-y-4">
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white rounded-2xl border border-gray-100 p-4"
				>
					<div className="flex gap-4">
						{event.coverImageUrl && (
							<Image
								src={event.coverImageUrl}
								alt={event.title}
								width={72}
								height={72}
								className="w-[72px] h-[72px] rounded-xl object-cover flex-shrink-0"
							/>
						)}
						<div className="flex-1 min-w-0">
							<p className="font-semibold text-gray-900 mb-1 line-clamp-1">
								{event.title}
							</p>
							<p className="text-xs text-gray-500 mb-0.5">
								{format(
									new Date(event.startDatetime),
									"EEEE d MMMM · HH:mm",
									{ locale: fr },
								)}
							</p>
							<p className="text-xs text-gray-400">
								{event.city || event.address}
							</p>
						</div>
					</div>
				</motion.div>

				<AnimatePresence mode="wait">
					{currentStep === 1 && (
						<motion.div
							key="step1"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.25 }}
							className="space-y-3"
						>
							<p className="text-base font-semibold text-gray-900">
								Sélectionnez vos billets
							</p>
							{ticketTypes.length === 0 && (
								<div className="bg-white rounded-2xl border border-gray-100 p-4 text-sm text-gray-500">
									Aucun billet disponible pour cet événement.
								</div>
							)}
							{ticketTypes.map((ticket) => {
								const av = availabilityById.get(ticket.id);
								if (!av || av.kind === "hidden") return null;
								const quantity = getQuantity(ticket.id);
								const buyable = av.kind === "ok";
								return (
									<div
										key={ticket.id}
										className="bg-white rounded-2xl border border-gray-100 p-4"
									>
										<div className="flex justify-between items-start mb-3">
											<div className="flex-1">
												<p className="text-sm font-semibold text-gray-900 mb-0.5">
													{ticket.name}
												</p>
												{ticket.description && (
													<p className="text-xs text-gray-500 mb-1">
														{ticket.description}
													</p>
												)}
												<TicketStatusLine availability={av} ticket={ticket} />
											</div>
											<p className="text-base font-bold text-primary ml-3">
												{Number(ticket.price) === 0
													? "Gratuit"
													: `${Number(ticket.price).toLocaleString()} FCFA`}
											</p>
										</div>
										{buyable ? (
											<div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
												<span className="text-sm text-gray-500">
													Quantité
												</span>
												<div className="flex items-center gap-3">
													<button
														type="button"
														onClick={() => adjustQuantity(ticket, -1)}
														disabled={quantity === 0}
														className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 disabled:opacity-40"
													>
														<Minus size={15} className="text-gray-600" />
													</button>
													<span className="w-6 text-center text-sm font-semibold text-gray-900">
														{quantity}
													</span>
													<button
														type="button"
														onClick={() => adjustQuantity(ticket, 1)}
														disabled={quantity >= av.cap}
														className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white disabled:opacity-40"
													>
														<Plus size={15} />
													</button>
												</div>
											</div>
										) : (
											<div className="bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-500">
												Indisponible
											</div>
										)}
										{quantity > 0 && (
											<div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
												<span className="text-xs text-gray-400">
													Sous-total
												</span>
												<span className="text-sm font-bold text-gray-900">
													{(Number(ticket.price) * quantity).toLocaleString()} FCFA
												</span>
											</div>
										)}
									</div>
								);
							})}
						</motion.div>
					)}

					{currentStep === 2 && (
						<motion.div
							key="step2"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.25 }}
							className="space-y-4"
						>
							<p className="text-base font-semibold text-gray-900">
								Vos informations
							</p>
							<form
								onSubmit={(e) => e.preventDefault()}
								className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4"
							>
								<FormInput
									id="checkout-full-name"
									label="Nom complet"
									required
									autoComplete="name"
									placeholder="Ex: Amadou Diallo"
									error={errors.fullName?.message}
									{...register("fullName")}
								/>
								<FormInput
									id="checkout-phone"
									label="Téléphone"
									required
									type="tel"
									autoComplete="tel"
									placeholder="+221 77 123 45 67"
									error={errors.phone?.message}
									helperText="Votre billet sera envoyé par SMS"
									{...register("phone")}
								/>
								<FormInput
									id="checkout-email"
									label="Email"
									type="email"
									autoComplete="email"
									placeholder="exemple@email.com"
									error={errors.email?.message}
									helperText="Optionnel — pour recevoir votre billet par email"
									{...register("email")}
								/>
							</form>

							<RecapCard
								selections={selections}
								subtotal={subtotal}
								fees={fees}
								discount={discount}
								grandTotal={grandTotal}
								isPreviewing={isPreviewing}
								hasPreview={!!preview}
							/>

							{!isFree && (
								<div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3">
									<div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
										<Shield size={16} className="text-emerald-600" />
									</div>
									<div>
										<p className="text-sm font-semibold text-emerald-900 mb-0.5">
											Paiement sécurisé via Wave
										</p>
										<p className="text-xs text-emerald-700">
											Vos informations sont cryptées. Vos billets seront envoyés par SMS après confirmation.
										</p>
									</div>
								</div>
							)}
						</motion.div>
					)}

				</AnimatePresence>
			</div>

			<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 z-40 pb-[calc(1rem+env(safe-area-inset-bottom))]">
				<div className="max-w-lg mx-auto flex items-center justify-between gap-4">
					<div>
						<p className="text-xs text-gray-400">
							Total ({totalTickets} billet{totalTickets > 1 ? "s" : ""})
						</p>
						<p className="text-xl font-bold text-gray-900">
							{grandTotal.toLocaleString()} FCFA
						</p>
					</div>
					{currentStep === 1 ? (
						<button
							type="button"
							onClick={handleNext}
							disabled={!!step1Error}
							className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
						>
							{ctaLabel} <ChevronRight size={18} />
						</button>
					) : (
						<button
							type="button"
							onClick={handleNext}
							disabled={isBusy}
							className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
						>
							{isBusy ? (
								<Loader2 size={18} className="animate-spin" />
							) : isFree ? (
								<Check size={18} />
							) : (
								<Smartphone size={18} />
							)}
							{ctaLabel}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

function TicketStatusLine({
	availability,
	ticket,
}: {
	availability: TicketAvailability;
	ticket: TicketType;
}) {
	if (availability.kind === "ok") {
		const remaining = ticket.availableQuantity ?? ticket.totalQuantity;
		return (
			<p className="text-xs text-gray-400">
				{remaining !== undefined ? `${remaining} disponibles` : "Disponible"}
			</p>
		);
	}
	if (availability.kind === "sold_out") {
		return <p className="text-xs text-red-500">Épuisé</p>;
	}
	if (availability.kind === "ended") {
		return <p className="text-xs text-red-500">Vente terminée</p>;
	}
	if (availability.kind === "not_started") {
		return (
			<p className="text-xs text-amber-600">
				Vente le{" "}
				{format(availability.from, "d MMM", { locale: fr })}
			</p>
		);
	}
	return null;
}

function RecapCard({
	selections,
	subtotal,
	fees,
	discount,
	grandTotal,
	isPreviewing,
	hasPreview,
	title = "Récapitulatif",
}: {
	selections: { ticketTypeId: string; ticketTypeName: string; quantity: number; unitPrice: number }[];
	subtotal: number;
	fees: number;
	discount: number;
	grandTotal: number;
	isPreviewing: boolean;
	hasPreview: boolean;
	title?: string;
}) {
	return (
		<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
			<div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
				<p className="text-sm font-semibold text-gray-900">{title}</p>
				{isPreviewing && (
					<Loader2 size={14} className="text-gray-400 animate-spin" />
				)}
			</div>
			<div className="px-5 py-4 space-y-2">
				{selections.map((ts) => (
					<div
						key={ts.ticketTypeId}
						className="flex justify-between text-sm"
					>
						<span className="text-gray-500">
							{ts.ticketTypeName} × {ts.quantity}
						</span>
						<span className="font-medium text-gray-900">
							{(ts.unitPrice * ts.quantity).toLocaleString()} FCFA
						</span>
					</div>
				))}
				<div className="border-t border-gray-100 pt-3 mt-2 space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-gray-500">Sous-total</span>
						<span className="text-gray-900">
							{subtotal.toLocaleString()} FCFA
						</span>
					</div>
					{hasPreview && fees > 0 && (
						<div className="flex justify-between text-sm">
							<span className="text-gray-500">Frais de service</span>
							<span className="text-gray-900">
								{fees.toLocaleString()} FCFA
							</span>
						</div>
					)}
					{hasPreview && discount > 0 && (
						<div className="flex justify-between text-sm">
							<span className="text-gray-500">Réduction</span>
							<span className="text-emerald-600">
								-{discount.toLocaleString()} FCFA
							</span>
						</div>
					)}
					<div className="flex justify-between">
						<span className="text-sm font-semibold text-gray-900">Total</span>
						<span className="text-base font-bold text-primary">
							{grandTotal.toLocaleString()} FCFA
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
