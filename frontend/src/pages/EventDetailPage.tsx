import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle,
  ArrowLeft, 
  Share2, 
  Building, 
  Phone, 
  Mail
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is logged in (simplified for now)
  const isLoggedIn = localStorage.getItem('authToken') !== null;
  
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        // Log the event ID we're fetching
        console.log("Fetching event with ID:", id);
        
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        
        const data = await response.json();
        
        if (!data.event) {
          throw new Error('Event not found');
        }
        
        console.log("Event data received:", data.event);
        console.log("Organization data:", data.event.organizer);
        
        // Transform API data to match our Event type
        const eventData: Event = {
          id: data.event._id,
          title: data.event.title,
          description: data.event.description,
          cause: data.event.cause,
          location: data.event.location || { city: '', address: '', pincode: '' },
          date: new Date(data.event.date),
          time: data.event.time,
          duration: data.event.duration,
          skills_required: data.event.skills_required || [],
          volunteers_limit: data.event.volunteers_limit || 0,
          volunteers_registered: data.event.acceptedVolunteers || [],
          organizer: {
            // Store the organization ID correctly from the data
            id: data.event.organizer?._id || data.event.organizer?.id || '',
            name: data.event.organizer?.name || '',
            contact_email: data.event.organizer?.contact_email || data.event.organizer?.email || '',
            phone: data.event.organizer?.phone || ''
          },
          image_url: data.event.image_url || `https://source.unsplash.com/800x400/?volunteer,${data.event.cause?.toLowerCase()}`
        };
        
        setEvent(eventData);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchEvent();
    }
  }, [id]);
  
  const handleApply = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to apply for this event.",
        variant: "destructive",
      });
      
      // Redirect to login with redirect back to this page
      navigate(`/login?redirect=/events/${id}`);
      return;
    }
    
    setIsApplying(true);
    
    try {
      // Mock implementation - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Application Submitted!",
        description: "Your application has been submitted. The organizer will review it shortly.",
      });
      
      // Refresh event data to show updated status
      // In a real implementation, you would update the UI to reflect the pending application
    } catch (err) {
      console.error('Error applying for event:', err);
      toast({
        title: "Application Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };
  
  const handleShareTwitter = () => {
    const url = window.location.href;
    const text = `Check out this volunteer opportunity: ${event?.title}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };
  
  const handleShareFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };
  
  const handleShareEmail = () => {
    const subject = `Volunteer Opportunity: ${event?.title}`;
    const body = `Check out this volunteer opportunity: ${event?.title}\n\n${event?.description}\n\nDate: ${formattedDate}\nTime: ${event?.time}\nLocation: ${event?.location.address}, ${event?.location.city}\n\nSign up here: ${window.location.href}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const handleViewOrganization = () => {
    // Log the current event organization data to debug
    console.log("Current event organizer data:", event?.organizer);
    
    // Check if we have a valid organizer ID
    if (event?.organizer?.id && event.organizer.id !== 'undefined' && event.organizer.id !== '') {
      console.log("Navigating to organization with ID:", event.organizer.id);
      
      // Check if ID is a valid MongoDB ObjectId (24 hex chars)
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(event.organizer.id);
      
      if (isValidObjectId) {
        navigate(`/organizations/${event.organizer.id}`);
      } else {
        // Try to find organization by name instead
        handleFindOrganizationByName();
      }
    } else {
      // No ID available, try to find organization by name
      handleFindOrganizationByName();
    }
  };
  
  // New function to find organization by name
  const handleFindOrganizationByName = async () => {
    if (!event?.organizer?.name) {
      toast({
        title: "Organization not found",
        description: "Sorry, organization details are not available",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Searching for organization by name:", event.organizer.name);
      
      // Call API to find organization by name
      const response = await fetch(`http://localhost:5000/api/organizations/search?name=${encodeURIComponent(event.organizer.name)}`);
      
      if (!response.ok) {
        throw new Error("Failed to find organization");
      }
      
      const data = await response.json();
      
      if (data.organization && data.organization._id) {
        console.log("Found organization:", data.organization);
        navigate(`/organizations/${data.organization._id}`);
      } else {
        toast({
          title: "Organization not found",
          description: "Sorry, we couldn't find this organization in our database",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error finding organization:", error);
      toast({
        title: "Error finding organization",
        description: "There was a problem finding the organization details",
        variant: "destructive",
      });
    }
  };
  
  const formattedDate = event?.date 
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
    
  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container py-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-medium">Loading event details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Handle error state
  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container py-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Event Not Found</h2>
            <p className="text-gray-600 mb-8">{error || "The event you're looking for doesn't exist."}</p>
            <Button onClick={() => navigate('/events')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Create a route path for the organization profile if the ID exists and is valid
  const organizationPath = event?.organizer?.id && 
    event.organizer.id !== '' && 
    /^[0-9a-fA-F]{24}$/.test(event.organizer.id) 
      ? `/organizations/${event.organizer.id}` 
      : undefined;
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-grow py-10 px-4">
        <div className="container max-w-5xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-8" 
            onClick={() => navigate('/events')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          
          {/* Event Header */}
          <div className="rounded-xl overflow-hidden bg-white border shadow-md mb-10">
            <div className="h-72 md:h-80 relative">
              {event.image_url && (
                <img 
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40">
                <Badge className="absolute top-6 right-6 bg-white text-brand-teal font-medium text-sm px-3 py-1">
                  {event.cause}
                </Badge>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-5">{event.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center text-gray-700">
                  <CalendarIcon className="h-5 w-5 mr-3 text-brand-orange flex-shrink-0" />
                  <span>{formattedDate}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-3 text-brand-orange flex-shrink-0" />
                  <span>{event.time} ({event.duration})</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-3 text-brand-orange flex-shrink-0" />
                  <span className="truncate">{event.location.address}, {event.location.city}, {event.location.pincode}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Users className="h-5 w-5 mr-3 text-brand-orange flex-shrink-0" />
                  <span>
                    {event.volunteers_registered.length} / {event.volunteers_limit} volunteers
                  </span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="text-sm text-gray-500 mr-2">Organized by:</span>
                  <span className="font-medium">{event.organizer.name}</span>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  
                  <Button 
                    onClick={handleApply} 
                    disabled={isApplying} 
                    className="rounded-full"
                  >
                    {isApplying ? "Applying..." : "Apply to Volunteer"}
                    {!isApplying && <CheckCircle className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">About This Opportunity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{event.description}</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  {event.skills_required.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {event.skills_required.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className="bg-slate-100 text-slate-800 hover:bg-slate-200 px-3 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No specific skills required</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Share This Event - Moved to left column */}
              <Card className="shadow-sm bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <Share2 className="h-5 w-5 mr-2 text-indigo-500" />
                    Share This Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Help us spread the word about this volunteer opportunity.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200" 
                      onClick={handleShareTwitter}
                    >
                      Twitter
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-blue-500 text-white hover:bg-blue-600 border-blue-600" 
                      onClick={handleShareFacebook}
                    >
                      Facebook
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-red-50 text-red-600 hover:bg-red-100 border-red-200" 
                      onClick={handleShareEmail}
                    >
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Organizer Info and Similar Events */}
            <div className="space-y-6">
              {/* Organizer Information */}
              <Card className="shadow-sm bg-gradient-to-br from-amber-50 to-white border-amber-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <Building className="h-5 w-5 mr-2 text-amber-500" />
                    Organizer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-md">
                    <Building className="h-5 w-5 text-brand-blue" />
                    <span className="font-medium">{event.organizer.name}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex items-center gap-3 bg-white p-3 rounded-md">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span className="text-sm overflow-hidden text-ellipsis">{event.organizer.contact_email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white p-3 rounded-md">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span>{event.organizer.phone || "No phone available"}</span>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white" 
                      onClick={handleViewOrganization}
                    >
                      View Organization Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Similar Opportunities */}
              <Card className="shadow-sm bg-gradient-to-br from-emerald-50 to-white border-emerald-100 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <Users className="h-5 w-5 mr-2 text-emerald-500" />
                    Similar Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-md h-[160px]">
                    <p className="text-gray-500 mb-4">
                      Similar volunteer events will appear here
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/events')} 
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                    >
                      Browse More Events
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventDetailPage;
