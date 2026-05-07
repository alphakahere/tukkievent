"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/features/hooks";
import {
	selectAuthUser,
	selectIsAuthenticated,
} from "@/store/selectors/auth.selectors";
import { getDefaultRouteForRoles } from "@/lib/auth-redirect";
import type { UserRole } from "@/store/api/auth/auth.type";

interface RoleGuardProps {
	allow?: UserRole[];
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function RoleGuard({ allow, children, fallback = null }: RoleGuardProps) {
	const router = useRouter();
	const pathname = usePathname();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const user = useAppSelector(selectAuthUser);

	const isAllowed = useMemo(() => {
		if (!user) return false;
		if (!allow) return true;
		return user.roles.some((role) => allow.includes(role));
	}, [user, allow]);

	useEffect(() => {
		if (!isAuthenticated || !user) {
			const target = `/auth/login?redirect=${encodeURIComponent(pathname)}`;
			router.replace(target);
			return;
		}
		if (!isAllowed) {
			router.replace(getDefaultRouteForRoles(user.roles));
		}
	}, [isAuthenticated, user, isAllowed, pathname, router]);

	if (!isAuthenticated || !user || !isAllowed) return <>{fallback}</>;
	return <>{children}</>;
}
