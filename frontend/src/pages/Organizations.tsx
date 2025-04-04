
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OrganizationCard from '@/components/common/OrganizationCard';
import { Organization } from '@/types';

// Mock organizations data
const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Smile Foundation',
    description: 'Empowering children and youth through education and healthcare initiatives.',
    email: 'contact@smile.org',
    phone: '+91-9876543210',
    website: 'https://www.smilefoundationindia.org',
    address: {
      city: 'New Delhi',
      full_address: 'A-45, Mohan Cooperative, Mathura Road',
      pincode: '110044'
    },
    social_links: {
      facebook: 'https://facebook.com/smilefoundationindia',
      twitter: 'https://twitter.com/smilefoundation',
      instagram: 'https://instagram.com/smilefoundation',
      linkedin: 'https://linkedin.com/company/smilefoundation'
    },
    logo_url: 'https://example.com/logo/smile.png',
    verified: true
  },
  {
    id: '2',
    name: 'Green Earth Initiative',
    description: 'Working for environmental conservation and sustainable development.',
    email: 'info@greenearth.org',
    phone: '+91-9988776655',
    website: 'https://www.greenearthinitiative.org',
    address: {
      city: 'Mumbai',
      full_address: 'B-12, Andheri East',
      pincode: '400069'
    },
    social_links: {
      facebook: 'https://facebook.com/greenearthorg',
      instagram: 'https://instagram.com/greenearthorg',
    },
    logo_url: '',
    verified: true
  },
  {
    id: '3',
    name: 'Better Lives Foundation',
    description: 'Providing healthcare and education to underprivileged communities.',
    email: 'contact@betterlives.org',
    phone: '+91-8877665544',
    website: 'https://www.betterlivesorg.in',
    address: {
      city: 'Bangalore',
      full_address: 'C-78, Koramangala',
      pincode: '560034'
    },
    social_links: {
      twitter: 'https://twitter.com/betterlivesorg',
      instagram: 'https://instagram.com/betterlivesorg',
      linkedin: 'https://linkedin.com/company/betterlivesorg'
    },
    logo_url: 'https://example.com/logo/betterlives.png',
    verified: true
  },
  {
    id: '4',
    name: 'Teach For India',
    description: 'Working towards educational equity through a fellowship program that places leaders in low-income schools.',
    email: 'info@teachforindia.org',
    phone: '+91-9988776655',
    website: 'https://www.teachforindia.org',
    address: {
      city: 'Multiple Cities',
      full_address: 'National Office, Mumbai',
      pincode: '400001'
    },
    social_links: {
      facebook: 'https://facebook.com/teachforindia',
      twitter: 'https://twitter.com/teachforindia',
      instagram: 'https://instagram.com/teachforindia',
    },
    logo_url: '',
    verified: true
  },
  {
    id: '5',
    name: 'HelpAge India',
    description: 'Working for the welfare of elderly people and providing them with healthcare and social support.',
    email: 'contact@helpageindia.org',
    phone: '+91-9988776655',
    website: 'https://www.helpageindia.org',
    address: {
      city: 'New Delhi',
      full_address: 'C-14, Qutab Institutional Area',
      pincode: '110016'
    },
    social_links: {
      facebook: 'https://facebook.com/helpageindiasociety',
      twitter: 'https://twitter.com/helpageindia',
    },
    logo_url: 'https://example.com/logo/helpageindia.png',
    verified: true
  },
  {
    id: '6',
    name: 'Wildlife SOS',
    description: 'Conserving wildlife and protecting natural habitats across India.',
    email: 'info@wildlifesos.org',
    phone: '+91-9988776655',
    website: 'https://www.wildlifesos.org',
    address: {
      city: 'Agra',
      full_address: 'Elephant Conservation and Care Center',
      pincode: '282007'
    },
    social_links: {
      facebook: 'https://facebook.com/wildlifesos',
      instagram: 'https://instagram.com/wildlifesos',
      linkedin: 'https://linkedin.com/company/wildlifesos'
    },
    logo_url: '',
    verified: true
  },
];

const Organizations = () => {
  const [organizations, setOrganizations] = useState(mockOrganizations);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setOrganizations(mockOrganizations);
      return;
    }
    
    const filteredOrgs = mockOrganizations.filter(org => 
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
