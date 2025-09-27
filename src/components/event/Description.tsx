import React from "react";

const Description: React.FC = () => {
	return (
		<div className="bg-white rounded-xl p-6 mb-6">
			<h2 className="text-2xl font-bold text-gray-900 mb-4">À propos de cet événement</h2>
			<div className="prose max-w-none">
				<p className="text-gray-700 leading-relaxed mb-4">
					Plongez dans l'univers envoûtant du jazz lors d'une soirée exceptionnelle au Jazz Club Le Blue Note. Cette soirée mettra en vedette des artistes de renommée internationale dans un cadre intimiste et chaleureux.
				</p>
				<p className="text-gray-700 leading-relaxed mb-4">Au programme de cette soirée jazz inoubliable :</p>
				<ul className="list-disc pl-6 text-gray-700 mb-4">
					<li>Concert du quartet de Marcus Johnson (saxophone, piano, contrebasse, batterie)</li>
					<li>Interprétation de standards jazz et compositions originales</li>
					<li>Ambiance feutrée avec service de cocktails et petites restaurations</li>
					<li>Possibilité de rencontrer les artistes après le spectacle</li>
				</ul>
				<p className="text-gray-700 leading-relaxed">Que vous soyez amateur de jazz chevronné ou simplement curieux, cette soirée saura vous séduire par la qualité de sa programmation et l'authenticité de son atmosphère.</p>
			</div>
		</div>
	);
};

export default Description;


