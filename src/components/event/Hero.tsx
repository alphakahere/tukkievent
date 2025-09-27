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
		<div className="relative mb-6">
			<div className="h-96 bg-orange-100 rounded-xl overflow-hidden flex items-center justify-center">
				<Image src={image} alt={category} width={1200} height={600} className="w-full h-full object-cover" />
			</div>
			<button
				onClick={() => setFavorite((f) => !f)}
				className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full transition-colors shadow-lg"
				aria-label="Favori"
			>
				<Heart className={`text-xl ${favorite ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
			</button>
			<div className="absolute bottom-4 left-4">
				<span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium inline-flex items-center">
					<Music2 className="w-4 h-4 mr-2" />{category}
				</span>
			</div>
		</div>
	);
};

export default Hero;


