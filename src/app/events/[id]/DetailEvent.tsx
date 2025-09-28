"use client";
import Link from "next/link";
import Hero from "@/components/event/Hero";
import TitleSummary from "@/components/event/TitleSummary";
import Description from "@/components/event/Description";
import Venue from "@/components/event/Venue";
import Organizer from "@/components/event/Organizer";
import Sidebar from "@/components/event/Sidebar";
import { ChevronRight } from "lucide-react";
import { Event } from "@/store/api/event/event.type";
import Layout from "@/layouts/Layout";

type Props = {
	event: Event;
};

export default function EventDetail({ event }: Props) {
	console.log(event);

	if (!event) {
		return (
			<div className="max-w-3xl mx-auto px-4 py-16">
				<Link
					href="/"
					className="inline-block px-5 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
				>
					Accueil
				</Link>
			</div>
		);
	}

	return (
		<Layout>
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
					<Link href="/" className="hover:text-orange-500">
						Accueil
					</Link>
					<ChevronRight className="w-4 h-4" />
					<span className="hover:text-orange-500">Événements</span>
					<ChevronRight className="w-4 h-4" />
					<span className="hover:text-orange-500">{event.category?.name}</span>
					<ChevronRight className="w-4 h-4" />
					<span className="text-gray-900 font-medium">{event.title}</span>
				</nav>

				<div className="grid lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<Hero
							image={event.coverImageUrl}
							category={event.category?.name}
							title={event.title}
						/>
						<TitleSummary
							title={event.title}
							startDatetime={event.startDatetime}
							endDatetime={event.endDatetime}
							address={event.address}
							capacity={event.capacity}
						/>
						<Description description={event.description} />
						<Venue address={event.address} city={event.city} />
						<Organizer organization={event.organization} />
					</div>
					<div className="lg:col-span-1">
						<Sidebar event={event} />
					</div>
				</div>
				{/* <div className="mt-8">
					<SimilarEvents events={similar} />
				</div> */}
			</main>
		</Layout>
	);
}
