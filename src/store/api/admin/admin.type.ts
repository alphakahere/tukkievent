export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED";
export type EventAdminStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
export type OrderAdminStatus = "PENDING" | "COMPLETED" | "REFUNDED" | "CANCELLED";
export type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";
export type ReportReason = "SPAM" | "INAPPROPRIATE" | "FRAUD" | "OTHER";

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: UserStatus;
  isOrganizer: boolean;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
}

export interface AdminOrganizer {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  logoUrl?: string;
  status: UserStatus;
  eventsCount: number;
  totalRevenue: number;
  createdAt: string;
  verified: boolean;
}

export interface AdminEvent {
  id: string;
  slug: string;
  title: string;
  coverImageUrl: string;
  startDatetime: string;
  city: string;
  organizerName: string;
  category: string;
  status: EventAdminStatus;
  ticketsSold: number;
  revenue: number;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  eventTitle: string;
  buyerName: string;
  buyerEmail: string;
  total: number;
  status: OrderAdminStatus;
  paymentMethod: string;
  createdAt: string;
  ticketsCount: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  eventsCount: number;
  createdAt: string;
}

export interface AdminReport {
  id: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  reporterName: string;
  targetType: "EVENT" | "USER" | "ORGANIZER";
  targetId: string;
  targetName: string;
  createdAt: string;
}

export interface AdminKpis {
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  totalOrders: number;
  totalRevenue: number;
  pendingEvents: number;
  openReports: number;
  newUsersThisMonth: number;
}

export interface AdminActivity {
  id: string;
  type: "USER_REGISTERED" | "EVENT_CREATED" | "ORDER_PLACED" | "REPORT_SUBMITTED" | "EVENT_APPROVED";
  description: string;
  createdAt: string;
}

export interface AdminPlatformSettings {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  commissionRate: number;
  maintenanceMode: boolean;
  allowNewOrganizers: boolean;
  requireEventApproval: boolean;
}
