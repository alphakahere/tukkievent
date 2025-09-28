// src/store/store.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { eventApi } from "./api/event/event.api";
import { orderApi } from "./api/order/order.api";
import cartReducer from "./features/cart.slice";

// Redux Persist configuration
const persistConfig = {
	key: "root",
	storage,
	whitelist: ["cart"], // Only persist cart state
};

// Combine reducers
const rootReducer = combineReducers({
	[eventApi.reducerPath]: eventApi.reducer,
	[orderApi.reducerPath]: orderApi.reducer,
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
		}).concat(eventApi.middleware, orderApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;