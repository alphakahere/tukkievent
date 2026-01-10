import React from "react";

interface PageLoadingProps {
	title?: string;
	description?: string;
	showSkeleton?: boolean;
}

export function PageLoading({
	title = "Chargement...",
	description = "Veuillez patienter",
	showSkeleton = true,
}: PageLoadingProps) {
	return (
		<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
				{/* Loading Animation */}
				<div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-100 flex items-center justify-center mb-6">
					<div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
				</div>

				<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
					{title}
				</h1>
				<p className="text-gray-600 text-sm sm:text-base">{description}</p>

				{/* Skeleton Loading for content */}
				{showSkeleton && (
					<div className="mt-8 text-left bg-gray-50 rounded-lg p-4 sm:p-6 space-y-4">
						<div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
						<div className="space-y-2">
							<div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
							<div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
						</div>
						<div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mt-6"></div>
						<div className="space-y-2">
							<div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
							<div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
							<div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
