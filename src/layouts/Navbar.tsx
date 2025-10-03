"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Ticket, Menu, X } from "lucide-react";

type NavbarProps = {
	brand?: string;
};

const Navbar: React.FC<NavbarProps> = ({ brand = "TukkiEvent" }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="bg-white sticky top-0 z-40 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center space-x-4">
						<Ticket className="w-5 h-5 text-orange-500 mr-2" />
						<Link
							href="/"
							className="text-xl sm:text-2xl font-bold text-orange-500"
						>
							{brand}
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex space-x-8">
						<Link
							href="/"
							className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
						>
							Accueil
						</Link>
						<a
							className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
							href="#events"
						>
							Événements
						</a>
						<a
							className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
							href="#contact"
						>
							Contact
						</a>
					</nav>

					{/* Desktop Auth Buttons */}
					<div className="hidden md:flex items-center space-x-4">
						<button className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
							Connexion
						</button>
						<button className="bg-orange-500 text-white px-4 lg:px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm lg:text-base">
							S'inscrire
						</button>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-100 transition-colors"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label="Toggle menu"
					>
						{isMenuOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden border-t border-gray-200 py-4">
						<nav className="flex flex-col space-y-4">
							<Link
								href="/"
								className="text-gray-700 hover:text-orange-500 transition-colors font-medium px-2 py-1"
								onClick={() => setIsMenuOpen(false)}
							>
								Accueil
							</Link>
							<a
								className="text-gray-700 hover:text-orange-500 transition-colors font-medium px-2 py-1"
								href="#events"
								onClick={() => setIsMenuOpen(false)}
							>
								Événements
							</a>
							<a
								className="text-gray-700 hover:text-orange-500 transition-colors font-medium px-2 py-1"
								href="#contact"
								onClick={() => setIsMenuOpen(false)}
							>
								Contact
							</a>
							<hr className="my-2" />
							<button
								className="text-gray-700 hover:text-orange-500 transition-colors font-medium text-left px-2 py-1"
								onClick={() => setIsMenuOpen(false)}
							>
								Connexion
							</button>
							<button
								className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium mx-2"
								onClick={() => setIsMenuOpen(false)}
							>
								S'inscrire
							</button>
						</nav>
					</div>
				)}
			</div>
		</header>
	);
};

export default Navbar;


