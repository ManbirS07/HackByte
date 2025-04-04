
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UsersIcon 
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md animate-fade-in">
      <div className="h-32 bg-gradient-to-r from-brand-blue to-brand-teal flex items-center justify-center text-white">
        <Badge className="bg-white text-brand-teal">{event.cause}</Badge>
      </div>
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-2 text-brand-orange" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 mr-2 text-brand-orange" />
            <span>{event.time} ({event.duration})</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-2 text-brand-orange" />
            <span>{event.location.address}, {event.location.city}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <UsersIcon className="h-4 w-4 mr-2 text-brand-orange" />
            <span>{event.volunteers_registered.length} / {event.volunteers_limit} volunteers</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {event.skills_required.map((skill) => (
            <span key={skill} className="cause-tag">
              {skill}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center border-t">
        <div className="text-sm text-gray-500">
          By <span className="font-medium">{event.organizer.name}</span>
        </div>
        <Button asChild>
          <Link to={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
