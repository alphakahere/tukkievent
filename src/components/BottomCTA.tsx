import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

const BottomCTA: React.FC = () => {
  return (
		<section className="py-20 bg-purple-700 text-white">
			<div className="container mx-auto px-4">
				<div className="max-w-4xl mx-auto text-center">
					<Calendar className="h-16 w-16 mx-auto mb-6 text-white opacity-90" />

					<h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
						Prêt à transformer la gestion de vos événements ?
					</h2>

					<p className="text-xl md:text-2xl mb-10 text-white/90">
						Rejoignez les organisateurs à travers l'Afrique qui créent des
						événements réussis avec TukkiEvent
					</p>

					<div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
						<a
							href="#"
							className="px-8 py-4 rounded-full bg-white text-purple-700 font-medium text-lg hover:bg-gray-100 transition-colors flex items-center justify-center min-w-48"
						>
							Commencer maintenant
							<ChevronRight className="ml-2 h-5 w-5" />
						</a>

						<a
							href="#"
							className="px-8 py-4 rounded-full bg-transparent text-white font-medium text-lg border border-white/30 hover:bg-white/10 transition-colors flex items-center justify-center min-w-48"
						>
							Planifier une démo
						</a>
					</div>

					<div className="mt-12 flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-12">
						<div className="flex flex-col items-center">
							<p className="text-3xl font-bold mb-1">1000+</p>
							<p className="text-white/80">Événements organisés</p>
						</div>

						<div className="flex flex-col items-center">
							<p className="text-3xl font-bold mb-1">25+</p>
							<p className="text-white/80">Pays africains</p>
						</div>

						<div className="flex flex-col items-center">
							<p className="text-3xl font-bold mb-1">100K+</p>
							<p className="text-white/80">Billets vendus</p>
						</div>
					</div>
				</div>
			</div>
		</section>
  );
};

export default BottomCTA;