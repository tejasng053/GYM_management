import React, { useState } from 'react';
import { Search, Bell, Settings as SettingsIcon, LogIn, Lock, ShieldCheck, ShieldAlert, User, Dumbbell } from 'lucide-react';
import { Member, Notification } from '../types';
import NotificationCenter from './NotificationCenter';

interface TopBarProps {
  onCheckInClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  members: Member[];
  onSelectMember: (member: Member) => void;
  activeTab: string;
  userRole: 'owner' | 'trainer' | 'member';
  selectedMember: Member;
  onCheckInMember: (memberId: string) => void;
  notifications: Notification[];
  onUpdateNotifications: (notifications: Notification[]) => void;
  onNavigate: (tab: string) => void;
}

export default function TopBar({
  onCheckInClick,
  searchQuery,
  setSearchQuery,
  members,
  onSelectMember,
  activeTab,
  userRole,
  selectedMember,
  onCheckInMember,
  notifications,
  onUpdateNotifications,
  onNavigate
}: TopBarProps) {
  const [showResults, setShowResults] = useState(false);

  const filteredMembers = searchQuery.trim()
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleMemberSelect = (member: Member) => {
    onSelectMember(member);
    setSearchQuery('');
    setShowResults(false);
  };

  const getPlaceholder = () => {
    if (userRole === 'member') {
      return 'Search exercises or gym status...';
    }
    switch (activeTab) {
      case 'members':
        return 'Search members, diet plans...';
      case 'attendance':
        return 'Search attendance names or IDs...';
      case 'trainers':
        return 'Search coach specialties...';
      case 'finance':
        return 'Search ledger transactions...';
      default:
        return 'Search members, athlete IDs...';
    }
  };

  const getRoleLabel = () => {
    if (userRole === 'owner') return 'Owner Operations';
    if (userRole === 'trainer') return 'Coaches Desk';
    return 'Active Athlete';
  };

  const getProfileName = () => {
    if (userRole === 'owner') return 'Guru Vikram';
    if (userRole === 'trainer') return 'Coach Dev';
    return selectedMember.name.split(' ')[0];
  };

  return (
    <header className="h-20 bg-brand-surface border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-30 text-white selection:bg-[#FF2E2E]/20">
      
      {/* Search Input Section */}
      <div className="relative w-80">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-white/30">
          <Search className="h-4 w-4" />
        </div>
        <input
          id="global-search-input"
          type="text"
          placeholder={getPlaceholder()}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="w-full bg-brand-surface-low border border-white/10 text-white text-xs pl-11 pr-4 py-2.5 focus:border-[#FF2E2E] focus:outline-none placeholder-white/30 font-sans tracking-wide transition-all"
        />

        {/* Global Search Results dropdown */}
        {showResults && filteredMembers.length > 0 && (
          <div className="absolute top-12 left-0 right-0 bg-brand-surface border border-white/15 shadow-2xl overflow-hidden z-50">
            <div className="px-4 py-2 text-[9px] font-mono uppercase tracking-widest text-white/50 border-b border-white/10 bg-brand-surface-low font-black">
              Database Matches
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleMemberSelect(member)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                >
                  <div className="w-8 h-8 bg-brand-surface-low border border-white/10 flex items-center justify-center text-xs font-black text-white/75 shrink-0">
                    {member.avatar.startsWith('http') ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale"
                      />
                    ) : (
                      <span>{member.avatar}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{member.name}</div>
                    <div className="text-[10px] font-mono text-white/40">
                      {member.id} • <span className="text-[#FF2E2E] font-extrabold">{member.status}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Action Icons & Profile Info */}
      <div className="flex items-center gap-5">
        
        {/* Connection status tag */}
        <span className="hidden lg:flex items-center gap-1.5 font-mono text-[9px] font-black text-white/40 uppercase tracking-widest">
          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
          Iron Haven Bangalore Node
        </span>

        {/* Notification Center */}
        {(userRole === 'owner' || userRole === 'trainer') && (
          <NotificationCenter
            notifications={notifications}
            onUpdateNotifications={onUpdateNotifications}
            onNavigate={(tab) => { onNavigate(tab); }}
          />
        )}

        {/* Quick Check-in CTA (Owner/Trainer can launch checkin, Member gets locked badge or rapid checkin) */}
        {(userRole === 'owner' || userRole === 'trainer') ? (
          <button
            id="topbar-check-in-btn"
            onClick={onCheckInClick}
            className="bg-transparent hover:bg-white/5 border border-white/20 text-white font-sans text-xs font-black uppercase tracking-wider px-4 py-2 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn className="h-3.5 w-3.5 text-[#FF2E2E]" />
            <span>Desk Check-in</span>
          </button>
        ) : selectedMember.absentDays > 0 ? (
          <button
            onClick={() => onCheckInMember(selectedMember.id)}
            className="bg-[#FF2E2E] text-white hover:bg-brand-red-dark font-sans text-xs font-black uppercase tracking-wider px-4 py-2 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Check-In Me Now</span>
          </button>
        ) : (
          <span className="border border-emerald-500/25 text-emerald-400 bg-emerald-500/5 text-[10px] font-sans font-black uppercase px-3 py-1.5 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Checked-In
          </span>
        )}

        {/* Profile Card Block */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
          <div className="text-right hidden md:block">
            <span className="text-[8px] font-mono font-black text-white/40 uppercase tracking-wider block">
              {getRoleLabel()}
            </span>
            <span className="font-sans text-xs font-black text-white block leading-tight">
              {getProfileName()}
            </span>
          </div>

          {/* Avatar Container */}
          <div className="w-10 h-10 border-2 border-white/15 overflow-hidden shrink-0 shadow-[1px_1px_0px_rgba(255,255,255,0.1)] bg-brand-surface-low flex items-center justify-center">
            {userRole === 'owner' ? (
              <div className="w-full h-full bg-[#FF2E2E] text-white flex items-center justify-center font-black text-xs">
                GV
              </div>
            ) : userRole === 'trainer' ? (
              <div className="w-full h-full bg-[#1A1D24] text-white flex items-center justify-center font-black text-xs">
                CD
              </div>
            ) : selectedMember.avatar.startsWith('http') ? (
              <img
                src={selectedMember.avatar}
                alt={selectedMember.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale"
              />
            ) : (
              <div className="w-full h-full bg-[#FF2E2E] text-white flex items-center justify-center font-black text-xs">
                {selectedMember.avatar}
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
