
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CAUSES, ID_TYPES, SKILLS } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUp } from 'lucide-react';
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
    governmentIdProof: null as File | null,
    resume: null as File | null,
    introVideo: null as File | null,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'introVideo' | 'governmentIdProof') => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [type]: e.target.files[0],
      });
    }
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

    if (!formData.governmentIdProof) {
      toast({
        title: "Government ID proof required",
        description: "Please upload a scan or photo of your government ID.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.resume) {
      toast({
        title: "Resume required",
        description: "Please upload your resume.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.introVideo) {
      toast({
        title: "Introduction video required",
        description: "Please upload a short introduction video.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // In a real app, we would send this data to an API
      console.log("Form data to be submitted:", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        interests: formData.interests,
        governmentId: {
          type: formData.governmentIdType,
          number: formData.governmentIdNumber,
          proof: formData.governmentIdProof?.name,
        },
        resume: formData.resume?.name,
        introVideo: formData.introVideo?.name,
      });
      
      toast({
        title: "Registration successful!",
        description: "Your volunteer account has been created.",
      });

      // In a real app, we might redirect to a login page or dashboard
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "There was a problem creating your account.",
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
                <Label htmlFor="governmentIdProof">Upload ID Proof</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="governmentIdProof"
                    type="file"
                    accept="image/*,.pdf"
                    className="flex-1"
                    onChange={(e) => handleFileChange(e, 'governmentIdProof')}
                    required
                  />
                  <div className="bg-brand-orange/10 text-brand-orange p-2 rounded-md">
                    <FileUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload a clear scan or photo of your ID. Max size: 5MB. Accepted formats: .jpg, .png, .pdf
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resume & Introduction</CardTitle>
            <CardDescription>Upload your resume and a brief introduction video.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resume">Upload Resume (PDF format)</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'resume')}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max size: 5MB. Accepted formats: .pdf, .doc, .docx
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="introVideo">Upload Introduction Video</Label>
                <Input
                  id="introVideo"
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'introVideo')}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max size: 50MB. A brief 30-60 second video introducing yourself and your interests.
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
