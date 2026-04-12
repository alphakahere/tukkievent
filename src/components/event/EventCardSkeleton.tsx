import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = { className?: string };

const EventCardSkeleton: React.FC<Props> = ({ className }) => {
	return (
		<div className={`bg-white rounded-2xl overflow-hidden border border-gray-100 ${className ?? ""}`}>
			<div className="relative">
				<Skeleton className="h-48 w-full" />
				<div className="absolute top-4 left-4">
					<Skeleton className="h-6 w-20 rounded-full" />
				</div>
			</div>
			<div className="p-4">
				<div className="flex items-center mb-2">
					<Skeleton className="h-4 w-4 rounded mr-2" />
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-1 w-1 rounded-full mx-2" />
					<Skeleton className="h-4 w-4 rounded mr-2" />
					<Skeleton className="h-4 w-12" />
				</div>
				<Skeleton className="h-5 w-full mb-2" />
				<Skeleton className="h-5 w-3/4 mb-3" />
				<Skeleton className="h-4 w-full mb-1" />
				<Skeleton className="h-4 w-2/3 mb-3" />
				<div className="flex items-center justify-between">
					<Skeleton className="h-5 w-20" />
				</div>
			</div>
		</div>
	);
};

export default EventCardSkeleton;
