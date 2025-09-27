import React from "react";
import { Music2 } from "lucide-react";
import { Organization } from "@/store/api/event/event.type";

interface Props {
	organization: Organization;
}

const Organizer: React.FC<Props> = ({ organization }) => {
	return (
		<div className="bg-white rounded-xl p-6">
			<h2 className="text-2xl font-bold text-gray-900 mb-4">Organisateur</h2>
			<div className="flex items-center space-x-4">
				<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
					<Music2 className="w-6 h-6 text-orange-500" />
				</div>
				<div>
					<h3 className="font-semibold text-gray-900">{organization?.name}</h3>
					<p className="text-gray-600 text-sm mb-2">
						{organization?.description}
					</p>
					{/* <div className="flex items-center text-sm text-gray-500">
						<span className="mr-4 inline-flex items-center"><CalendarIcon className="w-4 h-4 mr-1" />{organization.eventsCount} événements</span>
						<span className="mr-4 inline-flex items-center"><Users className="w-4 h-4 mr-1" />{organization.participantsCount} participants</span>
						<span className="inline-flex items-center"><Star className="w-4 h-4 mr-1" />{organization.rating}/5</span>
					</div> */}
				</div>
				{/* <button className="ml-auto bg-orange-50 text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium">
					Voir le profil
				</button> */}
			</div>
		</div>
	);
};

export default Organizer;


