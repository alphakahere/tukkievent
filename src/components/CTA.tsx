import { Play, UserPlus } from "lucide-react";
import React from "react";

const CTA = () => {
	return (
		<section className="py-20 bg-white">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<div className="bg-orange-50 rounded-2xl p-12">
					<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
						Prêt à vivre des expériences inoubliables ?
					</h2>
					<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
						Rejoignez des milliers d'utilisateurs qui font confiance à Tukki
						Event pour découvrir et réserver les meilleurs événements. Créez
						votre compte gratuitement et ne ratez plus jamais un événement
						qui vous passionne.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-500/90 cursor-pointer transition-colors transform hover:scale-105 duration-300">
							<UserPlus className="inline-block mr-2" />
							Créer un compte gratuit
						</button>
						<button className="border-2 border-purple-500 text-purple-500 px-6 py-3 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition-colors cursor-pointer duration-300">
							<Play className="inline-block mr-2" />
							Voir la démo
						</button>
					</div>

					<div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
						<div>
							<div className="text-3xl font-bold text-orange-500 mb-2">
								10K+
							</div>
							<div className="text-gray-600">Événements organisés</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-orange-500 mb-2">
								50K+
							</div>
							<div className="text-gray-600">Utilisateurs actifs</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-orange-500 mb-2">
								98%
							</div>
							<div className="text-gray-600">Satisfaction client</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CTA;
