import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const OrganizationRegisterForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    city: '',
    fullAddress: '',
    pincode: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    logo: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    try {
      // Format data according to expected backend format
      const organizationData = {
        name: formData.name,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        address: {
          city: formData.city,
          full_address: formData.fullAddress,
          pincode: formData.pincode
        },
        social_links: {
          facebook: formData.facebook,
          twitter: formData.twitter,
          instagram: formData.instagram,
          linkedin: formData.linkedin
        },
        logo_url: formData.logo,
        password: formData.password
      };
      
      console.log('Sending organization data to API:', JSON.stringify({
        ...organizationData,
        password: organizationData.password ? '[PASSWORD EXISTS]' : '[NO PASSWORD]'
      }, null, 2));
      
      // Send data to backend API
      const response = await fetch('http://localhost:5000/api/organizations/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(organizationData)
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
        description: "Your organization has been registered and is pending verification.",
      });

      // Store token and organization data in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userType', 'organization');
        localStorage.setItem('userId', data.organization.id);
        localStorage.setItem('user', JSON.stringify(data.organization));
        
        // Redirect to organization dashboard
        setTimeout(() => {
          navigate('/organization-dashboard');
        }, 1500);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // More detailed error handling
      let errorMessage = "There was a problem registering your organization.";
      
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
            <CardTitle>Organization Information</CardTitle>
            <CardDescription>
              Provide details about your organization. This information will be visible to volunteers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your organization's name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell us about your organization, mission, and the work you do"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="organization@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Your contact number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                placeholder="https://yourorganization.com"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>
              Where is your organization located?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Your city"
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
              <Label htmlFor="fullAddress">Full Address</Label>
              <Textarea
                id="fullAddress"
                name="fullAddress"
                placeholder="Street address, landmarks, etc."
                value={formData.fullAddress}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>
              Add your organization's social media profiles.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                name="facebook"
                placeholder="https://facebook.com/yourorganization"
                value={formData.facebook}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                name="twitter"
                placeholder="https://twitter.com/yourorganization"
                value={formData.twitter}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                name="instagram"
                placeholder="https://instagram.com/yourorganization"
                value={formData.instagram}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                placeholder="https://linkedin.com/company/yourorganization"
                value={formData.linkedin}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Logo</CardTitle>
            <CardDescription>
              Provide a URL to your organization's logo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                name="logo"
                type="url"
                placeholder="https://example.com/your-logo.png"
                value={formData.logo}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a direct link to your logo image. Recommended size: 400x400 pixels.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>
              Set up a password for your organization account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
            <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Register Organization"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default OrganizationRegisterForm;
