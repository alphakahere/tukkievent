"use client";
import React, { useEffect, useState } from "react";
import { Search, Calendar, MapPin, Tag } from "lucide-react";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useListVisitorEventsQuery } from "@/store/api/event/event.api";
import { useListVisitorEventCategoriesQuery } from "@/store/api/event-categories/event-categories.api";
import { useListCitiesQuery } from "@/store/api/city/city.api";
import type { Category } from "@/store/api/event/event.type";

const ListEvents: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [place, setPlace] = useState("");
	const [debouncedPlace, setDebouncedPlace] = useState("");

	useEffect(() => {
		const handle = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
		return () => clearTimeout(handle);
	}, [searchTerm]);

	useEffect(() => {
		const handle = setTimeout(() => setDebouncedPlace(place.trim()), 300);
		return () => clearTimeout(handle);
	}, [place]);

	const { data, isLoading, isFetching, isError } = useListVisitorEventsQuery({
		...(debouncedSearch && { q: debouncedSearch }),
		...(debouncedPlace && { city: debouncedPlace }),
		...(selectedCategory && { categoryId: selectedCategory }),
		limit: 24,
	});

	const { data: categories, isLoading: categoriesLoading } =
		useListVisitorEventCategoriesQuery();
	const { data: cities } = useListCitiesQuery();

	const events = data?.data ?? [];
	const showSkeleton = isLoading || (isFetching && events.length === 0);

	return (
		<section id="events" className="py-8 sm:py-12 bg-[#F7F7F7]">
			<div className="max-w-lg md:max-w-6xl mx-auto px-4 sm:px-6">
				{/* Header */}
				<div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
					<p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
						Découvrir les événements au Sénégal
					</p>
					<p className="text-sm sm:text-base text-gray-500">
						Trouvez et rejoignez les événements incroyables qui se passent
						dans votre région et au-delà
					</p>
				</div>

				<div className="mb-4 sm:mb-6 border-b border-gray-100 pb-4">
					<div className="flex items-center mb-3">
						<Tag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
						<p className="text-sm sm:text-base font-semibold text-gray-900">
							Catégories
						</p>
					</div>
					<div className="flex gap-2 flex-wrap">
						{categoriesLoading
							? Array.from({ length: 5 }).map((_, index) => (
								<Skeleton
									key={index}
									className="h-7 sm:h-8 w-16 sm:w-20 rounded-full"
								/>
							))
							: (categories ?? []).map((category: Category) => (
								<button
									key={category.id}
									type="button"
									onClick={() =>
										setSelectedCategory(
											selectedCategory === category.id ? null : category.id
										)
									}
									className={`whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
										selectedCategory === category.id
											? "bg-primary text-white"
											: "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:bg-primary/5"
										}`}
								>
									{category.name}
								</button>
							))}
					</div>
				</div>

				{/* Search + Place */}
				<div className="mb-6">
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
							<input
								type="search"
								placeholder="Rechercher des événements..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-white text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
							/>
						</div>
						<div className="relative sm:w-64">
							<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
							<input
								type="text"
								placeholder="Lieu (ville)"
								value={place}
								list="cities-options"
								onChange={(e) => setPlace(e.target.value)}
								className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-white text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
							/>
							<datalist id="cities-options">
								{(cities ?? []).map((c) => (
									<option key={c} value={c} />
								))}
							</datalist>
						</div>
					</div>
				</div>

				{isError && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
						Une erreur est survenue lors du chargement des événements.
					</div>
				)}

				{/* Events Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6">
					{showSkeleton
						? Array.from({ length: 6 }).map((_, index) => (
								<EventCardSkeleton key={index} />
						  ))
						: events.map((event) => (
								<EventCard key={event.id} event={event} />
						  ))}
				</div>

				{/* No Results */}
				{!showSkeleton && events.length === 0 && !isError && (
					<div className="text-center py-12">
						<div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
							<Calendar className="w-12 h-12 text-gray-300" />
						</div>
						<p className="text-xl font-semibold text-gray-900 mb-2">
							Aucun événement trouvé
						</p>
						<p className="text-gray-500 mb-6">
							Essayez de modifier vos termes de recherche ou de filtres
							pour trouver plus d&apos;événements.
						</p>
						<button
							type="button"
							onClick={() => {
								setSearchTerm("");
								setPlace("");
								setSelectedCategory(null);
							}}
							className="px-6 py-3 bg-primary text-white rounded-full hover:opacity-90 transition-opacity font-semibold"
						>
							Effacer les filtres
						</button>
					</div>
				)}
			</div>
		</section>
	);
};

export default ListEvents;
