export type UserRole = "ADMIN" | "ORGANIZER" | "ATTENDEE";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface AuthUser {
	id: string;
	email: string;
	phone: string | null;
	username: string | null;
	firstname: string;
	lastname: string;
	roles: UserRole[];
	status: UserStatus;
	emailVerified: boolean;
	phoneVerified: boolean;
	avatarUrl: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface AuthResponse {
	user: AuthUser;
	accessToken: string;
}

export interface RegisterPayload {
	email: string;
	password: string;
	firstname?: string;
	lastname?: string;
	phone?: string;
	username?: string;
}

export interface LoginPayload {
	email?: string;
	phone?: string;
	password: string;
}

export interface ForgotPasswordPayload {
	email: string;
}

export interface ResetPasswordPayload {
	token: string;
	password: string;
}

export interface VerifyEmailPayload {
	email: string;
	code: string;
}

export interface ResendVerificationPayload {
	email: string;
}

export interface OkResponse {
	ok: true;
}
