
import React, { useState, useRef, useEffect } from 'react';
import { Asset, ProductType, Wallet, AssetHistoryRecord, AssetChange } from '../types';
import { Plus, Search, Wand2, Loader2, Trash2, Upload, X, ChevronRight, Check, ChevronDown, Wallet as WalletIcon, RefreshCw, Link as LinkIcon, LogOut, Pencil, History, Save, Clock, ArrowRight } from 'lucide-react';
import { parseAssetEntry, getAssetMarketData } from '../services/geminiService';
import { validateAddress, fetchWalletAssets } from '../services/cryptoService';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { COMMON_SYMBOLS } from '../constants';

interface PortfolioProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
}

const COMMON_PLATFORMS = ['Robinhood', 'Fidelity', 'Coinbase', 'Binance', 'E*TRADE', 'Charles Schwab', 'Interactive Brokers', 'Webull', 'Kraken', 'Vanguard'];

const Portfolio: React.FC<PortfolioProps> = ({ assets, setAssets }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewHistoryId, setViewHistoryId] = useState<string | null>(null); // New state for history modal
  const [mode, setMode] = useState<'manual' | 'ai' | 'wallet'>('manual');
  
  // AI State
  const [aiInput, setAiInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wallet State
  const [connectedWallets, setConnectedWallets] = useState<Wallet[]>([]);
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [walletError, setWalletError] = useState('');

  // Manual Form State
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    currency: 'USD',
    platform: '',
    quantity: 0,
    unitPrice: 0,
    totalValue: 0,
    symbol: '',
    exposureTags: [],
  });

  // Autocomplete & Price Fetching State
  const [symbolSuggestions, setSymbolSuggestions] = useState<typeof COMMON_SYMBOLS>([]);
  const [showSymbolSuggestions, setShowSymbolSuggestions] = useState(false);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  // Platform Autocomplete State
  const [platformSuggestions, setPlatformSuggestions] = useState<string[]>([]);
  const [showPlatformSuggestions, setShowPlatformSuggestions] = useState(false);

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Logic to auto-calculate Unit Price or Total Value
  const handlePriceChange = (field: 'unitPrice' | 'totalValue', value: number) => {
    const qty = Number(newAsset.quantity) || 0;
    if (field === 'unitPrice') {
      setNewAsset({ ...newAsset, unitPrice: value, totalValue: qty * value });
    } else {
      setNewAsset({ ...newAsset, totalValue: value, unitPrice: qty > 0 ? value / qty : 0 });
    }
  };

  const handleQuantityChange = (qty: number) => {
    const price = Number(newAsset.unitPrice) || 0;
    setNewAsset({ ...newAsset, quantity: qty, totalValue: qty * price });
  };

  // Fetch market price when symbol changes
  const fetchMarketPrice = async (symbol: string) => {
    if (!symbol) return;
    setIsFetchingPrice(true);
    try {
      const data = await getAssetMarketData(symbol);
      if (data && data.price > 0) {
        setNewAsset(prev => {
          const qty = Number(prev.quantity) || 0;
          return {
            ...prev,
            unitPrice: data.price,
            totalValue: qty * data.price,
            productType: (data.productType as ProductType) || prev.productType,
            // If name isn't a standard field but we might want to store it in notes or use it later
            notes: data.name ? (prev.notes ? `${prev.notes} (${data.name})` : data.name) : prev.notes
          };
        });
      }
    } catch (e) {
      console.error("Error fetching price", e);
    } finally {
      setIsFetchingPrice(false);
    }
  };

  // Symbol Handlers
  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setNewAsset({ ...newAsset, symbol: val });
    
    if (val.length > 0) {
      const matches = COMMON_SYMBOLS.filter(s => 
        s.symbol.includes(val) || s.name.toUpperCase().includes(val)
      ).slice(0, 5);
      setSymbolSuggestions(matches);
      setShowSymbolSuggestions(true);
    } else {
      setShowSymbolSuggestions(false);
    }
  };

  const selectSymbol = (item: typeof COMMON_SYMBOLS[0]) => {
    setNewAsset({ 
      ...newAsset, 
      symbol: item.symbol, 
      productType: item.type as ProductType 
    });
    setShowSymbolSuggestions(false);
    fetchMarketPrice(item.symbol);
  };

  const handleSymbolBlur = () => {
    setTimeout(() => {
      setShowSymbolSuggestions(false);
      if (newAsset.symbol && !newAsset.unitPrice) {
        fetchMarketPrice(newAsset.symbol);
      }
    }, 200);
  };

  // Platform Handlers
  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewAsset({ ...newAsset, platform: val });
    
    if (val.length > 0) {
      const matches = COMMON_PLATFORMS.filter(p => 
        p.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setPlatformSuggestions(matches);
      setShowPlatformSuggestions(true);
    } else {
      setShowPlatformSuggestions(false);
    }
  };

  const selectPlatform = (platform: string) => {
    setNewAsset({ ...newAsset, platform });
    setShowPlatformSuggestions(false);
  };

  const handlePlatformBlur = () => {
    setTimeout(() => setShowPlatformSuggestions(false), 200);
  };

  // --- Wallet Handling ---

  const handleConnectWallet = async () => {
    setWalletError('');
    const chain = validateAddress(newWalletAddress.trim());
    
    if (!chain) {
      setWalletError('Invalid address. Use one of the demo addresses below for testing.');
      return;
    }

    // Check if already connected
    if (connectedWallets.some(w => w.address === newWalletAddress.trim())) {
      setWalletError('Wallet already connected.');
      return;
    }

    setIsConnectingWallet(true);
    
    const newWallet: Wallet = {
      id: Math.random().toString(36).substr(2, 9),
      address: newWalletAddress.trim(),
      chain: chain,
      lastSynced: Date.now()
    };

    try {
      // 1. Fetch assets for this new wallet
      const fetchedAssets = await fetchWalletAssets(newWallet);
      
      // 2. Add wallet to list
      setConnectedWallets(prev => [...prev, newWallet]);
      
      // 3. Add assets to portfolio (filtering out duplicates if re-adding same logic)
      setAssets(prev => {
        const others = prev.filter(a => a.walletAddress !== newWallet.address);
        return [...others, ...fetchedAssets];
      });

      setNewWalletAddress('');
    } catch (e) {
      setWalletError('Failed to fetch wallet data.');
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const removeWallet = (walletId: string, address: string) => {
    setConnectedWallets(prev => prev.filter(w => w.id !== walletId));
    // Remove assets associated with this wallet
    setAssets(prev => prev.filter(a => a.walletAddress !== address));
  };

  const syncAllWallets = async () => {
    setIsConnectingWallet(true);
    try {
      let allNewAssets: Asset[] = [];
      
      for (const wallet of connectedWallets) {
        const assets = await fetchWalletAssets(wallet);
        allNewAssets = [...allNewAssets, ...assets];
      }

      setAssets(prev => {
        // Keep manual assets, remove old wallet assets
        const manualAssets = prev.filter(a => !a.walletAddress);
        return [...manualAssets, ...allNewAssets];
      });
    } finally {
      setIsConnectingWallet(false);
    }
  };


  // --- AI Handling ---

  const handleAiParse = async () => {
    if (!aiInput.trim() && !selectedImage) return;
    setIsProcessing(true);
    try {
      // If image is present, strip the data URL prefix
      const base64Image = selectedImage ? selectedImage.split(',')[1] : undefined;
      const parsed = await parseAssetEntry(aiInput, base64Image);
      
      // Merge parsed data, respecting existing data if not overridden
      setNewAsset(prev => ({
        ...prev,
        ...parsed,
        totalValue: parsed.totalValue || (parsed.quantity && parsed.unitPrice ? parsed.quantity * parsed.unitPrice : 0)
      }));
      
      setMode('manual'); // Switch to manual for review
      setAiInput('');
      setSelectedImage(null);
    } catch (e) {
      console.error(e);
      alert('Failed to interpret asset. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Add / Edit Logic ---

  const startEditing = (asset: Asset) => {
    setNewAsset({ ...asset });
    setEditingId(asset.id);
    setMode('manual');
    setIsAdding(true);
  };

  const resetForm = () => {
    setNewAsset({
      currency: 'USD',
      quantity: 0,
      unitPrice: 0,
      totalValue: 0,
      symbol: '',
      platform: '',
      exposureTags: []
    });
    setEditingId(null);
    setMode('manual');
    setSelectedImage(null);
  };

  const handleSaveAsset = () => {
    if (!newAsset.symbol || !newAsset.quantity) return;
    
    // Final Calculation check
    const qty = Number(newAsset.quantity);
    let price = Number(newAsset.unitPrice);
    let total = Number(newAsset.totalValue);

    if (total === 0 && price > 0) total = qty * price;
    if (price === 0 && total > 0) price = total / qty;

    if (editingId) {
      // Update Existing
      setAssets(prev => prev.map(a => {
        if (a.id === editingId) {
          // Calculate changes
          const changes: AssetChange[] = [];
          if (a.quantity !== qty) changes.push({ field: 'quantity', oldValue: a.quantity, newValue: qty });
          if (a.unitPrice !== price) changes.push({ field: 'unitPrice', oldValue: a.unitPrice, newValue: price });
          if (a.notes !== newAsset.notes) changes.push({ field: 'notes', oldValue: a.notes, newValue: newAsset.notes });
          if (a.platform !== newAsset.platform) changes.push({ field: 'platform', oldValue: a.platform, newValue: newAsset.platform });

          // Only create history record if there are actual changes
          const historyEntry: AssetHistoryRecord | null = changes.length > 0 ? {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            changes
          } : null;

          const updatedHistory = a.updateHistory ? [...a.updateHistory] : [];
          if (historyEntry) {
            updatedHistory.push(historyEntry);
          }

          return {
            ...a,
            ...newAsset,
            quantity: qty,
            unitPrice: price,
            totalValue: total,
            // Preserve creation date
            createdAt: a.createdAt,
            // Append history
            updateHistory: updatedHistory
          } as Asset;
        }
        return a;
      }));
    } else {
      // Create New
      const asset: Asset = {
        id: Math.random().toString(36).substr(2, 9),
        platform: newAsset.platform || 'Other',
        productType: newAsset.productType || 'Other',
        symbol: newAsset.symbol.toUpperCase(),
        quantity: qty,
        unitPrice: price,
        totalValue: total,
        currency: newAsset.currency || 'USD',
        exposureTags: newAsset.exposureTags || ['General'],
        change24h: (Math.random() * 5) - 2.5, // Mock daily change
        createdAt: new Date().toISOString(),
        expectedYieldApy: newAsset.expectedYieldApy,
        notes: newAsset.notes,
        updateHistory: []
      };
      setAssets(prev => [...prev, asset]);
    }

    setIsAdding(false);
    resetForm();
  };

  const deleteAsset = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  // History Modal Component
  const HistoryModal = () => {
    if (!viewHistoryId) return null;
    const asset = assets.find(a => a.id === viewHistoryId);
    if (!asset) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center p-4 border-b border-zinc-800">
            <div>
               <h3 className="font-bold text-white flex items-center gap-2">
                 <History size={16} className="text-rh-green" /> History: {asset.symbol}
               </h3>
               <p className="text-xs text-zinc-500">Track changes and adjustments</p>
            </div>
            <button onClick={() => setViewHistoryId(null)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
              <X size={18} className="text-zinc-400" />
            </button>
          </div>
          
          <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
             {(!asset.updateHistory || asset.updateHistory.length === 0) ? (
               <div className="text-center py-8 text-zinc-600 text-sm">
                 No history records found for this asset.
               </div>
             ) : (
               [...asset.updateHistory].reverse().map((record, idx) => (
                 <div key={record.id} className="relative pl-6 border-l border-zinc-800 pb-4 last:pb-0 last:border-0">
                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-zinc-700 ring-4 ring-zinc-900" />
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-zinc-400">
                         {new Date(record.timestamp).toLocaleDateString()} <span className="font-normal opacity-70">{new Date(record.timestamp).toLocaleTimeString()}</span>
                       </span>
                    </div>
                    <div className="bg-black/40 rounded-lg p-3 border border-zinc-800 space-y-2">
                       {record.changes.map((change, i) => (
                         <div key={i} className="text-xs grid grid-cols-[80px_1fr] items-center gap-2">
                            <span className="text-zinc-500 uppercase font-bold tracking-wider">{change.field}</span>
                            <div className="flex items-center gap-2 overflow-hidden">
                               <span className="text-zinc-500 line-through truncate max-w-[80px]">{String(change.oldValue ?? '-')}</span>
                               <ArrowRight size={10} className="text-zinc-600 shrink-0" />
                               <span className="text-rh-green font-bold truncate">{String(change.newValue)}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               ))
             )}
             
             {/* Creation Record */}
             <div className="relative pl-6 border-l border-zinc-800">
                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-rh-green ring-4 ring-zinc-900" />
                <div className="mb-1">
                   <span className="text-xs font-bold text-zinc-400">
                     {new Date(asset.createdAt).toLocaleDateString()}
                   </span>
                </div>
                <div className="text-xs text-zinc-500">Asset Created</div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative">
      <HistoryModal />
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-zinc-900 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
          <p className="text-zinc-500 mt-1">Track & Manage Assets</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAdding(!isAdding);
          }}
          className="bg-zinc-100 hover:bg-white text-black px-6 py-3 rounded-full font-bold text-sm transition-transform active:scale-95 flex items-center gap-2"
        >
          {isAdding ? <X size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />} 
          {isAdding ? 'Close' : 'Add Position'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-rh-card border border-zinc-800 rounded-2xl p-6 mb-8 animate-in slide-in-from-top-4 shadow-2xl relative overflow-visible z-10">
           {/* Tab Switcher - Only show in Create mode */}
           {!editingId && (
             <div className="flex gap-6 mb-8 border-b border-zinc-800 overflow-x-auto">
              <button 
                onClick={() => setMode('manual')} 
                className={`pb-3 text-sm font-bold transition-all whitespace-nowrap ${mode === 'manual' ? 'text-rh-green border-b-2 border-rh-green' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Structured Entry
              </button>
              <button 
                onClick={() => setMode('ai')} 
                className={`pb-3 text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${mode === 'ai' ? 'text-rh-green border-b-2 border-rh-green' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Wand2 size={14} /> AI Import (Text / Image)
              </button>
              <button 
                onClick={() => setMode('wallet')} 
                className={`pb-3 text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${mode === 'wallet' ? 'text-rh-green border-b-2 border-rh-green' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <WalletIcon size={14} /> Web3 Connect
              </button>
            </div>
           )}

          {/* MODE: WALLET CONNECT */}
          {mode === 'wallet' && !editingId && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Connect Section */}
                <div className="space-y-4">
                  <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-3">Connect New Wallet</label>
                    <div className="flex gap-2">
                       <input 
                        value={newWalletAddress}
                        onChange={(e) => setNewWalletAddress(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleConnectWallet()}
                        placeholder="Paste Wallet Address (0x...)"
                        className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-rh-green outline-none text-white font-mono"
                       />
                       <button 
                        onClick={handleConnectWallet}
                        disabled={!newWalletAddress || isConnectingWallet}
                        className="bg-zinc-100 hover:bg-white text-black px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-50 transition-colors"
                       >
                         {isConnectingWallet ? <Loader2 className="animate-spin" size={16} /> : 'Connect'}
                       </button>
                    </div>
                    {walletError && <p className="text-red-500 text-xs mt-2">{walletError}</p>}
                    
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-blue-200 text-xs font-bold mb-2">Try Demo Addresses:</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono bg-black/40 p-1.5 rounded cursor-pointer hover:text-white" onClick={() => setNewWalletAddress('0x1111111111111111111111111111111111111111')}>
                          <span className="truncate w-48">0x1111... (Ethereum Whale)</span>
                          <span className="text-[10px] text-zinc-600">Click to copy</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono bg-black/40 p-1.5 rounded cursor-pointer hover:text-white" onClick={() => setNewWalletAddress('SolanaDemoAddress123456789')}>
                           <span className="truncate w-48">SolanaDemo... (Solana Degen)</span>
                           <span className="text-[10px] text-zinc-600">Click to copy</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connected Wallets List */}
                <div className="space-y-2">
                   <div className="flex justify-between items-center mb-1">
                     <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Connected Wallets ({connectedWallets.length})</label>
                     {connectedWallets.length > 0 && (
                       <button onClick={syncAllWallets} className="text-rh-green text-xs flex items-center gap-1 hover:underline">
                         <RefreshCw size={10} className={isConnectingWallet ? 'animate-spin' : ''} /> Sync All
                       </button>
                     )}
                   </div>
                   
                   {connectedWallets.length === 0 ? (
                     <div className="h-32 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 text-sm">
                       No wallets connected
                     </div>
                   ) : (
                     <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                       {connectedWallets.map(wallet => (
                         <div key={wallet.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                 <WalletIcon size={14} className="text-zinc-400" />
                               </div>
                               <div>
                                 <div className="text-sm font-bold text-white flex items-center gap-2">
                                   {wallet.chain}
                                 </div>
                                 <div className="text-xs text-zinc-500 font-mono truncate w-32">
                                   {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                                 </div>
                               </div>
                            </div>
                            <button 
                              onClick={() => removeWallet(wallet.id, wallet.address)}
                              className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                            >
                              <LogOut size={14} />
                            </button>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              </div>
            </div>
          )}

          {/* MODE: AI IMPORT */}
          {mode === 'ai' && !editingId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Option 1: Describe Asset</label>
                 <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="e.g. 'I hold 150 shares of AAPL on Robinhood bought at $175.'"
                  className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-rh-green h-32 resize-none transition-colors placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-4">
                 <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Option 2: Screenshot Import</label>
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className={`border-2 border-dashed border-zinc-800 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-rh-green hover:bg-zinc-900/50 group ${selectedImage ? 'border-rh-green bg-zinc-900' : ''}`}
                 >
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                   {selectedImage ? (
                     <div className="relative h-full w-full p-2">
                       <img src={selectedImage} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                       <button 
                        onClick={(e) => {e.stopPropagation(); setSelectedImage(null);}} 
                        className="absolute top-2 right-2 bg-black/80 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                       >
                         <X size={12} />
                       </button>
                     </div>
                   ) : (
                     <>
                        <Upload className="text-zinc-600 group-hover:text-rh-green mb-2 transition-colors" size={24} />
                        <span className="text-zinc-500 text-sm group-hover:text-zinc-300">Click to upload screenshot</span>
                     </>
                   )}
                 </div>
              </div>

              <div className="col-span-full flex justify-end pt-4">
                <button
                  onClick={handleAiParse}
                  disabled={isProcessing || (!aiInput && !selectedImage)}
                  className="bg-rh-green hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-all"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                  Parse & Review
                </button>
              </div>
            </div>
          )}

          {/* MODE: MANUAL / EDIT */}
          {mode === 'manual' && (
             <div className="animate-in fade-in">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-xl">{editingId ? 'Edit Position' : 'Add New Position'}</h3>
                 {editingId && <span className="text-xs text-rh-green bg-rh-green/10 px-2 py-1 rounded border border-rh-green/20">Edit Mode</span>}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Step 1: Platform */}
                  <div className="space-y-2 relative">
                     <label className="text-xs text-zinc-500 font-bold ml-1">PLATFORM</label>
                     <input 
                      value={newAsset.platform} 
                      onChange={handlePlatformChange}
                      onBlur={handlePlatformBlur}
                      placeholder="Select or type..."
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-rh-green outline-none text-white font-medium"
                     />
                     {showPlatformSuggestions && platformSuggestions.length > 0 && (
                       <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto">
                          {platformSuggestions.map((item) => (
                            <div 
                              key={item} 
                              onMouseDown={() => selectPlatform(item)}
                              className="px-4 py-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800/50 last:border-0"
                            >
                               <span className="font-bold text-white text-sm">{item}</span>
                            </div>
                          ))}
                       </div>
                     )}
                  </div>

                  {/* Step 2: Product Type */}
                  <div className="space-y-2">
                     <label className="text-xs text-zinc-500 font-bold ml-1">PRODUCT TYPE</label>
                     <select 
                      value={newAsset.productType} 
                      onChange={e => setNewAsset({...newAsset, productType: e.target.value as ProductType})}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-rh-green outline-none text-white font-medium appearance-none"
                     >
                       <option value="" disabled>Select Type</option>
                       {['Stock', 'ETF', 'Crypto', 'Derivatives', 'Commodities', 'Cash / Yield', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>

                  {/* Step 3: Asset Symbol */}
                  <div className="space-y-2 relative">
                     <label className="text-xs text-zinc-500 font-bold ml-1">ASSET SYMBOL</label>
                     <input 
                      placeholder="e.g. AAPL, BTC" 
                      value={newAsset.symbol} 
                      onChange={handleSymbolChange}
                      onBlur={handleSymbolBlur}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-rh-green outline-none text-white font-bold uppercase" 
                     />
                     {showSymbolSuggestions && symbolSuggestions.length > 0 && (
                       <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto">
                          {symbolSuggestions.map((item) => (
                            <div 
                              key={item.symbol} 
                              onMouseDown={() => selectSymbol(item)}
                              className="px-4 py-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800/50 last:border-0"
                            >
                               <div className="flex justify-between">
                                 <span className="font-bold text-white">{item.symbol}</span>
                                 <span className="text-xs text-zinc-500">{item.type}</span>
                               </div>
                               <div className="text-xs text-zinc-400">{item.name}</div>
                            </div>
                          ))}
                       </div>
                     )}
                  </div>

                  {/* Step 4: Quantity */}
                  <div className="space-y-2">
                     <label className="text-xs text-zinc-500 font-bold ml-1">QUANTITY</label>
                     <input 
                      type="number" 
                      placeholder="0.00" 
                      value={newAsset.quantity || ''} 
                      onChange={e => handleQuantityChange(Number(e.target.value))}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-rh-green outline-none text-white font-medium" 
                     />
                  </div>

                  {/* Step 5: Price / Value */}
                  <div className="space-y-2">
                     <label className="text-xs text-zinc-500 font-bold ml-1">UNIT PRICE ($)</label>
                     <div className="relative">
                       <input 
                        type="number" 
                        placeholder="0.00" 
                        value={newAsset.unitPrice || ''} 
                        onChange={e => handlePriceChange('unitPrice', Number(e.target.value))}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-rh-green outline-none text-white font-medium" 
                       />
                       {isFetchingPrice && (
                         <div className="absolute right-3 top-1/2 -translate-y-1/2">
                           <Loader2 size={16} className="animate-spin text-rh-green" />
                         </div>
                       )}
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs text-zinc-500 font-bold ml-1">TOTAL VALUE ($)</label>
                     <input 
                      type="number" 
                      placeholder="0.00" 
                      value={newAsset.totalValue || ''} 
                      onChange={e => handlePriceChange('totalValue', Number(e.target.value))}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-rh-green outline-none text-white font-medium" 
                     />
                  </div>

                  {/* Step 7: Optional APY */}
                   <div className="space-y-2">
                     <label className="text-xs text-zinc-500 font-bold ml-1">APY / YIELD (%) <span className="text-zinc-600 font-normal normal-case">(Optional)</span></label>
                     <input 
                      type="number" 
                      placeholder="e.g. 4.5" 
                      value={newAsset.expectedYieldApy || ''} 
                      onChange={e => setNewAsset({...newAsset, expectedYieldApy: Number(e.target.value)})} 
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-rh-green outline-none text-white font-medium" 
                     />
                  </div>
                   
                   <div className="col-span-full md:col-span-2 space-y-2">
                     <label className="text-xs text-zinc-500 font-bold ml-1">NOTES</label>
                     <input 
                      placeholder="Optional details..." 
                      value={newAsset.notes || ''} 
                      onChange={e => setNewAsset({...newAsset, notes: e.target.value})} 
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-rh-green outline-none text-white font-medium" 
                     />
                  </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-zinc-800">
                 <button onClick={() => { setIsAdding(false); resetForm(); }} className="px-6 py-3 text-zinc-400 hover:text-white font-bold text-sm transition-colors">Cancel</button>
                 <button 
                  onClick={handleSaveAsset} 
                  disabled={!newAsset.symbol || !newAsset.quantity}
                  className="bg-rh-green hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-3 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(0,200,5,0.2)] hover:shadow-[0_0_30px_rgba(0,200,5,0.4)] transition-all flex items-center gap-2"
                >
                   {editingId ? <Save size={18} strokeWidth={2} /> : <Check size={18} strokeWidth={3} />}
                   {editingId ? 'Update Position' : 'Confirm Position'}
                </button>
              </div>
             </div>
          )}
        </div>
      )}

      {/* Asset List */}
      <div className="space-y-1">
        <div className="grid grid-cols-12 px-4 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <div className="col-span-4">Asset</div>
          <div className="col-span-3 hidden md:block text-right">Trend (7d)</div>
          <div className="col-span-4 md:col-span-3 text-right">Price</div>
          <div className="col-span-4 md:col-span-2 text-right">Equity</div>
        </div>

        {assets.map((asset) => {
          const isPositive = (asset.change24h || 0) >= 0;
          return (
            <div key={asset.id} className="group grid grid-cols-12 items-center p-4 rounded-xl hover:bg-zinc-900 transition-colors border-b border-zinc-900 hover:border-transparent cursor-pointer">
              <div className="col-span-4">
                <div className="flex items-center gap-2">
                  <div className="font-bold text-white text-base">{asset.symbol}</div>
                  {asset.isAutoSynced && (
                    <div title="Synced from Wallet" className="bg-blue-500/20 text-blue-400 p-1 rounded-full">
                       <LinkIcon size={10} />
                    </div>
                  )}
                </div>
                <div className="text-zinc-500 text-xs mt-0.5 font-medium flex gap-2">
                   <span className="bg-zinc-800 px-1.5 rounded text-[10px] text-zinc-300">{asset.platform}</span>
                   <span>{asset.productType}</span>
                   {asset.expectedYieldApy ? <span className="text-rh-green">{asset.expectedYieldApy}% APY</span> : null}
                </div>
              </div>
              
              <div className="col-span-3 hidden md:flex justify-end pr-4 opacity-70">
                 {/* Sparkline Mock */}
                 <div className="h-8 w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={Array.from({ length: 10 }, () => ({ val: Math.random() }))}>
                      <Area type="monotone" dataKey="val" stroke={isPositive ? '#00c805' : '#ff5000'} strokeWidth={2} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="col-span-4 md:col-span-3 text-right">
                <div className="font-medium text-white text-sm">${asset.unitPrice.toLocaleString()}</div>
                <div className={`text-xs font-bold ${isPositive ? 'text-rh-green' : 'text-rh-red'}`}>
                  {isPositive ? '+' : ''}{asset.change24h?.toFixed(2)}%
                </div>
              </div>

              <div className="col-span-4 md:col-span-2 text-right relative flex justify-end items-center gap-4">
                 <div className="font-bold text-white">${asset.totalValue.toLocaleString()}</div>
                 <div className="absolute right-[-60px] top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-zinc-900 p-1 rounded-lg border border-zinc-800 shadow-xl z-20">
                   <button 
                    onClick={(e) => { e.stopPropagation(); setViewHistoryId(asset.id); }}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                    title="View Change History"
                   >
                     <Clock size={14} />
                   </button>
                   <button 
                    onClick={(e) => { e.stopPropagation(); startEditing(asset); }}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                    title="Edit Asset"
                   >
                     <Pencil size={14} />
                   </button>
                   <button 
                    onClick={(e) => { e.stopPropagation(); deleteAsset(asset.id); }}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded transition-colors"
                    title="Delete Asset"
                   >
                     <Trash2 size={14} />
                   </button>
                 </div>
              </div>
            </div>
          );
        })}

        {assets.length === 0 && !isAdding && (
           <div className="text-center py-20">
             <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
               <Plus className="text-zinc-600" size={24} />
             </div>
             <h3 className="text-zinc-300 font-bold mb-2">No Assets Yet</h3>
             <p className="text-zinc-500 text-sm max-w-xs mx-auto">Start by manually adding a position or import via AI.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
