import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Base cart selector
export const selectCart = (state: RootState) => state.cart;

// Cart items selectors
export const selectCartItems = createSelector(
  [selectCart],
  (cart) => cart.items
);

export const selectCartItemsCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, event) => {
    return total + event.tickets.reduce((eventTotal, ticket) => {
      return eventTotal + ticket.quantity;
    }, 0);
  }, 0)
);

export const selectCartIsEmpty = createSelector(
  [selectCartItems],
  (items) => items.length === 0
);

// Totals selectors
export const selectCartSubtotal = createSelector(
  [selectCart],
  (cart) => cart.subtotal
);


export const selectCartTotal = createSelector(
  [selectCart],
  (cart) => cart.totalAmount
);

// Buyer info selectors
export const selectBuyerInfo = createSelector(
  [selectCart],
  (cart) => cart.buyerInfo
);

// Checkout flow selectors
export const selectCurrentStep = createSelector(
  [selectCart],
  (cart) => cart.currentStep
);

export const selectPaymentMethod = createSelector(
  [selectCart],
  (cart) => cart.paymentMethod
);

export const selectOrderId = createSelector(
  [selectCart],
  (cart) => cart.orderId
);

// Event-specific selectors
export const selectCartItemByEventId = createSelector(
  [selectCartItems, (_, eventId: string) => eventId],
  (items, eventId) => items.find(item => item.eventId === eventId)
);

export const selectTicketQuantityByEventAndType = createSelector(
  [selectCartItems, (_, eventId: string, ticketTypeId: string) => ({ eventId, ticketTypeId })],
  (items, { eventId, ticketTypeId }) => {
    const eventItem = items.find(item => item.eventId === eventId);
    if (!eventItem) return 0;
    
    const ticket = eventItem.tickets.find(ticket => ticket.ticketTypeId === ticketTypeId);
    return ticket ? ticket.quantity : 0;
  }
);

// Validation selectors
export const selectCanProceedToCheckout = createSelector(
  [selectCartItems],
  (items) => items.length > 0 && items.some(event => event.tickets.length > 0)
);

export const selectCanProceedToPayment = createSelector(
  [selectCanProceedToCheckout, selectBuyerInfo],
  (canCheckout, buyerInfo) => {
    return canCheckout && 
           buyerInfo.buyerEmail && 
           buyerInfo.buyerFirstName && 
           buyerInfo.buyerLastName;
  }
);
