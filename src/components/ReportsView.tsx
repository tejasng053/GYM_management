import React, { useState } from 'react';
import { FileText, Download, Calendar, Users, DollarSign, Wrench, AlertTriangle, TrendingUp } from 'lucide-react';
import { Member, Trainer, FinanceStats, InventoryItem } from '../types';

interface ReportsViewProps {
  members: Member[];
  trainers: Trainer[];
  finance: FinanceStats;
  inventory: InventoryItem[];
  liveOccupancy: number;
}

export default function ReportsView({ members, trainers, finance, inventory, liveOccupancy }: ReportsViewProps) {
  const [activeReport, setActiveReport] = useState<string>('attendance');

  const atRiskMembers = members.filter(m => m.absentDays >= 7);
  const soonExpiring = members.filter(m => {
    const days = Math.ceil((new Date(m.subscriptionEnd).getTime() - new Date('2026-06-26').getTime()) / (1000 * 3600 * 24));
    return days <= 7 && days > 0;
  });
  const expiredMembers = members.filter(m => new Date(m.subscriptionEnd) <= new Date('2026-06-26'));
  const lowStockItems = inventory.filter(i => i.quantity <= i.minStock);
  const totalExpenses = finance.expenses.reduce((a, c) => a + c.amount, 0);

  const downloadCSV = (filename: string, headers: string[], rows: string[][]) => {
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportAttendance = () => {
    downloadCSV('ironhaven_attendance_report.csv',
      ['Member ID', 'Name', 'Status', 'Absent Days', 'Streak', 'Subscription End'],
      members.map(m => [m.id, m.name, m.status, String(m.absentDays), String(m.streakDays), m.subscriptionEnd])
    );
  };

  const exportIncome = () => {
    downloadCSV('ironhaven_income_report.csv',
      ['Metric', 'Value (INR)'],
      [['Daily Revenue', String(finance.dailyRevenue)], ['Monthly Profit', String(finance.monthlyProfit)], ['Pending Dues', String(finance.pendingDues)], ['Total Expenses', String(totalExpenses)]]
    );
  };

  const exportMembers = () => {
    downloadCSV('ironhaven_members_report.csv',
      ['ID', 'Name', 'Phone', 'Email', 'Status', 'Plan', 'Subscription End', 'Absent Days', 'Stride Points'],
      members.map(m => [m.id, m.name, m.phone || '', m.email || '', m.status, m.subscriptionTier, m.subscriptionEnd, String(m.absentDays), String(m.stridePoints)])
    );
  };

  const reports = [
    { id: 'attendance', name: 'Attendance Report', icon: Calendar, color: 'text-blue-400' },
    { id: 'income', name: 'Income Report', icon: DollarSign, color: 'text-emerald-400' },
    { id: 'expiring', name: 'Expiring Memberships', icon: AlertTriangle, color: 'text-amber-400' },
    { id: 'inactive', name: 'Inactive Members', icon: Users, color: 'text-[#FF2E2E]' },
    { id: 'equipment', name: 'Equipment Status', icon: Wrench, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-white selection:bg-[#FF2E2E]/20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-5 border-b border-white/10">
        <div>
          <h2 className="font-sans text-3xl font-black uppercase tracking-tight text-white">Reports Center</h2>
          <p className="font-serif text-sm text-white/60 italic mt-1">Generate, view, and export operational reports.</p>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-brand-surface border border-white/10 p-4 text-center shadow-xl">
          <span className="text-[8px] font-mono font-black uppercase text-white/40 block">Total Members</span>
          <span className="font-sans text-2xl font-black text-white">{members.length}</span>
        </div>
        <div className="bg-brand-surface border border-white/10 p-4 text-center shadow-xl">
          <span className="text-[8px] font-mono font-black uppercase text-white/40 block">At-Risk</span>
          <span className="font-sans text-2xl font-black text-[#FF2E2E]">{atRiskMembers.length}</span>
        </div>
        <div className="bg-brand-surface border border-white/10 p-4 text-center shadow-xl">
          <span className="text-[8px] font-mono font-black uppercase text-white/40 block">Expiring Soon</span>
          <span className="font-sans text-2xl font-black text-amber-400">{soonExpiring.length}</span>
        </div>
        <div className="bg-brand-surface border border-white/10 p-4 text-center shadow-xl">
          <span className="text-[8px] font-mono font-black uppercase text-white/40 block">Monthly Revenue</span>
          <span className="font-sans text-2xl font-black text-emerald-400">₹{(finance.monthlyProfit / 1000).toFixed(0)}K</span>
        </div>
        <div className="bg-brand-surface border border-white/10 p-4 text-center shadow-xl">
          <span className="text-[8px] font-mono font-black uppercase text-white/40 block">Low Stock Items</span>
          <span className="font-sans text-2xl font-black text-purple-400">{lowStockItems.length}</span>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex flex-wrap gap-2">
        {reports.map(r => {
          const Icon = r.icon;
          return (
            <button key={r.id} onClick={() => setActiveReport(r.id)}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-2 ${activeReport === r.id ? 'bg-[#FF2E2E] border-[#FF2E2E] text-white' : 'bg-brand-surface border-white/10 text-white/60 hover:text-white'}`}>
              <Icon className="h-4 w-4" /> {r.name}
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      <div className="bg-brand-surface border border-white/10 p-6 shadow-xl">
        {activeReport === 'attendance' && (
          <div>
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/10">
              <h3 className="font-sans text-sm font-black uppercase text-white">Daily Attendance Report</h3>
              <button onClick={exportAttendance} className="bg-brand-surface-low hover:bg-brand-surface border border-white/10 hover:border-[#FF2E2E] text-white text-[10px] font-black uppercase px-4 py-2 flex items-center gap-2 cursor-pointer transition-all">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[9px] font-mono uppercase text-white/40">
                    <th className="text-left py-3 px-2">ID</th><th className="text-left py-3">Name</th><th className="text-left py-3">Status</th><th className="text-right py-3">Absent Days</th><th className="text-right py-3">Streak</th><th className="text-right py-3 px-2">Sub End</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-2 font-mono text-white/50">{m.id}</td>
                      <td className="py-3 font-black text-white">{m.name}</td>
                      <td className="py-3"><span className={`px-2 py-0.5 text-[9px] font-mono font-black uppercase ${m.absentDays === 0 ? 'text-emerald-400 bg-emerald-500/10' : m.absentDays >= 7 ? 'text-[#FF2E2E] bg-[#FF2E2E]/10' : 'text-amber-400 bg-amber-500/10'}`}>{m.absentDays === 0 ? 'Active Today' : `${m.absentDays}d Away`}</span></td>
                      <td className="py-3 text-right font-mono font-bold">{m.absentDays}</td>
                      <td className="py-3 text-right font-mono font-bold text-amber-400">{m.streakDays}</td>
                      <td className="py-3 text-right font-mono text-white/50 px-2">{m.subscriptionEnd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReport === 'income' && (
          <div>
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/10">
              <h3 className="font-sans text-sm font-black uppercase text-white">Monthly Income Report</h3>
              <button onClick={exportIncome} className="bg-brand-surface-low hover:bg-brand-surface border border-white/10 hover:border-[#FF2E2E] text-white text-[10px] font-black uppercase px-4 py-2 flex items-center gap-2 cursor-pointer transition-all">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-emerald-400">Revenue</h4>
                {[{ label: 'Daily Revenue', val: finance.dailyRevenue }, { label: 'Monthly Profit', val: finance.monthlyProfit }, { label: 'Pending Dues', val: finance.pendingDues }].map((r, i) => (
                  <div key={i} className="flex justify-between items-center p-3 border border-white/5 bg-white/[0.01]">
                    <span className="text-white/60 text-xs">{r.label}</span>
                    <span className="font-mono font-black text-white">₹{r.val.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-[#FF2E2E]">Expenses</h4>
                {finance.expenses.map((e, i) => (
                  <div key={i} className="flex justify-between items-center p-3 border border-white/5 bg-white/[0.01]">
                    <span className="text-white/60 text-xs">{e.category}</span>
                    <span className="font-mono font-black text-white">₹{e.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 border border-[#FF2E2E]/30 bg-[#FF2E2E]/5">
                  <span className="text-[#FF2E2E] text-xs font-black uppercase">Total Expenses</span>
                  <span className="font-mono font-black text-[#FF2E2E]">₹{totalExpenses.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'expiring' && (
          <div>
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/10">
              <h3 className="font-sans text-sm font-black uppercase text-white">Expiring Memberships</h3>
              <button onClick={exportMembers} className="bg-brand-surface-low hover:bg-brand-surface border border-white/10 hover:border-[#FF2E2E] text-white text-[10px] font-black uppercase px-4 py-2 flex items-center gap-2 cursor-pointer transition-all">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </button>
            </div>
            <div className="space-y-3">
              {[...soonExpiring, ...expiredMembers].map(m => {
                const days = Math.ceil((new Date(m.subscriptionEnd).getTime() - new Date('2026-06-26').getTime()) / (1000 * 3600 * 24));
                return (
                  <div key={m.id} className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-surface-low border border-white/10 flex items-center justify-center text-xs font-black text-white/60 overflow-hidden">
                        {m.avatar.startsWith('http') ? <img src={m.avatar} alt={m.name} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale" /> : <span>{m.avatar}</span>}
                      </div>
                      <div>
                        <h4 className="font-sans text-xs font-black text-white">{m.name}</h4>
                        <p className="font-mono text-[9px] text-white/40">{m.id} • {m.subscriptionTier}</p>
                      </div>
                    </div>
                    <span className={`font-mono text-xs font-black ${days <= 0 ? 'text-[#FF2E2E]' : days <= 3 ? 'text-[#FF2E2E]' : 'text-amber-400'}`}>
                      {days <= 0 ? 'EXPIRED' : `${days} days left`}
                    </span>
                  </div>
                );
              })}
              {soonExpiring.length === 0 && expiredMembers.length === 0 && (
                <p className="text-center py-8 text-white/40 font-serif italic text-sm">No expiring or expired memberships found.</p>
              )}
            </div>
          </div>
        )}

        {activeReport === 'inactive' && (
          <div>
            <div className="mb-6 pb-3 border-b border-white/10">
              <h3 className="font-sans text-sm font-black uppercase text-white">Inactive Members (7+ Days Absent)</h3>
            </div>
            <div className="space-y-3">
              {atRiskMembers.sort((a, b) => b.absentDays - a.absentDays).map(m => (
                <div key={m.id} className="flex items-center justify-between p-4 border border-[#FF2E2E]/20 bg-[#FF2E2E]/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-surface-low border border-white/10 flex items-center justify-center text-xs font-black text-white/60 overflow-hidden">
                      {m.avatar.startsWith('http') ? <img src={m.avatar} alt={m.name} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale" /> : <span>{m.avatar}</span>}
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-black text-white">{m.name}</h4>
                      <p className="font-mono text-[9px] text-white/40">{m.id} • {m.phone || 'No phone'}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-black text-[#FF2E2E]">{m.absentDays} Days Absent</span>
                </div>
              ))}
              {atRiskMembers.length === 0 && (
                <p className="text-center py-8 text-white/40 font-serif italic text-sm">All members are active. Great retention!</p>
              )}
            </div>
          </div>
        )}

        {activeReport === 'equipment' && (
          <div>
            <div className="mb-6 pb-3 border-b border-white/10">
              <h3 className="font-sans text-sm font-black uppercase text-white">Equipment Maintenance Report</h3>
            </div>
            <p className="text-xs text-white/50 font-serif italic mb-4">Equipment statuses are managed from the Equipment Audit page. This is a read-only snapshot.</p>
            <div className="bg-white/[0.02] border border-white/5 p-4 text-center text-xs text-white/40">
              <Wrench className="h-6 w-6 mx-auto mb-2 text-[#FF2E2E]/50" />
              Navigate to Equipment Audit for full interactive management.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
