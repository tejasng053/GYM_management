import mongoose, { Document, Schema } from 'mongoose';

export type PlanType = 'monthly' | 'quarterly' | 'half-yearly' | 'annual';

export interface ICoupon extends Document {
  id: string;
  code: string;
  discountPercent: number;
  validUntil: string;
  maxUses: number;
  usedCount: number;
  applicablePlans: PlanType[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  validUntil: { type: String, required: true },
  maxUses: { type: Number, required: true },
  usedCount: { type: Number, required: true, default: 0 },
  applicablePlans: { type: [String], enum: ['monthly', 'quarterly', 'half-yearly', 'annual'], required: true },
  description: { type: String, required: true },
}, { timestamps: true });

CouponSchema.index({ id: 1 }, { unique: true });
CouponSchema.index({ code: 1 }, { unique: true });

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);