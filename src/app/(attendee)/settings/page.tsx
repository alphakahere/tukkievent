"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Sun, Moon, DollarSign, Bell, BellOff, Mail, MessageSquare } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import BottomNav from "@/components/BottomNav";
import AccountSidebar from "@/components/AccountSidebar";

function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (val: boolean) => void; id: string }) {
  return (
    <button
      type="button" id={id} role="switch" aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${checked ? "bg-primary" : "bg-gray-300"}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{children}</p>;
}

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateTheme, updateCurrency, updateNotificationPref } = useSettings();

  return (
		<div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
			<header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-40 md:hidden">
				<div className="max-w-lg mx-auto flex items-center gap-3">
					<button
						type="button"
						onClick={() => router.back()}
						className="p-2 rounded-full hover:bg-gray-100 transition-colors"
					>
						<ArrowLeft
							size={20}
							className="text-gray-700"
						/>
					</button>
					<h1 className="text-xl font-bold text-gray-900">
						Paramètres
					</h1>
				</div>
			</header>

			<div className="max-w-lg md: px-4 py-6">
				<div className="md:flex md:gap-8">
					<AccountSidebar />
					<div className="flex-1 space-y-6">
						<h1 className="hidden md:block text-2xl font-bold text-gray-900">
							Paramètres
						</h1>

						{/* Apparence */}
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<SectionLabel>Apparence</SectionLabel>
							<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
								<div className="p-4 flex items-center justify-between border-b border-gray-100">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
											{settings.theme ===
											"light" ? (
												<Sun
													size={
														18
													}
													className="text-amber-500"
												/>
											) : (
												<Moon
													size={
														18
													}
													className="text-indigo-500"
												/>
											)}
										</div>
										<div>
											<p className="text-sm font-semibold text-gray-900">
												Thème
											</p>
											<p className="text-xs text-gray-500">
												{settings.theme ===
												"light"
													? "Mode clair"
													: "Mode sombre"}
											</p>
										</div>
									</div>
									<div className="flex gap-2">
										{[
											"light",
											"dark",
										].map((t) => (
											<button
												key={t}
												type="button"
												onClick={() =>
													updateTheme(
														t as
															| "light"
															| "dark",
													)
												}
												className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
													settings.theme ===
													t
														? "bg-primary text-white"
														: "bg-gray-100 text-gray-500 hover:bg-gray-200"
												}`}
											>
												{t ===
												"light"
													? "Clair"
													: "Sombre"}
											</button>
										))}
									</div>
								</div>
								<div className="p-4 flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
											<DollarSign
												size={
													18
												}
												className="text-emerald-600"
											/>
										</div>
										<div>
											<p className="text-sm font-semibold text-gray-900">
												Devise
											</p>
											<p className="text-xs text-gray-500">
												Affichage
												des prix
											</p>
										</div>
									</div>
									<div className="flex gap-2">
										{["XOF", "EUR"].map(
											(c) => (
												<button
													key={
														c
													}
													type="button"
													onClick={() =>
														updateCurrency(
															c as
																| "XOF"
																| "EUR",
														)
													}
													className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
														settings.currency ===
														c
															? "bg-primary text-white"
															: "bg-gray-100 text-gray-500 hover:bg-gray-200"
													}`}
												>
													{
														c
													}
												</button>
											),
										)}
									</div>
								</div>
							</div>
						</motion.div>

						{/* Notifications */}
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							<SectionLabel>
								Notifications
							</SectionLabel>
							<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
								{[
									{
										key: "push" as const,
										label: "Notifications push",
										description:
											"Rappels et confirmations",
										Icon: Bell,
										color: "#F59E0B",
										bg: "#FFFBEB",
									},
									{
										key: "email" as const,
										label: "Notifications email",
										description:
											"Reçus et confirmations",
										Icon: Mail,
										color: "#3B82F6",
										bg: "#EFF6FF",
									},
									{
										key: "sms" as const,
										label: "Notifications SMS",
										description:
											"Alertes importantes uniquement",
										Icon: MessageSquare,
										color: "#10B981",
										bg: "#ECFDF5",
									},
								].map(
									({
										key,
										label,
										description,
										Icon,
										color,
										bg,
									}) => (
										<div
											key={key}
											className="p-4 flex items-center justify-between"
										>
											<div className="flex items-center gap-3">
												<div
													className="w-10 h-10 rounded-xl flex items-center justify-center"
													style={{
														backgroundColor:
															bg,
													}}
												>
													{settings
														.notifications[
														key
													] ? (
														<Icon
															size={
																18
															}
															style={{
																color,
															}}
														/>
													) : (
														<BellOff
															size={
																18
															}
															className="text-gray-400"
														/>
													)}
												</div>
												<div>
													<p className="text-sm font-semibold text-gray-900">
														{
															label
														}
													</p>
													<p className="text-xs text-gray-500">
														{
															description
														}
													</p>
												</div>
											</div>
											<Toggle
												id={`notif-${key}`}
												checked={
													settings
														.notifications[
														key
													]
												}
												onChange={(
													val,
												) =>
													updateNotificationPref(
														key,
														val,
													)
												}
											/>
										</div>
									),
								)}
							</div>
						</motion.div>

						{/* À propos */}
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<SectionLabel>À propos</SectionLabel>
							<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
								{[
									{
										label: "Version",
										value: "1.0.0",
									},
									{
										label: "Langue",
										value: "Français",
									},
								].map(({ label, value }) => (
									<div
										key={label}
										className="px-4 py-3.5 flex items-center justify-between"
									>
										<span className="text-sm text-gray-500">
											{label}
										</span>
										<span className="text-sm font-semibold text-gray-900">
											{value}
										</span>
									</div>
								))}
							</div>
						</motion.div>

						{/* Danger zone */}
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.25 }}
						>
							<SectionLabel>
								Zone dangereuse
							</SectionLabel>
							<div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
								<button
									type="button"
									className="w-full px-4 py-4 text-left text-sm font-semibold text-destructive hover:bg-red-50 transition-colors"
								>
									Supprimer mon compte
								</button>
							</div>
							<p className="text-xs text-gray-400 mt-2">
								Cette action est irréversible.
								Toutes vos données seront
								effacées.
							</p>
						</motion.div>
					</div>
				</div>
			</div>

			<BottomNav />
		</div>
  );
}
