import React, { useState } from 'react';
import { Bell, X, AlertTriangle, Calendar, Users, Package, DollarSign, CheckCircle2, Sparkles } from 'lucide-react';
import { Notification } from '../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onUpdateNotifications: (notifications: Notification[]) => void;
  onNavigate?: (tab: string) => void;
}

export default function NotificationCenter({ notifications, onUpdateNotifications, onNavigate }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'expiry': return <Calendar className="h-4 w-4 text-amber-400" />;
      case 'absence': return <Users className="h-4 w-4 text-[#FF2E2E]" />;
      case 'equipment': return <AlertTriangle className="h-4 w-4 text-purple-400" />;
      case 'stock': return <Package className="h-4 w-4 text-orange-400" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-emerald-400" />;
      case 'birthday': return <Sparkles className="h-4 w-4 text-pink-400" />;
      default: return <Bell className="h-4 w-4 text-white/40" />;
    }
  };

  const markRead = (id: string) => {
    onUpdateNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    onUpdateNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleAction = (n: Notification) => {
    markRead(n.id);
    if (n.actionTarget && onNavigate) {
      onNavigate(n.actionTarget);
    }
    setIsOpen(false);
  };

  const timeAgo = (timestamp: string) => {
    const diff = new Date('2026-06-26T16:00:00').getTime() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative">
      {/* Bell trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10"
      >
        <Bell className="h-4.5 w-4.5 text-white/60 hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#FF2E2E] text-white text-[8px] font-black flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute top-12 right-0 w-96 bg-brand-surface border border-white/15 shadow-2xl z-50 animate-fade-in max-h-[70vh] flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 bg-brand-surface-low border-b border-white/10 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#FF2E2E]" />
                <span className="font-sans text-xs font-black uppercase text-white tracking-wider">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-[#FF2E2E] text-white text-[8px] font-black px-1.5 py-0.5">{unreadCount} NEW</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[9px] font-mono text-[#FF2E2E] hover:text-white uppercase font-bold cursor-pointer transition-colors">
                    Mark All Read
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-white/40">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500/50" />
                  <p className="font-serif italic text-xs">All clear! No notifications.</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`px-4 py-3.5 border-b border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer ${!n.read ? 'bg-white/[0.02] border-l-2 border-l-[#FF2E2E]' : ''}`}
                    onClick={() => n.actionTarget ? handleAction(n) : markRead(n.id)}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className={`font-sans text-[11px] font-black uppercase tracking-wide truncate ${!n.read ? 'text-white' : 'text-white/60'}`}>
                            {n.title}
                          </h4>
                          <span className="font-mono text-[8px] text-white/30 shrink-0">{timeAgo(n.timestamp)}</span>
                        </div>
                        <p className="font-serif text-[11px] text-white/50 mt-0.5 leading-relaxed line-clamp-2">
                          {n.message}
                        </p>
                        {n.actionLabel && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction(n); }}
                            className="mt-1.5 text-[9px] font-mono font-black uppercase text-[#FF2E2E] hover:text-white transition-colors"
                          >
                            {n.actionLabel} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
