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
  const [loading, setLoading] = useState<boolean>(true);
  
  // Tab control state
  const [activeTab, setActiveTab] = useState<string>('attendance');

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [trainers, setTrainers] = useState<Trainer[]>(INITIAL_TRAINERS);
  const [finance, setFinance] = useState<FinanceStats>(INITIAL_FINANCE);
  const [liveOccupancy, setLiveOccupancy] = useState<number>(54);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [selectedMember, setSelectedMember] = useState<Member | null>(INITIAL_MEMBERS[0] || null);

  // Fetch initial data from backend API
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [membersRes, trainersRes, financeRes, inventoryRes, notificationsRes] = await Promise.all([
          fetch('/api/members'),
          fetch('/api/trainers'),
          fetch('/api/finance'),
          fetch('/api/inventory'),
          fetch('/api/notifications'),
        ]);

        const membersData: Member[] = await membersRes.json();
        const trainersData: Trainer[] = await trainersRes.json();
        const financeData: FinanceStats = await financeRes.json();
        const inventoryData: InventoryItem[] = await inventoryRes.json();
        const notificationsData: Notification[] = await notificationsRes.json();

        if (membersData.length > 0) setMembers(membersData);
        if (trainersData.length > 0) setTrainers(trainersData);
        if (financeData) setFinance(financeData);
        if (inventoryData.length > 0) setInventory(inventoryData);
        if (notificationsData.length > 0) setNotifications(notificationsData);
 
        if (membersData.length > 0) {
          setSelectedMember(membersData[0]);
        }
      } catch (error) {
        console.warn('Backend API offline. Using local simulation fallback data.', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

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

  // Synchronize selected member if members list is updated
  useEffect(() => {
    if (selectedMember) {
      const found = members.find(m => m.id === selectedMember.id);
      if (found) {
        setSelectedMember(found);
      } else if (members.length > 0) {
        setSelectedMember(members[0]);
      }
    } else if (members.length > 0) {
      setSelectedMember(members[0]);
    }
  }, [members]);

  // Restores factories
  const handleResetData = async () => {
    try {
      await fetch('/api/seed', { method: 'POST' });
      const [membersRes, trainersRes, financeRes, inventoryRes, notificationsRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/trainers'),
        fetch('/api/finance'),
        fetch('/api/inventory'),
        fetch('/api/notifications'),
      ]);
      setMembers(await membersRes.json());
      setTrainers(await trainersRes.json());
      setFinance(await financeRes.json());
      setInventory(await inventoryRes.json());
      setNotifications(await notificationsRes.json());
      setLiveOccupancy(54);
      setSelectedMember(members[0] || null);
    } catch (error) {
      console.error('Failed to reset data:', error);
    }
  };

  // Add Member Submission handler
  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const weightVal = parseFloat(newMemberWeight) || 180;
    const avatarInitials = newMemberName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const newMember: Omit<Member, 'id'> = {
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

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });
      if (res.ok) {
        const created: Member = await res.json();
        setMembers([created, ...members]);
        setSelectedMember(created);
      }
    } catch (error) {
      console.error('Failed to create member:', error);
    }

    setShowAddMember(false);
    setNewMemberName('');
    setActiveTab('members');
  };

  // Perform member check-in simulation
  const handleCheckInMember = async (idOrName: string) => {
    if (!idOrName.trim()) return;

    try {
      const res = await fetch('/api/members/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: idOrName }),
      });

      if (res.ok) {
        const updatedMember: Member = await res.json();
        setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
        setLiveOccupancy(prev => prev + 1);
        setCheckInMessage(`✓ Check-in successful: Welcome back to Iron Haven, ${updatedMember.name}!`);
        setTimeout(() => setCheckInMessage(''), 4000);
      } else {
        const err = await res.json();
        alert(err.error || 'Member not found');
      }
    } catch (error) {
      console.error('Check-in failed:', error);
      alert('Check-in failed. Please try again.');
    }

    setCheckInInput('');
    setShowCheckInForm(false);
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
  const handleUpdateMember = async (updatedMember: Member) => {
    try {
      const res = await fetch(`/api/members/${updatedMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMember),
      });
      if (res.ok) {
        setMembers(members.map((m) => m.id === updatedMember.id ? updatedMember : m));
      }
    } catch (error) {
      console.error('Failed to update member:', error);
    }
  };

  // Update trainer roster list
  const handleUpdateTrainers = async (updatedTrainers: Trainer[]) => {
    try {
      const res = await fetch('/api/trainers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTrainers),
      });
      if (res.ok) {
        setTrainers(updatedTrainers);
      }
    } catch (error) {
      console.error('Failed to update trainers:', error);
    }
  };

  // Clear pending payroll and add value to expenses to adjust profits
  const handleUpdatePayroll = async (amount: number) => {
    if (!finance) return;
    try {
      const updatedFinance = { ...finance };
      const salariesExpenseIndex = updatedFinance.expenses.findIndex(ex => ex.category === 'Salaries');
      if (salariesExpenseIndex !== -1) {
        updatedFinance.expenses[salariesExpenseIndex].amount += amount;
      }
      updatedFinance.monthlyProfit -= amount;

      const res = await fetch('/api/finance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFinance),
      });
      if (res.ok) {
        setFinance(updatedFinance);
      }
    } catch (error) {
      console.error('Failed to update payroll:', error);
    }
  };

  // Directly update finance statistics
  const handleUpdateFinance = async (updatedFinance: FinanceStats) => {
    try {
      const res = await fetch('/api/finance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFinance),
      });
      if (res.ok) {
        setFinance(updatedFinance);
      }
    } catch (error) {
      console.error('Failed to update finance:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-brand-bg text-white min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-red mx-auto" />
          <p className="text-sm text-zinc-400 font-mono">Loading Iron Haven...</p>
        </div>
      </div>
    );
  }

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
        selectedMemberName={selectedMember?.name || 'Iron Haven'}
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
          selectedMember={selectedMember || members[0]}
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
              member={selectedMember || members[0]}
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
              selectedMember={selectedMember || members[0]}
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
        selectedMember={selectedMember || members[0]}
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
