import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IEquipmentItem extends Document {
  id: string;
  name: string;
  category: 'Cardio' | 'Strength' | 'Free Weights' | 'Accessories';
  status: 'Optimal' | 'Requires Attention' | 'Out of Service';
  lastService: string;
  nextService: string;
  notes: string;
  purchaseDate?: string;
  cost?: number;
  warrantyExpiry?: string;
  vendor?: string;
  vendorPhone?: string;
}

const EquipmentSchema = new Schema<IEquipmentItem>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['Cardio', 'Strength', 'Free Weights', 'Accessories'], required: true },
  status: { type: String, enum: ['Optimal', 'Requires Attention', 'Out of Service'], default: 'Optimal' },
  lastService: { type: String, required: true },
  nextService: { type: String, required: true },
  notes: { type: String, default: '' },
  purchaseDate: String,
  cost: Number,
  warrantyExpiry: String,
  vendor: String,
  vendorPhone: String,
}, { timestamps: true });

EquipmentSchema.index({ id: 1 }, { unique: true });
EquipmentSchema.index({ category: 1, status: 1 });

const Equipment: Model<IEquipmentItem> = mongoose.models.Equipment || mongoose.model<IEquipmentItem>('Equipment', EquipmentSchema);

export default Equipment;