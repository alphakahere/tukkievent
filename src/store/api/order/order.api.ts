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

		getOrderById: builder.query<Order, string>({
			query: (id) => `/orders/${id}`,
		}),

		downloadOrderTickets: builder.query<Blob, { orderId: string }>({
			query: ({ orderId }) => ({
				url: `/orders/${orderId}/download-tickets`,
				method: "GET",
				responseHandler: (response) => response.blob(),
			}),
		}),
	}),
});

export const {
	useCreateOrderMutation,
	useGetOrderByIdQuery,
	useDownloadOrderTicketsQuery,
	useLazyDownloadOrderTicketsQuery,
} = orderApi;
