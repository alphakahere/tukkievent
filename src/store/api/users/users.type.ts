import type { PaginationParams } from "../types";
import type { AuthUser, UserRole, UserStatus } from "../auth/auth.type";

export type User = AuthUser;
export type { UserRole, UserStatus };

export interface ListUsersParams extends PaginationParams {
	status?: UserStatus;
	role?: UserRole;
	q?: string;
}

export interface UpdateUserPayload {
	firstname?: string;
	lastname?: string;
	phone?: string;
	username?: string;
	avatarUrl?: string;
}

export interface AdminUpdateUserPayload extends UpdateUserPayload {
	status?: UserStatus;
	roles?: UserRole[];
}
