import { RoleGuard } from "@/components/auth/RoleGuard";

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
	return <RoleGuard allow={["ATTENDEE"]}>{children}</RoleGuard>;
}
