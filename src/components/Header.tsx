"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, Ticket } from "lucide-react";

const Header: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`fixed w-full z-50 transition-all duration-300 ${
				scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
			}`}
		>
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center">
						<Ticket className="h-8 w-8 text-orange-500 mr-2" />
						<span
							className={`text-2xl font-bold ${
								scrolled ? "text-gray-800" : "text-white"
							}`}
						>
							TukkiEvent
						</span>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-6">
						{/* <a
							href="#how-it-works"
							className={`${
								scrolled ? "text-gray-700" : "text-white"
							} hover:text-orange-500 transition-colors`}
						>
							How It Works
						</a> */}
						{/* <a
							href="#pricing"
							className={`${
								scrolled ? "text-gray-700" : "text-white"
							} hover:text-orange-500 transition-colors`}
						>
							Pricing
						</a> */}
						<a
							href="#"
							className="px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
						>
							Se connecter
						</a>
						<a
							href="#"
							className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
						>
							Créer un événement
						</a>
					</nav>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden focus:outline-none"
						onClick={() => setIsOpen(!isOpen)}
					>
						{isOpen ? (
							<X
								className={`h-6 w-6 ${
									scrolled ? "text-gray-800" : "text-white"
								}`}
							/>
						) : (
							<Menu
								className={`h-6 w-6 ${
									scrolled ? "text-gray-800" : "text-white"
								}`}
							/>
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				{isOpen && (
					<div className="md:hidden absolute left-0 right-0 bg-white shadow-lg mt-4 py-4 px-4 rounded-lg">
						<nav className="flex flex-col space-y-4">
							<a
								href="#features"
								className="text-gray-700 hover:text-orange-500 transition-colors"
								onClick={() => setIsOpen(false)}
							>
								Fonctionnalités
							</a>
							<a
								href="#how-it-works"
								className="text-gray-700 hover:text-orange-500 transition-colors"
								onClick={() => setIsOpen(false)}
							>
								Comment ça marche
							</a>
							<a
								href="#pricing"
								className="text-gray-700 hover:text-orange-500 transition-colors"
								onClick={() => setIsOpen(false)}
							>
								Tarifs
							</a>
							<a
								href="#"
								className="px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors text-center"
							>
								Se connecter
							</a>
							<a
								href="#"
								className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors text-center"
							>
								Créer un événement
							</a>
						</nav>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
