"use client";
import React, { useState } from 'react';
import { Search, Calendar, MapPin, Tag } from "lucide-react";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEventCategoriesQuery, useGetEventsQuery } from "@/store/api/event/event.api";
import { Category, Event } from "@/store/api/event/event.type";

const ListEvents: React.FC = () => {
	const { data: events, isLoading } = useGetEventsQuery();
	const { data: categories, isLoading: categoriesLoading } = useGetEventCategoriesQuery();

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [place, setPlace] = useState("");

	return (
		<section id="events" className="py-20 bg-gray-50">
			<div className="container mx-auto px-4">
				{/* Header */}
				<div className="text-center max-w-3xl mx-auto mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
						Découvrir les événements en Afrique
					</h2>
					<p className="text-xl text-gray-600">
						Trouvez et rejoignez les événements incroyables qui se passent
						dans votre région et au-delà
					</p>
				</div>
				{
					<div className="mb-4 border-b border-gray-100 pb-4">
						<div className="flex items-center mb-3">
							<Tag className="w-5 h-5 mr-2 text-orange-500" />
							<h3 className="text-sm font-semibold text-gray-800">
								Catégories
							</h3>
						</div>
						<div className="flex gap-2 flex-wrap">
							{categoriesLoading
								? Array.from({ length: 5 }).map((_, index) => (
										<Skeleton
											key={index}
											className="h-8 w-20 rounded-full"
										/>
								  ))
								: categories?.map((category: Category) => (
										<button
											key={category.id}
											onClick={() =>
												setSelectedCategory(
													category.id
												)
											}
											className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
												selectedCategory ===
												category.id
													? "bg-orange-500 text-white"
													: "bg-gray-100 text-gray-700 hover:bg-gray-200"
											}`}
										>
											{category.name}
										</button>
								  ))}
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
				{/* Events Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
					{isLoading
						? Array.from({ length: 6 }).map((_, index) => (
								<EventCardSkeleton key={index} />
						  ))
						: events?.map((event: Event) => (
								<EventCard key={event.id} event={event} />
						  ))}
				</div>
				{/* No Results */}
				{events && events?.length === 0 && (
					<div className="text-center py-12">
						<div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
							<Calendar className="w-12 h-12 text-gray-400" />
						</div>
						<h3 className="text-xl font-semibold text-gray-800 mb-2">
							Aucun événement trouvé
						</h3>
						<p className="text-gray-600 mb-6">
							Essayez de modifier vos termes de recherche ou de filtres
							pour trouver plus d'événements.
						</p>
						<button
							onClick={() => {
								setSearchTerm("");
								setSelectedCategory("All");
							}}
							className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
						>
							Effacer les filtres
						</button>
					</div>
				)}{" "}
			</div>
		</section>
	);
};

export default ListEvents;