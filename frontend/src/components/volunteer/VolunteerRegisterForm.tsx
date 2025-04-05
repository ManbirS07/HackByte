import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CAUSES, ID_TYPES, SKILLS } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link as LucideLink } from 'lucide-react';
import axios from 'axios';
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

const VolunteerRegisterForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    interests: [] as string[],
    governmentIdType: '',
    governmentIdNumber: '',
    governmentIdProofUrl: '',
    resumeUrl: '',
    introVideoUrl: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleInterestToggle = (cause: string) => {
    setFormData(prev => {
      const interests = prev.interests.includes(cause)
        ? prev.interests.filter(i => i !== cause)
        : [...prev.interests, cause];
      return { ...prev, interests };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (formData.interests.length === 0) {
      toast({
        title: "Please select interests",
        description: "You must select at least one interest area.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.governmentIdType || !formData.governmentIdNumber) {
      toast({
        title: "Government ID required",
        description: "Please provide your government ID details.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.governmentIdProofUrl) {
      toast({
        title: "Government ID proof URL required",
        description: "Please provide a URL for your government ID proof.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.resumeUrl) {
      toast({
        title: "Resume URL required",
        description: "Please provide the URL to your resume.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.introVideoUrl) {
      toast({
        title: "Introduction video URL required",
        description: "Please provide a URL to your introduction video.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate URLs
    const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    if (!urlRegex.test(formData.governmentIdProofUrl) || !urlRegex.test(formData.resumeUrl) || !urlRegex.test(formData.introVideoUrl)) {
      toast({
        title: "Invalid URL format",
        description: "Please provide valid URLs for your documents and video.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data using keys expected by backend
      const volunteerData = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        govId: {
          idType: formData.governmentIdType,
          idNumber: formData.governmentIdNumber,
          idDocument: formData.governmentIdProofUrl,
        },
        resume: formData.resumeUrl,
        introVideo: formData.introVideoUrl,
        interests: formData.interests,
      };

      console.log('Sending data to API:', JSON.stringify(volunteerData));
      
      // Try with fetch instead of axios to see if that resolves the issue
      const response = await fetch('http://localhost:5000/api/volunteers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(volunteerData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw { 
          response: {
            status: response.status,
            data: errorData
          }
        };
      }
      
      const data = await response.json();
      console.log('Registration successful:', data);
      
      toast({
        title: "Registration successful!",
        description: "Your volunteer account has been created.",
      });

      // Store the token in localStorage for authentication
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Redirect to volunteer dashboard or profile page
        setTimeout(() => {
          window.location.href = '/volunteer/dashboard';
        }, 1500);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // More detailed error handling
      let errorMessage = "There was a problem creating your account.";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log('Error data:', error.response.data);
        console.log('Error status:', error.response.status);
        
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          // Handle validation errors
          errorMessage = error.response.data.errors.map((err: any) => err.msg).join(", ");
        } else if (error.response.data.msg) {
          errorMessage = error.response.data.msg;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response received from server. Please check your connection.";
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || "Unknown error occurred";
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
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
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Provide your basic contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Areas of Interest</CardTitle>
            <CardDescription>Select causes you're passionate about.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {CAUSES.map((cause) => (
                <div key={cause} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`interest-${cause}`}
                    checked={formData.interests.includes(cause)}
                    onCheckedChange={() => handleInterestToggle(cause)}
                  />
                  <label
                    htmlFor={`interest-${cause}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {cause}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Government ID Verification</CardTitle>
            <CardDescription>For security purposes, we need to verify your identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="governmentIdType">ID Type</Label>
                <Select
                  value={formData.governmentIdType}
                  onValueChange={(value) => handleSelectChange('governmentIdType', value)}
                >
                  <SelectTrigger id="governmentIdType">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ID_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="governmentIdNumber">ID Number</Label>
                <Input
                  id="governmentIdNumber"
                  name="governmentIdNumber"
                  placeholder="Your ID number"
                  value={formData.governmentIdNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="governmentIdProofUrl">Government ID Document URL</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="governmentIdProofUrl"
                    name="governmentIdProofUrl"
                    type="url"
                    placeholder="https://example.com/your-government-id.pdf"
                    value={formData.governmentIdProofUrl}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="bg-brand-orange/10 text-brand-orange p-2 rounded-md">
                    <LucideLink className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the URL where your government ID document is stored (e.g., Google Drive, Dropbox, etc.)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resume & Introduction</CardTitle>
            <CardDescription>Provide links to your resume and a brief introduction video.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resumeUrl">Resume URL</Label>
                <Input
                  id="resumeUrl"
                  name="resumeUrl"
                  type="url"
                  placeholder="https://example.com/your-resume.pdf"
                  value={formData.resumeUrl}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to your resume document (PDF, DOC, or DOCX format recommended)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="introVideoUrl">Introduction Video URL</Label>
                <Input
                  id="introVideoUrl"
                  name="introVideoUrl"
                  type="url"
                  placeholder="https://example.com/your-intro-video.mp4"
                  value={formData.introVideoUrl}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to a brief 30-60 second video introducing yourself and your interests
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
            <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Complete Registration"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default VolunteerRegisterForm;
