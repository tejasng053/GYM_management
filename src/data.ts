import { Member, Trainer, FinanceStats, MembershipPlan, Coupon, InventoryItem, Notification } from './types';

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  { id: 'plan-monthly', name: 'Standard Monthly', type: 'monthly', durationMonths: 1, price: 1500, features: ['Gym Floor Access', 'Locker Room', 'Basic Equipment'] },
  { id: 'plan-quarterly', name: 'Gold Quarterly', type: 'quarterly', durationMonths: 3, price: 4000, features: ['All Monthly Features', 'Group Classes', 'Diet Consultation'] },
  { id: 'plan-half', name: 'Platinum Half-Yearly', type: 'half-yearly', durationMonths: 6, price: 7000, features: ['All Quarterly Features', 'Personal Trainer (2x/week)', 'Sauna Access'] },
  { id: 'plan-annual', name: 'Elite Annual', type: 'annual', durationMonths: 12, price: 12000, features: ['All Platinum Features', 'Unlimited PT Sessions', 'Free Merchandise', 'Priority Booking'] },
];

export const INITIAL_COUPONS: Coupon[] = [];

export const INITIAL_INVENTORY: InventoryItem[] = [];

export const INITIAL_NOTIFICATIONS: Notification[] = [];

export const INITIAL_MEMBERS: Member[] = [];

export const INITIAL_TRAINERS: Trainer[] = [];

export const INITIAL_FINANCE: FinanceStats = {
  dailyRevenue: 0,
  dailyRevenueChange: 0,
  monthlyProfit: 0,
  monthlyProfitChange: 0,
  pendingDues: 0,
  weeklyRevenue: [
    { week: 'W1', amount: 0 },
    { week: 'W2', amount: 0 },
    { week: 'W3', amount: 0 },
    { week: 'W4', amount: 0, isCurrent: true }
  ],
  expenses: []
};

export const HEATMAP_DAYS = [
  { label: '28', value: 0, active: false, isPrevMonth: true },
  { label: '29', value: 0, active: false }, { label: '30', value: 0, active: false },
  { label: '1', value: 0, active: false }, { label: '2', value: 0, active: false },
  { label: '3', value: 0, active: false }, { label: '4', value: 0, active: false },
  { label: '5', value: 0, active: false }, { label: '6', value: 0, active: false },
  { label: '7', value: 0, active: false }, { label: '8', value: 0, active: false },
  { label: '9', value: 0, active: false }, { label: '10', value: 0, active: false },
  { label: '11', value: 0, active: false }, { label: '12', value: 0, active: false },
  { label: '13', value: 0, active: false }, { label: '14', value: 0, active: false },
  { label: '15', value: 0, active: false }, { label: '16', value: 0, active: false },
  { label: '17', value: 0, active: false }, { label: '18', value: 0, active: false },
  { label: '19', value: 0, active: false }, { label: '20', value: 0, active: false },
  { label: '21', value: 0, active: false }, { label: '22', value: 0, active: false },
  { label: '23', value: 0, active: false }, { label: '24', value: 0, active: false },
  { label: '25', value: 0, active: false }, { label: '26', value: 0, active: false },
  { label: '27', value: 0, active: false }, { label: '28', value: 0, active: false },
  { label: '29', value: 0, active: false }, { label: '30', value: 0, active: false },
  { label: '31', value: 0, active: false }
];
