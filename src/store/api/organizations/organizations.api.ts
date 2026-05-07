import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { Paginated } from "../types";
import type { Organization as VisitorOrganization } from "../event/event.type";
import type {
	CreateOrganizationPayload,
	ListOrganizationsParams,
	Organization,
	UpdateOrganizationPayload,
} from "./organizations.type";

export const organizationsApi = createApi({
	reducerPath: "organizationsApi",
	baseQuery,
	tagTypes: ["organizations", "organization"],
	endpoints: (builder) => ({
		getVisitorOrganizationBySlug: builder.query<VisitorOrganization, string>({
			query: (slug) => `/visitor/organizations/slug/${slug}`,
			providesTags: (_r, _e, slug) => [{ type: "organization", id: `visitor:${slug}` }],
		}),
		listOrganizations: builder.query<Paginated<Organization>, ListOrganizationsParams | void>({
			query: (params) => ({ url: "/organizations", params: params ?? {} }),
			providesTags: (result) =>
				result
					? [
							{ type: "organizations" as const, id: "LIST" },
							...result.data.map((o) => ({ type: "organization" as const, id: o.id })),
						]
					: [{ type: "organizations" as const, id: "LIST" }],
		}),
		listMyOrganizations: builder.query<Organization[], void>({
			query: () => "/organizations/me",
			providesTags: [{ type: "organizations", id: "MINE" }],
		}),
		getOrganization: builder.query<Organization, string>({
			query: (id) => `/organizations/${id}`,
			providesTags: (_r, _e, id) => [{ type: "organization", id }],
		}),
		getOrganizationBySlug: builder.query<Organization, string>({
			query: (slug) => `/organizations/slug/${slug}`,
			providesTags: (_r, _e, slug) => [{ type: "organization", id: `slug:${slug}` }],
		}),
		createOrganization: builder.mutation<Organization, CreateOrganizationPayload>({
			query: (body) => ({ url: "/organizations", method: "POST", body }),
			invalidatesTags: [
				{ type: "organizations", id: "LIST" },
				{ type: "organizations", id: "MINE" },
			],
		}),
		updateOrganization: builder.mutation<
			Organization,
			{ id: string; patch: UpdateOrganizationPayload }
		>({
			query: ({ id, patch }) => ({ url: `/organizations/${id}`, method: "PATCH", body: patch }),
			invalidatesTags: (_r, _e, { id }) => [
				{ type: "organization", id },
				{ type: "organizations", id: "LIST" },
				{ type: "organizations", id: "MINE" },
			],
		}),
		deleteOrganization: builder.mutation<void, string>({
			query: (id) => ({ url: `/organizations/${id}`, method: "DELETE" }),
			invalidatesTags: (_r, _e, id) => [
				{ type: "organization", id },
				{ type: "organizations", id: "LIST" },
				{ type: "organizations", id: "MINE" },
			],
		}),
	}),
});

export const {
	useGetVisitorOrganizationBySlugQuery,
	useListOrganizationsQuery,
	useListMyOrganizationsQuery,
	useGetOrganizationQuery,
	useGetOrganizationBySlugQuery,
	useCreateOrganizationMutation,
	useUpdateOrganizationMutation,
	useDeleteOrganizationMutation,
} = organizationsApi;
