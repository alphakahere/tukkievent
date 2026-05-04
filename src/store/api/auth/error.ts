import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

interface ApiErrorBody {
	message?: string | string[];
	error?: string;
	statusCode?: number;
}

type AnyApiError = FetchBaseQueryError | SerializedError | undefined | unknown;

/** Best-effort French error message from a Nest/RTK error. */
export function getApiErrorMessage(
	err: AnyApiError,
	fallback = "Une erreur est survenue",
): string {
	if (!err || typeof err !== "object") return fallback;
	if ("status" in err) {
		const data = (err as FetchBaseQueryError).data as ApiErrorBody | undefined;
		if (data?.message) {
			return Array.isArray(data.message) ? data.message.join(", ") : data.message;
		}
		const status = (err as FetchBaseQueryError).status;
		if (typeof status === "number") return `${fallback} (${status})`;
		return fallback;
	}
	if ("message" in err && typeof (err as SerializedError).message === "string") {
		return (err as SerializedError).message ?? fallback;
	}
	return fallback;
}
