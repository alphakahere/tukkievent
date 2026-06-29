"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { barcodeBars } from "@/lib/ticketBars";

export interface EventTicketProps {
	/** Event title, shown under the "TICKET D'ENTRÉE" heading is not used —
	 * the heading is fixed; the title sits in the details block. */
	title: string;
	dateLabel: string;
	timeLabel: string;
	locationName?: string | null;
	locationLines?: string[];
	/** Ticket type, e.g. "Entrée générale" — rendered uppercase on the stub. */
	typeLabel: string;
	ticketNumber?: string | null;
	qrValue?: string | null;
	website?: string;
	/** Receives the QR <canvas> so callers can export it to a PDF. */
	qrRef?: (el: HTMLCanvasElement | null) => void;
	/** Optional status badge rendered in the top-right of the main panel. */
	statusSlot?: React.ReactNode;
	/** Background color behind the ticket — used to paint the perforation
	 * notches so they read as cut-outs. Defaults to the app surface gray. */
	surface?: string;
	/** Force the vertical (stub-below) layout regardless of width. Use inside
	 * narrow containers like a side sheet, where viewport `sm:` would wrongly
	 * trigger the horizontal layout. */
	stacked?: boolean;
	className?: string;
}

function Barcode({ seed }: { seed: string }) {
	const bars = barcodeBars(seed);
	const unit = 2;
	let x = 0;
	const rects = bars.map((w, i) => {
		const rect =
			i % 2 === 0 ? (
				<rect key={i} x={x} y={0} width={w * unit} height={36} fill="#1a1530" />
			) : null;
		x += w * unit;
		return rect;
	});
	return (
		<svg
			viewBox={`0 0 ${x} 36`}
			width="100%"
			height="36"
			preserveAspectRatio="none"
			aria-hidden
		>
			{rects}
		</svg>
	);
}

export function EventTicket({
	title,
	dateLabel,
	timeLabel,
	locationName,
	locationLines = [],
	typeLabel,
	ticketNumber,
	qrValue,
	website = "www.tukkievent.com",
	qrRef,
	statusSlot,
	surface = "#F7F7F7",
	stacked = false,
	className = "",
}: EventTicketProps) {
	const dir = stacked ? "flex-col" : "flex-col sm:flex-row";
	const stubWidth = stacked ? "" : "sm:w-[208px]";
	const stubBorder = stacked
		? "border-t-2 border-dashed border-white/40"
		: "border-t-2 border-dashed border-white/40 sm:border-t-0 sm:border-l-2";
	// Notch visibility: top notches sit on the horizontal seam (stacked layout
	// or auto-on-mobile); side notches sit on the vertical seam (auto at sm+).
	const topNotch = stacked ? "block" : "sm:hidden";
	const sideNotch = stacked ? "hidden" : "hidden sm:block";
	return (
		<div
			className={`relative flex ${dir} rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm ${className}`}
		>
			{/* Main panel */}
			<div className="flex-1 min-w-0 p-5 sm:p-6">
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0">
						<p className="text-xl font-extrabold tracking-tight">
							<span className="text-gray-900">Tukki</span>
							<span className="text-primary">event</span>
						</p>
						<p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/70 mt-0.5">
							Vos événements, notre passion
						</p>
					</div>
					{statusSlot}
				</div>

				<div className="mt-5">
					<h2 className="text-2xl font-extrabold leading-none text-gray-900">
						TICKET
					</h2>
					<h3 className="text-xl font-bold text-primary leading-tight">
						D&apos;ENTRÉE
					</h3>
				</div>

				<p className="mt-3 text-sm font-semibold text-gray-900 truncate">
					{title}
				</p>

				<div className="mt-4 space-y-3">
					<div className="flex items-center gap-3">
						<span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
							<Calendar size={15} />
						</span>
						<p className="text-sm font-semibold uppercase tracking-wide text-gray-900">
							{dateLabel}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
							<Clock size={15} />
						</span>
						<p className="text-sm font-semibold text-gray-900">{timeLabel}</p>
					</div>
					<div className="flex items-start gap-3">
						<span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
							<MapPin size={15} />
						</span>
						<div className="min-w-0">
							{locationName && (
								<p className="text-sm font-semibold uppercase tracking-wide text-gray-900 truncate">
									{locationName}
								</p>
							)}
							{locationLines.map((line) => (
								<p key={line} className="text-sm text-gray-500 truncate">
									{line}
								</p>
							))}
						</div>
					</div>
				</div>

				<div className="mt-5 pt-4 border-t border-gray-100">
					<p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
						Plus d&apos;infos sur
					</p>
					<p className="text-sm font-bold uppercase tracking-wide text-primary">
						{website}
					</p>
				</div>
			</div>

			{/* Stub */}
			<div
				className={`relative shrink-0 ${stubWidth} bg-gradient-to-br from-[#FF7A45] to-[#E8551F] text-white ${stubBorder} p-5 flex flex-col items-center gap-4`}
			>
				{/* Perforation notches (paint as cut-outs in the surface color) */}
				<span
					className={`${topNotch} absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full`}
					style={{ backgroundColor: surface }}
				/>
				<span
					className={`${topNotch} absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full`}
					style={{ backgroundColor: surface }}
				/>
				<span
					className={`${sideNotch} absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full`}
					style={{ backgroundColor: surface }}
				/>
				<span
					className={`${sideNotch} absolute -bottom-2.5 -left-2.5 w-5 h-5 rounded-full`}
					style={{ backgroundColor: surface }}
				/>

				<span className="px-3 py-1.5 rounded-lg border border-white/50 text-[11px] font-bold uppercase tracking-wider text-center leading-tight">
					{typeLabel}
				</span>

				<div className="bg-white rounded-xl p-2.5">
					{qrValue ? (
						<QRCodeCanvas
							ref={(el) => qrRef?.(el)}
							value={qrValue}
							size={120}
							level="H"
							marginSize={0}
						/>
					) : (
						<div className="w-[120px] h-[120px] flex items-center justify-center text-[10px] text-gray-400 text-center">
							QR en attente
						</div>
					)}
				</div>

				<div className="w-full border-t border-dashed border-white/40" />

				{ticketNumber && (
					<p className="text-base font-bold tracking-wider">
						N° {ticketNumber}
					</p>
				)}

				<div className="w-full bg-white rounded-lg px-2.5 py-2 mt-auto">
					<Barcode seed={ticketNumber || qrValue || title} />
				</div>
			</div>
		</div>
	);
}
