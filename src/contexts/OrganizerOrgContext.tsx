"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useListMyOrganizationsQuery } from "@/store/api/organizations/organizations.api";
import type { Organization } from "@/store/api/organizations/organizations.type";

const ACTIVE_ORG_KEY = "tukki-active-organization-id";

interface OrganizerOrgContextValue {
	activeOrgId: string | null;
	activeOrg: Organization | null;
	organizations: Organization[];
	isLoading: boolean;
	isError: boolean;
	hasNoOrg: boolean;
	setActiveOrgId: (id: string) => void;
}

const OrganizerOrgContext = createContext<OrganizerOrgContextValue | null>(null);

export function OrganizerOrgProvider({ children }: { children: React.ReactNode }) {
	const { data: organizations = [], isLoading, isError } = useListMyOrganizationsQuery();
	const [activeOrgId, setActiveOrgIdState] = useState<string | null>(null);

	useEffect(() => {
		if (organizations.length === 0) return;
		const stored = typeof window !== "undefined" ? localStorage.getItem(ACTIVE_ORG_KEY) : null;
		const fallback = organizations[0].id;
		const next = stored && organizations.some((o) => o.id === stored) ? stored : fallback;
		setActiveOrgIdState(next);
	}, [organizations]);

	const setActiveOrgId = (id: string) => {
		setActiveOrgIdState(id);
		try {
			localStorage.setItem(ACTIVE_ORG_KEY, id);
		} catch {
			/* ignore */
		}
	};

	const value = useMemo<OrganizerOrgContextValue>(() => {
		const activeOrg = organizations.find((o) => o.id === activeOrgId) ?? null;
		return {
			activeOrgId,
			activeOrg,
			organizations,
			isLoading,
			isError,
			hasNoOrg: !isLoading && organizations.length === 0,
			setActiveOrgId,
		};
	}, [organizations, activeOrgId, isLoading, isError]);

	return <OrganizerOrgContext.Provider value={value}>{children}</OrganizerOrgContext.Provider>;
}

export function useOrganizerOrg(): OrganizerOrgContextValue {
	const ctx = useContext(OrganizerOrgContext);
	if (!ctx) throw new Error("useOrganizerOrg must be used within OrganizerOrgProvider");
	return ctx;
}
