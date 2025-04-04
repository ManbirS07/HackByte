
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Login = () => {
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

  const handleSubmit = async (e: React.FormEvent, userType: string) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock login logic for demonstration
      console.log(`Logging in as ${userType} with email:`, formData.email);
      
      // If this were a real app, we would validate credentials with an API

      // Show success message
      toast({
        title: "Login Successful",
        description: `Welcome back to Kindness Unite!`,
      });

      // Redirect based on user type
      if (userType === 'admin') {
        navigate('/admin-dashboard');
      } else if (userType === 'volunteer') {
        navigate('/volunteer-dashboard');
      } else {
        navigate('/organization-dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
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
                <CardTitle>Log In to Your Account</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              
              <Tabs defaultValue="volunteer">
                <div className="px-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
                    <TabsTrigger value="organization">Organization</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="volunteer">
                  <form onSubmit={(e) => handleSubmit(e, 'volunteer')}>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="volunteer-email">Email</Label>
                        <Input
                          id="volunteer-email"
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
                          <Label htmlFor="volunteer-password">Password</Label>
                          <Link 
                            to="/forgot-password" 
                            className="text-xs text-brand-orange hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <Input
                          id="volunteer-password"
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
                        {isSubmitting ? "Logging in..." : "Log in as Volunteer"}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
                
                <TabsContent value="organization">
                  <form onSubmit={(e) => handleSubmit(e, 'organization')}>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="org-email">Email</Label>
                        <Input
                          id="org-email"
                          name="email"
                          type="email"
                          placeholder="organization@example.com"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="org-password">Password</Label>
                          <Link 
                            to="/forgot-password" 
                            className="text-xs text-brand-orange hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <Input
                          id="org-password"
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
                        {isSubmitting ? "Logging in..." : "Log in as Organization"}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
                
                <TabsContent value="admin">
                  <form onSubmit={(e) => handleSubmit(e, 'admin')}>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Email</Label>
                        <Input
                          id="admin-email"
                          name="email"
                          type="email"
                          placeholder="admin@kindnessunite.org"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-password">Password</Label>
                          <Link 
                            to="/forgot-password" 
                            className="text-xs text-brand-orange hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <Input
                          id="admin-password"
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
                        {isSubmitting ? "Logging in..." : "Log in as Admin"}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="px-6 pb-6 text-center text-sm">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-brand-orange hover:underline">
                    Register here
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

export default Login;
