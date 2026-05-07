import { RoleGuard } from "@/components/auth/RoleGuard";

export default function BecomeOrganizerLayout({ children }: { children: React.ReactNode }) {
	return <RoleGuard>{children}</RoleGuard>;
}
