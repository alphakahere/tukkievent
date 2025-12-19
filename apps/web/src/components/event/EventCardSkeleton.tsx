import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const EventCardSkeleton: React.FC = () => {
	return (
		<div className="bg-white rounded-xl shadow-sm overflow-hidden h-full">
			<div className="relative">
				{/* Image skeleton */}
				<Skeleton className="h-48 w-full" />
				{/* Category badge skeleton */}
				<div className="absolute top-4 left-4">
					<Skeleton className="h-6 w-20 rounded-full" />
				</div>
			</div>
			<div className="p-6">
				{/* Date and time skeleton */}
				<div className="flex items-center mb-2">
					<Skeleton className="h-4 w-4 rounded mr-2" />
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-1 w-1 rounded-full mx-2" />
					<Skeleton className="h-4 w-4 rounded mr-2" />
					<Skeleton className="h-4 w-12" />
				</div>
				{/* Title skeleton */}
				<Skeleton className="h-6 w-full mb-2" />
				<Skeleton className="h-6 w-3/4 mb-2" />
				{/* Description skeleton */}
				<Skeleton className="h-4 w-full mb-1" />
				<Skeleton className="h-4 w-2/3 mb-2" />
				{/* Bottom section skeleton */}
				<div className="flex items-center justify-between">
					<Skeleton className="h-6 w-20" />
				</div>
			</div>
		</div>
	);
};

export default EventCardSkeleton;
