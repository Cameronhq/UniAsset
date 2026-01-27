
import React, { useState } from 'react';
import { MarketEvent, ImpactStrength, Asset } from '../types';
import { Calendar, ArrowUpRight, ArrowDownRight, Activity, Info, ChevronDown, ChevronUp, Wallet } from 'lucide-react';

interface IntelligenceProps {
  events: MarketEvent[];
  portfolio: Asset[];
}

const getImpactColor = (strength: ImpactStrength) => {
  switch (strength) {
    case 'high': return 'text-red-400';
    case 'medium': return 'text-amber-400';
    case 'low': return 'text-blue-400';
    default: return 'text-slate-400';
  }
};

const getImpactBg = (strength: ImpactStrength) => {
  switch (strength) {
    case 'high': return 'bg-red-500/10 border-red-500/20';
    case 'medium': return 'bg-amber-500/10 border-amber-500/20';
    case 'low': return 'bg-blue-500/10 border-blue-500/20';
    default: return 'bg-slate-800 border-slate-700';
  }
};

const EventCard: React.FC<{ event: MarketEvent; portfolio: Asset[] }> = ({ event, portfolio }) => {
  const [expanded, setExpanded] = useState(false);

  // Find matching assets in portfolio
  const matchedAssets = portfolio.filter(asset => 
    event.affectedAssets.includes(asset.symbol) || 
    asset.exposureTags.some(tag => event.affectedAssets.includes(tag))
  );

  const totalExposureValue = matchedAssets.reduce((sum, asset) => sum + asset.totalValue, 0);

  return (
    <div 
      onClick={() => setExpanded(!expanded)}
      className={`p-5 rounded-xl border mb-4 transition-all duration-300 cursor-pointer group hover:shadow-lg ${event.type === 'past' ? 'bg-slate-900/40 border-blue-900/20 hover:border-blue-500/30' : 'bg-slate-900/40 border-orange-900/20 hover:border-orange-500/30'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${event.type === 'past' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
            {event.type === 'past' ? 'Occurred' : 'Upcoming'}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
            <Calendar size={12} /> {event.date}
          </span>
        </div>
        <div className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wide border ${getImpactBg(event.impactStrength)} ${getImpactColor(event.impactStrength)}`}>
          {event.impactStrength.toUpperCase()}
        </div>
      </div>
      
      <h3 className="text-slate-100 font-semibold text-lg mb-2 group-hover:text-white transition-colors">{event.title}</h3>
      
      <div className={`text-slate-400 text-sm mb-4 leading-relaxed bg-slate-950/30 p-3 rounded-lg border border-white/5 ${expanded ? '' : 'line-clamp-2'}`}>
        {event.reasoning}
      </div>

      {/* Expanded Details: Portfolio Impact */}
      {expanded && matchedAssets.length > 0 && (
        <div className="mb-4 animate-in slide-in-from-top-2">
           <div className="bg-zinc-900/80 rounded-lg p-3 border border-zinc-800">
             <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800">
               <span className="text-xs font-bold text-zinc-400 flex items-center gap-1"><Wallet size={12} /> YOUR EXPOSURE</span>
               <span className="text-xs font-bold text-white">${totalExposureValue.toLocaleString()}</span>
             </div>
             <div className="space-y-2">
               {matchedAssets.map(asset => (
                 <div key={asset.id} className="flex justify-between text-xs">
                   <span className="text-zinc-300">{asset.quantity} {asset.symbol}</span>
                   <span className="text-zinc-500">${asset.totalValue.toLocaleString()}</span>
                 </div>
               ))}
             </div>
           </div>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Exposure:</span>
          <div className="flex flex-wrap gap-1">
            {event.affectedAssets.map(asset => (
              <span key={asset} className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${matchedAssets.some(ma => ma.symbol === asset || ma.exposureTags.includes(asset)) ? 'bg-rh-green/10 text-rh-green border-rh-green/30 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                {asset}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1 text-xs font-medium">
             {event.direction === 'positive' && <span className="text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-1 rounded"><ArrowUpRight size={14} className="mr-1" /> Bullish</span>}
             {event.direction === 'negative' && <span className="text-red-400 flex items-center bg-red-500/10 px-2 py-1 rounded"><ArrowDownRight size={14} className="mr-1" /> Bearish</span>}
             {event.direction === 'mixed' && <span className="text-amber-400 flex items-center bg-amber-500/10 px-2 py-1 rounded"><Activity size={14} className="mr-1" /> Volatile</span>}
             {event.direction === 'neutral' && <span className="text-slate-400 flex items-center bg-slate-800 px-2 py-1 rounded"><Info size={14} className="mr-1" /> Neutral</span>}
           </div>
           {expanded ? <ChevronUp size={14} className="text-zinc-600" /> : <ChevronDown size={14} className="text-zinc-600" />}
        </div>
      </div>
    </div>
  );
};

const Intelligence: React.FC<IntelligenceProps> = ({ events, portfolio }) => {
  const pastEvents = events.filter(e => e.type === 'past');
  const upcomingEvents = events.filter(e => e.type === 'upcoming');

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
          <Activity className="text-blue-500" /> Intelligence Hub
        </h2>
        <p className="text-slate-400 text-sm mt-1">Real-time analysis of market events impacting your specific portfolio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Past Events Column */}
        <div className="flex flex-col min-h-0 glass-panel rounded-2xl p-1 border-none bg-transparent">
          <div className="flex items-center gap-3 mb-4 px-2 py-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            <h3 className="font-semibold text-blue-100 tracking-wide uppercase text-sm">Past & Pricing-In</h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pl-2">
            {pastEvents.length === 0 ? (
              <div className="text-center p-8 text-slate-600 text-sm border border-dashed border-slate-800 rounded-xl bg-slate-900/20">No recent significant events detected.</div>
            ) : (
              pastEvents.map(event => <EventCard key={event.id} event={event} portfolio={portfolio} />)
            )}
          </div>
        </div>

        {/* Upcoming Events Column */}
        <div className="flex flex-col min-h-0 glass-panel rounded-2xl p-1 border-none bg-transparent">
           <div className="flex items-center gap-3 mb-4 px-2 py-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
            <h3 className="font-semibold text-orange-100 tracking-wide uppercase text-sm">Upcoming & Risks</h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pl-2">
            {upcomingEvents.length === 0 ? (
               <div className="text-center p-8 text-slate-600 text-sm border border-dashed border-slate-800 rounded-xl bg-slate-900/20">No upcoming major risks identified.</div>
            ) : (
              upcomingEvents.map(event => <EventCard key={event.id} event={event} portfolio={portfolio} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
