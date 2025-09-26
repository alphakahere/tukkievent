"use client";
import React, { useState } from 'react';
import { Search, Calendar, MapPin, Clock, Users, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { events, type Event } from "@/data/events";

// events data imported from @/data/events

const categories = ["All", "Technology", "Fashion", "Arts", "Music", "Business", "Food & Drink"];
const categoryLabel: Record<string, string> = {
	All: "Tous",
	Technology: "Technologie",
	Fashion: "Mode",
	Arts: "Arts",
	Music: "Musique",
	Business: "Business",
	"Food & Drink": "Gastronomie",
};
const quickFilters = [
	"Today",
	"Tomorrow",
	"This weekend",
	"Online",
	"In-person",
	"Free",
	"Paid",
] as const;
const quickFilterLabel: Record<QuickFilter, string> = {
	Today: "Aujourd'hui",
	Tomorrow: "Demain",
	"This weekend": "Ce week‑end",
	Online: "En ligne",
	"In-person": "En présentiel",
	Free: "Gratuit",
	Paid: "Payant",
};
type QuickFilter = (typeof quickFilters)[number];

function dayRange(offsetDays: number) {
	const now = new Date();
	const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays);
	const end = new Date(start);
	return {
		start: new Date(start.getFullYear(), start.getMonth(), start.getDate()),
		end: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59),
	};
}

function nextWeekendRange() {
	const now = new Date();
	const day = now.getDay(); // 0 Sun ... 6 Sat
	const daysUntilSat = (6 - day + 7) % 7;
	const sat = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSat);
	const sun = new Date(sat.getFullYear(), sat.getMonth(), sat.getDate() + 1);
	const start = new Date(sat.getFullYear(), sat.getMonth(), sat.getDate());
	const end = new Date(sun.getFullYear(), sun.getMonth(), sun.getDate(), 23, 59, 59);
	return { start, end };
}

function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
	return aStart <= bEnd && bStart <= aEnd;
}

