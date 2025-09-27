import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ListEvents from "@/components/ListEvents";

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
