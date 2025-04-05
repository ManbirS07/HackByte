import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VolunteerRegister from "./pages/VolunteerRegister";
import OrganizationRegister from "./pages/OrganizationRegister";
import Events from "./pages/Events";
import Organizations from "./pages/Organizations";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import VolunteerDashboardPage from "./pages/VolunteerDashboardPage";
import CreateEventPage from "./pages/CreateEventPage";
import NotFound from "./pages/NotFound";
import VolunteerLogin from "./pages/VolunteerLogin";
import OrganizationLogin from "./pages/OrganizationLogin";
import AdminLogin from "./pages/AdminLogin";
import EventDetailPage from '@/pages/EventDetailPage';
import OrganizationDetailPage from "./pages/OrganizationDetailPage";
import About from "./pages/About";
import OrganizationDashboardPage from './pages/OrganizationDashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/volunteer" element={<VolunteerLogin />} />
          <Route path="/login/organization" element={<OrganizationLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/volunteer" element={<VolunteerRegister />} />
          <Route path="/register/organization" element={<OrganizationRegister />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/organizations/:id" element={<OrganizationDetailPage />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboardPage />} />
          <Route path="/organization-dashboard" element={<OrganizationDashboardPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
