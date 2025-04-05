import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CAUSES, SKILLS } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface EventFormProps {
  isEditing?: boolean;
}

const EventForm = ({ isEditing = false }: EventFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cause: '',
    city: '',
    address: '',
    pincode: '',
    date: '',
    time: '',
    duration: '',
    skills: [] as string[],
    volunteers_limit: '5',
    organizerName: 'Digital Seva Club', // In a real app, this would be from the logged-in org
    organizerEmail: 'contact@digitalseva.org',
    organizerPhone: '+91-8899776655',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.cause) {
      toast({
        title: "Cause is required",
        description: "Please select a cause for your event.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (formData.skills.length === 0) {
      toast({
        title: "Skills are required",
        description: "Please select at least one required skill for volunteers.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      cause: formData.cause,
      location: {
        city: formData.city,
        address: formData.address,
        pincode: formData.pincode
      },
      date: new Date(formData.date),
      time: formData.time,
      duration: formData.duration,
      skills_required: formData.skills,
      volunteers_limit: parseInt(formData.volunteers_limit),
      organizer: {
        name: formData.organizerName,
        contact_email: formData.organizerEmail,
        phone: formData.organizerPhone
      },
      image_url: `https://source.unsplash.com/800x400/?volunteer,${formData.cause.toLowerCase()}`
    };

    try {
      // Send data to the API
      const response = await fetch('http://localhost:5000/api/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const data = await response.json();
      console.log("Event created successfully:", data);
      
      toast({
        title: isEditing ? "Event updated!" : "Event created!",
        description: isEditing 
          ? "Your event has been successfully updated." 
          : "Your event has been successfully created.",
      });

      // Redirect to the events page
      navigate('/events');
    } catch (error) {
      console.error("Event submission error:", error);
      toast({
        title: isEditing ? "Update failed" : "Creation failed",
        description: "There was a problem with your event.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Event" : "Create New Event"}</CardTitle>
            <CardDescription>
              {isEditing 
                ? "Update your event's details below." 
                : "Fill in the details for your volunteer event."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Give your event a descriptive title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what volunteers will be doing in this event"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cause">Cause</Label>
              <Select
                value={formData.cause}
                onValueChange={(value) => handleSelectChange('cause', value)}
              >
                <SelectTrigger id="cause">
                  <SelectValue placeholder="Select a cause" />
                </SelectTrigger>
                <SelectContent>
                  {CAUSES.map((cause) => (
                    <SelectItem key={cause} value={cause}>{cause}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>Where will the event take place?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  placeholder="PIN code"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Full address of the venue"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>When will the event take place?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Start Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => handleSelectChange('duration', value)}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 hour">1 hour</SelectItem>
                  <SelectItem value="2 hours">2 hours</SelectItem>
                  <SelectItem value="3 hours">3 hours</SelectItem>
                  <SelectItem value="4 hours">4 hours</SelectItem>
                  <SelectItem value="Half day">Half day</SelectItem>
                  <SelectItem value="Full day">Full day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills & Volunteers</CardTitle>
            <CardDescription>What skills are required, and how many volunteers do you need?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Required Skills</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {SKILLS.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`skill-${skill}`}
                      checked={formData.skills.includes(skill)}
                      onCheckedChange={() => handleSkillToggle(skill)}
                    />
                    <label
                      htmlFor={`skill-${skill}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="volunteers_limit">Number of Volunteers Needed</Label>
              <Select
                value={formData.volunteers_limit}
                onValueChange={(value) => handleSelectChange('volunteers_limit', value)}
              >
                <SelectTrigger id="volunteers_limit">
                  <SelectValue placeholder="Select number of volunteers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 volunteer</SelectItem>
                  <SelectItem value="2">2 volunteers</SelectItem>
                  <SelectItem value="3">3 volunteers</SelectItem>
                  <SelectItem value="5">5 volunteers</SelectItem>
                  <SelectItem value="10">10 volunteers</SelectItem>
                  <SelectItem value="15">15 volunteers</SelectItem>
                  <SelectItem value="20">20+ volunteers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
            <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : isEditing ? "Update Event" : "Create Event"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default EventForm;
