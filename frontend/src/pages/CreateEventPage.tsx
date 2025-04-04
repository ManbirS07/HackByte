
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventForm from '@/components/organization/EventForm';

const CreateEventPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create a New Event</h1>
          <EventForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateEventPage;
