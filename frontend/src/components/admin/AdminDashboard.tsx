import { useState } from 'react';
import { Eye, CheckCircle, XCircle, User, Users, Calendar, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Organization } from '@/types';

// Mock data
const mockOrganizations: Partial<Organization>[] = [
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
    verified: false
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
    verified: false
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
    verified: true
  }
];

const AdminDashboard = () => {
  const [organizations, setOrganizations] = useState(mockOrganizations);

  const handleVerify = (orgId: string) => {
    setOrganizations(orgs => 
      orgs.map(org => 
        org.id === orgId ? { ...org, verified: true } : org
      )
    );
  };

  const handleReject = (orgId: string) => {
    setOrganizations(orgs => orgs.filter(org => org.id !== orgId));
  };

  const pendingOrgs = organizations.filter(org => !org.verified);
  const verifiedOrgs = organizations.filter(org => org.verified);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage organizations, events, and volunteers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingOrgs.length} pending verification
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              Across 12 cities
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteer Hours</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">
              Total volunteering hours contributed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="pending">
            Pending Verifications 
            {pendingOrgs.length > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingOrgs.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="verified">Verified Organizations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h2 className="text-xl font-semibold">Organizations Pending Verification</h2>
              <p className="text-muted-foreground text-sm">
                Review and verify these organizations that have recently registered
              </p>
            </div>
            
            {pendingOrgs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No organizations pending verification.
              </div>
            ) : (
              <div className="divide-y">
                {pendingOrgs.map(org => (
                  <div key={org.id} className="p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{org.name}</h3>
                      <p className="text-sm text-muted-foreground">{org.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium">Email:</span> {org.email}</div>
                        <div><span className="font-medium">Phone:</span> {org.phone}</div>
                        <div><span className="font-medium">Website:</span> {org.website}</div>
                        <div><span className="font-medium">Location:</span> {org.address?.city}</div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleReject(org.id!)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => handleVerify(org.id!)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="verified" className="space-y-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h2 className="text-xl font-semibold">Verified Organizations</h2>
              <p className="text-muted-foreground text-sm">
                Organizations that have been verified and are active on the platform
              </p>
            </div>
            
            <div className="divide-y">
              {verifiedOrgs.map(org => (
                <div key={org.id} className="p-6 flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{org.name}</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{org.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">Email:</span> {org.email}</div>
                      <div><span className="font-medium">Phone:</span> {org.phone}</div>
                      <div><span className="font-medium">Website:</span> {org.website}</div>
                      <div><span className="font-medium">Location:</span> {org.address?.city}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
