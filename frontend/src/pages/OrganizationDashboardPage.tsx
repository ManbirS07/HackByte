import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OrganizationDashboard from '@/components/organization/OrganizationDashboard';
import { useToast } from '@/hooks/use-toast';

const OrganizationDashboardPage = () => {
  const [organizationId, setOrganizationId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // In a real implementation, this would come from authentication context
    // For now, we'll get it from localStorage
    const storedOrgData = localStorage.getItem('organizationData');
    
    if (storedOrgData) {
      try {
        const orgData = JSON.parse(storedOrgData);
        if (orgData && orgData.id) {
          setOrganizationId(orgData.id);
        } else {
          toast({
            title: 'Authentication Error',
            description: 'Organization ID not found. Please log in again.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error parsing organization data:', error);
        toast({
          title: 'Authentication Error',
          description: 'Invalid organization data. Please log in again.',
          variant: 'destructive',
        });
      }
    } else {
      // For demonstration purposes, we'll use a mock ID
      // In production, redirect to login
      setOrganizationId('64f5e85a9b12345678901234'); // Mock ID
      toast({
        title: 'Demo Mode',
        description: 'Using mock organization data. In production, please log in.',
      });
    }
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {organizationId ? (
        <OrganizationDashboard organizationId={organizationId} />
      ) : (
        <div className="container py-16 text-center">
          <p>Please log in to view your organization dashboard.</p>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default OrganizationDashboardPage;
