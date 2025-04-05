import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true }, // Company offering the reward
  pointsRequired: { type: Number, required: true }, // Points needed to redeem
  imageUrl: { type: String }, // Optional: to show product image in UI
  quantityAvailable: { type: Number, default: 0 }, // Optional: stock tracking
  category: { type: String }, // Optional: for filtering, e.g., 'Merch', 'Voucher'
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Optional: track who added it
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);
export default Store;