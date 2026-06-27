import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITrainer extends Document {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  load: number;
  maxLoad: number;
  status: 'On Floor' | 'Off Shift' | 'In Class';
  payrollPending: number;
  phone?: string;
  email?: string;
  salary?: number;
  joinDate?: string;
  assignedMembers?: string[];
}

const TrainerSchema = new Schema<ITrainer>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  specialty: { type: String, required: true },
  load: { type: Number, default: 0 },
  maxLoad: { type: Number, default: 25 },
  status: { type: String, enum: ['On Floor', 'Off Shift', 'In Class'], default: 'Off Shift' },
  payrollPending: { type: Number, default: 0 },
  phone: String,
  email: String,
  salary: Number,
  joinDate: String,
  assignedMembers: [String],
}, { timestamps: true });

TrainerSchema.index({ id: 1 }, { unique: true });

const Trainer: Model<ITrainer> = mongoose.models.Trainer || mongoose.model<ITrainer>('Trainer', TrainerSchema);

export default Trainer;