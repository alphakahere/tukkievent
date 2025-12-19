import CTA from "@/components/home/CTA";
import Footer from "@/layouts/Footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import ListEvents from "@/components/event/ListEvents";

export default function Home() {
	return (
		<div className="min-h-screen bg-white">
			<Header />
			<Hero />
			<ListEvents />
			<CTA />
			<Footer />
		</div>
	);
}
