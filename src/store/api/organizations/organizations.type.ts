import type { PaginationParams } from "../types";

export interface Organization {
	id: string;
	name: string;
	slug: string;
	ownerId: string;
	description: string | null;
	primaryEventType: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ListOrganizationsParams extends PaginationParams {
	q?: string;
}

export interface CreateOrganizationPayload {
	name: string;
	slug?: string;
	description?: string;
	primaryEventType?: string;
}

export type UpdateOrganizationPayload = Partial<Omit<CreateOrganizationPayload, "slug">>;

export type OrganizationRole =
	| "OWNER"
	| "ADMIN"
	| "EDITOR"
	| "VIEWER"
	| "STAFF";

export interface OrganizationMember {
	id: string;
	organizationId: string;
	userId: string;
	role: OrganizationRole;
	isOwner: boolean;
	createdAt: string;
	user: {
		id: string;
		email: string;
		firstname: string;
		lastname: string;
		avatarUrl: string | null;
	};
}
