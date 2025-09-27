import Link from "next/link";
import TopBar from "@/components/event/TopBar";
import Hero from "@/components/event/Hero";
import TitleSummary from "@/components/event/TitleSummary";
import Description from "@/components/event/Description";
import Schedule from "@/components/event/Schedule";
import Venue from "@/components/event/Venue";
import Organizer from "@/components/event/Organizer";
import Sidebar from "@/components/event/Sidebar";
import { getEventById, getSimilarEvents } from "@/data/events";
import SimilarEvents from "@/components/event/SimilarEvents";
import { ChevronRight } from "lucide-react";

type PageProps = {
	params: { id: string };
};

export default function EventDetailPage({ params }: PageProps) {
	const event = getEventById(params.id);

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

	const similar = getSimilarEvents(event.category, event.id, 3);

	return (
		<div className="bg-gray-50 min-h-screen">
			<TopBar />
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
					<Link href="/" className="hover:text-orange-500">
						Accueil
					</Link>
					<ChevronRight className="w-4 h-4" />
					<span className="hover:text-orange-500">Événements</span>
					<ChevronRight className="w-4 h-4" />
					<span className="hover:text-orange-500">{event.category}</span>
					<ChevronRight className="w-4 h-4" />
					<span className="text-gray-900 font-medium">{event.title}</span>
				</nav>

				<div className="grid lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<Hero
							image={event.image}
							category={event.category}
							title={event.title}
						/>
						<TitleSummary title={event.title} />
						<Description />
						<Schedule />
						<Venue />
						<Organizer />
					</div>
					<div className="lg:col-span-1">
						<Sidebar unitPrice={25} />
					</div>
				</div>
				<div className="mt-8">
					<SimilarEvents events={similar} />
				</div>
			</main>
		</div>
	);
}
