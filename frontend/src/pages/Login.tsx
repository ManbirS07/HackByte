import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Building2, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 flex items-center justify-center">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold mb-4">Log In to Your Account</h1>
              <p className="text-lg text-gray-600">
                Access your Kindness Unite account to continue your journey
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
                <div className="inline-flex p-3 rounded-full bg-blue-50 mb-4">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Volunteer</h2>
                <p className="text-gray-600 mb-4">
                  Access your volunteer profile and manage your activities.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/login/volunteer">Volunteer Login</Link>
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
                <div className="inline-flex p-3 rounded-full bg-orange-50 mb-4">
                  <Building2 className="h-6 w-6 text-brand-orange" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Organization</h2>
                <p className="text-gray-600 mb-4">
                  Manage events and connect with volunteers through your organization account.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login/organization">Organization Login</Link>
                </Button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
                <div className="inline-flex p-3 rounded-full bg-gray-100 mb-4">
                  <Shield className="h-6 w-6 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Admin</h2>
                <p className="text-gray-600 mb-4">
                  Access the admin dashboard to manage the platform.
                </p>
                <Button variant="secondary" className="w-full text-white" asChild>
                  <Link to="/login/admin">Admin Login</Link>
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Don't have an account yet? <Link to="/register" className="text-brand-orange hover:underline">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
