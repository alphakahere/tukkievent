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
}
