import React, { useState } from 'react';
import { Asset, ProductType } from '../types';
import { Plus, Search, Wand2, Loader2, Trash2 } from 'lucide-react';
import { parseAssetEntry } from '../services/geminiService';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface PortfolioProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
}

// Small sparkline component for each row
const Sparkline = ({ color }: { color: string }) => {
  const data = Array.from({ length: 10 }, () => ({ val: Math.random() }));
  return (
    <div className="h-8 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Area type="monotone" dataKey="val" stroke={color} strokeWidth={2} fillOpacity={0} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const Portfolio: React.FC<PortfolioProps> = ({ assets, setAssets }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [aiInput, setAiInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Manual Form State
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    platform: 'Robinhood',
    productType: 'Stock',
    currency: 'USD',
    quantity: 0,
    unitPrice: 0,
    symbol: '',
  });

  const handleAddAsset = () => {
    if (!newAsset.symbol || !newAsset.quantity || !newAsset.unitPrice) return;
    
    const asset: Asset = {
      id: Math.random().toString(36).substr(2, 9),
      platform: newAsset.platform || 'Unknown',
      productType: newAsset.productType || 'Other',
      symbol: newAsset.symbol.toUpperCase(),
      quantity: Number(newAsset.quantity),
      unitPrice: Number(newAsset.unitPrice),
      totalValue: Number(newAsset.quantity) * Number(newAsset.unitPrice),
      currency: newAsset.currency || 'USD',
      exposureTags: newAsset.exposureTags || ['General'],
      change24h: (Math.random() * 5) - 2.5 
    };

    setAssets([...assets, asset]);
    setIsAdding(false);
    resetForm();
  };

  const handleAiParse = async () => {
    if (!aiInput.trim()) return;
    setIsProcessing(true);
    try {
      const parsed = await parseAssetEntry(aiInput);
      setNewAsset({ ...newAsset, ...parsed });
      setMode('manual');
      setAiInput('');
    } catch (e) {
      console.error(e);
      alert('Failed to interpret asset.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setNewAsset({
      platform: 'Robinhood',
      productType: 'Stock',
      currency: 'USD',
      quantity: 0,
      unitPrice: 0,
      symbol: '',
    });
  };

  const deleteAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-zinc-900 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
          <p className="text-zinc-500 mt-1">Your assets</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-zinc-100 hover:bg-white text-black px-6 py-3 rounded-full font-bold text-sm transition-transform active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} strokeWidth={3} /> Add Asset
        </button>
      </div>

      {isAdding && (
        <div className="bg-rh-card border border-zinc-800 rounded-2xl p-6 mb-8 animate-in slide-in-from-top-4">
          <div className="flex gap-6 mb-6">
            <button onClick={() => setMode('manual')} className={`pb-2 text-sm font-bold ${mode === 'manual' ? 'text-white border-b-2 border-rh-green' : 'text-zinc-500'}`}>Manual</button>
            <button onClick={() => setMode('ai')} className={`pb-2 text-sm font-bold flex items-center gap-2 ${mode === 'ai' ? 'text-white border-b-2 border-rh-green' : 'text-zinc-500'}`}>
              <Wand2 size={14} /> AI Import
            </button>
          </div>

          {mode === 'ai' ? (
            <div className="space-y-4">
               <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Paste details or type: 'Bought 50 shares of AAPL at $175'"
                className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-rh-green h-24 resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAiParse}
                  disabled={isProcessing}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-full text-sm font-bold"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={16} /> : 'Parse'}
                </button>
              </div>
            </div>
          ) : (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input placeholder="Symbol (e.g. AAPL)" value={newAsset.symbol} onChange={e => setNewAsset({...newAsset, symbol: e.target.value})} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-rh-green outline-none" />
                <input placeholder="Qty" type="number" value={newAsset.quantity || ''} onChange={e => setNewAsset({...newAsset, quantity: Number(e.target.value)})} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-rh-green outline-none" />
                <input placeholder="Price" type="number" value={newAsset.unitPrice || ''} onChange={e => setNewAsset({...newAsset, unitPrice: Number(e.target.value)})} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-rh-green outline-none" />
                <select value={newAsset.productType} onChange={e => setNewAsset({...newAsset, productType: e.target.value as ProductType})} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-rh-green outline-none text-zinc-300">
                  {['Stock', 'ETF', 'Crypto', 'Derivatives', 'Commodities', 'Cash', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="col-span-full flex justify-end gap-3 mt-2">
                   <button onClick={() => setIsAdding(false)} className="px-5 py-2 text-zinc-400 hover:text-white font-bold text-sm">Cancel</button>
                   <button onClick={handleAddAsset} className="bg-rh-green hover:bg-green-400 text-black px-6 py-2 rounded-full font-bold text-sm">Save</button>
                </div>
             </div>
          )}
        </div>
      )}

      {/* Asset List */}
      <div className="space-y-1">
        <div className="grid grid-cols-12 px-4 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <div className="col-span-4">Name</div>
          <div className="col-span-3 hidden md:block text-right">Trend</div>
          <div className="col-span-4 md:col-span-3 text-right">Price</div>
          <div className="col-span-4 md:col-span-2 text-right">Equity</div>
        </div>

        {assets.map((asset) => {
          const isPositive = (asset.change24h || 0) >= 0;
          return (
            <div key={asset.id} className="group grid grid-cols-12 items-center p-4 rounded-xl hover:bg-zinc-900 transition-colors border-b border-zinc-900 hover:border-transparent cursor-pointer">
              <div className="col-span-4">
                <div className="font-bold text-white text-base">{asset.symbol}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{asset.productType} • {asset.quantity} shares</div>
              </div>
              
              <div className="col-span-3 hidden md:flex justify-end pr-4">
                 <Sparkline color={isPositive ? '#00c805' : '#ff5000'} />
              </div>

              <div className="col-span-4 md:col-span-3 text-right">
                <div className="font-medium text-white">${asset.unitPrice.toLocaleString()}</div>
                <div className={`text-xs font-medium ${isPositive ? 'text-rh-green' : 'text-rh-red'}`}>
                  {isPositive ? '+' : ''}{asset.change24h?.toFixed(2)}%
                </div>
              </div>

              <div className="col-span-4 md:col-span-2 text-right relative">
                 <div className="font-bold text-white">${asset.totalValue.toLocaleString()}</div>
                 <button 
                  onClick={(e) => { e.stopPropagation(); deleteAsset(asset.id); }}
                  className="absolute right-[-40px] top-1/2 -translate-y-1/2 p-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Portfolio;