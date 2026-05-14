// src/store/store.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "./api/auth/auth.api";
import { cityApi } from "./api/city/city.api";
import { eventApi } from "./api/event/event.api";
import { eventCategoriesApi } from "./api/event-categories/event-categories.api";
import { orderApi } from "./api/order/order.api";
import { organizationsApi } from "./api/organizations/organizations.api";
import { promoCodeApi } from "./api/promo-code/promo-code.api";
import { ticketApi } from "./api/tickets/tickets.api";
import { ticketTypeApi } from "./api/ticket-types/ticket-types.api";
import { uploadsApi } from "./api/uploads/uploads.api";
import { usersApi } from "./api/users/users.api";
import authReducer from "./features/auth.slice";
import cartReducer from "./features/cart.slice";

// Redux Persist configuration
const persistConfig = {
	key: "root",
	storage,
	whitelist: ["cart", "auth"],
};

// Combine reducers
const rootReducer = combineReducers({
	[authApi.reducerPath]: authApi.reducer,
	[eventApi.reducerPath]: eventApi.reducer,
	[organizationsApi.reducerPath]: organizationsApi.reducer,
	[eventCategoriesApi.reducerPath]: eventCategoriesApi.reducer,
	[usersApi.reducerPath]: usersApi.reducer,
	[orderApi.reducerPath]: orderApi.reducer,
	[cityApi.reducerPath]: cityApi.reducer,
	[promoCodeApi.reducerPath]: promoCodeApi.reducer,
	[ticketApi.reducerPath]: ticketApi.reducer,
	[ticketTypeApi.reducerPath]: ticketTypeApi.reducer,
	[uploadsApi.reducerPath]: uploadsApi.reducer,
	auth: authReducer,
	cart: cartReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
			},
		}).concat(
			authApi.middleware,
			eventApi.middleware,
			organizationsApi.middleware,
			eventCategoriesApi.middleware,
			usersApi.middleware,
			orderApi.middleware,
			cityApi.middleware,
			promoCodeApi.middleware,
			ticketApi.middleware,
			ticketTypeApi.middleware,
			uploadsApi.middleware,
		),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
