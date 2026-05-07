"use client";

import Link from "next/link";
import { useGetVisitorEventBySlugQuery } from "@/store/api/event/event.api";
import EventDetailScreen from "./EventDetailScreen";
import { Skeleton } from "@/components/ui/skeleton";

type Props = { slug: string };

export default function EventDetailClient({ slug }: Props) {
  const { data: event, isLoading, isError } = useGetVisitorEventBySlugQuery(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7]">
        <Skeleton className="h-80 w-full" />
        <div className="max-w-lg mx-auto px-4 -mt-5 relative z-10 pb-6 space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Événement non trouvé</p>
          <Link
            href="/"
            className="text-primary font-semibold hover:opacity-80 transition-opacity"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return <EventDetailScreen event={event} />;
}
