import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        
        const data = await response.json();
        
        if (!data.event) {
          throw new Error('Event not found');
        }
        
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
            id: data.event.organizer?._id || '',
            name: data.event.organizer?.name || '',
            contact_email: data.event.organizer?.contact_email || '',
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
    if (event?.organizer?.id) {
      navigate(`/organizations/${event.organizer.id}`);
    } else {
      toast({
        title: "Organization not found",
        description: "Sorry, organization details are not available",
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
          <div className="text-center">
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container max-w-5xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/events')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          
          {/* Event Header */}
          <div className="rounded-lg overflow-hidden bg-white border shadow-sm">
            <div className="h-64 bg-gradient-to-r from-brand-blue to-brand-teal relative">
              {event.image_url && (
                <img 
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <Badge className="absolute top-4 right-4 bg-white text-brand-teal">{event.cause}</Badge>
              </div>
            </div>
            
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
              
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-2 text-brand-orange" />
                  <span>{formattedDate}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2 text-brand-orange" />
                  <span>{event.time} ({event.duration})</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 text-brand-orange" />
                  <span>{event.location.address}, {event.location.city}, {event.location.pincode}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2 text-brand-orange" />
                  <span>
                    {event.volunteers_registered.length} / {event.volunteers_limit} volunteers
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">Organized by:</span>
                  <span className="ml-2 font-medium">{event.organizer.name}</span>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Event Details */}
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>About This Opportunity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {event.skills_required.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-gray-50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Organizer Info */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Organizer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-500" />
                    <span>{event.organizer.name}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span>{event.organizer.contact_email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span>{event.organizer.phone}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="pt-2">
                    <Button variant="outline" className="w-full" onClick={handleViewOrganization}>
                      View Organization Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-2">Share this event</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Help us spread the word about this volunteer opportunity.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={handleShareTwitter}>
                        Twitter
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={handleShareFacebook}>
                        Facebook
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={handleShareEmail}>
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Similar Events */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* This would be populated with similar events */}
              <div className="border rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center text-center h-48">
                <p className="text-gray-500 mb-4">
                  Similar events will be shown here
                </p>
                <Button variant="outline" onClick={() => navigate('/events')}>
                  Browse More Events
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventDetailPage;
