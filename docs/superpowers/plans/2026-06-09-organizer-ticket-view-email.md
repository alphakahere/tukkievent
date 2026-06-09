# Organizer Ticket View + Email Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let organizers email a ticket (queued by the backend) when adding an attendee, and view/download/resend/share the issued ticket (QR code + details) from the attendees page.

**Architecture:** Frontend-only. The backend already issues QR codes (`Attendee.qrCode`) and is assumed to gain a `sendEmail` flag on the add endpoint plus a new resend endpoint. The UI renders the existing `Attendee` data with `qrcode.react`, generates a PDF client-side via `jsPDF`, and shares via a `wa.me` deep link. No new data fetch is needed to view a ticket.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript (strict), RTK Query, React Hook Form + Yup, `qrcode.react`, `jspdf`, Tailwind.

**Note — no test framework:** This repo has no test runner (per CLAUDE.md). Verification gates are `npm run lint`, a final `npm run build`, and explicit manual checks. Each task ends with a commit.

---

### Task 1: Extend ticket API types

**Files:**
- Modify: `src/store/api/tickets/tickets.type.ts`

- [ ] **Step 1: Add `sendEmail` to the add payload and the resend types**

In `src/store/api/tickets/tickets.type.ts`, add `sendEmail?: boolean;` to `AddAttendeePayload` (after `phone?: string;`), and append two new interfaces at the end of the file:

```ts
export interface AddAttendeePayload {
	eventId: string;
	ticketTypeId: string;
	quantity?: number;
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	sendEmail?: boolean;
}

// ...AddAttendeeResult stays unchanged...

export interface ResendTicketEmailPayload {
	eventId: string;
	ticketId: string;
}

export interface ResendTicketEmailResult {
	queued: boolean;
}
```

- [ ] **Step 2: Verify lint passes**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/store/api/tickets/tickets.type.ts
git commit -m "feat: add sendEmail + resend-email ticket API types"
```

---

### Task 2: Add the resend-email mutation

**Files:**
- Modify: `src/store/api/tickets/tickets.api.ts`

- [ ] **Step 1: Import the new types**

In the type import block at the top, add `ResendTicketEmailPayload` and `ResendTicketEmailResult`:

```ts
import type {
	AddAttendeePayload,
	AddAttendeeResult,
	Attendee,
	AttendeeStats,
	CheckInByQrPayload,
	CheckInPayload,
	CheckInResult,
	ListAttendeesParams,
	ResendTicketEmailPayload,
	ResendTicketEmailResult,
} from "./tickets.type";
```

- [ ] **Step 2: Add the mutation endpoint**

Inside `endpoints: (builder) => ({ ... })`, after the `addAttendee` mutation, add:

```ts
		resendTicketEmail: builder.mutation<
			ResendTicketEmailResult,
			ResendTicketEmailPayload
		>({
			query: ({ ticketId }) => ({
				url: `/tickets/${ticketId}/resend-email`,
				method: "POST",
			}),
		}),
```

(No tag invalidation: `Attendee` has no email-status field to refresh.)

- [ ] **Step 3: Export the hook**

In the `export const { ... } = ticketApi;` block, add `useResendTicketEmailMutation,`:

```ts
export const {
	useListEventAttendeesQuery,
	useGetAttendeeStatsQuery,
	useCheckInTicketMutation,
	useCheckInByQrMutation,
	useAddAttendeeMutation,
	useResendTicketEmailMutation,
} = ticketApi;
```

- [ ] **Step 4: Verify lint passes**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/store/api/tickets/tickets.api.ts
git commit -m "feat: add resendTicketEmail mutation"
```

---

### Task 3: Add the attendee-ticket PDF generator

**Files:**
- Modify: `src/lib/pdf.ts`

- [ ] **Step 1: Import the attendee + event types**

At the top of `src/lib/pdf.ts`, after the existing type imports, add:

```ts
import type { Attendee } from "@/store/api/tickets/tickets.type";
import type { EventResource } from "@/store/api/event/event.resource.type";
```

- [ ] **Step 2: Add the status label map and the export**

Append to the end of `src/lib/pdf.ts`:

