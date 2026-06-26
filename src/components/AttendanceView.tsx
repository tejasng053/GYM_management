import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Calendar, 
  Download, 
  Flame, 
  CheckCircle, 
  Clock, 
  LogIn, 
  UserCheck, 
  MapPin, 
  ShieldAlert, 
  ChevronDown, 
  Lock 
} from 'lucide-react';
import { Member } from '../types';

interface AttendanceViewProps {
  members: Member[];
  onCheckInMember: (memberId: string) => void;
  onSendEmail: (memberName: string) => void;
  liveOccupancy: number;
  selectedMember: Member;
  onSelectMember: (member: Member) => void;
  userRole: 'owner' | 'trainer' | 'member';
}

export default function AttendanceView({
  members,
  onCheckInMember,
  onSendEmail,
  liveOccupancy,
  selectedMember,
  onSelectMember,
  userRole
}: AttendanceViewProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  // Attendance rate formula based on absent days
  const attendanceRate = Math.max(12, 100 - (selectedMember.absentDays * 8));
  
  // Calculate total monthly sessions
  const totalSessions = Math.max(0, 22 - Math.floor(selectedMember.absentDays * 1.3));

  // Determine attendance status class & description
  const getStatusInfo = () => {
    if (selectedMember.absentDays === 0) {
      return {
        label: 'Elite Athlete Status',
        desc: 'Consistent daily workouts. Exceptional dedication to the platform.',
        color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20',
        badgeColor: 'bg-emerald-500',
        icon: Flame
      };
    } else if (selectedMember.absentDays < 7) {
      return {
        label: 'Consistent Athlete',
        desc: 'Workouts are regular. Returning to the iron floor soon.',
        color: 'text-amber-400 bg-amber-400/5 border-amber-400/20',
        badgeColor: 'bg-amber-500',
        icon: CheckCircle
      };
    } else {
      return {
        label: 'Retention Alert (Inactive)',
        desc: 'Absent for 7+ consecutive days. Coach intervention requested.',
        color: 'text-[#FF2E2E] bg-[#FF2E2E]/5 border-[#FF2E2E]/25',
        badgeColor: 'bg-[#FF2E2E]',
        icon: ShieldAlert
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  // Generate calendar cells (last 31 days) specific to this member
  const generatePersonalHeatmap = () => {
    const cells = [];
    for (let i = 1; i <= 31; i++) {
      const isAbsentPeriod = i > (31 - selectedMember.absentDays);
      let intensity = 0;
      if (!isAbsentPeriod) {
        const seed = selectedMember.name.length + i;
        if (seed % 3 === 0) intensity = 3; // High peak session
        else if (seed % 2 === 0) intensity = 2; // Medium session
        else intensity = 1; // Light recovery session
      }
      cells.push({
        day: i,
        intensity,
        isAbsentPeriod
      });
    }
    return cells;
  };

  const heatmapDays = generatePersonalHeatmap();

  // Generate custom Indian location check-in logs for this member
  const generateIndianLogs = () => {
    const logs = [];
    const locations = [
      'Iron Haven HSR Layout, Bengaluru',
      'Iron Haven Indiranagar, Bengaluru',
      'Iron Haven Koramangala, Bengaluru'
    ];

    if (selectedMember.absentDays === 0) {
      logs.push({
        time: 'Today, 06:15 AM',
        method: 'RFID Smart Card',
        location: locations[0],
        status: 'Checked-in'
      });
    }

    if (selectedMember.absentDays <= 1) {
      logs.push({
        time: 'Yesterday, 06:05 AM',
        method: 'FaceScan Biometrics',
        location: locations[0],
        status: 'Completed'
      });
    }

    if (selectedMember.absentDays <= 3) {
      logs.push({
        time: '3 days ago, 06:22 AM',
        method: 'Coach Approval',
        location: locations[1],
        status: 'Completed'
      });
    }

    if (selectedMember.absentDays <= 5) {
      logs.push({
        time: '5 days ago, 07:10 AM',
        method: 'RFID Smart Card',
        location: locations[0],
        status: 'Completed'
      });
    }

    if (selectedMember.absentDays <= 8) {
      logs.push({
        time: '8 days ago, 06:18 AM',
        method: 'FaceScan Biometrics',
        location: locations[2],
        status: 'Completed'
      });
    }

    if (selectedMember.absentDays <= 11) {
      logs.push({
        time: '11 days ago, 06:30 AM',
        method: 'RFID Smart Card',
        location: locations[0],
        status: 'Completed'
      });
    }

    return logs;
  };

  const checkInLogs = generateIndianLogs();

  const handleExport = () => {
    alert(`Generating customized Attendance Dossier for ${selectedMember.name}. Export complete as: ironhaven_attendance_record_${selectedMember.id.replace('#', '')}.csv`);
  };

  // True if user is admin (owner or trainer)
  const isElevatedUser = userRole === 'owner' || userRole === 'trainer';

  return (
    <div className="space-y-8 animate-fade-in text-white selection:bg-[#FF2E2E]/20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-5 border-b border-white/10">
        <div>
          <span className="font-mono text-[9px] uppercase font-black text-[#FF2E2E] tracking-widest bg-[#FF2E2E]/10 px-2.5 py-1 border border-[#FF2E2E]/20 rounded-none inline-block">
            {isElevatedUser ? 'ADMIN SECURITY DESK' : 'ATHLETE PLATFORM PASS'}
          </span>
          <h2 className="font-sans text-3xl font-black uppercase tracking-tight text-white mt-2.5">
            {isElevatedUser ? 'Athlete Attendance Monitor' : 'My Workout Attendance'}
          </h2>
          <p className="font-serif text-sm text-white/60 italic mt-1">
            {isElevatedUser 
              ? 'Select any active member to review specific attendance density heatmap grids, check-in feeds, and retention status.'
              : 'Track your weekly workout consistency coefficients, monthly check-in densities, and biometric sensor streak.'
            }
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2.5">
          <button 
            onClick={handleExport}
            className="bg-brand-surface border border-white/10 hover:border-[#FF2E2E] px-4 py-2.5 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Dossier
          </button>
        </div>
      </div>

      {/* Member Selector Strip */}
      <div className="bg-brand-surface border border-white/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 bg-brand-surface-low border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
            {selectedMember.avatar.startsWith('http') ? (
              <img 
                src={selectedMember.avatar} 
                alt={selectedMember.name} 
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-brand-surface-low flex items-center justify-center text-sm font-black text-white/60">
                {selectedMember.avatar}
              </div>
            )}
          </div>

          <div className="flex-1 relative">
            <span className="text-[8px] font-mono font-black uppercase text-white/40 tracking-wider block">
              Active Member Focus
            </span>
            {isElevatedUser ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 font-sans text-lg font-black uppercase text-white hover:text-[#FF2E2E] transition-colors focus:outline-none"
                >
                  <span>{selectedMember.name}</span>
                  <ChevronDown className="h-4 w-4 text-white/40" />
                </button>

                {showDropdown && (
                  <div className="absolute top-7 left-0 w-64 bg-brand-surface border border-white/15 shadow-2xl z-50">
                    <div className="p-2.5 bg-brand-surface-low border-b border-white/10 text-[9px] font-mono font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      Select Athlete File
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {members.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            onSelectMember(m);
                            setShowDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${
                            m.id === selectedMember.id ? 'bg-[#FF2E2E] text-white' : 'text-white font-bold'
                          }`}
                        >
                          <span className="text-xs">{m.name}</span>
                          <span className={`font-mono text-[9px] ${m.id === selectedMember.id ? 'text-white/80' : 'text-white/40'}`}>
                            {m.id}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="font-sans text-lg font-black uppercase text-white leading-tight">
                  {selectedMember.name}
                </h3>
                <span className="bg-white/5 border border-white/10 text-white/50 text-[8px] font-mono font-black px-1.5 py-0.5 uppercase flex items-center gap-1 shrink-0">
                  <Lock className="h-2 w-2 text-[#FF2E2E]" /> Locked to Profile
                </span>
              </div>
            )}
            <p className="font-mono text-[9px] text-white/40 uppercase mt-0.5">
              Athlete ID: {selectedMember.id} // Zone: HSR Layout, Bengaluru
            </p>
          </div>
        </div>

        {/* Member Check-in CTA */}
        {selectedMember.absentDays > 0 ? (
          <button 
            onClick={() => onCheckInMember(selectedMember.id)}
            className="w-full sm:w-auto bg-[#FF2E2E] hover:bg-brand-red-dark text-white font-sans text-xs font-black uppercase tracking-widest px-6 py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <LogIn className="h-4.5 w-4.5" />
            <span>Mark Present (Check-In)</span>
          </button>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-5 py-3 text-xs font-sans font-black uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="h-4.5 w-4.5 text-emerald-400" />
            <span>Successfully Checked-In Today</span>
          </div>
        )}
      </div>

      {/* Main Grid: Statistics Bento & Custom Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Stats Bento Column (Col-span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Main Attendance Rate Indicator */}
          <div className="bg-brand-surface border border-white/10 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <span className="font-mono text-[9px] font-black uppercase tracking-widest text-white/40 block">
                Consistency Coefficient
              </span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="font-sans text-5xl font-black text-white tracking-tighter">
                  {attendanceRate}%
                </span>
                <span className="font-serif text-xs italic text-white/50">attendance rate</span>
              </div>
              
              {/* Dynamic Progress indicator */}
              <div className="w-full h-2.5 bg-brand-surface-low border border-white/10 mt-4 overflow-hidden rounded-none">
                <div 
                  className={`h-full transition-all duration-500 ${attendanceRate > 80 ? 'bg-emerald-500' : attendanceRate > 50 ? 'bg-amber-500' : 'bg-[#FF2E2E]'}`}
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
            </div>

            <div className={`mt-5 p-4 border rounded-none flex items-start gap-3 ${statusInfo.color}`}>
              <StatusIcon className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-sans text-xs font-black uppercase tracking-wider">
                  {statusInfo.label}
                </h5>
                <p className="font-serif text-[11px] italic opacity-85 mt-0.5 leading-relaxed">
                  {statusInfo.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Core Analytics: Streak & Visits */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Active Streak */}
            <div className="bg-brand-surface border border-white/10 p-5 shadow-xl flex flex-col justify-between">
              <span className="font-mono text-[9px] font-bold uppercase text-white/40 tracking-wider">
                Current Streak
              </span>
              <div className="mt-4">
                <div className="font-sans text-3xl font-black text-[#FF2E2E] flex items-center gap-1.5">
                  <Flame className="h-7 w-7 text-[#FF2E2E]" />
                  <span>{selectedMember.absentDays === 0 ? '5' : '0'}</span>
                </div>
                <p className="font-mono text-[9px] font-extrabold text-white/50 uppercase mt-1">
                  {selectedMember.absentDays === 0 ? 'Consecutive workouts' : 'Streak reset'}
                </p>
              </div>
            </div>

            {/* Total Monthly Sessions */}
            <div className="bg-brand-surface border border-white/10 p-5 shadow-xl flex flex-col justify-between">
              <span className="font-mono text-[9px] font-bold uppercase text-white/40 tracking-wider">
                Monthly Sessions
              </span>
              <div className="mt-4">
                <div className="font-sans text-3xl font-black text-white flex items-center gap-1.5">
                  <Calendar className="h-7 w-7 text-white/40" />
                  <span>{totalSessions} / 24</span>
                </div>
                <p className="font-mono text-[9px] font-extrabold text-white/50 uppercase mt-1">
                  Active days this month
                </p>
              </div>
            </div>

          </div>

          {/* Coach Quick Outreach Alert (visible to owners/trainers when member is absent) */}
          {isElevatedUser && selectedMember.absentDays >= 7 && (
            <div className="bg-[#FF2E2E]/5 border border-[#FF2E2E]/30 p-5 shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="font-sans text-xs font-black uppercase text-[#FF2E2E] tracking-wider flex items-center gap-2">
                  <Mail className="h-4 w-4 animate-bounce" />
                  Retention Outreach Recommended
                </h4>
                <p className="font-serif text-xs text-white/60 italic mt-2 leading-relaxed">
                  {selectedMember.name} has been away from the gym floor for {selectedMember.absentDays} days. Send a coach assess-motivation card today.
                </p>
              </div>
              <button 
                onClick={() => onSendEmail(selectedMember.name)}
                className="w-full mt-4 bg-[#FF2E2E] hover:bg-brand-red-dark text-white py-2.5 text-xs font-sans font-black uppercase tracking-wider transition-colors duration-300 shadow-md cursor-pointer"
              >
                Send Motivation Card
              </button>
            </div>
          )}

        </div>

        {/* Calendar Heatmap Column (Col-span 7) */}
        <div className="lg:col-span-7 bg-brand-surface border border-white/10 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="font-sans text-base font-black uppercase text-white">
                  Physical Workouts Calendar
                </h3>
                <p className="font-serif text-xs text-white/60 italic">
                  Tracking physical facility entries over the last 31 active days.
                </p>
              </div>

              {/* Color key Legend */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-white/5 border border-white/10" title="Rest / No check-in" />
                  <div className="w-3 h-3 bg-[#FF2E2E]/20 border border-[#FF2E2E]/30" title="Light / Recovery" />
                  <div className="w-3 h-3 bg-[#FF2E2E]/50 border border-[#FF2E2E]/60" title="Moderate / Standard" />
                  <div className="w-3 h-3 bg-[#FF2E2E] border border-white/20" title="Peak / Heavy session" />
                </div>
                <span className="font-mono text-[8px] text-white/40 font-bold uppercase tracking-wider">Density</span>
              </div>
            </div>

            {/* Heatmap Grid Calendar */}
            <div className="grid grid-cols-7 gap-1.5 md:gap-2.5 text-center">
              
              {/* Weekday labels */}
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <div key={day} className="font-mono text-[9px] text-white/40 font-black tracking-widest pb-1">
                  {day}
                </div>
              ))}

              {/* Pad calendar start with previous month cells */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={`pad-${i}`} 
                  className="aspect-square bg-white/5 border border-white/[0.03] text-white/10 flex items-center justify-center text-[10px]"
                >
                  -
                </div>
              ))}

              {/* Member specific calendar blocks */}
              {heatmapDays.map((cell, index) => {
                let bgClass = 'bg-white/5 border border-white/10 text-white/70';
                
                if (!cell.isAbsentPeriod) {
                  if (cell.intensity === 1) bgClass = 'bg-[#FF2E2E]/25 border-[#FF2E2E]/35 text-white font-medium';
                  else if (cell.intensity === 2) bgClass = 'bg-[#FF2E2E]/55 border-[#FF2E2E]/65 text-white font-bold';
                  else if (cell.intensity === 3) bgClass = 'bg-[#FF2E2E] border border-white/20 text-white font-black';
                } else {
                  bgClass = 'bg-white/[0.01] border-dashed border-white/10 text-white/10';
                }

                // If check-in happened today (or yesterday)
                const isTodayCell = cell.day === 31 && selectedMember.absentDays === 0;

                return (
                  <div
                    key={index}
                    className={`aspect-square flex flex-col items-center justify-center text-[10px] transition-all relative select-none ${bgClass} ${
                      isTodayCell ? 'ring-2 ring-[#FF2E2E] ring-offset-2 ring-offset-brand-surface font-black' : ''
                    }`}
                  >
                    <span>{cell.day}</span>
                    {isTodayCell && (
                      <span className="absolute bottom-0.5 text-[6px] font-mono tracking-tighter uppercase text-white scale-75 font-black">
                        Today
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 bg-white/[0.02] p-4 border border-white/5 flex items-center gap-3">
            <Clock className="h-4.5 w-4.5 text-[#FF2E2E] shrink-0" />
            <p className="font-mono text-[9px] text-white/40 leading-relaxed uppercase">
              ✓ HEATMAP SYSTEM SYNCED BY RFID SECURE SMART GATEWAY. DOUBLE LOGS ENSURE SESSIONS RECONCILE PERFECTLY WITH ATHLETE STRATEGIES.
            </p>
          </div>

        </div>

      </div>

      {/* Indian Check-in Activity Logs Section */}
      <div className="bg-brand-surface border border-white/10 p-6 shadow-xl">
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#FF2E2E]" />
            <h3 className="font-sans text-base font-black uppercase text-white">
              Physical Access Activity Feed
            </h3>
          </div>
          <span className="font-mono text-[9px] font-black text-white/40 uppercase tracking-widest">
            Latest {checkInLogs.length} Entries
          </span>
        </div>

        <div className="space-y-3">
          {checkInLogs.map((log, idx) => (
            <div 
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] transition-colors gap-3"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="bg-brand-surface-low p-2 text-[#FF2E2E] border border-white/10">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-sans text-xs font-black text-white">
                      {log.location}
                    </span>
                    <span className="bg-white/5 border border-white/10 text-white/50 text-[8px] font-mono px-1.5 py-0.5 uppercase tracking-wider font-extrabold">
                      {log.method}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-white/40 block mt-0.5">
                    Logged: {log.time} // Entry Access Granted
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-block font-sans text-[10px] font-black uppercase px-2.5 py-1 ${
                  log.status === 'Checked-in' 
                    ? 'bg-emerald-500 text-white border border-emerald-600' 
                    : 'bg-white/5 text-white/70 border border-white/10'
                }`}>
                  {log.status}
                </span>
              </div>
            </div>
          ))}

          {checkInLogs.length === 0 && (
            <div className="text-center py-10 text-white/40 border border-dashed border-white/10">
              <Clock className="h-8 w-8 text-[#FF2E2E]/50 mx-auto mb-2.5 animate-pulse" />
              <p className="text-xs font-sans font-black text-white uppercase tracking-wider">
                No recent facility check-in logs located
              </p>
              <p className="font-serif text-[10px] italic text-white/40 mt-1">
                This athlete has been inactive from our platforms for several days.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
