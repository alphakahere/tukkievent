import Link from "next/link";
import EventDetail from "./DetailEvent";
import EventDetailScreen from "./EventDetailScreen";
import { mockEvents } from "@/lib/mockData";

type PageProps = { params: Promise<{ id: string }> };

export default async function EventDetailPage({ params }: PageProps) {
  const { id: slug } = await params;

  const mockEvent = mockEvents.find((e) => e.slug === slug);
  if (mockEvent) {
    return <EventDetailScreen event={mockEvent} />;
  }

  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (base) {
      const res = await fetch(`${base}/visitor/events/slug/${slug}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const event = await res.json();
        return <EventDetail event={event} />;
      }
    }
  } catch {
    // ignore
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">Événement non trouvé</p>
        <Link href="/" className="text-primary font-semibold">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
