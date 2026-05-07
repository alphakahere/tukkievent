import CheckoutEventClient from "./CheckoutEventClient";

type Props = { params: Promise<{ slug: string }> };

export default async function CheckoutEventPage({ params }: Props) {
  const { slug } = await params;
  return <CheckoutEventClient slug={slug} />;
}
