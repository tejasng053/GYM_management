import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Dumbbell, 
  Wrench, 
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  CalendarDays,
  BellRing
} from 'lucide-react';
import { Member, Trainer, FinanceStats } from '../types';

interface DashboardViewProps {
  members: Member[];
  trainers: Trainer[];
  finance: FinanceStats;
  liveOccupancy: number;
  setActiveTab: (tab: string) => void;
  onSelectMember: (member: Member) => void;
}

export default function DashboardView({
  members,
  trainers,
  finance,
  liveOccupancy,
  setActiveTab,
  onSelectMember
}: DashboardViewProps) {
  const [activeRiskTab, setActiveRiskTab] = useState<'retention' | 'expiry'>('retention');

  // Compute some dashboard statistics
  const totalMembers = members.length;
  const atRiskMembers = members.filter(m => m.absentDays >= 7);
  const activeTrainersCount = trainers.filter(t => t.status === 'On Floor' || t.status === 'In Class').length;
  
  // Find top risk members (Absenteeism)
  const topRisks = [...members]
    .filter(m => m.absentDays > 0)
    .sort((a, b) => b.absentDays - a.absentDays)
    .slice(0, 3);

  // Find soonest expiries
  const soonestExpiries = [...members]
    .sort((a, b) => new Date(a.subscriptionEnd).getTime() - new Date(b.subscriptionEnd).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in text-white selection:bg-[#FF2E2E]/20">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-3xl font-black uppercase tracking-tight text-white">
            Facility Dashboard
          </h2>
          <p className="font-serif italic text-sm text-white/60 mt-1">
            Real-time operations, attendance patterns, and facility health monitors.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('attendance')}
            className="bg-brand-surface-low hover:bg-brand-surface border border-white/10 text-white hover:border-[#FF2E2E] px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Calendar className="h-4 w-4 text-[#FF2E2E]" />
            <span>Live Attendance</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Live Occupancy - Solid Crimson Card */}
        <div className="bg-[#FF2E2E] border border-[#FF2E2E]/30 p-6 flex flex-col justify-between shadow-xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12 pointer-events-none group-hover:scale-110 transition-all duration-300" />
          <div className="flex justify-between items-start z-10">
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/80">
              Live Occupancy
            </span>
            <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
          </div>
          <div className="mt-6 z-10">
            <div className="font-sans text-5xl font-black tracking-tighter">
              {liveOccupancy}
            </div>
            <p className="font-serif italic text-xs text-white/90 mt-2">
              Active facility check-ins today
            </p>
          </div>
        </div>

        {/* Total Members - High-Contrast Dark Card */}
        <div className="bg-brand-surface border border-white/10 p-6 flex flex-col justify-between shadow-xl">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
              Active Members
            </span>
            <Users className="h-4 w-4 text-[#FF2E2E]" />
          </div>
          <div className="mt-6">
            <div className="font-sans text-5xl font-black tracking-tighter text-white">
              {totalMembers}
            </div>
            <p className="font-sans text-xs text-white/60 mt-2 font-medium">
              <span className="text-[#FF2E2E] font-extrabold">{atRiskMembers.length}</span> currently flagged at-risk
            </p>
          </div>
        </div>

        {/* Daily Revenue - Elegant Dark Card */}
        <div className="bg-brand-surface border border-white/10 p-6 flex flex-col justify-between shadow-xl">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
              Daily Revenue
            </span>
            <TrendingUp className="h-4 w-4 text-[#FF2E2E]" />
          </div>
          <div className="mt-6">
            <div className="font-sans text-5xl font-black tracking-tighter text-white">
              ₹{finance.dailyRevenue.toLocaleString()}
            </div>
            <p className="font-serif italic text-xs text-emerald-400 font-bold mt-2 flex items-center gap-1">
              +{finance.dailyRevenueChange}% vs yesterday
            </p>
          </div>
        </div>

        {/* Active Trainers - Dark Surface Card */}
        <div className="bg-brand-surface-low border border-white/10 p-6 flex flex-col justify-between shadow-xl">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
              Staffing Load
            </span>
            <Dumbbell className="h-4 w-4 text-[#FF2E2E]" />
          </div>
          <div className="mt-6">
            <div className="font-sans text-5xl font-black tracking-tighter">
              {activeTrainersCount} <span className="text-lg text-white/40 font-normal">/ {trainers.length}</span>
            </div>
            <p className="font-sans text-xs text-white/70 mt-2 font-medium">
              Trainers active on gym floor
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: At Risk list & Operational Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Retention Risk / Expiry Alert (Col-span 7) */}
        <div className="lg:col-span-7 bg-brand-surface border border-white/10 p-6 flex flex-col shadow-xl">
          
          {/* Section tabs */}
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/10">
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveRiskTab('retention')}
                className={`font-sans text-xs font-black uppercase tracking-wider pb-2 focus:outline-none transition-all cursor-pointer ${
                  activeRiskTab === 'retention' 
                    ? 'text-white border-b-2 border-[#FF2E2E]' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                Absentee Risks ({topRisks.length})
              </button>
              <button 
                onClick={() => setActiveRiskTab('expiry')}
                className={`font-sans text-xs font-black uppercase tracking-wider pb-2 focus:outline-none transition-all cursor-pointer ${
                  activeRiskTab === 'expiry' 
                    ? 'text-white border-b-2 border-[#FF2E2E]' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                Subscription Expiries ({soonestExpiries.length})
              </button>
            </div>
            
            <span className="bg-[#FF2E2E]/10 border border-[#FF2E2E]/30 text-[#FF2E2E] font-mono text-[9px] font-black px-2.5 py-1 uppercase tracking-widest">
              Action Center
            </span>
          </div>

          {activeRiskTab === 'retention' ? (
            <div className="space-y-4 flex-1">
              <p className="font-serif italic text-xs text-white/60 mb-1">
                These athletes have missed several consecutive days. Targeted outreach is recommended to maintain active momentum.
              </p>

              <div className="space-y-3">
                {topRisks.map((member) => (
                  <div 
                    key={member.id}
                    onClick={() => {
                      onSelectMember(member);
                      setActiveTab('members');
                    }}
                    className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#FF2E2E]/50 transition-all cursor-pointer group animate-fade-in"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 bg-brand-surface-low border border-white/10 flex items-center justify-center text-xs font-black text-white/60 overflow-hidden">
                        {member.avatar.startsWith('http') ? (
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        ) : (
                          <span>{member.avatar}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-sans text-xs font-black text-white group-hover:text-[#FF2E2E] transition-colors">
                          {member.name}
                        </h4>
                        <p className="font-mono text-[9px] font-bold text-white/40 uppercase mt-0.5">{member.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-black text-[#FF2E2E] block">
                        {member.absentDays} Days Absent
                      </span>
                      <span className="text-[9px] font-serif italic text-white/40 block mt-0.5">
                        Retention Alert
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              <p className="font-serif italic text-xs text-white/60 mb-1">
                Subscribers ending soonest. Clear warning thresholds prevent unauthorized access and drop-off.
              </p>

              <div className="space-y-3">
                {soonestExpiries.map((member) => {
                  const daysLeft = Math.ceil(
                    (new Date(member.subscriptionEnd).getTime() - new Date('2026-06-26').getTime()) / (1000 * 3600 * 24)
                  );
                  const isExpired = daysLeft <= 0;

                  return (
                    <div 
                      key={member.id}
                      className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] transition-all group animate-fade-in"
                    >
                      <div 
                        onClick={() => {
                          onSelectMember(member);
                          setActiveTab('members');
                        }}
                        className="flex items-center gap-3.5 cursor-pointer"
                      >
                        <div className="w-11 h-11 bg-brand-surface-low border border-white/10 flex items-center justify-center text-xs font-black text-white/60 overflow-hidden">
                          {member.avatar.startsWith('http') ? (
                            <img 
                              src={member.avatar} 
                              alt={member.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                            />
                          ) : (
                            <span>{member.avatar}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-sans text-xs font-black text-white group-hover:text-[#FF2E2E] transition-colors">
                            {member.name}
                          </h4>
                          <p className="font-mono text-[9px] font-bold text-white/40 uppercase mt-0.5">
                            {member.id} • {member.subscriptionTier}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-4">
                        <div>
                          <span className={`font-mono text-xs font-black block ${daysLeft <= 3 ? 'text-[#FF2E2E]' : 'text-amber-400'}`}>
                            {isExpired ? 'Expired' : `${daysLeft} ${daysLeft === 1 ? 'Day' : 'Days'} Left`}
                          </span>
                          <span className="text-[9px] font-serif italic text-white/40 block mt-0.5">
                            Ends {member.subscriptionEnd}
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => alert(`Outreach alert containing 'Monsoon Renewal Scheme' sent to ${member.name.split(' ')[0]} successfully!`)}
                          className="bg-[#FF2E2E]/10 hover:bg-[#FF2E2E] hover:text-white border border-[#FF2E2E]/20 text-[#FF2E2E] p-1.5 transition-all text-xs font-mono font-bold flex items-center justify-center cursor-pointer"
                          title="Dispatch subscription alert"
                        >
                          <BellRing className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button 
            onClick={() => setActiveTab('attendance')}
            className="w-full mt-6 border border-white/10 hover:border-[#FF2E2E] bg-brand-surface-low hover:bg-brand-surface text-white font-sans text-xs font-black uppercase py-3 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Manage Attendance & Alerts</span>
            <ArrowRight className="h-4 w-4 text-[#FF2E2E]" />
          </button>
        </div>

        {/* Right Column: Priority Status / Maintenance (Col-span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Unpaid Dues Alert */}
          {finance.pendingDues > 0 && (
            <div className="bg-[#FF2E2E]/5 border border-[#FF2E2E]/30 p-6 flex flex-col justify-between shadow-xl text-white">
              <div className="flex justify-between items-start pb-2 border-b border-[#FF2E2E]/20">
                <h4 className="font-sans text-xs font-black uppercase tracking-wider text-[#FF2E2E] flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-[#FF2E2E] animate-pulse" />
                  Ledger Alert: Unpaid Dues
                </h4>
                <span className="font-mono text-[8px] uppercase font-black text-white bg-[#FF2E2E] px-2 py-0.5 tracking-wider">
                  Critical
                </span>
              </div>
              <div className="my-5">
                <div className="text-white/40 text-[9px] uppercase font-mono tracking-widest font-black">Pending Collections</div>
                <div className="font-sans text-4xl font-black text-[#FF2E2E] tracking-tight mt-1">
                  ₹{finance.pendingDues.toLocaleString()}
                </div>
                <p className="font-serif italic text-xs text-white/60 mt-2">
                  Awaiting subscription clearance approvals for the current billing cycle.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('finance')}
                className="w-full bg-[#FF2E2E] hover:bg-[#FF2E2E]/90 text-white font-sans text-xs font-black uppercase py-3 transition-colors duration-300 tracking-wider shadow-md cursor-pointer"
              >
                Collect Pending Dues
              </button>
            </div>
          )}

          {/* Equipment Maintenance Card */}
          <div className="bg-brand-surface border border-white/10 p-6 flex flex-col justify-between flex-1 shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h4 className="font-sans text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Wrench className="h-4 w-4 text-[#FF2E2E]" />
                Equipment Status
              </h4>
              <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-white/40">
                1 Alert
              </span>
            </div>
            <div className="my-5 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/80 font-sans font-bold">Hack Squat Press 2</span>
                <span className="bg-[#FF2E2E]/10 text-[#FF2E2E] border border-[#FF2E2E]/20 px-2.5 py-0.5 font-mono text-[9px] uppercase font-bold">
                  Cable frayed
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/80 font-sans font-bold">Olympic Bench Press 1</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 font-mono text-[9px] uppercase font-bold">
                  Perfect
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/80 font-sans font-bold">Concept2 Rower</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 font-mono text-[9px] uppercase font-bold">
                  Perfect
                </span>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('equipment')}
              className="w-full border border-white/10 hover:border-[#FF2E2E] bg-brand-surface-low hover:bg-brand-surface text-white font-sans text-xs font-black uppercase py-2.5 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Equipment Health Log</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#FF2E2E]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
