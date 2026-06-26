import React, { useState } from 'react';
import { 
  Users, 
  Dumbbell, 
  IndianRupee, 
  Plus, 
  CheckCircle, 
  Play, 
  Search, 
  Filter, 
  ChevronDown, 
  UserCheck, 
  Eye, 
  RefreshCw 
} from 'lucide-react';
import { Trainer } from '../types';

interface TrainersViewProps {
  trainers: Trainer[];
  onUpdateTrainers: (updatedTrainers: Trainer[]) => void;
  onUpdatePayroll: (amountCleared: number) => void;
}

export default function TrainersView({
  trainers,
  onUpdateTrainers,
  onUpdatePayroll
}: TrainersViewProps) {
  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [trainerName, setTrainerName] = useState('');
  const [trainerSpecialty, setTrainerSpecialty] = useState('Strength & Conditioning');
  const [trainerMaxLoad, setTrainerMaxLoad] = useState('40');
  
  // Local active roster search query
  const [searchRoster, setSearchRoster] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'On Floor' | 'Off Shift' | 'In Class'>('All');

  const filteredRoster = trainers.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchRoster.toLowerCase()) || t.specialty.toLowerCase().includes(searchRoster.toLowerCase());
    const matchesFilter = statusFilter === 'All' ? true : t.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalMemberLoad = trainers.reduce((sum, curr) => sum + curr.load, 0);
  const totalPayrollPending = trainers.reduce((sum, curr) => sum + curr.payrollPending, 0);
  const averageLoad = Math.round(totalMemberLoad / trainers.length);

  // Status cycle trigger
  const cycleStatus = (id: string) => {
    const updated = trainers.map((t) => {
      if (t.id === id) {
        let nextStatus: 'On Floor' | 'Off Shift' | 'In Class' = 'On Floor';
        if (t.status === 'On Floor') nextStatus = 'In Class';
        else if (t.status === 'In Class') nextStatus = 'Off Shift';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    onUpdateTrainers(updated);
  };

  // Adjust Load
  const adjustLoad = (id: string, delta: number) => {
    const updated = trainers.map((t) => {
      if (t.id === id) {
        return { 
          ...t, 
          load: Math.max(0, Math.min(t.maxLoad, t.load + delta)),
          // Slightly scale pending payroll with load
          payrollPending: Math.max(500, t.payrollPending + (delta * 50))
        };
      }
      return t;
    });
    onUpdateTrainers(updated);
  };

  const handleRunPayroll = () => {
    if (totalPayrollPending === 0) {
      alert('Pending payroll accounts are currently clear.');
      return;
    }
    const confirmed = window.confirm(`Initiating payroll batch run for all ${trainers.length} staff members. This will dispatch ₹${totalPayrollPending.toLocaleString()} through the Bangalore Bank Node. Proceed?`);
    if (confirmed) {
      onUpdatePayroll(totalPayrollPending);
      const updated = trainers.map(t => ({ ...t, payrollPending: 0 }));
      onUpdateTrainers(updated);
      alert('Payroll dispatched successfully! Status: Processing Bank Clearance.');
    }
  };

  const handleAddTrainerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerName.trim()) return;

    const parsedMaxLoad = parseInt(trainerMaxLoad) || 40;
    const newTrainer: Trainer = {
      id: `#TR-0${trainers.length + 1}`,
      name: trainerName,
      avatar: trainerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      specialty: trainerSpecialty,
      load: 0,
      maxLoad: parsedMaxLoad,
      status: 'Off Shift',
      payrollPending: 12000
    };

    onUpdateTrainers([...trainers, newTrainer]);
    setShowAddTrainer(false);
    setTrainerName('');
  };

  return (
    <div className="space-y-8 animate-fade-in text-white selection:bg-[#FF2E2E]/20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-5 border-b border-white/10">
        <div>
          <h2 className="font-sans text-3xl font-black uppercase tracking-tight text-white">
            Trainer Roster
          </h2>
          <p className="font-serif text-sm text-white/60 italic mt-1">
            Active coach load management, specialty designations, and staff payouts.
          </p>
        </div>

        {/* Global Staff Tools */}
        <div className="flex gap-2.5 w-full md:w-auto">
          <button 
            onClick={handleRunPayroll}
            className="flex-1 md:flex-none bg-brand-surface border border-white/10 hover:border-[#FF2E2E] text-white font-sans text-xs font-black uppercase tracking-wider py-3 px-5 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <IndianRupee className="h-4 w-4 text-[#FF2E2E]" />
            <span>Payroll Run</span>
          </button>
          <button 
            onClick={() => setShowAddTrainer(true)}
            className="flex-1 md:flex-none bg-[#FF2E2E] hover:bg-brand-red-dark text-white font-sans text-xs font-black uppercase tracking-wider py-3 px-5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>New Trainer</span>
          </button>
        </div>
      </div>

      {/* KPI Staff Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI 1: Active staff */}
        <div className="bg-brand-surface p-6 border border-white/10 shadow-xl flex flex-col justify-between">
          <span className="font-sans text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">
            Active Trainers
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="font-sans text-4xl font-black text-white tracking-tighter">
              {trainers.length}
            </h3>
            <span className="font-mono text-xs text-[#FF2E2E] font-black bg-[#FF2E2E]/10 px-2 py-0.5">STRONGER EVERYDAY</span>
          </div>
        </div>

        {/* KPI 2: Total Member Load */}
        <div className="bg-brand-surface p-6 border border-white/10 shadow-xl flex flex-col justify-between">
          <span className="font-sans text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">
            Total Member Load
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="font-sans text-4xl font-black text-white tracking-tighter">
              {totalMemberLoad}
            </h3>
            <span className="font-mono text-xs text-white/60 font-bold bg-brand-surface-low px-2 py-0.5">Avg {averageLoad}/coach</span>
          </div>
        </div>

        {/* KPI 3: Pending Payroll comp */}
        <div className="bg-brand-surface p-6 border border-white/10 shadow-xl flex flex-col justify-between">
          <span className="font-sans text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">
            Pending Payroll
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="font-sans text-4xl font-black text-[#FF2E2E] tracking-tighter font-mono">
              ₹{totalPayrollPending.toLocaleString()}
            </h3>
            <span className="font-mono text-xs text-white/60 font-bold bg-brand-surface-low px-2 py-0.5">Due end of month</span>
          </div>
        </div>
      </div>

      {/* Trainer active list */}
      <div className="bg-brand-surface border border-white/10 shadow-xl overflow-hidden">
        
        {/* Table header control bar */}
        <div className="p-4 bg-brand-surface-low border-b border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h3 className="font-sans text-sm font-black uppercase text-white">
            Active Roster
          </h3>

          {/* Filtering tools */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search filter input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
              <input
                type="text"
                placeholder="Filter roster..."
                value={searchRoster}
                onChange={(e) => setSearchRoster(e.target.value)}
                className="bg-brand-surface border border-white/10 text-white text-[10px] pl-8 pr-3 py-1.5 focus:border-[#FF2E2E] focus:outline-none w-40 font-bold"
              />
            </div>

            {/* Status quick tags filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['All', 'On Floor', 'Off Shift', 'In Class'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-3 py-1.5 text-[9px] font-mono font-black uppercase border tracking-wider transition-all cursor-pointer ${
                    statusFilter === status 
                      ? 'bg-[#FF2E2E] border-[#FF2E2E] text-white' 
                      : 'border-white/10 text-white/60 hover:text-white hover:border-white/30'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rows layout */}
        <div className="divide-y divide-white/5">
          {filteredRoster.map((trainer) => (
            <div 
              key={trainer.id}
              className="p-5 flex flex-col sm:flex-row items-center justify-between hover:bg-white/[0.02] transition-all group"
            >
              
              {/* Profile card left details */}
              <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                <div className="w-12 h-12 overflow-hidden border border-white/10 shrink-0 bg-brand-surface-low flex items-center justify-center font-mono text-xs font-black text-white/70">
                  {trainer.avatar.startsWith('http') ? (
                    <img 
                      src={trainer.avatar} 
                      alt={trainer.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-350"
                    />
                  ) : (
                    <span>{trainer.avatar}</span>
                  )}
                </div>

                <div>
                  <h4 className="font-sans text-xs font-black text-white group-hover:text-[#FF2E2E] transition-colors">
                    {trainer.name}
                  </h4>
                  <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest mt-1 font-bold">
                    {trainer.specialty}
                  </p>
                </div>
              </div>

              {/* Metrics & Interactive status actions */}
              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-x-8 gap-y-3 w-full sm:w-auto text-xs">
                
                {/* Active Member Load Adjustments */}
                <div className="text-center sm:text-right">
                  <span className="block text-[8px] font-mono text-white/40 uppercase tracking-widest font-bold">Coach Load</span>
                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={() => adjustLoad(trainer.id, -1)}
                      className="text-white/40 hover:text-[#FF2E2E] font-black font-mono px-1.5 py-0.5 hover:bg-white/5 border border-white/10 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-sans font-black text-white min-w-[42px] inline-block text-center">
                      {trainer.load} <span className="text-[10px] text-white/40 font-normal">/ {trainer.maxLoad}</span>
                    </span>
                    <button 
                      onClick={() => adjustLoad(trainer.id, 1)}
                      className="text-white/40 hover:text-emerald-400 font-black font-mono px-1.5 py-0.5 hover:bg-white/5 border border-white/10 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Trainer Status Cycling */}
                <div className="text-center sm:text-right min-w-[95px]">
                  <span className="block text-[8px] font-mono text-white/40 uppercase tracking-widest font-bold">Current Status</span>
                  <button 
                    onClick={() => cycleStatus(trainer.id)}
                    className="flex items-center justify-center gap-1.5 mt-1.5 mx-auto sm:ml-auto w-full cursor-pointer hover:opacity-80 focus:outline-none"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      trainer.status === 'On Floor' 
                        ? 'bg-[#FF2E2E] animate-pulse' 
                        : trainer.status === 'In Class' 
                        ? 'bg-emerald-500' 
                        : 'bg-white/20'
                     }`} />
                    <span className={`font-mono text-[9px] uppercase font-black tracking-wider ${
                      trainer.status === 'On Floor' 
                        ? 'text-[#FF2E2E]' 
                        : trainer.status === 'In Class' 
                        ? 'text-emerald-400' 
                        : 'text-white/40'
                    }`}>
                      {trainer.status}
                    </span>
                  </button>
                </div>

                {/* Ledger compensation values */}
                <div className="text-center sm:text-right">
                  <span className="block text-[8px] font-mono text-white/40 uppercase tracking-widest font-bold">Comp Pending</span>
                  <span className="font-mono font-black text-white block mt-1">
                    ₹{trainer.payrollPending.toLocaleString()}
                  </span>
                </div>

                {/* Inline Action Cycle trigger button */}
                <button 
                  onClick={() => cycleStatus(trainer.id)}
                  title="Cycle status"
                  className="border border-white/10 p-2 hover:border-[#FF2E2E] hover:bg-white/5 text-white/40 hover:text-white transition-all shrink-0 cursor-pointer focus:outline-none"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          ))}

          {filteredRoster.length === 0 && (
            <p className="text-center py-10 text-white/40 italic text-xs font-serif">
              No trainers found matching filter constraints.
            </p>
          )}
        </div>

        {/* Load more button */}
        <div className="p-4 text-center border-t border-white/10 bg-brand-surface-low">
          <button 
            onClick={() => alert('All registered coaches loaded.')}
            className="font-mono text-[10px] text-[#FF2E2E] hover:text-[#FF2E2E]/80 font-black uppercase tracking-widest transition-colors cursor-pointer"
          >
            Load More
          </button>
        </div>
      </div>

      {/* Add Trainer Dialog Drawer Modal */}
      {showAddTrainer && (
        <div className="fixed inset-0 bg-[#0A0B0E]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-surface border border-white/10 max-w-sm w-full p-6 space-y-4 shadow-2xl text-white">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h4 className="font-sans text-xs font-black uppercase text-white">
                Add New Staff Trainer
              </h4>
              <button 
                onClick={() => setShowAddTrainer(false)}
                className="text-white/40 hover:text-white font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTrainerSubmit} className="space-y-4">
              {/* Full name input */}
              <div>
                <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1.5">
                  Trainer Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cassandra Cole"
                  value={trainerName}
                  onChange={(e) => setTrainerName(e.target.value)}
                  className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold px-3 py-2.5 focus:border-[#FF2E2E] focus:outline-none"
                />
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1.5">
                  Coach Specialty
                </label>
                <select
                  value={trainerSpecialty}
                  onChange={(e) => setTrainerSpecialty(e.target.value)}
                  className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold py-2.5 px-3 focus:outline-none focus:border-[#FF2E2E]"
                >
                  <option value="Strength & Conditioning">Strength & Conditioning</option>
                  <option value="Mobility & Yoga">Mobility & Yoga</option>
                  <option value="HIIT & Endurance">HIIT & Endurance</option>
                  <option value="Olympic Weightlifting">Olympic Weightlifting</option>
                  <option value="Nutrition Specialist">Nutrition Specialist</option>
                </select>
              </div>

              {/* Max capacity load */}
              <div>
                <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1.5">
                  Maximum Athlete Capacity
                </label>
                <input
                  type="number"
                  placeholder="e.g. 40"
                  value={trainerMaxLoad}
                  onChange={(e) => setTrainerMaxLoad(e.target.value)}
                  className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold px-3 py-2.5 focus:border-[#FF2E2E] focus:outline-none font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTrainer(false)}
                  className="flex-1 border border-white/10 hover:bg-white/5 text-white py-2.5 text-xs font-sans font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#FF2E2E] hover:bg-brand-red-dark text-white py-2.5 text-xs font-sans font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Confirm Coach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
