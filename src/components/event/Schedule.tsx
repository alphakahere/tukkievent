import React from "react";

const Schedule: React.FC = () => {
	const items = [
		{ time: "20h00", title: "Ouverture des portes & accueil", desc: "Installation et service de boissons" },
		{ time: "20h30", title: "Premier set - Standards Jazz", desc: "Interprétation des grands classiques du jazz" },
		{ time: "21h30", title: "Pause & intermission", desc: "Temps d'échange et rafraîchissements" },
		{ time: "22h00", title: "Deuxième set - Compositions originales", desc: "Découverte des créations du quartet" },
		{ time: "23h00", title: "Rencontre avec les artistes", desc: "Échange et dédicaces (optionnel)" },
	];

	return (
		<div className="bg-white rounded-xl p-6 mb-6">
			<h2 className="text-2xl font-bold text-gray-900 mb-4">Programme de la soirée</h2>
			<div className="space-y-4">
				{items.map((item) => (
					<div key={item.time} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
						<div className="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold text-sm">{item.time}</div>
						<div>
							<h3 className="font-semibold text-gray-900">{item.title}</h3>
							<p className="text-gray-600 text-sm">{item.desc}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Schedule;


