import React from 'react';
import { View } from '../types';
import { LayoutDashboard, PieChart, Zap, MessageSquareText, Wallet, ArrowLeftRight } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'Home', icon: LayoutDashboard },
    { id: View.PORTFOLIO, label: 'Portfolio', icon: Wallet },
    { id: View.INTELLIGENCE, label: 'Intelligence', icon: Zap },
    { id: View.ADVISORY, label: 'Advisor', icon: MessageSquareText },
  ];

  return (
    <div className="w-16 lg:w-64 bg-rh-black border-r border-zinc-900 flex flex-col h-screen sticky top-0 z-30">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-2">
        <div className="text-rh-green">
           <ArrowLeftRight size={28} strokeWidth={2.5} />
        </div>
        <span className="hidden lg:block font-bold text-lg tracking-tight">
          UniAsset
        </span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
              }`}
            >
              <item.icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-rh-green' : 'text-zinc-500 group-hover:text-white'}
              />
              <span className="hidden lg:block text-sm">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-900">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
            JD
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold">John Doe</p>
            <p className="text-xs text-rh-green">Pro Account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;