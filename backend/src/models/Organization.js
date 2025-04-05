import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }, // Ensure this field is defined
  website: { type: String },
  address: {
    city: { type: String, required: true },
    full_address: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  social_links: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String }
  },
  logo_url: { type: String },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

organizationSchema.pre('save', function (next) {
    console.log('Pre-save hook:', this);
    next();
});

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;
