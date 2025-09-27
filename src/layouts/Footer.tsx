import { Facebook, Instagram, Ticket, Twitter, Youtube as YouTube } from "lucide-react";
import React from "react";

const Footer = () => {
	return (
		<footer className="bg-gray-900 text-white pt-16 pb-8">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
					<div>
						<div className="flex items-center mb-4">
							<Ticket className="h-8 w-8 text-orange-500 mr-2" />
							<span className="text-2xl font-bold">TukkiEvent</span>
						</div>
						<p className="text-gray-400 mb-4">
							Simplifiez la gestion d'événements à travers l'Afrique.
							Créez, vendez et gérez vos billets facilement — même avec
							une connectivité limitée.
						</p>
						<div className="flex space-x-4">
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<Facebook className="h-5 w-5" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<Twitter className="h-5 w-5" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<Instagram className="h-5 w-5" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<YouTube className="h-5 w-5" />
							</a>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Entreprise</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									À propos
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Blog
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Carrières
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Contact
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Ressources</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									FAQ
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Centre d'aide
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Conditions d'utilisation
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Politique de confidentialité
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Langue</h3>
						<select className="bg-gray-800 text-gray-400 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500">
							<option value="en">English</option>
							<option value="fr">Français</option>
							<option value="sw">Kiswahili</option>
							<option value="ha">Hausa</option>
							<option value="yo">Yorùbá</option>
						</select>
					</div>
				</div>

				<div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
					<p>
						&copy; {new Date().getFullYear()} TukkiEvent. Tous droits
						réservés.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
