import { Member, Trainer, FinanceStats, MembershipPlan, Coupon, InventoryItem, Notification } from './types';

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  { id: 'plan-monthly', name: 'Standard Monthly', type: 'monthly', durationMonths: 1, price: 1500, features: ['Gym Floor Access', 'Locker Room', 'Basic Equipment'] },
  { id: 'plan-quarterly', name: 'Gold Quarterly', type: 'quarterly', durationMonths: 3, price: 4000, features: ['All Monthly Features', 'Group Classes', 'Diet Consultation'] },
  { id: 'plan-half', name: 'Platinum Half-Yearly', type: 'half-yearly', durationMonths: 6, price: 7000, features: ['All Quarterly Features', 'Personal Trainer (2x/week)', 'Sauna Access'] },
  { id: 'plan-annual', name: 'Elite Annual', type: 'annual', durationMonths: 12, price: 12000, features: ['All Platinum Features', 'Unlimited PT Sessions', 'Free Merchandise', 'Priority Booking'] },
];

export const INITIAL_COUPONS: Coupon[] = [
  { id: 'c1', code: 'MONSOON25', discountPercent: 25, validUntil: '2026-09-30', maxUses: 50, usedCount: 12, applicablePlans: ['quarterly', 'half-yearly', 'annual'], description: 'Monsoon season special discount' },
  { id: 'c2', code: 'NEWJOIN10', discountPercent: 10, validUntil: '2026-12-31', maxUses: 100, usedCount: 34, applicablePlans: ['monthly', 'quarterly', 'half-yearly', 'annual'], description: 'New member welcome discount' },
  { id: 'c3', code: 'ANNUAL15', discountPercent: 15, validUntil: '2026-08-15', maxUses: 20, usedCount: 8, applicablePlans: ['annual'], description: 'Annual plan exclusive offer' },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Whey Protein (1kg)', category: 'Supplements', quantity: 8, minStock: 5, price: 2200, costPrice: 1800, vendor: 'MuscleBlaze India', lastRestocked: '2026-06-10' },
  { id: 'inv-2', name: 'BCAA Powder (300g)', category: 'Supplements', quantity: 3, minStock: 5, price: 900, costPrice: 650, vendor: 'MuscleBlaze India', lastRestocked: '2026-05-25' },
  { id: 'inv-3', name: 'Energy Drink (Can)', category: 'Drinks', quantity: 24, minStock: 10, price: 150, costPrice: 90, vendor: 'Red Bull Dist.', lastRestocked: '2026-06-20' },
  { id: 'inv-4', name: 'Protein Bar (Box/12)', category: 'Supplements', quantity: 6, minStock: 4, price: 1200, costPrice: 850, vendor: 'Yoga Bar India', lastRestocked: '2026-06-15' },
  { id: 'inv-5', name: 'Iron Haven Tank Top', category: 'Merchandise', quantity: 15, minStock: 5, price: 800, costPrice: 350, vendor: 'PrintHouse BLR', lastRestocked: '2026-06-01' },
  { id: 'inv-6', name: 'Gym Gloves (Pair)', category: 'Accessories', quantity: 2, minStock: 5, price: 450, costPrice: 200, vendor: 'Decathlon India', lastRestocked: '2026-05-10' },
  { id: 'inv-7', name: 'Shaker Bottle (700ml)', category: 'Accessories', quantity: 10, minStock: 5, price: 350, costPrice: 150, vendor: 'Boldfit India', lastRestocked: '2026-06-18' },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'expiry', title: 'Membership Expiring', message: "Ananya Nair's membership expires tomorrow (June 27).", timestamp: '2026-06-26T10:00:00', read: false, actionLabel: 'View Member', actionTarget: 'members', memberId: '#IP-1104' },
  { id: 'n2', type: 'expiry', title: 'Membership Expiring Soon', message: "Priya Patel's membership expires in 3 days (June 29).", timestamp: '2026-06-26T10:00:00', read: false, actionLabel: 'Send Reminder', actionTarget: 'members', memberId: '#IP-0772' },
  { id: 'n3', type: 'absence', title: 'Retention Alert', message: 'Aarav Sharma has not visited the gym for 12 days.', timestamp: '2026-06-26T08:00:00', read: false, actionLabel: 'Send Outreach', actionTarget: 'attendance', memberId: '#IP-0821' },
  { id: 'n4', type: 'absence', title: 'Retention Alert', message: 'Priya Patel has not visited the gym for 9 days.', timestamp: '2026-06-26T08:00:00', read: true, memberId: '#IP-0772' },
  { id: 'n5', type: 'equipment', title: 'Service Due', message: 'Commercial Treadmill T3 is out of service. Replacement part order pending.', timestamp: '2026-06-25T14:00:00', read: true, actionLabel: 'Equipment Log', actionTarget: 'equipment' },
  { id: 'n6', type: 'stock', title: 'Low Stock Alert', message: 'BCAA Powder stock is below minimum (3 units remaining).', timestamp: '2026-06-26T07:00:00', read: false, actionLabel: 'View Inventory', actionTarget: 'inventory' },
  { id: 'n7', type: 'stock', title: 'Low Stock Alert', message: 'Gym Gloves stock is critically low (2 units remaining).', timestamp: '2026-06-26T07:00:00', read: false, actionLabel: 'View Inventory', actionTarget: 'inventory' },
  { id: 'n8', type: 'payment', title: 'Payment Received', message: 'Kabir Deshmukh paid ₹4,000 for Gold Quarterly plan via UPI.', timestamp: '2026-06-25T16:30:00', read: true },
  { id: 'n9', type: 'general', title: 'Daily Summary', message: 'Yesterday: 3 new check-ins, ₹42,500 revenue, 2 equipment alerts.', timestamp: '2026-06-26T06:00:00', read: true },
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: '#IP-0492', name: 'Tejas Gowda',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDymXvmYb3eFmpcNrU7FtBqQ6HjovbiFlxKDT_H-CFLcWyaU1iQlj2sMIP98uEySZblANwSxj3Ghp4wRQ7yQ49Di5SQ22xzIgQzcRSEfsFvQ5he4joJIk5GoR-dHn6ND36uHrHaMa7xQaGaSqCLlzscIii6LSwdpUMhjiz8YyWNT0HZFDgUosRESq1CJyoFCG7Vcl0UjSxmU9wNOpsKPmPlfSEwn1QbHqjrOWdjwXfL6DSroJm3VitoUKJ_PSAE_5jCeX_n2OOmz7Kq',
    status: 'Active', absentDays: 0,
    phone: '+91 98765 43210', email: 'tejas.gowda@gmail.com', dateOfBirth: '2000-03-15', gender: 'Male', joinDate: '2026-01-10', address: 'HSR Layout, Bengaluru',
    emergencyContact: { name: 'Ramesh Gowda', phone: '+91 98765 43211', relationship: 'Father' },
    medicalInfo: { conditions: [], allergies: [], bloodGroup: 'B+', notes: 'No known conditions' },
    membershipPlanId: 'plan-half',
    paymentHistory: [
      { id: 'pay-1', date: '2026-01-10', amount: 7000, planName: 'Platinum Half-Yearly', method: 'UPI', status: 'Paid' },
      { id: 'pay-2', date: '2025-07-10', amount: 4000, planName: 'Gold Quarterly', method: 'Cash', status: 'Paid' },
    ],
    bodyMeasurements: [{ height: 175, bodyFatPercent: 18, bmi: 26.9, chest: 102, waist: 84, arms: 36, thighs: 58, date: '2026-06-20' }],
    weeklySplit: {
      Monday: { title: 'Heavy Chest & Triceps', exercises: [{ name: 'Bench Press', sets: '4x8-10' }, { name: 'Incline DB Press', sets: '3x10-12' }, { name: 'Tricep Pushdown', sets: '4x12-15' }] },
      Tuesday: { title: 'Back & Biceps', exercises: [{ name: 'Deadlift', sets: '4x5' }, { name: 'Lat Pulldown', sets: '3x10-12' }, { name: 'Barbell Curl', sets: '3x12' }] },
      Wednesday: { title: 'Active Recovery', exercises: [], isRest: true },
      Thursday: { title: 'Rest Day', exercises: [], isRest: true },
      Friday: { title: 'Heavy Legs & Shoulders', exercises: [{ name: 'Squat', sets: '4x6-8' }, { name: 'Overhead Press', sets: '3x8-10' }, { name: 'Lateral Raises', sets: '4x12-15' }] },
      Saturday: { title: 'Rest Day', exercises: [], isRest: true },
      Sunday: { title: 'Cardio & Core', exercises: [{ name: 'HIIT Treadmill', sets: '20 mins' }, { name: 'Hanging Leg Raises', sets: '3x15' }, { name: 'Planks', sets: '3x1 min' }] }
    },
    nutrition: { strategy: 'High Protein Vegetarian (Paneer, Soya, Dal)', protein: 160, carbs: 320, fats: 65, targetIntake: 2505 },
    telemetry: { currentWeight: 82.5, weightLoss: 1.5, weightHistory: [{ date: '4 Wks Ago', weight: 84.0 }, { date: '3 Wks Ago', weight: 83.5 }, { date: '2 Wks Ago', weight: 83.1 }, { date: '1 Wk Ago', weight: 82.8 }, { date: 'Today', weight: 82.5 }] },
    subscriptionEnd: '2026-07-10', subscriptionTier: 'Gold Elite', stridePoints: 540, streakDays: 14
  },
  {
    id: '#IP-0821', name: 'Aarav Sharma',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClU8AUhW12gDqYLLDMghUYD4VE-Lyyj930sycwFWrGoYhIIrzhLJlHzLHTi42xXpF09OlIV2c3aQKqQXEs21aUiZHk0Q2Gyirk0JXIpi_Exb3XQ03O3RPIszcuo1xjAI503mYja7XXwfsANaiRupP0VG2i58IBGI-uYW3vfR2d5PRiRxCz238zhjXQYJmxwTpzlw0ugFbJZ6O0w3jc2cW4rn5-vF1hqRO_jGCyQwy2NidgUgWk9bItiFM8E2VSIXViDb58OoxygbiH',
    status: 'Active', absentDays: 12,
    phone: '+91 87654 32109', email: 'aarav.sharma@outlook.com', dateOfBirth: '1998-11-22', gender: 'Male', joinDate: '2025-08-25', address: 'Koramangala, Bengaluru',
    emergencyContact: { name: 'Sunita Sharma', phone: '+91 87654 32110', relationship: 'Mother' },
    medicalInfo: { conditions: ['Mild Asthma'], allergies: ['Peanuts'], bloodGroup: 'A+', notes: 'Carries inhaler during workouts' },
    membershipPlanId: 'plan-annual',
    paymentHistory: [
      { id: 'pay-3', date: '2025-08-25', amount: 12000, planName: 'Elite Annual', method: 'Card', status: 'Paid' },
    ],
    weeklySplit: {
      Monday: { title: 'Upper Body Power', exercises: [{ name: 'DB Bench Press', sets: '4x6' }, { name: 'Weighted Pull-ups', sets: '3x6' }, { name: 'Overhead Press', sets: '3x8' }] },
      Tuesday: { title: 'Lower Body Strength', exercises: [{ name: 'Deadlift', sets: '5x5' }, { name: 'Leg Press', sets: '3x10' }] },
      Wednesday: { title: 'Active Recovery', exercises: [], isRest: true },
      Thursday: { title: 'Arms & Shoulders', exercises: [{ name: 'Hammer Curls', sets: '4x10' }, { name: 'Skull Crushers', sets: '4x10' }] }
    },
    nutrition: { strategy: 'Non-Vegetarian lean (Chicken, Eggs, Rice)', protein: 185, carbs: 220, fats: 65, targetIntake: 2205 },
    telemetry: { currentWeight: 75.3, weightLoss: 0.8, weightHistory: [{ date: '4 Wks Ago', weight: 76.1 }, { date: '3 Wks Ago', weight: 75.9 }, { date: '2 Wks Ago', weight: 75.6 }, { date: '1 Wk Ago', weight: 75.4 }, { date: 'Today', weight: 75.3 }] },
    subscriptionEnd: '2026-08-25', subscriptionTier: 'Platinum Club', stridePoints: 320, streakDays: 4
  },
  {
    id: '#IP-0772', name: 'Priya Patel',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfAiwedAxZ8ouXT2XOp5mYCh6t9qRt0AEXADuZh_047EQMOBBMVIAnf9FX-qEk-cWPihMGv2OaBKUdPddJku1bUYp329TaJY184o-bMQG5-bYlBnvh5dfdd0YFwqp95uMHduBnCH9inleL3sMmfcnrDbsX7dhkebTZCWCbkhpVYLfNYCtlNsUza-ARjhGw0V9ioqx3CbB_SaE3nqPO1Nd4KxZGq0jTjchLcD0aHtNbxnA6dh2nseJyu-PQUd2HUwt1fcEm_4HcfCo5',
    status: 'Active', absentDays: 9,
    phone: '+91 76543 21098', email: 'priya.patel@gmail.com', dateOfBirth: '2001-07-04', gender: 'Female', joinDate: '2026-03-29', address: 'Indiranagar, Bengaluru',
    emergencyContact: { name: 'Raj Patel', phone: '+91 76543 21099', relationship: 'Brother' },
    medicalInfo: { conditions: [], allergies: ['Lactose'], bloodGroup: 'O+', notes: 'Uses lactose-free whey' },
    membershipPlanId: 'plan-quarterly',
    paymentHistory: [
      { id: 'pay-4', date: '2026-03-29', amount: 4000, planName: 'Gold Quarterly', method: 'UPI', status: 'Paid' },
    ],
    weeklySplit: {
      Monday: { title: 'Legs & Glutes', exercises: [{ name: 'Hip Thrusts', sets: '4x12' }, { name: 'Romanian Deadlifts', sets: '4x10' }, { name: 'Bulgarian Split Squats', sets: '3x10 each' }] },
      Tuesday: { title: 'Back & Core', exercises: [{ name: 'Lat Pulldowns', sets: '4x10' }, { name: 'Seated Cable Rows', sets: '3x12' }, { name: 'Hanging Knee Raises', sets: '3x15' }] },
      Wednesday: { title: 'Mobility & Yoga', exercises: [], isRest: true },
      Thursday: { title: 'Shoulders & Arms', exercises: [{ name: 'Dumbbell Lateral Raises', sets: '4x15' }, { name: 'Overhead DB Extension', sets: '3x12' }] }
    },
    nutrition: { strategy: 'Intermittent Fasting (Roti, Sabzi, Whey)', protein: 125, carbs: 160, fats: 45, targetIntake: 1545 },
    telemetry: { currentWeight: 58.2, weightLoss: 2.1, weightHistory: [{ date: '4 Wks Ago', weight: 60.3 }, { date: '3 Wks Ago', weight: 59.7 }, { date: '2 Wks Ago', weight: 59.0 }, { date: '1 Wk Ago', weight: 58.6 }, { date: 'Today', weight: 58.2 }] },
    subscriptionEnd: '2026-06-29', subscriptionTier: 'Gold Elite', stridePoints: 410, streakDays: 8
  },
  {
    id: '#IP-0533', name: 'Kabir Deshmukh', avatar: 'KD', status: 'Active', absentDays: 7,
    phone: '+91 65432 10987', email: 'kabir.d@gmail.com', dateOfBirth: '1999-01-30', gender: 'Male', joinDate: '2026-06-01', address: 'Whitefield, Bengaluru',
    membershipPlanId: 'plan-quarterly',
    paymentHistory: [{ id: 'pay-5', date: '2026-06-01', amount: 4000, planName: 'Gold Quarterly', method: 'UPI', status: 'Paid' }],
    weeklySplit: {
      Monday: { title: 'Full Body HIIT', exercises: [{ name: 'Kettlebell Swings', sets: '5x20' }, { name: 'Burpees', sets: '5x15' }, { name: 'Medicine Ball Slams', sets: '4x15' }] },
      Tuesday: { title: 'Mobility Recovery', exercises: [], isRest: true }
    },
    nutrition: { strategy: 'Keto Akhada Diet (High Fat, Low Carb)', protein: 150, carbs: 20, fats: 130, targetIntake: 1850 },
    telemetry: { currentWeight: 79.5, weightLoss: 3.2, weightHistory: [{ date: '4 Wks Ago', weight: 82.7 }, { date: '3 Wks Ago', weight: 81.5 }, { date: '2 Wks Ago', weight: 80.8 }, { date: '1 Wk Ago', weight: 80.1 }, { date: 'Today', weight: 79.5 }] },
    subscriptionEnd: '2026-09-01', subscriptionTier: 'Standard Access', stridePoints: 180, streakDays: 1
  },
  {
    id: '#IP-1104', name: 'Ananya Nair', avatar: 'AN', status: 'Active', absentDays: 2,
    phone: '+91 54321 09876', email: 'ananya.nair@yahoo.com', dateOfBirth: '2002-12-10', gender: 'Female', joinDate: '2025-06-27', address: 'JP Nagar, Bengaluru',
    membershipPlanId: 'plan-annual',
    paymentHistory: [{ id: 'pay-6', date: '2025-06-27', amount: 12000, planName: 'Elite Annual', method: 'Bank Transfer', status: 'Paid' }],
    weeklySplit: {
      Monday: { title: 'Hypertrophy Legs', exercises: [{ name: 'Barbell Back Squats', sets: '4x10' }, { name: 'Lying Leg Curls', sets: '3x12' }] }
    },
    nutrition: { strategy: 'High Protein Vegetarian (Paneer, Soya, Dal)', protein: 110, carbs: 190, fats: 50, targetIntake: 1650 },
    telemetry: { currentWeight: 54.5, weightLoss: 0.5, weightHistory: [{ date: '4 Wks Ago', weight: 55.0 }, { date: 'Today', weight: 54.5 }] },
    subscriptionEnd: '2026-06-27', subscriptionTier: 'Platinum Club', stridePoints: 680, streakDays: 21
  }
];

