
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import Intelligence from './components/Intelligence';
import Advisory from './components/Advisory';
import LandingPage from './components/LandingPage';
import { View, Asset, MarketEvent } from './types';
import { INITIAL_ASSETS, INITIAL_EVENTS } from './constants';
import { generateMarketInsights } from './services/geminiService';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [events, setEvents] = useState<MarketEvent[]>(INITIAL_EVENTS);

  // Effect to refresh market intelligence when assets change significantly
  useEffect(() => {
    const refreshInsights = async () => {
       if (assets.length > 0 && process.env.API_KEY) {
         try {
           const newInsights = await generateMarketInsights(assets);
           setEvents(prev => {
             const existingTitles = new Set(prev.map(e => e.title));
             const uniqueNew = newInsights.filter(e => !existingTitles.has(e.title));
             return [...prev, ...uniqueNew];
           });
         } catch (e) {
           console.log("Insight generation skipped/failed");
         }
       }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets.length]);

  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard assets={assets} events={events} onViewChange={setCurrentView} />;
      case View.PORTFOLIO:
        return <Portfolio assets={assets} setAssets={setAssets} />;
      case View.INTELLIGENCE:
        return <Intelligence events={events} portfolio={assets} />;
      case View.ADVISORY:
        return <Advisory portfolio={assets} events={events} />;
      default:
        return <Dashboard assets={assets} events={events} onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 glass-panel border-b border-slate-800 flex justify-between items-center shrink-0 z-20">
          <span className="font-bold text-lg text-blue-100 tracking-tight">UniAsset</span>
          <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-xs border border-slate-700">JD</div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative scroll-smooth">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
