import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Award, 
  Clock, 
  Star, 
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Volunteer, Event, Review, Badge as BadgeType } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Default data for a new volunteer
const defaultVolunteerData = {
  fullName: 'Volunteer',
  email: '',
  phone: '',
  points: 0,
  rating: 0,
  completedEvents: 0,
  trustScore: 60,
  badges: [],
  events: [],
  reviews: []
};

// Mock data for new volunteers or when API data is not available
const mockBadges: BadgeType[] = [
  {
    id: '1',
    name: 'First Step',
    description: 'Completed your first volunteering event',
    icon: 'award',
    level: 'beginner',
    earnedAt: null, // Not earned yet for new user
  },
  {
    id: '2',
    name: 'Consistent Helper',
    description: 'Completed 5 volunteering events',
    icon: 'clock',
    level: 'intermediate',
    earnedAt: null, // Not earned yet for new user
  },
  {
    id: '3',
    name: 'Community Champion',
    description: 'Accumulated 100 volunteering hours',
    icon: 'trophy',
    level: 'advanced',
    earnedAt: null, // Not earned yet for new user
  },
];

const VolunteerDashboard = () => {
  const { toast } = useToast();
  const [volunteerData, setVolunteerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEvents, setUserEvents] = useState<Partial<Event>[]>([]);
  const [userReviews, setUserReviews] = useState<Partial<Review>[]>([]);
  const [userBadges, setUserBadges] = useState<BadgeType[]>(mockBadges);

  // Fetch volunteer data from localStorage and API
  useEffect(() => {
    // Get user data from localStorage
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get basic user info from localStorage
        const userJson = localStorage.getItem('user');
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('authToken');
        
        let userData;
        
        if (userJson) {
          // Check if it's a string that needs parsing or already an object
          try {
            userData = typeof userJson === 'string' ? JSON.parse(userJson) : userJson;
          } catch (e) {
            console.warn("Failed to parse user JSON, using as-is:", e);
            // If parsing fails, the data might be corrupted or not valid JSON
            userData = { fullName: "User" };
          }
        } else if (userId) {
          userData = { id: userId };
        } else {
          throw new Error('No user data found');
        }
        
        // Merge with default data for any missing fields
        const completeUserData = {
          ...defaultVolunteerData,
          ...userData
        };
        
        setVolunteerData(completeUserData);
        
        // Fetch additional data from API if we have a token and userId
        if (token && userId) {
          try {
            // These would be your actual API endpoints
            // const eventsResponse = await fetch(`/api/volunteers/${userId}/events`);
            // const reviewsResponse = await fetch(`/api/volunteers/${userId}/reviews`);
            // const badgesResponse = await fetch(`/api/volunteers/${userId}/badges`);
            
            // For now, we'll use empty arrays or mock data
            // const events = await eventsResponse.json();
            // const reviews = await reviewsResponse.json();
            // const badges = await badgesResponse.json();
            
            // setUserEvents(events);
            // setUserReviews(reviews);
            // setUserBadges(badges.length > 0 ? badges : mockBadges);
            
            // Using mock data for now
            setUserEvents([]);
            setUserReviews([]);
            
            // Check if user has events to determine earned badges
            const earnedBadges = [...mockBadges];
            
            if (completeUserData.completedEvents > 0) {
              earnedBadges[0].earnedAt = new Date(); // First event badge
            }
            
            if (completeUserData.completedEvents >= 5) {
              earnedBadges[1].earnedAt = new Date(); // 5 events badge
            }
            
            setUserBadges(earnedBadges);
            
          } catch (error) {
            console.error("Error fetching user details:", error);
            toast({
              title: "Error",
              description: "Could not fetch all user details. Some information may be missing.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error",
          description: "Could not load user data. Please try logging in again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
        </div>
        <p className="mt-8 text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  if (!volunteerData) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No Data Available</h2>
        <p className="text-gray-600 mb-6">
          We couldn't find your volunteer profile. Please try logging in again.
        </p>
        <Button asChild>
          <Link to="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {volunteerData.fullName}!</h1>
          <p className="text-muted-foreground">Your volunteering journey at a glance.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="trust-score">
            <div className="bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-lg flex items-center gap-2">
              <Star className="h-5 w-5 fill-brand-blue text-brand-blue" />
              <div>
                <div className="text-sm font-medium">Trust Score</div>
                <div className="text-xl font-bold">{volunteerData.trustScore || 60}%</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center p-2">
            <span className="text-sm text-gray-500">Points</span>
            <span className="text-xl font-bold text-brand-orange">{volunteerData.points || 0}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteerData.completedEvents || 0}</div>
            <p className="text-xs text-muted-foreground">
              events completed successfully
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{volunteerData.rating || 0}</div>
              <div className="ml-2 flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(volunteerData.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              from {userReviews.length} reviews
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Level</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span>Bronze</span>
              <Progress value={volunteerData.points ? Math.min((volunteerData.points / 100) * 100, 100) : 10} className="h-2" />
              <span>Silver</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Need {Math.max(0, 100 - (volunteerData.points || 0))} more points for Silver level
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="badges">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
          <TabsTrigger value="events">Past Events</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="badges" className="space-y-4">
          <h2 className="text-xl font-semibold mt-4">Your Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userBadges.map((badge) => (
              <Card key={badge.id} className={`${badge.earnedAt ? '' : 'opacity-50'}`}>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 badge-${badge.level}`}>
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg">{badge.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{badge.description}</p>
                  {badge.earnedAt ? (
                    <span className="text-xs text-gray-500 mt-2">
                      Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 mt-2">Not earned yet</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-xl font-semibold mt-8">Progress Toward Next Level</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Hours Contributed</span>
                    <span className="text-sm text-gray-500">
                      {volunteerData.hoursContributed || 0}/20 hours
                    </span>
                  </div>
                  <Progress 
                    value={volunteerData.hoursContributed ? (volunteerData.hoursContributed / 20) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Events Completed</span>
                    <span className="text-sm text-gray-500">
                      {volunteerData.completedEvents || 0}/10 events
                    </span>
                  </div>
                  <Progress 
                    value={volunteerData.completedEvents ? (volunteerData.completedEvents / 10) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Skills Diversity</span>
                    <span className="text-sm text-gray-500">
                      {volunteerData.skillsCount || 0}/5 categories
                    </span>
                  </div>
                  <Progress 
                    value={volunteerData.skillsCount ? (volunteerData.skillsCount / 5) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <h2 className="text-xl font-semibold mt-4">Events You've Participated In</h2>
          {userEvents.length > 0 ? (
            userEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Badge className="bg-brand-orange">{event.cause}</Badge>
                        <span className="ml-2 text-sm text-gray-500">
                          {event.date ? new Date(event.date).toLocaleDateString() : 'Date not available'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{event.duration}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="text-sm text-gray-600">
                        Organized by <span className="font-medium">{event.organizer?.name}</span>
                      </div>
                      <div className="mt-2 flex items-center">
                        <Badge variant="outline" className="mr-2">
                          Completed
                        </Badge>
                        <span className="text-sm text-gray-500">+20 points</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No events yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                You haven't participated in any events yet. Find opportunities that match your skills and interests.
              </p>
              <Button asChild>
                <Link to="/events">Browse Events</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          <h2 className="text-xl font-semibold mt-4">Reviews from Organizations</h2>
          {userReviews.length > 0 ? (
            userReviews.map((review) => {
              const event = userEvents.find(e => e.id === review.eventId);
              
              return (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {review.organizationName || 'Organization'} 
                          {event && <span className="text-sm text-gray-500"> for {event.title}</span>}
                        </h3>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < (review.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Date not available'}
                      </span>
                    </div>
                    <p className="mt-3 text-gray-600">"{review.comment}"</p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Star className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Once you've participated in events, organizations can leave reviews about your volunteering.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VolunteerDashboard;

