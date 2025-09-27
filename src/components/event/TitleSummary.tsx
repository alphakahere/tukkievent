import React from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Star, Percent } from "lucide-react";

type TitleSummaryProps = {
	title: string;
};

const TitleSummary: React.FC<TitleSummaryProps> = ({ title }) => {
	return (
		<div className="bg-white rounded-xl p-6 mb-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
				<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-0">{title}</h1>
				<div className="flex items-center space-x-2">
					<div className="flex items-center text-yellow-500">
						<Star className="w-4 h-4 fill-yellow-500" />
						<Star className="w-4 h-4 fill-yellow-500" />
						<Star className="w-4 h-4 fill-yellow-500" />
						<Star className="w-4 h-4 fill-yellow-500" />
						<Star className="w-4 h-4" />
					</div>
					<span className="text-gray-600 text-sm">(4.8/5 - 234 avis)</span>
				</div>
			</div>
			<div className="grid sm:grid-cols-2 gap-4 mb-6">
				<div className="flex items-center text-gray-700">
					<CalendarIcon className="text-orange-500 w-5 h-5 mr-3" />
					<div>
						<p className="font-medium">Vendredi 15 Mars 2024</p>
						<p className="text-sm text-gray-500">Dans 12 jours</p>
					</div>
				</div>
				<div className="flex items-center text-gray-700">
					<Clock className="text-orange-500 w-5 h-5 mr-3" />
					<div>
						<p className="font-medium">20h00 - 23h30</p>
						<p className="text-sm text-gray-500">Durée: 3h30</p>
					</div>
				</div>
				<div className="flex items-center text-gray-700">
					<MapPin className="text-orange-500 w-5 h-5 mr-3" />
					<div>
						<p className="font-medium">Jazz Club Le Blue Note</p>
						<p className="text-sm text-gray-500">123 Rue de la Musique, Paris 1er</p>
					</div>
				</div>
				<div className="flex items-center text-gray-700">
					<Users className="text-orange-500 w-5 h-5 mr-3" />
					<div>
						<p className="font-medium">156 participants</p>
						<p className="text-sm text-gray-500">Places limitées</p>
					</div>
				</div>
			</div>
			<div className="border-t pt-4">
				<div className="flex items-center justify-between">
					<div>
						<span className="text-3xl font-bold text-orange-500">25€</span>
						<span className="text-gray-500 ml-2">par personne</span>
					</div>
					<div className="text-sm text-gray-500 flex items-center">
						<span className="line-through">30€</span>
						<span className="bg-red-100 text-red-600 px-2 py-1 rounded ml-2 inline-flex items-center">
							<Percent className="w-3 h-3 mr-1" />-17%
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TitleSummary;


