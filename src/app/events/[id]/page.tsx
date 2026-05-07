import EventDetailClient from "./EventDetailClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function EventDetailPage({ params }: PageProps) {
  const { id: slug } = await params;
  return <EventDetailClient slug={slug} />;
}
