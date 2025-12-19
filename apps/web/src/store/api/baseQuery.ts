import {
	fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in the environment variables.');
}

export const baseQuery = fetchBaseQuery({
	baseUrl: API_BASE_URL,
	// prepareHeaders: (headers, { getState }: { getState: any }) => {
	// 	const token =
	// 		(getState() as RootState).user.token ??
	// 		AppStorage.getItem<AuthState>("user")?.token;
	// 	if (token) {
	// 		headers.set("Authorization", `Bearer ${token}`);
	// 	}
	// 	return headers;
	// },
});