```ts
const ATTENDEE_STATUS_LABELS: Record<string, string> = {
	VALID: "Valide",
	USED: "Enregistré",
	PENDING: "En attente",
	CANCELLED: "Annulé",
	REFUNDED: "Remboursé",
};

/**
 * Generates a single-page PDF ticket for one organizer-side attendee.
 * `qrImage` is a PNG data URL read from a rendered QR canvas (optional).
 */
export function downloadAttendeeTicketPdf(
	event: EventResource,
	attendee: Attendee,
	qrImage?: string,
): void {
	const doc = new jsPDF({ unit: "pt", format: "a4" });
	let y = drawHeader(doc, "Billet électronique");

	// Event
	doc.setFont("helvetica", "bold");
	doc.setFontSize(15);
	doc.setTextColor(...INK);
	doc.text(event.title, MARGIN, y);
	y += 22;
	doc.setFont("helvetica", "normal");
	doc.setFontSize(11);
	doc.setTextColor(...MUTED);
	const date = event.startDatetime
		? format(new Date(event.startDatetime), "EEEE d MMMM yyyy 'à' HH:mm", {
				locale: fr,
			})
		: null;
	const location =
		event.city || event.address || (event.isOnline ? "En ligne" : null);
	if (date) {
		doc.text(date, MARGIN, y);
		y += 16;
	}
	if (location) {
		doc.text(location, MARGIN, y);
		y += 16;
	}
	y += 10;
	y = divider(doc, y);

	// QR code
	const qrSize = 200;
	const qrX = (PAGE_W - qrSize) / 2;
	if (qrImage) {
		doc.addImage(qrImage, "PNG", qrX, y, qrSize, qrSize);
		y += qrSize + 12;
		doc.setFontSize(9);
		doc.setTextColor(...MUTED);
		doc.text("Présentez ce QR code à l'entrée", PAGE_W / 2, y, {
			align: "center",
		});
		y += 24;
	} else {
		doc.setFontSize(11);
		doc.setTextColor(...MUTED);
		doc.text("QR code en attente", PAGE_W / 2, y + 40, { align: "center" });
		y += 80;
	}
	y = divider(doc, y);

	// Details
	if (attendee.ticketNumber) {
		y = row(doc, "Numéro de billet", attendee.ticketNumber, y, { bold: true });
	}
	const holder = [attendee.holderFirstName, attendee.holderLastName]
		.filter(Boolean)
		.join(" ")
		.trim();
	if (holder) y = row(doc, "Détenteur", holder, y);
	if (attendee.holderEmail) y = row(doc, "E-mail", attendee.holderEmail, y);
	if (attendee.holderPhone) y = row(doc, "Téléphone", attendee.holderPhone, y);
	y = row(doc, "Type de billet", attendee.ticketType.name, y);
	y = row(
		doc,
		"Statut",
		ATTENDEE_STATUS_LABELS[attendee.status] ?? attendee.status,
		y,
	);

	const fileTag = attendee.ticketNumber ?? attendee.id.slice(-8).toUpperCase();
	doc.save(`billet-${fileTag}.pdf`);
}
```

- [ ] **Step 3: Verify lint passes**

