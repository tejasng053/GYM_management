import React, { useState } from 'react';
import { ShieldCheck, Dumbbell, User, Flame, Activity, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Member } from '../types';

interface LoginViewProps {
  onLogin: (role: 'owner' | 'trainer' | 'member', selectedMemberId?: string) => void;
  members: Member[];
}

export default function LoginView({ onLogin, members }: LoginViewProps) {
  const [selectedRole, setSelectedRole] = useState<'owner' | 'trainer' | 'member'>('trainer');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');

  // Preset credentials for simulation
  const credentials = {
    owner: { pin: '7777', name: 'Guru Vikram (Owner)' },
    trainer: { pin: '1111', name: 'Coach Dev (Trainer)' },
    member: { pin: '5555', name: 'Athlete Hub' }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = credentials[selectedRole].pin;
    
    if (passcode === correctPin) {
      onLogin(selectedRole, selectedRole === 'member' ? selectedMemberId : undefined);
    } else {
      setErrorMsg(`Incorrect passcode for ${selectedRole.toUpperCase()}. Hint: use ${correctPin}`);
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleQuickLogin = (role: 'owner' | 'trainer' | 'member') => {
    const defaultMemberId = role === 'member' ? selectedMemberId : undefined;
    onLogin(role, defaultMemberId);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-[#FF2E2E]/20 selection:text-white">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Decorative Brand Frame */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[#FF2E2E]" />

      <div className="w-full max-w-md bg-[#121418] border-2 border-white/10 p-8 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.8)] relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-br from-[#FF2E2E]/20 to-[#FF2E2E]/5 border border-[#FF2E2E]/30 mb-4 rounded-none">
            <Activity className="h-8 w-8 text-[#FF2E2E]" />
          </div>
          <h1 className="font-sans text-3xl font-black uppercase tracking-tighter text-white flex items-center justify-center gap-2">
            <span>IRON <span className="text-[#FF2E2E]">HAVEN</span></span>
          </h1>
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E2E] animate-pulse" />
            <p className="font-mono text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
              STRONGER EVERYDAY // Bangalore
            </p>
          </div>
        </div>

        {/* Role Segment Selector */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-[#1A1D24] border border-white/5 rounded-none mb-6">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('owner');
              setErrorMsg('');
              setPasscode('');
            }}
            className={`py-3 flex flex-col items-center gap-1 transition-all uppercase font-sans text-[10px] font-black tracking-wider border cursor-pointer ${
              selectedRole === 'owner'
                ? 'bg-[#FF2E2E] text-white border-[#FF2E2E] shadow-lg shadow-[#FF2E2E]/10'
                : 'bg-transparent text-white/40 border-transparent hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Owner</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('trainer');
              setErrorMsg('');
              setPasscode('');
            }}
            className={`py-3 flex flex-col items-center gap-1 transition-all uppercase font-sans text-[10px] font-black tracking-wider border cursor-pointer ${
              selectedRole === 'trainer'
                ? 'bg-[#FF2E2E] text-white border-[#FF2E2E] shadow-lg shadow-[#FF2E2E]/10'
                : 'bg-transparent text-white/40 border-transparent hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <Dumbbell className="h-4 w-4" />
            <span>Trainer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('member');
              setErrorMsg('');
              setPasscode('');
            }}
            className={`py-3 flex flex-col items-center gap-1 transition-all uppercase font-sans text-[10px] font-black tracking-wider border cursor-pointer ${
              selectedRole === 'member'
                ? 'bg-[#FF2E2E] text-white border-[#FF2E2E] shadow-lg shadow-[#FF2E2E]/10'
                : 'bg-transparent text-white/40 border-transparent hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Member</span>
          </button>
        </div>

        {/* Role Description Hint */}
        <div className="bg-[#1A1D24] border-l-2 border-[#FF2E2E] p-3 mb-6">
          <p className="font-mono text-[9px] uppercase font-black tracking-widest text-[#FF2E2E]">
            {selectedRole === 'owner' ? 'Administrative Overlord' : selectedRole === 'trainer' ? 'Certified Coach Desk' : 'Athlete Portal Gateway'}
          </p>
          <p className="font-serif text-[11px] text-white/60 italic mt-0.5 leading-relaxed">
            {selectedRole === 'owner' 
              ? 'Oversee absolute metrics, staff payroll payouts, gym ledger accounts, live occupancy, and equipment.' 
              : selectedRole === 'trainer'
              ? 'Build customized physical fitness strategies, configure high-protein diet schedules, and log entries.'
              : 'Access your specific biometric telemetry weights, hydration logs, and active daily streak monitors.'}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          {/* Member selector (only visible for Member role) */}
          {selectedRole === 'member' && (
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5 font-bold">
                Select Athlete File
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full bg-[#1A1D24] border border-white/10 text-white text-xs py-2.5 px-3 focus:outline-none focus:border-[#FF2E2E] font-sans font-bold"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.id})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold">
                Passcode (PIN)
              </label>
              <span className="font-mono text-[9px] text-[#FF2E2E] font-bold">
                Simulation PIN: {credentials[selectedRole].pin}
              </span>
            </div>
            
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                placeholder={`Enter ${credentials[selectedRole].pin} or click below`}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#1A1D24] border border-white/10 focus:border-[#FF2E2E] text-white text-xs px-4 py-3 pr-10 focus:outline-none font-mono tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors focus:outline-none"
              >
                {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="text-[10px] font-mono uppercase font-black text-[#FF2E2E] bg-[#FF2E2E]/5 border border-[#FF2E2E]/20 p-2 text-center">
              {errorMsg}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full bg-[#FF2E2E] hover:bg-[#FF2E2E]/90 text-white font-sans text-xs font-black uppercase py-3.5 tracking-widest transition-all shadow-md hover:shadow-[#FF2E2E]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Authenticate Access</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Quick access bypass button */}
            <button
              type="button"
              onClick={() => handleQuickLogin(selectedRole)}
              className="w-full bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-mono font-bold uppercase py-2.5 tracking-wider border border-white/5 transition-all cursor-pointer"
            >
              ⚡ Quick Access (Skip PIN)
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-white/5 text-center">
          <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
            FACILITY CONTROL SYSTEM v3.4.1 // BANGALORE
          </p>
        </div>

      </div>
    </div>
  );
}
