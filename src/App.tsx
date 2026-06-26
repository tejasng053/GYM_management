import React, { useState, useEffect } from 'react';
import { 
  Users, 
  LogIn, 
  Mail, 
  TrendingDown, 
  Flame, 
  Award, 
  HelpCircle, 
  Search, 
  Plus, 
  TrendingUp, 
  UserCheck, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardView from './components/DashboardView';
import MembersView from './components/MembersView';
import AttendanceView from './components/AttendanceView';
import FinanceView from './components/FinanceView';
import TrainersView from './components/TrainersView';
import EquipmentView from './components/EquipmentView';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';
import GymAdvisorView from './components/GymAdvisorView';
import MemberDashboardView from './components/MemberDashboardView';
import InventoryView from './components/InventoryView';
import ReportsView from './components/ReportsView';

import { Member, Trainer, FinanceStats, InventoryItem, Notification } from './types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_TRAINERS, 
  INITIAL_FINANCE,
  INITIAL_INVENTORY,
  INITIAL_NOTIFICATIONS
} from './data';

export default function App() {
  // Authentication & role context states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'owner' | 'trainer' | 'member'>('trainer');
  
  // Tab control state
  const [activeTab, setActiveTab] = useState<string>('attendance'); // Defaults to the attendance analytics page as requested

  // Load state from localStorage if present
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('ironpulse_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [trainers, setTrainers] = useState<Trainer[]>(() => {
    const saved = localStorage.getItem('ironpulse_trainers');
    return saved ? JSON.parse(saved) : INITIAL_TRAINERS;
  });

  const [finance, setFinance] = useState<FinanceStats>(() => {
    const saved = localStorage.getItem('ironpulse_finance');
    return saved ? JSON.parse(saved) : INITIAL_FINANCE;
  });

  const [liveOccupancy, setLiveOccupancy] = useState<number>(() => {
    const saved = localStorage.getItem('ironpulse_occupancy');
    return saved ? parseInt(saved, 10) : 54;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('ironpulse_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('ironpulse_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Selected Member state (for detailed Workout/Diet editing)
  const [selectedMember, setSelectedMember] = useState<Member>(() => {
    return members[0] || INITIAL_MEMBERS[0];
  });

  // Global search input query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dialog Modals State
  const [showAddMember, setShowAddMember] = useState<boolean>(false);
  const [showCheckInForm, setShowCheckInForm] = useState<boolean>(false);
  const [showOutreachDialog, setShowOutreachDialog] = useState<boolean>(false);
  const [showMemberProfileModal, setShowMemberProfileModal] = useState<boolean>(false);

  // Form Inputs for New Member
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [newMemberWeight, setNewMemberWeight] = useState<string>('75');
  const [newMemberStrategy, setNewMemberStrategy] = useState<string>('High Protein Vegetarian (Paneer, Soya, Dal)');

  // Form Inputs for Check-in Dialog
  const [checkInInput, setCheckInInput] = useState<string>('');
  const [checkInMessage, setCheckInMessage] = useState<string>('');

  // Outreach Dialog Active Content
  const [outreachRecipient, setOutreachRecipient] = useState<string>('');
  const [outreachMailSubject, setOutreachMailSubject] = useState<string>('');
  const [outreachMailBody, setOutreachMailBody] = useState<string>('');

  // Save states to localStorage whenever modified
  useEffect(() => {
    localStorage.setItem('ironpulse_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('ironpulse_trainers', JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    localStorage.setItem('ironpulse_finance', JSON.stringify(finance));
  }, [finance]);

  useEffect(() => {
    localStorage.setItem('ironpulse_occupancy', liveOccupancy.toString());
  }, [liveOccupancy]);

  useEffect(() => {
    localStorage.setItem('ironpulse_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('ironpulse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Synchronize selected member if members list is updated
  useEffect(() => {
    const found = members.find(m => m.id === selectedMember.id);
    if (found) {
      setSelectedMember(found);
    }
  }, [members]);

  // Restores factories
  const handleResetData = () => {
    setMembers(INITIAL_MEMBERS);
    setTrainers(INITIAL_TRAINERS);
    setFinance(INITIAL_FINANCE);
    setLiveOccupancy(54);
    setSelectedMember(INITIAL_MEMBERS[0]);
    setInventory(INITIAL_INVENTORY);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
  };

  // Add Member Submission handler
  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const weightVal = parseFloat(newMemberWeight) || 180;
    const newId = `#IP-${Math.floor(1000 + Math.random() * 9000)}`;
    const avatarInitials = newMemberName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const newMember: Member = {
      id: newId,
      name: newMemberName,
      avatar: avatarInitials,
      status: 'Active',
      absentDays: 0,
      weeklySplit: {
        Monday: { title: 'Chest, Shoulders & Triceps', exercises: [{ name: 'Incline DB Press', sets: '3x10' }] },
        Wednesday: { title: 'Back, Core & Biceps', exercises: [{ name: 'Lat Pulldowns', sets: '3x12' }] },
        Friday: { title: 'Quads, Glutes & Calves', exercises: [{ name: 'Barbell Squats', sets: '4x8' }] }
      },
      nutrition: {
        strategy: newMemberStrategy,
        protein: 160,
        carbs: 220,
        fats: 65,
        targetIntake: 2050
      },
      telemetry: {
        currentWeight: weightVal,
        weightLoss: 0,
        weightHistory: [
          { date: '4 Wks Ago', weight: weightVal },
          { date: 'Today', weight: weightVal }
        ]
      },
      subscriptionEnd: '2026-07-26',
      subscriptionTier: 'Standard Access',
      stridePoints: 10,
      streakDays: 0
    };

    setMembers([newMember, ...members]);
    setSelectedMember(newMember);
    setShowAddMember(false);
    setNewMemberName('');
    setActiveTab('members'); // Take them directly to check out their new profile!
  };

  // Perform member check-in simulation
  const handleCheckInMember = (idOrName: string) => {
    if (!idOrName.trim()) return;

    // Search by ID or Name
    const foundIdx = members.findIndex(m => 
      m.id.toLowerCase() === idOrName.toLowerCase() ||
      m.name.toLowerCase().includes(idOrName.toLowerCase())
    );

    if (foundIdx !== -1) {
      const updatedMembers = [...members];
      const member = updatedMembers[foundIdx];
      
      // Update check-in values
      member.absentDays = 0;
      setMembers(updatedMembers);
      setLiveOccupancy(prev => prev + 1);
      
      // Register temporary welcome notification
      setCheckInMessage(`✓ Check-in successful: Welcome back to Iron Haven, ${member.name}!`);
      setTimeout(() => setCheckInMessage(''), 4000);
      setCheckInInput('');
      setShowCheckInForm(false);
    } else {
      alert(`Access Key or Athlete Name "${idOrName}" could not be located in our active member files. For manual guest passes, use Guest-Portal.`);
    }
  };

  // Trigger outreach dispatch preview dialog
  const handleTriggerOutreach = (memberName: string) => {
    setOutreachRecipient(memberName);
    setOutreachMailSubject(`We miss you at the platform, ${memberName.split(' ')[0]}!`);
    setOutreachMailBody(
      `Hey ${memberName.split(' ')[0]},\n\nWe noticed you've been away from the gym for a few days. Consistency is key to unlocking elite performance, and the coaches at Iron Haven are ready to guide you back to the platform.\n\nLet's schedule a brief 1-on-1 form assessment or active recovery session this week.\n\nStay focused,\nIron Haven Performance Team`
    );
    setShowOutreachDialog(true);
  };

  // Confirm email outreach simulation
  const handleSendOutreachEmail = () => {
    alert(`E-mail dispatch synched successfully. Outreach email sent to ${outreachRecipient}.`);
    setShowOutreachDialog(false);
  };

  // Update a single member's plan
  const handleUpdateMember = (updatedMember: Member) => {
    const updatedMembers = members.map((m) => m.id === updatedMember.id ? updatedMember : m);
    setMembers(updatedMembers);
  };

  // Update trainer roster list
  const handleUpdateTrainers = (updatedTrainers: Trainer[]) => {
    setTrainers(updatedTrainers);
  };

  // Clear pending payroll and add value to expenses to adjust profits
  const handleUpdatePayroll = (amount: number) => {
    const updatedFinance = { ...finance };
    // Deduct from profit or keep profit and just update payroll tracking
    const salariesExpenseIndex = updatedFinance.expenses.findIndex(ex => ex.category === 'Salaries');
    if (salariesExpenseIndex !== -1) {
      updatedFinance.expenses[salariesExpenseIndex].amount += amount;
    }
    updatedFinance.monthlyProfit -= amount;
    setFinance(updatedFinance);
  };

  // Directly update finance statistics
  const handleUpdateFinance = (updatedFinance: FinanceStats) => {
    setFinance(updatedFinance);
  };

  if (!isLoggedIn) {
    return (
      <LoginView 
        members={members} 
        onLogin={(role, memberId) => {
          setUserRole(role);
          if (memberId) {
            const found = members.find(m => m.id === memberId);
            if (found) setSelectedMember(found);
          }
          setIsLoggedIn(true);
          if (role === 'member') {
            setActiveTab('member-dashboard');
          } else {
            setActiveTab('dashboard');
          }
        }} 
      />
    );
  }

  return (
    <div className="bg-brand-bg text-[#1A1A1A] min-h-screen flex selection:bg-brand-red/30 selection:text-white font-sans antialiased relative overflow-hidden">
      
      {/* Global Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025] z-50 bg-repeat" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/p6-dark.png')" }} />
      
      {/* Sidebar Nav (Desktop) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAddMemberClick={() => setShowAddMember(true)}
        userRole={userRole}
        onLogout={() => setIsLoggedIn(false)}
        selectedMemberName={selectedMember?.name || 'Tejas Gowda'}
      />
      
      {/* Main Container Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header bar */}
        <TopBar 
          onCheckInClick={() => setShowCheckInForm(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          members={members}
          onSelectMember={(m) => {
            setSelectedMember(m);
            if (userRole === 'member') {
              setActiveTab('member-dashboard');
            } else {
              setShowMemberProfileModal(true);
            }
          }}
          activeTab={activeTab}
          userRole={userRole}
          selectedMember={selectedMember}
          onCheckInMember={(id) => handleCheckInMember(id)}
          notifications={notifications}
          onUpdateNotifications={setNotifications}
          onNavigate={setActiveTab}
        />

        {/* Check-In successful toast confirmation */}
        {checkInMessage && (
          <div className="mx-8 mt-5 bg-emerald-950/20 border border-emerald-500 text-emerald-400 text-xs py-3 px-4 shadow-xl flex items-center gap-2 animate-bounce">
            <UserCheck className="h-4.5 w-4.5" />
            <span>{checkInMessage}</span>
          </div>
        )}

        {/* Primary Page Canvas Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView 
              members={members}
              trainers={trainers}
              finance={finance}
              liveOccupancy={liveOccupancy}
              setActiveTab={setActiveTab}
              onSelectMember={(m) => {
                setSelectedMember(m);
                setShowMemberProfileModal(true);
              }}
            />
          )}

          {activeTab === 'member-dashboard' && (
            <MemberDashboardView 
              member={selectedMember}
              onUpdateMember={handleUpdateMember}
            />
          )}

          {activeTab === 'ai-advisor' && (
            <GymAdvisorView 
              members={members}
              trainers={trainers}
              finance={finance}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView 
              members={members}
              onCheckInMember={(id) => handleCheckInMember(id)}
              onSendEmail={handleTriggerOutreach}
              liveOccupancy={liveOccupancy}
              selectedMember={selectedMember}
              onSelectMember={setSelectedMember}
              userRole={userRole}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceView 
              finance={finance}
              onUpdateFinance={handleUpdateFinance}
            />
          )}

          {activeTab === 'trainers' && (
            <TrainersView 
              trainers={trainers}
              onUpdateTrainers={handleUpdateTrainers}
              onUpdatePayroll={handleUpdatePayroll}
            />
          )}

          {activeTab === 'equipment' && (
            <EquipmentView />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              onResetData={handleResetData}
              liveOccupancy={liveOccupancy}
              onUpdateLiveOccupancy={setLiveOccupancy}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView 
              inventory={inventory}
              onUpdateInventory={setInventory}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView 
              members={members}
              trainers={trainers}
              finance={finance}
              inventory={inventory}
              liveOccupancy={liveOccupancy}
            />
          )}
        </main>
      </div>

      {/* MODAL 1: Add Member Overlay dialog */}
      {showAddMember && (
        <div className="fixed inset-0 bg-brand-bg/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-surface border border-brand-surface-high max-w-sm w-full p-6 space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h4 className="font-sans text-xs font-extrabold uppercase text-white">
                Register New Gym Member
              </h4>
              <button 
                onClick={() => setShowAddMember(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                  Athlete Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jack Dempsey"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full bg-brand-bg border border-zinc-800 text-white text-xs px-3 py-2 focus:border-brand-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Weight */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="75"
                    value={newMemberWeight}
                    onChange={(e) => setNewMemberWeight(e.target.value)}
                    className="w-full bg-brand-bg border border-zinc-800 text-white text-xs px-3 py-2 focus:border-brand-red focus:outline-none font-mono"
                  />
                </div>

                {/* Macro strategy template */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                    Diet Focus
                  </label>
                  <select
                    value={newMemberStrategy}
                    onChange={(e) => setNewMemberStrategy(e.target.value)}
                    className="w-full bg-brand-bg border border-zinc-800 text-zinc-300 text-xs py-2 px-3 focus:outline-none focus:border-[#FF3D00]"
                  >
                    <option value="High Protein Vegetarian (Paneer, Soya, Dal)">Vegetarian</option>
                    <option value="Non-Vegetarian lean (Chicken, Eggs, Rice)">Non-Vegetarian</option>
                    <option value="Keto Akhada Diet (High Fat, Low Carb)">Keto Akhada</option>
                    <option value="Intermittent Fasting (Roti, Sabzi, Whey)">Fasting (IF)</option>
                  </select>
                </div>
              </div>

              <div className="bg-zinc-900 p-3 border border-brand-surface-high text-[10px] text-zinc-500 leading-relaxed uppercase font-mono">
                ✓ System will auto-generate basic Chest/Back/Leg Split and standard diet macros today.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="flex-1 border border-brand-surface-high hover:bg-zinc-800 text-zinc-300 py-2 text-xs font-sans font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-red hover:bg-brand-red/90 text-white py-2 text-xs font-sans font-bold uppercase transition-colors"
                >
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Quick Check-In Form Overlay */}
      {showCheckInForm && (
        <div className="fixed inset-0 bg-brand-bg/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-surface border border-brand-surface-high max-w-sm w-full p-6 space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h4 className="font-sans text-xs font-extrabold uppercase text-white flex items-center gap-1.5">
                <LogIn className="h-4 w-4 text-brand-red" />
                Quick Check-in Desk
              </h4>
              <button 
                onClick={() => setShowCheckInForm(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-500">
              Simulate check-in of any active gym member to decrease their absent stats and increment live occupancy today.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                  Athlete ID or Part of Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. #IP-0492 or Marcus Vance"
                  value={checkInInput}
                  onChange={(e) => setCheckInInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckInMember(checkInInput)}
                  className="w-full bg-brand-bg border border-zinc-800 text-white text-xs px-3 py-2.5 focus:border-brand-red focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Suggestions shortcuts */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-zinc-600 uppercase block">Shortcuts</span>
                <div className="flex flex-wrap gap-1.5">
                  {members.map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleCheckInMember(m.id)}
                      className="bg-zinc-900 hover:bg-zinc-800 border border-brand-surface-high text-zinc-400 hover:text-white text-[9px] font-mono px-2 py-1 transition-all"
                    >
                      {m.name.split(' ')[0]} ({m.absentDays}d)
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-zinc-850">
              <button
                type="button"
                onClick={() => setShowCheckInForm(false)}
                className="flex-1 border border-brand-surface-high hover:bg-zinc-800 text-zinc-300 py-2 text-xs font-sans font-bold uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleCheckInMember(checkInInput)}
                className="flex-1 bg-brand-red hover:bg-brand-red/90 text-white py-2 text-xs font-sans font-bold uppercase transition-colors"
              >
                Complete Check-In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Email Outreach Simulation preview */}
      {showOutreachDialog && (
        <div className="fixed inset-0 bg-brand-bg/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-surface border border-brand-surface-high max-w-md w-full p-6 space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h4 className="font-sans text-xs font-extrabold uppercase text-white flex items-center gap-1.5">
                <Mail className="h-4.5 w-4.5 text-brand-red" />
                Coach Outreach Dispatcher
              </h4>
              <button 
                onClick={() => setShowOutreachDialog(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">Recipient Athlete</span>
                <div className="bg-zinc-900 p-2 text-zinc-300 border border-brand-surface-high font-mono">
                  {outreachRecipient} &lt;{outreachRecipient.toLowerCase().replace(' ', '_')}@ironpulse-family.com&gt;
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">Subject Heading</span>
                <input
                  type="text"
                  value={outreachMailSubject}
                  onChange={(e) => setOutreachMailSubject(e.target.value)}
                  className="w-full bg-brand-bg border border-zinc-800 text-white px-3 py-2 focus:border-brand-red focus:outline-none font-mono"
                />
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">Message Body</span>
                <textarea
                  value={outreachMailBody}
                  onChange={(e) => setOutreachMailBody(e.target.value)}
                  rows={6}
                  className="w-full bg-brand-bg border border-zinc-800 text-white px-3 py-2 focus:border-brand-red focus:outline-none font-mono text-[11px] leading-relaxed resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-zinc-850">
              <button
                type="button"
                onClick={() => setShowOutreachDialog(false)}
                className="flex-1 border border-brand-surface-high hover:bg-zinc-800 text-zinc-300 py-2 text-xs font-sans font-bold uppercase transition-colors"
              >
                Discard Mail
              </button>
              <button
                type="button"
                onClick={handleSendOutreachEmail}
                className="flex-1 bg-brand-red hover:bg-brand-red/90 text-white py-2 text-xs font-sans font-bold uppercase transition-colors"
              >
                Send Outreach
              </button>
            </div>
          </div>
        </div>
      )}

      {showMemberProfileModal && (
        <div className="fixed inset-0 bg-brand-bg/95 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-brand-surface border border-white/10 max-w-5xl w-full p-6 space-y-4 relative shadow-2xl my-8">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="font-sans text-xs font-black uppercase text-white tracking-wider">
                Athlete Profile Management & Training Ledger
              </h3>
              <button 
                onClick={() => setShowMemberProfileModal(false)}
                className="text-white/50 hover:text-white font-mono text-xs uppercase bg-white/5 px-2.5 py-1.5 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
              >
                ✕ Close Profile
              </button>
            </div>
            <div className="pt-2">
              <MembersView 
                members={members}
                selectedMember={selectedMember}
                onSelectMember={setSelectedMember}
                onUpdateMember={handleUpdateMember}
                userRole={userRole}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