Run: `npm run lint`
Expected: no new errors. (`drawHeader`, `divider`, `row`, `INK`, `MUTED`, `PAGE_W`, `MARGIN`, `format`, `fr` are all already defined/imported in this file.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/pdf.ts
git commit -m "feat: add downloadAttendeeTicketPdf"
```

---

### Task 4: Add `sendEmail` to the add-attendee schema

**Files:**
- Modify: `src/app/organizer/events/[id]/attendees/_form/schema.ts`

- [ ] **Step 1: Add the flag and make email conditionally required**

Replace the `email` field and add a `sendEmail` field in `addAttendeeFormSchema`. The `email` rule becomes:

```ts
		email: yup
			.string()
			.transform(emptyToUndefined)
			.email("Email invalide")
			.when("sendEmail", {
				is: true,
				then: (s) => s.required("L'email est requis pour envoyer le billet"),
				otherwise: (s) => s.optional(),
			}),
```

And add this field after `phone` (still inside the `yup.object({ ... })`):

```ts
		sendEmail: yup.boolean().default(false),
```

- [ ] **Step 2: Verify lint passes**

Run: `npm run lint`
Expected: no new errors. `AddAttendeeFormValues` (the `yup.InferType`) now includes `sendEmail: boolean`.

- [ ] **Step 3: Commit**

```bash
git add src/app/organizer/events/\[id\]/attendees/_form/schema.ts
git commit -m "feat: require email when sending ticket; add sendEmail flag"
```

---

### Task 5: Wire the "send email" checkbox into the Add sheet

**Files:**
- Modify: `src/app/organizer/events/[id]/attendees/_form/AddAttendeeSheet.tsx`

- [ ] **Step 1: Import the Checkbox**

Add the import (next to the other `@/components/ui` imports):

```ts
import { Checkbox } from "@/components/ui/checkbox";
```

- [ ] **Step 2: Add `sendEmail` to defaults**

Update `EMPTY_DEFAULTS`:

```ts
const EMPTY_DEFAULTS: AddAttendeeFormValues = {
	ticketTypeId: "",
	quantity: 1,
	firstName: "",
	lastName: "",
	email: undefined,
	phone: undefined,
	sendEmail: false,
};
```

- [ ] **Step 3: Pass `sendEmail` to the mutation**

In `onValid`, add `sendEmail` to the `addAttendee({...})` call:

```ts
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
```

- [ ] **Step 4: Render the checkbox**

After the phone `FormInput` (the last field, before the closing `</form>`), add:

```tsx
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
```

- [ ] **Step 5: Verify lint passes**

Run: `npm run lint`
Expected: no new errors. (`Controller` is already imported.)

- [ ] **Step 6: Manual check**

Run: `npm run dev`, open an event's attendees page, click "Ajouter", tick "Envoyer le billet par email" with a blank email → submit shows the French error "L'email est requis pour envoyer le billet". Untick → submits without requiring email.

- [ ] **Step 7: Commit**

```bash
git add src/app/organizer/events/\[id\]/attendees/_form/AddAttendeeSheet.tsx
git commit -m "feat: add send-ticket-by-email checkbox to Add attendee sheet"
```

---

### Task 6: Build the View Ticket sheet

**Files:**
- Create: `src/app/organizer/events/[id]/attendees/_components/ViewTicketSheet.tsx`

- [ ] **Step 1: Create the component**

Create `src/app/organizer/events/[id]/attendees/_components/ViewTicketSheet.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
	CheckCircle,
	Clock,
	Download,
	Loader2,
	Mail,
	MessageCircle,
	User,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { getApiErrorMessage } from "@/store/api/auth/error";
import { useResendTicketEmailMutation } from "@/store/api/tickets/tickets.api";
import type { Attendee } from "@/store/api/tickets/tickets.type";
import type { EventResource } from "@/store/api/event/event.resource.type";
import { downloadAttendeeTicketPdf } from "@/lib/pdf";

const STATUS_STYLES: Record<
	string,
	{ label: string; cls: string; Icon: typeof CheckCircle }
> = {
	VALID: { label: "Valide", cls: "bg-emerald-500 text-white", Icon: CheckCircle },
	USED: { label: "Enregistré", cls: "bg-gray-500 text-white", Icon: XCircle },
	PENDING: { label: "En attente", cls: "bg-amber-500 text-white", Icon: Clock },
	CANCELLED: { label: "Annulé", cls: "bg-red-500 text-white", Icon: XCircle },
	REFUNDED: { label: "Remboursé", cls: "bg-blue-500 text-white", Icon: XCircle },
};

interface ViewTicketSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	attendee: Attendee | null;
	event: EventResource;
}

