const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const volunteerSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  government_id: {
    type: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    },
    document_url: {
      type: String,
      required: true
    }
  },
  resume_url: {
    type: String,
    required: true
  },
  intro_video_url: {
    type: String,
    required: true
  },
  interests: {
    type: [String],
    default: []
  },
  badges: {
    type: [String],
    default: []
  },
  points: {
    type: Number,
    default: 0
  },
  completed_events: {
    type: Number,
    default: 0
  },
  reviews: [{
    organization: String,
    rating: Number,
    comment: String,
    trust_score: Number
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
volunteerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
volunteerSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Volunteer', volunteerSchema);
