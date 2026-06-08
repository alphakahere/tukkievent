"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

export function LegalPageShell({
	title,
	subtitle,
	children,
}: {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
}) {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-[#F7F7F7]">
			<header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-40">
				<div className="max-w-3xl mx-auto flex items-center gap-3">
					<button
						type="button"
						onClick={() => router.back()}
						className="p-2 rounded-full hover:bg-gray-100 transition-colors"
						aria-label="Retour"
					>
						<ArrowLeft size={20} className="text-gray-700" />
					</button>
					<h1 className="text-xl font-bold text-gray-900">{title}</h1>
				</div>
			</header>

			<main className="max-w-3xl mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
				>
					{subtitle && (
						<p className="text-sm text-gray-500 mb-6">{subtitle}</p>
					)}
					<div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">
						{children}
					</div>
				</motion.div>
			</main>
		</div>
	);
}

export function LegalSection({
	heading,
	children,
}: {
	heading: string;
	children: React.ReactNode;
}) {
	return (
		<section className="space-y-2">
			<h2 className="text-base font-bold text-gray-900">{heading}</h2>
			<div className="text-sm text-gray-600 leading-relaxed space-y-2">
				{children}
			</div>
		</section>
	);
}
