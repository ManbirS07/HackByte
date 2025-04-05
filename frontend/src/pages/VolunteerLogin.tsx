import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const VolunteerLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Attempting login with:', formData.email);
      
      // Post login data to volunteer login endpoint
      const response = await fetch('http://localhost:5000/api/volunteers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store auth token if returned from API
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userType', 'volunteer');
        localStorage.setItem('userId', data.volunteer.id);
        localStorage.setItem('user', JSON.stringify(data.volunteer));
      }

      // Show success message
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.volunteer.fullName || 'Volunteer'}!`,
      });

      // Redirect to volunteer dashboard instead of events page
      navigate('/volunteer-dashboard');
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 flex items-center">
        <div className="container">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Login</CardTitle>
                <CardDescription>
                  Access your volunteer account
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="volunteer@example.com"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link 
                        to="/forgot-password" 
                        className="text-xs text-brand-orange hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Log in"}
                  </Button>
                </CardFooter>
              </form>
              
              <div className="px-6 pb-6 text-center text-sm">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/register/volunteer" className="text-brand-orange hover:underline">
                    Register here
                  </Link>
                </p>
                <p className="mt-2 text-gray-600">
                  <Link to="/login" className="text-brand-orange hover:underline">
                    &larr; Back to login options
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VolunteerLogin;
