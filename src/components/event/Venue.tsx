import React from "react";
import { MapPin, Train, Bus, Car, BadgeCheck } from "lucide-react";

const Venue: React.FC = () => {
	return (
		<div className="bg-white rounded-xl p-6 mb-6">
			<h2 className="text-2xl font-bold text-gray-900 mb-4">Lieu et accès</h2>
			<div className="mb-4">
				<h3 className="font-semibold text-gray-900 mb-2">Jazz Club Le Blue Note</h3>
				<p className="text-gray-700 mb-1">123 Rue de la Musique, 75001 Paris</p>
				<p className="text-gray-600 text-sm mb-4">Métro: Châtelet (lignes 1, 4, 7, 11, 14) - 5 min à pied</p>
			</div>
			<div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
				<div className="text-center">
					<MapPin className="w-8 h-8 text-orange-500 mb-2 mx-auto" />
					<p className="text-gray-600">Carte interactive</p>
					<p className="text-sm text-gray-500">Jazz Club Le Blue Note</p>
				</div>
			</div>
			<div className="grid sm:grid-cols-2 gap-4 text-sm">
				<div>
					<h4 className="font-semibold text-gray-900 mb-2">Transport</h4>
					<ul className="text-gray-600 space-y-1">
						<li className="flex items-center"><Train className="w-4 h-4 mr-2 text-orange-500" />Métro: Châtelet (5 min)</li>
						<li className="flex items-center"><Bus className="w-4 h-4 mr-2 text-orange-500" />Bus: 21, 38, 47, 58</li>
						<li className="flex items-center"><Car className="w-4 h-4 mr-2 text-orange-500" />Parking Rivoli à 200m</li>
					</ul>
				</div>
				<div>
					<h4 className="font-semibold text-gray-900 mb-2">Informations</h4>
					<ul className="text-gray-600 space-y-1">
						<li className="flex items-center"><BadgeCheck className="w-4 h-4 mr-2 text-orange-500" />Accessible PMR</li>
						<li className="flex items-center"><BadgeCheck className="w-4 h-4 mr-2 text-orange-500" />Vestiaire disponible</li>
						<li className="flex items-center"><BadgeCheck className="w-4 h-4 mr-2 text-orange-500" />Bar et restauration</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Venue;


