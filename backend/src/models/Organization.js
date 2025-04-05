import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  email: { type: String, required: true },
  phone: String,
  website: String,
  address: {
    city: String,
    full_address: String,
    pincode: String
  },
  social_links: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  logo_url: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now()}
});

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization
