import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IInventoryItem extends Document {
  id: string;
  name: string;
  category: 'Supplements' | 'Drinks' | 'Merchandise' | 'Accessories';
  quantity: number;
  minStock: number;
  price: number;
  costPrice: number;
  vendor: string;
  lastRestocked: string;
}

const InventorySchema = new Schema<IInventoryItem>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['Supplements', 'Drinks', 'Merchandise', 'Accessories'], required: true },
  quantity: { type: Number, default: 0 },
  minStock: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  costPrice: { type: Number, default: 0 },
  vendor: { type: String, required: true },
  lastRestocked: { type: String, required: true },
}, { timestamps: true });

InventorySchema.index({ id: 1 }, { unique: true });
InventorySchema.index({ category: 1 });

const Inventory: Model<IInventoryItem> = mongoose.models.Inventory || mongoose.model<IInventoryItem>('Inventory', InventorySchema);

export default Inventory;