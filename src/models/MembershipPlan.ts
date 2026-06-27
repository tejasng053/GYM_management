import mongoose, { Document, Schema } from 'mongoose';

export type PlanType = 'monthly' | 'quarterly' | 'half-yearly' | 'annual';

export interface IMembershipPlan extends Document {
  id: string;
  name: string;
  type: PlanType;
  durationMonths: number;
  price: number;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MembershipPlanSchema = new Schema<IMembershipPlan>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['monthly', 'quarterly', 'half-yearly', 'annual'], required: true },
  durationMonths: { type: Number, required: true },
  price: { type: Number, required: true },
  features: [String],
}, { timestamps: true });

MembershipPlanSchema.index({ id: 1 }, { unique: true });

export const MembershipPlan = mongoose.model<IMembershipPlan>('MembershipPlan', MembershipPlanSchema);