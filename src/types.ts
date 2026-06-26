export interface Exercise {
  name: string;
  sets: string;
}

export interface DaySchedule {
  title: string;
  exercises: Exercise[];
  isRest?: boolean;
}

export interface WeeklySplit {
  [day: string]: DaySchedule;
}

export interface NutritionInfo {
  strategy: string;
  protein: number;
  carbs: number;
  fats: number;
  targetIntake: number;
}

export interface WeightData {
  date: string;
  weight: number;
}

export interface TelemetryInfo {
  currentWeight: number;
  weightLoss: number;
  weightHistory: WeightData[];
}

// Body measurements for progress tracking
export interface BodyMeasurements {
  height: number; // cm
  bodyFatPercent: number;
  bmi: number;
  chest: number; // cm
  waist: number; // cm
  arms: number; // cm
  thighs: number; // cm
  date: string;
}

// Emergency contact
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

// Medical information
export interface MedicalInfo {
  conditions: string[];
  allergies: string[];
  bloodGroup: string;
  notes: string;
}

// Membership plan types
export type PlanType = 'monthly' | 'quarterly' | 'half-yearly' | 'annual';

export interface MembershipPlan {
  id: string;
  name: string;
  type: PlanType;
  durationMonths: number;
  price: number;
  features: string[];
}

// Payment record
export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  planName: string;
  method: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
  status: 'Paid' | 'Partial' | 'Pending';
  notes?: string;
  couponApplied?: string;
  discount?: number;
}

// Membership freeze record
export interface FreezeRecord {
  startDate: string;
  endDate: string;
  reason: string;
  isActive: boolean;
}

// Coupon / discount
export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  validUntil: string;
  maxUses: number;
  usedCount: number;
  applicablePlans: PlanType[];
  description: string;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  status: 'Active' | 'Inactive' | 'Frozen';
  absentDays: number;
  weeklySplit: WeeklySplit;
  nutrition: NutritionInfo;
  telemetry: TelemetryInfo;
  subscriptionEnd: string;
  subscriptionTier: string;
  stridePoints: number;
  streakDays: number;

  // Enhanced fields
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  joinDate?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  medicalInfo?: MedicalInfo;
  bodyMeasurements?: BodyMeasurements[];
  membershipPlanId?: string;
  paymentHistory?: PaymentRecord[];
  freezeHistory?: FreezeRecord[];
  assignedTrainerId?: string;
  profilePhoto?: string; // base64 or URL
}

export interface Trainer {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  load: number;
  maxLoad: number;
  status: 'On Floor' | 'Off Shift' | 'In Class';
  payrollPending: number;

  // Enhanced fields
  phone?: string;
  email?: string;
  salary?: number;
  joinDate?: string;
  assignedMembers?: string[]; // member IDs
}

export interface ExpenseItem {
  category: string;
  amount: number;
  colorClass: string;
}

export interface RevenueWeek {
  week: string;
  amount: number;
  isCurrent?: boolean;
}

export interface FinanceStats {
  dailyRevenue: number;
  dailyRevenueChange: number;
  monthlyProfit: number;
  monthlyProfitChange: number;
  pendingDues: number;
  weeklyRevenue: RevenueWeek[];
  expenses: ExpenseItem[];
}

export interface CheckInLog {
  id: string;
  memberId: string;
  memberName: string;
  timestamp: string;
}

// Notification system
export type NotificationType = 'expiry' | 'absence' | 'birthday' | 'welcome' | 'equipment' | 'payment' | 'stock' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionTarget?: string; // tab to navigate to
  memberId?: string;
}

// Inventory system
export interface InventoryItem {
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

// Enhanced equipment
export interface EquipmentItem {
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
