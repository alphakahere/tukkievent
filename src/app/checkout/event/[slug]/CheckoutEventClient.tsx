"use client";

import Link from "next/link";
import { useGetVisitorEventBySlugQuery } from "@/store/api/event/event.api";
import CheckoutEventScreen from "./CheckoutEventScreen";
import { Skeleton } from "@/components/ui/skeleton";

type Props = { slug: string };

export default function CheckoutEventClient({ slug }: Props) {
  const { data: event, isLoading, isError } = useGetVisitorEventBySlugQuery(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] p-4 space-y-4 max-w-lg mx-auto pt-12">
        <Skeleton className="h-12 w-full rounded-full" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
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

  return <CheckoutEventScreen event={event} />;
}
