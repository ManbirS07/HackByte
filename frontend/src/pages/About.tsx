import { ArrowRight, Users, Calendar, Building2, Award, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Voluntree</h1>
              <p className="text-lg md:text-xl text-gray-600">
                Connecting passionate volunteers with meaningful causes to create positive change in communities.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission & Vision Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="banner.jpg" 
                  alt="Volunteers working together" 
                  className="rounded-xl shadow-lg"
                />
              </div>
              <div>
                <div className="inline-flex items-center mb-2 px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-sm font-medium">
                  Our Purpose
                </div>
                <h2 className="text-3xl font-bold mb-6">Our Mission & Vision</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-brand-orange" /> Our Mission
                    </h3>
                    <p className="text-gray-600">
                      To create a seamless connection between willing volunteers and organizations making a difference, 
                      helping to amplify the impact of social causes through the power of community service.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-brand-teal" /> Our Vision
                    </h3>
                    <p className="text-gray-600">
                      A world where everyone can easily find meaningful volunteer opportunities that match their skills and interests,
                      allowing individuals to create positive change in their communities while building valuable experiences.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-brand-blue" /> Our Values
                    </h3>
                    <p className="text-gray-600">
                      We believe in transparency, accessibility, and the transformative power of volunteering. 
                      By connecting people with causes they care about, we aim to foster a sense of purpose and community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* What We Do Section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What We Do</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Voluntree is a comprehensive platform that brings together volunteers and organizations to make community service more accessible and impactful.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Connect Volunteers</h3>
                <p className="text-gray-600">
                  We help passionate individuals find opportunities that align with their skills, interests, and availability.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal mb-6">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Support Organizations</h3>
                <p className="text-gray-600">
                  We empower nonprofits and community organizations to easily find and manage dedicated volunteers for their initiatives.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue mb-6">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Facilitate Events</h3>
                <p className="text-gray-600">
                  We provide the tools to create, promote, and manage volunteer events that make a difference in communities.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Team Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're a dedicated group of individuals passionate about social impact and technology.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="mb-4 aspect-square overflow-hidden rounded-full border-4 border-white shadow-md mx-auto w-48 h-48">
                  <img 
                    src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" 
                    alt="govind Dwivedi" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Govind Dwived</h3>
                <p className="text-brand-orange font-medium">Founder & CEO</p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 aspect-square overflow-hidden rounded-full border-4 border-white shadow-md mx-auto w-48 h-48">
                  <img 
                    src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" 
                    alt="Manbir Singh" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Manbir Singh</h3>
                <p className="text-brand-orange font-medium">CTO</p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 aspect-square overflow-hidden rounded-full border-4 border-white shadow-md mx-auto w-48 h-48">
                  <img 
                    src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" 
                    alt="Arnav Keshari" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Arnav Kesari</h3>
                <p className="text-brand-orange font-medium">Community Director</p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 aspect-square overflow-hidden rounded-full border-4 border-white shadow-md mx-auto w-48 h-48">
                  <img 
                    src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" 
                    alt="Aman Raghuwanshi" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Aman Raghuwanshi</h3>
                <p className="text-brand-orange font-medium">Partnerships Lead</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Join Us CTA Section */}
        <section className="py-16 bg-brand-orange text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
              <p className="text-xl opacity-90 mb-8">
                Whether you're looking to volunteer or need volunteers for your cause, we're here to help you make a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-brand-orange hover:bg-gray-100" asChild>
                  <Link to="/register/volunteer">
                    Register as Volunteer <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10" asChild>
                  <Link to="/register/organization">
                    Register Organization
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
