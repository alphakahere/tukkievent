"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Briefcase } from "lucide-react";
import { useAppSelector } from "@/store/features/hooks";
import {
	selectAuthUser,
	selectIsAuthenticated,
} from "@/store/selectors/auth.selectors";
import { useListMyOrganizationsQuery } from "@/store/api/organizations/organizations.api";
import { useLazyGetMeQuery } from "@/store/api/users/users.api";
import { AccountStep } from "./_components/AccountStep";
import { VerifyStep } from "./_components/VerifyStep";
import { OrganizationStep } from "./_components/OrganizationStep";

type StepKey = "account" | "verify" | "org";

export default function BecomeOrganizerPage() {
	const router = useRouter();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const user = useAppSelector(selectAuthUser);

	// Email used for the OTP step. Pre-filled from the auth user when available;
	// captured from the AccountStep submission for fresh signups (avoids relying
	// on the slice in the same render the register mutation completes).
	const [pendingEmail, setPendingEmail] = useState<string>("");

	const { data: myOrgs, isLoading: orgsLoading } =
		useListMyOrganizationsQuery(undefined, {
			skip: !isAuthenticated || !user?.emailVerified,
		});
	const [refetchMe] = useLazyGetMeQuery();

	const step: StepKey =
		!isAuthenticated || !user
			? "account"
			: !user.emailVerified
				? "verify"
				: "org";

	// Bounce existing organizers straight to the new-event page.
	const isAlreadyOrganizer =
		Boolean(user?.roles.includes("ORGANIZER")) ||
		(myOrgs && myOrgs.length > 0);

	useEffect(() => {
		if (step === "org" && !orgsLoading && isAlreadyOrganizer) {
			router.replace("/organizer/events/new");
		}
	}, [step, orgsLoading, isAlreadyOrganizer, router]);

	const verifyEmail = pendingEmail || user?.email || "";

	if (step === "org" && (orgsLoading || isAlreadyOrganizer)) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
				<p className="text-sm text-gray-500">Chargement…</p>
			</div>
		);
	}

	return (
		<div className="bg-[#F7F7F7] py-12 px-4">
			<div className="max-w-2xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8"
				>
					<div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white mb-4">
						<Briefcase size={26} />
					</div>
					<h1 className="text-3xl font-bold text-gray-900">
						Devenez organisateur
					</h1>
					<p className="text-sm text-gray-500 mt-2">
						Créez votre organisation gratuitement et
						publiez votre premier événement.
					</p>
				</motion.div>

				{step === "account" && (
					<AccountStep
						onSuccess={(_user, email) => {
							setPendingEmail(email);
							// step transitions automatically once the auth slice updates.
						}}
					/>
				)}

				{step === "verify" && (
					<VerifyStep
						email={verifyEmail}
						onSuccess={() => {
							// verifyEmail's invalidation targets authApi's "me" tag; the auth
							// slice is fed by usersApi.getMe, so we refetch here to flip
							// emailVerified and let the orchestrator advance to step 3.
							refetchMe()
								.unwrap()
								.catch(() => undefined);
						}}
					/>
				)}

				{step === "org" && <OrganizationStep />}
			</div>
		</div>
	);
}
