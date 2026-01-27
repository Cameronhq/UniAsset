import React from 'react';
import { Asset, MarketEvent } from '../types';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowUpRight, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface DashboardProps {
  assets: Asset[];
  events: MarketEvent[];
}

// Mock historical data generator
const generateHistory = (currentValue: number) => {
  const data = [];
  let value = currentValue * 0.8;
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.45) * (currentValue * 0.05);
    value += change;
    data.push({
      date: `Day ${i + 1}`,
      value: value
    });
  }
  // Ensure last point matches current
  data[data.length - 1].value = currentValue;
  return data;
};

const Dashboard: React.FC<DashboardProps> = ({ assets, events }) => {
  const totalValue = assets.reduce((acc, curr) => acc + curr.totalValue, 0);
  const historyData = React.useMemo(() => generateHistory(totalValue), [totalValue]);
  
  const upcomingRisks = events.filter(e => e.type === 'upcoming' && e.impactStrength === 'high');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Hero Section: Portfolio Value & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">${totalValue.toLocaleString()}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-rh-green font-medium flex items-center">
                <ArrowUpRight size={20} className="mr-1" /> $1,240.50 (2.4%)
              </span>
              <span className="text-zinc-500 font-medium">Today</span>
            </div>
          </div>

          <div className="h-[300px] w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00c805" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00c805" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e20', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#00c805' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  labelStyle={{ display: 'none' }}
                  cursor={{ stroke: '#333', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00c805" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Quick Watchlist / Risks */}
        <div className="bg-rh-card rounded-2xl p-6 border border-zinc-800 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Market Intelligence</h3>
            <Zap size={18} className="text-zinc-500" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-400 text-sm">Portfolio Health</span>
              <span className="text-rh-green font-bold flex items-center gap-1">
                <ShieldCheck size={16} /> 92/100
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-zinc-300">Priority Events</p>
              {upcomingRisks.length > 0 ? (
                upcomingRisks.slice(0, 3).map(event => (
                  <div key={event.id} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-orange-500 font-bold uppercase tracking-wider">Upcoming</span>
                      <span className="text-zinc-500 text-xs">{event.date}</span>
                    </div>
                    <p className="font-medium text-sm text-white mb-1 line-clamp-2">{event.title}</p>
                    <div className="flex gap-1 mt-2">
                       {event.affectedAssets.map(a => (
                         <span key={a} className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">{a}</span>
                       ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-zinc-500 text-sm italic bg-zinc-900/50 rounded-xl">
                  No high priority risks detected.
                </div>
              )}
            </div>
            
             <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-bold text-white transition-colors">
              View All Events
            </button>
          </div>
        </div>
      </div>

      {/* Buying Power / Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 border-t border-zinc-900">
          <p className="text-zinc-500 font-medium text-sm mb-1">Buying Power</p>
          <p className="text-xl font-bold">$4,250.00</p>
        </div>
        <div className="p-6 border-t border-zinc-900">
          <p className="text-zinc-500 font-medium text-sm mb-1">Day's Gain</p>
          <p className="text-xl font-bold text-rh-green">+$1,240.50</p>
        </div>
        <div className="p-6 border-t border-zinc-900">
          <p className="text-zinc-500 font-medium text-sm mb-1">Top Sector</p>
          <p className="text-xl font-bold">Technology</p>
        </div>
        <div className="p-6 border-t border-zinc-900">
          <p className="text-zinc-500 font-medium text-sm mb-1">Risk Level</p>
          <p className="text-xl font-bold text-orange-500">Moderate</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;