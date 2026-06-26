import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Dumbbell, 
  Wrench, 
  Settings, 
  Plus, 
  Activity,
  DollarSign,
  LogOut,
  ShieldCheck,
  User,
  BrainCircuit,
  Package,
  FileText
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddMemberClick: () => void;
  userRole: 'owner' | 'trainer' | 'member';
  onLogout: () => void;
  selectedMemberName: string;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onAddMemberClick,
  userRole,
  onLogout,
  selectedMemberName
}: SidebarProps) {
  
  // Dynamic navigation options based on active workspace perspective
  const getMenuItems = () => {
    switch (userRole) {
      case 'owner':
        return [
          { id: 'dashboard', name: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'finance', name: 'Financial Ledger', icon: DollarSign },
          { id: 'ai-advisor', name: 'AI Gym Advisor', icon: BrainCircuit },
          { id: 'trainers', name: 'Coaches Roster', icon: Dumbbell },
          { id: 'equipment', name: 'Equipment Status', icon: Wrench },
          { id: 'inventory', name: 'Inventory & Stock', icon: Package },
          { id: 'reports', name: 'Reports Center', icon: FileText },
          { id: 'settings', name: 'System Settings', icon: Settings },
        ];
      case 'trainer':
        return [
          { id: 'dashboard', name: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'attendance', name: 'Attendance Monitor', icon: CalendarCheck },
          { id: 'equipment', name: 'Equipment Status', icon: Wrench },
          { id: 'inventory', name: 'Inventory & Stock', icon: Package },
          { id: 'reports', name: 'Reports Center', icon: FileText },
          { id: 'settings', name: 'System Settings', icon: Settings },
        ];
      case 'member':
      default:
        return [
          { id: 'member-dashboard', name: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'equipment', name: 'Gym Floor Status', icon: Wrench },
          { id: 'settings', name: 'My Profile Settings', icon: Settings },
        ];
    }
  };

  const menuItems = getMenuItems();

  const getRoleIcon = () => {
    if (userRole === 'owner') return <ShieldCheck className="h-4 w-4 text-[#FF2E2E]" />;
    if (userRole === 'trainer') return <Dumbbell className="h-4 w-4 text-[#FF2E2E]" />;
    return <User className="h-4 w-4 text-[#FF2E2E]" />;
  };

  return (
    <aside className="w-64 bg-brand-surface border-r border-white/10 flex flex-col py-8 h-screen sticky top-0 shrink-0 z-40 text-white selection:bg-[#FF2E2E]/20">
      
      {/* Brand Header */}
      <div className="px-6 mb-8 flex flex-col">
        <h1 className="font-sans text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
          <Activity className="h-6.5 w-6.5 text-[#FF2E2E]" />
          <span>IRON <span className="text-[#FF2E2E]">HAVEN</span></span>
        </h1>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E2E]" />
          <p className="font-mono text-[8px] text-white/50 uppercase tracking-[0.2em] font-extrabold">
            STRONGER EVERYDAY // BLR
          </p>
        </div>
      </div>

      {/* Role Indicator Badge */}
      <div className="px-4 mb-6">
        <div className="bg-brand-surface-low border border-white/5 p-3 flex items-center gap-2.5">
          <div className="p-1.5 bg-[#FF2E2E]/10 border border-[#FF2E2E]/20 rounded-none shrink-0">
            {getRoleIcon()}
          </div>
          <div>
            <span className="text-[8px] font-mono uppercase text-white/40 block">Portal Context</span>
            <span className="text-xs font-black uppercase text-white tracking-wide">{userRole} view</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#FF2E2E] text-white pl-3 shadow-md border-l-4 border-white/50'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`h-4 w-4 mr-3 shrink-0 ${isActive ? 'text-white' : 'text-white/40'}`} />
              <span className="font-sans">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Quick Actions at the Bottom */}
      <div className="px-3 mt-auto space-y-2">
        {/* Only Admin/Coaches can add members */}
        {(userRole === 'owner' || userRole === 'trainer') && (
          <button
            id="sidebar-add-member-btn"
            onClick={onAddMemberClick}
            className="w-full bg-[#FF2E2E] hover:bg-[#FF2E2E]/90 text-white font-sans text-xs font-black uppercase py-3 px-4 flex items-center justify-center gap-2 tracking-widest transition-all duration-350 shadow-sm border border-[#FF2E2E]/10 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Athlete</span>
          </button>
        )}

        {userRole === 'member' && (
          <div className="px-4 py-2.5 bg-brand-surface-low border border-white/5 text-center">
            <p className="font-mono text-[8px] text-white/40 uppercase tracking-wider">
              Profile Athlete
            </p>
            <p className="font-sans text-[11px] font-black uppercase text-white mt-0.5 tracking-tight truncate">
              {selectedMemberName}
            </p>
          </div>
        )}

        {/* Switch Portal / Logout Trigger */}
        <button
          onClick={onLogout}
          className="w-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-mono text-[10px] font-bold uppercase py-2.5 px-4 flex items-center justify-center gap-2 transition-all border border-white/5 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5 text-[#FF2E2E]" />
          <span>Switch Portal</span>
        </button>
      </div>
    </aside>
  );
}