export function ViewTicketSheet({
	open,
	onOpenChange,
	attendee,
	event,
}: ViewTicketSheetProps) {
	const qrRef = useRef<HTMLCanvasElement | null>(null);
	const [resendEmail, { isLoading: resending }] = useResendTicketEmailMutation();

	const handleResend = async () => {
		if (!attendee?.holderEmail) return;
		try {
			await resendEmail({ eventId: event.id, ticketId: attendee.id }).unwrap();
			toast.success("Billet envoyé par email");
		} catch (err) {
			toast.error(getApiErrorMessage(err, "Impossible d'envoyer le billet"));
		}
	};

	const handleDownload = () => {
		if (!attendee) return;
		let qrPng: string | undefined;
		if (qrRef.current) {
			try {
				qrPng = qrRef.current.toDataURL("image/png");
			} catch {
				/* tainted canvas — skip QR in the PDF */
			}
		}
		downloadAttendeeTicketPdf(event, attendee, qrPng);
	};

	const handleWhatsApp = () => {
		if (!attendee?.holderPhone) return;
		const digits = attendee.holderPhone.replace(/\D/g, "");
		if (!digits) return;
		const ticketUrl = `${window.location.origin}/tickets/${attendee.order.id}`;
		const lines = [
			`Bonjour ${attendee.holderFirstName ?? ""},`.trim(),
			`Voici votre billet pour ${event.title}.`,
			attendee.ticketNumber ? `Numéro : ${attendee.ticketNumber}` : "",
			ticketUrl,
		].filter(Boolean);
		const text = encodeURIComponent(lines.join("\n"));
		window.open(
			`https://wa.me/${digits}?text=${text}`,
			"_blank",
			"noopener,noreferrer",
		);
	};

	const status = attendee
		? (STATUS_STYLES[attendee.status] ?? STATUS_STYLES.PENDING)
		: null;
	const holder = attendee
		? [attendee.holderFirstName, attendee.holderLastName]
				.filter(Boolean)
				.join(" ")
				.trim()
		: "";

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="flex flex-col w-full sm:max-w-md p-0">
				<SheetHeader className="border-b border-gray-100 px-6 py-4">
					<SheetTitle>Billet du participant</SheetTitle>
					<SheetDescription>
						QR code et détails du billet émis.
					</SheetDescription>
				</SheetHeader>

				{attendee && status && (
					<div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
						<div className="flex items-center justify-between gap-3">
							<p className="text-sm font-semibold text-gray-900 truncate">
								{event.title}
							</p>
							<span
								className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${status.cls}`}
							>
								<status.Icon size={12} /> {status.label}
							</span>
						</div>

						<div className="text-center">
							<div className="w-52 h-52 mx-auto bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center p-4">
								{attendee.qrCode ? (
									<QRCodeCanvas
										ref={(el) => {
											qrRef.current = el;
										}}
										value={attendee.qrCode}
										size={184}
										level="H"
										marginSize={2}
									/>
								) : (
									<p className="text-xs text-gray-400">QR en attente</p>
								)}
							</div>
							{attendee.ticketNumber && (
								<div className="mt-3 bg-gray-50 rounded-xl p-3">
									<p className="text-xs text-gray-400 mb-0.5">
										Numéro de billet
									</p>
									<p className="font-mono font-bold text-gray-900 text-sm">
										{attendee.ticketNumber}
									</p>
								</div>
							)}
						</div>

						<div className="bg-gray-50 rounded-2xl p-4 space-y-2">
							<p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
								Détenteur
							</p>
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
									<User size={16} className="text-primary" />
								</div>
								<div className="min-w-0">
									<p className="text-sm font-semibold text-gray-900 truncate">
										{holder || "—"}
									</p>
									{attendee.holderEmail && (
										<p className="text-xs text-gray-500 truncate">
											{attendee.holderEmail}
										</p>
									)}
									{attendee.holderPhone && (
										<p className="text-xs text-gray-500">
											{attendee.holderPhone}
										</p>
									)}
								</div>
							</div>
							<p className="text-xs text-gray-500 pt-1">
								{attendee.ticketType.name}
							</p>
						</div>
					</div>
				)}

				<SheetFooter className="border-t border-gray-100 flex-col gap-2 p-4">
					<button
						type="button"
						onClick={handleDownload}
						disabled={!attendee}
						className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
					>
						<Download size={16} /> Télécharger le billet (PDF)
					</button>
					<div className="grid grid-cols-2 gap-2">
						<button
							type="button"
							onClick={handleResend}
							disabled={resending || !attendee?.holderEmail}
							className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
						>
							{resending ? (
								<Loader2 size={16} className="animate-spin" />
							) : (
								<Mail size={16} />
							)}
							Renvoyer
						</button>
						<button
							type="button"
							onClick={handleWhatsApp}
							disabled={!attendee?.holderPhone}
							className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
						>
							<MessageCircle size={16} /> WhatsApp
						</button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
```

- [ ] **Step 2: Verify lint passes**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/organizer/events/\[id\]/attendees/_components/ViewTicketSheet.tsx
git commit -m "feat: add ViewTicketSheet (QR, PDF, resend, WhatsApp)"
```

---

### Task 7: Open the sheet from the attendees list

**Files:**
- Modify: `src/app/organizer/events/[id]/attendees/page.tsx`

- [ ] **Step 1: Import the sheet**

Add next to the other local imports (near the `ScanCheckInDialog` import):

```ts
import { ViewTicketSheet } from "./_components/ViewTicketSheet";
```

- [ ] **Step 2: Add view state**

Next to the other `useState` calls (e.g. after `const [addOpen, setAddOpen] = useState(false);`), add:

```ts
	const [viewAttendee, setViewAttendee] = useState<Attendee | null>(null);
```

(`Attendee` is already imported in this file.)

- [ ] **Step 3: Make rows open the sheet**

On the `motion.div` row (the one with `key={attendee.id}`), add an `onClick` and make it look clickable. Change its `className` and add the handler:

```tsx
								<motion.div
									key={attendee.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: index * 0.02 }}
									onClick={() => setViewAttendee(attendee)}
									className="p-4 md:px-6 md:py-3.5 md:grid md:grid-cols-[1fr_1fr_120px_100px_80px] md:gap-4 md:items-center cursor-pointer hover:bg-gray-50 transition-colors"
								>
```

- [ ] **Step 4: Stop the check-in buttons from also opening the sheet**

Both check-in buttons (the mobile one inside `md:hidden`, and the desktop `hidden md:inline-flex` one) call `handleCheckIn(attendee)`. Update both `onClick` handlers to stop propagation:

```tsx
										onClick={(e) => {
											e.stopPropagation();
											handleCheckIn(attendee);
										}}
```

Apply this to **both** check-in buttons.

- [ ] **Step 5: Render the sheet**

Next to the other sheets at the bottom of the JSX (after `<AddAttendeeSheet ... />`), add:

```tsx
			<ViewTicketSheet
				open={!!viewAttendee}
				onOpenChange={(o) => {
					if (!o) setViewAttendee(null);
				}}
				attendee={viewAttendee}
				event={event}
			/>
```

- [ ] **Step 6: Verify lint passes**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 7: Manual check**

Run: `npm run dev`. On the attendees page: clicking a row opens the View Ticket sheet showing the QR (or "QR en attente"), ticket number, holder, status. Clicking the row's "Check-in"/"Annuler" button toggles check-in WITHOUT opening the sheet. In the sheet: "Télécharger le billet (PDF)" downloads a PDF with the QR; "Renvoyer" is disabled when the holder has no email; "WhatsApp" is disabled when the holder has no phone and otherwise opens `wa.me` with prefilled text.

- [ ] **Step 8: Commit**

```bash
git add src/app/organizer/events/\[id\]/attendees/page.tsx
git commit -m "feat: open ViewTicketSheet from attendee rows"
```

---

### Task 8: Full build verification

**Files:** none (verification only)

- [ ] **Step 1: Run the production build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 2: If the build surfaces issues, fix and re-run**

Address any TypeScript/ESLint failures introduced by the new code, then re-run `npm run build` until it passes. Commit any fixes:

```bash
git add -A
git commit -m "fix: resolve build issues for organizer ticket view"
```

---

## Notes for the implementer

- **WhatsApp link target:** the message links to `/tickets/<attendee.order.id>` (the existing attendee ticket page). If, during the manual check in Task 7, that route does not render an organizer-issued attendee's order, drop the `ticketUrl` line from the `lines` array in `ViewTicketSheet` — keep the event title + ticket number text.
- **Backend dependency:** `sendEmail` handling on `POST /events/:eventId/attendees` and the `POST /tickets/:ticketId/resend-email` endpoint are assumed (to-be-built). Until the backend ships them, the checkbox and "Renvoyer" will call endpoints that may 404 — that's expected and surfaces as a toast error.
- **No "email sent" indicator:** `Attendee` has no email-status field, so resend only shows a success toast. A persistent indicator is a deliberate follow-up (see spec "Out of scope").
