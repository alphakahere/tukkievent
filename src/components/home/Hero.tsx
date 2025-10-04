import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const Hero: React.FC = () => {
	return (
		<section className="relative md:min-h-[80vh] min-h-[50vh] flex pt-16 overflow-hidden">
			{/* Background Image with Overlay */}
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-orange-900/80 z-10"></div>
				<Image
					src="/images/hero.jpg"
					alt="African event with people using mobile phones"
					className="w-full h-full object-cover"
					width={1600}
					height={500}
				/>
			</div>

			<div className="container mx-auto px-4 z-10 relative pt-12 md:pt-32">
				<div className="max-w-3xl">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
						Simplifiez la gestion d&apos;événements au Sénégal
					</h1>

					<p className="text-xl md:text-2xl text-white/90 mb-8">
						Créez, vendez et gérez des billets facilement — même avec une
						connectivité limitée
					</p>

					<div className="lg:flex flex-col sm:flex-row gap-4 hidden">
						<a
							href="#"
							className="px-8 py-4 rounded-full bg-orange-500 text-white font-medium text-lg hover:bg-orange-600 transition-colors flex items-center justify-center sm:justify-start"
						>
							Créer votre événement
							<ArrowRight className="ml-2 h-5 w-5" />
						</a>

						<a
							href="#"
							className="px-8 py-4 rounded-full bg-white/10 text-white font-medium text-lg backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center sm:justify-start border border-white/30"
						>
							Explorer les événements
						</a>
					</div>
				</div>

				{/* Stats */}
				{/* <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
					<div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
						<p className="text-3xl font-bold text-white mb-1">1000+</p>
						<p className="text-white/80">Events Hosted</p>
					</div>

					<div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
						<p className="text-3xl font-bold text-white mb-1">25+</p>
						<p className="text-white/80">African Countries</p>
					</div>

					<div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
						<p className="text-3xl font-bold text-white mb-1">100K+</p>
						<p className="text-white/80">Tickets Sold</p>
					</div>

					<div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
						<p className="text-3xl font-bold text-white mb-1">98%</p>
						<p className="text-white/80">Satisfaction Rate</p>
					</div>
				</div> */}
			</div>

			{/* Wave Separator */}
			<div className="absolute bottom-0 left-0 right-0">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1440 210"
					className="w-full"
				>
					<path
						fill="#f9fafb"
						fillOpacity="1"
						d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,181.3C672,203,768,213,864,208C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
					></path>
				</svg>
			</div>
		</section>
	);
};

export default Hero;
