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
		<div className="bg-white rounded-xl p-6 mb-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
				<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
					{title}
				</h1>
				{/* <div className="flex items-center space-x-2">
					<div className="flex items-center text-yellow-500">
						<Star className="w-4 h-4 fill-yellow-500" />
						<Star className="w-4 h-4 fill-yellow-500" />
						<Star className="w-4 h-4 fill-yellow-500" />
						<Star className="w-4 h-4 fill-yellow-500" />
						<Star className="w-4 h-4" />
					</div>
					<span className="text-gray-600 text-sm">(4.8/5 - 234 avis)</span>
				</div> */}
			</div>
			<div className="flex flex-col sm:flex-row flex-wrap justify-between gap-4 mb-6">
				<div className="flex items-center text-gray-700">
					<CalendarIcon className="text-orange-500 w-5 h-5 mr-3" />
					<div>
						<p className="font-medium">{formatDate(startDatetime)}</p>
						<p className="text-sm text-gray-500">
							Dans{" "}
							{formatDistanceToNow(startDatetime, {
								locale: fr,
							})}
						</p>
					</div>
				</div>
				<div className="flex items-center text-gray-700">
					<Clock className="text-orange-500 w-5 h-5 mr-3" />
					<div>
						<p className="font-medium">
							{formatTime(startDatetime)} - {formatTime(endDatetime)}
						</p>
						<p className="text-sm text-gray-500">
							Durée: {getDuration(startDatetime, endDatetime)}
						</p>
					</div>
				</div>
				{address && (
					<div className="flex items-center text-gray-700">
						<MapPin className="text-orange-500 w-5 h-5 mr-3" />
						<div>
							<p className="font-medium">{address}</p>
							{/* <p className="text-sm text-gray-500">
							123 Rue de la Musique, Paris 1er
						</p> */}
						</div>
					</div>
				)}
				{capacity && (
					<div className="flex items-center text-gray-700">
						<Users className="text-orange-500 w-5 h-5 mr-3" />
						<div>
							<p className="font-medium">{capacity} participants</p>
							<p className="text-sm text-gray-500">Places limitées</p>
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


