import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import { setUser } from "../../features/auth.slice";
import type { Paginated } from "../types";
import type {
	AdminUpdateUserPayload,
	ListUsersParams,
	UpdateUserPayload,
	User,
} from "./users.type";

export const usersApi = createApi({
	reducerPath: "usersApi",
	baseQuery,
	tagTypes: ["users", "user"],
	endpoints: (builder) => ({
		getMe: builder.query<User, void>({
			query: () => "/users/me",
			providesTags: [{ type: "user", id: "ME" }],
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setUser(data));
				} catch {
					/* not authenticated */
				}
			},
		}),
		updateMe: builder.mutation<User, UpdateUserPayload>({
			query: (body) => ({ url: "/users/me", method: "PATCH", body }),
			invalidatesTags: [{ type: "user", id: "ME" }],
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setUser(data));
				} catch {
					/* handled by caller */
				}
			},
		}),
		deleteMe: builder.mutation<void, void>({
			query: () => ({ url: "/users/me", method: "DELETE" }),
		}),
		listUsers: builder.query<Paginated<User>, ListUsersParams | void>({
			query: (params) => ({ url: "/users", params: params ?? {} }),
			providesTags: (result) =>
				result
					? [
							{ type: "users" as const, id: "LIST" },
							...result.data.map((u) => ({ type: "user" as const, id: u.id })),
						]
					: [{ type: "users" as const, id: "LIST" }],
		}),
		getUser: builder.query<User, string>({
			query: (id) => `/users/${id}`,
			providesTags: (_r, _e, id) => [{ type: "user", id }],
		}),
		adminUpdateUser: builder.mutation<User, { id: string; patch: AdminUpdateUserPayload }>({
			query: ({ id, patch }) => ({ url: `/users/${id}`, method: "PATCH", body: patch }),
			invalidatesTags: (_r, _e, { id }) => [
				{ type: "user", id },
				{ type: "users", id: "LIST" },
			],
		}),
	}),
});

export const {
	useGetMeQuery,
	useLazyGetMeQuery,
	useUpdateMeMutation,
	useDeleteMeMutation,
	useListUsersQuery,
	useGetUserQuery,
	useAdminUpdateUserMutation,
} = usersApi;
