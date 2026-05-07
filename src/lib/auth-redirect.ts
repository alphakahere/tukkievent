import type { UserRole } from "@/store/api/auth/auth.type";

export function getDefaultRouteForRoles(roles: UserRole[]): string {
	if (roles.includes("ADMIN")) return "/admin/dashboard";
	if (roles.includes("ORGANIZER")) return "/organizer/dashboard";
	return "/profile";
}

export function isRouteAllowedForRoles(path: string, roles: UserRole[]): boolean {
	if (path.startsWith("/admin")) return roles.includes("ADMIN");
	if (path.startsWith("/organizer")) {
		return roles.includes("ORGANIZER") || roles.includes("ADMIN");
	}
	return true;
}

export function resolveAuthRedirect(
	redirect: string | null | undefined,
	roles: UserRole[],
): string {
	if (redirect && redirect.startsWith("/") && isRouteAllowedForRoles(redirect, roles)) {
		return redirect;
	}
	return getDefaultRouteForRoles(roles);
}
