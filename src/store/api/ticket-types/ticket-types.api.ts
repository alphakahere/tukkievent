import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export type Currency = "XOF" | "EUR" | "USD";

export interface TicketType {
	id: string;
	eventId: string;
	name: string;
	description: string | null;
	currency: Currency;
	price: number;
	priceEuro: number | null;
	priceUsd: number | null;
	totalQuantity: number;
	minPurchase: number;
	maxPurchase: number;
	saleStartDatetime: string | null;
	saleEndDatetime: string | null;
	isVisible: boolean;
	sortOrder: number;
	soldQuantity: number;
	availableQuantity: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTicketTypePayload {
	name: string;
	description?: string;
	currency?: Currency;
	price: number;
	priceEuro?: number;
	priceUsd?: number;
	totalQuantity: number;
	minPurchase?: number;
	maxPurchase?: number;
	saleStartDatetime?: string;
	saleEndDatetime?: string;
	isVisible?: boolean;
	sortOrder?: number;
}

export type UpdateTicketTypePayload = Partial<CreateTicketTypePayload>;

export const ticketTypeApi = createApi({
	reducerPath: "ticketTypeApi",
	baseQuery,
	tagTypes: ["ticket-types", "ticket-type"],
	endpoints: (builder) => ({
		listTicketTypes: builder.query<TicketType[], string>({
			query: (eventId) => `/events/${eventId}/ticket-types`,
			providesTags: (result, _e, eventId) =>
				result
					? [
							{ type: "ticket-types" as const, id: eventId },
							...result.map((t) => ({ type: "ticket-type" as const, id: t.id })),
						]
					: [{ type: "ticket-types" as const, id: eventId }],
		}),
		createTicketType: builder.mutation<
			TicketType,
			{ eventId: string; body: CreateTicketTypePayload }
		>({
			query: ({ eventId, body }) => ({
				url: `/events/${eventId}/ticket-types`,
				method: "POST",
				body,
			}),
			invalidatesTags: (_r, _e, { eventId }) => [
				{ type: "ticket-types" as const, id: eventId },
			],
		}),
		updateTicketType: builder.mutation<
			TicketType,
			{ id: string; eventId: string; patch: UpdateTicketTypePayload }
		>({
			query: ({ id, patch }) => ({
				url: `/ticket-types/${id}`,
				method: "PATCH",
				body: patch,
			}),
			invalidatesTags: (_r, _e, { id, eventId }) => [
				{ type: "ticket-type" as const, id },
				{ type: "ticket-types" as const, id: eventId },
			],
		}),
		deleteTicketType: builder.mutation<void, { id: string; eventId: string }>({
			query: ({ id }) => ({
				url: `/ticket-types/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (_r, _e, { id, eventId }) => [
				{ type: "ticket-type" as const, id },
				{ type: "ticket-types" as const, id: eventId },
			],
		}),
	}),
});

export const {
	useListTicketTypesQuery,
	useCreateTicketTypeMutation,
	useUpdateTicketTypeMutation,
	useDeleteTicketTypeMutation,
} = ticketTypeApi;
