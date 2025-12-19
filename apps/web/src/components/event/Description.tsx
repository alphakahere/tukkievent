import React from "react";

const Description: React.FC<{ description: string }> = ({ description }) => {
	return (
		<div className="bg-white rounded-xl p-6 mb-6">
			<h2 className="text-2xl font-bold text-gray-900 mb-4">
				À propos de cet événement
			</h2>
			<div
				className="prose max-w-none"
				dangerouslySetInnerHTML={{ __html: description }}
			/>
		</div>
	);
};

export default Description;


