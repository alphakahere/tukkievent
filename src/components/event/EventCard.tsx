import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { Event } from "@/store/api/event/event.type";
import { format } from "date-fns";

type Props = {
	event: Event;
};

const EventCard: React.FC<Props> = ({ event }) => {
	return (
		<Link href={`/events/${event.slug}`} className="block h-full">
			<div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
				<div className="relative">
					<div className="h-48 bg-orange-100 flex items-center justify-center">
						<Image
							src={event.coverImageUrl}
							alt={event.title}
							className="w-full h-full object-cover"
							width={600}
							height={300}
						/>
					</div>
					{event?.category && (
						<div className="absolute top-4 left-4">
							<span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
								{event?.category?.name}
							</span>
						</div>
					)}
				</div>
				<div className="p-6">
					<div className="flex items-center text-gray-500 text-sm mb-2">
						<Calendar className="w-4 h-4 mr-2" />
						<span>
							{format(new Date(event.startDatetime), "dd/MM/yyyy")}
						</span>
						<span className="mx-2">•</span>
						<Clock className="w-4 h-4 mr-2" />
						<span>{format(new Date(event.startDatetime), "HH:mm")}</span>
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">
						{event.title}
					</h3>
					<p className="text-gray-600 mb-2">{event.metaDescription}</p>
					<div className="flex items-center justify-between">
						<div>
							{/* <span className="text-2xl font-bold text-orange-500">
								{event.pri}
							</span> */}
							{/* <span className="text-gray-500 text-sm ml-1">
								par personne
							</span> */}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default EventCard;
