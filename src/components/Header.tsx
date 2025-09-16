import React from 'react'
import Navbar from './Navbar'
import Hero from "./Hero";

const Header = () => {
	return (
		<header className="relative text-white overflow-hidden">
			{/* Blurred background effect */}
			<div className="bg-black/20">
				<div className="bg-gradient-to-r from-pink-500/50 via-purple-600/50 to-purple-800/50">
					<Navbar />
					<Hero />
				</div>
			</div>
		</header>
	);
};

export default Header