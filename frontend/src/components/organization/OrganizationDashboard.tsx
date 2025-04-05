import { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  AlertCircle,
  Award,
  Video,
  Eye,
  BarChart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrganizationDashboardProps {
  organizationId: string;
}

interface VolunteerApplication {
  _id: string;
  volunteer: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    areaOfInterests: string[];
    govId: {
      idType: string;
      idNumber: string;
      idDocument: string;
    };
    resume: string;
    introVideo: string;
    badges: string[];
    points: number;
    completedEvents: string[];
    trustScore: number;
  };
  event: {
    _id: string;
    title: string;
    description: string;
    cause: string;
    date: string;
    time: string;
    location: {
      city: string;
      address: string;
      pincode: string;
    };
  };
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  aiAnalysis?: {
    score: number;
    summary: string;
    strengths: string[];
    suggestions: string[];
  };
}

const OrganizationDashboard = ({ organizationId }: OrganizationDashboardProps) => {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Fetch applications for this organization
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/organizations/${organizationId}/applications`);
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        
        const data = await response.json();
        setApplications(data.applications || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load volunteer applications',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchApplications();
    }
  }, [organizationId, toast]);

  // Filter applications by status
  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  // Handle resume analysis with Gemini
  const handleAnalyzeResume = async (applicationId: string) => {
    setAnalyzingId(applicationId);
    
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }
      
      const data = await response.json();
      
      // Update the application in state with the analysis
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app._id === applicationId ? { ...app, aiAnalysis: data.analysis } : app
        )
      );
      
      toast({
        title: 'Analysis Complete',
        description: 'Resume has been analyzed successfully',
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAnalyzingId(null);
    }
  };

  // Handle application status update
  const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    // Add to processing set
    setProcessingIds(prev => new Set(prev).add(applicationId));
    
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status,
          notes: status === 'accepted' ? 'Application accepted' : 'Application rejected'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
      
      const data = await response.json();
      
      // Update the application in state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app._id === applicationId ? { ...app, status, reviewedAt: new Date().toISOString() } : app
        )
      );
      
      toast({
        title: status === 'accepted' ? 'Volunteer Accepted' : 'Volunteer Rejected',
        description: status === 'accepted' 
          ? 'The volunteer has been accepted for this event' 
          : 'The volunteer has been rejected for this event',
      });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update application status',
        variant: 'destructive',
      });
    } finally {
      // Remove from processing set
      setProcessingIds(prev => {
        const updated = new Set(prev);
        updated.delete(applicationId);
        return updated;
      });
    }
  };

  // Function to render a volunteer card
  const renderVolunteerCard = (application: VolunteerApplication) => {
    const volunteer = application.volunteer;
    const event = application.event;
    const isProcessing = processingIds.has(application._id);
    const isAnalyzing = analyzingId === application._id;

    return (
      <Card key={application._id} className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{volunteer.fullName}</CardTitle>
              <CardDescription>
                Applied for: <span className="font-medium">{event.title}</span>
                <span className="ml-2 text-xs">
                  ({new Date(application.appliedAt).toLocaleDateString()})
                </span>
              </CardDescription>
            </div>
            <Badge 
              variant={application.status === 'pending' ? 'outline' : (
                application.status === 'accepted' ? 'secondary' : 'destructive'
              )}
              className={application.status === 'accepted' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
            >
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Volunteer Information</h3>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[100px]">Email:</span>
                  <span>{volunteer.email}</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[100px]">Phone:</span>
                  <span>{volunteer.phone}</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[100px]">ID Type:</span>
                  <span>{volunteer.govId.idType}</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[100px]">ID Number:</span>
                  <span>{volunteer.govId.idNumber}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Areas of Interest:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {volunteer.areaOfInterests.map((interest, idx) => (
                      <Badge key={idx} variant="outline" className="bg-gray-100">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" asChild>
                  <a href={volunteer.govId.idDocument} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-1" />
                    View ID
                  </a>
                </Button>
                
                <Button size="sm" variant="outline" asChild>
                  <a href={volunteer.resume} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-1" />
                    View Resume
                  </a>
                </Button>
                
                <Button size="sm" variant="outline" asChild>
                  <a href={volunteer.introVideo} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4 mr-1" />
                    View Intro Video
                  </a>
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Volunteer Stats</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Trust Score</span>
                    <span className="text-sm">{volunteer.trustScore}%</span>
                  </div>
                  <Progress value={volunteer.trustScore} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Points</span>
                    <div className="text-xl font-semibold flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      {volunteer.points}
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Completed Events</span>
                    <div className="text-xl font-semibold flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {volunteer.completedEvents?.length || 0}
                    </div>
                  </div>
                </div>
                
                {volunteer.badges?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Badges:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {volunteer.badges.map((badge, idx) => (
                        <Badge key={idx} variant="outline" className="bg-green-100 text-green-800">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {application.aiAnalysis && (
                  <div className="mt-2 border rounded-md p-3 bg-gray-50">
                    <h4 className="text-sm font-semibold flex items-center mb-2">
                      <BarChart className="h-4 w-4 mr-1" />
                      AI Analysis
                    </h4>
                    
                    <div className="mb-2">
                      <span className="text-sm font-medium">Suitability Score: </span>
                      <span className="text-sm">{application.aiAnalysis.score}/100</span>
                      <Progress value={application.aiAnalysis.score} className="h-2 mt-1" />
                    </div>
                    
                    <p className="text-sm mb-2">{application.aiAnalysis.summary}</p>
                    
                    {application.aiAnalysis.strengths.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">Strengths:</span>
                        <ul className="text-sm list-disc list-inside">
                          {application.aiAnalysis.strengths.map((strength, idx) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {application.aiAnalysis.suggestions.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Suggestions:</span>
                        <ul className="text-sm list-disc list-inside">
                          {application.aiAnalysis.suggestions.map((suggestion, idx) => (
                            <li key={idx}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2 pt-2">
          {application.status === 'pending' && (
            <>
              {!application.aiAnalysis && (
                <Button 
                  variant="outline" 
                  onClick={() => handleAnalyzeResume(application._id)}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                  <FileText className="h-4 w-4 ml-1" />
                </Button>
              )}
              
              <Button 
                variant="destructive" 
                onClick={() => updateApplicationStatus(application._id, 'rejected')}
                disabled={isProcessing}
              >
                {isProcessing ? 'Rejecting...' : 'Reject'}
                <XCircle className="h-4 w-4 ml-1" />
              </Button>
              
              <Button 
                onClick={() => updateApplicationStatus(application._id, 'accepted')}
                disabled={isProcessing}
              >
                {isProcessing ? 'Accepting...' : 'Accept'}
                <CheckCircle className="h-4 w-4 ml-1" />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Organization Dashboard</h1>
          <p className="text-muted-foreground">Manage volunteer applications and events</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingApplications.length} pending review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Volunteers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Ready to participate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Applications</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Not suitable for events
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.length ? 
                Math.round(((acceptedApplications.length + rejectedApplications.length) / applications.length) * 100) : 
                0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Applications reviewed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="pending">
            Pending Applications
            {pendingApplications.length > 0 && (
              <Badge className="ml-2">{pendingApplications.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg">Loading applications...</p>
            </div>
          ) : pendingApplications.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
              <p className="text-lg">No pending applications</p>
              <p className="text-muted-foreground mt-1">
                All volunteer applications have been reviewed
              </p>
            </div>
          ) : (
            <div>
              {pendingApplications.map(application => renderVolunteerCard(application))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="accepted" className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg">Loading applications...</p>
            </div>
          ) : acceptedApplications.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
              <p className="text-lg">No accepted applications</p>
              <p className="text-muted-foreground mt-1">
                You haven't accepted any volunteer applications yet
              </p>
            </div>
          ) : (
            <div>
              {acceptedApplications.map(application => renderVolunteerCard(application))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg">Loading applications...</p>
            </div>
          ) : rejectedApplications.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
              <p className="text-lg">No rejected applications</p>
              <p className="text-muted-foreground mt-1">
                You haven't rejected any volunteer applications yet
              </p>
            </div>
          ) : (
            <div>
              {rejectedApplications.map(application => renderVolunteerCard(application))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationDashboard;
