import React from "react";
import EventCard from "./EventCard";
import { Event } from "@/store/api/event/event.type";

type SimilarEventsProps = {
	events: Event[];
};

const SimilarEvents: React.FC<SimilarEventsProps> = ({ events }) => {
	return (
		<div className="border-t border-gray-200 pt-8">
			<h3 className="font-semibold text-gray-900 mb-4">Événements similaires</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{events.map((ev) => (
					<EventCard key={ev.id} event={ev} />
				))}
			</div>
		</div>
	);
};

export default SimilarEvents;
