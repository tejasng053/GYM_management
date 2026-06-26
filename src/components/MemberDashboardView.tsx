import React, { useState } from 'react';
import { 
  Flame, 
  Award, 
  Dumbbell, 
  TrendingUp, 
  Calendar, 
  Droplet, 
  Heart, 
  Scale, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  User, 
  MapPin, 
  CalendarCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Member } from '../types';

interface MemberDashboardViewProps {
  member: Member;
  onUpdateMember: (updatedMember: Member) => void;
}

export default function MemberDashboardView({ member, onUpdateMember }: MemberDashboardViewProps) {
  const [activeDay, setActiveDay] = useState<string>('Monday');
  const [pointsLog, setPointsLog] = useState<Array<{ desc: string; pts: number; date: string }>>([
    { desc: 'Welcome bonus points', pts: 100, date: 'June 20' },
    { desc: 'Logged heavy leg squat set', pts: 20, date: 'Yesterday' },
    { desc: 'Check-in attendance streak multiplier', pts: 30, date: 'Yesterday' }
  ]);
  const [successMsg, setSuccessMsg] = useState<string>('');

  const currentPoints = member.stridePoints || 0;
  const currentStreak = member.streakDays || 0;

  // Stride Points Milestones
  const rewards = [
    { id: 'shake', name: 'Premium Whey Protein Shake', cost: 150, desc: 'Available at the Iron Fuel Bar' },
    { id: 'assessment', name: '1-on-1 Form Assessment with Guru Vikram', cost: 300, desc: '30-minute barbell pose check' },
    { id: 'merch', name: 'Iron Haven Athletic Tank Top', cost: 500, desc: 'Heavyweight oversized cotton blend' },
    { id: 'free-month', name: '1-Month Sub Extension (Gold/Platinum)', cost: 1000, desc: 'Credit applied to your next cycle' }
  ];

  // Daily Tasks to earn points
  const dailyTasks = [
    { id: 'checkin', name: 'Check-in Attendance at the Gate', pts: 20, icon: CalendarCheck, type: 'attendance' },
    { id: 'workout', name: 'Complete Daily Workout Split', pts: 25, icon: Dumbbell, type: 'workout' },
    { id: 'water', name: 'Log 3.5 Liters of Water Intake', pts: 10, icon: Droplet, type: 'water' },
    { id: 'macros', name: 'Hit Daily Protein Target', pts: 15, icon: Heart, type: 'nutrition' },
    { id: 'weight', name: 'Record Bodyweight Telemetry', pts: 10, icon: Scale, type: 'weight' }
  ];

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCompleteTask = (taskName: string, pts: number, type: string) => {
    // Update streak and points
    let nextPoints = currentPoints + pts;
    let nextStreak = currentStreak;

    if (type === 'attendance') {
      nextStreak = currentStreak + 1;
      triggerToast(`✓ Checked In! Streak increased to ${nextStreak} Days! +${pts} Stride Points.`);
    } else {
      triggerToast(`✓ Awesome! +${pts} Stride Points logged for: ${taskName}`);
    }

    onUpdateMember({
      ...member,
      stridePoints: nextPoints,
      streakDays: nextStreak
    });

    // Add to local activity log
    setPointsLog([
      { desc: taskName, pts: pts, date: 'Today' },
      ...pointsLog
    ]);
  };

  const handleRedeemReward = (rewardName: string, cost: number) => {
    if (currentPoints < cost) {
      alert(`⚠️ Insufficient balance. You need ${cost - currentPoints} more Stride Points for this reward.`);
      return;
    }

    onUpdateMember({
      ...member,
      stridePoints: currentPoints - cost
    });

    triggerToast(`🎉 Reward Unlocked: ${rewardName}! Voucher dispatched to your Profile QR.`);
  };

  // Determine levels based on points
  const athleteLevel = currentPoints > 600 ? 'Level 4 Diamond Athlete' : currentPoints > 400 ? 'Level 3 Platinum Athlete' : currentPoints > 150 ? 'Level 2 Gold Athlete' : 'Level 1 Bronze Athlete';

  // Subscription expiry info
  const daysLeft = Math.ceil(
    (new Date(member.subscriptionEnd).getTime() - new Date('2026-06-26').getTime()) / (1000 * 3600 * 24)
  );
  const isSoonExpiring = daysLeft <= 5;

  return (
    <div className="space-y-8 animate-fade-in text-white selection:bg-[#FF2E2E]/20">
      
      {/* Toast Notification */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 bg-[#FF2E2E] text-white py-4 px-6 shadow-2xl z-50 font-sans text-xs font-black uppercase tracking-wider border-l-4 border-white flex items-center gap-3.5 animate-slide-in">
          <Sparkles className="h-5 w-5 animate-spin text-amber-300" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-brand-surface border border-white/10 p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FF2E2E]/5 to-transparent rounded-full pointer-events-none translate-x-20 -translate-y-20" />
        
        <div className="space-y-2 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#FF2E2E]/10 border border-[#FF2E2E]/30 text-[#FF2E2E] font-mono text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">
              {member.subscriptionTier}
            </span>
            <span className="bg-white/5 border border-white/10 text-white/70 font-mono text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">
              ID: {member.id}
            </span>
          </div>
          <h2 className="font-sans text-3xl font-black uppercase tracking-tight text-white">
            Welcome Back, <span className="text-[#FF2E2E]">{member.name}</span>
          </h2>
          <p className="font-serif italic text-sm text-white/50">
            Pushing limits at Iron Haven. Track your daily routine, gather Stride Points, and unlock premium perks.
          </p>
        </div>

        {/* Subscription end warning badge */}
        <div className={`p-4 border ${isSoonExpiring ? 'border-[#FF2E2E]/40 bg-[#FF2E2E]/5' : 'border-white/10 bg-white/[0.01]'} shrink-0 text-left min-w-[200px] z-10`}>
          <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-white/40 font-bold">
            <Clock className="h-3 w-3 text-[#FF2E2E]" />
            <span>Membership Lifecycle</span>
          </div>
          <p className="font-sans text-xs font-black text-white uppercase mt-1">
            Ends on: <span className={isSoonExpiring ? 'text-[#FF2E2E]' : 'text-white'}>{member.subscriptionEnd}</span>
          </p>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
            <span className="text-[10px] text-white/50">{daysLeft <= 0 ? 'Expired' : `${daysLeft} days remaining`}</span>
            {isSoonExpiring && (
              <span className="bg-[#FF2E2E] text-white text-[8px] font-mono font-black px-1.5 py-0.5 uppercase">
                Renew Soon
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Level / Streak / Points Stats Bento Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Streak Score Card */}
        <div className="bg-brand-surface border border-white/10 p-6 flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-[#FF2E2E]/40 transition-all">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-extrabold text-white/40 uppercase tracking-widest block">Workout Streak</span>
            <div className="font-sans text-4xl font-black text-white tracking-tight flex items-baseline">
              {currentStreak}
              <span className="text-xs font-normal text-white/40 ml-1">Days</span>
            </div>
            <p className="text-[10px] text-emerald-400 font-mono uppercase font-bold flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 animate-bounce" /> Active Momentum
            </p>
          </div>
          <div className="w-16 h-16 rounded-none bg-[#FF2E2E]/5 border border-[#FF2E2E]/15 flex items-center justify-center shrink-0">
            <Flame className="h-8 w-8 text-[#FF2E2E] animate-pulse" />
          </div>
        </div>

        {/* Stride Point Balance */}
        <div className="bg-brand-surface border border-white/10 p-6 flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-extrabold text-white/40 uppercase tracking-widest block">Stride Points</span>
            <div className="font-sans text-4xl font-black text-amber-400 tracking-tight flex items-baseline">
              {currentPoints}
              <span className="text-xs font-normal text-white/40 ml-1">pts</span>
            </div>
            <p className="text-[10px] text-white/50 font-serif italic">
              Redeemable for platform perks
            </p>
          </div>
          <div className="w-16 h-16 rounded-none bg-amber-500/5 border border-amber-500/15 flex items-center justify-center shrink-0">
            <Coins className="h-8 w-8 text-amber-400" />
          </div>
        </div>

        {/* Athlete Rank */}
        <div className="bg-brand-surface border border-white/10 p-6 flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-extrabold text-white/40 uppercase tracking-widest block">Athlete Tier</span>
            <div className="font-sans text-base font-black text-white uppercase tracking-tight truncate max-w-[200px]">
              {athleteLevel}
            </div>
            <div className="w-full h-1 bg-white/5 mt-2 rounded-none overflow-hidden max-w-[150px]">
              <div 
                className="h-full bg-blue-500 transition-all" 
                style={{ width: `${Math.min(100, (currentPoints / 1000) * 100)}%` }}
              />
            </div>
            <span className="text-[8px] font-mono text-white/40 uppercase block mt-1">
              Next Rank: {currentPoints >= 600 ? 'Peak Master' : 'Platinum Athlete'}
            </span>
          </div>
          <div className="w-16 h-16 rounded-none bg-blue-500/5 border border-blue-500/15 flex items-center justify-center shrink-0">
            <Award className="h-8 w-8 text-blue-400" />
          </div>
        </div>

      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Earn Stride Points & Reward Store (Col-span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Daily Quest Board to Score Points */}
          <div className="bg-brand-surface border border-white/10 p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#FF2E2E]" />
                <h3 className="font-sans text-base font-black uppercase tracking-wider text-white">
                  Daily Quests (Score Points)
                </h3>
              </div>
              <span className="font-mono text-[8px] text-[#FF2E2E] border border-[#FF2E2E]/20 bg-[#FF2E2E]/5 px-2 py-0.5 uppercase font-bold">
                Resets Daily 4:00 AM
              </span>
            </div>

            <p className="font-serif italic text-xs text-white/60">
              Score Stride Points by logging your daily active physical habits below:
            </p>

            <div className="space-y-3">
              {dailyTasks.map((task) => {
                const Icon = task.icon;
                return (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-3.5 border border-white/5 bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.03] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#FF2E2E]">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="font-sans text-xs font-black text-white">
                          {task.name}
                        </h4>
                        <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">
                          +{task.pts} Stride Points {task.type === 'attendance' && '& +1 Streak Day'}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleCompleteTask(task.name, task.pts, task.type)}
                      className="bg-brand-bg hover:bg-[#FF2E2E] hover:text-white border border-white/10 hover:border-[#FF2E2E] text-white/80 font-mono text-[9px] font-black uppercase px-3 py-2 transition-all cursor-pointer"
                    >
                      Log Task
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Points Activity Logs */}
          <div className="bg-brand-surface border border-white/10 p-5 space-y-3.5">
            <h4 className="font-sans text-xs font-black uppercase tracking-wider text-white">
              Recent Points Activity
            </h4>
            <div className="space-y-2">
              {pointsLog.map((log, i) => (
                <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-white/5 last:border-b-0">
                  <span className="text-white/60">{log.desc}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-amber-400 font-extrabold">+{log.pts} pts</span>
                    <span className="font-mono text-[9px] text-white/30">{log.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Reward Store & Nutrition/Routine summary (Col-span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Rewards store */}
          <div className="bg-brand-surface border border-white/10 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <Award className="h-5 w-5 text-amber-400 animate-pulse" />
              <h3 className="font-sans text-base font-black uppercase tracking-wider text-white">
                Iron Havens Reward Store
              </h3>
            </div>

            <p className="font-serif italic text-xs text-white/60">
              Redeem your accrued Stride Points balance to claim exclusive platform vouchers:
            </p>

            <div className="space-y-3">
              {rewards.map((reward) => {
                const canAfford = currentPoints >= reward.cost;
                return (
                  <div 
                    key={reward.id}
                    className={`p-4 border ${canAfford ? 'border-amber-500/20 bg-amber-500/[0.01]' : 'border-white/5 bg-white/[0.005]'} space-y-2 hover:border-amber-500/30 transition-all`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-sans text-xs font-black uppercase text-white">
                          {reward.name}
                        </h4>
                        <p className="text-[10px] text-white/40 font-serif italic mt-0.5">
                          {reward.desc}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-black text-amber-400 shrink-0">
                        {reward.cost} pts
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1.5 border-t border-white/5">
                      <span className="text-[8px] font-mono text-white/35 uppercase">
                        Voucher System
                      </span>
                      <button 
                        disabled={!canAfford}
                        onClick={() => handleRedeemReward(reward.name, reward.cost)}
                        className={`font-sans text-[9px] font-black uppercase px-3 py-1.5 transition-all cursor-pointer ${
                          canAfford 
                            ? 'bg-amber-500 text-black hover:bg-amber-400' 
                            : 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Claim Reward' : 'Locked'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Workout split & Diet plan summary */}
          <div className="bg-brand-surface border border-white/10 p-6 shadow-xl space-y-4">
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-sans text-xs font-black uppercase tracking-wider text-white">
                My Gym Routine & Nutrition
              </h3>
            </div>

            {/* Nutrition split */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-extrabold text-[#FF2E2E] uppercase tracking-wider block">Nutrition Target</span>
              <p className="font-sans text-xs font-bold text-white uppercase">{member.nutrition.strategy}</p>
              
              <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
                <div className="bg-white/5 border border-white/10 p-2 text-center">
                  <span className="text-white/40 block text-[8px] uppercase">Protein</span>
                  <span className="text-white font-black">{member.nutrition.protein}g</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-2 text-center">
                  <span className="text-white/40 block text-[8px] uppercase">Carbs</span>
                  <span className="text-white font-black">{member.nutrition.carbs}g</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-2 text-center">
                  <span className="text-white/40 block text-[8px] uppercase">Fats</span>
                  <span className="text-white font-black">{member.nutrition.fats}g</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-2 text-center">
                  <span className="text-white/40 block text-[8px] uppercase">Calories</span>
                  <span className="text-[#FF2E2E] font-black">{member.nutrition.targetIntake}</span>
                </div>
              </div>
            </div>

            {/* Split */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[9px] font-mono font-extrabold text-[#FF2E2E] uppercase tracking-wider block">Weekly Workout Split</span>
              
              {/* Day filters */}
              <div className="flex flex-wrap gap-1">
                {Object.keys(member.weeklySplit).map((day) => (
                  <button 
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`font-mono text-[9px] px-2 py-1 uppercase tracking-tight transition-all cursor-pointer ${
                      activeDay === day 
                        ? 'bg-[#FF2E2E] text-white font-black' 
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>

              {/* Day exercises */}
              {member.weeklySplit[activeDay] ? (
                <div className="p-3 border border-white/5 bg-white/[0.01] mt-2">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2">
                    <span className="font-sans text-xs font-black uppercase text-white tracking-wide">
                      {member.weeklySplit[activeDay].title}
                    </span>
                    {member.weeklySplit[activeDay].isRest && (
                      <span className="text-[8px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 uppercase">
                        Rest Day
                      </span>
                    )}
                  </div>

                  {!member.weeklySplit[activeDay].isRest ? (
                    <div className="space-y-1.5">
                      {member.weeklySplit[activeDay].exercises.map((ex, index) => (
                        <div key={index} className="flex justify-between items-center text-xs">
                          <span className="text-white/80">{ex.name}</span>
                          <span className="font-mono text-white/40 text-[10px]">{ex.sets}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-serif italic text-xs text-white/50 text-center py-4">
                      Let your muscle fibers recover. Focus on static stretching, mobility flow, and active hydration.
                    </p>
                  )}
                </div>
              ) : (
                <p className="font-serif italic text-xs text-white/50">No schedule defined for {activeDay}.</p>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
