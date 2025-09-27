import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDuration } from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
	return format(new Date(date), "dd MMMM yyyy");
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