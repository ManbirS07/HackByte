import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/common/EventCard';
import EventSearch from '@/components/events/EventSearch';
import { Event, SearchFilters } from '@/types';

// Mock events data for fallback
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Beach Cleanup Drive',
    description: 'Join us for a day of cleaning and preserving our beautiful coastline. Every piece of trash collected makes a difference!',
    cause: 'Environment',
    location: {
      city: 'Mumbai',
      address: 'Juhu Beach',
      pincode: '400049',
    },
    date: new Date(2025, 4, 20),
    time: '09:00 AM',
    duration: '3 hours',
    skills_required: ['Physical Fitness', 'Environmental Knowledge'],
    volunteers_limit: 25,
    volunteers_registered: ['1', '2', '3'],
    organizer: {
      id: '101',
      name: 'Clean Earth Initiative',
      contact_email: 'contact@cleanearth.org',
      phone: '+91-9876543210',
    },
  },
  {
    id: '2',
    title: 'Teach Computer Skills',
    description: 'Help seniors learn essential computer skills that will help them stay connected in the digital age. No advanced technical knowledge required!',
    cause: 'Education',
    location: {
      city: 'Delhi',
      address: 'Community Center, Rajouri Garden',
      pincode: '110027',
    },
    date: new Date(2025, 4, 25),
    time: '11:00 AM',
    duration: '2 hours',
    skills_required: ['Computer Skills', 'Patience', 'Hindi'],
    volunteers_limit: 5,
    volunteers_registered: ['4'],
    organizer: {
      id: '102',
      name: 'Digital Seva Club',
      contact_email: 'contact@digitalseva.org',
      phone: '+91-8899776655',
    },
  },
  {
    id: '3',
    title: 'Food Distribution Drive',
    description: 'Help distribute food packages to homeless individuals. We aim to provide nutritious meals to those in need.',
    cause: 'Poverty Alleviation',
    location: {
      city: 'Bangalore',
      address: 'MG Road',
      pincode: '560001',
    },
    date: new Date(2025, 5, 5),
    time: '10:00 AM',
    duration: '4 hours',
    skills_required: ['Physical Fitness', 'Communication'],
    volunteers_limit: 15,
    volunteers_registered: [],
    organizer: {
      id: '103',
      name: 'Food For All Foundation',
      contact_email: 'contact@foodforall.org',
      phone: '+91-7788990011',
    },
  },
  {
    id: '4',
    title: 'Medical Camp Assistant',
    description: 'Help medical professionals in organizing a free health camp for underserved communities.',
    cause: 'Health',
    location: {
      city: 'Chennai',
      address: 'Government School, T.Nagar',
      pincode: '600017',
    },
    date: new Date(2025, 5, 12),
    time: '08:00 AM',
    duration: 'Full day',
    skills_required: ['Medical Knowledge', 'Communication', 'Tamil'],
    volunteers_limit: 10,
    volunteers_registered: ['5', '6'],
    organizer: {
      id: '104',
      name: 'HealthCare For All',
      contact_email: 'info@healthcareforall.org',
      phone: '+91-8877665544',
    },
  },
  {
    id: '5',
    title: 'Tree Planting Event',
    description: 'Join us in our mission to make the city greener by planting trees in various localities.',
    cause: 'Environment',
    location: {
      city: 'Pune',
      address: 'Koregaon Park',
      pincode: '411001',
    },
    date: new Date(2025, 6, 1),
    time: '07:30 AM',
    duration: '5 hours',
    skills_required: ['Gardening', 'Physical Fitness'],
    volunteers_limit: 30,
    volunteers_registered: ['7', '8', '9', '10'],
    organizer: {
      id: '105',
      name: 'Green Pune Initiative',
      contact_email: 'contact@greenpune.org',
      phone: '+91-9988776655',
    },
  },
  {
    id: '6',
    title: 'Teach Mathematics to Children',
    description: 'Volunteers needed to teach basic mathematics to underprivileged children. Make learning fun!',
    cause: 'Education',
    location: {
      city: 'Delhi',
      address: 'NGO Office, Vasant Kunj',
      pincode: '110070',
    },
    date: new Date(2025, 5, 18),
    time: '04:00 PM',
    duration: '2 hours',
    skills_required: ['Teaching', 'Mathematics', 'Patience'],
    volunteers_limit: 8,
    volunteers_registered: [],
    organizer: {
      id: '106',
      name: 'Education For All',
      contact_email: 'contact@educationforall.org',
      phone: '+91-9911223344',
    },
  },
];

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);
  
  // Fetch events from API
  const fetchEvents = async (filters: SearchFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching events with filters:", JSON.stringify(filters));
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.causes && filters.causes.length > 0) {
        // Clear any previous causes
        filters.causes.forEach(cause => {
          params.append('causes', cause);
        });
        console.log("Added cause filters:", filters.causes);
      }
      
      if (filters.skills && filters.skills.length > 0) {
        // Clear any previous skills
        filters.skills.forEach(skill => {
          params.append('skills', skill);
        });
        console.log("Added skill filters:", filters.skills);
      }
      
      if (filters.location && filters.location.trim() !== '') {
        params.append('location', filters.location.trim());
        console.log("Added location filter:", filters.location);
      }
      
      if (filters.date) {
        const dateString = typeof filters.date === 'string' 
          ? filters.date 
          : filters.date.toISOString();
        params.append('date', dateString);
        console.log("Added date filter:", dateString);
      }
      
      const queryString = params.toString();
      console.log("Final query string:", queryString);
      
      // Make API request
      const url = `http://localhost:5000/api/events${queryString ? '?' + queryString : ''}`;
      console.log("Making request to:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (!data.events || !Array.isArray(data.events)) {
        console.error("Invalid response format:", data);
        throw new Error('Invalid response format: events array missing');
      }
      
      // Transform API data to match our Event type
      const formattedEvents: Event[] = data.events.map((event: any) => ({
        id: event._id || '',
        title: event.title || '',
        description: event.description || '',
        cause: event.cause || '',
        location: event.location || { city: '', address: '', pincode: '' },
        date: event.date ? new Date(event.date) : new Date(),
        time: event.time || '',
        duration: event.duration || '',
        skills_required: event.skills_required || [],
        volunteers_limit: event.volunteers_limit || 0,
        volunteers_registered: event.acceptedVolunteers || [],
        organizer: {
          id: event.organizer?._id || '',
          name: event.organizer?.name || '',
          contact_email: event.organizer?.contact_email || '',
          phone: event.organizer?.phone || ''
        },
        image_url: event.image_url || ''
      }));
      
      console.log("Formatted events:", formattedEvents.length);
      setEvents(formattedEvents);
      
      if (formattedEvents.length === 0) {
        console.log("No events found matching the criteria");
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Using mock data instead.');
      setEvents(mockEvents); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (filters: SearchFilters) => {
    setFilters(filters);
    fetchEvents(filters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Find Volunteer Opportunities</h1>
            <p className="text-gray-600">
              Search for events that match your skills, interests, and availability.
            </p>
            
            <div className="mt-6">
              <EventSearch onSearch={handleSearch} />
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <p className="text-xl font-medium">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500">
              <p>{error}</p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold">No events found</h3>
              <p className="text-gray-600 mt-2">
                Try adjusting your search filters to find more events.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
