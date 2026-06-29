import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Ticket, 
  Activity, 
  Wrench, 
  DollarSign, 
  Users, 
  Dumbbell, 
  BrainCircuit, 
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Member, Trainer, FinanceStats } from '../types';

interface GymAdvisorViewProps {
  members: Member[];
  trainers: Trainer[];
  finance: FinanceStats;
}

export default function GymAdvisorView({ members, trainers, finance }: GymAdvisorViewProps) {
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<string[]>([]);
  const [schemes, setSchemes] = useState<Array<{ title: string; description: string; target: string }>>([]);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [isFallback, setIsFallback] = useState(false);

  const fetchAIRecommendations = async () => {
    setLoading(true);
    setStatusMsg('Querying Haven Intelligence Engine...');
    try {
      // Find current equipment issues
      const equipmentIssues = [
        "Hack Squat Press 2: Frayed cable pulley",
        "Commercial Treadmill T3: Incline motor failure"
      ];

      const response = await fetch('/api/improve-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          membersCount: members.length,
          trainersCount: trainers.length,
          equipmentIssues: equipmentIssues,
          recentRevenue: finance.dailyRevenue
        })
      });

      if (!response.ok) {
        throw new Error('API server error');
      }

      const data = await response.json();
      setTips(data.tips || []);
      setSchemes(data.schemes || []);
      setIsFallback(data.status === 'fallback');
      setStatusMsg('');
    } catch (err) {
      console.error(err);
      // Client-side fallback if server fails
      setTips([
        "**Deploy Peak-Hour Staffing Strategy**: Move at least 2 coaches to the floor between 6:00 PM and 8:30 PM, as live occupancies surge.",
        "**Rotate Frayed Cable Accessories**: Your Hack Squat Cable is currently frayed. Perform preventative replacement to avoid mid-workout disruption.",
        "**Introduce Loyalty Milestone Perks**: Reward athletes when they exceed **500 Stride Points** (e.g., free premium protein shake or personalized mobility session)."
      ]);
      setSchemes([
        {
          title: "Monsoon Fitness Hustle (Promo)",
          description: "Offer a 15% discount for 3-month upfront packages during rainy seasons, including a free personalized nutrition split setup.",
          target: "At-Risk/Inactive Athletes"
        },
        {
          title: "Stride Point Reward Multiplier",
          description: "Earn 2x Stride Points on Friday check-ins to boost lower-occupancy end-of-week attendance.",
          target: "All Active Members"
        }
      ]);
      setIsFallback(true);
      setStatusMsg('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIRecommendations();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in text-white selection:bg-[#FF2E2E]/20">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FF2E2E]/10 border border-[#FF2E2E]/30 text-[#FF2E2E] font-mono text-[9px] font-black px-2 py-0.5 uppercase tracking-widest flex items-center gap-1">
              <BrainCircuit className="h-3 w-3" />
              AI Copilot
            </span>
          </div>
          <h2 className="font-sans text-3xl font-black uppercase tracking-tight text-white mt-1">
            Haven Intelligence Console
          </h2>
          <p className="font-serif italic text-sm text-white/60 mt-1">
            Business advisory dashboard powered by Gemini to suggest operation tips and promotional packages.
          </p>
        </div>
        
        <button 
          onClick={fetchAIRecommendations}
          disabled={loading}
          className="bg-[#FF2E2E] hover:bg-[#FF2E2E]/95 disabled:bg-[#FF2E2E]/50 text-white font-sans text-xs font-black uppercase tracking-widest py-3 px-5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <Sparkles className="h-4 w-4" />
          <span>{loading ? 'Analyzing...' : 'Recalibrate Business Strategy'}</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-brand-surface border border-white/10 p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
          <div className="w-10 h-10 border-4 border-t-[#FF2E2E] border-white/10 rounded-full animate-spin" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#FF2E2E] font-extrabold animate-pulse">
            {statusMsg}
          </p>
          <p className="font-serif italic text-xs text-white/40">
            Synthesizing membership trends, staff utilization rates, and pending equipment service tickets...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Tips and Insights (Col-span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-brand-surface border border-white/10 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <Lightbulb className="h-5 w-5 text-[#FF2E2E]" />
                  <h3 className="font-sans text-base font-black uppercase tracking-wider text-white">
                    Operational Improvement Tips
                  </h3>
                </div>
                {isFallback && (
                  <span className="text-[8px] font-mono text-white/40 border border-white/10 px-2 py-0.5 uppercase">
                    Local Core Engine
                  </span>
                )}
              </div>

              <p className="font-serif italic text-xs text-white/60 leading-relaxed">
                Gemini recommendations generated for today's staffing, safety, and athlete-retention metrics:
              </p>

              <div className="space-y-4 mt-2">
                {tips.map((tip, index) => {
                  // Format simple markdown bold if present
                  const parts = tip.split('**');
                  return (
                    <div 
                      key={index}
                      className="p-4 border border-white/5 bg-white/[0.02] flex items-start gap-3.5 hover:border-[#FF2E2E]/30 transition-all"
                    >
                      <div className="w-6 h-6 rounded-none bg-[#FF2E2E]/10 border border-[#FF2E2E]/20 flex items-center justify-center font-mono text-[10px] font-black text-[#FF2E2E] shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed">
                        {parts.map((p, idx) => idx % 2 === 1 ? <strong key={idx} className="text-[#FF2E2E] font-black">{p}</strong> : p)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Loyalty Milestone & Stride Point explanation */}
            <div className="bg-brand-surface-low border border-dashed border-white/10 p-5 space-y-2.5">
              <span className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#FF2E2E]">
                Core Reward Mechanism
              </span>
              <h4 className="font-sans text-xs font-black uppercase tracking-wider">
                STRIDE POINT ENGAGEMENT METRIC
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed">
                By gamifying check-ins and nutrition logs, athletes earn **Stride Points**. High points lock them into loyalty benefits, heavily cutting down user drop-off. Keep this loyalty loop active!
              </p>
            </div>

          </div>

          {/* Right Column: Promotional & Pricing Schemes (Col-span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-brand-surface border border-white/10 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                <Ticket className="h-5 w-5 text-[#FF2E2E]" />
                <h3 className="font-sans text-base font-black uppercase tracking-wider text-white">
                  Promotional & Pricing Schemes
                </h3>
              </div>

              <p className="font-serif italic text-xs text-white/60">
                Deploy these seasonal packages or referral incentives to boost financial retention and subscription velocity:
              </p>

              <div className="space-y-4">
                {schemes.map((scheme, index) => (
                  <div 
                    key={index}
                    className="border border-white/15 bg-brand-surface-low p-4.5 flex flex-col justify-between hover:border-[#FF2E2E]/40 transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full translate-x-8 -translate-y-8" />
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-sans text-xs font-black uppercase text-[#FF2E2E] tracking-tight">
                          {scheme.title}
                        </h4>
                        <span className="font-mono text-[8px] uppercase tracking-wider font-extrabold text-white/40 border border-white/5 bg-white/[0.02] px-2 py-0.5">
                          Tier: {index === 0 ? 'Urgent' : 'General'}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed mt-1">
                        {scheme.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px]">
                      <span className="font-mono text-white/40 uppercase">
                        Target: <strong className="text-white font-bold">{scheme.target}</strong>
                      </span>
                      <button 
                        onClick={() => alert(`Scheme '${scheme.title}' active settings launched. Promotional alert dispatched to ${scheme.target}.`)}
                        className="text-white hover:text-[#FF2E2E] font-mono uppercase font-black tracking-wider flex items-center gap-1 transition-colors"
                      >
                        <span>Activate</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#FF2E2E]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Metrics checklist */}
            <div className="bg-brand-surface border border-white/10 p-5 space-y-4">
              <span className="font-mono text-[8px] font-black uppercase tracking-widest text-[#FF2E2E] block">
                BUSINESS HEALTH SUMMARY
              </span>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-white/60">Coaches Staffing Ratio</span>
                  <span className="text-emerald-400 font-bold font-mono">1:{trainers.length > 0 ? Math.round(members.length / trainers.length) : 0} Athletes</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-white/60">Average Stride Points</span>
                  <span className="text-white font-black font-mono">
                    {members.length > 0 ? Math.round(members.reduce((acc, m) => acc + (m.stridePoints || 0), 0) / members.length) : 0} pts
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-white/60">Failing Equipment Ratio</span>
                  <span className="text-[#FF2E2E] font-bold font-mono">2 / 5 units</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
