import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import { setCredentials, setUser } from "../../features/auth.slice";
import type {
	AuthResponse,
	AuthUser,
	ForgotPasswordPayload,
	LoginPayload,
	OkResponse,
	RegisterPayload,
	ResendVerificationPayload,
	ResetPasswordPayload,
	VerifyEmailPayload,
} from "./auth.type";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery,
	tagTypes: ["me"],
	endpoints: (builder) => ({
		register: builder.mutation<AuthResponse, RegisterPayload>({
			query: (body) => ({ url: "/auth/register", method: "POST", body }),
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setCredentials(data));
				} catch {
					/* handled by caller */
				}
			},
		}),
		login: builder.mutation<AuthResponse, LoginPayload>({
			query: (body) => ({ url: "/auth/login", method: "POST", body }),
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setCredentials(data));
				} catch {
					/* handled by caller */
				}
			},
		}),
		me: builder.query<AuthUser, void>({
			query: () => "/auth/me",
			providesTags: ["me"],
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setUser(data));
				} catch {
					/* not authenticated */
				}
			},
		}),
		forgotPassword: builder.mutation<OkResponse, ForgotPasswordPayload>({
			query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
		}),
		resetPassword: builder.mutation<OkResponse, ResetPasswordPayload>({
			query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
		}),
		verifyEmail: builder.mutation<OkResponse, VerifyEmailPayload>({
			query: (body) => ({ url: "/auth/verify-email", method: "POST", body }),
			invalidatesTags: ["me"],
		}),
		resendVerification: builder.mutation<OkResponse, ResendVerificationPayload>({
			query: (body) => ({ url: "/auth/resend-verification", method: "POST", body }),
		}),
	}),
});

export const {
	useRegisterMutation,
	useLoginMutation,
	useMeQuery,
	useLazyMeQuery,
	useForgotPasswordMutation,
	useResetPasswordMutation,
	useVerifyEmailMutation,
	useResendVerificationMutation,
} = authApi;
