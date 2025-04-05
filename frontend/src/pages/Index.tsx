import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Building2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Event } from '@/types';
import EventCard from '@/components/common/EventCard';

// Mock data
const featuredEvents: Event[] = [
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
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-brand-orange to-brand-teal text-white">
          <div className="container py-16 md:py-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
                Connect, Volunteer, Make a Difference
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in">
                Join our platform to find volunteering opportunities that match your skills and interests. 
                Make a meaningful impact in your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
                <Button size="lg" asChild className="bg-white text-brand-orange hover:bg-gray-100">
                  <Link to="/register">
                    Sign Up as Volunteer
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" asChild variant="outline" className="border-white text-black hover:bg-white/10">
                  <Link to="/register/organization">
                    Register Organization
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="bg-white border-b">
          <div className="container py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <Users className="h-8 w-8 mx-auto text-brand-orange" />
                <p className="text-3xl md:text-4xl font-bold">500+</p>
                <p className="text-gray-600">Volunteers</p>
              </div>
              <div className="space-y-2">
                <Calendar className="h-8 w-8 mx-auto text-brand-orange" />
                <p className="text-3xl md:text-4xl font-bold">150+</p>
                <p className="text-gray-600">Events</p>
              </div>
              <div className="space-y-2">
                <Building2 className="h-8 w-8 mx-auto text-brand-orange" />
                <p className="text-3xl md:text-4xl font-bold">75+</p>
                <p className="text-gray-600">Organizations</p>
              </div>
              <div className="space-y-2">
                <Award className="h-8 w-8 mx-auto text-brand-orange" />
                <p className="text-3xl md:text-4xl font-bold">5,000+</p>
                <p className="text-gray-600">Volunteer Hours</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Events Section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Featured Opportunities</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover meaningful volunteering opportunities across various causes and locations.
                Start making a difference today.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button asChild size="lg">
                <Link to="/events">
                  View All Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform connects passionate volunteers with organizations making a difference.
                Here's how you can get started.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-brand-orange/10 text-brand-orange rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Register as a Volunteer</h3>
                <p className="text-gray-600">
                  Create your profile, upload your ID, record a video introduction, and highlight your skills and interests.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-brand-teal/10 text-brand-teal rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Find the Perfect Opportunity</h3>
                <p className="text-gray-600">
                  Search for events that match your interests, skills, location, and availability.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-brand-blue/10 text-brand-blue rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Make an Impact</h3>
                <p className="text-gray-600">
                  Volunteer at events, earn points, get badges, and build your reputation through reviews.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild>
                <Link to="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Organization CTA */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Are You an Organization Looking for Volunteers?</h2>
              <p className="text-gray-300 mb-8">
                Register your organization on our platform to connect with passionate volunteers,
                create events, and make a bigger impact in your community.
              </p>
              <Button asChild size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-gray-900">
                <Link to="/register-organization">
                  Register Your Organization
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