type EventCardProps = {
	event: Event;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
	return (
		<Link href={`/events/${event.id}`} className="block">
			<div className="bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300 group border border-gray-100">
				<div className="relative h-48 overflow-hidden">
					<Image
						src={event.image}
						alt={event.title}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
						width={500}
						height={500}
					/>
					<div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
						{event.category}
					</div>
					<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
						{event.price}
					</div>
				</div>

				<div className="p-6">
					<h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-orange-600 transition-colors">
						{event.title}
					</h3>

					<div className="space-y-2 mb-4">
						<div className="flex items-center text-gray-600">
							<Calendar className="w-4 h-4 mr-2 text-gray-800" />
							<span className="text-sm">{event.date}</span>
						</div>

						<div className="flex items-center text-gray-600">
							<Clock className="w-4 h-4 mr-2 text-gray-800" />
							<span className="text-sm">{event.time}</span>
						</div>

						<div className="flex items-center text-gray-600">
							<MapPin className="w-4 h-4 mr-2 text-gray-800" />
							<span className="text-sm">{event.location}</span>
						</div>

						<div className="flex items-center text-gray-600">
							<Users className="w-4 h-4 mr-2 text-gray-800" />
							<span className="text-sm">
								{event.attendees} attendees
							</span>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-500">
							by{" "}
							<span className="font-medium text-gray-700">
								{event.organizer}
							</span>
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
};

const ListEvents: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedQuick, setSelectedQuick] = useState<Set<QuickFilter>>(new Set());
	const [place, setPlace] = useState("");

	const toggleQuick = (q: QuickFilter) => {
		const next = new Set(selectedQuick);
		if (next.has(q)) next.delete(q);
		else next.add(q);
		setSelectedQuick(next);
	};

	const clearAll = () => {
		setSearchTerm("");
		setSelectedCategory("All");
		setSelectedQuick(new Set());
		setPlace("");
	};

	const filteredEvents = events.filter((event) => {
		const matchesSearch =
			event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.organizer.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesCategory =
			selectedCategory === "All" || event.category === selectedCategory;

		const matchesPlace =
			!place || event.location.toLowerCase().includes(place.toLowerCase());

		const hasOnline = selectedQuick.has("Online");
		const hasInPerson = selectedQuick.has("In-person");
		const matchesMode =
			(!hasOnline && !hasInPerson) ||
			(hasOnline && event.mode === "online") ||
			(hasInPerson && event.mode === "in-person");

		const hasFree = selectedQuick.has("Free");
		const hasPaid = selectedQuick.has("Paid");
		const isFree = event.price.toLowerCase() === "free";
		const matchesPrice =
			(!hasFree && !hasPaid) || (hasFree && isFree) || (hasPaid && !isFree);

		const hasToday = selectedQuick.has("Today");
		const hasTomorrow = selectedQuick.has("Tomorrow");
		const hasWeekend = selectedQuick.has("This weekend");
		const eventStart = new Date(event.startDate);
		const eventEnd = new Date(event.endDate);
		let matchesDate = true;
		if (hasToday || hasTomorrow || hasWeekend) {
			matchesDate = false;
			if (hasToday) {
				const { start, end } = dayRange(0);
				if (rangesOverlap(eventStart, eventEnd, start, end)) matchesDate = true;
			}
			if (!matchesDate && hasTomorrow) {
				const { start, end } = dayRange(1);
				if (rangesOverlap(eventStart, eventEnd, start, end)) matchesDate = true;
			}
			if (!matchesDate && hasWeekend) {
				const { start, end } = nextWeekendRange();
				if (rangesOverlap(eventStart, eventEnd, start, end)) matchesDate = true;
			}
		}

		return (
			matchesSearch &&
			matchesCategory &&
			matchesPlace &&
			matchesMode &&
			matchesPrice &&
			matchesDate
		);
	});

	return (
		<section id="events" className="py-20 bg-gray-50">
			<div className="container mx-auto px-4">
				{/* Header */}
				<div className="text-center max-w-3xl mx-auto mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
						Discover Events Across Africa
					</h2>
					<p className="text-xl text-gray-600">
						Find and join amazing events happening in your area and beyond
					</p>
				</div>

				{/* Categories */}
				{
					<div className="mb-4 border-b border-gray-100 pb-4">
						<div className="flex items-center mb-3">
							<Tag className="w-5 h-5 mr-2 text-orange-500" />
							<h3 className="text-sm font-semibold text-gray-800">
								Catégories
							</h3>
						</div>
						<div className="flex gap-2 overflow-x-auto">
							{categories.map((category) => (
								<button
									key={category}
									onClick={() => setSelectedCategory(category)}
									className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
										selectedCategory === category
											? "bg-orange-500 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									{categoryLabel[category] ?? category}
								</button>
							))}
						</div>
					</div>
				}

				{/* Quick Filters */}
				{
					<div className="mb-6 border-b border-gray-100 pb-4">
						<div className="flex flex-wrap gap-2">
							{quickFilters.map((q) => {
								const active = selectedQuick.has(q);
								return (
									<button
										key={q}
										onClick={() => toggleQuick(q)}
										className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
											active
												? "bg-gray-900 text-white shadow-sm"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										}`}
									>
										{quickFilterLabel[q as QuickFilter]}
									</button>
								);
							})}
							{(selectedQuick.size > 0 ||
								selectedCategory !== "All" ||
								place ||
								searchTerm) && (
								<button
									onClick={clearAll}
									className="ml-auto px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
								>
									Tout effacer
								</button>
							)}
						</div>
					</div>
				}

				{/* Search + Place */}
				<div className="mb-6">
					<div className="flex gap-4">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Rechercher des événements ou des organisateurs..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
							/>
						</div>
						<div className="relative">
							<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Lieu (ville ou pays)"
								value={place}
								onChange={(e) => setPlace(e.target.value)}
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
							/>
						</div>
					</div>
				</div>

				{/* Results Count */}
				{/* <div className="max-w-5xl mx-auto flex items-center justify-between mb-6 text-sm text-gray-600">
					<p>
						{filteredEvents.length} event
						{filteredEvents.length !== 1 ? "s" : ""} found
						{selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
					</p>
				</div> */}

				{/* Events Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
					{filteredEvents.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</div>

				{/* No Results */}
				{filteredEvents.length === 0 && (
					<div className="text-center py-12">
						<div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
							<Calendar className="w-12 h-12 text-gray-400" />
						</div>
						<h3 className="text-xl font-semibold text-gray-800 mb-2">
							No events found
						</h3>
						<p className="text-gray-600 mb-6">
							Try adjusting your search terms or filters to find more
							events.
						</p>
						<button
							onClick={() => {
								setSearchTerm("");
								setSelectedCategory("All");
							}}
							className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
						>
							Clear Filters
						</button>
					</div>
				)}

				{/* Load More Button */}
				{filteredEvents.length > 0 && (
					<div className="text-center mt-12">
						<button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
							Load More Events
						</button>
					</div>
				)}
			</div>
		</section>
	);
};

export default ListEvents;