"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type TopBarProps = {
	brand?: string;
};

const TopBar: React.FC<TopBarProps> = ({ brand = "TukkiEvent" }) => {
	const router = useRouter();
	return (
		<header className="bg-white shadow-md sticky top-0 z-40">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center space-x-4">
						<button onClick={() => router.back()} className="text-gray-600 hover:text-orange-500 transition-colors" aria-label="Retour">
							<ArrowLeft className="w-6 h-6" />
						</button>
						<Link href="/" className="text-2xl font-bold text-orange-500">
							{brand}
						</Link>
					</div>
				<nav className="hidden md:flex space-x-8">
					<Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">Accueil</Link>
					<a className="text-gray-700 hover:text-orange-500 transition-colors font-medium" href="#events">Événements</a>
					<a className="text-gray-700 hover:text-orange-500 transition-colors font-medium" href="#contact">Contact</a>
				</nav>
				<div className="flex items-center space-x-4">
					<button className="text-gray-700 hover:text-orange-500 transition-colors font-medium">Connexion</button>
					<button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
						S'inscrire
					</button>
				</div>
			</div>
		</div>
	</header>
	);
};

export default TopBar;