export const INITIAL_TRAINERS: Trainer[] = [
  { id: '#TR-01', name: 'Guru Vikram Rathore', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIMdSak0m6DcNLNvgvoN4LwPQ2VxYFSX-1MtZSdmhz05jNJQSafOS3r_FvlMYQa_Y1uxvm5qtyDHNk_wrZJ6rvXiY_x6IxessJs5SO1cGv8KbaqFOZHtrqyblTuqVVADpbRrjSbc0hAw9JYFFJLYKv9VNJgQlzlVCy_e3_Xae8IBUHRU3iQNd_y3_xVxwUKUloBXSdawnyK5XIbGqAJXb25DWtQJ-cTKzAx04dtxNvJLqiFSDsoH4oPhDIonxoJj_7-qE-eoJ5iooL', specialty: 'Strength & Conditioning', load: 12, maxLoad: 25, status: 'On Floor', payrollPending: 48000, phone: '+91 99887 76655', salary: 55000, joinDate: '2024-01-15' },
  { id: '#TR-02', name: 'Anjali Mehta', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV77hvOGoFe0bMeUUBnoohsilai0U9Q_O6AxBxLPKGWXO2EFgLLcAd8Qt0f_LwlQYtPtGg-RgZfMAVBhfMsbH5ntO9PS1OMuFCZ8ulb3U9GL_wkfkmKlRAbkGWX9tMdE4scsDAw7RhFBKIEWJq_YRjgAa-HstUP8YoCNj8k_V9G8GtsSN76Wy2F1u3JhrL2fEmT6phGRZurL0WZdjBEy4d9KX9bTz1WgRz8wJxD6OmCKkGpz1ZTZYutJpPteVi0R02KTlY0xCyg3lM', specialty: 'Mobility & Yoga', load: 8, maxLoad: 15, status: 'Off Shift', payrollPending: 32000, phone: '+91 88776 65544', salary: 40000, joinDate: '2024-06-01' },
  { id: '#TR-03', name: 'Devendra Singh', avatar: 'DS', specialty: 'HIIT & Endurance', load: 15, maxLoad: 40, status: 'In Class', payrollPending: 18500, salary: 35000, joinDate: '2025-02-10' },
  { id: '#TR-04', name: 'Arjun Sawant', avatar: 'AS', specialty: 'Olympic Weightlifting', load: 10, maxLoad: 25, status: 'Off Shift', payrollPending: 15000, salary: 38000, joinDate: '2025-05-20' },
  { id: '#TR-05', name: 'Harpreet Singh', avatar: 'HS', specialty: 'Calisthenics & Gymnastics', load: 12, maxLoad: 30, status: 'On Floor', payrollPending: 16000, salary: 36000, joinDate: '2025-08-01' },
];

export const INITIAL_FINANCE: FinanceStats = {
  dailyRevenue: 42500, dailyRevenueChange: 12,
  monthlyProfit: 824000, monthlyProfitChange: 8.4,
  pendingDues: 128500,
  weeklyRevenue: [
    { week: 'W1', amount: 120000 }, { week: 'W2', amount: 180000 },
    { week: 'W3', amount: 140000 }, { week: 'W4', amount: 260000, isCurrent: true },
    { week: 'W5', amount: 160000 }
  ],
  expenses: [
    { category: 'Salaries', amount: 220000, colorClass: 'bg-[#FF3D00]' },
    { category: 'Rent', amount: 150000, colorClass: 'bg-[#1A1A1A]/40' },
    { category: 'Maintenance', amount: 50000, colorClass: 'bg-[#1A1A1A]/70' }
  ]
};

export const HEATMAP_DAYS = [
  { label: '28', value: 0, active: false, isPrevMonth: true },
  { label: '29', value: 1, active: false }, { label: '30', value: 2, active: false },
  { label: '1', value: 1, active: false }, { label: '2', value: 3, active: true },
  { label: '3', value: 2, active: false }, { label: '4', value: 0, active: false },
  { label: '5', value: 0, active: false }, { label: '6', value: 2, active: false },
  { label: '7', value: 3, active: true }, { label: '8', value: 2, active: false },
  { label: '9', value: 1, active: false }, { label: '10', value: 3, active: false },
  { label: '11', value: 0, active: false }, { label: '12', value: 1, active: false },
  { label: '13', value: 2, active: false }, { label: '14', value: 0, active: false },
  { label: '15', value: 3, active: false }, { label: '16', value: 2, active: false },
  { label: '17', value: 1, active: false }, { label: '18', value: 0, active: false },
  { label: '19', value: 1, active: false }, { label: '20', value: 2, active: false },
  { label: '21', value: 3, active: false }, { label: '22', value: 2, active: false },
  { label: '23', value: 1, active: false }, { label: '24', value: 0, active: false },
  { label: '25', value: 2, active: false }, { label: '26', value: 3, active: false },
  { label: '27', value: 2, active: false }, { label: '28', value: 1, active: false },
  { label: '29', value: 0, active: false }, { label: '30', value: 3, active: false },
  { label: '31', value: 2, active: false }
];
