import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const Hero: React.FC = () => {
	return (
		<section className="relative lg:min-h-[80vh] min-h-[40vh] flex pt-16 overflow-hidden">
			{/* Background Image with Overlay */}
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-orange-900/80 z-10"></div>
				<Image
					src="/images/hero.jpg"
					alt="Senegal event with people using mobile phones"
					className="w-full h-full object-cover"
					width={1600}
					height={500}
					priority
				/>
			</div>

			<div className="container mx-auto px-4 z-10 relative pt-8 lg:pt-32 flex items-center min-h-[inherit]">
				<div className="max-w-3xl">
					{/* Mobile-optimized heading */}
					<h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-3 lg:mb-6 leading-tight">
						Simplifiez la gestion d&apos;événements au Sénégal
					</h1>

					{/* Mobile-optimized description */}
					<p className="text-sm sm:text-base lg:text-xl xl:text-2xl text-white/90 mb-6 lg:mb-8 leading-relaxed">
						Créez, vendez et gérez des billets facilement — même avec une
						connectivité limitée
					</p>

					{/* Mobile: Single CTA button, Desktop: Two buttons */}
					<div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
						{/* Mobile CTA - Always visible */}
						<a
							href="#events"
							className="lg:hidden inline-flex items-center justify-center px-6 py-3 rounded-full bg-orange-500 text-white font-medium text-base hover:bg-orange-600 transition-colors"
						>
							Découvrir les événements
							<ArrowRight className="ml-2 h-4 w-4" />
						</a>

						{/* Desktop CTAs - Hidden on mobile */}
						<div className="hidden lg:flex flex-col sm:flex-row gap-4">
							<a
								href="#"
								className="px-8 py-4 rounded-full bg-orange-500 text-white font-medium text-lg hover:bg-orange-600 transition-colors flex items-center justify-center sm:justify-start"
							>
								Créer votre événement
								<ArrowRight className="ml-2 h-5 w-5" />
							</a>

							<a
								href="#events"
								className="px-8 py-4 rounded-full bg-white/10 text-white font-medium text-lg backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center sm:justify-start border border-white/30"
							>
								Explorer les événements
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* Wave Separator - Smaller on mobile */}
			<div className="absolute bottom-0 left-0 right-0">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1440 210"
					className="w-full h-16 lg:h-auto"
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
