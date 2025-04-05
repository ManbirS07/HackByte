import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  cause: {
    type: String,
    enum: [
      "Health", "Education", "Environment", "Animal Welfare",
      "Elderly Care", "Children & Youth", "Disaster Relief",
      "Poverty Alleviation", "Community Development", "Arts & Culture"
    ]
  },
  location: {
    city: String,
    address: String,
    pincode: String
  },
  date: Date,
  time: String,
  duration: String,
  skills_required: [String],
  volunteers_limit: Number,
  organizer: {
    name: String,
    contact_email: String,
    phone: String
  },
  applicants: [{
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reason: String // Optional field for rejection reason
  }],
  acceptedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }],
  image: String,
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
