import Link from "next/link";
import ListEvents from "@/components/event/ListEvents";
import BottomNav from "@/components/BottomNav";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-muted pb-24 md:pb-8">
      <header className="bg-card px-4 py-4 shadow-sm sticky top-0 z-40 border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            Tukki Event
          </Link>
          <span className="text-sm text-muted-foreground">Explorer</span>
        </div>
      </header>
      <ListEvents />
      <BottomNav />
    </div>
  );
}
