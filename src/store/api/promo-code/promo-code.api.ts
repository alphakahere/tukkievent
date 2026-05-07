import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

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
	endpoints: (builder) => ({
		validatePromoCode: builder.mutation<PromoCodeValidation, ValidatePromoCodeInput>({
			query: (body) => ({
				url: "/visitor/promo-codes/validate",
				method: "POST",
				body,
			}),
		}),
	}),
});

export const { useValidatePromoCodeMutation } = promoCodeApi;
