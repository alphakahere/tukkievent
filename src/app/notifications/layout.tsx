import { RoleGuard } from "@/components/auth/RoleGuard";

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
	return <RoleGuard allow={["ATTENDEE"]}>{children}</RoleGuard>;
}
