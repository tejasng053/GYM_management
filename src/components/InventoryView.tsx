import React, { useState } from 'react';
import {
  Package, Plus, AlertTriangle, Search, Trash2, Edit3, TrendingUp, ShoppingCart
} from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onUpdateInventory: (items: InventoryItem[]) => void;
}

export default function InventoryView({ inventory, onUpdateInventory }: InventoryViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('All');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Supplements');
  const [quantity, setQuantity] = useState('10');
  const [minStock, setMinStock] = useState('5');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [vendor, setVendor] = useState('');

  const categories = ['All', 'Supplements', 'Drinks', 'Merchandise', 'Accessories'];
  const lowStockItems = inventory.filter(i => i.quantity <= i.minStock);

  const filtered = inventory.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.vendor.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || i.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`, name, category, quantity: parseInt(quantity) || 0,
      minStock: parseInt(minStock) || 5, price: parseFloat(price) || 0,
      costPrice: parseFloat(costPrice) || 0, vendor: vendor || 'N/A',
      lastRestocked: new Date().toISOString().split('T')[0]
    };
    onUpdateInventory([...inventory, newItem]);
    setShowAdd(false);
    setName(''); setPrice(''); setCostPrice(''); setVendor('');
  };

  const handleRestock = (id: string) => {
    const updated = inventory.map(i => i.id === id ? { ...i, quantity: i.quantity + 10, lastRestocked: new Date().toISOString().split('T')[0] } : i);
    onUpdateInventory(updated);
  };

  const handleDelete = (id: string) => {
    onUpdateInventory(inventory.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in text-white selection:bg-[#FF2E2E]/20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-5 border-b border-white/10">
        <div>
          <h2 className="font-sans text-3xl font-black uppercase tracking-tight text-white">Inventory Management</h2>
          <p className="font-serif text-sm text-white/60 italic mt-1">Track supplements, merchandise, and accessory stock levels.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-[#FF2E2E] hover:bg-brand-red-dark text-white font-sans text-xs font-black uppercase tracking-wider py-3 px-5 transition-all flex items-center gap-2 cursor-pointer shadow-md">
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-[#FF2E2E]/5 border border-[#FF2E2E]/30 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-[#FF2E2E] shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h4 className="font-sans text-xs font-black uppercase text-[#FF2E2E]">Low Stock Alert: {lowStockItems.length} item(s)</h4>
            <p className="font-serif text-xs text-white/60 italic mt-1">
              {lowStockItems.map(i => `${i.name} (${i.quantity} left)`).join(' • ')}
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-brand-surface border border-white/10 p-5 shadow-xl">
          <span className="font-mono text-[9px] font-black uppercase text-white/40 tracking-widest block">Total Items</span>
          <div className="font-sans text-3xl font-black text-white mt-2">{inventory.length}</div>
        </div>
        <div className="bg-brand-surface border border-white/10 p-5 shadow-xl">
          <span className="font-mono text-[9px] font-black uppercase text-white/40 tracking-widest block">Low Stock</span>
          <div className="font-sans text-3xl font-black text-[#FF2E2E] mt-2">{lowStockItems.length}</div>
        </div>
        <div className="bg-brand-surface border border-white/10 p-5 shadow-xl">
          <span className="font-mono text-[9px] font-black uppercase text-white/40 tracking-widest block">Total Stock Value</span>
          <div className="font-sans text-3xl font-black text-white mt-2">₹{inventory.reduce((a, i) => a + (i.price * i.quantity), 0).toLocaleString()}</div>
        </div>
        <div className="bg-brand-surface border border-white/10 p-5 shadow-xl">
          <span className="font-mono text-[9px] font-black uppercase text-white/40 tracking-widest block">Potential Profit</span>
          <div className="font-sans text-3xl font-black text-emerald-400 mt-2">₹{inventory.reduce((a, i) => a + ((i.price - i.costPrice) * i.quantity), 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-brand-surface border border-white/10 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-xl">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <input type="text" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-brand-surface-low border border-white/10 text-white text-[10px] pl-9 pr-3 py-2 focus:border-[#FF2E2E] focus:outline-none font-bold" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 text-[9px] font-mono font-black uppercase border tracking-wider transition-all cursor-pointer ${catFilter === c ? 'bg-[#FF2E2E] border-[#FF2E2E] text-white' : 'border-white/10 text-white/60 hover:text-white'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => {
          const isLow = item.quantity <= item.minStock;
          return (
            <div key={item.id} className={`bg-brand-surface border p-5 flex flex-col justify-between shadow-xl transition-all ${isLow ? 'border-[#FF2E2E]/40' : 'border-white/10'}`}>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-[9px] text-white/50 bg-white/5 border border-white/10 px-2 py-1 uppercase tracking-wider font-bold">{item.category}</span>
                  {isLow && <span className="bg-[#FF2E2E]/10 text-[#FF2E2E] border border-[#FF2E2E]/20 px-2 py-0.5 font-mono text-[9px] font-black uppercase flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Low Stock</span>}
                </div>
                <h3 className="font-sans text-sm font-black text-white uppercase tracking-tight">{item.name}</h3>
                <p className="font-mono text-[9px] text-white/40 uppercase mt-1">Vendor: {item.vendor} • Last Restock: {item.lastRestocked}</p>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-brand-surface-low border border-white/10 p-2 text-center">
                    <span className="block text-[8px] font-mono font-black uppercase text-white/40">Stock</span>
                    <span className={`block font-sans text-sm font-black mt-0.5 ${isLow ? 'text-[#FF2E2E]' : 'text-white'}`}>{item.quantity}</span>
                  </div>
                  <div className="bg-brand-surface-low border border-white/10 p-2 text-center">
                    <span className="block text-[8px] font-mono font-black uppercase text-white/40">Price</span>
                    <span className="block font-sans text-sm font-black text-white mt-0.5">₹{item.price}</span>
                  </div>
                  <div className="bg-brand-surface-low border border-white/10 p-2 text-center">
                    <span className="block text-[8px] font-mono font-black uppercase text-white/40">Margin</span>
                    <span className="block font-sans text-sm font-black text-emerald-400 mt-0.5">₹{item.price - item.costPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
                <button onClick={() => handleRestock(item.id)} className="text-[9px] font-mono uppercase font-black text-white/60 hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer">
                  <ShoppingCart className="h-3.5 w-3.5" /> Restock +10
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-white/30 hover:text-[#FF2E2E] p-1.5 transition-all cursor-pointer">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-[#0A0B0E]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-surface border border-white/10 max-w-sm w-full p-6 space-y-4 shadow-2xl text-white">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h4 className="font-sans text-xs font-black uppercase text-white">Add Inventory Item</h4>
              <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white font-black cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1">Item Name</label>
                <input type="text" required placeholder="e.g. Creatine 300g" value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold px-3 py-2.5 focus:border-[#FF2E2E] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold py-2 px-3 focus:outline-none focus:border-[#FF2E2E]">
                    <option value="Supplements">Supplements</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Merchandise">Merchandise</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1">Quantity</label>
                  <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)}
                    className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold px-3 py-2 focus:border-[#FF2E2E] focus:outline-none font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1">Sell Price (₹)</label>
                  <input type="number" required placeholder="2200" value={price} onChange={e => setPrice(e.target.value)}
                    className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold px-3 py-2 focus:border-[#FF2E2E] focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1">Cost Price (₹)</label>
                  <input type="number" placeholder="1800" value={costPrice} onChange={e => setCostPrice(e.target.value)}
                    className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold px-3 py-2 focus:border-[#FF2E2E] focus:outline-none font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-mono font-black text-white/40 uppercase tracking-widest mb-1">Vendor</label>
                <input type="text" placeholder="e.g. MuscleBlaze India" value={vendor} onChange={e => setVendor(e.target.value)}
                  className="w-full bg-brand-surface-low border border-white/10 text-white text-xs font-bold px-3 py-2.5 focus:border-[#FF2E2E] focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 border border-white/10 hover:bg-white/5 text-white py-2.5 text-xs font-sans font-black uppercase tracking-wider transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 bg-[#FF2E2E] hover:bg-brand-red-dark text-white py-2.5 text-xs font-sans font-black uppercase tracking-wider transition-colors cursor-pointer">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
