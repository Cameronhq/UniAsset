
import React from 'react';
import { ArrowRight, Smartphone, Shield, Zap, Globe, Lock, Cpu, TrendingUp, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-rh-green selection:text-black">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onEnterApp}>
            <div className="w-8 h-8 bg-rh-green rounded-lg flex items-center justify-center">
               <TrendingUp size={20} className="text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight">UniAsset</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</button>
            <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Security</button>
            <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onEnterApp} className="text-sm font-bold text-white hover:text-rh-green transition-colors">
              Log in
            </button>
            <button onClick={onEnterApp} className="bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-zinc-200 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-rh-green/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-rh-green animate-pulse"></span>
            Now powering over $1B in tracked assets
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.95] md:leading-[0.9]">
            Wealth Intelligence, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rh-green to-emerald-200">Centralized.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Stop checking 10 different apps. UniAsset combines your stocks, crypto, and cash into one institutional-grade dashboard powered by Gemini AI.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
             <button 
              onClick={onEnterApp}
              className="w-full md:w-auto bg-rh-green text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-green-400 transition-all flex items-center justify-center gap-2"
            >
              Start Free Trial <ArrowRight size={20} />
            </button>
             <button 
              onClick={onEnterApp}
              className="w-full md:w-auto bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-zinc-800 transition-all"
            >
              View Demo
            </button>
          </div>
          
          <p className="text-xs text-zinc-600 font-mono">No credit card required • SOC2 Type II Certified</p>
        </div>

        {/* Floating Phone / Dashboard Preview */}
        <div className="mt-24 relative w-full max-w-6xl mx-auto">
           {/* Glow behind dashboard */}
           <div className="absolute inset-0 bg-gradient-to-t from-rh-green/20 to-transparent blur-3xl -z-10" />
           
           <div className="bg-[#0A0A0B] rounded-t-3xl border border-zinc-800 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] relative group">
             {/* Mock Dashboard UI */}
             <div className="absolute inset-0 p-8 flex flex-col">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-8">
                  <div className="space-y-1">
                    <div className="h-2 w-32 bg-zinc-800 rounded-full" />
                    <div className="h-8 w-48 bg-zinc-700 rounded-lg animate-pulse" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-zinc-800 rounded-full" />
                    <div className="h-10 w-10 bg-zinc-800 rounded-full" />
                  </div>
                </div>
                <div className="flex gap-8 h-full">
                   <div className="w-64 hidden md:block space-y-4 border-r border-zinc-800 pr-8">
                      <div className="h-12 w-full bg-zinc-900 rounded-lg border border-zinc-800/50" />
                      <div className="h-12 w-full bg-zinc-900/50 rounded-lg" />
                      <div className="h-12 w-full bg-zinc-900/50 rounded-lg" />
                   </div>
                   <div className="flex-1 space-y-6">
                      <div className="h-64 w-full bg-gradient-to-b from-rh-green/5 to-transparent rounded-2xl border border-rh-green/10 relative overflow-hidden">
                        <svg className="absolute bottom-0 left-0 w-full h-[80%] opacity-50" preserveAspectRatio="none">
                           <path d="M0,200 C300,150 600,220 900,100 L1200,150 L1200,300 L0,300 Z" fill="url(#grad)" />
                           <path d="M0,200 C300,150 600,220 900,100 L1200,150" stroke="#00c805" strokeWidth="3" fill="none" />
                           <defs>
                             <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="0%" stopColor="#00c805" stopOpacity="0.2"/>
                               <stop offset="100%" stopColor="#00c805" stopOpacity="0"/>
                             </linearGradient>
                           </defs>
                        </svg>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                         <div className="h-32 bg-zinc-900 rounded-xl border border-zinc-800" />
                         <div className="h-32 bg-zinc-900 rounded-xl border border-zinc-800" />
                         <div className="h-32 bg-zinc-900 rounded-xl border border-zinc-800" />
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Overlay Content */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end justify-center pb-12 pointer-events-none">
                <span className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Live Interactive Demo</span>
             </div>
           </div>
        </div>
      </main>

      {/* Integration Logos */}
      <section className="py-10 border-y border-zinc-900 bg-zinc-950/50">
         <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-zinc-500 text-sm font-bold mb-8 uppercase tracking-widest">Connects seamlessly with</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Text placeholders for logos */}
               <span className="text-xl font-bold font-serif">Robinhood</span>
               <span className="text-xl font-bold font-sans tracking-tight">COINBASE</span>
               <span className="text-xl font-bold italic font-serif">Fidelity</span>
               <span className="text-xl font-bold font-mono">BINANCE</span>
               <span className="text-xl font-bold tracking-widest font-sans">E*TRADE</span>
               <span className="text-xl font-extrabold italic">Schwab</span>
            </div>
         </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 bg-black">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
               <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Total clarity. Absolute control.</h2>
               <p className="text-xl text-zinc-400">UniAsset replaces your spreadsheets with a live, intelligent command center for your entire net worth.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-rh-green/50 transition-colors group">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                     <Globe className="text-blue-400" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Universal Sync</h3>
                  <p className="text-zinc-400 leading-relaxed">Connect unlimited brokerage accounts and crypto wallets. We normalize the data into one clean view automatically.</p>
               </div>
               
               <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-rh-green/50 transition-colors group">
                  <div className="w-14 h-14 bg-rh-green/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rh-green/20 transition-colors">
                     <Cpu className="text-rh-green" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">AI Intelligence</h3>
                  <p className="text-zinc-400 leading-relaxed">Powered by Gemini 3.0. Receive proactive alerts when news events (like Fed rates) specifically impact your holdings.</p>
               </div>
               
               <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-rh-green/50 transition-colors group">
                  <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                     <Shield className="text-orange-400" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Smart Advisory</h3>
                  <p className="text-zinc-400 leading-relaxed">Chat with an AI advisor that knows your portfolio context. Get instant risk analysis and rebalancing ideas.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Feature Deep Dive - Left Image */}
      <section className="py-24 border-t border-zinc-900">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 order-2 md:order-1">
               <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl">
                  {/* Mock UI snippet */}
                  <div className="p-6 border-b border-zinc-800 flex justify-between">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                     </div>
                  </div>
                  <div className="p-8 space-y-4">
                     {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-black/50 rounded-xl border border-zinc-800">
                           <div className="w-10 h-10 rounded-full bg-zinc-800" />
                           <div className="flex-1 space-y-2">
                              <div className="h-2 w-24 bg-zinc-700 rounded" />
                              <div className="h-2 w-16 bg-zinc-800 rounded" />
                           </div>
                           <div className="h-4 w-12 bg-rh-green/20 rounded text-right" />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            <div className="flex-1 space-y-6 order-1 md:order-2">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                  <Smartphone size={14} /> MULTI-WALLET SUPPORT
               </div>
               <h2 className="text-4xl font-bold leading-tight">Your entire net worth.<br/>In your pocket.</h2>
               <p className="text-lg text-zinc-400">
                  Whether it's a MetaMask wallet, a Fidelity 401k, or a Robinhood trading account, UniAsset brings it all together. No more spreadsheet updates on Sunday nights.
               </p>
               <ul className="space-y-3 pt-4">
                  {['Real-time sync across 50+ platforms', 'Auto-categorization of assets', 'Currency conversion & normalization'].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-zinc-300">
                        <CheckCircle2 size={20} className="text-rh-green" /> {item}
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-rh-green/5" />
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
               Ready to upgrade your <br/>
               <span className="text-rh-green">financial operating system?</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
               Join 50,000+ investors who manage over $1B in assets on UniAsset.
               Start your 14-day free trial today.
            </p>
            <div className="pt-8">
               <button 
                  onClick={onEnterApp}
                  className="bg-white text-black px-10 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
               >
                  Get Started for Free
               </button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black pt-20 pb-10">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 md:col-span-1 space-y-4">
               <span className="font-bold text-xl tracking-tight">UniAsset</span>
               <p className="text-sm text-zinc-500">The first intelligent operating system for modern investors.</p>
               <div className="flex gap-4 text-zinc-400">
                  {/* Social icons placeholder */}
               </div>
            </div>
            <div className="space-y-4">
               <h4 className="font-bold text-white">Product</h4>
               <ul className="space-y-2 text-sm text-zinc-500">
                  <li className="hover:text-white cursor-pointer">Features</li>
                  <li className="hover:text-white cursor-pointer">Integrations</li>
                  <li className="hover:text-white cursor-pointer">Pricing</li>
                  <li className="hover:text-white cursor-pointer">Changelog</li>
               </ul>
            </div>
            <div className="space-y-4">
               <h4 className="font-bold text-white">Resources</h4>
               <ul className="space-y-2 text-sm text-zinc-500">
                  <li className="hover:text-white cursor-pointer">Documentation</li>
                  <li className="hover:text-white cursor-pointer">API Reference</li>
                  <li className="hover:text-white cursor-pointer">Community</li>
               </ul>
            </div>
            <div className="space-y-4">
               <h4 className="font-bold text-white">Company</h4>
               <ul className="space-y-2 text-sm text-zinc-500">
                  <li className="hover:text-white cursor-pointer">About</li>
                  <li className="hover:text-white cursor-pointer">Blog</li>
                  <li className="hover:text-white cursor-pointer">Careers</li>
                  <li className="hover:text-white cursor-pointer">Legal</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 border-t border-zinc-900 pt-8">
            <p>© 2024 UniAsset Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
               <span className="hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
               <span className="hover:text-zinc-400 cursor-pointer">Terms of Service</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
