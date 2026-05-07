import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { Organization } from "../event/event.type";

export const organizationsApi = createApi({
	reducerPath: "organizationsApi",
	baseQuery,
	tagTypes: ["organizations", "organization"],
	endpoints: (builder) => ({
		getVisitorOrganizationBySlug: builder.query<Organization, string>({
			query: (slug) => `/visitor/organizations/slug/${slug}`,
			providesTags: (_r, _e, slug) => [{ type: "organization", id: slug }],
		}),
	}),
});

export const { useGetVisitorOrganizationBySlugQuery } = organizationsApi;
