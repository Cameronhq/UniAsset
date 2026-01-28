
import { Asset, Wallet } from "../types";

// Predefined Demo Wallets for "Accurate" Simulation
const DEMO_WALLETS: Record<string, any[]> = {
  // Ethereum Whale Demo
  '0x1111111111111111111111111111111111111111': [
    { symbol: 'ETH', price: 3250.00, qty: 150.5, tags: ['Layer 1', 'Staked'] },
    { symbol: 'USDC', price: 1.00, qty: 500000, tags: ['Stablecoin', 'Cash'] },
    { symbol: 'MKR', price: 2800.00, qty: 45, tags: ['DeFi', 'Governance'] },
    { symbol: 'AAVE', price: 115.20, qty: 300, tags: ['DeFi', 'Lending'] }
  ],
  // Solana Degen Demo
  'SolanaDemoAddress123456789': [
    { symbol: 'SOL', price: 148.50, qty: 1250, tags: ['Layer 1', 'High Speed'] },
    { symbol: 'JUP', price: 1.25, qty: 50000, tags: ['DEX', 'Aggregator'] },
    { symbol: 'BONK', price: 0.000025, qty: 100000000, tags: ['Meme', 'Solana'] }
  ],
  // Bitcoin Holder
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh': [
    { symbol: 'BTC', price: 68500.00, qty: 5.25, tags: ['Store of Value', 'Layer 1'] }
  ]
};

const MOCK_TOKENS = {
  Ethereum: [
    { symbol: 'ETH', price: 3200, tags: ['Layer 1', 'Smart Contracts'] },
    { symbol: 'USDC', price: 1.00, tags: ['Stablecoin', 'Cash Equivalent'] },
    { symbol: 'LINK', price: 18.50, tags: ['Oracle', 'Infrastructure'] },
    { symbol: 'UNI', price: 12.20, tags: ['DeFi', 'DEX'] },
    { symbol: 'PEPE', price: 0.000008, tags: ['Meme', 'Speculative'] }
  ],
  Solana: [
    { symbol: 'SOL', price: 145.00, tags: ['Layer 1', 'High Speed'] },
    { symbol: 'JUP', price: 1.20, tags: ['DeFi', 'Aggregator'] },
    { symbol: 'WIF', price: 3.50, tags: ['Meme', 'Solana Ecosystem'] },
    { symbol: 'PYTH', price: 0.45, tags: ['Oracle', 'Data'] }
  ],
  Bitcoin: [
    { symbol: 'BTC', price: 68500, tags: ['Store of Value', 'Layer 1'] }
  ],
  Polygon: [
    { symbol: 'MATIC', price: 0.85, tags: ['Layer 2', 'Scaling'] },
    { symbol: 'WETH', price: 3200, tags: ['Wrapped', 'DeFi'] }
  ]
};

/**
 * Validates a crypto address format (Simple Regex Check)
 */
export const validateAddress = (address: string): 'Ethereum' | 'Solana' | 'Bitcoin' | 'Polygon' | null => {
  if (DEMO_WALLETS[address]) {
    // Return chain based on simple heuristic of the demo key
    if (address.startsWith('0x')) return 'Ethereum';
    if (address.startsWith('bc1')) return 'Bitcoin';
    return 'Solana';
  }

  if (address.match(/^0x[a-fA-F0-9]{40}$/)) return 'Ethereum'; // Also covers Polygon
  if (address.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) return 'Solana';
  if (address.match(/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/)) return 'Bitcoin';
  return null;
};

/**
 * Simulates fetching assets from a blockchain explorer API
 */
export const fetchWalletAssets = async (wallet: Wallet): Promise<Asset[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 1. Check for Demo Wallet Match
  const demoAssets = DEMO_WALLETS[wallet.address];
  if (demoAssets) {
    return demoAssets.map((token, idx) => ({
      id: `${wallet.address}-${token.symbol}-${idx}`,
      platform: 'Wallet',
      productType: 'Crypto',
      symbol: token.symbol,
      quantity: token.qty,
      unitPrice: token.price,
      totalValue: token.qty * token.price,
      currency: 'USD',
      exposureTags: ['Crypto', ...token.tags],
      change24h: (Math.random() * 10) - 5,
      createdAt: new Date().toISOString(),
      walletAddress: wallet.address,
      isAutoSynced: true,
      notes: `${wallet.chain} Wallet Import`,
      updateHistory: []
    }));
  }

  // 2. Fallback to Random Simulation for unknown addresses
  const chainAssets = MOCK_TOKENS[wallet.chain as keyof typeof MOCK_TOKENS] || MOCK_TOKENS.Ethereum;
  const assets: Asset[] = [];

  // Deterministic "random" generation based on address char codes to make it consistent for the same address
  const seed = wallet.address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const numberOfAssets = (seed % 4) + 1; // 1 to 4 assets

  for (let i = 0; i < numberOfAssets; i++) {
    const tokenIndex = (seed + i) % chainAssets.length;
    const token = chainAssets[tokenIndex];
    
    // Generate quantity based on seed
    const quantity = (seed * (i + 1) * 0.123) % 1000;
    
    // Refine quantity for expensive assets
    const finalQty = token.price > 1000 ? quantity / 100 : quantity;
    const totalValue = finalQty * token.price;

    assets.push({
      id: `${wallet.address}-${token.symbol}`,
      platform: 'Wallet',
      productType: 'Crypto',
      symbol: token.symbol,
      quantity: parseFloat(finalQty.toFixed(4)),
      unitPrice: token.price,
      totalValue: parseFloat(totalValue.toFixed(2)),
      currency: 'USD',
      exposureTags: ['Crypto', ...token.tags],
      change24h: (seed % 10) - 5, // Random change between -5% and +5%
      createdAt: new Date().toISOString(),
      walletAddress: wallet.address,
      isAutoSynced: true,
      notes: `${wallet.chain} Wallet Import`,
      updateHistory: []
    });
  }

  return assets;
};
