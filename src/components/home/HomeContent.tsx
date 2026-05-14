"use client";

import { useEffect, useMemo, useState } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Drama,
	Mic,
	Moon,
	Music,
	Search,
	Sparkles,
	Tag,
	Trophy,
	X,
	type LucideIcon,
} from "lucide-react";
import Header from "./Header";
import Hero from "./Hero";
import EventCard from "@/components/event/EventCard";
import EventCardSkeleton from "@/components/event/EventCardSkeleton";
import BottomNav from "@/components/BottomNav";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useListVisitorEventsQuery,
	type VisitorEventSort,
} from "@/store/api/event/event.api";
import { useListVisitorEventCategoriesQuery } from "@/store/api/event-categories/event-categories.api";

// Maps the `icon` field stored on EventCategory (seeded by the API) to a
// lucide-react component. Falls back to a generic tag when the API ships an
// icon name we don't yet render.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
	music: Music,
	sparkles: Sparkles,
	mic: Mic,
	trophy: Trophy,
	masks: Drama,
	moon: Moon,
};

function getCategoryIcon(icon?: string | null): LucideIcon {
	if (!icon) return Tag;
	return CATEGORY_ICONS[icon] ?? Tag;
}

const SORT_OPTIONS: { value: VisitorEventSort; label: string }[] = [
	{ value: "starting_soon", label: "À venir" },
	{ value: "popular", label: "Populaires" },
	{ value: "recent", label: "Plus récents" },
];

const PAGE_SIZE = 12;

function useDebounced<T>(value: T, delay = 300): T {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const t = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(t);
	}, [value, delay]);
	return debounced;
}

export default function HomeContent() {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [sort, setSort] = useState<VisitorEventSort>("starting_soon");
	const [page, setPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedQuery = useDebounced(searchQuery.trim(), 300);

	// Reset to page 1 whenever the filter narrows the result set.
	useEffect(() => {
		setPage(1);
	}, [selectedCategory, sort, debouncedQuery]);

	// Featured events power the hero independently of the filtered grid.
	const featuredQuery = useListVisitorEventsQuery({
		isFeatured: true,
		limit: 6,
	});

	// "À venir" should only show future events; the other sorts let the API
	// surface its full catalog. Pinned on mount so the query key stays stable
	// across renders — otherwise RTK Query re-keys on every render and the
	// skeleton never resolves.
	const nowIso = useMemo(() => new Date().toISOString(), []);
	const eventsQuery = useListVisitorEventsQuery({
		sort,
		page,
		limit: PAGE_SIZE,
		...(debouncedQuery && { q: debouncedQuery }),
		...(selectedCategory ? { categoryId: selectedCategory } : {}),
		...(sort === "starting_soon" ? { startDateFrom: nowIso } : {}),
	});

	const featuredEvents = featuredQuery.data?.data ?? [];
	const events = eventsQuery.data?.data ?? [];
	const meta = eventsQuery.data?.meta;
	const totalPages = meta?.totalPages ?? 1;

	const heroEvents = featuredEvents.length > 0 ? featuredEvents : events;
	const { data: categories, isLoading: categoriesLoading } =
		useListVisitorEventCategoriesQuery();

	return (
		<div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
			<Header />

			<div className="max-w-lg md:max-w-6xl mx-auto">
				{heroEvents.length > 0 ? (
					<Hero events={heroEvents} />
				) : featuredQuery.isLoading || eventsQuery.isLoading ? (
					<section className="px-4 py-6">
						<Skeleton className="h-48 md:h-80 w-full rounded-2xl" />
					</section>
				) : null}

				{/* Search */}
				<section className="px-4 pt-4 pb-2">
					<div className="relative">
						<Search
							size={18}
							className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
						/>
						<input
							type="search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Rechercher un événement, un artiste, un lieu..."
							className="w-full h-12 pl-11 pr-10 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
							aria-label="Rechercher"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								aria-label="Effacer la recherche"
								className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
							>
								<X size={14} className="text-gray-500" />
							</button>
						)}
					</div>
				</section>

				{/* Categories */}
				<section className="px-4 py-4">
					<p className="font-bold text-xl mb-4 text-gray-900">Par catégorie</p>
					<div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
						{categoriesLoading
							? Array.from({ length: 5 }).map((_, i) => (
									<Skeleton
										key={i}
										className="h-10 w-24 rounded-full flex-shrink-0"
									/>
								))
							: (categories ?? []).map((category) => {
									const active = selectedCategory === category.id;
									const Icon = getCategoryIcon(category.icon);
									return (
										<button
											key={category.id}
											type="button"
											onClick={() =>
												setSelectedCategory(active ? null : category.id)
											}
											className={`inline-flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
												active
													? "bg-primary text-white border-primary"
													: "bg-white border-gray-200 text-gray-600 hover:border-primary hover:bg-primary/5"
											}`}
										>
											<Icon
												size={16}
												style={
													active || !category.color
														? undefined
														: { color: category.color }
												}
											/>
											<span className="text-sm font-medium">
												{category.name}
											</span>
										</button>
									);
								})}
					</div>
				</section>

				{/* Events grid */}
				<section className="px-4 py-4 mb-4">
					<div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
						<p className="font-bold text-xl text-gray-900">
							Tous les événements
						</p>
						<div className="inline-flex items-center gap-1 p-1 rounded-full bg-white border border-gray-200">
							{SORT_OPTIONS.map((opt) => {
								const active = sort === opt.value;
								return (
									<button
										key={opt.value}
										type="button"
										onClick={() => setSort(opt.value)}
										className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
											active
												? "bg-primary text-white"
												: "text-gray-600 hover:text-gray-900"
										}`}
									>
										{opt.label}
									</button>
								);
							})}
						</div>
					</div>

					{eventsQuery.isLoading ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<EventCardSkeleton key={i} />
							))}
						</div>
					) : events.length === 0 ? (
						<div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
							<p className="text-sm text-gray-500">
								{debouncedQuery
									? `Aucun événement trouvé pour « ${debouncedQuery} ».`
									: "Aucun événement ne correspond à ces filtres."}
							</p>
						</div>
					) : (
						<div
							className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
								eventsQuery.isFetching ? "opacity-60 transition-opacity" : ""
							}`}
						>
							{events.map((event) => (
								<EventCard key={event.id} event={event} />
							))}
						</div>
					)}

					{/* Pagination */}
					{meta && totalPages > 1 && (
						<div className="flex items-center justify-between gap-3 mt-6">
							<p className="text-xs text-gray-500">
								Page {meta.page} sur {totalPages} · {meta.total} événement
								{meta.total > 1 ? "s" : ""}
							</p>
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									disabled={page <= 1 || eventsQuery.isFetching}
									aria-label="Page précédente"
									className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
								>
									<ChevronLeft size={16} />
								</button>
								<button
									type="button"
									onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
									disabled={page >= totalPages || eventsQuery.isFetching}
									aria-label="Page suivante"
									className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
								>
									<ChevronRight size={16} />
								</button>
							</div>
						</div>
					)}
				</section>
			</div>

			<BottomNav />
		</div>
	);
}
