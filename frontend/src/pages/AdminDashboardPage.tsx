
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminDashboard from '@/components/admin/AdminDashboard';

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AdminDashboard />
      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
