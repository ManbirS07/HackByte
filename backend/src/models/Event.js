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
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }, // Reference to Organization model
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

// Add a pre-save middleware to ensure organizer ID is set if name exists
eventSchema.pre('save', async function(next) {
  // If we have organizer name but no ID, try to find the organization
  if (this.organizer && this.organizer.name && !this.organizer.id) {
    try {
      // Import Organization model dynamically to avoid circular dependency
      const Organization = mongoose.model('Organization');
      
      // Look for organization by name
      const organization = await Organization.findOne({ name: this.organizer.name });
      
      if (organization) {
        this.organizer.id = organization._id;
      }
    } catch (error) {
      console.error('Error finding organization:', error);
    }
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
