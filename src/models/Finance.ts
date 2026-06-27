import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IFinance extends Document {
  dailyRevenue: number;
  dailyRevenueChange: number;
  monthlyProfit: number;
  monthlyProfitChange: number;
  pendingDues: number;
  weeklyRevenue: Array<{
    week: string;
    amount: number;
    isCurrent?: boolean;
  }>;
  expenses: Array<{
    category: string;
    amount: number;
    colorClass: string;
  }>;
}

const FinanceSchema = new Schema<IFinance>({
  dailyRevenue: { type: Number, default: 0 },
  dailyRevenueChange: { type: Number, default: 0 },
  monthlyProfit: { type: Number, default: 0 },
  monthlyProfitChange: { type: Number, default: 0 },
  pendingDues: { type: Number, default: 0 },
  weeklyRevenue: [{
    week: String,
    amount: Number,
    isCurrent: Boolean,
  }],
  expenses: [{
    category: String,
    amount: Number,
    colorClass: String,
  }],
}, { timestamps: true });

const Finance: Model<IFinance> = mongoose.models.Finance || mongoose.model<IFinance>('Finance', FinanceSchema);

export default Finance;