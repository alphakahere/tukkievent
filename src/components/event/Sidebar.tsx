"use client";
import React, { useState } from "react";
import { Check, Copy, Music2 } from "lucide-react";
import { Event } from "@/store/api/event/event.type";
import { Button } from "../ui/button";
import SupportEventDialog from "./SupportEventDialog";

type SidebarProps = {
	event: Event;
};

const Sidebar: React.FC<SidebarProps> = ({ event }) => {
	const [copied, setCopied] = useState(false);
	const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy link:", error);
		}
	};

	return (
		<>
			{/* Desktop Sidebar */}
			<div className="hidden lg:block bg-white rounded-xl p-4 sm:p-6 mb-6 lg:sticky lg:top-24">
				<div className="space-y-6">
					{/* Organizer Section */}
					{event.organization && (
						<div className="pb-6 border-b border-gray-200">
							<h3 className="text-lg font-bold text-gray-900 mb-4">
								Organisateur
							</h3>
							<div className="flex items-start space-x-3">
								<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
									<Music2 className="w-5 h-5 text-orange-500" />
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="font-semibold text-gray-900 text-sm mb-1">
										{
											event
												.organization
												.name
										}
									</h4>
									{event.organization
										.description && (
										<p className="text-gray-600 text-xs line-clamp-2">
											{
												event
													.organization
													.description
											}
										</p>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="space-y-3">
						<Button
							onClick={() =>
								setIsSupportDialogOpen(true)
							}
							className="w-full py-3 sm:py-5 text-sm sm:text-base"
						>
							Cliquez pour acheter
						</Button>

						<button
							onClick={handleCopyLink}
							className="w-full border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
						>
							{copied ? (
								<>
									<Check className="w-4 h-4 mr-2" />{" "}
									Lien copié !
								</>
							) : (
								<>
									<Copy className="w-4 h-4 mr-2" />{" "}
									Copier le lien
								</>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Fixed Bottom Button */}
			<div className="lg:hidden">
				<div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4 shadow-lg">
					<Button
						className="w-full py-3 text-base font-semibold"
						onClick={() => setIsSupportDialogOpen(true)}
					>
						Cliquez pour acheter
					</Button>
				</div>
			</div>

			{/* Support Event Dialog */}
			<SupportEventDialog
				event={event}
				open={isSupportDialogOpen}
				onOpenChange={setIsSupportDialogOpen}
			/>
		</>
	);
};

export default Sidebar;
