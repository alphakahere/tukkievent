import React from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Percent } from "lucide-react";
import { formatDate, formatTime, getDuration } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type TitleSummaryProps = {
	title: string;
	startDatetime: string;
	endDatetime: string;
	address: string;
	capacity: number;
	price?: number;
	currency?: string;
	discount?: number;
};

const TitleSummary: React.FC<TitleSummaryProps> = (props) => {
	const { title, startDatetime, endDatetime, address, capacity, price } = props;
	return (
		<div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
			{/* Title section - responsive */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
				<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-0 leading-tight">
					{title}
				</h1>
			</div>

			{/* Event details grid - responsive layout */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
				{/* Date */}
				<div className="flex items-start text-gray-700">
					<CalendarIcon className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
					<div className="min-w-0 flex-1">
						<p className="font-medium text-sm sm:text-base">
							{formatDate(startDatetime)}
						</p>
						<p className="text-xs sm:text-sm text-gray-500">
							Dans{" "}
							{formatDistanceToNow(startDatetime, {
								locale: fr,
							})}
						</p>
					</div>
				</div>

				{/* Time */}
				<div className="flex items-start text-gray-700">
					<Clock className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
					<div className="min-w-0 flex-1">
						<p className="font-medium text-sm sm:text-base">
							{formatTime(startDatetime)} - {formatTime(endDatetime)}
						</p>
						<p className="text-xs sm:text-sm text-gray-500">
							Durée: {getDuration(startDatetime, endDatetime)}
						</p>
					</div>
				</div>

				{/* Location */}
				{address && (
					<div className="flex items-start text-gray-700">
						<MapPin className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="font-medium text-sm sm:text-base truncate">
								{address}
							</p>
						</div>
					</div>
				)}

				{/* Capacity */}
				{capacity && (
					<div className="flex items-start text-gray-700">
						<Users className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="font-medium text-sm sm:text-base">
								{capacity} participants
							</p>
							<p className="text-xs sm:text-sm text-gray-500">
								Places limitées
							</p>
						</div>
					</div>
				)}
			</div>
			{price && (
				<div className="border-t pt-4">
					<div className="flex items-center justify-between">
						<div>
							<span className="text-3xl font-bold text-orange-500">
								25€
							</span>
							<span className="text-gray-500 ml-2">par personne</span>
						</div>
						<div className="text-sm text-gray-500 flex items-center">
							<span className="line-through">30€</span>
							<span className="bg-red-100 text-red-600 px-2 py-1 rounded ml-2 inline-flex items-center">
								<Percent className="w-3 h-3 mr-1" />
								-17%
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TitleSummary;


