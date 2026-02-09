import { redirect } from "next/navigation";
import CheckoutEventScreen from "./CheckoutEventScreen";
import { mockEvents } from "@/lib/mockData";

type Props = { params: Promise<{ slug: string }> };

export default async function CheckoutEventPage({ params }: Props) {
  const { slug } = await params;
  const event = mockEvents.find((e) => e.slug === slug);
  if (!event) redirect("/");
  return <CheckoutEventScreen event={event} />;
}
