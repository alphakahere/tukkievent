"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/features/hooks";
import { logout } from "@/store/features/auth.slice";
import { authApi } from "@/store/api/auth/auth.api";
import { eventApi } from "@/store/api/event/event.api";
import { organizationsApi } from "@/store/api/organizations/organizations.api";
import { eventCategoriesApi } from "@/store/api/event-categories/event-categories.api";
import { usersApi } from "@/store/api/users/users.api";
import { orderApi } from "@/store/api/order/order.api";

export function useLogout() {
	const dispatch = useAppDispatch();
	const router = useRouter();

	return () => {
		dispatch(logout());
		dispatch(authApi.util.resetApiState());
		dispatch(eventApi.util.resetApiState());
		dispatch(organizationsApi.util.resetApiState());
		dispatch(eventCategoriesApi.util.resetApiState());
		dispatch(usersApi.util.resetApiState());
		dispatch(orderApi.util.resetApiState());
		router.replace("/auth/login");
	};
}
