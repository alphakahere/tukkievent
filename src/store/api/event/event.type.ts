export interface Organization {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	logoUrl?: string | null;
	websiteUrl?: string | null;
}

export interface Category {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	icon?: string | null;
	color?: string | null;
}

export enum TicketStatus {
	PENDING = "PENDING",
	VALID = "VALID",
	USED = "USED",
	REFUNDED = "REFUNDED",
	CANCELLED = "CANCELLED",
}

export interface Ticket {
	id: string;
	orderId: string;
	ticketTypeId: string;
	ticketNumber: string;
	qrCode: string;
	barcode?: string;
	holderFirstName?: string;
	holderLastName?: string;
	holderEmail?: string;
	holderPhone?: string;
	status: TicketStatus;
	usedAt?: string;
	usedBy?: string;
	originalHolderName?: string;
	transferredAt?: string;
	transferReason?: string;
	createdAt: string;
	updatedAt: string;
}

export type Currency = "XOF" | "EUR" | "USD";

export interface TicketType {
	id: string;
	eventId: string;
	name: string;
	description?: string | null;
	currency?: Currency;
	price: number;
	priceEuro?: number | null;
	priceUsd?: number | null;
	totalQuantity?: number;
	availableQuantity?: number;
	soldQuantity?: number;
	minPurchase: number;
	maxPurchase: number;
	saleStartDatetime?: string | null;
	saleEndDatetime?: string | null;
	isVisible: boolean;
	requiresApproval?: boolean;
	sortOrder: number;
	event?: Event;
	tickets?: Ticket[];
	createdAt?: string;
	updatedAt?: string;
}

export interface Event {
	id: string;
	slug: string;
	title: string;
	description: string;
	shortDescription?: string | null;
	startDatetime: string;
	endDatetime: string | null;
	status: string;
	thumbnailUrl: string;
	coverImageUrl: string;
	isFeatured: boolean;
	isOnline: boolean;
	isPublished?: boolean;
	latitude?: string | number | null;
	longitude?: string | number | null;
	city: string | null;
	address: string | null;
	capacity: number;
	categoryId: string | null;
	organizationId: string;
	metaDescription?: string | null;
	metaTitle?: string | null;
	minAge: number;
	onlineLink: string | null;
	createdAt: string;
	updatedAt: string;
	organization?: Organization;
	category?: Category | null;
	ticketTypes?: TicketType[];
	tickets?: Ticket[];
}
