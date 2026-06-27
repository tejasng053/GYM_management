import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMember extends Document {
  id: string;
  name: string;
  avatar: string;
  status: 'Active' | 'Inactive' | 'Frozen';
  absentDays: number;
  weeklySplit: Record<string, any>;
  nutrition: {
    strategy: string;
    protein: number;
    carbs: number;
    fats: number;
    targetIntake: number;
  };
  telemetry: {
    currentWeight: number;
    weightLoss: number;
    weightHistory: Array<{ date: string; weight: number }>;
  };
  subscriptionEnd: string;
  subscriptionTier: string;
  stridePoints: number;
  streakDays: number;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  joinDate?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: {
    conditions: string[];
    allergies: string[];
    bloodGroup: string;
    notes: string;
  };
  bodyMeasurements?: Array<{
    height: number;
    bodyFatPercent: number;
    bmi: number;
    chest: number;
    waist: number;
    arms: number;
    thighs: number;
    date: string;
  }>;
  membershipPlanId?: string;
  paymentHistory?: Array<{
    id: string;
    date: string;
    amount: number;
    planName: string;
    method: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
    status: 'Paid' | 'Partial' | 'Pending';
    notes?: string;
    couponApplied?: string;
    discount?: number;
  }>;
  freezeHistory?: Array<{
    startDate: string;
    endDate: string;
    reason: string;
    isActive: boolean;
  }>;
  assignedTrainerId?: string;
  profilePhoto?: string;
}

const MemberSchema = new Schema<IMember>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Frozen'], default: 'Active' },
  absentDays: { type: Number, default: 0 },
  weeklySplit: { type: Schema.Types.Mixed, default: {} },
  nutrition: {
    strategy: String,
    protein: Number,
    carbs: Number,
    fats: Number,
    targetIntake: Number,
  },
  telemetry: {
    currentWeight: Number,
    weightLoss: Number,
    weightHistory: [{ date: String, weight: Number }],
  },
  subscriptionEnd: { type: String, required: true },
  subscriptionTier: { type: String, required: true },
  stridePoints: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  phone: String,
  email: String,
  dateOfBirth: String,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  joinDate: String,
  address: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },
  medicalInfo: {
    conditions: [String],
    allergies: [String],
    bloodGroup: String,
    notes: String,
  },
  bodyMeasurements: [{
    height: Number,
    bodyFatPercent: Number,
    bmi: Number,
    chest: Number,
    waist: Number,
    arms: Number,
    thighs: Number,
    date: String,
  }],
  membershipPlanId: String,
  paymentHistory: [{
    id: String,
    date: String,
    amount: Number,
    planName: String,
    method: { type: String, enum: ['Cash', 'UPI', 'Card', 'Bank Transfer'] },
    status: { type: String, enum: ['Paid', 'Partial', 'Pending'] },
    notes: String,
    couponApplied: String,
    discount: Number,
  }],
  freezeHistory: [{
    startDate: String,
    endDate: String,
    reason: String,
    isActive: Boolean,
  }],
  assignedTrainerId: String,
  profilePhoto: String,
}, { timestamps: true });

MemberSchema.index({ id: 1 }, { unique: true });
MemberSchema.index({ name: 'text', email: 'text', phone: 'text' });

const Member: Model<IMember> = mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);

export default Member;