import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { Order, OrderInput } from "./order.type";

export const orderApi = createApi({
	reducerPath: "orderApi",
	baseQuery: baseQuery,
	tagTypes: ["orders"],
	endpoints: (builder) => ({
		createOrder: builder.mutation<Order, OrderInput>({
			query: (order) => ({
				url: "/orders",
				method: "POST",
				body: order,
			}),
		}),
	}),
});

export const { useCreateOrderMutation } = orderApi;
