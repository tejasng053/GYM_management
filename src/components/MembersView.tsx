import React, { useState } from 'react';
import { 
  Heart, 
  Dumbbell, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  TrendingDown, 
  Flame, 
  TrendingUp, 
  Utensils, 
  PlusCircle, 
  Edit3, 
  Activity, 
  Users,
  Award
} from 'lucide-react';
import { Member, Exercise, DaySchedule } from '../types';

interface MembersViewProps {
  members: Member[];
  selectedMember: Member;
  onSelectMember: (member: Member) => void;
  onUpdateMember: (updatedMember: Member) => void;
  userRole?: string;
}

export default function MembersView({
  members,
  selectedMember,
  onSelectMember,
  onUpdateMember,
  userRole
}: MembersViewProps) {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [isEditingRoutine, setIsEditingRoutine] = useState<boolean>(false);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [editingExercises, setEditingExercises] = useState<Exercise[]>([]);
  const [isRestDay, setIsRestDay] = useState<boolean>(false);
  
  // Member dropdown toggle
  const [showMemberDropdown, setShowMemberDropdown] = useState<boolean>(false);
  
  // Custom toast/notification for "Plan Saved!"
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Trigger Edit Day Schedule
  const startEditingDay = (day: string) => {
    setSelectedDay(day);
    const daySchedule = selectedMember.weeklySplit[day] || { title: 'Rest Day', exercises: [], isRest: true };
    setEditingTitle(daySchedule.title);
    setEditingExercises([...(daySchedule.exercises || [])]);
    setIsRestDay(!!daySchedule.isRest);
    setIsEditingRoutine(true);
  };

  // Add Exercise row
  const addEditingExercise = () => {
    setEditingExercises([...editingExercises, { name: 'New Exercise', sets: '3x10' }]);
  };

  // Remove Exercise row
  const removeEditingExercise = (index: number) => {
    const updated = [...editingExercises];
    updated.splice(index, 1);
    setEditingExercises(updated);
  };

  // Update exercise field
  const updateEditingExerciseField = (index: number, field: 'name' | 'sets', value: string) => {
    const updated = [...editingExercises];
    updated[index][field] = value;
    setEditingExercises(updated);
  };

  // Save Day Schedule
  const saveDaySchedule = () => {
    const updatedSplit = { ...selectedMember.weeklySplit };
    updatedSplit[selectedDay] = {
      title: isRestDay ? 'Rest Day' : editingTitle || 'Active Training',
      exercises: isRestDay ? [] : editingExercises,
      isRest: isRestDay
    };

    const updatedMember = {
      ...selectedMember,
      weeklySplit: updatedSplit
    };

    onUpdateMember(updatedMember);
    setIsEditingRoutine(false);
    triggerSaveNotification();
  };

  // Nutrition adjustment handlers
  const handleMacroChange = (macro: 'protein' | 'carbs' | 'fats', delta: number) => {
    const nutrition = { ...selectedMember.nutrition };
    nutrition[macro] = Math.max(0, nutrition[macro] + delta);
    
    // Automatically estimate calories: 4kcal/g for Protein & Carbs, 9kcal/g for Fats
    nutrition.targetIntake = (nutrition.protein * 4) + (nutrition.carbs * 4) + (nutrition.fats * 9);

    onUpdateMember({
      ...selectedMember,
      nutrition
    });
  };

  // Strategy change
  const handleStrategyChange = (strategy: string) => {
    const nutrition = { ...selectedMember.nutrition };
    nutrition.strategy = strategy;
    
    // Adjust macros based on standard templates
    if (strategy.includes('Vegetarian')) {
      nutrition.protein = 160;
      nutrition.carbs = 320;
      nutrition.fats = 65;
    } else if (strategy.includes('Non-Vegetarian')) {
      nutrition.protein = 185;
      nutrition.carbs = 220;
      nutrition.fats = 65;
    } else if (strategy.includes('Keto')) {
      nutrition.protein = 150;
      nutrition.carbs = 20;
      nutrition.fats = 130;
    } else { // Intermittent Fasting
      nutrition.protein = 125;
      nutrition.carbs = 160;
      nutrition.fats = 45;
    }
    
    nutrition.targetIntake = (nutrition.protein * 4) + (nutrition.carbs * 4) + (nutrition.fats * 9);

    onUpdateMember({
      ...selectedMember,
      nutrition
    });
  };

  // Weight adjustments
  const handleWeightChange = (delta: number) => {
    const telemetry = { ...selectedMember.telemetry };
    telemetry.currentWeight = Math.round((telemetry.currentWeight + delta) * 10) / 10;
    
    // update current weight history today's weight
    const updatedHistory = [...telemetry.weightHistory];
    const todayIndex = updatedHistory.findIndex(h => h.date === 'Today');
    if (todayIndex !== -1) {
      updatedHistory[todayIndex].weight = telemetry.currentWeight;
    }
    telemetry.weightHistory = updatedHistory;

    onUpdateMember({
      ...selectedMember,
      telemetry
    });
  };

  // Save full profile notification
  const triggerSaveNotification = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6 animate-fade-in text-white selection:bg-[#FF2E2E]/20">
      
      {/* Toast Notification */}
      {saveStatus !== 'idle' && (
        <div className="fixed top-5 right-5 bg-brand-surface border border-[#FF2E2E] text-white text-xs px-5 py-3.5 shadow-2xl flex items-center gap-2.5 z-50 animate-fade-in font-sans font-bold">
          <Activity className="h-4.5 w-4.5 text-[#FF2E2E] animate-pulse" />
          <span>
            {saveStatus === 'saving' ? 'Synching telemetry records...' : 'Workout split & macro strategy synchronized.'}
          </span>
        </div>
      )}

      {/* Member Selection Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 pb-6 border-b border-white/10">
        
        {/* Selector dropdown and profile overview */}
        <div className="flex items-center gap-5 relative">
          
          {/* Avatar frame */}
          <div className="w-20 h-20 bg-brand-surface-low border border-white/10 overflow-hidden shrink-0 flex items-center justify-center font-mono text-xl font-black text-white/70">
            {selectedMember.avatar.startsWith('http') ? (
              <img 
                src={selectedMember.avatar} 
                alt={selectedMember.name} 
                referrerPolicy="no-referrer"
                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-300"
              />
            ) : (
              <span>{selectedMember.avatar}</span>
            )}
          </div>

          <div>
            {/* Clickable selector to switch active member */}
            <div className="relative">
              {userRole === 'member' ? (
                <h2 className="font-sans text-2xl font-black uppercase tracking-tight text-white">
                  {selectedMember.name}
                </h2>
              ) : (
                <button 
                  onClick={() => setShowMemberDropdown(!showMemberDropdown)}
                  className="flex items-center gap-2 text-white hover:text-[#FF2E2E] transition-colors text-left group focus:outline-none"
                >
                  <h2 className="font-sans text-2xl font-black uppercase tracking-tight">
                    {selectedMember.name}
                  </h2>
                  <ChevronDown className="h-5 w-5 text-white/40 group-hover:text-[#FF2E2E] transition-colors" />
                </button>
              )}

              {showMemberDropdown && (
                <div className="absolute top-9 left-0 w-64 bg-brand-surface border border-white/15 shadow-2xl z-50">
                  <div className="p-3 border-b border-white/10 text-[9px] font-mono font-black uppercase tracking-wider text-white/40 bg-brand-surface-low flex items-center gap-1.5">
                    <Users className="h-3 w-3" />
                    Select Active Athlete
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {members.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          onSelectMember(m);
                          setShowMemberDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left text-xs transition-colors hover:bg-white/5 ${
                          m.id === selectedMember.id ? 'bg-[#FF2E2E] text-white' : 'text-white font-bold'
                        }`}
                      >
                        <span>{m.name}</span>
                        <span className={`font-mono text-[9px] font-bold ${m.id === selectedMember.id ? 'text-white/80' : 'text-white/40'}`}>{m.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="font-mono text-[9px] text-white/40 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 uppercase font-bold tracking-wider">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                ID: {selectedMember.id} // Status: {selectedMember.status}
              </span>
              <span className="text-zinc-500">|</span>
              <span className="text-white">Tier: {selectedMember.subscriptionTier || 'Standard Access'}</span>
              <span className="text-zinc-500">|</span>
              <span className="text-[#FF2E2E]">Ends: {selectedMember.subscriptionEnd || '2026-07-26'}</span>
              <span className="text-zinc-500">|</span>
              <span className="text-amber-400">Stride Points: {selectedMember.stridePoints || 0} pts</span>
            </p>
          </div>
        </div>

        {/* Global Planning Actions */}
        <div className="flex gap-3">
          <button 
            onClick={() => alert(`Opening secure communication link to ${selectedMember.name.split(' ')[0]}.`)}
            className="bg-brand-surface border border-white/10 hover:border-[#FF2E2E] text-white font-sans text-xs font-black uppercase tracking-wider px-6 py-2.5 transition-all cursor-pointer"
          >
            Message Coach
          </button>
          <button 
            onClick={triggerSaveNotification}
            className="bg-[#FF2E2E] hover:bg-brand-red-dark text-white font-sans text-xs font-black uppercase tracking-wider px-6 py-2.5 transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="h-4 w-4" />
            Save Split Plan
          </button>
        </div>
      </div>

      {/* Grid Layout: Left is split, Right is Diet / Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Split section (Col-span 8) */}
        <div className="lg:col-span-8 bg-brand-surface border border-white/10 p-6 flex flex-col gap-6 shadow-xl">
          
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="font-sans text-base font-black uppercase text-white flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-[#FF2E2E]" />
              Weekly Training Split
            </h3>
            <span className="text-[9px] font-mono font-extrabold text-white/40 uppercase tracking-widest">
              Configure routine per day
            </span>
          </div>

          {/* Days Split Cards List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {daysOfWeek.map((day) => {
              const schedule = selectedMember.weeklySplit[day];
              const isAssigned = !!schedule;
              const isRest = isAssigned && schedule.isRest;

              return (
                <div 
                  key={day} 
                  className={`border p-5 flex flex-col justify-between transition-all duration-300 ${
                    isRest 
                      ? 'bg-white/[0.01] opacity-60 border-dashed border-white/10 shadow-sm' 
                      : 'bg-brand-surface-low border-white/10 shadow-md hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3.5">
                    <span className="font-mono text-[9px] font-black uppercase tracking-widest text-[#FF2E2E]">
                      {day}
                    </span>
                    <button 
                      onClick={() => startEditingDay(day)}
                      className="text-white/40 hover:text-[#FF2E2E] transition-colors p-1 cursor-pointer focus:outline-none"
                      title="Edit day schedule"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>

                  {isAssigned ? (
                    <div>
                      <div className="text-sm font-black text-white mb-4 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#FF2E2E] rounded-none" />
                        {schedule.title}
                      </div>
                      
                      {!isRest && schedule.exercises && schedule.exercises.length > 0 ? (
                        <div className="space-y-2">
                          {schedule.exercises.map((ex, idx) => (
                            <div 
                              key={idx} 
                              className="flex justify-between text-xs text-white/80 border-b border-white/5 pb-1.5"
                            >
                              <span className="font-sans font-medium">{ex.name}</span>
                              <span className="font-mono text-[10px] text-[#FF2E2E] font-black">{ex.sets}</span>
                            </div>
                          ))}
                        </div>
                      ) : isRest ? (
                        <div className="flex flex-col items-center justify-center py-4 text-white/40">
                          <Heart className="h-5 w-5 text-[#FF2E2E] mb-1.5 animate-pulse" />
                          <span className="font-serif italic text-xs">Active Recovery</span>
                        </div>
                      ) : (
                        <p className="text-xs text-white/30 italic">No exercises added.</p>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={() => startEditingDay(day)}
                      className="border border-dashed border-white/10 hover:border-[#FF2E2E] hover:bg-white/[0.02] py-8 flex flex-col items-center justify-center text-white/40 hover:text-white transition-all w-full cursor-pointer focus:outline-none"
                    >
                      <Plus className="h-5 w-5 mb-1 text-[#FF2E2E]" />
                      <span className="font-sans text-[9px] uppercase font-black tracking-widest">Assign Routine</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Diet Strategy & Weight telemetry (Col-span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Stride Points Rewards Card */}
          <div className="bg-brand-surface border border-white/10 p-6 flex flex-col gap-4 shadow-xl relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-500/5 rounded-full border border-amber-500/10 pointer-events-none" />
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-sans text-sm font-black uppercase text-white flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-amber-400" />
                Stride Rewards Quest
              </h3>
              <span className="font-mono text-[8px] uppercase tracking-wider font-extrabold text-amber-400">
                Level 3 Athlete
              </span>
            </div>

            <div className="flex items-end justify-between py-1">
              <div>
                <span className="text-[8px] font-mono font-extrabold text-white/40 uppercase tracking-widest block">Active Balance</span>
                <div className="font-sans text-3xl font-black text-amber-400 tracking-tight flex items-baseline">
                  {selectedMember.stridePoints || 0}
                  <span className="text-xs font-normal text-white/50 ml-1">pts</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[8px] font-mono font-extrabold text-white/40 uppercase tracking-widest block">Next Milestone</span>
                <span className="font-sans text-xs font-black text-white block mt-0.5">
                  500 pts (10% Shake Discount)
                </span>
              </div>
            </div>

            {/* Progress to next milestone */}
            <div>
              <div className="flex justify-between items-center text-[9px] font-mono text-white/40 uppercase font-bold">
                <span>Progress to reward</span>
                <span>{Math.round(((selectedMember.stridePoints || 0) / 500) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-brand-surface-low border border-white/5 mt-1 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-300" 
                  style={{ width: `${Math.min(100, ((selectedMember.stridePoints || 0) / 500) * 100)}%` }}
                />
              </div>
            </div>

            {/* Interactive button to score points */}
            <button
              onClick={() => {
                const currentPoints = selectedMember.stridePoints || 0;
                onUpdateMember({
                  ...selectedMember,
                  stridePoints: currentPoints + 15
                });
                alert("Boom! +15 Stride Points awarded for tracking your daily workout, macros, and weight check.");
              }}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-sans text-xs font-black uppercase py-2.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Flame className="h-4 w-4 text-black animate-pulse" />
              <span>Log Daily Workout & Macros (+15 pts)</span>
            </button>
          </div>
          
          {/* Diet Planner */}
          <div className="bg-brand-surface border border-white/10 p-6 flex flex-col gap-5 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-sans text-sm font-black uppercase text-white flex items-center gap-2">
                <Utensils className="h-4.5 w-4.5 text-[#FF2E2E]" />
                Diet Strategy
              </h3>
            </div>

            {/* Macro Strategy Select */}
            <div>
              <label className="block text-[9px] font-mono font-black uppercase tracking-widest text-white/40 mb-1.5">
                Macro Strategy
              </label>
              <select
                value={selectedMember.nutrition.strategy}
                onChange={(e) => handleStrategyChange(e.target.value)}
                className="w-full bg-brand-surface-low border border-white/10 text-white text-xs py-2.5 px-3 font-sans font-bold tracking-wide focus:outline-none focus:border-[#FF2E2E]"
              >
                <option value="High Protein Vegetarian (Paneer, Soya, Dal)">High Protein Vegetarian (Paneer, Soya, Dal)</option>
                <option value="Non-Vegetarian lean (Chicken, Eggs, Rice)">Non-Vegetarian lean (Chicken, Eggs, Rice)</option>
                <option value="Keto Akhada Diet (High Fat, Low Carb)">Keto Akhada Diet (High Fat, Low Carb)</option>
                <option value="Intermittent Fasting (Roti, Sabzi, Whey)">Intermittent Fasting (Roti, Sabzi, Whey)</option>
              </select>
            </div>

            {/* Protein Carbs Fats grid */}
            <div className="grid grid-cols-3 gap-2">
              {/* Protein */}
              <div className="bg-brand-surface-low border border-white/10 p-2.5 text-center relative group overflow-hidden">
                <span className="block text-[8px] font-mono font-black uppercase text-white/40">Protein</span>
                <span className="block font-sans text-base font-black text-white mt-1">
                  {selectedMember.nutrition.protein}g
                </span>
                {/* Micro adjustments */}
                <div className="absolute inset-x-0 bottom-0 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-brand-surface border-t border-white/10 text-white text-[9px] font-black">
                  <button 
                    onClick={() => handleMacroChange('protein', -5)} 
                    className="w-1/2 hover:text-[#FF2E2E] py-1 cursor-pointer"
                  >
                    -5g
                  </button>
                  <button 
                    onClick={() => handleMacroChange('protein', 5)} 
                    className="w-1/2 hover:text-[#FF2E2E] py-1 border-l border-white/10 cursor-pointer"
                  >
                    +5g
                  </button>
                </div>
              </div>

              {/* Carbs */}
              <div className="bg-brand-surface-low border border-white/10 p-2.5 text-center relative group overflow-hidden">
                <span className="block text-[8px] font-mono font-black uppercase text-white/40">Carbs</span>
                <span className="block font-sans text-base font-black text-white mt-1">
                  {selectedMember.nutrition.carbs}g
                </span>
                <div className="absolute inset-x-0 bottom-0 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-brand-surface border-t border-white/10 text-white text-[9px] font-black">
                  <button 
                    onClick={() => handleMacroChange('carbs', -10)} 
                    className="w-1/2 hover:text-[#FF2E2E] py-1 cursor-pointer"
                  >
                    -10g
                  </button>
                  <button 
                    onClick={() => handleMacroChange('carbs', 10)} 
                    className="w-1/2 hover:text-[#FF2E2E] py-1 border-l border-white/10 cursor-pointer"
                  >
                    +10g
                  </button>
                </div>
              </div>

              {/* Fats */}
              <div className="bg-brand-surface-low border border-white/10 p-2.5 text-center relative group overflow-hidden">
                <span className="block text-[8px] font-mono font-black uppercase text-white/40">Fats</span>
                <span className="block font-sans text-base font-black text-white mt-1">
                  {selectedMember.nutrition.fats}g
                </span>
                <div className="absolute inset-x-0 bottom-0 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-brand-surface border-t border-white/10 text-white text-[9px] font-black">
                  <button 
                    onClick={() => handleMacroChange('fats', -5)} 
                    className="w-1/2 hover:text-[#FF2E2E] py-1 cursor-pointer"
                  >
                    -5g
                  </button>
                  <button 
                    onClick={() => handleMacroChange('fats', 5)} 
                    className="w-1/2 hover:text-[#FF2E2E] py-1 border-l border-white/10 cursor-pointer"
                  >
                    +5g
                  </button>
                </div>
              </div>
            </div>

            {/* Target energy intake indicator */}
            <div className="mt-2">
              <div className="flex justify-between items-center text-[9px] font-mono font-black uppercase text-white/40 tracking-wider">
                <span>Target Energy Intake</span>
                <span className="text-[#FF2E2E] font-black">{selectedMember.nutrition.targetIntake} kcal</span>
              </div>
              
              {/* Progress visual bar */}
              <div className="w-full h-2 bg-brand-surface-low border border-white/5 mt-1.5 overflow-hidden">
                <div 
                  className="h-full bg-[#FF2E2E] transition-all duration-300" 
                  style={{ width: `${Math.min(100, (selectedMember.nutrition.targetIntake / 4000) * 100)}%` }}
                />
              </div>
              <p className="text-[9px] font-mono font-bold text-white/20 mt-1 uppercase text-right">
                Based on standard metabolic weight ratios
              </p>
            </div>
          </div>

          {/* Progress telemetry (Weight) */}
          <div className="bg-brand-surface border border-white/10 p-6 flex flex-col gap-4 flex-1 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="font-sans text-sm font-black uppercase text-white flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-[#FF2E2E]" />
                Weight Telemetry
              </h3>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <span className="text-[9px] font-mono font-extrabold text-white/40 uppercase tracking-widest block">Current Weight</span>
                <div className="font-sans text-3xl font-black text-white tracking-tight flex items-baseline">
                  {selectedMember.telemetry.currentWeight}
                  <span className="text-xs font-normal text-white/50 ml-1">kg</span>
                </div>
              </div>

              {/* Loss badge */}
              <span className="bg-[#FF2E2E]/10 border border-[#FF2E2E]/30 px-3 py-1 text-[#FF2E2E] text-xs font-black font-mono flex items-center gap-1">
                <TrendingDown className="h-3.5 w-3.5" />
                {selectedMember.telemetry.weightLoss} kg
              </span>
            </div>

            {/* Manual weight updates buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => handleWeightChange(-0.5)}
                className="flex-1 bg-brand-surface-low hover:bg-white/[0.04] border border-white/10 text-white py-2 text-xs font-mono font-bold uppercase transition-colors cursor-pointer focus:outline-none"
              >
                -0.5 kg
              </button>
              <button 
                onClick={() => handleWeightChange(0.5)}
                className="flex-1 bg-brand-surface-low hover:bg-white/[0.04] border border-white/10 text-white py-2 text-xs font-mono font-bold uppercase transition-colors cursor-pointer focus:outline-none"
              >
                +0.5 kg
              </button>
            </div>

            {/* Pure SVG Custom Line graph for weight trends */}
            <div className="bg-brand-surface-low border border-white/10 p-3 flex flex-col justify-between h-32 relative">
              <div className="absolute top-2 left-3 text-[8px] font-mono font-bold text-white/30 uppercase tracking-wider">
                Trend (Last 4 Weeks)
              </div>

              <svg className="w-full h-full pt-6 pb-2" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="weightGradDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF2E2E" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#FF2E2E" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Gradient area */}
                <path d="M 0,90 Q 25,80 50,70 T 75,50 T 100,20 L 100,100 L 0,100 Z" fill="url(#weightGradDark)" />
                {/* Line path */}
                <path d="M 0,90 Q 25,80 50,70 T 75,50 T 100,20" fill="none" stroke="#FF2E2E" strokeWidth="2.5" />
                {/* Dots on key indicators */}
                <circle cx="0" cy="90" r="2.5" fill="#0A0B0E" stroke="#FF2E2E" strokeWidth="1" />
                <circle cx="25" cy="80" r="2.5" fill="#0A0B0E" stroke="#FF2E2E" strokeWidth="1" />
                <circle cx="50" cy="70" r="2.5" fill="#0A0B0E" stroke="#FF2E2E" strokeWidth="1" />
                <circle cx="75" cy="50" r="2.5" fill="#0A0B0E" stroke="#FF2E2E" strokeWidth="1" />
                <circle cx="100" cy="20" r="2.5" fill="#0A0B0E" stroke="#FF2E2E" strokeWidth="1" />
              </svg>

              <div className="flex justify-between text-[8px] font-mono font-extrabold text-white/30 uppercase px-1 tracking-wider">
                <span>4 wks ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routine Edit Drawer/Dialog Modal */}
      {isEditingRoutine && (
        <div className="fixed inset-0 bg-[#0A0B0E]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-surface border border-white/10 max-w-lg w-full p-6 space-y-5 shadow-2xl text-white">
            
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h4 className="font-sans text-sm font-black uppercase text-white">
                Modify Schedule: <span className="text-[#FF2E2E]">{selectedDay}</span>
              </h4>
              <button 
                onClick={() => setIsEditingRoutine(false)}
                className="text-white/40 hover:text-white font-black transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Rest Day switch */}
            <div className="flex justify-between items-center p-3.5 bg-brand-surface-low border border-white/10">
              <label className="font-sans text-xs font-black uppercase tracking-wider text-white">
                Is Rest / Active Recovery Day?
              </label>
              <input 
                type="checkbox"
                checked={isRestDay}
                onChange={(e) => setIsRestDay(e.target.checked)}
                className="rounded-none border-white/10 text-[#FF2E2E] focus:ring-0 w-4.5 h-4.5 cursor-pointer"
              />
            </div>

            {!isRestDay ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-mono font-black uppercase tracking-widest text-white/40 mb-1.5 font-bold">
                    Day Title / Muscle Group Focus
                  </label>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    placeholder="e.g. Heavy Chest & Triceps"
                    className="w-full bg-brand-surface-low border border-white/10 text-white font-sans font-bold text-xs px-3 py-2.5 focus:border-[#FF2E2E] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-mono font-black uppercase tracking-widest text-white/40">
                    <span>Exercise List</span>
                    <span>Sets & Reps</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                    {editingExercises.map((ex, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={ex.name}
                          onChange={(e) => updateEditingExerciseField(index, 'name', e.target.value)}
                          placeholder="Bench Press"
                          className="flex-1 bg-brand-surface-low border border-white/10 text-white font-sans font-bold text-xs px-2.5 py-2 focus:border-[#FF2E2E] focus:outline-none"
                        />
                        <input
                          type="text"
                          value={ex.sets}
                          onChange={(e) => updateEditingExerciseField(index, 'sets', e.target.value)}
                          placeholder="4x8-10"
                          className="w-24 bg-brand-surface-low border border-white/10 text-[#FF2E2E] font-mono font-bold text-xs px-2 py-2 text-center focus:border-[#FF2E2E] focus:outline-none"
                        />
                        <button
                          onClick={() => removeEditingExercise(index)}
                          className="text-white/40 hover:text-[#FF2E2E] p-1 shrink-0 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {editingExercises.length === 0 && (
                      <p className="text-xs text-white/40 italic py-2">
                        No exercises assigned yet. Click add below.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={addEditingExercise}
                    className="text-[#FF2E2E] hover:text-white font-sans text-[10px] uppercase font-black tracking-widest flex items-center gap-1 mt-2.5 transition-colors cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Exercise Row</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-white/60 font-serif italic py-4 text-center">
                This is marked as a Rest Day. Exercise routines will be replaced with a quiet recovery banner on the schedule split.
              </p>
            )}

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsEditingRoutine(false)}
                className="flex-1 border border-white/10 hover:bg-white/5 text-white py-2.5 text-xs font-sans font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveDaySchedule}
                className="flex-1 bg-[#FF2E2E] hover:bg-brand-red-dark text-white py-2.5 text-xs font-sans font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Update Day
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
