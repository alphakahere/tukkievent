import type { PaginationParams } from "../types";

export interface EventCategory {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	icon: string | null;
	color: string | null;
	isActive: boolean;
	createdAt: string;
}

export interface ListEventCategoriesParams extends PaginationParams {
	isActive?: boolean;
	q?: string;
}

export interface CreateEventCategoryPayload {
	name: string;
	slug?: string;
	description?: string;
	icon?: string;
	color?: string;
	isActive?: boolean;
}

export type UpdateEventCategoryPayload = Partial<CreateEventCategoryPayload>;
