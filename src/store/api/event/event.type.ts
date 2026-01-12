export interface Organization {
	id: string;
	name: string;
	slug: string;
	description: string;
	logoUrl: string;
	websiteUrl: string;
}

export interface Category {
	id: string;
	name: string;
	slug: string;
}

export enum TicketStatus {
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
	barcode: string;
	holderFirstName: string;
	holderLastName: string;
	holderEmail: string;
	holderPhone: string;
	status: TicketStatus;
	usedAt: string;
	usedBy: string;
	originalHolderName: string;
	transferredAt: string;
	transferReason: string;
	createdAt: string;
	updatedAt: string;
}
export interface TicketType {
	id: string;
	eventId: string;
	name: string;
	description?: string;
	price: number;
	priceEuro?: number;
	totalQuantity?: number;
	availableQuantity?: number;
	minPurchase: number;
	maxPurchase: number;
	saleStartDatetime?: string;
	saleEndDatetime?: string;
	isVisible: boolean;
	requiresApproval: boolean;
	sortOrder: number;
	event: Event;
	tickets: Ticket[];
	createdAt: string;
	updatedAt: string;
}

export interface Event {
	id: string;
	slug: string;
	title: string;
	description: string;
	startDatetime: string;
	endDatetime: string;
	status: string;
	thumbnailUrl: string;
	coverImageUrl: string;
	isFeatured: boolean;
	isOnline: boolean;
	isPublished: boolean;
	latitude: string;
	longitude: string;
	city: string;
	address: string;
	capacity: number;
	categoryId: string;
	organizationId: string;
	shortDescription: string;
	metaDescription: string;
	metaTitle: string;
	minAge: number;
	onlineLink: string;
	createdAt: string;
	updatedAt: string;
	organization: Organization;
	category: Category;
	ticketTypes: TicketType[];
	tickets: Ticket[];
}
