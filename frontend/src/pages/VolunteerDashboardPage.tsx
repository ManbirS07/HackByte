
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VolunteerDashboard from '@/components/volunteer/VolunteerDashboard';

const VolunteerDashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <VolunteerDashboard />
      <Footer />
    </div>
  );
};

export default VolunteerDashboardPage;
