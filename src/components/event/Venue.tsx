import React from "react";
import { MapPin } from "lucide-react";

interface Props {
	address: string;
	city: string;
}

const Venue: React.FC<Props> = ({ address, city }) => {
	return (
		<div className="bg-white rounded-xl p-6 mb-6">
			<h2 className="text-2xl font-bold text-gray-900 mb-4">Lieu et accès</h2>
			<div className="mb-4">
				<h3 className="font-semibold text-gray-900 mb-2">{address}</h3>
				<p className="text-gray-700 mb-1">{city}</p>
				<p className="text-gray-600 text-sm mb-4">Medina, Douta Seck</p>
			</div>
			<div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
				<div className="text-center">
					<MapPin className="w-8 h-8 text-orange-500 mb-2 mx-auto" />
					<p className="text-gray-600">Carte interactive</p>
					<p className="text-sm text-gray-500">{address}</p>
				</div>
			</div>
			{/* <div className="grid sm:grid-cols-2 gap-4 text-sm">
				<div>
					<h4 className="font-semibold text-gray-900 mb-2">Transport</h4>
					<ul className="text-gray-600 space-y-1">
						<li className="flex items-center">
							<Train className="w-4 h-4 mr-2 text-orange-500" />
							Métro: {transport}
						</li>
						<li className="flex items-center">
							<Bus className="w-4 h-4 mr-2 text-orange-500" />
							Bus: 21, 38, 47, 58
						</li>
						<li className="flex items-center">
							<Car className="w-4 h-4 mr-2 text-orange-500" />
							Parking Rivoli à 200m
						</li>
					</ul>
				</div>
				<div>
					<h4 className="font-semibold text-gray-900 mb-2">Informations</h4>
					<ul className="text-gray-600 space-y-1">
						<li className="flex items-center">
							<BadgeCheck className="w-4 h-4 mr-2 text-orange-500" />
							Accessible PMR: {accessiblePMR ? "Oui" : "Non"}
						</li>
						<li className="flex items-center">
							<BadgeCheck className="w-4 h-4 mr-2 text-orange-500" />
							Vestiaire disponible: {vestiaire ? "Oui" : "Non"}
						</li>
						<li className="flex items-center">
							<BadgeCheck className="w-4 h-4 mr-2 text-orange-500" />
							Bar: {bar ? "Oui" : "Non"}
						</li>
						<li className="flex items-center">
							<BadgeCheck className="w-4 h-4 mr-2 text-orange-500" />
							Restaurant: {restaurant ? "Oui" : "Non"}
						</li>
					</ul>
				</div>
			</div> */}
		</div>
	);
};

export default Venue;


