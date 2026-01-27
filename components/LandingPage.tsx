import React from 'react';
import { ArrowRight, Smartphone, Shield, Zap } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <span className="font-extrabold text-2xl tracking-tighter">UniAsset</span>
        <div className="flex items-center gap-6">
          <button className="text-sm font-bold text-zinc-300 hover:text-white hidden md:block">Technology</button>
          <button className="text-sm font-bold text-zinc-300 hover:text-white hidden md:block">Pricing</button>
          <button onClick={onEnterApp} className="text-sm font-bold text-white hover:text-zinc-300">
            Log in
          </button>
          <button onClick={onEnterApp} className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-zinc-200 transition-colors">
            Sign up
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9]">
            The Future of <br />
            <span className="text-rh-green">Intelligent</span> Investing.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-medium">
            Unified portfolio tracking met with institutional-grade AI analysis. 
            Commission-free intelligence.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
             <button 
              onClick={onEnterApp}
              className="bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Floating Phone / UI Mockup Abstract */}
        <div className="mt-20 relative w-full max-w-5xl mx-auto h-[400px] md:h-[600px] bg-zinc-900 rounded-t-[3rem] border border-zinc-800 border-b-0 overflow-hidden shadow-[0_-20px_60px_-15px_rgba(0,200,5,0.1)] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
           <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
             <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-4">Live Dashboard</p>
             <h3 className="text-5xl font-bold text-white">$142,394.21</h3>
             <p className="text-rh-green font-bold mt-2 text-lg">+$3,241.05 (2.41%)</p>
           </div>
           
           {/* Abstract Chart Line */}
           <svg className="absolute bottom-0 left-0 w-full h-[300px]" preserveAspectRatio="none">
             <path d="M0,250 C100,200 200,280 400,150 C600,20 800,100 1200,50 L1200,400 L0,400 Z" fill="rgba(0, 200, 5, 0.05)" />
             <path d="M0,250 C100,200 200,280 400,150 C600,20 800,100 1200,50" fill="none" stroke="#00c805" strokeWidth="3" />
           </svg>
        </div>
      </main>

      {/* Feature Strip */}
      <div className="border-t border-zinc-900 py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
             <Zap className="text-rh-green" size={32} />
             <h3 className="text-xl font-bold">Real-time Impact</h3>
             <p className="text-zinc-500 font-medium">Instantly know how Fed rates or earnings reports affect your specific holdings.</p>
          </div>
          <div className="space-y-4">
             <Smartphone className="text-white" size={32} />
             <h3 className="text-xl font-bold">Unified View</h3>
             <p className="text-zinc-500 font-medium">Connect stocks, crypto, and DeFi in one clean, powerful interface.</p>
          </div>
          <div className="space-y-4">
             <Shield className="text-white" size={32} />
             <h3 className="text-xl font-bold">AI Advisory</h3>
             <p className="text-zinc-500 font-medium">24/7 risk analysis and rebalancing suggestions powered by Gemini.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;