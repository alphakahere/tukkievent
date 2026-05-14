import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDuration } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
	return format(new Date(date), "dd MMMM yyyy", {
		locale: fr,
	});
}

export function formatTime(date: string) {
	return format(new Date(date), "HH:mm");
}

export function getDuration(startDate: string, endDate: string) {
	return formatDuration({
		hours: Math.floor(
			(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60)
		),
		minutes: Math.floor(
			((new Date(endDate).getTime() - new Date(startDate).getTime()) %
				(1000 * 60 * 60)) /
				(1000 * 60)
		),
	});
}

export function formatPrice(price: number) {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XOF",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);
}

const DEFAULT_IMAGE_URL = "/images/placeholder.png";

/**
 * Resolve an asset reference (stored server-side as a path like
 * `/api/uploads/<filename>` or as a full absolute URL) to a renderable URL.
 *
 * - Absolute URLs (`http://`, `https://`, `data:`, `blob:`) pass through.
 * - Paths starting with `/` are prepended with the API origin so the backend
 *   serves the file (or a CDN does, depending on env).
 * - Empty / nullish input falls back to the placeholder so consumers don't
 *   need to null-check.
 */
export function assetUrl(path?: string | null) {
	if (!path) return DEFAULT_IMAGE_URL;
	if (/^(https?:|data:|blob:)/.test(path)) return path;
	const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
	try {
		const origin = new URL(base).origin;
		return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
	} catch {
		return path;
	}
}

/** @deprecated use {@link assetUrl} */
export const getImageUrl = assetUrl;