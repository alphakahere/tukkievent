import type { PaginationParams } from "../types";

export type EventStatus =
	| "DRAFT"
	| "PUBLISHED"
	| "CANCELLED"
	| "COMPLETED"
	| "REJECTED"
	| "SUSPENDED";

export interface EventResource {
	id: string;
	organizationId: string;
	categoryId: string | null;
	title: string;
	slug: string;
	description: string | null;
	shortDescription: string | null;
	startDatetime: string;
	endDatetime: string | null;
	address: string | null;
	city: string | null;
	isOnline: boolean;
	onlineLink: string | null;
	coverImageUrl: string | null;
	thumbnailUrl: string | null;
	isFeatured: boolean;
	featuredUntil: string | null;
	capacity: number;
	minAge: number;
	status: EventStatus;
	createdAt: string;
	updatedAt: string;
}

export interface ListEventsParams extends PaginationParams {
	q?: string;
	status?: EventStatus;
	organizationId?: string;
	categoryId?: string;
	city?: string;
}

export interface CreateEventPayload {
	organizationId: string;
	title: string;
	startDatetime: string;
	capacity: number;
	categoryId?: string;
	slug?: string;
	description?: string;
	shortDescription?: string;
	endDatetime?: string;
	address?: string;
	city?: string;
	latitude?: number;
	longitude?: number;
	isOnline?: boolean;
	onlineLink?: string;
	coverImageUrl?: string;
	thumbnailUrl?: string;
	minAge?: number;
	status?: EventStatus;
	metaTitle?: string;
	metaDescription?: string;
}

export type UpdateEventPayload = Partial<Omit<CreateEventPayload, "organizationId" | "slug">>;
