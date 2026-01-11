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

		downloadOrderReceipt: builder.query<Blob, { orderId: string }>({
			query: ({ orderId }) => ({
				url: `/orders/${orderId}/download-receipt`,
				method: "GET",
				responseHandler: (response) => response.blob(),
			}),
		}),
	}),
});

export const {
	useCreateOrderMutation,
	useGetOrderByIdQuery,
	useDownloadOrderReceiptQuery,
	useLazyDownloadOrderReceiptQuery,
} = orderApi;
