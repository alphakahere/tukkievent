"use client";
import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Clock, Users, Tag } from 'lucide-react';
import Image from 'next/image';

type Event = {
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
};

const events: Event[] = [
  {
    id: '1',
    title: "AfroTech Conference 2025",
    image: "https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg",
    date: "Mar 15-17, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Kigali, Rwanda",
    category: "Technology",
    price: "$150",
    attendees: 500,
    organizer: "TechHub Rwanda"
  },
  {
    id: '2',
    title: "Lagos Fashion Week",
    image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
    date: "Apr 22-26, 2025",
    time: "10:00 AM - 9:00 PM",
    location: "Lagos, Nigeria",
    category: "Fashion",
    price: "$75",
    attendees: 1200,
    organizer: "Fashion Forward NG"
  },
  {
    id: '3',
    title: "Pan-African Film Festival",
    image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg",
    date: "May 5-12, 2025",
    time: "Various Times",
    location: "Cape Town, South Africa",
    category: "Arts",
    price: "$45",
    attendees: 800,
    organizer: "African Cinema Collective"
  },
  {
    id: '4',
    title: "Sahara Music Festival",
    image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
    date: "Jun 18-20, 2025",
    time: "4:00 PM - 2:00 AM",
    location: "Marrakech, Morocco",
    category: "Music",
    price: "$120",
    attendees: 2000,
    organizer: "Desert Sounds"
  },
  {
    id: '5',
    title: "East African Business Summit",
    image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
    date: "Jul 8-9, 2025",
    time: "8:30 AM - 6:00 PM",
    location: "Nairobi, Kenya",
    category: "Business",
    price: "$200",
    attendees: 300,
    organizer: "EA Business Network"
  },
  {
    id: '6',
    title: "Accra Food Festival",
    image: "https://images.pexels.com/photos/5920744/pexels-photo-5920744.jpeg",
    date: "Aug 22-23, 2025",
    time: "11:00 AM - 8:00 PM",
    location: "Accra, Ghana",
    category: "Food & Drink",
    price: "$30",
    attendees: 600,
    organizer: "Ghana Culinary Arts"
  },
  {
    id: '7',
    title: "Cairo Art Exhibition",
    image: "https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg",
    date: "Sep 10-15, 2025",
    time: "10:00 AM - 7:00 PM",
    location: "Cairo, Egypt",
    category: "Arts",
    price: "$25",
    attendees: 400,
    organizer: "Egyptian Arts Council"
  },
  {
    id: '8',
    title: "Johannesburg Startup Pitch",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    date: "Oct 5, 2025",
    time: "6:00 PM - 10:00 PM",
    location: "Johannesburg, South Africa",
    category: "Business",
    price: "Free",
    attendees: 150,
    organizer: "SA Startup Hub"
  }
];

const categories = ["All", "Technology", "Fashion", "Arts", "Music", "Business", "Food & Drink"];

type EventCardProps = {
  event: Event;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          width={500}
          height={500}
        />
        <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {event.category}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
          {event.price}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-orange-600 transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-orange-500" />
            <span className="text-sm">{event.date}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-orange-500" />
            <span className="text-sm">{event.time}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
            <span className="text-sm">{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2 text-orange-500" />
            <span className="text-sm">{event.attendees} attendees</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">by {event.organizer}</p>
        </div>
      </div>
    </div>
  );
};

const ListEvents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Discover Events Across Africa
          </h2>
          <p className="text-xl text-gray-600">
            Find and join amazing events happening in your area and beyond
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events, locations, or organizers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center md:justify-start"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-orange-500" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
            
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>Sort by Date</option>
              <option>Sort by Price</option>
              <option>Sort by Popularity</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find more events.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredEvents.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
              Load More Events
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ListEvents;