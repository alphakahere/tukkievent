import {
	fetchBaseQuery,
	type BaseQueryFn,
	type FetchArgs,
	type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout } from "../features/auth.slice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
	throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in the environment variables.');
}

const rawBaseQuery = fetchBaseQuery({
	baseUrl: API_BASE_URL,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth?.accessToken;
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

// Endpoints where a 401 means "bad credentials / unauthenticated request", not
// "session expired". Logging out + redirecting on these would clobber the form
// error the caller is trying to surface.
const AUTH_PATHS = [
	"/auth/login",
	"/auth/register",
	"/auth/forgot-password",
	"/auth/reset-password",
	"/auth/verify-email",
	"/auth/resend-verification",
];

const isAuthRequest = (args: string | FetchArgs) => {
	const url = typeof args === "string" ? args : args.url;
	return AUTH_PATHS.some((path) => url.startsWith(path));
};

// Wraps the raw query so any 401 on an authenticated endpoint clears the session
// and bounces the user to login (preserving where they were). The hard redirect
// also flushes RTK Query's in-memory cache, so we don't reset each API slice here.
export const baseQuery: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	const result = await rawBaseQuery(args, api, extraOptions);

	if (result.error?.status === 401 && !isAuthRequest(args)) {
		api.dispatch(logout());

		if (typeof window !== "undefined") {
			const { pathname, search } = window.location;
			const onAuthPage = pathname.startsWith("/auth");
			const target = onAuthPage
				? "/auth/login"
				: `/auth/login?redirect=${encodeURIComponent(pathname + search)}`;
			window.location.replace(target);
		}
	}

	return result;
};
