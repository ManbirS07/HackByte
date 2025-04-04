
import { useState } from 'react';
import { 
  Calendar, 
  Award, 
  Clock, 
  Star, 
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Volunteer, Event, Review, Badge as BadgeType } from '@/types';

// Mock data
const mockBadges: BadgeType[] = [
  {
    id: '1',
    name: 'First Step',
    description: 'Completed your first volunteering event',
    icon: 'award',
    level: 'beginner',
    earnedAt: new Date(2024, 2, 15),
  },
  {
    id: '2',
    name: 'Consistent Helper',
    description: 'Completed 5 volunteering events',
    icon: 'clock',
    level: 'intermediate',
    earnedAt: new Date(2024, 3, 20),
  },
  {
    id: '3',
    name: 'Community Champion',
    description: 'Accumulated 100 volunteering hours',
    icon: 'trophy',
    level: 'advanced',
  },
];

const mockEvents: Partial<Event>[] = [
  {
    id: '1',
    title: 'Beach Cleanup Drive',
    description: 'Help clean up the local beach',
    cause: 'Environment',
    date: new Date(2024, 3, 10),
    time: '09:00 AM',
    duration: '3 hours',
    location: {
      city: 'Mumbai',
      address: 'Juhu Beach',
      pincode: '400049',
    },
    organizer: {
      id: '101',
      name: 'Clean Earth Initiative',
      contact_email: 'contact@cleanearth.org',
      phone: '+91-9876543210',
    },
  },
  {
    id: '2',
    title: 'Teach Computer Basics',
    description: 'Teach basic computer skills to elderly',
    cause: 'Education',
    date: new Date(2024, 3, 20),
    time: '11:00 AM',
    duration: '2 hours',
    location: {
      city: 'Delhi',
      address: 'Community Center',
      pincode: '110001',
    },
    organizer: {
      id: '102',
      name: 'Digital Literacy Foundation',
      contact_email: 'help@digitalliteracy.org',
      phone: '+91-8877665544',
    },
  },
];

const mockReviews: Partial<Review>[] = [
  {
    id: '1',
    eventId: '1',
    organizationId: '101',
    rating: 5,
    comment: 'Great enthusiasm and dedication. Arrived on time and was very helpful throughout the event.',
    createdAt: new Date(2024, 3, 11),
  },
  {
    id: '2',
    eventId: '2',
    organizationId: '102',
    rating: 4,
    comment: 'Very patient with the elderly. Good communication skills.',
    createdAt: new Date(2024, 3, 21),
  },
];

// Mock volunteer data
const volunteerData: Partial<Volunteer> = {
  name: 'Arjun Kumar',
  email: 'arjun@example.com',
  points: 120,
  badges: mockBadges,
  completedEvents: 7,
  rating: 4.7,
  trustScore: 85,
};

const VolunteerDashboard = () => {
  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {volunteerData.name}!</h1>
          <p className="text-muted-foreground">Your volunteering journey at a glance.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="trust-score">
            <div className="bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-lg flex items-center gap-2">
              <Star className="h-5 w-5 fill-brand-blue text-brand-blue" />
              <div>
                <div className="text-sm font-medium">Trust Score</div>
                <div className="text-xl font-bold">{volunteerData.trustScore}%</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center p-2">
            <span className="text-sm text-gray-500">Points</span>
            <span className="text-xl font-bold text-brand-orange">{volunteerData.points}</span>
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
            <div className="text-2xl font-bold">{volunteerData.completedEvents}</div>
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
              <div className="text-2xl font-bold">{volunteerData.rating}</div>
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
              from {mockReviews.length} reviews
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
              <span>Silver</span>
              <Progress value={60} className="h-2" />
              <span>Gold</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Need 80 more points for Gold level
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
            {mockBadges.map((badge) => (
              <Card key={badge.id} className={`${badge.earnedAt ? '' : 'opacity-50'}`}>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 badge-${badge.level}`}>
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg">{badge.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{badge.description}</p>
                  {badge.earnedAt ? (
                    <span className="text-xs text-gray-500 mt-2">
                      Earned on {badge.earnedAt.toLocaleDateString()}
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
                    <span className="text-sm text-gray-500">14/20 hours</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Events Completed</span>
                    <span className="text-sm text-gray-500">7/10 events</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Skills Diversity</span>
                    <span className="text-sm text-gray-500">3/5 categories</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <h2 className="text-xl font-semibold mt-4">Events You've Participated In</h2>
          {mockEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Badge className="bg-brand-orange">{event.cause}</Badge>
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(event.date!).toLocaleDateString()}
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
          ))}
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          <h2 className="text-xl font-semibold mt-4">Reviews from Organizations</h2>
          {mockReviews.map((review, index) => {
            const event = mockEvents.find(e => e.id === review.eventId);
            const organization = event?.organizer;
            
            return (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {organization?.name} <span className="text-sm text-gray-500">for</span> {event?.title}
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
                      {review.createdAt?.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-600">"{review.comment}"</p>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VolunteerDashboard;
