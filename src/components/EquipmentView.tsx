import React, { useState } from 'react';
import { 
  Wrench, 
  CheckSquare, 
  AlertTriangle, 
  Plus, 
  Settings, 
  Trash2, 
  CheckCircle,
  Clock,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

interface EquipmentItem {
  id: string;
  name: string;
  category: 'Cardio' | 'Strength' | 'Free Weights' | 'Accessories';
  status: 'Optimal' | 'Requires Attention' | 'Out of Service';
  lastService: string;
  notes: string;
}

const INITIAL_EQUIPMENT: EquipmentItem[] = [
  { id: '#EQ-01', name: 'Power Squat Rack 1', category: 'Strength', status: 'Optimal', lastService: '2026-05-15', notes: 'Perfect working condition. Pin locks oiled.' },
  { id: '#EQ-02', name: 'Power Squat Rack 2', category: 'Strength', status: 'Requires Attention', lastService: '2026-04-10', notes: 'Cable pulley has slight friction. Needs high-grade lubricant.' },
  { id: '#EQ-03', name: 'Assault AirBike 4', category: 'Cardio', status: 'Optimal', lastService: '2026-06-01', notes: 'Drive belt replaced and calibrated.' },
  { id: '#EQ-04', name: 'Commercial Treadmill T3', category: 'Cardio', status: 'Out of Service', lastService: '2026-03-20', notes: 'Incline motor burned out. Replacement part order dispatched.' },
  { id: '#EQ-05', name: 'Olympic Bumper Plates Set B', category: 'Free Weights', status: 'Optimal', lastService: '2026-01-05', notes: 'All plates present. Stand organized.' },
];

export default function EquipmentView() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Cardio' | 'Strength' | 'Free Weights' | 'Accessories'>('Strength');
  const [status, setStatus] = useState<'Optimal' | 'Requires Attention' | 'Out of Service'>('Optimal');
  const [notes, setNotes] = useState('');

  // Cycle status on click
  const cycleStatus = (id: string) => {
    const updated = equipment.map((item) => {
      if (item.id === id) {
        let nextStatus: 'Optimal' | 'Requires Attention' | 'Out of Service' = 'Optimal';
        if (item.status === 'Optimal') nextStatus = 'Requires Attention';
        else if (item.status === 'Requires Attention') nextStatus = 'Out of Service';
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setEquipment(updated);
  };

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: EquipmentItem = {
      id: `#EQ-0${equipment.length + 1}`,
      name,
      category,
      status,
      lastService: new Date().toISOString().split('T')[0],
      notes: notes || 'Registered in active equipment database.'
    };

    setEquipment([...equipment, newItem]);
    setShowAdd(false);
    setName('');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    setEquipment(equipment.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in text-white selection:bg-[#FF2E2E]/20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-5 border-b border-white/10">
        <div>
          <h2 className="font-sans text-3xl font-black uppercase tracking-tight text-white">
            Equipment Audit
          </h2>
          <p className="font-serif text-sm text-white/60 italic mt-1">
            Audit mechanical tension status, report worn units, and coordinate calibration timelines.
          </p>
        </div>

        <button 
          onClick={() => setShowAdd(true)}
          className="bg-[#FF2E2E] hover:bg-brand-red-dark text-white font-sans text-xs font-black uppercase tracking-wider py-3 px-5 transition-all flex items-center justify-center gap-2 self-start cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Add Equipment Asset</span>
        </button>
      </div>

      {/* Equipment List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <div 
            key={item.id} 
            className="bg-brand-surface border border-white/10 p-5 flex flex-col justify-between shadow-xl transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[9px] text-white/50 bg-white/5 border border-white/10 px-2 py-1 uppercase tracking-wider font-bold">
                  {item.category}
                </span>
                
                {/* Clickable status badge */}
                <button
                  onClick={() => cycleStatus(item.id)}
                  className={`px-2.5 py-1 text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 border cursor-pointer transition-all focus:outline-none ${
                    item.status === 'Optimal' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : item.status === 'Requires Attention' 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-[#FF2E2E]/10 text-[#FF2E2E] border-[#FF2E2E]/20'
                  }`}
                  title="Click to cycle status"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    item.status === 'Optimal' ? 'bg-emerald-500' : item.status === 'Requires Attention' ? 'bg-amber-500' : 'bg-[#FF2E2E]'
                  }`} />
                  {item.status}
                </button>
              </div>

              <h3 className="font-sans text-sm font-black text-white mt-1 uppercase tracking-tight">
                {item.name}
              </h3>
              <p className="font-mono text-[9px] text-white/40 uppercase mt-0.5 font-bold">ID: {item.id} • Last Service: {item.lastService}</p>
              
              <div className="bg-white/[0.02] p-3.5 border border-white/5 mt-3 text-xs text-white/70 min-h-[60px] font-medium leading-relaxed">
                {item.notes}
              </div>
            </div>

            <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/10">
              <button 
                onClick={() => cycleStatus(item.id)}
                className="text-[9px] font-mono uppercase font-black text-white/60 hover:text-[#FF2E2E] flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
              >
                <Wrench className="h-3.5 w-3.5" />
                <span>Service Log</span>
              </button>
              
              <button 
                onClick={() => handleDelete(item.id)}
                className="text-white/30 hover:text-[#FF2E2E] p-1.5 hover:bg-white/5 transition-all cursor-pointer rounded-none"
                title="Remove equipment entry"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Equipment Dialog Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-[#0A0B0E]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-surface border border-white/10 max-w-sm w-full p-6 space-y-4 shadow-2xl text-white">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h4 className="font-sans text-xs font-black uppercase text-white">
                Log New Gym Asset
              </h4>
              <button 
                onClick={() => setShowAdd(false)}
                className="text-white/40 hover:text-white font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEquipment} className="space-y-4">
              <div>
                <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1.5">
                  Equipment Asset Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rowing Machine Row-5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold px-3 py-2.5 focus:border-[#FF2E2E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1.5">
                    Asset Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold py-2 px-3 focus:outline-none focus:border-[#FF2E2E]"
                  >
                    <option value="Strength">Strength</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Free Weights">Free Weights</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1.5">
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold py-2 px-3 focus:outline-none focus:border-[#FF2E2E]"
                  >
                    <option value="Optimal">Optimal</option>
                    <option value="Requires Attention">Requires Attention</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1.5">
                  Audit / Mechanical Notes
                </label>
                <textarea
                  placeholder="Describe pulleys, structural tension, missing pins, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold px-3 py-2.5 focus:border-[#FF2E2E] focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 border border-white/10 hover:bg-white/5 text-white py-2.5 text-xs font-sans font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#FF2E2E] hover:bg-brand-red-dark text-white py-2.5 text-xs font-sans font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Confirm Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
