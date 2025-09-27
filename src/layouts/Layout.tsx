import Navbar from "@/layouts/Navbar";
import Footer from "@/layouts/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			{children}
			<Footer />
		</div>
	);
}