import mongoose from 'mongoose';

const volunteerApplicationSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewNotes: String,
  aiAnalysis: {
    score: Number,
    summary: String,
    strengths: [String],
    suggestions: [String]
  }
});

const VolunteerApplication = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
export default VolunteerApplication;
