import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const cityApi = createApi({
	reducerPath: "cityApi",
	baseQuery,
	tagTypes: ["cities"],
	endpoints: (builder) => ({
		listCities: builder.query<string[], string | void>({
			query: (q) => ({
				url: "/visitor/cities",
				params: q ? { q } : {},
			}),
			providesTags: ["cities"],
		}),
	}),
});

export const { useListCitiesQuery } = cityApi;
