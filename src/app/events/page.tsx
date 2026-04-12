import Link from "next/link";
import ListEvents from "@/components/event/ListEvents";
import BottomNav from "@/components/BottomNav";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24 md:pb-8">
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-40 md:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            Tukki Event
          </Link>
          <span className="text-sm font-medium text-gray-500">Explorer</span>
        </div>
      </header>
      <ListEvents />
      <BottomNav />
    </div>
  );
}
