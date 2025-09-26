export type Event = {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: string;
  attendees: number;
  organizer: string;
  startDate: string; // ISO: YYYY-MM-DD
  endDate: string; // ISO: YYYY-MM-DD
  mode: "online" | "in-person";
};

export const events: Event[] = [
  {
    id: "1",
    title: "AfroTech Conference 2025",
    image: "https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg",
    date: "Mar 15-17, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Kigali, Rwanda",
    category: "Technology",
    price: "$150",
    attendees: 500,
    organizer: "TechHub Rwanda",
    startDate: "2025-03-15",
    endDate: "2025-03-17",
    mode: "in-person",
  },
  {
    id: "2",
    title: "Lagos Fashion Week",
    image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
    date: "Apr 22-26, 2025",
    time: "10:00 AM - 9:00 PM",
    location: "Lagos, Nigeria",
    category: "Fashion",
    price: "$75",
    attendees: 1200,
    organizer: "Fashion Forward NG",
    startDate: "2025-04-22",
    endDate: "2025-04-26",
    mode: "in-person",
  },
  {
    id: "3",
    title: "Pan-African Film Festival",
    image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg",
    date: "May 5-12, 2025",
    time: "Various Times",
    location: "Cape Town, South Africa",
    category: "Arts",
    price: "$45",
    attendees: 800,
    organizer: "African Cinema Collective",
    startDate: "2025-05-05",
    endDate: "2025-05-12",
    mode: "in-person",
  },
  {
    id: "4",
    title: "Sahara Music Festival",
    image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
    date: "Jun 18-20, 2025",
    time: "4:00 PM - 2:00 AM",
    location: "Marrakech, Morocco",
    category: "Music",
    price: "$120",
    attendees: 2000,
    organizer: "Desert Sounds",
    startDate: "2025-06-18",
    endDate: "2025-06-20",
    mode: "in-person",
  },
  {
    id: "5",
    title: "East African Business Summit",
    image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
    date: "Jul 8-9, 2025",
    time: "8:30 AM - 6:00 PM",
    location: "Nairobi, Kenya",
    category: "Business",
    price: "$200",
    attendees: 300,
    organizer: "EA Business Network",
    startDate: "2025-07-08",
    endDate: "2025-07-09",
    mode: "in-person",
  },
  {
    id: "6",
    title: "Accra Food Festival",
    image: "https://images.pexels.com/photos/5920744/pexels-photo-5920744.jpeg",
    date: "Aug 22-23, 2025",
    time: "11:00 AM - 8:00 PM",
    location: "Accra, Ghana",
    category: "Food & Drink",
    price: "$30",
    attendees: 600,
    organizer: "Ghana Culinary Arts",
    startDate: "2025-08-22",
    endDate: "2025-08-23",
    mode: "in-person",
  },
  {
    id: "7",
    title: "Cairo Art Exhibition",
    image: "https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg",
    date: "Sep 10-15, 2025",
    time: "10:00 AM - 7:00 PM",
    location: "Cairo, Egypt",
    category: "Arts",
    price: "$25",
    attendees: 400,
    organizer: "Egyptian Arts Council",
    startDate: "2025-09-10",
    endDate: "2025-09-15",
    mode: "in-person",
  },
  {
    id: "8",
    title: "Johannesburg Startup Pitch",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    date: "Oct 5, 2025",
    time: "6:00 PM - 10:00 PM",
    location: "Johannesburg, South Africa",
    category: "Business",
    price: "Free",
    attendees: 150,
    organizer: "SA Startup Hub",
    startDate: "2025-10-05",
    endDate: "2025-10-05",
    mode: "online",
  },
];

export function getEventById(id: string): Event | undefined {
  return events.find((e) => e.id === id);
}

export function getSimilarEvents(category: string, excludeId?: string, limit = 3): Event[] {
  const inCategory = events.filter((e) => e.category === category && e.id !== excludeId);
  const others = events.filter((e) => e.category !== category && e.id !== excludeId);
  const combined = [...inCategory, ...others];
  return combined.slice(0, limit);
}


