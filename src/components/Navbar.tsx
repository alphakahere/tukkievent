import React from "react";
import Link from "next/link";

const Navbar = () => {
	return (
		<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div className="flex justify-between items-center h-20">
				{/* Logo */}
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
						<svg
							className="w-6 h-6 text-white"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0v12h16V6H4zm2 2h8v2H6V8zm0 4h8v2H6v-2z" />
						</svg>
					</div>
					<h1 className="text-2xl font-bold text-white">TukkiEvent</h1>
				</div>

				{/* Navigation Links */}
				<nav className="hidden md:flex items-center space-x-8">
					<Link
						href="#schedule"
						className="text-white hover:text-pink-200 transition-colors font-medium"
					>
						Programme
					</Link>
					<Link
						href="#speakers"
						className="text-white hover:text-pink-200 transition-colors font-medium"
					>
						Intervenants
					</Link>
					<Link
						href="#tickets"
						className="text-white hover:text-pink-200 transition-colors font-medium"
					>
						Billets
					</Link>
					<Link
						href="#contact"
						className="text-white hover:text-pink-200 transition-colors font-medium"
					>
						Contact
					</Link>
				</nav>

				{/* Login Button */}
				<div className="flex items-center space-x-4">
					<button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/30 transition-all duration-200">
						Se connecter
					</button>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
