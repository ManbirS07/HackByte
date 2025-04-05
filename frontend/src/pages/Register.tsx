import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Building2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 flex items-center justify-center">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold mb-4">Join Kindness Unite</h1>
              <p className="text-lg text-gray-600">
                Create an account to start your journey of making a difference.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
                <div className="inline-flex p-4 rounded-full bg-blue-50 mb-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">I'm a Volunteer</h2>
                <p className="text-gray-600 mb-6">
                  Sign up to discover volunteer opportunities and make a positive impact in your community.
                </p>
                <Button size="lg" className="w-full" asChild>
                  <Link to="/register/volunteer">Register as Volunteer</Link>
                </Button>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
                <div className="inline-flex p-4 rounded-full bg-orange-50 mb-4">
                  <Building2 className="h-8 w-8 text-brand-orange" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">I'm an Organization</h2>
                <p className="text-gray-600 mb-6">
                  Create your organization's profile to post events and connect with passionate volunteers.
                </p>
                <Button size="lg" variant="outline" className="w-full" asChild>
                  <Link to="/register/organization">Register as Organization</Link>
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Already have an account? <Link to="/login" className="text-brand-orange hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
