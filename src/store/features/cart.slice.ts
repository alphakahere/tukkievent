import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartTicket {
	ticketTypeId: string;
	ticketTypeName: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
}

export interface CartItem {
	eventId: string;
	eventTitle: string;
	eventDate: string;
	tickets: CartTicket[];
}

export interface BuyerInfo {
	buyerEmail?: string;
	buyerPhone?: string;
	buyerFirstName?: string;
	buyerLastName?: string;
}

export interface CartState {
	items: CartItem[];
	buyerInfo: BuyerInfo;
	subtotal: number;
	fees: number;
	totalAmount: number;
	currency: string;
	paymentMethod?: string;
	currentStep: "cart" | "summary" | "info" | "payment" | "processing" | "success" | "failed";
	orderId?: string;
	expiresAt?: string;
}

export interface AddToCartPayload {
	eventId: string;
	eventTitle: string;
	eventDate: string;
	ticketTypeId: string;
	ticketTypeName: string;
	quantity: number;
	unitPrice: number;
}

export interface UpdateQuantityPayload {
	eventId: string;
	ticketTypeId: string;
	quantity: number;
}

export interface RemoveFromCartPayload {
	eventId: string;
	ticketTypeId?: string; // If not provided, remove entire event
}

const initialState: CartState = {
	items: [],
	buyerInfo: {},
	subtotal: 0,
	fees: 0,
	totalAmount: 0,
	currency: "XOF",
	currentStep: "cart",
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
			const {
				eventId,
				eventTitle,
				eventDate,
				ticketTypeId,
				ticketTypeName,
				quantity,
				unitPrice,
			} = action.payload;

			// Find existing event in cart
			let existingEvent = state.items.find((item) => item.eventId === eventId);

			if (!existingEvent) {
				// Create new event entry
				existingEvent = {
					eventId,
					eventTitle,
					eventDate,
					tickets: [],
				};
				state.items.push(existingEvent);
			}

			// Find existing ticket type
			const existingTicket = existingEvent.tickets.find(
				(ticket) => ticket.ticketTypeId === ticketTypeId
			);

			if (existingTicket) {
				// Update existing ticket quantity
				existingTicket.quantity += quantity;
				existingTicket.totalPrice =
					existingTicket.quantity * existingTicket.unitPrice;
			} else {
				// Add new ticket type
				existingEvent.tickets.push({
					ticketTypeId,
					ticketTypeName,
					quantity,
					unitPrice,
					totalPrice: quantity * unitPrice,
				});
			}

			// Recalculate totals
			cartSlice.caseReducers.calculateTotals(state);
		},

		updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
			const { eventId, ticketTypeId, quantity } = action.payload;

			const eventItem = state.items.find((item) => item.eventId === eventId);
			if (!eventItem) return;

			const ticket = eventItem.tickets.find(
				(ticket) => ticket.ticketTypeId === ticketTypeId
			);
			if (!ticket) return;

			if (quantity <= 0) {
				// Remove ticket if quantity is 0 or less
				eventItem.tickets = eventItem.tickets.filter(
					(ticket) => ticket.ticketTypeId !== ticketTypeId
				);

				// Remove event if no tickets left
				if (eventItem.tickets.length === 0) {
					state.items = state.items.filter((item) => item.eventId !== eventId);
				}
			} else {
				// Update quantity
				ticket.quantity = quantity;
				ticket.totalPrice = quantity * ticket.unitPrice;
			}

			// Recalculate totals
			cartSlice.caseReducers.calculateTotals(state);
		},

		removeFromCart: (state, action: PayloadAction<RemoveFromCartPayload>) => {
			const { eventId, ticketTypeId } = action.payload;

			if (!ticketTypeId) {
				// Remove entire event
				state.items = state.items.filter((item) => item.eventId !== eventId);
			} else {
				// Remove specific ticket type
				const eventItem = state.items.find((item) => item.eventId === eventId);
				if (eventItem) {
					eventItem.tickets = eventItem.tickets.filter(
						(ticket) => ticket.ticketTypeId !== ticketTypeId
					);

					// Remove event if no tickets left
					if (eventItem.tickets.length === 0) {
						state.items = state.items.filter(
							(item) => item.eventId !== eventId
						);
					}
				}
			}

			// Recalculate totals
			cartSlice.caseReducers.calculateTotals(state);
		},

		clearCart: (state) => {
			state.items = [];
			state.subtotal = 0;
			state.fees = 0;
			state.totalAmount = 0;
			state.orderId = undefined;
			state.expiresAt = undefined;
			state.currentStep = "cart";
		},

		updateBuyerInfo: (state, action: PayloadAction<Partial<BuyerInfo>>) => {
			state.buyerInfo = { ...state.buyerInfo, ...action.payload };
		},

		setPaymentMethod: (state, action: PayloadAction<string>) => {
			state.paymentMethod = action.payload;
		},

		setCurrentStep: (state, action: PayloadAction<CartState["currentStep"]>) => {
			state.currentStep = action.payload;
		},

		setOrderId: (state, action: PayloadAction<string>) => {
			state.orderId = action.payload;
		},

		setExpiresAt: (state, action: PayloadAction<string>) => {
			state.expiresAt = action.payload;
		},

		calculateTotals: (state) => {
			// Calculate subtotal from all items
			state.subtotal = state.items.reduce((total, event) => {
				return (
					total +
					event.tickets.reduce((eventTotal, ticket) => {
						return eventTotal + ticket.totalPrice;
					}, 0)
				);
			}, 0);

			// Calculate fees (example: 5% service fee)
			state.fees = state.subtotal * 0.05;

			// Calculate total amount
			state.totalAmount = state.subtotal + state.fees;
		},

		// Helper action to set multiple tickets at once (for sidebar integration)
		setTicketsForEvent: (
			state,
			action: PayloadAction<{
				eventId: string;
				eventTitle: string;
				eventDate: string;
				tickets: Array<{
					ticketTypeId: string;
					ticketTypeName: string;
					quantity: number;
					unitPrice: number;
				}>;
			}>
		) => {
			const { eventId, eventTitle, eventDate, tickets } = action.payload;

			// Remove existing event
			state.items = state.items.filter((item) => item.eventId !== eventId);

			// Add new event with tickets if any tickets have quantity > 0
			const validTickets = tickets.filter((ticket) => ticket.quantity > 0);

			if (validTickets.length > 0) {
				const cartItem: CartItem = {
					eventId,
					eventTitle,
					eventDate,
					tickets: validTickets.map((ticket) => ({
						...ticket,
						totalPrice: ticket.quantity * ticket.unitPrice,
					})),
				};

				state.items.push(cartItem);
			}

			// Recalculate totals
			cartSlice.caseReducers.calculateTotals(state);
		},
	},
});

export const {
	addToCart,
	updateQuantity,
	removeFromCart,
	clearCart,
	updateBuyerInfo,
	setPaymentMethod,
	setCurrentStep,
	setOrderId,
	setExpiresAt,
	calculateTotals,
	setTicketsForEvent,
} = cartSlice.actions;

export default cartSlice.reducer;
