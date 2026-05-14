import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export interface PromoCode {
	id: string;
	eventId: string | null;
	organizerId: string;
	organizationId: string | null;
	code: string;
	name: string | null;
	description: string | null;
	discountType: DiscountType;
	discountValue: number;
	maxDiscountAmount: number | null;
	usageLimit: number | null;
	usageCount: number;
	minOrderAmount: number | null;
	validFrom: string | null;
	validUntil: string | null;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreatePromoCodePayload {
	code: string;
	name?: string;
	description?: string;
	discountType: DiscountType;
	discountValue: number;
	maxDiscountAmount?: number;
	usageLimit?: number;
	minOrderAmount?: number;
	validFrom?: string;
	validUntil?: string;
	isActive?: boolean;
}

export type UpdatePromoCodePayload = Partial<Omit<CreatePromoCodePayload, "code">>;

export interface ValidatePromoCodeInput {
	code: string;
	eventId: string;
	subtotal: number;
}

export interface PromoCodeValidation {
	valid: boolean;
	code: string;
	discountAmount: number;
	finalTotal: number;
}

export const promoCodeApi = createApi({
	reducerPath: "promoCodeApi",
	baseQuery,
	tagTypes: ["promo-codes", "promo-code"],
	endpoints: (builder) => ({
		validatePromoCode: builder.mutation<PromoCodeValidation, ValidatePromoCodeInput>({
			query: (body) => ({
				url: "/visitor/promo-codes/validate",
				method: "POST",
				body,
			}),
		}),
		listPromoCodes: builder.query<PromoCode[], string>({
			query: (eventId) => `/events/${eventId}/promo-codes`,
			providesTags: (result, _e, eventId) =>
				result
					? [
							{ type: "promo-codes" as const, id: eventId },
							...result.map((p) => ({ type: "promo-code" as const, id: p.id })),
						]
					: [{ type: "promo-codes" as const, id: eventId }],
		}),
		createPromoCode: builder.mutation<
			PromoCode,
			{ eventId: string; body: CreatePromoCodePayload }
		>({
			query: ({ eventId, body }) => ({
				url: `/events/${eventId}/promo-codes`,
				method: "POST",
				body,
			}),
			invalidatesTags: (_r, _e, { eventId }) => [
				{ type: "promo-codes" as const, id: eventId },
			],
		}),
		updatePromoCode: builder.mutation<
			PromoCode,
			{ id: string; eventId: string; patch: UpdatePromoCodePayload }
		>({
			query: ({ id, patch }) => ({
				url: `/promo-codes/${id}`,
				method: "PATCH",
				body: patch,
			}),
			invalidatesTags: (_r, _e, { id, eventId }) => [
				{ type: "promo-code" as const, id },
				{ type: "promo-codes" as const, id: eventId },
			],
		}),
		deletePromoCode: builder.mutation<void, { id: string; eventId: string }>({
			query: ({ id }) => ({ url: `/promo-codes/${id}`, method: "DELETE" }),
			invalidatesTags: (_r, _e, { id, eventId }) => [
				{ type: "promo-code" as const, id },
				{ type: "promo-codes" as const, id: eventId },
			],
		}),
	}),
});

export const {
	useValidatePromoCodeMutation,
	useListPromoCodesQuery,
	useCreatePromoCodeMutation,
	useUpdatePromoCodeMutation,
	useDeletePromoCodeMutation,
} = promoCodeApi;
