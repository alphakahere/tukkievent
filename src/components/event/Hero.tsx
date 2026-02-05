"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Heart, Music2 } from "lucide-react";

type HeroProps = {
	image: string;
	category: string;
	title: string;
};

const Hero: React.FC<HeroProps> = ({ image, category }) => {
	const [favorite, setFavorite] = useState(false);
	return (
		<div className="relative mb-4 sm:mb-6">
			{/* Responsive height: smaller on mobile, larger on desktop */}
			<div className="h-48 sm:h-64 md:h-80 lg:h-96 bg-orange-100 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center">
				<Image
					src={image}
					alt={category}
					width={1200}
					height={600}
					className="w-full h-full object-cover object-left"
					priority
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
				/>
			</div>
			{/* Favorite button - responsive positioning and size */}
			<button
				onClick={() => setFavorite((f) => !f)}
				className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 sm:p-3 rounded-full transition-colors shadow-lg"
				aria-label="Favori"
			>
				<Heart
					className={`w-4 h-4 sm:w-5 sm:h-5 ${
						favorite ? "text-red-500 fill-red-500" : "text-gray-600"
					}`}
				/>
			</button>
			{/* Category badge - responsive positioning and size */}
			<div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">
				<span className="bg-orange-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium inline-flex items-center">
					<Music2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
					<span className="truncate max-w-[120px] sm:max-w-none">
						{category}
					</span>
				</span>
			</div>
		</div>
	);
};

export default Hero;


