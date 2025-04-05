import React, { useEffect, useState } from "react";
import { fetchOrganizations } from "../../api";
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OrganizationCard from '@/components/common/OrganizationCard';
import { Organization } from '@/types';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  
  useEffect(() => {
    fetchOrganizations()
      .then((data) => {
        // adjust based on your backend response shape
        setOrganizations(data.organizations || data);
      })
      .catch((error) => {
        console.error("Failed to fetch organizations:", error);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      fetchOrganizations()
        .then((data) => {
          setOrganizations(data.organizations || data);
        })
        .catch((error) => {
          console.error("Failed to fetch organizations:", error);
        });
      return;
    }
    
    const filteredOrgs = organizations.filter(org => 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.address.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setOrganizations(filteredOrgs);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Verified Organizations</h1>
            <p className="text-gray-600">
              Browse through our verified partner organizations working across various causes.
            </p>
            
            <form onSubmit={handleSearch} className="mt-6 flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search organizations by name, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>
          
          {organizations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map(org => (
                <OrganizationCard key={org.id} organization={org} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold">No organizations found</h3>
              <p className="text-gray-600 mt-2">
                Try adjusting your search query to find more organizations.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Organizations;