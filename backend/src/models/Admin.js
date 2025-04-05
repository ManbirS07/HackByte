import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["superadmin", "moderator"], default: "moderator" },
  createdAt: { type: Date, default: Date.now }
});

export const Admin = mongoose.model('Admin', adminSchema);
