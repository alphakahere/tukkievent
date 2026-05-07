import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type {
	CreateOrderInput,
	InitiatePaymentInput,
	Order,
	OrderPreview,
	OrderStatusResponse,
	PaymentInitiationResponse,
} from "./order.type";

export const orderApi = createApi({
	reducerPath: "orderApi",
	baseQuery,
	tagTypes: ["orders", "order"],
	endpoints: (builder) => ({
		previewOrder: builder.mutation<OrderPreview, CreateOrderInput>({
			query: (body) => ({
				url: "/visitor/orders/preview",
				method: "POST",
				body,
			}),
		}),
		createOrder: builder.mutation<Order, CreateOrderInput>({
			query: (body) => ({
				url: "/visitor/orders",
				method: "POST",
				body,
			}),
			invalidatesTags: [{ type: "orders", id: "LIST" }],
		}),
		getOrderById: builder.query<Order, string>({
			query: (id) => `/visitor/orders/${id}`,
			providesTags: (_r, _e, id) => [{ type: "order", id }],
		}),
		getOrderStatus: builder.query<OrderStatusResponse, string>({
			query: (id) => `/visitor/orders/${id}/status`,
		}),
		initiatePayment: builder.mutation<
			PaymentInitiationResponse,
			{ orderId: string; payload: InitiatePaymentInput }
		>({
			query: ({ orderId, payload }) => ({
				url: `/visitor/orders/${orderId}/payment`,
				method: "POST",
				body: payload,
			}),
			invalidatesTags: (_r, _e, { orderId }) => [{ type: "order", id: orderId }],
		}),
	}),
});

export const {
	usePreviewOrderMutation,
	useCreateOrderMutation,
	useGetOrderByIdQuery,
	useLazyGetOrderByIdQuery,
	useGetOrderStatusQuery,
	useLazyGetOrderStatusQuery,
	useInitiatePaymentMutation,
} = orderApi;
