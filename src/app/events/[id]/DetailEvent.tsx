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
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
				{/* Breadcrumb Navigation - Responsive */}
				<nav className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 overflow-x-auto">
					<Link href="/" className="hover:text-orange-500 whitespace-nowrap">
						Accueil
					</Link>
					<ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
					<span className="hover:text-orange-500 whitespace-nowrap hidden sm:inline">
						Événements
					</span>
					<ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 hidden sm:inline" />
					<span className="hover:text-orange-500 whitespace-nowrap hidden md:inline">
						{event.category?.name}
					</span>
					<ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 hidden md:inline" />
					<span className="text-gray-900 font-medium truncate">
						{event.title}
					</span>
				</nav>

				{/* Mobile-first layout: Stack sidebar below content on mobile */}
				<div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 order-2 lg:order-1">
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

					{/* Sidebar - Appears first on mobile, second on desktop */}
					<div className="lg:col-span-1 order-1 lg:order-2">
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
