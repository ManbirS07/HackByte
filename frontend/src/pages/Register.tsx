
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VolunteerRegisterForm from '@/components/volunteer/VolunteerRegisterForm';
import OrganizationRegisterForm from '@/components/organization/OrganizationRegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Join Kindness Unite</h1>
              <p className="text-gray-600">
                Create an account to start your journey as a volunteer or an organization.
              </p>
            </div>
            
            <Tabs defaultValue="volunteer" className="space-y-8">
              <div className="flex justify-center">
                <TabsList>
                  <TabsTrigger value="volunteer">I'm a Volunteer</TabsTrigger>
                  <TabsTrigger value="organization">I'm an Organization</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="volunteer">
                <VolunteerRegisterForm />
              </TabsContent>
              
              <TabsContent value="organization">
                <OrganizationRegisterForm />
              </TabsContent>
            </Tabs>
            
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
