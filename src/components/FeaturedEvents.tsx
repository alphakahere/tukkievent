import React from 'react';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import Image from 'next/image';

type EventCardProps = {
  title: string;
  image: string;
  date: string;
  location: string;
  category: string;
  time: string;
};

const events: EventCardProps[] = [
  {
    title: "AfroTech Conference 2025",
    image: "https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg",
    date: "Mar 15-17, 2025",
    location: "Kigali, Rwanda",
    category: "Technology",
    time: "9:00 AM - 5:00 PM"
  },
  {
    title: "Lagos Fashion Week",
    image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
    date: "Apr 22-26, 2025",
    location: "Lagos, Nigeria",
    category: "Fashion",
    time: "10:00 AM - 9:00 PM"
  },
  {
    title: "Pan-African Film Festival",
    image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg",
    date: "May 5-12, 2025",
    location: "Cape Town, South Africa",
    category: "Arts",
    time: "Various Times"
  },
  {
    title: "Sahara Music Festival",
    image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
    date: "Jun 18-20, 2025",
    location: "Marrakech, Morocco",
    category: "Music",
    time: "4:00 PM - 2:00 AM"
  },
  {
    title: "East African Business Summit",
    image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
    date: "Jul 8-9, 2025",
    location: "Nairobi, Kenya",
    category: "Business",
    time: "8:30 AM - 6:00 PM"
  },
  {
    title: "Accra Food Festival",
    image: "https://images.pexels.com/photos/5920744/pexels-photo-5920744.jpeg",
    date: "Aug 22-23, 2025",
    location: "Accra, Ghana",
    category: "Food & Drink",
    time: "11:00 AM - 8:00 PM"
  }
];

const EventCard: React.FC<EventCardProps> = ({ title, image, date, location, category, time }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <Image 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          width={500}
          height={500}
        />
        <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium z-20">
          {category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-orange-500" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-orange-500" />
            <span>{time}</span>
          </div>
        </div>
        
        <a 
          href="#" 
          className="flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors"
        >
          View Event Details
          <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
};

const FeaturedEvents: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Discover Amazing Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Explore upcoming events across Africa powered by TukkiEvent
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="px-6 py-3 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
            >
              View All Events
            </a>
            <a 
              href="#" 
              className="px-6 py-3 rounded-full border border-purple-600 text-purple-600 font-medium hover:bg-purple-50 transition-colors"
            >
              Create Yours
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;