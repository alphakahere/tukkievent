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
		<section id="events" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header - Responsive */}
				<div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
						Découvrir les événements en Afrique
					</h2>
					<p className="text-base sm:text-lg lg:text-xl text-gray-600">
						Trouvez et rejoignez les événements incroyables qui se passent
						dans votre région et au-delà
					</p>
				</div>
				{
					<div className="mb-4 sm:mb-6 border-b border-gray-100 pb-4">
						<div className="flex items-center mb-3">
							<Tag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500" />
							<h3 className="text-sm sm:text-base font-semibold text-gray-800">
								Catégories
							</h3>
						</div>
						<div className="flex gap-2 flex-wrap">
							{categoriesLoading
								? Array.from({ length: 5 }).map((_, index) => (
										<Skeleton
											key={index}
											className="h-7 sm:h-8 w-16 sm:w-20 rounded-full"
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
											className={`whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
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
				{/* Search + Place - Responsive */}
				<div className="mb-6">
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
							<input
								type="text"
								placeholder="Rechercher des événements..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-sm sm:text-base"
							/>
						</div>
						<div className="relative sm:w-64">
							<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
							<input
								type="text"
								placeholder="Lieu (ville ou pays)"
								value={place}
								onChange={(e) => setPlace(e.target.value)}
								className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-sm sm:text-base"
							/>
						</div>
					</div>
				</div>
				{/* Events Grid - Responsive */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-4 sm:pt-6">
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