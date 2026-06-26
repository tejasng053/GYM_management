import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Calendar, 
  Download, 
  BarChart3, 
  Plus, 
  DollarSign, 
  IndianRupee 
} from 'lucide-react';
import { FinanceStats, ExpenseItem } from '../types';

interface FinanceViewProps {
  finance: FinanceStats;
  onUpdateFinance: (updatedFinance: FinanceStats) => void;
}

export default function FinanceView({
  finance,
  onUpdateFinance
}: FinanceViewProps) {
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [recordType, setRecordType] = useState<'income' | 'expense'>('income');
  const [recordAmount, setRecordAmount] = useState('');
  const [recordLabel, setRecordLabel] = useState('');
  const [recordCategory, setRecordCategory] = useState('Rent');

  const totalExpenses = finance.expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(recordAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const updated = { ...finance };

    if (recordType === 'income') {
      // Add daily revenue and update today's weekly bar chart
      updated.dailyRevenue += parsedAmount;
      const currentWeek = updated.weeklyRevenue.find(w => w.isCurrent);
      if (currentWeek) {
        currentWeek.amount += parsedAmount;
      }
      updated.monthlyProfit += parsedAmount;
    } else {
      // Add expense category or modify existing
      const existingExpenseIndex = updated.expenses.findIndex(ex => ex.category.toLowerCase() === recordCategory.toLowerCase());
      if (existingExpenseIndex !== -1) {
        updated.expenses[existingExpenseIndex].amount += parsedAmount;
      } else {
        updated.expenses.push({
          category: recordCategory,
          amount: parsedAmount,
          colorClass: 'bg-zinc-700'
        });
      }
      updated.monthlyProfit -= parsedAmount;
    }

    onUpdateFinance(updated);
    setShowAddRecord(false);
    setRecordAmount('');
    setRecordLabel('');
  };

  const handleClearAlert = () => {
    const updated = { ...finance, pendingDues: 0 };
    onUpdateFinance(updated);
  };

  const handleExport = () => {
    alert('Generating financial performance export. Download scheduled for: ironhaven_financials_october.pdf');
  };

  return (
    <div className="space-y-8 animate-fade-in text-white selection:bg-[#FF2E2E]/20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-5 border-b border-white/10">
        <div>
          <h2 className="font-sans text-3xl font-black uppercase tracking-tight text-white">
            Financial Ledger
          </h2>
          <p className="font-serif text-sm text-white/60 italic mt-1">
            Track club operational margins, pending collections, and facility expenses.
          </p>
        </div>

        {/* Action Panel Buttons */}
        <div className="flex gap-2.5">
          <button 
            className="bg-brand-surface border border-white/10 hover:border-[#FF2E2E] px-4 py-2.5 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
          >
            <Calendar className="h-4 w-4 text-[#FF2E2E]" />
            This Month
          </button>
          <button 
            onClick={handleExport}
            className="bg-[#FF2E2E] hover:bg-brand-red-dark text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Download className="h-4 w-4" />
            Export Ledger
          </button>
        </div>
      </div>

      {/* KPI Stats Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* KPI 1: Daily Revenue */}
        <div className="col-span-1 md:col-span-4 bg-brand-surface p-6 border border-white/10 flex flex-col justify-between shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-sans text-[10px] font-black text-white/40 uppercase tracking-widest">
              Daily Revenue
            </h3>
            <TrendingUp className="h-4 w-4 text-[#FF2E2E]" />
          </div>
          <div>
            <div className="font-sans text-4xl font-black text-white tracking-tighter">
              ₹{finance.dailyRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-emerald-400 font-mono text-[10px] font-black flex items-center gap-0.5">
                ▲ {finance.dailyRevenueChange}%
              </span>
              <span className="text-white/40 font-mono text-[9px] uppercase font-bold">vs yesterday</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Monthly Profit */}
        <div className="col-span-1 md:col-span-4 bg-brand-surface p-6 border border-white/10 flex flex-col justify-between shadow-xl relative overflow-hidden">
          {/* Subtle line background shading */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FF2E2E]/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <h3 className="font-sans text-[10px] font-black text-white/40 uppercase tracking-widest">
              Monthly Net Profit
            </h3>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="relative z-10">
            <div className="font-sans text-4xl font-black text-white tracking-tighter">
              ₹{finance.monthlyProfit.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-emerald-400 font-mono text-[10px] font-black flex items-center gap-0.5">
                ▲ {finance.monthlyProfitChange}%
              </span>
              <span className="text-white/40 font-mono text-[9px] uppercase font-bold">vs last month</span>
            </div>
          </div>
        </div>

        {/* Critical Alert Card: Pending Dues */}
        <div className={`col-span-1 md:col-span-4 p-6 border shadow-xl flex flex-col justify-between transition-all duration-300 ${
          finance.pendingDues > 0 
            ? 'bg-[#FF2E2E]/5 border-[#FF2E2E]/40 text-white' 
            : 'bg-brand-surface border-white/10'
        }`}>
          <div className="flex justify-between items-start mb-6">
            <h3 className={`font-sans text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
              finance.pendingDues > 0 ? 'text-[#FF2E2E]' : 'text-white/40'
            }`}>
              <AlertTriangle className={`h-4 w-4 ${finance.pendingDues > 0 ? 'animate-pulse' : ''}`} />
              Outstanding Accounts
            </h3>
            {finance.pendingDues > 0 && (
              <span className="bg-[#FF2E2E] text-white font-mono text-[9px] font-black px-1.5 py-1 uppercase tracking-wide">
                Pending
              </span>
            )}
          </div>
          
          <div>
            <div className={`font-mono text-[9px] uppercase tracking-wider mb-1 font-bold ${finance.pendingDues > 0 ? 'text-[#FF2E2E]/85' : 'text-white/40'}`}>
              Pending Athlete Dues
            </div>
            <div className={`font-sans text-4xl font-black tracking-tighter ${finance.pendingDues > 0 ? 'text-[#FF2E2E]' : 'text-white/40'}`}>
              ₹{finance.pendingDues.toLocaleString()}
            </div>
            
            {finance.pendingDues > 0 ? (
              <button 
                onClick={handleClearAlert}
                className="mt-4 w-full bg-transparent hover:bg-white/5 border border-[#FF2E2E] text-[#FF2E2E] hover:text-white font-sans text-[10px] uppercase font-black py-2.5 transition-all cursor-pointer"
              >
                Clear Outstanding Dues
              </button>
            ) : (
              <p className="text-[10px] text-emerald-400 mt-2 font-mono uppercase font-black tracking-wider">
                ✓ All subscriptions clear
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bar Chart & Pie Chart Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Revenue Trends Bar Chart */}
        <div className="md:col-span-8 bg-brand-surface border border-white/10 p-6 flex flex-col shadow-xl h-96">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-sans text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="h-4.5 w-4.5 text-[#FF2E2E]" />
              Weekly Revenue Trends
            </h3>
            <span className="font-mono text-[9px] text-white/40 font-bold uppercase">Dynamic simulation</span>
          </div>

          {/* Bar Charts Mock Container */}
          <div className="flex-1 flex items-end gap-3 md:gap-5 justify-between border-b border-white/10 pb-2 pt-6">
            {finance.weeklyRevenue.map((w, idx) => {
              // Calculate proportion height
              const maxAmount = 30000;
              const percent = Math.min(95, (w.amount / maxAmount) * 100);
              const isActive = w.isCurrent;

              return (
                <div key={idx} className="w-full flex flex-col items-center gap-2.5 group cursor-pointer">
                  {/* The bar element */}
                  <div className="w-full relative h-48 flex items-end">
                    <div 
                      className={`w-full transition-all duration-300 relative ${
                        isActive 
                          ? 'bg-[#FF2E2E]' 
                          : 'bg-white/10 group-hover:bg-[#FF2E2E]/40'
                      }`}
                      style={{ height: `${percent}%` }}
                    >
                      {/* Amount tooltip on hover */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-brand-surface-low border border-[#FF2E2E] px-2 py-0.5 text-[9px] text-white font-mono transition-opacity whitespace-nowrap z-25">
                        ₹{w.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <span className={`font-mono text-[10px] uppercase font-black ${
                    isActive ? 'text-[#FF2E2E]' : 'text-white/40 group-hover:text-white'
                  }`}>
                    {w.week}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="md:col-span-4 bg-brand-surface border border-white/10 p-6 flex flex-col shadow-xl h-96 justify-between">
          <div>
            <h3 className="font-sans text-xs font-black text-white uppercase tracking-widest mb-6">
              Expense Breakdown
            </h3>

            {/* Custom Circular Donut Chart */}
            <div className="flex justify-center mb-6 relative">
              <div className="w-28 h-28 rounded-full border-[14px] border-white/5 border-t-[#FF2E2E] border-r-white/20 border-b-white/40 transform rotate-45 flex items-center justify-center">
                <div className="transform -rotate-45 font-sans text-xs font-black text-white">
                  ₹{totalExpenses.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Expense breakdown item list */}
            <div className="space-y-3">
              {finance.expenses.map((ex, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 ${ex.category === 'Rent' ? 'bg-[#FF2E2E]' : ex.category === 'Salaries' ? 'bg-white/70' : 'bg-white/30'} rounded-none`} />
                    <span className="font-sans text-[11px] text-white/60 uppercase font-black">
                      {ex.category}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-black text-white">
                    ₹{ex.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick transaction action link */}
          <button
            onClick={() => setShowAddRecord(true)}
            className="w-full bg-brand-surface-low hover:bg-brand-surface border border-white/10 hover:border-[#FF2E2E] text-white py-2.5 font-sans text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Post Transaction
          </button>
        </div>
      </div>

      {/* Post Transaction Dialog Drawer Modal */}
      {showAddRecord && (
        <div className="fixed inset-0 bg-[#0A0B0E]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-surface border border-white/10 max-w-sm w-full p-6 space-y-4 shadow-2xl text-white">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h4 className="font-sans text-xs font-black uppercase text-white">
                Record New Transaction
              </h4>
              <button 
                onClick={() => setShowAddRecord(false)}
                className="text-white/40 hover:text-white font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRecordSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-brand-surface-low p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setRecordType('income')}
                  className={`py-1.5 text-xs font-sans font-black uppercase cursor-pointer transition-all ${
                    recordType === 'income' ? 'bg-[#FF2E2E] text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  Income (Revenue)
                </button>
                <button
                  type="button"
                  onClick={() => setRecordType('expense')}
                  className={`py-1.5 text-xs font-sans font-black uppercase cursor-pointer transition-all ${
                    recordType === 'expense' ? 'bg-[#FF2E2E] text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  Expense (Cost)
                </button>
              </div>

              {/* Amount input */}
              <div>
                <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1.5">
                  Amount (INR - ₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center text-white/30 font-bold text-xs">
                    ₹
                  </div>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000"
                    value={recordAmount}
                    onChange={(e) => setRecordAmount(e.target.value)}
                    className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold pl-8 pr-3 py-2.5 focus:border-[#FF2E2E] focus:outline-none"
                  />
                </div>
              </div>

              {/* Category input */}
              {recordType === 'expense' ? (
                <div>
                  <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1.5">
                    Expense Category
                  </label>
                  <select
                    value={recordCategory}
                    onChange={(e) => setRecordCategory(e.target.value)}
                    className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold py-2.5 px-3 focus:outline-none focus:border-[#FF2E2E]"
                  >
                    <option value="Rent">Rent & Utilities</option>
                    <option value="Salaries">Salaries & Compensation</option>
                    <option value="Maintenance">Equipment Maintenance</option>
                    <option value="Supplements">Supplements & Inventory</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1.5">
                    Label Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Personal Training Plan Upgrade"
                    value={recordLabel}
                    onChange={(e) => setRecordLabel(e.target.value)}
                    className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold px-3 py-2.5 focus:border-[#FF2E2E] focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRecord(false)}
                  className="flex-1 border border-white/10 hover:bg-white/5 text-white py-2.5 text-xs font-sans font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#FF2E2E] hover:bg-brand-red-dark text-white py-2.5 text-xs font-sans font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Confirm Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
