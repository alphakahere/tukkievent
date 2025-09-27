import EventDetail from "./DetailEvent";

type PageProps = {
	params: { id: string };
};

export default async function EventDetailPage({ params }: PageProps) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/visitor/events/slug/${params.id}`
	);
	const event = await res.json();

	return <EventDetail event={event} />;
}
