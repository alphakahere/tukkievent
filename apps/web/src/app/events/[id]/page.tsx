import EventDetail from "./DetailEvent";

type PageProps = {
	params: { id: string };
};

export default async function EventDetailPage({ params }: PageProps) {
	const { id } = await params;
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visitor/events/slug/${id}`);
	const event = await res.json();

	return <EventDetail event={event} />;
}
