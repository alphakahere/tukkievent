import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export type Currency = "XOF" | "EUR" | "USD";
export type Language = "fr" | "en";

export interface UserSettings {
	preferredCurrency: Currency;
	language: Language;
	notificationsEmail: boolean;
	notificationsPush: boolean;
}

export type UpdateUserSettingsPayload = Partial<UserSettings>;

export const userSettingsApi = createApi({
	reducerPath: "userSettingsApi",
	baseQuery,
	tagTypes: ["user-settings"],
	endpoints: (builder) => ({
		getMySettings: builder.query<UserSettings, void>({
			query: () => "/users/me/settings",
			providesTags: [{ type: "user-settings", id: "ME" }],
		}),
		updateMySettings: builder.mutation<UserSettings, UpdateUserSettingsPayload>({
			query: (body) => ({
				url: "/users/me/settings",
				method: "PATCH",
				body,
			}),
			invalidatesTags: [{ type: "user-settings", id: "ME" }],
		}),
	}),
});

export const { useGetMySettingsQuery, useUpdateMySettingsMutation } =
	userSettingsApi;
