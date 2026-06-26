import React, { useState } from 'react';
import { 
  Settings, 
  RefreshCw, 
  Users, 
  Dumbbell, 
  Activity, 
  Lock, 
  ShieldCheck, 
  HeartCrack,
  Dumbbell as GymIcon 
} from 'lucide-react';

interface SettingsViewProps {
  onResetData: () => void;
  liveOccupancy: number;
  onUpdateLiveOccupancy: (val: number) => void;
}

export default function SettingsView({
  onResetData,
  liveOccupancy,
  onUpdateLiveOccupancy
}: SettingsViewProps) {
  const [gymCapacity, setGymCapacity] = useState('200');
  const [themeMode, setThemeMode] = useState('Elite Dark');
  const [alertOutreach, setAlertOutreach] = useState(true);

  const handleResetClick = () => {
    if (window.confirm('Are you sure you want to restore the default Iron Haven database? Any added members, weight updates, or posted transactions will be reset.')) {
      onResetData();
      alert('Database restored to factory configuration successfully.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-white selection:bg-[#FF2E2E]/20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-5 border-b border-white/10">
        <div>
          <h2 className="font-sans text-3xl font-black uppercase tracking-tight text-white">
            System Settings
          </h2>
          <p className="font-sans text-sm text-white/60 mt-1">
            Configure system rules, capacity boundaries, notifications, and manage databases.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Gym Configuration parameters */}
        <div className="bg-brand-surface border border-white/10 p-6 space-y-6 shadow-xl">
          <h3 className="font-sans text-sm font-black uppercase text-white pb-2 border-b border-white/10">
            Gym Configuration
          </h3>

          {/* Simulate checkin occupancy slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-sans text-xs font-bold uppercase text-white/60">
                Live Occupancy Simulation ({liveOccupancy} athletes)
              </label>
              <span className="font-mono text-xs text-[#FF2E2E] font-black">
                {Math.round((liveOccupancy / parseInt(gymCapacity)) * 100)}% Capacity
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max={gymCapacity}
              value={liveOccupancy}
              onChange={(e) => onUpdateLiveOccupancy(parseInt(e.target.value))}
              className="w-full accent-[#FF2E2E] cursor-pointer bg-brand-surface-low border border-white/5 h-1.5 rounded-none"
            />
            <p className="text-[10px] font-mono text-white/40 uppercase">
              Updates active dashboards, occupancy widgets and alerts instantly.
            </p>
          </div>

          {/* Maximum facility capacity bounds */}
          <div>
            <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1.5 font-bold">
              Maximum Fire-Safety Capacity
            </label>
            <input
              type="number"
              value={gymCapacity}
              onChange={(e) => setGymCapacity(e.target.value)}
              className="w-full bg-brand-surface-low border border-white/10 text-white text-xs px-3 py-2.5 focus:border-[#FF2E2E] focus:outline-none font-mono font-bold"
            />
          </div>

          {/* Alert outreach system switcher */}
          <div className="flex justify-between items-center p-4 bg-brand-surface-low border border-white/5">
            <div>
              <span className="font-sans text-xs font-bold uppercase text-white block">
                Automated Retention Alerts
              </span>
              <span className="text-[10px] font-mono text-white/40 uppercase">
                Email flagged members absent 7+ consecutive days
              </span>
            </div>
            <input 
              type="checkbox"
              checked={alertOutreach}
              onChange={(e) => setAlertOutreach(e.target.checked)}
              className="rounded-none bg-brand-surface border-white/15 text-[#FF2E2E] focus:ring-0 w-4.5 h-4.5"
            />
          </div>
        </div>

        {/* Right Column: Database and System Recovery */}
        <div className="bg-brand-surface border border-white/10 p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-sans text-sm font-black uppercase text-white pb-2 border-b border-white/10">
              Database Maintenance
            </h3>

            <p className="font-sans text-xs text-white/60 leading-relaxed">
              Testing other configurations or want a fresh start? Use the master reset utility to restore all original mock members, coaches, check-in heatmaps, and transaction balances.
            </p>

            <div className="bg-brand-surface-low p-4 border border-white/5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white font-black uppercase">
                <ShieldCheck className="h-4.5 w-4.5 text-[#FF2E2E]" />
                Active Database Protection
              </div>
              <p className="text-white/40 text-[10px] font-mono leading-relaxed uppercase">
                PERSISTENT STORAGE RUNNING IN LOCAL STORAGE CACHE DECK. PURGES UPON MANUALLY TRIGGERING THE HARD RESET OR RESETTING BROWSER COOKIES.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetClick}
            className="w-full bg-[#FF2E2E] hover:bg-brand-red-dark text-white font-sans text-xs font-black uppercase py-3.5 transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md"
          >
            <RefreshCw className="h-4 w-4" />
            Restore Factory Mockups
          </button>
        </div>
      </div>

    </div>
  );
}
