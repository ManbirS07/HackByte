import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  CheckCircle, 
  Calendar, 
  ArrowLeft,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Organization, Event } from '@/types';
import EventCard from '@/components/common/EventCard';

const OrganizationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrganization = async () => {
      setLoading(true);
      try {
        // Debug: log the ID being used
        console.log("Fetching organization with ID:", id);
        
        // Validate ID before making API request
        if (!id || id === 'undefined') {
          throw new Error('Invalid organization ID');
        }
        
        const response = await fetch(`http://localhost:5000/api/organizations/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch organization details');
        }
        
        const data = await response.json();
        
        if (!data.organization) {
          throw new Error('Organization not found');
        }
        
        console.log("Organization data received:", data.organization);
        
        // Transform API data to match our Organization type
        const organizationData: Organization = {
          id: data.organization._id,
          name: data.organization.name,
          description: data.organization.description || '',
          email: data.organization.email,
          phone: data.organization.phone || '',
          website: data.organization.website || '',
          address: {
            city: data.organization.address?.city || '',
            full_address: data.organization.address?.full_address || '',
            pincode: data.organization.address?.pincode || ''
          },
          social_links: {
            facebook: data.organization.social_links?.facebook || '',
            twitter: data.organization.social_links?.twitter || '',
            instagram: data.organization.social_links?.instagram || '',
            linkedin: data.organization.social_links?.linkedin || ''
          },
          logo_url: data.organization.logo_url || `https://source.unsplash.com/400x400/?ngo,organization`,
          verified: data.organization.verified || false,
          createdAt: data.organization.createdAt ? new Date(data.organization.createdAt) : undefined
        };
        
        setOrganization(organizationData);
        
        // Fetch organization's events
        fetchOrganizationEvents(data.organization._id);
      } catch (err) {
        console.error('Error fetching organization:', err);
        setError(err instanceof Error ? err.message : 'Failed to load organization details.');
        setLoading(false);
      }
    };
    
    const fetchOrganizationEvents = async (orgId: string) => {
      try {
        // Updated API endpoint with proper organizer ID filter
        const response = await fetch(`http://localhost:5000/api/events?organizer=${orgId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch organization events');
        }
        
        const data = await response.json();
        
        if (!data.events || !Array.isArray(data.events)) {
          console.error('Invalid events data format:', data);
          setEvents([]);
          return;
        }
        
        console.log("Events received:", data.events.length);
        
        // Transform API data to match our Event type
        // Filter events to ensure they belong to the current organization
        const eventsData: Event[] = data.events
          .filter((event: any) => {
            const organizerId = event.organizer?.id || event.organizer?._id;
            return organizerId === orgId;
          })
          .map((event: any) => ({
            id: event._id,
            title: event.title,
            description: event.description,
            cause: event.cause,
            location: event.location || { city: '', address: '', pincode: '' },
            date: new Date(event.date),
            time: event.time,
            duration: event.duration,
            skills_required: event.skills_required || [],
            volunteers_limit: event.volunteers_limit || 0,
            volunteers_registered: event.acceptedVolunteers || [],
            organizer: {
              id: event.organizer?._id || event.organizer?.id || '',
              name: event.organizer?.name || '',
              contact_email: event.organizer?.contact_email || event.organizer?.email || '',
              phone: event.organizer?.phone || ''
            },
            image_url: event.image_url || `https://source.unsplash.com/800x400/?volunteer,${event.cause?.toLowerCase()}`
          }));
        
        console.log(`Found ${eventsData.length} events for organization ${orgId}`);
        setEvents(eventsData);
      } catch (err) {
        console.error('Error fetching organization events:', err);
        // We don't fail the whole page if events fail to load
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchOrganization();
    } else {
      setError('No organization ID provided');
      setLoading(false);
    }
  }, [id]);
  
  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container py-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-medium">Loading organization details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Handle error state
  if (error || !organization) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container py-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Organization Not Found</h2>
            <p className="text-gray-600 mb-8">{error || "The organization you're looking for doesn't exist."}</p>
            <Button onClick={() => navigate('/organizations')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Organizations
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container max-w-5xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/organizations')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Organizations
          </Button>
          
          {/* Organization Header */}
          <div className="rounded-lg overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border shadow-sm">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 z-0"></div>
              <div className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="w-36 h-36 flex-shrink-0 rounded-xl overflow-hidden border-4 border-white shadow-md bg-white">
                  {organization.logo_url && !organization.logo_url.includes('unsplash') ? (
                    // Use actual logo if available and not from unsplash
                    <img 
                      src={organization.logo_url}
                      alt={organization.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // If image fails to load, replace with UI Avatar
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(organization.name)}&background=0D8ABC&color=fff&size=200&bold=true`;
                      }}
                    />
                  ) : (
                    // Use UI Avatar as fallback
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(organization.name)}&background=0D8ABC&color=fff&size=200&bold=true`}
                      alt={organization.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <div className="flex-grow text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-2 mb-4">
                    <h1 className="text-3xl font-bold text-gray-800 drop-shadow-sm">{organization.name}</h1>
                    {organization.verified && (
                      <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700 ml-2 border border-emerald-200 shadow-sm">
                        <CheckCircle className="h-3.5 w-3.5 mr-1 stroke-2" /> Verified
                      </Badge>
                    )}
                  </div>
                
                  <p className="text-gray-700 mb-6">{organization.description}</p>
                
                  <div className="flex flex-wrap gap-4 mb-4">
                    {organization.address?.city && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2 text-brand-orange" />
                        <span>{organization.address.city}</span>
                      </div>
                    )}
                  
                    {organization.website && (
                      <div className="flex items-center text-gray-600">
                        <Globe className="h-5 w-5 mr-2 text-brand-orange" />
                        <a href={organization.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                
                  <div className="flex flex-wrap gap-2">
                    {organization.social_links?.facebook && (
                      <a 
                        href={organization.social_links.facebook}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-green-100 rounded-full text-gray-700 hover:bg-brand-orange hover:text-white transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                  
                    {organization.social_links?.twitter && (
                      <a 
                        href={organization.social_links.twitter}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-green-100 rounded-full text-gray-700 hover:bg-brand-orange hover:text-white transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                  
                    {organization.social_links?.instagram && (
                      <a 
                        href={organization.social_links.instagram}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-green-100 rounded-full text-gray-700 hover:bg-brand-orange hover:text-white transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                  
                    {organization.social_links?.linkedin && (
                      <a 
                        href={organization.social_links.linkedin}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-green-100 rounded-full text-gray-700 hover:bg-brand-orange hover:text-white transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {organization.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <a href={`mailto:${organization.email}`} className="text-brand-teal hover:underline">
                        {organization.email}
                      </a>
                    </div>
                  )}
                  
                  {organization.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <a href={`tel:${organization.phone}`} className="text-brand-teal hover:underline">
                        {organization.phone}
                      </a>
                    </div>
                  )}
                  
                  {organization.address?.full_address && (
                    <>
                      <Separator />
                      <div>
                        <p className="font-medium mb-1">Address</p>
                        <p className="text-gray-600">
                          {organization.address.full_address}
                        </p>
                        {organization.address.pincode && (
                          <p className="text-gray-600">
                            {organization.address.city}, {organization.address.pincode}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Organization created on {new Date(organization.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                  {organization.verified && (
                    <div className="mt-4 p-3 bg-green-50 rounded-md">
                      <p className="text-green-800 text-sm flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        This organization has been verified
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Events */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Events by {organization.name}</h2>
              
              {events.length > 0 ? (
                <div className="space-y-6">
                  {events.map(event => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-32 md:h-auto bg-gray-100">
                          {event.image_url && (
                            <img 
                              src={event.image_url}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="p-6 md:w-2/3">
                          <Badge className="mb-2">{event.cause}</Badge>
                          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                          <p className="text-gray-600 line-clamp-2">{event.description}</p>
                          
                          <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center text-gray-600 text-sm">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{event.location.city}</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="mt-4" 
                            size="sm"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 mb-4">
                      This organization doesn't have any active events at the moment.
                    </p>
                    <Button variant="outline" onClick={() => navigate('/events')}>
                      Browse All Events
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrganizationDetailPage;
