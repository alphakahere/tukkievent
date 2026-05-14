import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { Paginated } from "../types";
import type {
	CreateOrderInput,
	EventOrdersStats,
	InitiatePaymentInput,
	ListEventOrdersParams,
	ListMyOrdersParams,
	MyOrderListItem,
	MyStats,
	Order,
	OrderListItem,
	OrderPreview,
	OrderStatusResponse,
	OrganizationRevenue,
	PaymentInitiationResponse,
} from "./order.type";

export const orderApi = createApi({
	reducerPath: "orderApi",
	baseQuery,
	tagTypes: [
		"orders",
		"order",
		"event-orders",
		"event-orders-stats",
		"org-revenue",
		"my-orders",
		"my-stats",
	],
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

		// -- Organizer-side --------------------------------------------------

		listEventOrders: builder.query<
			Paginated<OrderListItem>,
			{ eventId: string; params?: ListEventOrdersParams }
		>({
			query: ({ eventId, params }) => ({
				url: `/events/${eventId}/orders`,
				params: params ?? {},
			}),
			providesTags: (_r, _e, { eventId }) => [
				{ type: "event-orders" as const, id: eventId },
			],
		}),
		getEventOrdersStats: builder.query<EventOrdersStats, string>({
			query: (eventId) => `/events/${eventId}/orders/stats`,
			providesTags: (_r, _e, eventId) => [
				{ type: "event-orders-stats" as const, id: eventId },
			],
		}),
		getOrganizationRevenue: builder.query<OrganizationRevenue, string>({
			query: (orgId) => `/organizations/${orgId}/revenue`,
			providesTags: (_r, _e, orgId) => [
				{ type: "org-revenue" as const, id: orgId },
			],
		}),

		// -- Buyer (current user) ------------------------------------------

		listMyOrders: builder.query<
			Paginated<MyOrderListItem>,
			ListMyOrdersParams | void
		>({
			query: (params) => ({
				url: "/users/me/orders",
				params: params ?? {},
			}),
			providesTags: [{ type: "my-orders", id: "LIST" }],
		}),
		getMyStats: builder.query<MyStats, void>({
			query: () => "/users/me/stats",
			providesTags: [{ type: "my-stats", id: "ME" }],
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
	useListEventOrdersQuery,
	useGetEventOrdersStatsQuery,
	useGetOrganizationRevenueQuery,
	useListMyOrdersQuery,
	useGetMyStatsQuery,
} = orderApi;
